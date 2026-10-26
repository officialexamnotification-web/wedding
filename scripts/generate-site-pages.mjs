import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const site = 'https://www.invitationcards.site';
const supportEmail = 'support@invitationcards.site';

const categoryPages = [
  {
    slug: 'wedding-invitations', label: 'Shubh Vivah', hindi: 'शुभ विवाह निमंत्रण',
    title: 'Wedding Invitation Templates | Nimantran Royale',
    description: 'Create a personal Indian wedding invitation with editable designs, family details, ceremony pages, venue maps and shareable card or video formats.',
    heading: 'Indian Wedding Invitation Templates',
    intro: 'Create a wedding invitation that feels personal to your families and celebration. Explore Indian-inspired designs, then customize names, ceremony details, colours and venue information in the Nimantran studio.',
    details: [
      ['A design for your celebration', 'Choose from traditional mandap, palace, floral, velvet and contemporary looks. Start with one card or build a coordinated multi-page wedding suite.'],
      ['Make the details your own', 'Edit names, dates, timings, family wording and venue details. Add Hindi or English text, decorative elements, portraits and a map QR code when you need one.'],
      ['Share in the format you prefer', 'Prepare a still invitation image or an animated video invitation. Download the result or use your device share menu to send it to guests.'],
    ],
    faqs: [
      ['Can I edit the names and ceremony details?', 'Yes. Open a design in the studio to edit its text and customize the invitation for your event.'],
      ['Can I make a multi-page wedding invitation?', 'Yes. Use a coordinated suite for separate pages such as the cover, ceremony, functions, reception and closing message.'],
      ['Can I send a wedding invitation on WhatsApp?', 'You can share an exported card image or video where your browser supports file sharing, or download the file and attach it in WhatsApp.'],
    ],
  },
  {
    slug: 'griha-pravesh-invitations', label: 'Griha Pravesh', hindi: 'गृह प्रवेश एवं वास्तु पूजा',
    title: 'Griha Pravesh Invitation Templates | Nimantran Royale',
    description: 'Design a thoughtful Griha Pravesh invitation with editable housewarming details, Vastu puja timings, address and optional map QR.',
    heading: 'Griha Pravesh Invitation Templates',
    intro: 'Invite family and friends to your new home with a warm, thoughtfully designed Griha Pravesh card. Personalize the host names, puja schedule, address and wording for your housewarming.',
    details: [
      ['Made for the housewarming occasion', 'Browse auspicious, floral and heritage-inspired styles suitable for a home entry, Vastu puja, havan or housewarming lunch.'],
      ['Keep the schedule clear', 'Add the date, puja and meal timings, host family, home name and complete address. A venue QR can help guests open directions.'],
      ['Send a digital invite', 'Export a card image or prepare an animated invitation video to share with your guests.'],
    ],
    faqs: [
      ['Can I add the Vastu puja and lunch timings?', 'Yes. Edit the invitation text and add the schedule that applies to your event.'],
      ['Can guests get directions to our home?', 'You can add a venue QR code linked to a map location, then include the address on the card as well.'],
      ['Can I write the invitation in Hindi?', 'Yes. The editor supports Hindi and English text; review the selected font and layout after editing.'],
    ],
  },
  {
    slug: 'sangeet-haldi-invitations', label: 'Sangeet & Haldi', hindi: 'संगीत, हल्दी एवं मेहंदी',
    title: 'Sangeet & Haldi Invitation Templates | Nimantran Royale',
    description: 'Create colourful Sangeet, Haldi and Mehendi invitations with editable event schedules, dress notes, venue details and digital sharing.',
    heading: 'Sangeet, Haldi & Mehendi Invitations',
    intro: 'Give every pre-wedding celebration its own character. Create a bright Haldi invite, a lively Sangeet announcement or a coordinated set for several wedding functions.',
    details: [
      ['Set the mood with colour', 'Choose marigold, jewel-tone, floral or contemporary artwork that fits the celebration and your family’s style.'],
      ['Make each function easy to follow', 'Add the event name, date, start time, venue, dress note and RSVP details. Use separate pages when functions need separate schedules.'],
      ['Share with your guests', 'Download a still card or make an animated invitation video. Add music in the editor when it suits the event.'],
    ],
    faqs: [
      ['Can I create separate Haldi and Sangeet cards?', 'Yes. Create separate designs or add pages to a suite for each function.'],
      ['Can I add music to a Sangeet invitation video?', 'You can choose available music or upload audio in the studio, then include it in the exported video where supported.'],
      ['Can I include a dress code?', 'Yes. Add a short dress note as editable text on the card.'],
    ],
  },
  {
    slug: 'birthday-invitations', label: 'Birthday Celebration', hindi: 'जन्मदिन उत्सव',
    title: 'Birthday Invitation Templates | Nimantran Royale',
    description: 'Make a personalized birthday invitation with editable age, name, date, time, venue and RSVP details. Share a card image or animated video.',
    heading: 'Birthday Invitation Templates',
    intro: 'Create a birthday invite that suits the guest of honour, from a child’s first birthday to an elegant milestone celebration. Add the practical details and share it digitally with friends and family.',
    details: [
      ['Choose a fitting style', 'Explore playful, floral, elegant and celebration-ready designs, then adjust colours and decorative details in the editor.'],
      ['Add the important information', 'Personalize the name, age, date, time, venue, RSVP and any short note for guests.'],
      ['Share your invitation', 'Send a still card image or prepare an animated video invitation for your preferred messaging app.'],
    ],
    faqs: [
      ['Can I make an invitation for a child’s birthday?', 'Yes. Choose a playful design and customize the name, age and event details.'],
      ['Can I change the wording?', 'Yes. Text on the design can be edited in the studio.'],
      ['Can I share the birthday card without a video?', 'Yes. Export or share the selected card page as an image.'],
    ],
  },
  {
    slug: 'godh-bharai-invitations', label: 'Godh Bharai', hindi: 'गोद भराई एवं नामकरण',
    title: 'Godh Bharai Invitation Templates | Nimantran Royale',
    description: 'Create a graceful Godh Bharai or Naamkaran invitation with editable family wording, event schedule, venue and personal details.',
    heading: 'Godh Bharai & Naamkaran Invitations',
    intro: 'Invite loved ones to a joyful family celebration with a graceful Godh Bharai or Naamkaran card. Personalize the wording and event details while keeping the design gentle and welcoming.',
    details: [
      ['A warm, celebratory style', 'Choose soft florals, traditional motifs or a refined pastel palette for a family gathering.'],
      ['Personalize your invitation', 'Add the family names, date, time, venue, RSVP and a short blessing or message.'],
      ['Share digitally with family', 'Create a still invitation image or an animated video for your guests.'],
    ],
    faqs: [
      ['Can I use this for a Naamkaran ceremony?', 'Yes. Customize the title and wording to suit a naming ceremony or another family celebration.'],
      ['Can I add a blessing or Sanskrit text?', 'Yes. Add or edit text in the editor and check that the font and spacing remain readable.'],
      ['Can I share the card as an image?', 'Yes. Choose the card image option in Export & Share to send a still page.'],
    ],
  },
  {
    slug: 'anniversary-invitations', label: 'Royal Anniversary', hindi: 'विवाह वर्षगांठ',
    title: 'Anniversary Invitation Templates | Nimantran Royale',
    description: 'Design an anniversary invitation for a family celebration with editable names, milestone, date, venue and reception details.',
    heading: 'Anniversary Invitation Templates',
    intro: 'Celebrate a meaningful milestone with an anniversary invitation that reflects the occasion. Personalize the names, year, event schedule and venue, then share the finished card with your guests.',
    details: [
      ['Styles for special milestones', 'Choose understated florals, classic gold details or a formal evening look for a silver, golden or other anniversary celebration.'],
      ['Make it personal', 'Add the couple’s names, milestone, date, time, venue, RSVP and a short message from the family.'],
      ['Choose how to share', 'Export a card image for a simple invitation or create an animated video version.'],
    ],
    faqs: [
      ['Can I create a Golden Jubilee invitation?', 'Yes. Add the milestone wording and choose a design that suits the celebration.'],
      ['Can family members host the invitation?', 'Yes. Edit the host or family wording on the card.'],
      ['Can I send an image instead of video?', 'Yes. Export or share the selected page as a still image.'],
    ],
  },
];

const infoPages = [
  {
    slug: 'about', title: 'About Nimantran Royale | Indian Digital Invitations',
    description: 'Learn about Nimantran Royale, a design studio for personal Indian digital invitations and celebration cards.',
    heading: 'A thoughtful way to invite', eyebrow: 'ABOUT THE STUDIO',
    content: `<p>Nimantran Royale is an online invitation design studio for weddings and family celebrations. It brings editable card layouts, Indian-inspired artwork, Hindi and English text tools, photo frames, venue details and digital export options into one place.</p>
      <h2>Designed around the occasion</h2><p>Start with a wedding suite, a Griha Pravesh card, a Sangeet or Haldi invitation, a birthday design, a Godh Bharai card or an anniversary invitation. Each design can be personalized in the browser with the details that matter to your family.</p>
      <h2>Made to personalize and share</h2><p>Use the studio to edit text, colours, images and decorative elements. Depending on the design and your device, you can export a still image, a multi-page PDF or an animated invitation video. You choose what to send and to whom.</p>
      <h2>Our approach</h2><p>We aim to make invitation design approachable while respecting the meaning and variety of Indian celebrations. Always review names, dates, venue information, translations and any religious text before sharing or printing.</p>`,
  },
  {
    slug: 'contact', title: 'Contact Nimantran Royale | Invitation Studio Support',
    description: 'Contact Nimantran Royale for help with invitation templates, editing and sharing.',
    heading: 'We’re here to help', eyebrow: 'CONTACT THE STUDIO',
    content: `<p>Need help using the invitation studio or have a question about a design? Send a note to our support team and include the page or feature you were using so we can understand the issue.</p>
      <div class="contact-card"><span class="eyebrow">EMAIL SUPPORT</span><a class="email-link" href="mailto:${supportEmail}">${supportEmail}</a><p>Please do not email passwords, payment details or private guest lists.</p></div>
      <h2>Helpful details to include</h2><ul><li>The device and browser you are using</li><li>The invitation or feature name</li><li>A short description of what happened</li><li>A screenshot, if it helps explain the issue (hide personal details first)</li></ul>
      <p class="note">For privacy or support requests, mention the page or feature and describe the issue. Please do not include passwords, payment details or private guest lists.</p>`,
  },
  {
    slug: 'privacy', title: 'Privacy Policy | Nimantran Royale',
    description: 'Learn how Nimantran Royale handles browser-saved invitation projects, uploaded content, sharing and local wording suggestions.',
    heading: 'Privacy Policy', eyebrow: 'YOUR INFORMATION',
    content: `<p><strong>Last updated: 22 October 2026.</strong> This notice describes how information is handled when you use Nimantran Royale’s invitation editor and website.</p>
      <h2>Projects saved on your device</h2><p>Saved invitation projects are stored in this browser on the device you use. Project text, design settings and media included in a saved project may be accessible to people who can use that browser profile. You can remove saved projects in the editor or clear this site’s browser storage. Keep an exported copy of work you want to retain.</p>
      <h2>Uploads and editing</h2><p>Images, audio and video you select are used by the browser-based editor to create your design and exports. Wording suggestions are assembled locally from text included with the website. Avoid adding information you do not want visible on an invitation. When you download or share an export, the destination you choose may process that file under its own terms and privacy notice.</p>
      <h2>Jyotish tools</h2><p>Birth chart, matching, numerology and gemstone calculations run in your browser. Date, time, name and selected birth coordinates are not sent to Nimantran servers or saved by these tools. If you search for a birth place or choose device location, the place query or coordinates are sent to Photon, a place-search service using OpenStreetMap data, to return a place name and coordinates. Device location is used only after you select the location button. Place lookup is subject to the provider’s terms and privacy practices. Astrology details stay temporarily in the open page and are cleared when you leave or refresh it.</p>
      <h2>Wording suggestions</h2><p>Invitation wording suggestions come from copy included with the website and are assembled in your browser from the details you enter. They are not generated by a remote AI service. Review all names, dates, translations and religious wording before use.</p>
      <h2>Website hosting and third-party services</h2><p>The website is hosted by Vercel, which may process technical request information to deliver and secure the site. The site also loads fonts from Google Fonts. If you choose a map, WhatsApp or device-share feature, your browser may contact or open that service. Those providers handle information under their own policies. The editor does not send invitations to your contacts unless you choose a sharing action.</p>
      <h2>Your choices and questions</h2><p>You can remove saved projects through the editor or clear this site’s browser storage. For privacy questions, contact <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>`,
  },
  {
    slug: 'terms', title: 'Terms of Use | Nimantran Royale',
    description: 'Review the terms for using Nimantran Royale invitation design tools, uploaded assets and exported invitation files.',
    heading: 'Terms of Use', eyebrow: 'USING THE STUDIO',
    content: `<p><strong>Last updated: 22 October 2026.</strong> By using Nimantran Royale, you agree to use the site and its design tools lawfully and responsibly.</p>
      <h2>Your designs and uploads</h2><p>You are responsible for the text, photos, music and other material you add. Make sure you own the material or have permission to use and share it. Do not use the studio to create unlawful, deceptive or harmful content.</p>
      <h2>Review before sharing or printing</h2><p>Check names, dates, times, venue links, QR codes, spelling, translations, fonts and page order before exporting. You are responsible for confirming that the finished invitation is accurate and suitable for its intended use.</p>
      <h2>Third-party services</h2><p>Some features can open or rely on third-party services such as Google Maps, Google Fonts, WhatsApp or your device’s sharing interface. Those services are governed by their own terms. Availability and behaviour may vary by device, browser and region.</p>
      <h2>Invitation wording and religious text</h2><p>Wording suggestions are selected and assembled locally from included text. They are provided as editable starting points, not as legal, translation or religious advice. Check names, dates, translations, Sanskrit or other religious text, venue links and QR codes before sharing or printing.</p>
      <h2>Digital artwork and printing</h2><p>Gold-foil, velvet and similar descriptions refer to visual design styles on screen; they do not mean that a digital export contains physical foil or fabric. Print results depend on the exported dimensions, materials and settings chosen with your print provider.</p>
      <h2>Availability and changes</h2><p>We may update, suspend or remove features as the studio evolves. We aim to keep the service useful, but cannot promise uninterrupted availability or that every export behaves identically across all devices and software.</p>
      <h2>Questions</h2><p>For questions about these terms, contact <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>`,
  },
];

const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const allPages = [
  ...infoPages.map((page) => ({ ...page, path: `/${page.slug}/`, kind: 'info' })),
  ...categoryPages.map((page) => ({ ...page, path: `/${page.slug}/`, kind: 'category' })),
];

function layout(page, main) {
  const canonical = `${site}${page.path}`;
  const description = page.description;
  const breadcrumbs = page.kind === 'category'
    ? `<a href="/">Home</a><span aria-hidden="true">/</span><a href="/#template-catalog">Collections</a><span aria-hidden="true">/</span><span>${esc(page.label)}</span>`
    : `<a href="/">Home</a><span aria-hidden="true">/</span><span>${esc(page.heading)}</span>`;
  const infoNavigation = `<header class="site-header"><div class="page-links-row"><nav class="page-links" aria-label="Home and information pages">${[['/', '← Home', 'home'], ['/about/', 'About', 'about'], ['/contact/', 'Contact', 'contact'], ['/privacy/', 'Privacy', 'privacy'], ['/terms/', 'Terms', 'terms']].map(([href, label, slug]) => `<a href="${href}"${page.slug === slug ? ' aria-current="page"' : ''}${slug === 'home' ? ' class="page-home"' : ''}>${label}</a>`).join('')}</nav></div></header>`;
  const fullSiteHeader = `<div class="announcement-bar"><span class="announcement-brand">NIMANTRAN ATELIER</span><span class="announcement-divider" aria-hidden="true">•</span><span class="announcement-copy">Bespoke Indian Digital Invitations & Multi-Slide Video Suites · High-Resolution Digital Exports</span></div><header class="site-header"><div class="header-inner"><a class="brand" href="/" aria-label="Nimantran Royale home"><span class="brand-mark">नि</span><span class="brand-copy"><span class="brand-title">NIMANTRAN <span class="royale-badge">♢ ROYALE</span></span><small>COUTURE DIGITAL INVITATIONS</small></span></a><a class="header-search" href="/#template-catalog" aria-label="Browse invitation designs"><span aria-hidden="true">⌕</span><span>Search Palace Vivah, Griha Pravesh, Sangeet, Birthday...</span></a><nav aria-label="Main navigation"><a href="/wedding-invitations/">Shubh Vivah</a><a href="/griha-pravesh-invitations/">Griha Pravesh</a><a href="/sangeet-haldi-invitations/">Sangeet & Haldi</a><a class="video-link" href="/#template-catalog"><span aria-hidden="true">▣</span> Video Suites</a><a class="nav-cta" href="/">✿ <span>Design Studio</span></a></nav></div></header>`;
  const pageHeader = page.kind === 'info' ? infoNavigation : fullSiteHeader;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description,
    url: canonical,
    isPartOf: { '@type': 'WebSite', name: 'Nimantran Royale', url: `${site}/` },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: page.kind === 'category' ? 'Collections' : 'Information', item: `${site}/#template-catalog` },
        { '@type': 'ListItem', position: 3, name: page.heading, item: canonical },
      ],
    },
  };
const pageFooter = page.kind === 'info' ? '' : `<footer class="site-footer"><div class="footer-inner"><div class="footer-main"><section class="footer-brand"><a class="brand" href="/" aria-label="Nimantran Royale home"><span class="brand-mark">नि</span><span><strong>NIMANTRAN ROYALE</strong><small>FINE INDIAN DIGITAL INVITATIONS</small></span></a><p>Celebrating the timeless grandeur of Indian hospitality. Each invitation suite blends regal palace architecture, Devanagari calligraphy, and thoughtful digital details for your family celebrations.</p><div class="footer-mantra"><strong>॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ॥</strong><span>Auspicious beginnings crafted with reverence & precision</span></div></section><div class="footer-columns"><section><h2>Collections</h2><a href="/wedding-invitations/">Royal Shubh Vivah</a><a href="/griha-pravesh-invitations/">Griha Pravesh Puja</a><a href="/sangeet-haldi-invitations/">Sangeet & Haldi</a><a href="/birthday-invitations/">Milestone Birthday</a><a href="/godh-bharai-invitations/">Godh Bharai Suite</a><a href="/anniversary-invitations/">Jubilee Anniversary</a><a href="/#template-catalog">24K Gold Foil & Velvet</a></section><section><h2>Signature Suites</h2><a href="/#template-catalog">Royal Lakeside 5-Slide Suite</a><a href="/#template-catalog">Golden Mandap 5-Slide Suite</a><a href="/#template-catalog">Interactive Video Story Player</a><a href="/#template-catalog">Rajasthani Rajwada Editions</a><a href="/#template-catalog">Vastu Shanti & Sacred Pooja</a></section><section><h2>Atelier Craft</h2><a href="/#template-catalog">Google Maps Venue QR</a><a href="/#template-catalog">Hindi & Sanskrit Shlokas</a><a href="/#template-catalog">Portrait Frame Studio</a><a href="/#template-catalog">Ceremony Itinerary</a><a href="/#template-catalog">High-Resolution Export</a><a href="/#jyotish">Vedic Astrology Studio</a></section></div></div><div class="footer-bottom"><p>© ${new Date().getFullYear()} NIMANTRAN ROYALE · Handcrafted for Indian Celebrations Worldwide</p><nav aria-label="Footer navigation"><a href="/about/">About</a><a href="/contact/">Contact</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></div></div></footer>`;
  return `<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title)}</title><meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${canonical}"><meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="theme-color" content="#10090b"><meta property="og:type" content="website">
  <meta property="og:site_name" content="Nimantran Royale"><meta property="og:title" content="${esc(page.title)}">
  <meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${site}/images/invitation_hero_1791965343981.jpg">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(page.title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Tiro+Devanagari+Hindi&display=swap" rel="stylesheet">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="stylesheet" href="/site-pages.css">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${pageHeader}
  <main id="main" class="page-shell">
    <nav class="breadcrumbs" aria-label="Breadcrumb">${breadcrumbs}</nav>
    ${main}
  </main>
${pageFooter ? `  ${pageFooter}\n` : ''}
</body></html>`;
}

function makeCategoryPage(page) {
  const main = `<article class="editorial-page">
    <header class="page-hero"><p class="eyebrow">${esc(page.label)} <span>·</span> ${esc(page.hindi)}</p><h1>${esc(page.heading)}</h1><p class="lede">${esc(page.intro)}</p><div class="hero-actions"><a class="button button-primary" href="/">Explore invitation designs <span aria-hidden="true">→</span></a><a class="button button-secondary" href="/#template-catalog">Browse collections</a></div><p class="microcopy">Personalize your design in the Nimantran studio.</p></header>
    <section class="feature-grid" aria-label="Personalize your invitation">${page.details.map(([heading, text], i) => `<article class="feature-card"><span class="feature-number">0${i + 1}</span><h2>${esc(heading)}</h2><p>${esc(text)}</p></article>`).join('')}</section>
    <section class="editorial-section"><p class="eyebrow">A SIMPLE PROCESS</p><h2>From first design to finished invitation</h2><ol class="steps"><li><strong>Choose a design</strong><span>Start with a style that suits the occasion.</span></li><li><strong>Add your details</strong><span>Edit the wording, names, schedule and venue.</span></li><li><strong>Review and share</strong><span>Check the final card, then export an image or video.</span></li></ol></section>
    <section class="editorial-section faq-section"><p class="eyebrow">HELPFUL DETAILS</p><h2>Frequently asked questions</h2>${page.faqs.map(([question, answer]) => `<details><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join('')}</section>
    <section class="closing-card"><p class="eyebrow">NIMANTRAN ROYALE</p><h2>Make an invitation that feels like yours.</h2><p>Choose a design, add the details, and share it with the people who matter.</p><a class="button button-primary" href="/">Open the design studio <span aria-hidden="true">→</span></a></section>
  </article>`;
  return layout(page, main);
}

function makeInfoPage(page) {
  const main = `<article class="editorial-page info-page"><header class="page-hero"><p class="eyebrow">${esc(page.eyebrow)}</p><h1>${esc(page.heading)}</h1><p class="lede">${esc(page.description)}</p></header><section class="prose-card">${page.content}</section>${page.slug === 'about' ? `<a class="button button-primary info-cta" href="/">Explore the design studio <span aria-hidden="true">→</span></a>` : ''}</article>`;
  return layout(page, main);
}

for (const page of allPages) {
  const outputDir = path.join(publicDir, page.slug);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'index.html'), page.kind === 'category' ? makeCategoryPage(page) : makeInfoPage(page), 'utf8');
}

const homeUrl = `${site}/`;
const sitemapEntries = [homeUrl, ...allPages.map((page) => `${site}${page.path}`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.map((url) => `  <url><loc>${url}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(path.join(publicDir, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${site}/sitemap.xml\n`, 'utf8');
fs.writeFileSync(path.join(publicDir, '404.html'), `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Page not found | Nimantran Royale</title><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/site-pages.css"></head><body><main class="not-found"><p class="eyebrow">404 · PAGE NOT FOUND</p><h1>This page could not be found.</h1><p>Return to Nimantran Royale to explore invitation designs and the design studio.</p><a class="button button-primary" href="/">Return home <span aria-hidden="true">→</span></a></main></body></html>`, 'utf8');

fs.writeFileSync(path.join(publicDir, 'site-pages.css'), `
:root{color-scheme:dark;--bg:#10090b;--panel:#171113;--panel2:#1d1516;--line:rgba(220,174,83,.22);--gold:#e4bd6d;--gold-bright:#f3d58d;--ivory:#fff7e9;--muted:#b8adb0;--muted2:#8c8184;--serif:'Cormorant Garamond',Georgia,serif;--sans:'Plus Jakarta Sans',Arial,sans-serif}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(ellipse at 50% 0%,rgba(117,57,48,.22),transparent 43%),var(--bg);color:var(--ivory);font:15px/1.7 var(--sans),Arial,sans-serif;min-height:100vh}a{color:inherit}.skip-link{position:absolute;left:-9999px;top:1rem}.skip-link:focus{left:1rem;z-index:50;background:#fff;color:#111;padding:.75rem}.announcement-bar{min-height:27px;padding:4px 16px;display:flex;align-items:center;justify-content:center;gap:10px;background:#0b080b;border-bottom:1px solid rgba(218,172,82,.1);color:#c4b9b8;font-size:9px;letter-spacing:.02em}.announcement-brand{color:#e6bc5e;font:700 10px var(--serif);letter-spacing:.12em}.announcement-divider{color:rgba(225,183,98,.5)}.site-header{position:sticky;top:0;z-index:40;background:rgba(11,8,11,.94);backdrop-filter:blur(18px);border-bottom:1px solid rgba(218,172,82,.16)}.header-inner{max-width:1280px;min-height:72px;margin:auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;gap:24px}.brand{display:flex;align-items:center;gap:13px;flex:none;text-decoration:none}.brand-mark{width:44px;height:44px;border:1px solid #bd8c37;border-radius:12px;display:grid;place-items:center;color:#f0ca70;background:linear-gradient(145deg,#2a1713,#10090b);box-shadow:inset 0 0 0 3px rgba(214,167,77,.08);font-family:'Tiro Devanagari Hindi',serif;font-size:23px;font-weight:700;line-height:1}.brand-copy{display:block}.brand-title{display:flex;align-items:center;gap:8px;color:#f3e5c7;letter-spacing:.14em;font:700 17px 'Cinzel',var(--serif);white-space:nowrap}.royale-badge{display:inline-flex;align-items:center;padding:3px 7px;border:1px solid rgba(225,183,98,.34);border-radius:999px;background:rgba(225,183,98,.08);color:#f3c94f;font:700 8px var(--sans);letter-spacing:.08em}.brand small{display:block;margin-top:2px;color:#a69b9c;font-size:9px;font-weight:600;letter-spacing:.13em}.header-search{display:flex;align-items:center;gap:10px;flex:1;max-width:370px;min-width:180px;padding:8px 14px;border:1px solid #29252a;border-radius:999px;background:rgba(23,22,24,.88);color:#857e83;text-decoration:none;white-space:nowrap;overflow:hidden;font-size:11px}.header-search span:first-child{color:#e0b64e;font-size:20px;line-height:1}.header-search span:last-child{overflow:hidden;text-overflow:ellipsis}.page-links-row{max-width:920px;min-height:58px;margin:auto;padding:10px 0;display:flex;align-items:center}.page-links{display:flex;align-items:center;gap:8px}.page-links a{padding:5px 11px;border:1px solid transparent;border-radius:999px;color:#b8adb0;text-decoration:none;font-size:11px;font-weight:600;transition:all .2s}.page-links a:hover,.page-links a[aria-current="page"]{border-color:rgba(225,183,98,.3);background:rgba(215,166,72,.09);color:#f3d58d}.page-links .page-home{margin-right:5px;color:#f3d58d;border-color:rgba(225,183,98,.22)}.site-header nav,.site-footer nav{display:flex;align-items:center;gap:clamp(12px,2vw,25px)}.site-header nav a,.site-footer nav a{font-size:12px;font-weight:600;color:#d0c8c8;text-decoration:none;white-space:nowrap;transition:color .2s}.site-header nav a:hover,.site-footer nav a:hover{color:var(--gold-bright)}.site-header nav .video-link{display:flex;align-items:center;gap:6px;color:#efc95e}.site-header nav .nav-cta{display:inline-flex;align-items:center;gap:7px;padding:10px 14px;border-radius:10px;background:linear-gradient(110deg,#e9bc42,#ffd94f);color:#18120a;box-shadow:0 5px 18px rgba(210,159,38,.2)}.page-shell{max-width:1080px;margin:auto;padding:32px 28px 88px;min-height:calc(100vh - 200px)}.breadcrumbs{max-width:920px;margin:3px auto 38px;display:flex;gap:10px;align-items:center;color:#867b7d;font-size:11px}.breadcrumbs a{color:#beaa82;text-decoration:none}.editorial-page{max-width:920px;margin:auto}.page-hero{padding:30px 0 50px;border-bottom:1px solid rgba(225,183,98,.16)}.eyebrow{margin:0 0 13px;color:var(--gold);font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase}.eyebrow span{color:#74614a;padding:0 5px}.page-hero h1,.not-found h1{max-width:850px;margin:0;color:var(--ivory);font:600 clamp(42px,7vw,76px)/.98 var(--serif);letter-spacing:-.025em}.lede{max-width:740px;margin:22px 0 0;color:#c4b9b8;font-size:16px;line-height:1.85}.hero-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}.button{display:inline-flex;align-items:center;justify-content:center;gap:14px;min-height:46px;padding:0 19px;border-radius:10px;font-size:12px;font-weight:700;text-decoration:none;transition:transform .2s,border-color .2s,filter .2s}.button:hover{transform:translateY(-1px);filter:brightness(1.08)}.button-primary{background:linear-gradient(110deg,#e8bd62,#f3d98e);color:#211509;box-shadow:0 8px 26px rgba(190,136,40,.15)}.button-secondary{border:1px solid rgba(225,183,98,.32);color:#f0d89e;background:rgba(255,255,255,.025)}.microcopy{font-size:11px;color:#82787a;margin:13px 0 0}.feature-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;padding:32px 0 12px}.feature-card{position:relative;overflow:hidden;padding:23px 21px 25px;border:1px solid var(--line);border-radius:15px;background:linear-gradient(145deg,rgba(35,24,23,.94),rgba(20,15,16,.9));min-height:195px}.feature-card:after{content:'';position:absolute;width:120px;height:120px;right:-65px;top:-65px;border:1px solid rgba(224,182,97,.16);border-radius:50%;box-shadow:0 0 0 12px rgba(224,182,97,.025),0 0 0 25px rgba(224,182,97,.02)}.feature-number{color:#b68a45;font:600 12px var(--serif);letter-spacing:.12em}.feature-card h2{margin:22px 0 9px;color:#f2dfb7;font:600 23px/1.1 var(--serif)}.feature-card p{margin:0;color:#aaa0a0;font-size:12px;line-height:1.8}.editorial-section{padding:50px 0;border-top:1px solid rgba(225,183,98,.14)}.editorial-section h2,.closing-card h2{margin:0;color:#f5e8ce;font:600 clamp(30px,4vw,42px)/1.1 var(--serif)}.steps{list-style:none;counter-reset:steps;padding:0;margin:25px 0 0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.steps li{counter-increment:steps;padding:19px;border:1px solid rgba(255,255,255,.08);border-radius:13px;background:rgba(255,255,255,.025)}.steps li:before{content:'0' counter(steps);display:block;margin-bottom:12px;color:var(--gold);font:600 13px var(--serif)}.steps strong,.steps span{display:block}.steps strong{font-size:12px;color:#f1dfbd}.steps span{margin-top:5px;font-size:11px;color:#a69c9d}.faq-section details{margin-top:10px;border:1px solid rgba(255,255,255,.09);border-radius:11px;background:rgba(255,255,255,.025)}.faq-section summary{padding:15px 17px;color:#ead8b5;font-size:13px;font-weight:600;cursor:pointer}.faq-section details p{padding:0 17px 16px;margin:0;color:#aaa0a0;font-size:12px}.closing-card{margin-top:16px;padding:34px;border:1px solid rgba(220,174,83,.3);border-radius:18px;background:radial-gradient(ellipse at 90% 5%,rgba(196,145,55,.12),transparent 40%),linear-gradient(130deg,#211315,#151012)}.closing-card h2{max-width:650px}.closing-card>p:not(.eyebrow){max-width:620px;color:#b6aaab;font-size:13px}.closing-card .button{margin-top:10px}.info-page .page-hero{padding-bottom:32px}.info-page .page-hero h1{font-size:clamp(42px,6vw,66px)}.info-page .lede{font-size:14px}.prose-card{padding:34px 38px;margin-top:24px;border:1px solid var(--line);border-radius:17px;background:linear-gradient(145deg,rgba(29,21,22,.97),rgba(18,14,15,.96));color:#c0b5b5;font-size:13px;line-height:1.9}.prose-card h2{margin:27px 0 8px;color:#f1dfbd;font:600 26px/1.2 var(--serif)}.prose-card h2:first-of-type{margin-top:20px}.prose-card p{margin:0 0 15px}.prose-card ul{padding-left:20px}.prose-card li{padding:3px 0}.prose-card a{color:var(--gold-bright)}.contact-card{margin:25px 0;padding:21px;border:1px solid rgba(225,183,98,.25);border-radius:13px;background:rgba(215,166,72,.06)}.contact-card .eyebrow{display:block;font-size:9px}.email-link{display:inline-block;margin:5px 0 8px;font:600 25px var(--serif);text-decoration:none}.contact-card p,.prose-card .note{margin:0;color:#8f8586;font-size:11px}.info-cta{margin-top:21px}.site-footer{border-top:1px solid rgba(220,174,83,.18);background:linear-gradient(180deg,#0c0809,#080607)}.footer-inner{max-width:1280px;margin:auto;padding:0 24px}.footer-main{display:grid;grid-template-columns:minmax(280px,.9fr) minmax(520px,1.4fr);gap:64px;padding:42px 0 34px}.footer-brand p{max-width:440px;margin:17px 0;color:#a69b9c;font-size:12px;line-height:1.8}.footer-mantra{display:flex;flex-direction:column;gap:4px;padding:13px 15px;border:1px solid rgba(225,183,98,.2);border-radius:14px;background:rgba(215,166,72,.045);color:#e8d4a6;font:600 13px var(--serif)}.footer-mantra span{color:#928783;font:10px var(--sans)}.footer-columns{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px}.footer-columns section{display:flex;flex-direction:column;gap:9px}.footer-columns h2{margin:0 0 2px;color:#efd483;font:700 11px var(--serif);letter-spacing:.17em;text-transform:uppercase}.footer-columns a{color:#a79d9f;font-size:11px;text-decoration:none;line-height:1.5}.footer-columns a:hover{color:#f3d58d}.footer-bottom{min-height:62px;border-top:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between;gap:20px}.footer-bottom p{margin:0;color:#817779;font-size:10px}.footer-bottom nav{display:flex;gap:22px}.footer-bottom nav a{color:#d2c7c4;text-decoration:none;font:600 10px 'Cinzel',var(--serif);letter-spacing:.1em;text-transform:uppercase}.footer-bottom nav a:hover{color:#f3d58d}.not-found{max-width:700px;margin:17vh auto;padding:32px}.not-found h1{font-size:clamp(42px,7vw,66px)}.not-found>p:not(.eyebrow){color:var(--muted);max-width:560px;margin:20px 0}.not-found .button{margin-top:10px}@media(max-width:940px){.header-inner{gap:14px;padding:0 18px}.page-links-row{padding:9px 18px}.header-search{max-width:280px}.site-header nav{gap:12px}.site-header nav a{font-size:11px}.brand-mark{width:40px;height:40px}.brand-title{font-size:15px}.brand small{font-size:8px}}@media(max-width:760px){.announcement-copy{display:none}.header-search{display:none}.header-inner{align-items:flex-start;min-height:72px;padding:12px 16px;gap:12px}.page-links-row{min-height:54px;padding:8px 16px}.page-links{gap:4px;flex-wrap:wrap}.page-links a{padding:5px 8px;font-size:10px}.site-header nav{gap:9px;flex-wrap:wrap;justify-content:flex-end}.site-header nav a{font-size:9px}.site-header nav a:nth-child(2),.site-header nav a:nth-child(3){display:none}.site-header nav .nav-cta{padding:8px 10px}.brand{gap:9px}.brand-mark{width:36px;height:36px;font-size:19px}.brand-title{font-size:13px;letter-spacing:.1em}.royale-badge{font-size:7px;padding:2px 5px}.brand small{font-size:7px;letter-spacing:.1em}.page-shell{padding:22px 18px 60px}.breadcrumbs{margin-bottom:25px}.page-hero{padding:20px 0 35px}.lede{font-size:14px}.feature-grid{grid-template-columns:1fr;padding-top:20px}.feature-card{min-height:unset}.feature-card h2{margin-top:14px}.steps{grid-template-columns:1fr}.prose-card{padding:24px 20px}.footer-inner{padding:0 18px}.footer-main{grid-template-columns:1fr;gap:28px;padding:30px 0 24px}.footer-columns{grid-template-columns:1fr 1fr;gap:20px}.footer-bottom{align-items:flex-start;flex-direction:column;justify-content:center;padding:15px 0}.footer-bottom nav{gap:16px;flex-wrap:wrap}.email-link{font-size:20px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*:before,*:after{transition:none!important}}
`, 'utf8');

console.log(`Generated ${allPages.length} crawlable information and collection pages, sitemap.xml, robots.txt and 404.html.`);
