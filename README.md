# Nimantran — Canva-Style Digital Invitation Maker & 1,127-Item Elements Studio

## Project Overview
- **Name**: Nimantran (`webapp`)
- **Goal**: A full-featured Canva-style Digital Invitation Card & Video Story Studio tailored for Indian celebrations (Shubh Vivah, Sangeet & Haldi, Griha Pravesh, Birthday, Baby Shower, Anniversary) with a complete 14-Category, 1,127-Item Elements Library featuring 100% unique, decorative, multi-layered Canva Pro-style SVGs.
- **Live Preview URL**: https://3000-it43vhv77q6v61heqo3ed-b237eb32.sandbox.novita.ai
- **GitHub Repository**: https://github.com/officialexamnotification-web/wedding

## Completed Canva Elements Library & Studio Features
1. **Canva-Inspired Elements Library (`src/components/ElementsLibraryPanel.tsx` — 1,127 Items across 14 Categories)**:
   - **Universal Search with Synonym Expansion**: Search across all 1,127 items with Hindi/English wedding synonyms (`kalash`, `ganesh`, `lotus`, `toran`, `bandhanwar`, `arch`, `jharokha`, `shehnai`, `rsvp`, `budget`, `3d`, etc.), Favorites starring, and Recently Used strip.
   - **Shapes (`312` 100%-unique decorative SVG files across `15` subcategories)**: Lines & Dividers (20), Rectangles & Cards (18), Basic & Polygons (32), Directional Arrows (28), Speech Bubbles (20), Clouds & Thoughts (14), Hearts & Romance (16), Stars & Sparkles (22), Bursts & Seals (16), Banners & Ribbons (24), Organic Blobs (20), Gears & Cogs (14), Mandalas & Square Stars (12), Botanical Leaves & Drops (28), Abstract & Architectural (28).
   - **Graphics (`370` 100%-unique decorative SVG files across `8` collections)**:
     - Royal Wedding Torans & Bandhanwars (`10` ultra-detailed multi-layered full-width hangings)
     - Flowers & Botanicals (`60` bespoke lotus, marigold, rose, peony, mogra & vine illustrations)
     - Celebration & Wedding (`60` sacred Ganesha, Kalash, Agni Kund, Shehnai, Dhol, Palki & Gathbandhan vectors)
     - Royal Feast & Drinks (`50` Chhappan Bhog thali, Mithai, Laddoo, Kaju Katli, Chai & Sharbat illustrations)
     - Bride, Groom & Guests Avatars (`50` Rajputana Groom, Dulhan, Baraati, Pandit Ji & Royal couple portraits)
     - Venue, Map & Icons (`50` Palace pins, QR frames, WhatsApp/Location/RSVP crests & heritage badges)
     - Ornate Doodles & Flourishes (`40` Zari dividers, Jharokha corner flourishes, swirls & calligraphic borders)
     - Royal Seals & Badges (`50` Shubh Vivah wax seals, Kundan crests & celebratory stamps)
   - **Photos (`120` curated royal wedding & palace items)**: One-click insert or automatic drop into any selected Frame, Collage Grid, or Device Mockup.
   - **Videos (`40` animated motion loops)**: Gold dust shimmer, rose petal shower, Udaipur golden bokeh, spinning Surya mandala, sacred Aarti diya flame, fireworks, and temple rays with Play/Pause and speed controls.
   - **Audio (`60` WebAudio synthesized raga & percussion tracks)**: Live preview in sidebar + insertable Audio Soundtrack Badges with customizable BPM tempo and accent color.
   - **Frames (`30` bespoke SVG clipping masks & filigree borders)**: Royal Mughal Jharokha Arch, Udaipur Scalloped Arch, Sacred Lotus, Polaroid, Heart Locket, Postage Stamp, and Starburst Seals with Frame Zoom & Border controls.
   - **Grids (`20` multi-slot photo collages)**: 2-split, 3-trio, 4-quad, 5-bento, 6-gallery, 7-mosaic, and 9-grid Instagram layouts.
   - **Charts (`20` live data visualizations)**: Vertical Bar, Horizontal Bar, Donut, Pie, Line, Progress Rings, Area, Radar, Stacked Bar, Gauge, and Funnel charts.
   - **Forms (`20` interactive RSVP & guest poll cards)**: Live clickable RSVP counter, customizable Form Title, Button Label, and Accent Color.
   - **Sheets (`15` live formula spreadsheets)**: Supports live `=SUM(...)`, `=AVERAGE(...)`, `=MAX(...)`, `=MIN(...)` formula evaluation and `+ Row` expansion.
   - **Tables (`20` editable schedules & menus)**: Shubh Vivah 3-day itineraries, Chhappan Bhog menus, VIP seating charts, and Vedic Muhurat tables.
   - **Animations (`40` motion presets)**: Entrance, Emphasis, Motion, and Celebration presets that apply directly to the selected element or insert an animated celebratory badge.
   - **Mockups (`30` unique device & stationery SVG frames)**: iPhone 16 Pro Gold, Galaxy Fold, Royal Wax-Seal Envelope, Mughal Jharokha Pocket, Arch Print Card, Farmaan Scroll, Palatial Welcome Easel Standee, MacBook Pro, iMac Studio, and iPad Guestbook.
   - **3D Objects (`30` interactive 360° models across `15` unique 3D SVG geometries)**: 3D Sacred Kalash, Padma Lotus, Solitaire Ring, Maharaja Crown, Brass Diya, Temple Pillar, Kohinoor Diamond, Surya Orb, Havan Kund Cube, Meru Yantra Prism, Nakshatra Star, Rose Quartz Heart, Crystal Chandelier, Punjabi Dhol, and Golden DNA Swirl with live 3D Tilt X (`pitch`), Spin Y (`yaw`), and shader color controls.

2. **Interactive Canvas Artboard, Toolbar, Preview, Video Player & High-Res Export**:
   - Full rendering, selection, dragging, 8-point resizing, 360° rotation, layer ordering, and contextual Toolbar editing for all 18 `ElementType` variants in `Canvas.tsx`, `Toolbar.tsx`, `PreviewModal.tsx`, `VideoCardModal.tsx`, and `ExportModal.tsx`.

## Tech Stack & Deployment
- **Frontend**: React 19 + TypeScript + Tailwind CSS v4 + Lucide Icons + HTML5 Canvas Export + WebAudio Synthesizer
- **Runtime**: Cloudflare Pages (`wrangler pages dev dist` managed by PM2 on port 3000)
- **Last Updated**: 2026-10-18
