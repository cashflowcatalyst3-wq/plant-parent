# Plant Parent

An installable plant-watering tracker with plant photos, care streaks/history, and real push notifications.

## What's here
- `index.html`, `styles.css`, `app.js` — the app itself
- `game.js`, `game2.js` — the two mini-games (Raindrop Catch, Memory Match)
- `manifest.json`, `sw.js`, `icons/` — what makes it installable on a phone (PWA)
- `api/` — small backend functions for syncing plant data and sending push reminders
- `vercel.json` — schedules a daily check for overdue plants

## Go live in about 10 minutes

**1. Put this project on GitHub**
- Create a new repo at https://github.com/new
- Upload all the files in this folder to it (drag-and-drop works, or `git push` if you're comfortable with git)

**2. Deploy with Vercel (free)**
- Go to https://vercel.com, sign up with your GitHub account
- Click "Add New Project" → pick the repo you just created → click **Deploy**
- It'll finish deploying (the push notification pieces won't work yet — that's steps 3–4 below)

**3. Add a free database (for notifications to work)**
- On your project's page in Vercel, click the **Storage** tab
- Click **"Marketplace Database Providers"** (or **"Browse Marketplace"** / **"Connect Database"** — wording varies slightly)
- Find **Upstash** and select it → choose the **Redis** product
- Follow the prompts: create a free database, then **connect it to this project**
- Vercel automatically adds the needed environment variables for you — no copying/pasting required

**4. Add the notification keys**
- Still in your project settings, go to **Settings → Environment Variables**
- Add these two:
  - Name: `VAPID_PUBLIC_KEY` → Value: `BN4ieWQBco1u_esfncKASD5n51MKDrjGJoDafo4eJP7FwjzxIRUq-2xsJEGRoMzZ-tyipIrn8zh2Kzy1H5pukrQ`
  - Name: `VAPID_PRIVATE_KEY` → Value: `7U_oDSRBDK1RPWxCgLkwPWUXE_XBZE9Y4XGNc3VWUHQ`
- Go to the **Deployments** tab, click the **⋯** menu on the latest deployment, and choose **Redeploy** so the new variables take effect

**5. Install it on your phone**
- Open your `.vercel.app` URL in Safari (iPhone) or Chrome (Android)
- iPhone: Share icon → "Add to Home Screen"
- Android: ⋮ menu → "Install app"
- Open the installed app and tap **"🔕 Enable reminders"** at the top, then allow notifications when prompted

That's it — once enabled, the app checks once a day and sends you a real notification for any plant that's overdue for water, even if the app is closed.

## Random check-in notifications (every 5 hours)

Heads up on a real platform limit: Vercel's free plan only allows cron jobs to run **once per day** — a schedule like "every 5 hours" isn't allowed there and fails at deploy time. To get real 5-hour notifications without paying for anything, this uses a free external scheduler (cron-job.org) to call a new endpoint on that schedule instead.

**1. Add one more environment variable**
- In Vercel: **Settings → Environment Variables**
- Add: Name: `CRON_SECRET` → Value: `382cc14e3e193d325dc04096faa4f04fd2869afac4bcc459`
- Redeploy (same **⋯ → Redeploy** step as before) so it takes effect

**2. Set up the free scheduler**
- Go to https://cron-job.org and create a free account (no credit card)
- Click **Create cronjob**
- Title: anything, e.g. "Plant Parent check-in"
- URL: `https://YOUR-APP-NAME.vercel.app/api/random-notification?secret=382cc14e3e193d325dc04096faa4f04fd2869afac4bcc459`
  (replace `YOUR-APP-NAME` with your actual Vercel URL)
- Schedule: choose "Every 5 hours" (or use the custom cron expression `0 */5 * * *`)
- Save

That's it — every 5 hours, cron-job.org pings your app, which picks a random plant tip or check-in message and sends it as a real push notification to everyone who's enabled reminders.

## Plant photo identification (optional)

Snap a photo of an unlabeled plant when adding it, and get a species guess instead of typing it in. Powered by [Pl@ntNet](https://plantnet.org), a nonprofit plant identification project — genuinely free, 500 identifications/day.

**1. Get a free API key**
- Go to https://my.plantnet.org and create a free account
- Find your API key in your account dashboard

**2. Add it to Vercel**
- In Vercel: **Settings → Environment Variables**
- Add: Name: `PLANTNET_API_KEY` → Value: the key you just copied
- Redeploy so it takes effect

That's it — when adding or editing a plant, tap "🔍 Identify from a photo" next to the Species field.

This app is public, with no login — since Pl@ntNet's free tier (500/day) is shared across everyone who uses it, this feature is rate-limited per device and per network (20/device/day, 40/network/day) so no single visitor can use up the shared quota. No setup needed for this — it's automatic.

## Community leaderboard (optional)

Anyone using the app can opt in to a public leaderboard (nicknames only — no other plant data is shared) ranking longest watering streak and total plants. To also get admin controls for it (adjust or zero out someone's streak, remove entries):

**1. Add one more environment variable**
- In Vercel: **Settings → Environment Variables**
- Add: Name: `ADMIN_SECRET` → Value: pick your own private password (don't reuse the `CRON_SECRET` above)
- Redeploy so it takes effect

**2. Open the admin page**
- Go to `https://YOUR-APP-NAME.vercel.app/admin.html`
- Enter the secret you just set
- From there you can zero out or add to anyone's streak, set an exact plant count, clear an admin override so their own device's real numbers resume syncing, or remove someone from the board entirely

This page isn't linked from anywhere in the app itself — only people with the direct URL and your secret can reach it.

## What's new in this version
- **Fair-use rate limiting on plant ID**: since this app is public, the free Pl@ntNet identification quota is now protected with per-device and per-network daily limits, so no single visitor can use it all up. Automatic, no setup needed.
- **Photo-based plant identification**: tap "🔍 Identify from a photo" when adding/editing a plant to get a species guess from a real photo, powered by the free Pl@ntNet API (see setup above).
- **Two more leaderboards**: Raindrop Catch and Memory Match high scores, alongside the existing streak and plant-count boards.
- **Water all plants button**: one tap waters everything that hasn't been done yet today, skipping anything already logged.
- **Community leaderboard**: opt-in public rankings for longest streak and total plants, with unique appropriate nicknames, plus an admin page to manage entries (see above).
- **Fertilizing & rotation trackers**: each plant's detail view now has its own "Feed now" and "Rotate now" buttons with day-based reminders, separate from watering.
- **Health check-ins**: log how a plant is doing (thriving/okay/struggling/recovering) with an optional note, and see the history for that plant.
- **Weekly digest notification**: every Sunday, alongside the usual overdue check, you get one extra push summarizing the week — waterings logged, best streak, and anything overdue.
- **Seasonal care tips**: a quiet banner on your shelf with a nudge based on the time of year (Settings → Reminders → Seasonal tips to turn off).
- **Sound toggle**: Settings → Appearance → Sound effects, to mute taps/chimes/game sounds.
- **Memory Match overhaul**: now a leveled, timed game — the board gets bigger and the memorize-window shrinks each round, mismatches cost you time, and matching streaks build a score multiplier. No plant photos in this game anymore, just species icons. Your best score is saved and shown in the menu.
- **Cuttings in the Garden view**: propagations you're currently rooting now show up as a small chip list right in the Garden tab, so you don't have to dig through the menu to check on them.
- **Redesigned top logo/wordmark**: replaced the old placeholder-style header with a compact mark using the app's own icon set.
- **Next plant button**: in a plant's detail view, jump straight to the next plant on your shelf without going back to the list first. The detail view also fits small phone screens better now.

## What's new in previous versions
- **Multi-device sync**: More menu → "Sync devices" → create a 6-character code on one device, enter it on another, and both stay linked to the same plant list. No account or password needed. Uses the same free Upstash database already set up for notifications — no new setup required.
- **Random check-ins**: a rotating pool of plant tips and gentle nudges, sent every 5 hours via a free external scheduler
- **Photos**: tap the ring in a plant's detail view (or add one when creating a plant) to give it a portrait — it shows right inside the watering ring
- **Streaks & history**: every "Water now" is logged, with a streak counter for consecutive on-time waterings and a short history list
- **Push notifications**: a daily automated check sends a real phone notification for anything overdue

## Notes
- The VAPID keys above are safe to use — they're specific to this app and don't cost anything or require any account beyond what's already set up.
- Push notification support on iPhone requires iOS 16.4 or later and only works after the app is added to your home screen (not from a regular Safari tab).
- Everything here — GitHub, Vercel, Vercel KV, and web push — is free at personal-use scale.
