# Nimantran — Canva-Style Digital Invitation Maker & Card Editor

## Project Overview
- **Name**: Nimantran (`webapp`)
- **Goal**: A full-featured Canva-style Digital Invitation Card & Video Story Studio tailored for Indian celebrations (Shubh Vivah, Sangeet & Haldi, Griha Pravesh, Birthday, Baby Shower, Anniversary).
- **Live Preview URL**: https://3000-ihy5ml1a7ajx7hvfa0izo-0e616f0a.sandbox.novita.ai

## Completed Canva-Level Customization Features
1. **Interactive Canvas Artboard (`src/components/Canvas.tsx`)**:
   - **8-Point Resize Handles**: 4 corner handles (`nw`, `ne`, `sw`, `se`) + 4 edge pill handles (`n`, `s`, `e`, `w`). Corner resizing on text boxes proportionally scales font size just like Canva.
   - **360° Rotation Handle**: Dedicated bottom rotation handle with live degree readout and automatic angle snapping (`0°`, `45°`, `90°`, `135°`, `180°`, `225°`, `270°`, `315°`).
   - **Smart Magnetic Alignment Guides**: Pink/magenta snap lines when aligning elements to the artboard center, safe print margins, or other elements on the canvas.
   - **Floating Quick Action Pill Bar**: Appears directly above any selected element for instant Text Edit, Photo Crop, Bring Forward, Send Backward, Duplicate, Lock/Unlock, and Delete.
   - **Keyboard Shortcuts**: `Ctrl+Z` / `Ctrl+Y` (Undo/Redo across all drags, resizes, rotations, and edits), `Ctrl+D` (Duplicate), `Delete` / `Backspace` (Delete), `Arrow Keys` (1px nudge, `Shift+Arrow` for 10px nudge).

2. **Contextual Properties Toolbar (`src/components/Toolbar.tsx`)**:
   - **Typography Controls**: 10 Indian & luxury fonts (Rozha One, Tiro Devanagari, Kalam, Cinzel, Playfair Display, Alex Brush, Great Vibes, etc.), font size stepper, color picker & royal swatches, Bold, Italic, Underline, Case converter (`UPPERCASE` / `Capitalize` / `lowercase`).
   - **Spacing & Canva Text Effects Popovers**: Letter spacing, line height, Drop Shadow, Royal Gold Glow, Text Outline Stroke, and Velvet Pill Box background.
   - **Photo Studio Controls**: Filter presets (Normal, Royal Warm, Vivid Gold, Vintage, Rose Glow, Studio HD, B&W Classic), in-frame zoom slider, 6 mask shapes (Royal Arch, Circle, Heart, Diamond, Rounded, Rectangle), and gold border thickness/color.
   - **Shape & Motif Controls**: Shape type switcher, stroke color, stroke width, fill color picker, and motif color customization.
   - **Live QR Code Editor**: Edit QR destination URL, ink color, and card background directly from the toolbar with instant regeneration.
   - **Position & Align Popover**: One-click Align to Page (`Left`, `Center`, `Right`, `Top`, `Middle`, `Bottom`), Layer Ordering (`Bring to Front`, `Bring Forward`, `Send Backward`, `Send to Back`), Flip Horizontal/Vertical, Opacity slider, Lock/Unlock, and exact `W`, `H`, `Rotate°` inputs.

3. **Canva Left Studio Dock & Expandable Drawer (`src/components/Sidebar.tsx`)**:
   - **Templates Tab**: Multi-page Royal Wedding, Griha Pravesh, Haldi/Sangeet, Birthday & Anniversary templates.
   - **Elements Tab**: Canva Shapes, Frames & Borders (Royal Corner Frame, Double Ornate Border, Diamond Divider Line, Jharokha Arch Frame, Royal Seal Medallion, Event Pill Banner, Gold Card Box, Sacred Circle Ring) + searchable Indian SVG Motifs (Lord Ganesha, Manglik Kalash, Om, Swastik, Dhol, Shehnai, Lotus, Mandap).
   - **Text & AI Copy Tab**: Quick heading/calligraphy/body presets, traditional Sanskrit Shlokas, and AI Wedding Copywriter.
   - **Uploads & Photos Tab**: Upload custom photos from device (`FileReader` data URLs) with session gallery, paste image URL, or pick from royal stock photos.
   - **Bg / Paper Tab**: Custom solid color picker, custom full-card background image upload, and curated velvet/parchment gradients.
   - **Layers Tab**: Full Canva layer stack manager with Bring Up, Send Down, Lock/Unlock, Show/Hide (`Eye`/`EyeOff`), Duplicate, and Delete per layer.
   - **QR Code Tab**: Google Maps venue QR, WhatsApp RSVP QR, and Website link QR generator.
   - **Slides Tab & Bottom Filmstrip (`src/components/SlideFilmstrip.tsx`)**: Multi-page slide management (Add, Duplicate, Reorder, Delete) and 5-slide Animated Video Story Player with Web Audio API Shehnai synthesizer.

4. **High-Resolution Export & Print (`src/components/ExportModal.tsx`)**:
   - 2x Retina PNG & JPG download for any selected page (accurately rendering backgrounds, text shadows/strokes, SVG stickers, shapes/frames, QR codes, and masked photos).
   - Multi-page PDF print/save for the entire card sequence.
   - Direct WhatsApp invitation message sharing.

## Tech Stack & Deployment
- **Frontend**: React 19 + TypeScript + Tailwind CSS v4 + Lucide Icons + HTML5 Canvas Export + QRCode
- **Runtime**: Cloudflare Pages (`wrangler pages dev dist` managed by PM2 on port 3000)
