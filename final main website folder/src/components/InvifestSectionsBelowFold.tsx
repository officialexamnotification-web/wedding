import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Plus,
  Copy,
  CheckCircle2,
  X,
} from 'lucide-react';
import { InviteTheme } from '../data/studioData';

interface InvifestSectionsBelowFoldProps {
  themes: InviteTheme[];
  groomName: string;
  brideName: string;
  onLaunchPreview: (theme: InviteTheme) => void;
  onSelectThemePage: (theme: InviteTheme) => void;
  onOpenCustomizer: (theme: InviteTheme) => void;
}

const WHAT_WE_MAKE_ITEMS = [
  {
    num: '01',
    tag: 'Core',
    title: 'Invitation websites',
    headline: 'One link for the whole wedding',
    originalPrice: '₹499–₹2,000',
    body: 'Pick a design from our collection and we make it yours: your names, your story, every function with its timing and a map, what to wear, and an RSVP that reaches you.',
    cta: 'Browse templates',
    actionType: 'scroll-templates' as const,
  },
  {
    num: '02',
    tag: 'Included Free',
    title: 'Parivar Links',
    headline: 'Your guest list, in one place',
    originalPrice: '₹999',
    body: 'Your own family dashboard next to your invite. Send haldi and mehndi to close family, the reception to everyone, and see every reply — who is coming, how many, what they eat — in one calm list.',
    cta: 'Try Parivar Guest Links',
    actionType: 'open-aangan' as const,
  },
  {
    num: '03',
    tag: 'Bespoke',
    title: 'Custom design',
    headline: 'Drawn from scratch',
    originalPrice: '₹2,000',
    body: 'Have a place, a painting, or a story none of our templates tell? Customise every single ritual, portrait, music track, and greeting right in our live studio.',
    cta: 'Open Live Customizer',
    actionType: 'open-customizer' as const,
  },
  {
    num: '04',
    tag: 'Extras',
    title: 'Add-ons',
    headline: 'A film, a PDF and more',
    originalPrice: '₹599',
    body: 'Little things that match your website: a save-the-date for early messages, a print-ready PDF for the elders, or a second language edition in Hindi & English.',
    cta: 'Explore Single-Card Pieces',
    actionType: 'open-single-page' as const,
  },
];

const REINVENTED_FEATURES = [
  {
    title: 'Every Function, One Link',
    desc: 'Haldi to reception, each with its time, venue and a map, on one link you send on WhatsApp — 100% Free.',
    badge: '📅',
    accent: '#fdf2f2',
  },
  {
    title: 'Easy for Nani',
    desc: 'If she can use WhatsApp, she can open it in Hindi or English, and read it without squinting or installing any app.',
    badge: '🪷',
    accent: '#fdf8ee',
  },
  {
    title: 'Pre-Wedding Highlight',
    desc: 'Showcase your pre-wedding shoot, silk-thread love story timeline, and couple portraits like never before.',
    badge: '📸',
    accent: '#f3f6fc',
  },
  {
    title: 'Unlimited Free Revisions',
    desc: 'Usually 2 rounds of changes — here you get instant, unlimited live edits to names, dates, venues and photos for ₹0.',
    badge: '✍️',
    accent: '#f3faf5',
  },
  {
    title: 'Handmade for You',
    desc: 'Every invite is customised by hand for your family with 17+ real 3D gates, wax seals, and unique particle physics.',
    badge: '✨',
    accent: '#fbf4f9',
  },
  {
    title: 'Private Event Pages (Parivar Links)',
    desc: 'Different guests, different events, with Parivar Links so each relative sees only their invited functions.',
    badge: '🔐',
    accent: '#f5f4fb',
  },
];

const COMPARISON_ROWS = [
  {
    label: 'Price for Your Family',
    badge: '💰',
    values: ['₹15,000+ printing & courier', '₹1,500 – ₹3,500 per video', '₹499–₹2,000 → FREE (₹0 Forever)'],
  },
  {
    label: 'Who sees what',
    badge: '🔐',
    values: ['Same card for all', 'Same video for all', 'Only their functions (Parivar Links)'],
  },
  {
    label: 'Made for you',
    badge: '🎨',
    values: ['Limited stock paper', 'Hard to edit', 'By hand + Live Customizer'],
  },
  {
    label: 'Interactivity',
    badge: '🚪',
    values: ['Static paper', 'View-only MP4', '3D Gate, Map, RSVP, Music'],
  },
  {
    label: 'Changes & Updates',
    badge: '🔄',
    values: ['Reprint everything', 'Re-render & re-send', 'Same link updates live'],
  },
];

const GOOGLE_REVIEWS = [
  {
    name: 'Aarav & Niharika Deshmukh',
    quote:
      'When the Antarpat Mangalam silk curtain dropped on our relatives’ phones with mogra petals, both our grandmothers called us smiling with tears of joy.',
  },
  {
    name: 'Siddharth & Kavya Malhotra',
    quote:
      'Rajwada Aagman felt like opening a royal Udaipur courtyard right inside WhatsApp. Even our elders read the Hindi invitation effortlessly.',
  },
  {
    name: 'Zoya & Armaan Siddiqui',
    quote:
      'Noor-e-Charbagh with its rising sky lanterns and scratch-off Nikah date had every guest replying before dinner.',
  },
  {
    name: 'Harpreet & Simranjeet Gill',
    quote:
      'Amrit Anand captured our Anand Karaj rituals so respectfully. Parivar Links let us share Jaggo with close family and Reception with colleagues from one link.',
  },
  {
    name: 'Prashant & Divya Iyer',
    quote:
      'NIMANTRAN made Kanchi Kalyanam feel truly ours—our muhurtham timings, temple map pin, and WhatsApp headcount worked without a single glitch.',
  },
  {
    name: 'Rohan & Sneha Kulkarni',
    quote:
      'Having Devasthan Kovil and scratch-card wedding dates completely free with zero watermarks saved our family weeks of back-and-forth printing.',
  },
];

const BLOG_POSTS = [
  {
    slug: 'indian-wedding-invitation-wording-guide',
    category: 'Wording & Etiquette',
    readingMinutes: 5,
    title: 'What to Write in an Indian Wedding Invitation (With Family & Couple Examples)',
    excerpt:
      'From grandparents’ blessings and Shloka invocations to modern couple-hosted wording for Hindu, Muslim, Sikh, and Christian celebrations.',
    content: [
      'A memorable Indian wedding invitation balances warmth, respect for elders, and clarity for travelling guests. Begin with your sacred invocation — whether Shri Ganeshaya Namah, Bismillah, Ek Onkar, or a joyful scripture verse.',
      'When listing hosts, include grandparents and parents on both sides so every branch of the family feels honoured. With Parivar Links, you can even decide which ceremonies each household sees first.',
      'Finally, keep each function card crisp: mention the date, muhurat time, venue with Google Maps pin, and a gentle dress-code palette so guests know whether to wear haldi yellow, woven silk, or black-tie ethnic.',
    ],
  },
  {
    slug: 'whatsapp-wedding-invitation-etiquette',
    category: 'Sharing on WhatsApp',
    readingMinutes: 4,
    title: 'How to Send Your Wedding Website Link on WhatsApp So Every Guest Opens It',
    excerpt:
      'Why one interactive link beats a 40MB PDF or 5 separate JPEGs — plus ready-to-copy WhatsApp messages for elders, friends, and colleagues.',
    content: [
      'Multi-page PDFs often fail to download on slower mobile connections, and static videos cannot be tapped for Google Maps directions or RSVPs.',
      'When you share an interactive invitation website link on WhatsApp, pair it with a warm 2-line personal note. Guests simply tap the link, touch the 3D haveli gate or wax seal, and hear the shehnai.',
      'Use Parivar Household Links to send Haldi + Mehndi + Wedding to close family while sending the Wedding + Reception link to office colleagues — all from one place.',
    ],
  },
  {
    slug: 'multi-day-wedding-functions-guide',
    category: 'Planning & Rites',
    readingMinutes: 6,
    title: 'Planning Your Haldi, Mehndi, Sangeet & Pheras Timeline Without Guest Confusion',
    excerpt:
      'How an interactive itinerary, attire colour swatches, and live WhatsApp RSVP keep 300+ guests in the right courtyard at the right hour.',
    content: [
      'Multi-day Indian weddings move fast: a morning Haldi by the pool, a twilight Sangeet, and an auspicious Goraj Muhurat Pheras the next evening.',
      'By giving each function its own illustrated card, attire palette, and one-tap Google Maps button on your invitation website, guests never have to scroll back through old WhatsApp chats.',
      'And if a timing shifts by 30 minutes, you update it once and the same link reflects the new time immediately for everyone.',
    ],
  },
];

const FAQ_ITEMS: [string, string][] = [
  [
    'Are all 31+ NIMANTRAN templates really 100% Free (₹0) right now?',
    'Yes! Every single template — from our simple & birthday designs (<s>₹499–₹899</s>) and mid-tier floral suites (<s>₹949–₹1,499</s>) up to our flagship 3D royal editions Antarpat Mangalam (<s>₹2,000</s>) & Rajwada Aagman (<s>₹1,999</s>) — has its price crossed out and is 100% FREE (₹0) forever with no watermark.',
  ],
  [
    'Do I need any software or design skills?',
    'Not at all. Pick any design, click Customise or type your names right on the page, and your interactive link updates live. Your guests need nothing either: one tap on the link on WhatsApp and it opens.',
  ],
  [
    'What exactly do I get with each template?',
    'Your own interactive invitation website: 3D opening gate or wax-seal envelope, your story, every event with its date, time and venue map, attire guide, photo gallery, Hindi & English toggle, music, and live WhatsApp RSVP.',
  ],
  [
    'Can I invite different guests to different events (Parivar Links)?',
    'Yes. With Parivar Links (included free), every guest or family household gets a link that shows only the functions they are invited to — so close family sees Haldi and Mehndi while colleagues see the Reception.',
  ],
  [
    'Do you only make wedding invites?',
    'No. NIMANTRAN includes dedicated interactive templates for Hindu, Muslim, Sikh, and South Indian weddings, plus engagements, Janmotsav (Nandini Jhula, Gokul Matki), milestone birthdays, and Griha Pravesh.',
  ],
  [
    'Will it open smoothly for elders on any phone?',
    'Yes. Your invite is a fast, lightweight web link that opens in seconds inside WhatsApp or any mobile browser — with a 1-tap Hindi (हिन्दी) / English switcher so Nani and Dadi can read every word comfortably.',
  ],
];

const TypedCouplePreview: React.FC<{ target: string; active: boolean }> = React.memo(
  ({ target, active }) => {
    const [typedText, setTypedText] = useState(target);

    useEffect(() => {
      if (!active) {
        setTypedText(target);
        return;
      }
      let idx = 0;
      let timeoutId: number;
      const step = () => {
        if (idx <= target.length) {
          setTypedText(target.slice(0, idx));
          idx += 1;
          timeoutId = window.setTimeout(step, 120);
        } else {
          timeoutId = window.setTimeout(() => {
            idx = 0;
            setTypedText('');
            timeoutId = window.setTimeout(step, 400);
          }, 1800);
        }
      };
      step();
      return () => window.clearTimeout(timeoutId);
    }, [target, active]);

    return <span>{typedText}</span>;
  }
);

export const InvifestSectionsBelowFold: React.FC<InvifestSectionsBelowFoldProps> = React.memo(({
  themes,
  groomName,
  brideName,
  onLaunchPreview,
  onSelectThemePage,
  onOpenCustomizer,
}) => {
  // Animated state for How It Works Step 1 (Phone Carousel) — only runs when in viewport
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [howItWorksVisible, setHowItWorksVisible] = useState(false);
  const howItWorksRef = useRef<HTMLElement | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeBlogModal, setActiveBlogModal] = useState<(typeof BLOG_POSTS)[0] | null>(null);
  const [aanganDrawerOpen, setAanganDrawerOpen] = useState(false);
  const [aanganGuestFamily, setAanganGuestFamily] = useState('Sharma Parivar & Family');
  const [aanganSelectedEvents, setAanganSelectedEvents] = useState<string[]>([
    'Haldi',
    'Sangeet',
    'Wedding',
    'Reception',
  ]);
  const [copiedAangan, setCopiedAangan] = useState(false);
  const [poppedFeatIdx, setPoppedFeatIdx] = useState<number | null>(null);
  const [poppedStepPhoneIdx, setPoppedStepPhoneIdx] = useState<number | null>(2);
  const [poppedCompIdx, setPoppedCompIdx] = useState<number | null>(null);

  const fullCoupleTarget = `${groomName || 'Aarav'} & ${brideName || 'Ananya'}`;

  useEffect(() => {
    const el = howItWorksRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => setHowItWorksVisible(Boolean(entries[0]?.isIntersecting)),
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!howItWorksVisible) return;
    const id = window.setInterval(() => {
      setCarouselIdx((prev) => (prev + 1) % 3);
    }, 2200);
    return () => window.clearInterval(id);
  }, [howItWorksVisible]);

  const handleWhatWeMakeAction = (
    actionType: (typeof WHAT_WE_MAKE_ITEMS)[number]['actionType']
  ) => {
    if (actionType === 'scroll-templates') {
      document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' });
    } else if (actionType === 'open-aangan') {
      setAanganDrawerOpen(true);
    } else if (actionType === 'open-customizer') {
      onOpenCustomizer(themes[0]);
    } else if (actionType === 'open-single-page') {
      onSelectThemePage(themes[0]);
    }
  };

  const toggleAanganEvent = (ev: string) => {
    setAanganSelectedEvents((prev) =>
      prev.includes(ev) ? (prev.length > 1 ? prev.filter((item) => item !== ev) : prev) : [...prev, ev]
    );
  };

  const copyAanganLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?card=${
      themes[0].id
    }&guest=${encodeURIComponent(aanganGuestFamily)}&events=${encodeURIComponent(
      aanganSelectedEvents.join(',')
    )}`;
    navigator.clipboard?.writeText(url);
    setCopiedAangan(true);
    setTimeout(() => setCopiedAangan(false), 2400);
  };

  return (
    <>
      {/* ====================================================================
          SECTION 4: WHAT WE MAKE (#what-we-make — WhatWeMake-Bslcg13D.js)
          ==================================================================== */}
      <section
        id="what-we-make"
        className="py-16 sm:py-[96px] bg-[#fbf7f2] border-y border-[#efe7dc]"
      >
        <div id="studio" className="sr-only" />
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="max-w-[680px]">
            <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#9a6d1f]">
              What we make
            </div>
            <h2 className="mt-2.5 text-[26px] sm:text-[42px] leading-[1.13] font-semibold tracking-[-0.02em] text-[#141619] font-sans">
              One invitation. Everything your celebration needs around it.
            </h2>
            <p className="mt-3 text-[#6f665f] text-[15.5px] leading-[1.6]">
              Start with a template or a blank page — and add only what is useful to your family.
              Every single product below is unlocked{' '}
              <span className="line-through">₹499–₹2,000</span>{' '}
              <strong className="text-[#15803D]">100% FREE (₹0)</strong>.
            </p>
          </div>

          <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {WHAT_WE_MAKE_ITEMS.map((item) => (
              <button
                key={item.num}
                type="button"
                onClick={() => handleWhatWeMakeAction(item.actionType)}
                className="group relative flex flex-col justify-between rounded-[24px] bg-white border border-[#ece3d5] p-6 sm:p-8 transition-all duration-300 hover:border-[#cbb899] hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-28px_rgba(32,22,10,0.22)] text-left cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[12px] tracking-[0.14em] text-[#9a8f82]">
                      {item.num}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11.5px] font-medium px-2.5 py-0.5 rounded-full bg-[#f6efe4] text-[#7a5a20] border border-[#eadbc2]">
                        {item.tag}
                      </span>
                      <span className="text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full bg-[#131113] text-white">
                        <s className="opacity-60 mr-1 font-normal">{item.originalPrice}</s>
                        <span className="text-[#4ade80] font-bold">FREE</span>
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 text-[13px] font-medium text-[#8a7e70]">{item.title}</div>
                  <h3 className="mt-1 text-[21px] sm:text-[24px] leading-[1.22] font-semibold tracking-[-0.015em] text-[#141619]">
                    {item.headline}
                  </h3>
                  <p className="mt-3 text-[14.5px] leading-[1.62] text-[#6a625a]">{item.body}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#f1eadf] flex items-center justify-between text-[13.5px] font-medium text-[#1f1a16]">
                  <span>{item.cta}</span>
                  <ArrowRight className="w-4 h-4 text-[#7a5a20] transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>

          {/* Interactive Parivar Guest Link Builder Drawer (When clicked) */}
          {aanganDrawerOpen && (
            <div className="mt-6 rounded-[24px] border-2 border-[#cbb899] bg-white p-6 sm:p-8 shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#15803D]">
                    02 · Parivar Live Guest Link Generator (<s>₹999</s> FREE)
                  </span>
                  <h3 className="mt-1 text-[22px] font-semibold text-[#141619]">
                    Invite Different Relatives to Different Functions on One Link
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setAanganDrawerOpen(false)}
                  className="rounded-full border border-[#e2e2e2] p-2 text-[#565656] hover:text-black cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[12.5px] font-medium text-[#565656] mb-1.5">
                      Guest Household Name (Shown on the cover envelope)
                    </label>
                    <input
                      type="text"
                      value={aanganGuestFamily}
                      onChange={(e) => setAanganGuestFamily(e.target.value)}
                      className="w-full rounded-xl border border-[#dcdcdc] bg-[#fafafa] px-3.5 py-2.5 text-[14px] font-medium text-[#141619]"
                    />
                  </div>
                  <div>
                    <span className="block text-[12.5px] font-medium text-[#565656] mb-1.5">
                      Select Which Functions This Family Sees:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['Haldi', 'Mehndi', 'Sangeet', 'Wedding', 'Reception'].map((ev) => {
                        const active = aanganSelectedEvents.includes(ev);
                        return (
                          <button
                            key={ev}
                            type="button"
                            onClick={() => toggleAanganEvent(ev)}
                            className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors cursor-pointer ${
                              active
                                ? 'bg-[#111315] text-white'
                                : 'bg-[#f4f4f4] text-[#666] hover:bg-[#eaeaea]'
                            }`}
                          >
                            {active ? '✓ ' : '+ '}
                            {ev}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#fbf7f2] border border-[#ece3d5] p-5">
                  <div className="text-[12px] text-[#8a7e70]">Live Parivar Preview for:</div>
                  <div className="mt-0.5 text-[18px] font-semibold text-[#141619]">
                    Dear {aanganGuestFamily || 'Family'}
                  </div>
                  <div className="mt-2 text-[13px] text-[#565656]">
                    Visible Events:{' '}
                    <strong className="text-[#141619]">
                      {aanganSelectedEvents.join(' · ')}
                    </strong>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={copyAanganLink}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#111315] text-white px-4 py-2 text-[13px] font-medium cursor-pointer"
                    >
                      {copiedAangan ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#4ade80]" />
                          <span>Personal Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Household Link</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onLaunchPreview(themes[0])}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#d4c7b4] bg-white px-4 py-2 text-[13px] font-medium text-[#141619] cursor-pointer"
                    >
                      <span>Open Live Invite</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ====================================================================
          SECTION 5: THE WEDDING INVITE, REINVENTED (#features — Reinvented-DfHcVJvn.js)
          ==================================================================== */}
      <section id="features" className="py-16 sm:py-[110px] bg-white">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 grid grid-cols-[0.9fr_1.1fr] gap-20 items-start max-[900px]:grid-cols-1 max-[900px]:gap-10">
          {/* Left Sticky Column */}
          <div className="lg:sticky lg:top-28">
            <h2 className="text-[28px] sm:text-[44px] leading-[1.12] font-semibold text-[#141619] font-sans">
              The Wedding Invite,
              <br />
              Reinvented.
            </h2>
            <p className="mt-5 text-[#767676] text-[16px] leading-[1.6] max-w-[380px]">
              Traditional enough for the elders. Effortless enough for everyone else — and now{' '}
              <span className="line-through">₹499–₹2,000</span>{' '}
              <strong className="text-[#15803D]">100% Free</strong>.
            </p>
            <div className="mt-7">
              <a
                href="#templates"
                className="inline-flex items-center gap-2 rounded-full bg-[#111315] text-white px-6 py-3 text-[14.5px] font-medium shadow-[0_16px_32px_-12px_rgba(17,19,21,0.45)] hover:bg-[#24282c] transition-all"
              >
                <span>Choose a template</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right Stacked Sticky Feature Cards (.feat-card) with Fanned Phone Image Icon & Click-to-Pop-Up */}
          <div>
            {REINVENTED_FEATURES.map((feat, idx) => {
              const tCenter = themes[idx % themes.length] || themes[0];
              const tLeft = themes[(idx + 1) % themes.length] || themes[0];
              const tRight = themes[(idx + 2) % themes.length] || themes[0];
              const isFeatPopped = poppedFeatIdx === idx;

              return (
                <div
                  key={feat.title}
                  onClick={() => setPoppedFeatIdx(isFeatPopped ? null : idx)}
                  className="feat-card group/feat flex items-start gap-7 py-9 max-[640px]:gap-5 max-[640px]:py-7 cursor-pointer"
                  style={{ zIndex: idx + 1 }}
                >
                  {/* Image-type Fanned 3-Phone Icon on #F3ECE1 Cream (Pops upward on click!) */}
                  <div
                    className={`relative w-[84px] h-[84px] shrink-0 rounded-[22px] bg-[#F3ECE1] border border-[#e5dacb] flex items-center justify-center overflow-visible transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isFeatPopped
                        ? '-translate-y-3 scale-110 shadow-[0_20px_38px_-12px_rgba(20,14,10,0.38)] ring-2 ring-[#c9a34e]'
                        : 'shadow-xs group-hover/feat:-translate-y-1.5 group-hover/feat:shadow-md'
                    }`}
                  >
                    {/* Left Mini Phone */}
                    <div
                      className={`absolute w-[32px] aspect-[9/19] rounded-[7px] bg-[#161618] p-[1.5px] transition-transform duration-300 ${
                        isFeatPopped
                          ? '-translate-x-4 -translate-y-1 -rotate-12 scale-95'
                          : '-translate-x-3 -rotate-9 group-hover/feat:-translate-x-3.5'
                      }`}
                    >
                      <img
                        src={tLeft.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="h-full w-full rounded-[5.5px] object-cover opacity-80"
                      />
                    </div>
                    {/* Right Mini Phone */}
                    <div
                      className={`absolute w-[32px] aspect-[9/19] rounded-[7px] bg-[#161618] p-[1.5px] transition-transform duration-300 ${
                        isFeatPopped
                          ? 'translate-x-4 -translate-y-1 rotate-12 scale-95'
                          : 'translate-x-3 rotate-9 group-hover/feat:translate-x-3.5'
                      }`}
                    >
                      <img
                        src={tRight.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="h-full w-full rounded-[5.5px] object-cover opacity-80"
                      />
                    </div>
                    {/* Center Mini Phone */}
                    <div
                      className={`relative z-10 w-[36px] aspect-[9/19] rounded-[8px] bg-[#161618] p-[1.8px] shadow-md transition-transform duration-300 ${
                        isFeatPopped ? '-translate-y-2 scale-105' : 'group-hover/feat:-translate-y-1'
                      }`}
                    >
                      <div className="relative h-full w-full overflow-hidden rounded-[6px] bg-[#FAF4EC]">
                        <img
                          src={tCenter.image}
                          alt={feat.title}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute top-0.5 left-1/2 -translate-x-1/2 h-[2.5px] w-2.5 rounded-full bg-black" />
                      </div>
                    </div>
                  </div>

                  <div
                    className={`transition-transform duration-300 ${
                      isFeatPopped ? '-translate-y-1' : 'group-hover/feat:-translate-y-0.5'
                    }`}
                  >
                    <h3 className="text-[22px] sm:text-[26px] font-semibold text-[#141619] leading-[1.2] font-sans">
                      {feat.title}
                    </h3>
                    <p className="mt-2.5 text-[#767676] text-[15px] leading-[1.6] max-w-[460px]">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 6: HOW IT WORKS (HowItWorks-vKT1UJfY.js — 3 Animated Cards)
          ==================================================================== */}
      <section ref={howItWorksRef} id="how-it-works" className="py-16 sm:py-[110px] bg-[#fafafa]">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <h2 className="text-center text-[26px] sm:text-[42px] leading-[1.15] font-semibold text-[#141619] max-w-[680px] mx-auto font-sans">
            From picking a design to sharing on WhatsApp — here&apos;s how simple it is
          </h2>

          <div className="mt-10 sm:mt-16 grid grid-cols-3 max-[900px]:grid-cols-1 gap-7">
            {/* STEP 01: Pick a template (5-Phone Fanned Arc on #F3ECE1 with Click-to-Pop-Up) */}
            <div className="bg-[#f4f4f4] border border-[#ececec] rounded-[24px] p-[22px] pb-7 flex flex-col">
              <div className="bg-[#F3ECE1] border border-[#e5dacb] rounded-[18px] h-[300px] relative overflow-hidden flex items-center justify-center px-4 pt-7 pb-3">
                <div className="relative w-full h-full flex items-center justify-center">
                  {themes.slice(0, 5).map((phoneTheme, i) => {
                    const slot = i - 2; // -2, -1, 0, +1, +2
                    const absSlot = Math.abs(slot);
                    const isPopped = poppedStepPhoneIdx === i || (poppedStepPhoneIdx === null && i === carouselIdx);
                    const tx = slot * 38;
                    const ty = 6 + absSlot * absSlot * 4 + (isPopped ? -16 : 0);
                    const rot = slot * 4.2;
                    const sc = (1 - absSlot * 0.08) * (isPopped ? 1.06 : 1);
                    const zIdx = isPopped ? 30 : 20 - absSlot * 4;

                    return (
                      <div
                        key={`${phoneTheme.id}-step-${i}`}
                        onClick={() => {
                          if (poppedStepPhoneIdx === i) {
                            onLaunchPreview(phoneTheme);
                          } else {
                            setPoppedStepPhoneIdx(i);
                          }
                        }}
                        style={{
                          transform: `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) scale(${sc})`,
                          zIndex: zIdx,
                          opacity: isPopped ? 1 : absSlot === 2 ? 0.65 : 0.92,
                          transition:
                            'transform 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms ease',
                        }}
                        className="group/sphone absolute cursor-pointer origin-bottom"
                      >
                        <div className="w-[98px] h-[192px] rounded-[20px] bg-[#161618] p-[4px] shadow-[0_18px_36px_-12px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover/sphone:-translate-y-1.5">
                          <div className="w-full h-full rounded-[16px] overflow-hidden relative bg-[#FAF4EC]">
                            <img
                              src={phoneTheme.image}
                              alt={phoneTheme.imageAlt}
                              loading="lazy"
                              decoding="async"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-7 h-2 rounded-full bg-black" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 px-1">
                <h3 className="text-[22px] font-semibold text-[#141619] leading-snug font-sans">
                  <span className="text-[#a8a8a8] font-medium mr-1.5">01 -</span>
                  Pick a template
                </h3>
                <p className="mt-2.5 text-[#767676] text-[14.5px] leading-[1.6]">
                  Browse our collection of 31+ handcrafted wedding &amp; celebration invite
                  templates — all unlocked 100% Free.
                </p>
              </div>
            </div>

            {/* STEP 02: Personalize with your details (Auto-Typing Couple Form) */}
            <div className="bg-[#f4f4f4] border border-[#ececec] rounded-[24px] p-[22px] pb-7 flex flex-col">
              <div className="bg-white border border-[#efefef] rounded-[18px] h-[300px] relative overflow-hidden flex items-center justify-center p-4">
                <div className="w-full max-w-[260px] space-y-2.5">
                  <div className="rounded-xl border border-[#ececec] bg-[#fafafa] px-3.5 py-2.5">
                    <div className="text-[10px] uppercase tracking-wider text-[#9a9a9a] font-medium">
                      Bride &amp; Groom
                    </div>
                    <div className="mt-0.5 text-[14px] font-semibold text-[#1a1a1a] h-[20px] flex items-center">
                      <TypedCouplePreview target={fullCoupleTarget} active={howItWorksVisible} />
                      <span className="inline-block w-[1.5px] h-4 bg-[#1a1a1a] ml-0.5 animate-pulse" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="rounded-xl border border-[#ececec] bg-[#fafafa] px-3.5 py-2.5">
                      <div className="text-[10px] uppercase tracking-wider text-[#9a9a9a] font-medium">
                        Wedding Date
                      </div>
                      <div className="mt-0.5 text-[13px] font-semibold text-[#1a1a1a]">
                        14 · 12 · 2026
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#ececec] bg-[#fafafa] px-3.5 py-2.5">
                      <div className="text-[10px] uppercase tracking-wider text-[#9a9a9a] font-medium">
                        Venue
                      </div>
                      <div className="mt-0.5 text-[13px] font-semibold text-[#1a1a1a] truncate">
                        Udaipur, RJ
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 px-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-[#9a9a9a] font-medium mr-1">Theme</span>
                      {['#7a1f2b', '#c9a34e', '#1f3a2e', '#2b2d42'].map((sw, idx) => (
                        <span
                          key={sw}
                          style={{ background: sw }}
                          className={`w-4 h-4 rounded-full ${
                            idx === 0 ? 'ring-2 ring-offset-1 ring-[#7a1f2b]' : ''
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenCustomizer(themes[0])}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1f7a4c] bg-[#e8f6ee] px-2.5 py-0.5 rounded-full cursor-pointer hover:bg-[#d5f0e0]"
                    >
                      <Check className="w-3 h-3" strokeWidth={2.5} />
                      <span>Edit Live</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 px-1">
                <h3 className="text-[22px] font-semibold text-[#141619] leading-snug font-sans">
                  <span className="text-[#a8a8a8] font-medium mr-1.5">02 -</span>
                  Personalize with your details
                </h3>
                <p className="mt-2.5 text-[#767676] text-[14.5px] leading-[1.6]">
                  Add your names, dates, venues, photos, and love story — customize every detail in
                  real time.
                </p>
              </div>
            </div>

            {/* STEP 03: Share one link on WhatsApp & track RSVPs */}
            <div className="bg-[#f4f4f4] border border-[#ececec] rounded-[24px] p-[22px] pb-7 flex flex-col">
              <div className="bg-white border border-[#efefef] rounded-[18px] h-[300px] relative overflow-hidden flex items-center justify-center p-4">
                <div className="w-full max-w-[260px] space-y-2.5">
                  <div className="rounded-2xl rounded-tl-sm bg-[#e7f8ee] border border-[#c9ecd6] p-2.5 shadow-sm">
                    <div className="rounded-xl bg-white overflow-hidden border border-[#e6e6e6] flex items-center gap-2.5 p-2">
                      <img
                        src={themes[0].image}
                        alt={themes[0].imageAlt}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="w-11 h-14 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] text-[#1f7a4c] font-semibold truncate">
                          invitationcards.site/invites/
                          {(groomName || 'aarav').toLowerCase()}-
                          {(brideName || 'ananya').toLowerCase()}
                        </div>
                        <div className="text-[12px] font-semibold text-[#1a1a1a] truncate">
                          {groomName || 'Aarav'} &amp; {brideName || 'Ananya'}&apos;s Wedding
                        </div>
                        <div className="text-[10.5px] text-[#7a7a7a] truncate">
                          Tap to open 3D invite · Dec 14
                        </div>
                      </div>
                    </div>
                    <div className="mt-1.5 px-1 flex items-center justify-between text-[11px] text-[#2b5d3f]">
                      <span>You&apos;re invited to celebrate with us ✨</span>
                      <span className="text-[10px] text-[#5c8a6e]">✓✓</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[#ececec] bg-[#fafafa] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                      <span className="text-[11.5px] font-medium text-[#2a2a2a]">
                        Sent via WhatsApp · 148 RSVPs
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectThemePage(themes[0])}
                      className="text-[11px] font-semibold text-[#1f7a4c] hover:underline cursor-pointer"
                    >
                      Open Link →
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 px-1">
                <h3 className="text-[22px] font-semibold text-[#141619] leading-snug font-sans">
                  <span className="text-[#a8a8a8] font-medium mr-1.5">03 -</span>
                  Share one link on WhatsApp &amp; track RSVPs
                </h3>
                <p className="mt-2.5 text-[#767676] text-[14.5px] leading-[1.6]">
                  Get one link for all your events. Share it on WhatsApp and track RSVPs
                  effortlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 7: FOR BUSINESS (#for-business — ForBusiness-DCrFbvYJ.js)
          ==================================================================== */}
      <section id="for-business" className="py-12 sm:py-20 bg-white">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-[28px] border border-[#2a221b] text-[#fbf5ec] shadow-[0_32px_70px_-34px_rgba(18,13,9,0.65)] [background:radial-gradient(120%_75%_at_75%_0%,#2c2219_0%,#16110d_55%,#0d0a08_100%)]">
            <img
              src={themes[0].image}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="pointer-events-none select-none absolute inset-y-0 right-0 h-full w-[58%] object-cover object-center opacity-[0.22] max-[860px]:w-full max-[860px]:opacity-[0.14]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 [background:linear-gradient(90deg,#120d09_0%,rgba(18,13,9,0)_38%)]"
            />
            <div className="relative z-10 p-7 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-[#e5c17a]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e5c17a]" />
                  <span>For Business · Free Studio Access</span>
                </div>
                <h2 className="mt-3 text-[26px] sm:text-[40px] leading-[1.12] font-semibold tracking-[-0.02em] text-[#fffaf1] font-playfair">
                  Planners, photographers and studios: gift your couples their invitation.
                </h2>
                <p className="mt-3.5 text-[15px] sm:text-[16px] leading-[1.62] text-[#cfc3b2] max-w-[560px]">
                  Hand your clients a link with their names on it, as part of your package or under
                  your own studio name — all 31+ templates unlocked for ₹0.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3">
                <button
                  type="button"
                  onClick={() => onOpenCustomizer(themes[0])}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-[14.5px] font-semibold text-[#1a1209] [background:linear-gradient(180deg,#f3dba6,#d2a24d)] shadow-[0_14px_30px_-12px_rgba(229,193,122,0.55)] hover:brightness-105 transition cursor-pointer"
                >
                  <span>Create Client Invite Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onSelectThemePage(themes[0])}
                  className="inline-flex items-center justify-center gap-1.5 text-[13px] font-medium text-[#d8cab6] hover:text-white px-3 py-1.5 cursor-pointer"
                >
                  <span>Explore single-card sample pages →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 8: COMPARISON TABLE (#comparison — Comparison-DF6u6ccn.js)
          ==================================================================== */}
      <section id="comparison" className="py-16 sm:py-[110px] bg-white">
        <div id="pricing" className="sr-only" />
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="text-center max-w-[680px] mx-auto">
            <div className="font-dancing text-[24px] text-[#9b9b9b]">The difference</div>
            <h2 className="mt-1 text-[26px] sm:text-[42px] leading-[1.15] font-semibold text-[#141619] font-sans">
              What Cards and Video Invites Can&apos;t Do
              <br className="hidden sm:inline" /> (But These Templates Can)
            </h2>
          </div>

          <div className="mt-12 overflow-x-auto no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0">
            <div className="min-w-[680px] rounded-[26px] border border-[#e9e9e9] overflow-hidden bg-white shadow-[0_24px_60px_-35px_rgba(0,0,0,0.12)]">
              {/* Table Header */}
              <div className="grid grid-cols-[1.25fr_1fr_1fr_1.15fr] border-b border-[#ededed] text-[15px] font-semibold">
                <div className="p-6 text-[#8b8b8b] font-medium">Feature</div>
                <div className="p-6 text-center text-[#565656]">Printed Cards</div>
                <div className="p-6 text-center text-[#565656]">WhatsApp Videos</div>
                <div className="p-6 text-center bg-[#141518] text-white flex items-center justify-center gap-2">
                  <span className="inline-block px-2.5 py-0.5 text-[11px] rounded-full bg-[#4ade80]/20 text-[#4ade80] font-semibold">
                    ★ Best · FREE
                  </span>
                  <span>NIMANTRAN</span>
                </div>
              </div>

              {/* Table Rows */}
              {COMPARISON_ROWS.map((row, idx) => {
                const rowTheme = themes[idx % themes.length] || themes[0];
                const rowThemeAlt = themes[(idx + 2) % themes.length] || themes[0];
                const isCompPopped = poppedCompIdx === idx;
                return (
                  <div
                    key={row.label}
                    onClick={() => setPoppedCompIdx(isCompPopped ? null : idx)}
                    className={`group/crow grid grid-cols-[1.25fr_1fr_1fr_1.15fr] items-center text-[15px] cursor-pointer ${
                      idx < COMPARISON_ROWS.length - 1 ? 'border-b border-[#efefef]' : ''
                    }`}
                  >
                    <div className="p-5 sm:p-6 flex items-center gap-3.5 font-medium text-[#141619]">
                      <span
                        className={`relative w-11 h-11 rounded-2xl bg-[#F3ECE1] border border-[#e5dacb] flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isCompPopped
                            ? '-translate-y-2 scale-110 shadow-md ring-2 ring-[#c9a34e]'
                            : 'group-hover/crow:-translate-y-1'
                        }`}
                      >
                        <span className="absolute w-4 aspect-[9/19] -translate-x-1.5 -rotate-8 rounded-[4px] bg-[#161618] p-[1px] overflow-hidden">
                          <img
                            src={rowThemeAlt.image}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover rounded-[3px]"
                          />
                        </span>
                        <span className="relative z-10 w-[18px] aspect-[9/19] translate-x-1 rotate-3 rounded-[4px] bg-[#161618] p-[1px] overflow-hidden shadow-xs">
                          <img
                            src={rowTheme.image}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover rounded-[3px]"
                          />
                        </span>
                      </span>
                      <span>{row.label}</span>
                    </div>
                    <div className="p-5 sm:p-6 text-center text-[#8a8a8a]">{row.values[0]}</div>
                    <div className="p-5 sm:p-6 text-center text-[#8a8a8a]">{row.values[1]}</div>
                    <div className="p-5 sm:p-6 text-center bg-[#141518] text-white font-semibold flex items-center justify-center gap-2 h-full">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#22c55e]/20 text-[#4ade80] shrink-0">
                        <Check className="w-3.5 h-3.5" strokeWidth={2.8} />
                      </span>
                      <span>{row.values[2]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 9: GOOGLE REVIEWS TESTIMONIALS (#testimonials — Testimonials-DWJxnpg_.js)
          ==================================================================== */}
      <section id="testimonials" className="py-16 sm:py-[110px] bg-white">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="text-center max-w-[680px] mx-auto">
            <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#9a6d1f]">
              From our Google reviews
            </div>
            <h2 className="mt-2 text-[26px] sm:text-[42px] leading-[1.15] font-semibold text-[#141619] font-sans">
              Families, in their own words
            </h2>
            <p className="mt-3 text-[#6f665f] text-[15px] inline-flex items-center gap-2 flex-wrap justify-center">
              <span className="inline-flex items-center gap-0.5 text-[#f5a524]" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((star) => (
                  <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
                  </svg>
                ))}
              </span>
              <span>Rated 4.9 on Google from 180+ family reviews</span>
            </p>
          </div>

          <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {GOOGLE_REVIEWS.map((rev) => (
              <figure
                key={rev.name}
                className="flex flex-col justify-between rounded-[24px] bg-[#fbf7f2] border border-[#efe7dc] p-6 sm:p-7"
              >
                <blockquote className="text-[15.5px] sm:text-[16.5px] leading-[1.6] text-[#1f1a16]">
                  <span
                    aria-hidden="true"
                    className="block font-serif text-[34px] leading-none text-[#c9a34e] mb-1"
                  >
                    &ldquo;
                  </span>
                  {rev.quote}
                </blockquote>
                <figcaption className="mt-5 pt-4 border-t border-[#ece3d5] flex items-center justify-between text-[13.5px]">
                  <span className="font-semibold text-[#141619]">{rev.name}</span>
                  <span className="text-[12px] text-[#8a7e70]">Google review</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 10: FROM THE BLOG (#blog — FromTheBlog-CsHCSCz7.js)
          ==================================================================== */}
      <section
        id="blog"
        className="py-16 sm:py-[96px] bg-[#fbf7f2] border-t border-[#efe7dc]"
      >
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-[620px]">
              <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#9a6d1f]">
                Nimantran Journal
              </div>
              <h2 className="mt-2 text-[26px] sm:text-[40px] leading-[1.14] font-semibold tracking-[-0.02em] text-[#141619] font-sans">
                What to write, whom to invite, and how to send it
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveBlogModal(BLOG_POSTS[0])}
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#1f1a16] hover:text-[#7a5a20] shrink-0 cursor-pointer"
            >
              <span>Read wedding wording guides</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-9 sm:mt-11 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {BLOG_POSTS.map((post) => (
              <button
                key={post.slug}
                type="button"
                onClick={() => setActiveBlogModal(post)}
                className="group flex flex-col justify-between rounded-[22px] bg-white border border-[#ece3d5] p-6 transition-all duration-300 hover:border-[#cbb899] hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-26px_rgba(32,22,10,0.2)] text-left cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2 text-[11.5px] font-medium text-[#8a7e70]">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#f6efe4] text-[#7a5a20] border border-[#eadbc2]">
                      {post.category}
                    </span>
                    <span>·</span>
                    <span>{post.readingMinutes} min read</span>
                  </div>
                  <h3 className="mt-3.5 text-[18px] sm:text-[19.5px] leading-[1.3] font-semibold tracking-[-0.01em] text-[#141619] group-hover:text-[#7a5a20] transition-colors">
                    {post.title}
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-[1.58] text-[#6a625a] line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-[#f1eadf] inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1f1a16]">
                  <span>Read guide</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#7a5a20] transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Guide Reader Modal */}
      {activeBlogModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setActiveBlogModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-[640px] w-full rounded-[26px] bg-[#fbf7f2] border border-[#ece3d5] p-6 sm:p-9 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="px-3 py-1 rounded-full bg-[#f6efe4] text-[#7a5a20] border border-[#eadbc2] text-[12px] font-semibold">
                {activeBlogModal.category} · {activeBlogModal.readingMinutes} min read
              </span>
              <button
                type="button"
                onClick={() => setActiveBlogModal(null)}
                className="rounded-full border border-[#dcd3c6] bg-white p-2 text-[#141619] hover:bg-[#f0ebe3] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <h3 className="mt-4 text-[24px] sm:text-[28px] font-semibold leading-tight text-[#141619]">
              {activeBlogModal.title}
            </h3>
            <div className="mt-4 space-y-3.5 text-[15px] leading-[1.68] text-[#4a423c]">
              {activeBlogModal.content.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-[#e5dac9] flex flex-wrap items-center justify-between gap-3">
              <span className="text-[13px] text-[#7a5a20] font-medium">
                Ready to try these wordings on a live card?
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveBlogModal(null);
                  onOpenCustomizer(themes[0]);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[#111315] text-white px-5 py-2.5 text-[13.5px] font-medium cursor-pointer"
              >
                <span>Open Live Card Customizer</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SECTION 11: QUESTIONS? ANSWERS. FAQ (#faq — FAQ-pfSFbIRH.js)
          ==================================================================== */}
      <section id="faq" className="py-16 sm:py-[110px] bg-white">
        <div className="max-w-[820px] mx-auto px-5 sm:px-8">
          <h2 className="text-center text-[28px] sm:text-[44px] leading-[1.15] font-semibold text-[#141619] font-sans">
            Questions? Answers.
          </h2>

          <div className="mt-11 divide-y divide-[#eaeaea] border-y border-[#eaeaea]">
            {FAQ_ITEMS.map(([question, answer], idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={question} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-6 text-left cursor-pointer"
                  >
                    <span className="text-[16.5px] sm:text-[18px] font-medium text-[#141619]">
                      {question}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full border border-[#d9d9d9] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-45 bg-[#111315] text-white border-[#111315]' : ''
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </span>
                  </button>
                  {isOpen && (
                    <p
                      className="mt-3 text-[#727272] text-[15px] leading-[1.65] pr-10"
                      dangerouslySetInnerHTML={{ __html: answer }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-9 text-center">
            <button
              type="button"
              onClick={() => onOpenCustomizer(themes[0])}
              className="inline-flex items-center gap-2 rounded-full border border-[#dcdcdc] bg-white px-6 py-3 text-[14.5px] font-medium text-[#141619] hover:border-[#141619] transition-colors cursor-pointer"
            >
              <span>Customise a card live now</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 12: DARK CLOSING CTA (ClosingCta-1itVHvx-.js)
          ==================================================================== */}
      <section className="py-16 sm:py-24 bg-[#fafafa]">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-[30px] bg-[#111315] text-white px-6 sm:px-14 py-14 sm:py-20 text-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[620px] h-[320px] rounded-full opacity-25"
              style={{
                background: 'radial-gradient(ellipse at center, #ffffff, transparent 70%)',
              }}
            />
            <div className="relative z-10 max-w-[640px] mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1 text-[12px] font-medium text-[#4ade80] mb-4">
                <span>All 31+ Templates Unlocked</span>
                <span>·</span>
                <s className="text-white/60">₹499–₹2,000</s>
                <span className="font-bold">FREE (₹0)</span>
              </div>
              <h2 className="text-[28px] sm:text-[46px] leading-[1.12] font-semibold tracking-[-0.02em] font-sans">
                Your invitation, ready in minutes — 100% Free.
              </h2>
              <p className="mt-4 text-white/70 text-[15.5px] sm:text-[17px] leading-[1.55]">
                Pick a design, personalise your names, dates and venues, and get one link your whole
                family can open on any phone.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
                <a
                  href="#templates"
                  className="inline-flex items-center gap-2 rounded-full bg-white text-[#111315] hover:bg-white/90 px-6 py-3.5 text-[14.5px] font-semibold shadow-lg transition-all"
                >
                  <span>See every design</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => onSelectThemePage(themes[0])}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 px-6 py-3.5 text-[14.5px] font-medium transition-all cursor-pointer"
                >
                  <span>Open Single-Card Showcase</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
});
