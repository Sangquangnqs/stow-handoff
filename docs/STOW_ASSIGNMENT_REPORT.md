# STOW Product Audit & Improvement Prototype

**Candidate:** Nguyen Quang Sang  
**Role:** Product Engineering Intern (AI-Native)  
**Audit dates:** 15-16 September 2026  
**Product:** STOW by MyStorage

---

## STOW System Evaluation: Scope, Method, and Findings

### Objective

STOW is MyStorage's AI assistant for questions about storage types, sizing, pricing, and next steps. I evaluated the live customer experience, checked factual answers against MyStorage's website and canonical [`llms.txt`](https://mystorage.vn/llms.txt), and prioritized issues that could affect customer decisions, trust, or conversion.

The audit covered:

- Pricing and booking questions.
- Tone and language handling.
- Promotion context.
- Retrieval accuracy against `llms.txt`.
- Structured-data requests and guardrails.
- Error, empty-state, mobile, and accessibility baselines.
- Safety controls and physical edge cases.

### Method

1. Used STOW as a customer with a realistic three-month moving-storage need.
2. Continued one conversation from product discovery through booking intent.
3. Cross-checked claims against MyStorage's live booking site and `llms.txt`.
4. Saved transcripts and screenshots for reproducible findings.
5. Ranked findings by customer impact, revenue risk, and trust impact.
6. Built a working prototype to replay the observed behavior and demonstrate improvements.

### Findings Summary

| ID | Finding | Severity | Primary impact |
| --- | --- | --- | --- |
| F1 | Broken Booking Funnel & Session Isolation | Critical | Conversion and revenue |
| F2 | Active Promotion Campaign Denial | High | Customer trust and campaign performance |
| F3 | Wine Cellar Technical Specification Hallucination | Medium | Accuracy for premium customers |
| F4 | Over-defensive Structured Data Refusal | Medium | Product usefulness and B2B usability |

---

### F1 - Broken Booking Funnel & Session Isolation

**Severity:** Critical

**What happened**

After the customer completed the consultation, provided contact details, selected a 5m³ self-storage unit at An Phu, and explicitly requested a deposit link, STOW stopped at a text response. It promised that a consultant would call instead of giving the customer an immediate next step. The customer then had to select the service and enter the same information again on MyStorage's booking site.

**Steps to reproduce**

1. Ask STOW for storage suitable for moving household items for approximately three months.
2. Continue until it recommends a 5m³ self-storage unit at An Phu.
3. Provide contact details and ask for a deposit-payment link to hold the unit.
4. Observe that STOW only promises a consultant callback.
5. Open MyStorage's booking site and confirm that the flow starts again from service selection.

**Why it matters**

- Repeated data entry increases abandonment at the highest-intent point of the funnel.
- Manual callback dependency increases operating cost and delays conversion.
- The customer cannot verify that the selected unit, price, or protection request reached Booking.

**Proposed fix**

Define a structured handoff contract between STOW and Booking/CRM. When booking intent is confirmed, STOW should extract the selected service, facility, size, customer details, price snapshot, and protection request into a short-lived server-side handoff token. Booking should consume that token and present a review step with pre-filled state. The prototype demonstrates the interaction with query parameters without creating a real reservation.

**Evidence**

**Before - Production STOW**

![F1 - STOW records the customer's details](screenshots/f1.png)

![F1 - The customer asks how to hold the unit](screenshots/f1_2.png)

![F1 - STOW falls back to a manual callback](screenshots/f1_3.png)

**After - Improved prototype**

![F1 - Improved response preserves the conversation context](screenshots/f1_after.png)

![F1 - Structured reservation handoff card](screenshots/f1_2_after.png)

![F1 - Simulated Booking page receives the pre-filled state](screenshots/f1_3_after.png)

---

### F2 - Active Promotion Campaign Denial

**Severity:** High

**What happened**

MyStorage's booking site displayed a 16% Mid-Autumn campaign for AutoLocker from 07/09 to 27/09. When asked whether the offer applied to a 5m³ An Phu self-storage unit or only to smart lockers, STOW denied that the campaign existed and responded with standard self-storage duration discounts instead.

**Steps to reproduce**

1. Open the active AutoLocker campaign banner on MyStorage's booking site.
2. Ask STOW whether the advertised 16% offer applies to An Phu self-storage or only AutoLocker.
3. Observe that STOW denies the campaign for both products.

**Why it matters**

- Contradicting an active website banner damages trust in both the chatbot and the campaign.
- The response misses a clear AutoLocker upsell opportunity.
- Customers may assume that the advertised offer is misleading or unavailable.

**Proposed fix**

Load active campaigns from an approved source that records product scope, location scope, validity dates, and stacking rules. The assistant should retrieve this information before answering and clearly distinguish the AutoLocker campaign from self-storage duration discounts.

**Evidence**

**Before - Production STOW**

![F2 - Active campaign context](screenshots/f2.png)

![F2 - STOW denies the campaign](screenshots/f2_2.png)

**After - Improved prototype**

![F2 - Improved response separates the AutoLocker campaign from self-storage discounts](screenshots/f2_after.png)

---

### F3 - Wine Cellar Technical Specification Hallucination

**Severity:** Medium

**What happened**

When asked in English for exact wine-storage conditions, STOW answered with approximately 15°C and 55%-65% humidity. MyStorage's canonical `llms.txt` specifies a dedicated wine-storage range of 12°C-15°C and 60%-70% humidity. The response appears to mix regular air-conditioned storage metadata with wine-cellar metadata.

**Steps to reproduce**

1. Ask for the facility, temperature, and humidity suitable for approximately 20 cases of wine.
2. Record STOW's temperature and humidity values.
3. Compare them with the dedicated wine-storage section in `llms.txt`.

**Why it matters**

- Wine collectors make decisions based on precise environmental specifications.
- Incorrect humidity guidance can undermine confidence in a premium service.
- A plausible but wrong answer is harder for customers to detect than a refusal.

**Proposed fix**

Separate retrieval records by service metadata such as `service_type=wine_storage`, prefer canonical service-specific records, and add a fixed evaluation that verifies both temperature and humidity ranges. If live availability or capacity is not available from a trusted tool, the assistant should state that it must be confirmed.

**Evidence**

**Before - Production STOW**

![F3 - Wine-storage question and initial answer](screenshots/f3.png)

![F3 - Incorrect environmental specifications](screenshots/f3_2.png)

**After - Improved prototype**

![F3 - Improved response uses the canonical wine-storage specifications](screenshots/f3_after.png)

---

### F4 - Over-defensive Structured Data Refusal

**Severity:** Medium

**What happened**

The customer requested a comparison of two public storage options as valid JSON for a personal cost spreadsheet. STOW triggered a canned refusal about not being a JSON extraction machine even though the request did not ask for private, internal, or system-prompt data.

**Steps to reproduce**

1. Ask STOW to compare An Phu self-storage and Dong Nai valet storage.
2. Request public comparison fields as valid JSON: `service_type`, `pricing_3_months`, `access_hours`, and `insurance_tiers`.
3. Ask for JSON only, without additional explanation.
4. Observe the fixed refusal.

**Why it matters**

- Keyword-based refusal reduces usefulness for technical and business customers.
- The behavior blocks a safe transformation of information already presented in the conversation.
- The canned joke does not explain a genuine safety boundary.

**Proposed fix**

Classify requests by intent and data sensitivity instead of blocking words such as `JSON` or `schema`. Public comparison data can be serialized through an allowlisted schema. Internal identifiers, credentials, hidden prompts, and unsupported fields should still be refused or omitted.

**Evidence**

**Before - Production STOW**

![F4 - Safe JSON request receives a canned refusal](screenshots/f4.png)

**After - Improved prototype**

![F4 - Improved response renders valid, copyable comparison JSON](screenshots/f4_after.png)

---

## Working Prototype

### Links

- **Live demo:** [https://mystorage-stow-nine.vercel.app/](https://mystorage-stow-nine.vercel.app/)
- **Repository:** [https://github.com/Sangquangnqs/stow-handoff](https://github.com/Sangquangnqs/stow-handoff)
- **Vietnamese technical audit:** [BAO_CAO_AUDIT_STOW_VN.md](BAO_CAO_AUDIT_STOW_VN.md)
- **English technical audit:** [AUDIT_STOW_REPORT_EN.md](AUDIT_STOW_REPORT_EN.md)

### What the prototype demonstrates

The prototype opens directly into a usable STOW-style chat interface. Audit Replay reconstructs each production scenario message by message and lets the reviewer inspect the original response, the improved response, or a large side-by-side comparison.

| Finding | Prototype behavior |
| --- | --- |
| F1 | Generates a structured reservation card and opens a simulated booking page with hydrated state |
| F2 | Separates the 16% AutoLocker campaign from 5%-15% self-storage duration discounts |
| F3 | Returns the canonical `12°C-15°C` temperature and `60%-70%` humidity ranges |
| F4 | Renders valid, copyable JSON with the requested comparison fields |

Additional implemented behavior:

- Persistent browser conversation history.
- Vietnamese and English interface support.
- Prompt-language detection independent of the selected UI locale.
- Animated transcript playback and a return-to-replay action.
- File attachment preview, speech-to-text, and direct voice submission baselines.
- Clear labelling that the booking destination is a simulation.

### How to run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and select an Audit Replay scenario. Production verification commands:

```bash
npm run lint
npm run build
npm start
```

### Technical structure

- Next.js 16, React 19, TypeScript, and Tailwind CSS 4.
- `StowHandoffPrototype`: interaction and conversation state.
- `StowChatParts`: replay, history, messages, and comparison UI.
- `stow-handoff-data`: typed transcripts, localized responses, and structured payloads.
- `SmartBookingHandoffCard`: summary card and call to action for the booking handoff.
- `/vi/book`: simulated booking page that reads the pre-filled query parameters.

### Scope and limitations

- This is a scenario-based evaluation prototype, not the live STOW model.
- The simulated booking page does not create a reservation or modify MyStorage systems.
- Price, availability, and campaign values are snapshots from the audit period, not live data.
- A production implementation should use an approved server-side handoff contract instead of exposing personal data in URL parameters.

---

## AI Output Rejected or Rewritten

### Booking handoff

**Initial AI output:** The first implementation linked directly to MyStorage's live booking site.

**Problem I identified:** The booking page did not receive the conversation context, so the proposed fix reproduced the original failure: the customer still had to start again.

**What I changed:** I replaced the direct link with a clearly labelled booking simulator that reads the transferred data and demonstrates the required review step. I kept the real Booking link visible so the prototype cannot be mistaken for a completed production integration.

### JSON export

**Initial AI output:** A generic Copy JSON button was attached to the F1 reservation card.

**Problem I identified:** The customer in F4 asked for a comparison between two storage options, not an order payload for one selected unit. The UI action was technically functional but contextually wrong.

**What I changed:** I moved JSON export into F4 and rendered an explicit code block containing `service_type`, `pricing_3_months`, `access_hours`, and `insurance_tiers`, with a Copy JSON action next to the data.

### Comparison UI and source structure

**Initial AI output:** Both versions were placed in a narrow inline chat panel, and most page behavior lived in one large component.

**Problem I identified:** Long responses became difficult to compare, the content scrolled too early, and the page component was difficult to maintain.

**What I changed:** I added explicit Before/After controls, moved side-by-side comparison into a large modal, and split the source into an orchestrator, reusable UI components, and a typed scenario-data module.

---

## With Two More Hours

With two additional hours, I would first add automated tests for the prototype's three most important flows. The first is Audit Replay: messages should appear in the correct order, no step should be skipped, and the user should be able to return to the finding list after playback. The second is language handling: English questions should receive English responses and Vietnamese questions should receive Vietnamese responses, regardless of the selected interface language. The third is the reservation handoff: the storage type, size, facility, customer details, and price breakdown should all reach the simulated Booking page correctly.

I would then validate the deployed prototype at a small set of common viewport sizes, focusing on issues that directly affect usability, such as overflowing content, clipped text, the message composer covering the conversation, or the comparison dialog extending beyond the visible area. I would also revisit the key F1-F4 states to confirm that the evidence in the report still matches the deployed version.

Finally, I would define a consistent data interface for pricing, facilities, and campaigns, including the source and last-updated time. Real-time synchronization requires an official MyStorage API or another approved data source, so I would prepare the integration boundary rather than assume an API that does not exist. Once an approved source becomes available, it could replace the audit-time snapshot without requiring the interface to be rewritten.

---

## Time Spent

**Actual total:** 12 hours

| Activity | Hours |
| --- | ---: |
| Production audit and evidence collection | 3 |
| `llms.txt` verification and finding analysis | 2 |
| Prototype design and implementation | 5 |
| Testing, refactoring, and documentation | 2 |
| **Total** | **12** |
