# Plant Parent

An installable plant-watering tracker. No AI, no API key, no ongoing cost — just watering rings that keep time for your plants.

## What's here
- `index.html`, `styles.css`, `app.js` — the app itself
- `manifest.json`, `sw.js`, `icons/` — what makes it installable on a phone (PWA)

## Go live for free, in about 5 minutes

**1. Put this project on GitHub**
- Create a new repo at https://github.com/new
- Upload all the files in this folder to it (drag-and-drop works, or `git push` if you're comfortable with git)

**2. Deploy with Vercel (free)**
- Go to https://vercel.com, sign up with your GitHub account
- Click "Add New Project" → pick the repo you just created
- Click Deploy — no configuration needed, no environment variables, no billing

Vercel will give you a URL like `plant-parent-yourname.vercel.app` — that's your live app.

**3. Install it on your phone**
- Open that URL in Safari (iPhone) or Chrome (Android)
- iPhone: tap the Share icon → "Add to Home Screen"
- Android: tap the ⋮ menu → "Install app" (or you'll see an automatic install prompt)

It'll now sit on your home screen with its own icon and open full-screen, no browser bar.

## What it does
- Add plants with a name, optional species, and a watering interval
- Each plant gets a ring that fills up as its next watering approaches
- Tap "Water now" to reset the clock
- Data is saved on your device (localStorage) and sticks around between visits

## Notes
- Everything here is free forever — GitHub, Vercel, and the app itself have no paid component.
- Data is stored locally per device — if you ever want it to sync across your own phone and laptop, that's a real upgrade path (needs a small free database like Supabase or Firebase). Not needed for personal single-device use.
