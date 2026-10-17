# Nimantran — Canva-Style Digital Invitation Maker & 1,117-Item Elements Studio

## Project Overview
- **Name**: Nimantran (`webapp`)
- **Goal**: A full-featured Canva-style Digital Invitation Card & Video Story Studio tailored for Indian celebrations (Shubh Vivah, Sangeet & Haldi, Griha Pravesh, Birthday, Baby Shower, Anniversary) with a complete 14-Category, 1,117-Item Elements Library.
- **Live Preview URL**: https://3000-i2be56uxohi90io2qsfx0-2b54fc91.sandbox.novita.ai
- **GitHub Repository**: https://github.com/officialexamnotification-web/wedding

## Completed Canva Elements Library & Studio Features
1. **Canva-Inspired Elements Library (`src/components/ElementsLibraryPanel.tsx` — 1,117 Items across 14 Categories)**:
   - **Universal Search with Synonym Expansion**: Search across all 1,117 items with Hindi/English wedding synonyms (`kalash`, `ganesh`, `lotus`, `arch`, `jharokha`, `shehnai`, `rsvp`, `budget`, `3d`, etc.), Favorites starring, and Recently Used strip.
   - **Shapes (`312` static SVG files across `15` subcategories)**: Lines & Dividers (20), Rectangles & Cards (18), Basic & Polygons (32), Directional Arrows (28), Speech Bubbles (20), Clouds & Thoughts (14), Hearts & Romance (16), Stars & Sparkles (22), Bursts & Seals (16), Banners & Ribbons (24), Organic Blobs (20), Gears & Cogs (14), Mandalas & Square Stars (12), Botanical Leaves & Drops (28), Abstract & Architectural (28).
   - **Graphics (`360` static SVG files across `7` subcategories)**: Flowers & Botanicals (60), Celebration & Wedding (60), Royal Feast & Drinks (50), Bride, Groom & Guests Avatars (50), Venue, Map & Icons (50), Ornate Doodles & Flourishes (40), Royal Seals & Badges (50).
   - **Photos (`120` curated royal wedding & palace items)**: One-click insert or automatic drop into any selected Frame, Collage Grid, or Device Mockup.
   - **Videos (`40` animated motion loops)**: Gold dust shimmer, rose petal shower, Udaipur golden bokeh, spinning Surya mandala, sacred Aarti diya flame, fireworks, and temple rays with Play/Pause and speed controls.
   - **Audio (`60` WebAudio synthesized raga & percussion tracks)**: Live preview in sidebar + insertable Audio Soundtrack Badges with customizable BPM tempo and accent color.
   - **Frames (`30` SVG clipping masks)**: Royal Mughal Jharokha Arch, Udaipur Scalloped Arch, Sacred Lotus, Polaroid, Heart Locket, Postage Stamp, and Starburst Seals with Frame Zoom & Border controls.
   - **Grids (`20` multi-slot photo collages)**: 2-split, 3-trio, 4-quad, 5-bento, 6-gallery, 7-mosaic, and 9-grid Instagram layouts.
   - **Charts (`20` live data visualizations)**: Vertical Bar, Horizontal Bar, Donut, Pie, Line, Progress Rings, Area, Radar, Stacked Bar, Gauge, and Funnel charts.
   - **Forms (`20` interactive RSVP & guest poll cards)**: Live clickable RSVP counter, customizable Form Title, Button Label, and Accent Color.
   - **Sheets (`15` live formula spreadsheets)**: Supports live `=SUM(...)`, `=AVERAGE(...)`, `=MAX(...)`, `=MIN(...)` formula evaluation and `+ Row` expansion.
   - **Tables (`20` editable schedules & menus)**: Shubh Vivah 3-day itineraries, Chhappan Bhog menus, VIP seating charts, and Vedic Muhurat tables.
   - **Animations (`40` motion presets)**: Entrance, Emphasis, Motion, and Celebration presets that apply directly to the selected element or insert an animated celebratory badge.
   - **Mockups (`30` device & stationery frames)**: iPhone 16 Pro Gold, Royal Wax-Seal Envelope, Arch Print Card, Palatial Welcome Easel Standee, MacBook Pro, and iPad Guestbook.
   - **3D Objects (`30` interactive 360° models)**: 3D Sacred Kalash, Padma Lotus, Solitaire Ring, Maharaja Crown, Brass Diya, Temple Pillar, and Kohinoor Diamond with live 3D Tilt X (`pitch`), Spin Y (`yaw`), and shader color controls.

2. **Interactive Canvas Artboard, Toolbar, Preview, Video Player & High-Res Export**:
   - Full rendering, selection, dragging, 8-point resizing, 360° rotation, layer ordering, and contextual Toolbar editing for all 18 `ElementType` variants in `Canvas.tsx`, `Toolbar.tsx`, `PreviewModal.tsx`, `VideoCardModal.tsx`, and `ExportModal.tsx`.

## Tech Stack & Deployment
- **Frontend**: React 19 + TypeScript + Tailwind CSS v4 + Lucide Icons + HTML5 Canvas Export + WebAudio Synthesizer
- **Runtime**: Cloudflare Pages (`wrangler pages dev dist` managed by PM2 on port 3000)
