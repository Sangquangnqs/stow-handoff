# STOW Audit Replay & Smart Booking Handoff

Working prototype for the MyStorage Product Engineering Intern assignment. It replays four production audit findings and demonstrates improved responses and booking handoff behavior side by side.

Repository: https://github.com/Sangquangnqs/stow-handoff

## What The Prototype Covers

| Finding | Production issue | Prototype improvement |
| --- | --- | --- |
| F1 | The chat loses booking context and asks the customer to start again | A structured reservation card opens a simulated booking page with pre-filled query state |
| F2 | STOW denies an active AutoLocker campaign | The improved response separates the 16% AutoLocker campaign from self-storage duration discounts |
| F3 | Wine-cellar humidity and temperature are confused with regular AC storage | The response uses the canonical `12°C-15°C` and `60%-70%` ranges from `llms.txt` |
| F4 | A safe JSON export request triggers an over-defensive refusal | A valid comparison payload is rendered in a copyable JSON block |

The first screen is the usable prototype, not a marketing page. Select an Audit Replay card to watch the original transcript appear message by message, then switch between the old and improved responses or open the large comparison modal.

## Main Features

- Animated Audit Replay for F1-F4.
- Before, after, and side-by-side comparison modes.
- Persistent local conversation history using `localStorage`.
- Vietnamese and English interface support.
- Per-message language detection so English prompts receive English responses even when the UI is Vietnamese.
- File attachment preview, browser speech-to-text, and direct voice submission.
- Smart Booking Handoff Card with masked customer information.
- Simulated booking page that reads the handoff query parameters.
- Copyable structured JSON response for F4.

## Run Locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Production verification:

```bash
npm run lint
npm run build
npm start
```

Microphone features work best in Chrome or Edge and require browser permission. Conversation history is stored only in the current browser.

## Project Structure

| Path | Responsibility |
| --- | --- |
| `src/app/page.tsx` | Route entry point |
| `src/components/StowHandoffPrototype.tsx` | Main interaction and conversation state |
| `src/components/stow/StowChatParts.tsx` | Replay, sidebar, chat, and comparison modal |
| `src/components/SmartBookingHandoffCard.tsx` | Reservation handoff card |
| `src/app/vi/book/page.tsx` | Simulated booking destination |
| `src/lib/stow-handoff-data.ts` | Types, transcripts, responses, and JSON data |
| `docs/` | Vietnamese and English audit reports |

## Data Provenance

- Canonical company and service facts: https://mystorage.vn/llms.txt
- Real booking entry point: https://booking.mystorage.vn/en/book?step=service
- Campaign, availability, and price values are audit snapshots captured from the production UI and conversations on 15-16 September 2026.
- Wine-storage specifications and protection limits are treated as canonical `llms.txt` facts.

The prototype does not call a production booking or CRM API. `/vi/book` is deliberately labelled as a simulation and exists to demonstrate state hydration without creating a fake reservation.

## Known Limitations

- Chat replies are deterministic prototype scenarios, not calls to the production STOW model.
- Pricing and campaign information are dated audit snapshots and must be revalidated before a real booking.
- The booking page demonstrates the proposed contract; it does not modify `booking.mystorage.vn` or create reservations.
- Browser speech recognition support varies by browser.
