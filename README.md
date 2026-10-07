# Plant Parent

An installable plant-care PWA that tracks watering, feeding, rotation, and overall health for houseplants — with real push notifications, a public leaderboard, two mini-games, photo-based species identification, multi-device sync, and an admin moderation panel. Runs entirely on free-tier infrastructure with no backend server to maintain.

## What it does

- **Track every plant.** Name, species, room, photo, watering frequency, feeding schedule, rotation reminders, health check-ins, and a full watering history. Streaks count consecutive on-time waterings.
- **Real push notifications.** Actual OS-level notifications that arrive when the app is closed, using Web Push with VAPID keys, a service worker, and a scheduled daily job.
- **Photo-based species ID.** Snap a photo of an unknown plant and get a species guess, powered by the free Pl@ntNet API.
- **Garden view.** A visual scene that grows the better you keep up with care, with a spotlight card showing the plant that needs attention most.
- **Species guide.** Compact reference for 27 common houseplants with light needs, watering frequency, and difficulty rating.
- **Two mini-games.** Raindrop Catch and Memory Match, both with leaderboard integration.
- **Community wall.** Public tips from other users, with nickname sanitization and profanity filtering.
- **Leaderboard.** Four rankings (streak, plant count, Raindrop high score, Memory high score). Streak and plant count are recomputed server-side from stored plant data.
- **Multi-device sync.** A 6-character code links two devices to the same plant list, no account needed.
- **Weather-aware tips.** Uses Open-Meteo with the device's location to nudge watering based on recent rain and heat.
- **Admin panel.** Password-protected moderation tools: view every device, message or wipe specific devices, ban from the leaderboard, manually override leaderboard stats, and trigger the daily/weekly notification jobs on demand.

## Live app

Once deployed, the app is at `https://your-app-name.vercel.app/`. Open it on a phone, add it to the home screen, and it installs like a native app.

## Tech stack

**Frontend**
- Plain JavaScript, HTML, CSS — no framework, no build step
- Progressive Web App: `manifest.json` + service worker for installability and offline caching
- All app state lives in localStorage; server sync is opt-in

**Backend**
- Vercel serverless functions in `api/` — one file per endpoint
- Upstash Redis (free tier, added via Vercel marketplace) as the only database
- Web Push via `web-push` for notification delivery
- Vercel Cron for the daily overdue check
- External scheduler (cron-job.org) for 5-hour random tips, since Vercel's free tier only allows once-daily cron

**External services** (all free)
- Pl@ntNet for plant species identification (500 requests/day, rate-limited per device)
- Open-Meteo for weather data (no API key required)

**Nothing runs continuously.** Every backend piece wakes up only when a request or a cron hits it.

## Project layout
├── index.html The app shell
├── admin.html Admin panel (separate page, not linked from the app)
├── styles.css All app styling
├── app.js The entire client application
├── game.js Raindrop Catch
├── game2.js Memory Match
├── sw.js Service worker (caching + push handling)
├── manifest.json PWA manifest
├── vercel.json Cron schedule + redirects
├── package.json Backend dependencies
├── icons/ App icons (including notification badge)
├── lib/
│ ├── nickname.js Nickname sanitization + profanity blocklist + Redis keys
│ ├── rateLimit.js Simple fixed-window rate limiter
│ └── deviceAuth.js Device token hashing and verification
└── api/
├── sync.js Save a device's plant list
├── sync-pull.js Fetch another device's plants by sync code
├── subscribe.js Save a push subscription
├── unsubscribe.js Delete a push subscription
├── leaderboard.js Public leaderboard (GET / POST / DELETE)
├── leaderboard-admin.js Admin overrides for the leaderboard
├── community.js Community tips wall
├── identify.js Pl@ntNet proxy with rate limiting
├── cron-check.js Daily job: overdue notifications + Sunday digest
├── random-notification.js 5-hour tips
└── admin.js Admin panel backend

## Deployment

1. **Push to GitHub**, then import the repo at [vercel.com](https://vercel.com) and deploy. The frontend works immediately.

2. **Add Upstash Redis** via Vercel's Storage tab → Marketplace → Upstash → Redis. Vercel adds the environment variables automatically.

3. **Add environment variables** in Vercel → Settings → Environment Variables:
   - `VAPID_PUBLIC_KEY` — generate with `npx web-push generate-vapid-keys`
   - `VAPID_PRIVATE_KEY` — from the same command
   - `CRON_SECRET` — any random string (e.g. `openssl rand -hex 24`)
   - `PLANTNET_API_KEY` — free key from [my.plantnet.org](https://my.plantnet.org)
   - `ADMIN_SECRET` — pick your own password for the admin panel

   Then update the `VAPID_PUBLIC_KEY` constant at the top of `app.js` to match.

4. **Redeploy** so the new environment variables take effect.

5. **Schedule the daily check.** Either use Vercel's built-in cron (once per day, per `vercel.json`) or point an external scheduler at `https://your-app.vercel.app/api/cron-check?secret=YOUR_CRON_SECRET`. The second option is required for the 5-hour tips, which need `https://your-app.vercel.app/api/random-notification?secret=YOUR_CRON_SECRET`.

6. **Open the app on a phone** and add it to the home screen. Then open Settings and turn on push reminders.

## Admin panel

Available at `https://your-app.vercel.app/admin.html`. Requires `ADMIN_SECRET`. Not linked from anywhere in the app itself.

What you can do from there:

- See every device that has ever synced — plant counts, overdue counts, whether notifications are on
- Create test devices with sample overdue plants for testing notifications
- Send targeted pushes to a single device, or broadcast to everyone
- Wipe a device completely (plants + subscription + leaderboard entry)
- Edit any device's plant data directly (useful for testing overdue states)
- Edit or delete community posts
- Manually adjust leaderboard stats with a real "clear override" restore mechanism
- Ban or unban devices from the leaderboard
- Manually trigger the daily check and the random tip jobs

## Security notes

- **Device tokens.** Every write endpoint requires an `X-Device-Token` header that matches a per-device token stored (hashed) in Redis. Prevents anyone from writing to a device ID they don't own.
- **Server-verified leaderboard.** Streak and plant count are recomputed server-side from the device's actual stored plant data; the client can't claim fake numbers for those two.
- **Rate limiting.** `/api/identify` (shared Pl@ntNet quota) and `/api/sync-pull` (brute-force protection on 6-character codes) are both rate-limited per device and per IP.
- **XSS prevention.** User-supplied text (plant names, notes, room names, community tips, nicknames) is escaped before being inserted into the DOM.
- **Cron auth.** Both `/api/cron-check` and `/api/random-notification` require a bearer token or a matching `?secret=` query param, and fail closed if `CRON_SECRET` is unset.
- **Nickname moderation.** Nicknames are sanitized, checked against a profanity blocklist, and must be unique across the leaderboard.

## Known limitations

- **Leaderboard game scores are self-reported.** Streak and plant count are server-verified, but Raindrop and Memory scores come from the client. Preventing this would require server-side game replay, which is out of scope for this project.
- **The Pl@ntNet free tier is 500 identifications per day**, shared across everyone using the app. Rate limiting exists specifically so no single device can consume the whole quota.
- **The daily cron runs once per day on Vercel's free tier.** The 5-hour tips rely on an external scheduler as a workaround.
- **Sync codes are 6 characters**, so they're not cryptographically secure. They're meant for linking your own devices, not for public sharing.
- **`app.js` is a single file** by design — no build step means no bundler, so all client code lives in one place. This keeps deployment trivial but trades off file organization.

## Credits

Built by Aaron Shibu as a solo project. Design and features by me; implementation assisted by Claude.

Species identification powered by [Pl@ntNet](https://plantnet.org) — a free nonprofit plant-ID service run by a French research consortium.

Weather data from [Open-Meteo](https://open-meteo.com).
