# Naked Ministers — MP/MLA Financial Accountability Tracker

A public transparency tool that tracks Indian MPs' and MLAs' declared income, assets, and criminal cases across election cycles — sourced entirely from sworn Election Commission affidavits — and turns the numbers into shareable, verifiable content.

**Core principle:** every data point on this platform is something the politician themselves swore to and filed publicly. No family member details, no children's locations, no unverified claims. This is what keeps the project defensible, legally safe, and credible when challenged.

---

## 1. Why this exists

Existing tools like myneta.info hold the raw data but present it as static, one-affidavit-at-a-time pages. Nobody is computing the *trend* — how much a politician's declared wealth grew relative to their declared income, across terms. That comparison is the actual story, and it doesn't exist anywhere in an easily shareable format. This project closes that gap.

---

## 2. Data sources

| Source | What it gives us | Notes |
|---|---|---|
| myneta.info | Parsed, structured affidavit data (income, assets, liabilities, criminal cases) | Primary source for MVP — plain HTML tables, scrapable with axios + cheerio |
| ECI affidavit archive (affidavitarchive.nic.in) | Original sworn affidavits | Scanned PDFs, harder to parse — use only to verify disputed numbers, not for bulk scraping |
| ADR (Association for Democratic Reforms) | Bulk datasets, sometimes released as CSV | Check for a bulk download before building a full scraper — could save significant time |

---

## 3. Data schema

**Politician**
- id, name, constituency, state, party, photo_url

**Affidavit** (one row per politician per election cycle)
- id, politician_id, election_year
- self_income, spouse_income
- movable_assets_self, immovable_assets_self
- movable_assets_spouse, immovable_assets_spouse
- liabilities_total
- criminal_cases_pending, criminal_cases_convicted, case_types
- education, profession, age
- source_url (link to the actual affidavit — non-negotiable, every number must trace back)

**Computed at query time (not stored — formula may change early on):**
- net_worth = (movable + immovable) − liabilities
- net_worth_growth_abs = net_worth(latest) − net_worth(previous)
- net_worth_growth_pct
- growth_multiple = net_worth_growth_abs ÷ self_income (the core "viral number")
- criminal_case_delta = cases_pending(latest) − cases_pending(previous)

---

## 4. Build phases

### Phase 1 — Scrape
- Build scraper for myneta.info candidate pages (axios + cheerio, no headless browser needed)
- Start scope: Lok Sabha 2024 MPs (~543 candidates)
- Pull 2+ election cycles per MP — this unlocks all growth metrics, which are the actual differentiator
- Output to staging JSON first, manually spot-check ~20-30 entries against real affidavits before touching the DB

### Phase 2 — Store
- Postgres + Prisma (matches existing stack)
- Seed DB from verified staging JSON
- Nightly/on-demand job to recompute derived fields

### Phase 3 — UI (MVP)
- Search page (name / constituency autocomplete)
- Politician detail page: hero stat, income-vs-growth comparison, criminal case history, source link
- Ship this before building anything else — get real data in front of real users first

### Phase 4 — Virality layer (post-MVP)
- **Clip Mode**: vertical 9:16 stripped-down view of just the hero stat + comparison, built for screen recording. Auto-generated caption text creators can copy-paste.
- **Leaderboards**: "Top 10 Wealth Gainers," "Most Cases Filed" — rotate by state/party/term, recurring content format
- **Trending strip** on homepage: top movers this week, keeps the site feeling alive
- **Share/export**: pre-rendered image or short video export, not just a link

### Phase 5 — Trust layer
- "Flag an error" button on every card → correction form. Affidavit parsing has real error rates; this protects credibility and gives you a defensible response when disputed.
- Methodology page, linked from every card footer: states data source, defines every computed metric precisely, states explicitly that the platform does not editorialize beyond the arithmetic and does not reference family members.

### Phase 6 — Expand scope
- Port schema to MLAs (MyNeta has separate URL namespaces per state assembly — schema doesn't need to change)

---

## 5. App flow (end to end)

1. User lands on homepage → sees Trending strip + search bar
2. Search or click a trending name → lands on Politician Card
3. Card shows: hero stat → identity strip → 2-cycle comparison → auto-generated math sentence → criminal case ticker → source footer
4. Creator toggles Clip Mode → gets a screen-record-ready vertical layout + copy-paste caption
5. Creator posts on Instagram/wherever, with site link in bio or caption
6. Viewers land back on homepage → search their own MP → loop continues
7. Leaderboards give repeat visitors a reason to return without a specific politician in mind

---

## 6. Non-negotiable scope boundary

This project tracks **elected officials' own sworn financial and criminal disclosures only.** It will never include:
- Names, photos, universities, cities, or any identifying/locating detail about politicians' children or other family members beyond what they themselves filed (e.g., spouse's own declared assets, which spouses do file independently)
- Unverified claims not traceable to a sourced affidavit
- Content framed as allegation rather than disclosed fact

Every feature added later should be checked against this boundary before being built.

---

## 7. Tech stack

- Frontend: Next.js
- Backend: Node.js
- DB: Postgres + Prisma
- Scraping: axios + cheerio
- Hosting: (TBD — Vercel + Neon/Supabase is the fastest path given existing familiarity)
