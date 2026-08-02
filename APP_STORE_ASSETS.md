# BillBot — App Store Assets Guide

## Table of Contents

1. [Screenshot Requirements](#screenshot-requirements)
2. [Recommended Screenshots (Priority Order)](#recommended-screenshots)
3. [Screen-by-Screen Staging Guide](#screen-by-screen-staging-guide)
4. [App Store Metadata](#app-store-metadata)
5. [Tips & Best Practices](#tips--best-practices)

---

## Screenshot Requirements

Apple allows up to **10 screenshots per device size**. The first 3 are the most critical — they show directly in App Store search results without the user tapping your listing.

| Device                      | Size                  | Status                                |
| --------------------------- | --------------------- | ------------------------------------- |
| iPhone 16 Pro Max           | 6.9" (1320 × 2868 px) | **Required**                          |
| iPhone 14 Plus / 13 Pro Max | 6.5" (1284 × 2778 px) | Required                              |
| iPhone 8 Plus               | 5.5" (1242 × 2208 px) | Optional (Apple will scale from 6.5") |
| iPad Pro 13"                | —                     | Not needed (`supportsTablet: false`)  |

> **Tip:** Take screenshots on the **6.9" simulator** first. Apple will use them for the 6.5" slot automatically if they're close enough, but it's better to capture both.

---

## Recommended Screenshots

Take these in priority order. The first 3 define your first impression in search results.

| #   | Screen                              | Why                                                               |
| --- | ----------------------------------- | ----------------------------------------------------------------- |
| 1   | **Home Dashboard**                  | Shows the full value at a glance — balance, groups, quick actions |
| 2   | **Pool / Tab Detail**               | Core feature: live balances, member split, expenses in one view   |
| 3   | **Add Expense (with receipt scan)** | The AI receipt-parsing differentiator — instantly grabs attention |
| 4   | **Groups Screen**                   | Social proof — shows multi-group, multi-member use cases          |
| 5   | **Settle Up Flow**                  | Closes the loop — users can see the full lifecycle                |
| 6   | **Settlement Detail**               | Confirms/disputes payment — shows the trust layer                 |
| 7   | **Activity Feed**                   | Shows real-time updates across all groups                         |
| 8   | **Notifications**                   | Reinforces the real-time, always-informed feel                    |
| 9   | **Upcoming Expenses**               | Surfaces the recurring expense feature                            |
| 10  | **Profile / Dark Mode**             | Optional — demonstrates dark mode support and polish              |

---

## Screen-by-Screen Staging Guide

### Screenshot 1 — Home Dashboard

**Route:** `Tabs → Home`

**What to stage:**

- User name set to something friendly (e.g. "Alex Johnson")
- **Balances section:** show at least 2 currencies, one positive, one owed — e.g. "You are owed $124.50" in USD and "You owe ₦8,200" in NGN
- **Groups section:** 3–4 groups with distinct emoji icons (e.g. 🏠 Apartment, ✈️ Bali Trip, 🍕 Friday Crew)
- **Upcoming Expenses:** 1–2 recurring items visible (e.g. "Netflix · Due in 3 days")
- **Recent Activity:** 2–3 activity items showing variety (expense added, settlement confirmed)
- Notification badge showing `2` unread

**Caption idea:** _"Your finances, at a glance. See balances, groups, and activity the moment you open the app."_

---

### Screenshot 2 — Pool / Tab Detail

**Route:** `Group → Pool`

**What to stage:**

- Pool name: "Apartment Expenses" or "Bali Trip"
- **Balance card:** Total pool amount ($1,240), Amount collected ($920), clean progress feel
- **Member Summary:** 3 members with distinct owed/owes amounts — one green (overpaid), one red (owes), one settled
- **Settle Up button** visible and prominent
- **Expenses list:** 4–5 expenses (Groceries, Rent, Electricity, Gas) with amounts and member icons
- Split type: "Equal"

**Caption idea:** _"Track every expense in a shared tab. See exactly who paid what and who owes who — no spreadsheets needed."_

---

### Screenshot 3 — Add Expense with Receipt Scan

**Route:** `NewExpenseHome → NewExpense`

**What to stage:**

- A receipt image already picked and parsed (show the preview thumbnail)
- Fields auto-filled: Description "Dinner at The Place", Amount "$84.50", Category "Food & Drink"
- Date set to today
- Members split section visible showing 3 members with equal split amounts ($28.17 each)
- Parsing complete (not the loading spinner)

**Caption idea:** _"Snap a receipt. BillBot reads it and fills in the details for you."_

> **Note:** This is your strongest differentiator. Make the receipt thumbnail look real — use an actual grocery or restaurant receipt photo if possible.

---

### Screenshot 4 — Groups Screen

**Route:** `Tabs → Groups`

**What to stage:**

- 4–5 groups with varied emoji icons and names
  - 🏠 "Apartment" — 4 members
  - ✈️ "Bali Trip 2025" — 6 members
  - 🍕 "Friday Crew" — 3 members
  - 💪 "Gym Squad" — 2 members
- Each group card showing member count and a recent activity hint
- "New Group" button visible in header

**Caption idea:** _"Organize your people. Create groups for every part of your life — roommates, trips, dinners, and more."_

---

### Screenshot 5 — Settle Up Flow (Step 1 or Record Payment)

**Route:** `SettleUpHome` or `RecordPayment`

**What to stage (SettleUpHome):**

- Step 1 visible with group already selected ("Apartment")
- Step indicator showing progress (Step 1 → Step 2 dots)
- Clean, minimal bottom sheet look

**Or stage RecordPayment:**

- Settlement amount pre-filled
- Payer/Receiver clearly visible with avatars
- Payment method and note fields shown

**Caption idea:** _"Settling up is three taps. No awkward reminders — just a clean record everyone can see."_

---

### Screenshot 6 — Settlement Detail

**Route:** `Settlement`

**What to stage:**

- Status: "Pending Confirmation" (yellow badge) or "Confirmed" (green badge)
- Amount: a real-looking number like "$42.00"
- Payer and receiver shown with initials/avatars
- Confirm and Dispute buttons visible (for the pending state)
- Timestamp and payment method visible

**Caption idea:** _"Every payment is on record. Confirm, dispute, or reference settlements any time."_

---

### Screenshot 7 — Activity Feed

**Route:** `Tabs → Activity`

**What to stage:**

- Mix of activity types across 2–3 groups:
  - "Alex added Groceries · $38.00 · Apartment"
  - "You settled $60.00 with Jordan · Bali Trip"
  - "Sam joined Bali Trip"
  - "Rent was added · $450.00 · Apartment"
- Today and Yesterday sections visible
- At least 6 items to fill the screen

**Caption idea:** _"Never miss a move. See every expense, join, and settlement across all your groups in real time."_

---

### Screenshot 8 — Notifications

**Route:** `Notifications`

**What to stage:**

- Today section: 2–3 notifications
  - "Jordan submitted a settlement · $60.00 — Tap to confirm"
  - "New expense added: Electricity · $95.00"
- Yesterday section: 1–2 notifications
  - "You were invited to Bali Trip 2025"
- Mix of read (dimmer) and unread (bold/highlighted) items
- Mark all read button visible

**Caption idea:** _"Stay in the loop. Get notified when expenses are added, payments submitted, and settlements confirmed."_

---

### Screenshot 9 — Upcoming Expenses

**Route:** `UpcomingExpenses`

**What to stage:**

- 3–4 recurring expenses listed:
  - "Netflix · $15.99 · Due tomorrow"
  - "Rent · $1,200 · Due in 5 days"
  - "Spotify · $9.99 · Due in 12 days"
- Due date chips in different colors (urgent = red/orange, soon = yellow, fine = green)
- Amounts and group/pool labels visible

**Caption idea:** _"Never forget a recurring bill. BillBot surfaces upcoming shared expenses before they're overdue."_

---

### Screenshot 10 — Profile / Dark Mode (Optional)

**Route:** `Tabs → Profile`

**What to stage:**

- Dark mode enabled
- Avatar/initials, name, email shown in the hero
- Preferences section showing the Notifications row and Dark Mode toggle (on)
- "Member since [month year]" badge visible
- Clean, polished look showing the app's design quality

**Caption idea:** _"Made for night owls too. Full dark mode, notification controls, and currency preferences — all in one place."_

---

## App Store Metadata

### App Name

```
BillBot
```

### Subtitle (30 characters max)

```
Split Bills. Settle Up. Done.
```

### Promotional Text (170 characters — not indexed, can be updated anytime)

```
BillBot just got smarter. Scan any receipt and we'll fill in the expense details automatically. Try it on your next group dinner.
```

### Description (4,000 characters max)

```
BillBot makes shared expenses simple — whether you're splitting rent with roommates, tracking costs on a group trip, or managing a dinner tab with friends.

ORGANIZE BY GROUP & TAB
Create groups for every part of your life. Inside each group, open a Tab for any shared expense — a trip, a monthly bill split, a one-off dinner. Everything stays neatly separated.

SCAN RECEIPTS INSTANTLY
Point your camera at any receipt and BillBot reads the total, date, and description for you. Log an expense in seconds, not minutes.

ALWAYS KNOW WHO OWES WHAT
Every Tab shows a live balance view — how much was collected, how much each person owes, and a per-member breakdown. No mental math, no spreadsheets.

SETTLE UP IN THREE TAPS
When it's time to pay, submit a settlement directly in the app. The other person gets a notification, reviews it, and confirms — or disputes it with a reason. The full history stays on record forever.

STAY IN SYNC IN REAL TIME
Push notifications keep everyone up to date: new expenses, settlement requests, confirmations, and group invites all arrive the moment they happen. Deep links take you directly to the relevant screen.

FLEXIBLE SPLIT OPTIONS
Split equally or by amount. BillBot handles the math automatically and shows each person's share on every expense.

TRACK UPCOMING BILLS
Recurring expenses show up in your Upcoming list so you always know what's coming before it's due.

BUILT FOR REAL LIFE
• Dark mode support
• Multi-currency
• Activity feed across all groups
• Manage member roles (admin vs. member)
• Webhook integrations for power users
• Google and Apple Sign-In

BillBot is free to download. No subscription required.
```

### Keywords (100 characters max — comma-separated, no spaces after commas)

```
bill split,expense tracker,shared expenses,settle up,group bills,money manager,roommate,trip cost
```

> **Note:** Don't repeat words already in your app name or subtitle — Apple's algorithm already indexes those. Focus keywords on how people search: "split bill with friends", "shared expense app", "roommate money tracker".

### Support URL

Use your support email as the URL base or create a simple landing page.

### Privacy Policy URL

Already implemented at `PrivacyPolicyScreen` — make sure it's hosted publicly before submission.

---

## Tips & Best Practices

### Use the iOS Simulator for clean screenshots

```bash
# Open the correct simulator
open -a Simulator
# Choose iPhone 16 Pro Max from Device menu

# Take a screenshot (saves to Desktop)
xcrun simctl io booted screenshot ~/Desktop/screenshot-01.png
```

### Stage realistic data

- Use real-sounding names: "Alex", "Jordan", "Sam", "Maya" (avoid "Test User", "User 1")
- Use real-looking amounts: $38.50, $124.00, $84.75 (not $1.00 or $999.99)
- Use real category names: Groceries, Rent, Utilities, Transport, Dining

### Capture both light and dark mode

Take every screenshot in light mode first. Then re-capture screenshots 1–3 in dark mode for a second set — Apple lets you upload separate sets per appearance and it signals quality.

### Hide the status bar distractions

In the simulator, set the status bar to a clean state:

- Time: 9:41 AM (Apple's canonical time)
- Battery: 100%
- Signal: Full

```bash
xcrun simctl status_bar booted override --time "9:41" --batteryState charged --batteryLevel 100 --wifiBars 3 --cellularBars 4
```

### Add caption frames (optional but recommended)

Tools like [AppMockUp](https://app-mockup.com), [Rottenwood](https://rottenwood.com), or Sketch/Figma device frames can wrap your screenshots in a device bezel with a caption overlay. This is standard practice for top-ranked apps and significantly increases conversion.

### Screenshot order matters

Apple shows screenshots 1–3 in search results (portrait apps show 1 at full width, 2–3 partially). Put your most visually distinct and value-communicating screens first.

### App Review checklist before submitting

- [ ] All screenshots use real-looking data (no placeholder text)
- [ ] No debug toasts or error banners visible
- [ ] Status bar is clean (9:41, full battery, full signal)
- [ ] Privacy Policy URL is live and accessible
- [ ] Support URL is live
- [ ] Keywords don't repeat app name or subtitle
- [ ] `onesignal-expo-plugin` mode set to `"production"` in `app.json`
- [ ] `EXPO_PUBLIC_ONESIGNAL_APP_ID` set in EAS production environment
