const fs = require('fs/promises');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://myneta.info/LokSabha2024/candidate.php?candidate_id=';
const OUTPUT_PATH = path.join(process.cwd(), 'scraped_candidates.json');
const REQUEST_DELAY_MS = 1500;
const START_ID = 1;
const END_ID = 10;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeWhitespace(value) {
  return (value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeHtml(html) {
  return normalizeWhitespace(
    cheerio.load(`<div id="__decode">${html || ''}</div>`)('#__decode').text()
  );
}

function parseIndianMoney(value) {
  const text = normalizeWhitespace(value);
  if (!text || /^nil$/i.test(text) || /^none$/i.test(text) || /^na$/i.test(text)) {
    return 0;
  }

  const rsMatch = text.match(/Rs\s*([\d,]+)/i);
  if (rsMatch) {
    return Number.parseInt(rsMatch[1].replace(/,/g, ''), 10);
  }

  const numberMatch = text.match(/([\d,]+)/);
  if (numberMatch) {
    return Number.parseInt(numberMatch[1].replace(/,/g, ''), 10);
  }

  return 0;
}

function extractAssetsOrLiabilities($, label) {
  let found = null;

  $('tr').each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length < 2) return;

    const firstCellText = normalizeWhitespace($(cells[0]).text());
    if (new RegExp(`^${label}:?$`, 'i').test(firstCellText)) {
      found = parseIndianMoney($(cells[1]).text());
    }
  });

  return found ?? 0;
}

function extractConstituencyAndState($) {
  const headingText = normalizeWhitespace(
    $('h5')
      .map((_, el) => $(el).text())
      .get()
      .find((text) => text.includes('(') && text.includes(')')) || ''
  );

  const match = headingText.match(/^(.*?)\s*\((.*)\)$/);
  if (!match) {
    return { constituency: null, state: null };
  }

  const constituency = normalizeWhitespace(match[1]).replace(/\s+\([A-Z]{1,3}\)$/i, '').trim();
  const state = normalizeWhitespace(match[2]).replace(/^[A-Z]{1,3}\)\s*\(/i, '').trim();

  return { constituency, state };
}

function extractProfileField($, label) {
  let value = null;
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  $('b').each((_, el) => {
    if (value) return;

    const boldText = normalizeWhitespace($(el).text());
    if (!new RegExp(`^${escapedLabel}:?$`, 'i').test(boldText)) {
      return;
    }

    let textAfterLabel = '';
    let sibling = el.nextSibling;

    while (sibling) {
      const siblingText = sibling.type === 'text'
        ? normalizeWhitespace(sibling.nodeValue || '')
        : normalizeWhitespace($(sibling).text());

      if (siblingText) {
        textAfterLabel += `${textAfterLabel ? ' ' : ''}${siblingText}`;
      }

      if (sibling.name === 'br') {
        break;
      }

      sibling = sibling.nextSibling;
    }

    if (textAfterLabel) {
      value = textAfterLabel;
      return;
    }

    const parentText = normalizeWhitespace($(el).parent().text());
    const fallbackMatch = parentText.match(new RegExp(`${escapedLabel}\s*:?\s*(.+)`, 'i'));
    value = fallbackMatch ? normalizeWhitespace(fallbackMatch[1]) : null;
  });

  return value;
}

function extractEducation($) {
  const panel = $('h3')
    .filter((_, el) => /educational details/i.test(normalizeWhitespace($(el).text())))
    .first()
    .closest('div');

  const rawText = normalizeWhitespace(panel.text());
  if (!rawText) return null;

  return rawText.replace(/^Educational Details\s*/i, '').trim() || null;
}

// ---- Criminal case helpers -------------------------------------------------

// Finds the heading element (h3/h5/b, whatever it renders as) matching a regex,
// and returns the nearest following table.
function findTableAfterHeading($, headingRegex) {
  let table = null;

  $('h3, h5, b').each((_, el) => {
    if (table) return;
    const text = normalizeWhitespace($(el).text());
    if (headingRegex.test(text)) {
      // Look for the next table in document order after this heading.
      const container = $(el).closest('div');
      let candidate = container.nextAll('div.w3-responsive').first().find('table').first();

      if (!candidate.length) {
        // Fallback: search forward through siblings for any table.
        candidate = container.nextAll().find('table').first();
      }

      if (candidate.length) {
        table = candidate;
      }
    }
  });

  return table;
}

// Extracts the "Brief Details of IPC / BNS" bullet list, e.g.
// "1 charges related to Punishment for Rioting (IPC Section-147)"
// Anchors on the text boundary between the "Brief Details of IPC / BNS" heading
// and the "Cases where Pending" heading, then splits on the repeating
// "N charges related to ..." pattern. This is more robust than a single strict
// regex, since whitespace normalization can vary how each entry is separated.
function extractBriefChargeDescriptions($) {
  const bodyText = normalizeWhitespace($('body').text());

  const boundaryMatch = bodyText.match(/Brief Details of IPC\s*\/\s*BNS([^]*?)Cases where Pending/i);
  if (!boundaryMatch) return [];

  const segment = boundaryMatch[1];

  const parts = segment
    .split(/(?=\d+\s+charges? related to)/i)
    .map((s) => normalizeWhitespace(s))
    .filter((s) => s.length > 0 && /charges? related to/i.test(s));

  return parts;
}

// Parses a pending/convicted cases table into structured row objects.
// Column layout differs slightly between Pending and Convicted tables, so we
// pass a `status` flag to pick the right column mapping.
function extractCaseRows($, table, status) {
  if (!table || !table.length) return [];

  const tableText = normalizeWhitespace(table.text());
  if (/no cases/i.test(tableText)) return [];

  const rows = table.find('tr').toArray();
  if (rows.length <= 1) return [];

  const dataRows = rows.slice(1); // skip header row
  const cases = [];

  dataRows.forEach((row) => {
    const cells = $(row).find('td').map((_, td) => normalizeWhitespace($(td).text())).get();
    if (!cells.length || !cells[0]) return;
    if (/no cases/i.test(cells.join(' '))) return;

    if (status === 'pending') {
      // Serial | FIR No | Case No | Court | IPC Sections | Other Acts | Charges Framed | Date | Appeal Filed | Appeal Status
      cases.push({
        status: 'pending',
        serialNo: cells[0] || null,
        firNumber: cells[1] || null,
        caseNumber: cells[2] || null,
        court: cells[3] || null,
        ipcSections: cells[4] || null,
        otherActs: cells[5] || null,
        chargesFramed: /^y/i.test(cells[6] || '') ,
        dateChargesFramed: cells[7] || null,
        appealFiled: /^y/i.test(cells[8] || ''),
        appealStatus: cells[9] || null,
      });
    } else {
      // Serial | Case No | Court | IPC Sections | Other Acts | Punishment | Date Convicted | Appeal Filed | Appeal Status
      cases.push({
        status: 'convicted',
        serialNo: cells[0] || null,
        caseNumber: cells[1] || null,
        court: cells[2] || null,
        ipcSections: cells[3] || null,
        otherActs: cells[4] || null,
        punishmentImposed: cells[5] || null,
        dateConvicted: cells[6] || null,
        appealFiled: /^y/i.test(cells[7] || ''),
        appealStatus: cells[8] || null,
      });
    }
  });

  return cases;
}

function extractCriminalCases($) {
  const pendingTable = findTableAfterHeading($, /cases where pending/i);
  const convictedTable = findTableAfterHeading($, /cases where convicted/i);

  const pendingCases = extractCaseRows($, pendingTable, 'pending');
  const convictedCases = extractCaseRows($, convictedTable, 'convicted');
  const briefChargeDescriptions = extractBriefChargeDescriptions($);

  return {
    criminalCasesPending: pendingCases.length,
    criminalCasesConvicted: convictedCases.length,
    briefChargeDescriptions, // e.g. ["1 charges related to Punishment for Rioting (IPC Section-147)", ...]
    pendingCaseDetails: pendingCases,
    convictedCaseDetails: convictedCases,
  };
}

// ---- Financial trajectory helpers ------------------------------------------

// Extracts the "Other Elections" panel: prior declarations across years, e.g.
// Madhya Pradesh 2023 -> Rs 39 Cr, Madhya Pradesh 2018 -> Rs 15 Cr, etc.
// This gives a 3+ point wealth trajectory instead of just two affidavits.
function extractAssetTrajectory($) {
  const heading = $('*')
    .filter((_, el) => normalizeWhitespace($(el).text()) === 'Other Elections' && $(el).children().length === 0)
    .first();

  let container = heading.length ? heading.closest('div') : null;

  // Fallback: search for a table/list containing "Declared Assets" near the top profile block
  if (!container || !container.length) {
    container = $('div')
      .filter((_, el) => /declared\s+assets/i.test(normalizeWhitespace($(el).text())))
      .first();
  }

  if (!container || !container.length) return [];

  const blockText = normalizeWhitespace(container.text());

  // Pattern: "<State> <Year> Rs<amount> ~<lacs/crore>+"
  const entries = [...blockText.matchAll(/([A-Za-z ]+?)\s+(20\d{2})\s*Rs\s*([\d,]+)/g)];

  return entries.map((m) => {
    // The first captured entry often has table-header boilerplate glued onto the
    // front of the state name (e.g. "Other Elections Declaration inDeclared
    // AssetsDeclared Cases Madhya Pradesh"). Strip everything up through the last
    // occurrence of "Declared Cases" so only the real state name remains.
    const rawState = normalizeWhitespace(m[1]);
    const cleanedState = rawState.replace(/^.*Declared Cases\s*/i, '').trim();

    return {
      state: cleanedState || rawState,
      year: Number.parseInt(m[2], 10),
      declaredAssets: Number.parseInt(m[3].replace(/,/g, ''), 10),
    };
  });
}

// Extracts the candidate's profile photo. A whole-page scan that just excludes
// "logo"-looking images is unreliable — it can grab ad banners, tracking
// pixels, or other unrelated images that appear earlier in the DOM. Instead,
// we scope the search to the profile header area: the container that holds
// the candidate's name heading (h2), since the photo sits right alongside it
// on MyNeta's layout. We fall back to a filtered whole-page scan only if that
// fails.
function extractPhotoUrl($, pageUrl) {
  const EXCLUDE_HINTS = /logo|adr|myneta|national.?election.?watch|favicon|banner|advert|sponsor/i;
  const PHOTO_PATH_HINT = /images_candidate/i;

  const resolve = (src) => {
    if (!src) return null;
    try {
      return new URL(src, pageUrl).toString();
    } catch {
      return src;
    }
  };

  const getImgSrc = (el) => (
    $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-original') || ''
  );

  // Attempt 1 (most reliable): MyNeta serves candidate photos from a
  // predictable path — /images_candidate/LokSabha2024/<hash>.jpg — so match
  // that directly across every <img> on the page, checking src and common
  // lazy-load attributes (data-src / data-original).
  let photoSrc = null;
  $('img').each((_, el) => {
    if (photoSrc) return;
    const src = getImgSrc(el);
    if (src && PHOTO_PATH_HINT.test(src)) {
      photoSrc = src;
    }
  });
  if (photoSrc) return resolve(photoSrc);

  // Attempt 2: look for an <img> inside the same container as the name <h2>,
  // walking up a few ancestor levels.
  const nameHeading = $('h2').first();
  if (nameHeading.length) {
    let scope = nameHeading;
    for (let level = 0; level < 4; level += 1) {
      scope = scope.parent();
      if (!scope.length) break;

      const candidateImg = scope
        .find('img')
        .filter((_, el) => {
          const src = getImgSrc(el);
          const alt = $(el).attr('alt') || '';
          return src && !EXCLUDE_HINTS.test(src) && !EXCLUDE_HINTS.test(alt);
        })
        .first();

      if (candidateImg.length) {
        return resolve(getImgSrc(candidateImg));
      }
    }
  }

  // Attempt 3: fallback — first non-excluded image anywhere on the page.
  let fallback = null;
  $('img').each((_, el) => {
    if (fallback) return;
    const src = getImgSrc(el);
    const alt = $(el).attr('alt') || '';
    if (!src || EXCLUDE_HINTS.test(src) || EXCLUDE_HINTS.test(alt)) return;
    fallback = src;
  });

  return resolve(fallback);
}

function extractLatestIncomeFromTable($, relationType) {
  const row = $('#income_tax tr')
    .toArray()
    .find((tr) => {
      const firstCell = normalizeWhitespace($(tr).find('td').first().text()).toLowerCase();
      return firstCell === relationType.toLowerCase();
    });

  if (!row) {
    return relationType.toLowerCase() === 'spouse' ? null : 0;
  }

  const cells = $(row).find('td');
  const incomeCellHtml = $(cells[3]).html() || $(cells[3]).text() || '';
  const incomeText = decodeHtml(incomeCellHtml);
  return parseIndianMoney(incomeText);
}

function findTotalsRowByLabel($, $table, rowLabelRegex) {
  const row = $table
    .find('tr')
    .toArray()
    .find((tr) => rowLabelRegex.test(normalizeWhitespace($(tr).find('td').slice(0, 2).text())));

  return row ? $(row) : null;
}

function extractAssetTotals($, tableId, rowLabelRegex) {
  const table = $(`#${tableId}`);
  if (!table.length) {
    return { self: 0, spouse: 0 };
  }

  const row = findTotalsRowByLabel($, table, rowLabelRegex);
  if (!row || !row.length) {
    return { self: 0, spouse: 0 };
  }

  const cells = row.find('td');
  return {
    self: parseIndianMoney($(cells[2]).text()),
    spouse: parseIndianMoney($(cells[3]).text()),
  };
}

function extractName($) {
  const heading = $('h2').first().clone();
  heading.find('font').remove();
  const name = normalizeWhitespace(heading.text());
  return name || null;
}

function isPageEmpty($) {
  const title = normalizeWhitespace($('title').text());
  const bodyText = normalizeWhitespace($('body').text());
  return !title && !bodyText;
}

function parseCandidatePage(candidateId, html, pageUrl) {
  const $ = cheerio.load(html);
  if (isPageEmpty($)) {
    return null;
  }

  const { constituency, state } = extractConstituencyAndState($);
  const movableTotals = extractAssetTotals($, 'movable_assets', /Totals \(Calculated as Sum of Values\)/i);
  const immovableTotals = extractAssetTotals($, 'immovable_assets', /Totals Calculated/i);
  const criminal = extractCriminalCases($);
  const assetTrajectory = extractAssetTrajectory($);
  const photoUrl = extractPhotoUrl($, pageUrl);

  return {
    candidateId,
    name: extractName($),
    photoUrl,
    constituency,
    state,
    party: extractProfileField($, 'Party'),
    age: Number.parseInt(extractProfileField($, 'Age') || '0', 10) || 0,

    // Criminal history — summary + full detail
    criminalCasesPending: criminal.criminalCasesPending,
    criminalCasesConvicted: criminal.criminalCasesConvicted,
    briefChargeDescriptions: criminal.briefChargeDescriptions,
    pendingCaseDetails: criminal.pendingCaseDetails,
    convictedCaseDetails: criminal.convictedCaseDetails,

    // Financial snapshot (latest affidavit)
    totalAssets: extractAssetsOrLiabilities($, 'Assets'),
    totalLiabilities: extractAssetsOrLiabilities($, 'Liabilities'),
    selfIncomeLatest: extractLatestIncomeFromTable($, 'self'),
    spouseIncomeLatest: extractLatestIncomeFromTable($, 'spouse'),
    movableAssetsSelf: movableTotals.self,
    movableAssetsSpouse: movableTotals.spouse,
    immovableAssetsSelf: immovableTotals.self,
    immovableAssetsSpouse: immovableTotals.spouse,

    // Multi-year trajectory (from "Other Elections" panel) — e.g.
    // [{state, year: 2013, declaredAssets}, {state, year: 2018, ...}, {state, year: 2023, ...}]
    assetTrajectory,

    education: extractEducation($),
    profession: extractProfileField($, 'Self Profession'),
  };
}

async function fetchCandidate(candidateId) {
  const url = `${BASE_URL}${candidateId}`;
  const response = await axios.get(url, {
    timeout: 30000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml',
    },
  });

  if (!response.data || !String(response.data).trim()) {
    throw new Error('Empty response body');
  }

  return parseCandidatePage(candidateId, String(response.data), url);
}

async function loadCandidateIds() {
  const winnerIdsPath = path.join(process.cwd(), 'winner_candidate_ids.json');

  try {
    const raw = await fs.readFile(winnerIdsPath, 'utf8');
    const parsed = JSON.parse(raw);
    const ids = parsed.map((c) => c.candidateId).filter((id) => Number.isInteger(id));
    if (ids.length) {
      console.log(`Loaded ${ids.length} candidate IDs from winner_candidate_ids.json`);
      return ids;
    }
  } catch (error) {
    console.warn(
      `[WARN] Could not read winner_candidate_ids.json (${error.message}). ` +
      `Falling back to scraping the numeric range ${START_ID}..${END_ID}. ` +
      `Run collect-winner-ids.js first to scrape only real winners instead of ` +
      `guessing across the full ID space.`
    );
  }

  const range = [];
  for (let id = START_ID; id <= END_ID; id += 1) range.push(id);
  return range;
}

async function main() {
  const candidateIds = await loadCandidateIds();
  const results = [];

  for (let i = 0; i < candidateIds.length; i += 1) {
    const candidateId = candidateIds[i];
    try {
      const candidate = await fetchCandidate(candidateId);

      if (!candidate) {
        console.warn(`[WARN] candidate_id=${candidateId} returned an empty or unparseable page. Skipping.`);
      } else {
        results.push(candidate);
        console.log(`[OK] (${i + 1}/${candidateIds.length}) candidate_id=${candidateId} — ${candidate.name}`);
      }
    } catch (error) {
      console.warn(`[WARN] Failed to scrape candidate_id=${candidateId}: ${error.message}`);
    }

    if (i < candidateIds.length - 1) {
      await sleep(REQUEST_DELAY_MS);
    }
  }

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(results, null, 2), 'utf8');
  console.log(`Saved ${results.length} candidate records to ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error('[FATAL] Scraper crashed:', error);
  process.exit(1);
});

// Verification notes:
// - If any extracted field looks wrong, first inspect the live Myneta page for that candidate.
// - criminalCasesPending/Convicted counts now come from actually counting parsed case ROWS,
//   not just a heading search — more robust, and pendingCaseDetails/convictedCaseDetails give
//   you the full row data (FIR no, court, IPC sections, charges framed, dates) for a detailed
//   case page like MyNeta's own.
// - assetTrajectory pulls the "Other Elections" panel (multi-year declared assets across prior
//   affidavits) — this is what gives you a 3+ point wealth trajectory instead of just two points.
//   Regex-based extraction; verify it matches correctly since this panel's exact markup wasn't
//   directly inspected — if it comes back empty, paste me the raw HTML around "Other Elections"
//   for that candidate and I'll adjust the parser.
// - The income, movable assets, and immovable assets sections use observed table ids
//   (#income_tax, #movable_assets, #immovable_assets); verify these if Myneta changes markup.