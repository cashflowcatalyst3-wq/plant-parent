# Plant Parent

An installable plant-watering tracker with plant photos, care streaks/history, and real push notifications.

## What's here
- `index.html`, `styles.css`, `app.js` — the app itself
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

## What's new in this version
- **Random check-ins**: a rotating pool of plant tips and gentle nudges, sent every 5 hours via a free external scheduler

## What's new in previous versions
- **Photos**: tap the ring in a plant's detail view (or add one when creating a plant) to give it a portrait — it shows right inside the watering ring
- **Streaks & history**: every "Water now" is logged, with a streak counter for consecutive on-time waterings and a short history list
- **Push notifications**: a daily automated check sends a real phone notification for anything overdue

## Notes
- The VAPID keys above are safe to use — they're specific to this app and don't cost anything or require any account beyond what's already set up.
- Push notification support on iPhone requires iOS 16.4 or later and only works after the app is added to your home screen (not from a regular Safari tab).
- Everything here — GitHub, Vercel, Vercel KV, and web push — is free at personal-use scale.
