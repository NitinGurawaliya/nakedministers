const fs = require('fs/promises');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// This scrapes MyNeta's "winner_analyzed" summary pages to collect winning
// candidate_ids, so the main scraper only visits real winner profile pages
// instead of guessing across the full ~9000 ID space (85% of which are
// losing candidates, irrelevant to this app).
//
// Pagination pattern confirmed: &page=N (page=1 is implicit/omitted on the
// base URL). ~28 total pages exist (543 winners / ~20 per page). Currently
// capped to the first 10 pages — bump PAGE_COUNT to 28 once you're ready to
// pull the full winner list.

const BASE_URL = 'https://myneta.info/LokSabha2024/index.php?action=summary&subAction=winner_analyzed&sort=candidate';
const OUTPUT_PATH = path.join(process.cwd(), 'winner_candidate_ids.json');
const PAGE_COUNT = 10; // set to 28 for the full winner list
const REQUEST_DELAY_MS = 1000;

function normalizeWhitespace(value) {
  return (value || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pageUrl(pageNum) {
  return pageNum <= 1 ? `${BASE_URL}#summary` : `${BASE_URL}&page=${pageNum}#summary`;
}

async function fetchPage(url) {
  const { data: html } = await axios.get(url, {
    timeout: 30000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    },
  });
  return cheerio.load(html);
}

function extractCandidateLinks($, idSet, candidates) {
  $('a[href*="candidate.php?candidate_id="]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const match = href.match(/candidate_id=(\d+)/);
    if (!match) return;

    const candidateId = Number.parseInt(match[1], 10);
    if (idSet.has(candidateId)) return; // dedupe (name + party often both link to the same candidate)

    idSet.add(candidateId);
    candidates.push({
      candidateId,
      listedName: normalizeWhitespace($(el).text()) || null,
    });
  });
}

async function fetchWinnerIds() {
  const idSet = new Set();
  const candidates = [];

  for (let pageNum = 1; pageNum <= PAGE_COUNT; pageNum += 1) {
    const url = pageUrl(pageNum);
    console.log(`Fetching page ${pageNum}/${PAGE_COUNT}: ${url}`);

    const $ = await fetchPage(url);

    const beforeCount = idSet.size;
    extractCandidateLinks($, idSet, candidates);
    const newOnThisPage = idSet.size - beforeCount;
    console.log(`  -> found ${newOnThisPage} new candidate(s), total so far: ${idSet.size}`);

    if (newOnThisPage === 0) {
      console.log('  -> no new candidates found, stopping early (likely past the last real page).');
      break;
    }

    if (pageNum < PAGE_COUNT) {
      await sleep(REQUEST_DELAY_MS);
    }
  }

  return candidates;
}

async function main() {
  console.log(`Fetching winner list, ${PAGE_COUNT} page(s)...`);
  const candidates = await fetchWinnerIds();

  console.log(`\nFound ${candidates.length} unique winner candidate_ids total.`);

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(candidates, null, 2), 'utf8');
  console.log(`Saved ${candidates.length} candidate IDs to ${OUTPUT_PATH}`);
  console.log('Next step: run scrape-myneta-candidates.js — it will automatically use this file.');
  console.log(`(To get all ~543 winners, change PAGE_COUNT to 28 and re-run.)`);
}

main().catch((error) => {
  console.error('[FATAL] Failed to fetch winner list:', error);
  process.exit(1);
});