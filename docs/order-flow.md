# Credo Store — Order Flow & Validation

## Implemented flow
The homepage presents the catalog as a selectable service list and an order form. The form:
1. Selects one catalog item from the typed catalog.
2. Requests a positive integer star quantity only for per-star services.
3. Collects optional nickname, User ID, Server ID, hero/role request, win-rate/win-streak request, and notes.
4. Calculates a live subtotal using the pricing engine.
5. Shows tier-progression bonus stars and testimonial eligibility without subtracting the reward.
6. Validates free-text lengths and numeric quantity before enabling the WhatsApp action.
7. Builds a prefilled WhatsApp message from the validated draft and opens the store chat using Click to Chat.

## WhatsApp behavior
- Store name and destination number are centralized in `src/config/store.ts`.
- The destination is Credo Store's configured WhatsApp number; the message is URL-encoded with `URLSearchParams`.
- The message includes the selected service, per-star quantity where applicable, supplied optional details, estimated subtotal, progression bonus, and testimonial-reward terms when eligible.
- Blank optional fields are omitted. No password or verification-code field is included.
- The link opens WhatsApp in a new tab. The customer must review the prefilled message and press Send; the website does not send it automatically.
- The website does not persist or transmit the draft to its own backend.

## Requiredness decision
Nickname, User ID, and Server ID remain optional because the product requirements have not confirmed which are mandatory. This is intentionally visible in the UI copy and isolated in validation so the policy can be changed later.

## Privacy
- No password or verification-code field exists.
- The form stores draft data only in component state.
- No backend request, database write, local storage, or analytics event is performed by this flow.
- Text limits: nickname 40, User ID 30, Server ID 20, hero/role request 120, win-rate/win-streak request 160, notes 500 characters.
- Clicking the WhatsApp link navigates to the external WhatsApp service with the order details in the URL. Treat the URL and message as customer-provided order data.

## Not yet implemented
- DP selection or split calculation; the policy is still undecided.
- Cart or multiple package quantities.
- Cross-tier price splitting and star-boundary interpretation.
- Backend order persistence or payment handling.
