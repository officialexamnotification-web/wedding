<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/1ca7bb0e-a77c-464e-86c7-7fefd2d9c6df

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Card Studio integration

The existing NIMANTRAN homepage remains at `/`. The added template editor, its full artwork and media library, and Vedic astrology studio are available from the **Card Studio** navigation link or directly at `/card-studio/`. Astrology opens at `/card-studio/jyotish-studio`.

The original feature source is preserved in `backned tempale card and features/`. Its runtime source, static assets, catalog/admin API handlers, and setup notes are also integrated into the main project. Admin catalog persistence and media uploads require the server-side credentials and Vercel Blob store configuration described in [ADMIN_SETUP.md](docs/card-studio/ADMIN_SETUP.md); the public editor and bundled templates work without those secrets.
