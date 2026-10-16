import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  MapPin, 
  Share2, 
  QrCode, 
  Palette, 
  Layers, 
  CheckCircle2, 
  Star, 
  Heart, 
  ArrowRight, 
  ChevronRight, 
  Download, 
  Smartphone, 
  Printer, 
  ShieldCheck, 
  MessageCircle,
  HelpCircle,
  Calendar,
  Flame,
  Maximize2,
  Play,
  Edit3,
  LayoutTemplate,
  Send,
  Crown,
  Check,
  Gem
} from 'lucide-react';
import { CardTemplate } from '../types/editor';
import { INITIAL_TEMPLATES, TEMPLATE_CATEGORIES } from '../data/templates';

interface HomepageProps {
  onOpenEditorWithTemplate: (template: CardTemplate) => void;
  onOpenBlankEditor: () => void;
  onOpenAnalysis: () => void;
  onOpenVideoCard: (template?: CardTemplate) => void;
}

export const Homepage: React.FC<HomepageProps> = ({
  onOpenEditorWithTemplate,
  onOpenBlankEditor,
  onOpenAnalysis,
  onOpenVideoCard,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewTemplate, setPreviewTemplate] = useState<CardTemplate | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState<boolean>(false);
  const [footerLang, setFooterLang] = useState<string>('English & हिंदी (India)');

  // Circular Categories with real event photography
  const HOME_CATEGORIES = [
    { 
      id: 'wedding', 
      name: 'Wedding (विवाह)', 
      icon: '💍', 
      image: '/images/wedding_couple_1791965341379.jpg',
      count: '180+ Designs', 
      bg: 'bg-rose-950/40 border-rose-500/30' 
    },
    { 
      id: 'housewarming', 
      name: 'Griha Pravesh (गृह प्रवेश)', 
      icon: '🪔', 
      image: '/images/griha_pravesh_1791965341528.jpg',
      count: '95+ Designs', 
      bg: 'bg-amber-950/40 border-amber-500/30' 
    },
    { 
      id: 'sangeet-mehendi', 
      name: 'Sangeet & Haldi (संगीत)', 
      icon: '🪘', 
      image: '/images/sangeet_haldi_1791965342768.jpg',
      count: '75+ Designs', 
      bg: 'bg-yellow-950/40 border-yellow-500/30' 
    },
    { 
      id: 'birthday', 
      name: 'Birthday (जन्मदिन)', 
      icon: '🎂', 
      image: '/images/baby_birthday_1791965343318.jpg',
      count: '120+ Designs', 
      bg: 'bg-sky-950/40 border-sky-500/30' 
    },
    { 
      id: 'baby-shower', 
      name: 'Baby Shower (गोद भराई)', 
      icon: '👶', 
      image: '/images/baby_birthday_1791965343318.jpg',
      count: '60+ Designs', 
      bg: 'bg-pink-950/40 border-pink-500/30' 
    },
    { 
      id: 'anniversary', 
      name: 'Anniversary (सालगिरह)', 
      icon: '✨', 
      image: '/images/wedding_couple_1791965341379.jpg',
      count: '50+ Designs', 
      bg: 'bg-purple-950/40 border-purple-500/30' 
    },
  ];

  // Filter templates
  const filteredTemplates = INITIAL_TEMPLATES.filter((t) => {
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-amber-900 via-rose-950 to-amber-900 text-amber-200 text-xs py-2 px-4 text-center border-b border-amber-500/20 flex items-center justify-center gap-2">
        <span className="font-semibold text-amber-300">✨ India's #1 Digital Invitation Studio:</span>
        <span>100% Watermark-Free • Google Maps QR Code Included • 5-Slide Video Sequences • Instant WhatsApp Share</span>
      </div>

      {/* 2. HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gold-shimmer flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="font-cinzel text-neutral-950 font-black text-xl">नि</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel font-bold text-amber-200 text-lg sm:text-xl tracking-wider">
                  IMANTRAN CARD
                </span>
                <span className="hidden sm:inline text-[10px] text-amber-400 font-semibold px-1.5 py-0.5 bg-amber-400/10 rounded border border-amber-400/20">
                  STUDIO
                </span>
              </div>
              <p className="text-[10px] text-neutral-400">Digital Cards & Video Invitations</p>
            </div>
          </div>

          {/* Search bar in header */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Wedding, Griha Pravesh, Birthday, Sangeet..."
              className="w-full bg-neutral-800/80 text-xs pl-10 pr-4 py-2.5 rounded-full border border-neutral-700/80 focus:border-amber-400/80 outline-none text-neutral-100 placeholder:text-neutral-500 transition"
            />
          </div>

          {/* Navigation Links & Action */}
          <div className="flex items-center gap-3">
            <nav className="hidden lg:flex items-center gap-5 text-xs text-neutral-300 font-medium">
              <button 
                onClick={() => setSelectedCategory('wedding')}
                className="hover:text-amber-300 transition"
              >
                Wedding Cards
              </button>
              <button 
                onClick={() => setSelectedCategory('housewarming')}
                className="hover:text-amber-300 transition"
              >
                Griha Pravesh
              </button>
              <button 
                onClick={() => setSelectedCategory('birthday')}
                className="hover:text-amber-300 transition"
              >
                Birthday
              </button>
              <button 
                onClick={() => setSelectedCategory('sangeet-mehendi')}
                className="hover:text-amber-300 transition"
              >
                Sangeet & Haldi
              </button>
            </nav>

            <button
              onClick={onOpenBlankEditor}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] flex items-center gap-1.5"
            >
              <Palette className="w-4 h-4" />
              <span>Create / Open Editor</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 border-b border-neutral-800/60">
        {/* Ambient background glow - performant radial gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
          {/* Hero Left Copy */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>भारत का पसंदीदा ऑनलाइन डिजिटल निमंत्रण पत्र निर्माता</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-100 tracking-tight leading-tight">
              Create Beautiful <br />
              <span className="gold-text-gradient font-cinzel">Digital Invitations</span> in Minutes
            </h1>

            <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Design personalized cards for <strong className="text-neutral-200">Shubh Vivah, Griha Pravesh, Sangeet & Birthdays</strong>. Customize text in Hindi or English, add real <strong className="text-amber-300">Google Maps QR codes</strong>, and share instantly on WhatsApp.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => onOpenVideoCard(INITIAL_TEMPLATES[0])}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 text-neutral-950 font-bold text-sm rounded-xl shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-neutral-950 text-neutral-950" />
                <span>Play Royal Lakeside Video Sequence</span>
              </button>

              <button
                onClick={() => {
                  const elem = document.getElementById('template-catalog');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-5 py-3.5 bg-neutral-800/90 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-500/50 text-neutral-200 font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2"
              >
                <span>Browse All Templates</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenBlankEditor}
                className="w-full sm:w-auto px-5 py-3.5 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/60 text-neutral-300 font-medium text-sm rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Palette className="w-4 h-4 text-amber-400" />
                <span>Editor</span>
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4 text-xs text-neutral-400 border-t border-neutral-800/80">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span><strong>4.9/5 Rating</strong> by 250,000+ Families across India</span>
            </div>
          </div>

          {/* Hero Right Visual: Real Photograph & Interactive Invitation Card */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none flex flex-col sm:flex-row items-center justify-center gap-4 relative">
            {/* Real Photograph Flatlay Card */}
            <div className="hidden sm:block w-64 h-[420px] rounded-3xl overflow-hidden border-2 border-neutral-700 shadow-2xl relative group rotate-[-3deg] hover:rotate-0 transition-transform duration-300 will-change-transform">
              <img
                src="/images/invitation_hero_1791965343981.jpg"
                alt="Luxury Royal Indian Invitation Cards Flatlay"
                referrerPolicy="no-referrer"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-[11px] font-semibold text-amber-200">
                  ✨ Gold Foil & Velvet Presentation
                </span>
              </div>
            </div>

            {/* Interactive Customizable Card */}
            <div 
              onClick={() => onOpenEditorWithTemplate(INITIAL_TEMPLATES[0])}
              className="cursor-pointer group relative w-72 sm:w-80 h-[460px] rounded-3xl p-5 shadow-2xl border-2 border-amber-500/50 rotate-[2deg] hover:rotate-0 hover:scale-105 transition-all duration-300 z-10 overflow-hidden will-change-transform"
              style={{ background: INITIAL_TEMPLATES[0].pages[0].backgroundValue }}
            >
              {/* Background Cover Image (WebP) */}
              <img
                src="/wedding/Royal Lakeside Wedding Invitation/Royal Lakeside Wedding Invitation-1.webp"
                alt="Royal Lakeside Wedding Invitation Cover"
                referrerPolicy="no-referrer"
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/60 pointer-events-none" />

              {/* Gold foil edge glow */}
              <div className="absolute inset-2 border border-dashed border-amber-400/40 rounded-2xl pointer-events-none z-10" />

              <div className="h-full flex flex-col justify-between text-center relative z-10">
                <div>
                  <div className="font-tiro text-amber-200 text-sm tracking-widest">
                    || श्री गणेशाय नमः ||
                  </div>
                  <div className="font-playfair italic text-neutral-300 text-xs mt-2 uppercase tracking-widest">
                    Together with their families
                  </div>
                  <div className="font-rozha text-amber-100 text-3xl font-bold mt-2">
                    Vikramaditya
                  </div>
                  <div className="font-alex-brush text-amber-400 text-2xl">
                    weds
                  </div>
                  <div className="font-rozha text-amber-100 text-3xl font-bold">
                    Ananya
                  </div>
                </div>

                <div className="py-2">
                  <div className="font-cinzel text-amber-200 text-xs font-bold tracking-widest">
                    FRIDAY, 18 DECEMBER 2026
                  </div>
                  <div className="text-[11px] text-neutral-300 mt-1">
                    The Rambagh Palace, Jaipur
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-18 h-18 p-1.5 bg-[#FFF4D6] rounded-lg shadow-lg border border-amber-500/50 flex items-center justify-center">
                    <QrCode className="w-full h-full text-neutral-900" />
                  </div>
                  <span className="text-[9px] text-amber-300 font-semibold tracking-wider mt-1">
                    SCAN FOR GOOGLE MAPS VENUE
                  </span>
                </div>

                {/* Hover button overlay */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-black/60 rounded-3xl backdrop-blur-xs flex items-center justify-center p-4">
                  <span className="px-5 py-2.5 bg-amber-500 text-neutral-950 font-bold text-xs rounded-xl shadow-xl flex items-center gap-1.5">
                    <Palette className="w-4 h-4" />
                    Customize in Template Editor →
                  </span>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-black text-[10px] px-3 py-1 rounded-full shadow-lg border border-amber-300">
                ★ BESTSELLER
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CIRCULAR CATEGORIES SECTION (Icon Grid like InvitationBazaar) */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100">
            Explore Invitation Categories
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            Choose from authentic Indian cultural designs and modern celebrations
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {HOME_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                const elem = document.getElementById('template-catalog');
                elem?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`p-3.5 rounded-2xl border transition-all text-center group flex flex-col items-center gap-2.5 hover:scale-105 ${
                selectedCategory === cat.id
                  ? 'border-amber-400 bg-amber-500/15 shadow-lg shadow-amber-500/10'
                  : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/40 relative shadow-md group-hover:border-amber-400 group-hover:scale-110 transition-transform">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                <span className="absolute bottom-0 right-0 text-xs bg-neutral-900/90 rounded-full px-1 shadow">
                  {cat.icon}
                </span>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-neutral-200 group-hover:text-amber-300 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-neutral-400 block mt-0.5">{cat.count}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 5. TEMPLATES CATALOG SECTION */}
      <section id="template-catalog" className="py-12 px-4 sm:px-6 max-w-7xl mx-auto w-full flex-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 flex items-center gap-2">
              <span>Popular Invitation Templates</span>
              <span className="text-xs text-amber-400 font-mono bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                {filteredTemplates.length} Available
              </span>
            </h2>
            <p className="text-neutral-400 text-xs mt-0.5">
              Click any card to open and edit directly in the Template Editor
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {TEMPLATE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs whitespace-nowrap px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                    : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const firstPage = template.pages[0];
            return (
              <div
                key={template.id}
                className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-amber-500/60 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between [content-visibility:auto] [contain-intrinsic-size:320px]"
              >
                {/* Visual Card Banner */}
                <div
                  className="h-80 w-full p-4 relative overflow-hidden flex flex-col justify-between"
                  style={{ background: firstPage?.backgroundValue }}
                >
                  {/* Real Image Preview if present */}
                  {(() => {
                    const img = firstPage?.elements.find((e) => e.type === 'image') as any;
                    if (!img?.src) return null;
                    return (
                      <>
                        <img
                          src={img.src}
                          alt={template.title}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/60 pointer-events-none" />
                      </>
                    );
                  })()}

                  {/* Subtle border outline */}
                  <div className="absolute inset-3 border border-dashed border-amber-400/30 rounded-xl pointer-events-none z-10" />

                  {/* Top tags */}
                  <div className="flex items-center justify-between text-[11px] text-amber-200 relative z-10">
                    <span className="px-2 py-0.5 rounded bg-black/40 border border-amber-400/20 capitalize font-mono">
                      {template.aspectRatio}
                    </span>
                    {template.pages.length > 1 ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 font-extrabold flex items-center gap-1 shadow-md text-[10px]">
                        <Play className="w-2.5 h-2.5 fill-neutral-950" />
                        {template.pages.length}-Slide Video Sequence
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                        100% Free • No Watermark
                      </span>
                    )}
                  </div>

                  {/* Center Card Title preview */}
                  <div className="text-center relative z-10 px-4">
                    <div className="font-playfair text-xs italic text-amber-200/90 tracking-widest uppercase">
                      {firstPage?.elements.find((e) => e.type === 'text')?.text || template.title}
                    </div>
                    <div className="font-rozha text-2xl text-amber-100 font-bold mt-1">
                      {template.title}
                    </div>
                    <div className="text-xs text-neutral-300 mt-2 font-mono">
                      {firstPage?.elements.find((e) => e.type === 'qr') ? '📍 Google Maps QR Included' : '✨ Royal Layout'}
                    </div>
                  </div>

                  {/* Bottom QR hint */}
                  <div className="flex items-center justify-between text-[10px] text-amber-200/80 relative z-10">
                    <span>{template.pages.length} {template.pages.length > 1 ? 'Slides Story' : 'Page Invitation'}</span>
                    <span>Ready to Personalize</span>
                  </div>

                  {/* Hover Actions Overlay */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute inset-0 bg-neutral-950/85 backdrop-blur-xs flex flex-col items-center justify-center gap-2.5 p-6 z-20">
                    {template.pages.length > 1 && (
                      <button
                        onClick={() => onOpenVideoCard(template)}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-yellow-400 via-amber-300 to-amber-500 hover:brightness-110 text-neutral-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-neutral-950" />
                        Play Video ({template.pages.length} Slides)
                      </button>
                    )}
                    <button
                      onClick={() => onOpenEditorWithTemplate(template)}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                    >
                      <Palette className="w-4 h-4" />
                      Customize in Editor
                    </button>
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      className="w-full py-2 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs rounded-xl border border-neutral-700 transition flex items-center justify-center gap-1.5"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      Quick Preview
                    </button>
                  </div>
                </div>

                {/* Card Meta Footer */}
                <div className="p-4 bg-neutral-900 border-t border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-100 group-hover:text-amber-300 transition-colors">
                      {template.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                      <span className="capitalize">{template.category}</span>
                      <span>•</span>
                      <span>{template.tags.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenEditorWithTemplate(template)}
                    className="p-2 bg-neutral-800 hover:bg-amber-500 text-neutral-300 hover:text-neutral-950 rounded-xl transition-colors"
                    title="Open in Template Editor"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. HOW IT WORKS (Ultra-Luxe Royal 4-Step Process) */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900/90 to-neutral-950 border-t border-b border-amber-500/30">
        {/* Ambient golden glow behind section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-96 bg-amber-500/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold tracking-widest uppercase shadow-md shadow-amber-500/10">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>राजसी निमंत्रण निर्माण प्रक्रिया • Simple 4-Step Process</span>
            </div>

            <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 tracking-wide drop-shadow-sm">
              How To Create Your Digital Invitation
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              No design skills required — make your royal card in just 5 minutes with authentic Indian cultural elegance.
            </p>

            <div className="flex items-center justify-center gap-2 pt-1">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-amber-400/60" />
              <Gem className="w-3.5 h-3.5 text-amber-400" />
              <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-amber-400/60" />
            </div>
          </div>

          {/* Connected Steps Grid */}
          <div className="relative">
            {/* Desktop Golden Connecting Line */}
            <div className="hidden lg:block absolute top-[72px] left-16 right-16 h-[2px] bg-gradient-to-r from-amber-500/30 via-amber-400 to-amber-500/30 z-0 shadow-[0_0_12px_rgba(245,158,11,0.5)]" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {[
                {
                  step: '01',
                  hindi: 'प्रथम चरण • चयन',
                  title: 'Choose a Template',
                  subtitle: 'राजसी डिज़ाइन चयन',
                  desc: 'Select from 100+ royal Indian wedding, Griha Pravesh, birthday, or Sangeet designs.',
                  icon: LayoutTemplate,
                  highlights: ['180+ Palace & Mandap Layouts', 'Gold Foil & Floral Accents'],
                  tag: 'Step 01',
                },
                {
                  step: '02',
                  hindi: 'द्वितीय चरण • संपादन',
                  title: 'Customize Text & Photos',
                  subtitle: 'नाम व मंत्र संपादन',
                  desc: 'Edit names, dates, parents info, add Sanskrit shlokas and upload couple portraits.',
                  icon: Edit3,
                  highlights: ['Sanskrit Shlokas Included', 'Devanagari Hindi & Calligraphy'],
                  tag: 'Step 02',
                },
                {
                  step: '03',
                  hindi: 'तृतीय चरण • क्यूआर कोड',
                  title: 'Add Google Maps QR',
                  subtitle: 'गूगल मैप्स नेविगेशन',
                  desc: 'Generate a real scannable QR code so your guests can navigate directly to the venue.',
                  icon: QrCode,
                  highlights: ['1-Tap Turn-by-Turn GPS', 'Zero Lost Guests Guarantee'],
                  tag: 'Step 03',
                },
                {
                  step: '04',
                  hindi: 'चतुर्थ चरण • डाउनलोड',
                  title: 'Download & Share',
                  subtitle: 'व्हाट्सएप एचडी शेयर',
                  desc: 'Download crystal-clear HD PNG, JPG, or PDF and send directly via WhatsApp.',
                  icon: Send,
                  highlights: ['100% Watermark-Free Export', 'WhatsApp 9:16 Fullscreen HD'],
                  tag: 'Step 04',
                },
              ].map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={i}
                    className="group relative rounded-3xl bg-gradient-to-b from-neutral-900/95 via-neutral-900/80 to-neutral-950/95 border border-amber-500/30 hover:border-amber-400/90 transition-all duration-300 p-6 flex flex-col justify-between shadow-xl shadow-black/80 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-2 backdrop-blur-md"
                  >
                    {/* Top Row: Metallic Gold Step Disc + Royal Icon Box */}
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        {/* Metallic Gold Disc */}
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-300 via-amber-500 to-amber-700 p-[1.5px] shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform duration-300">
                          <div className="w-full h-full rounded-[14px] bg-neutral-950 group-hover:bg-gradient-to-br group-hover:from-amber-400 group-hover:to-yellow-500 transition-all duration-300 flex flex-col items-center justify-center">
                            <span className="font-cinzel font-black text-sm text-amber-300 group-hover:text-neutral-950 tracking-wider">
                              {step.step}
                            </span>
                            <span className="text-[8px] font-semibold text-neutral-400 group-hover:text-neutral-900 uppercase">
                              STEP
                            </span>
                          </div>
                        </div>

                        {/* Royal Icon Box */}
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/15 to-amber-950/40 border border-amber-500/40 flex items-center justify-center text-amber-300 group-hover:text-amber-200 group-hover:border-amber-300 shadow-md transition-all duration-300">
                          <Icon className="w-6 h-6 drop-shadow" />
                        </div>
                      </div>

                      {/* Hindi Tag */}
                      <div className="text-[10px] font-semibold font-tiro text-amber-400 tracking-wider mb-1">
                        {step.hindi}
                      </div>

                      {/* Title */}
                      <h3 className="font-cinzel text-lg font-bold text-neutral-100 group-hover:text-amber-200 transition-colors">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-neutral-400 leading-relaxed mt-2.5">
                        {step.desc}
                      </p>
                    </div>

                    {/* Micro Features Badge List */}
                    <div className="pt-5 mt-5 border-t border-neutral-800/80 space-y-2">
                      {step.highlights.map((hl, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2 text-[11px] text-neutral-300">
                          <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span className="font-medium">{hl}</span>
                        </div>
                      ))}
                    </div>

                    {/* Subtle Corner Gold Flourish Indicator */}
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400/40 group-hover:bg-amber-400 transition-colors" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive CTA Banner at Bottom of Steps */}
          <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/60 via-neutral-900 to-amber-950/60 border border-amber-500/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-1.5 text-center md:text-left relative z-10">
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Instant Personalization • No Signup Required</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-neutral-100">
                Ready to Create Your Royal Invitation?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400">
                Pick a ready template or start from scratch with full creative control.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto relative z-10">
              <button
                onClick={() => {
                  const elem = document.getElementById('template-catalog');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <LayoutTemplate className="w-4 h-4 fill-neutral-950" />
                <span>Browse All Templates</span>
              </button>

              <button
                onClick={onOpenBlankEditor}
                className="w-full sm:w-auto px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-amber-200 hover:text-white border border-amber-500/40 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Palette className="w-4 h-4 text-amber-400" />
                <span>Open Studio Editor</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE INVITATION BAZAAR? (Royal Studio Features Grid) */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full relative">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Gem className="w-3.5 h-3.5 text-amber-400" />
            <span>Royal Studio Specifications</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-neutral-100">
            Why Indian Families Love Our Studio
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm">
            Handcrafted with cultural reverence, modern technology, and unconditional zero-watermark freedom.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: MapPin,
              title: 'Google Maps QR Code on Card',
              hindi: 'सटीक वेन्यू नेविगेशन',
              desc: 'Never receive calls asking "Venue kahan hai?" — guests simply point their phone camera to get live turn-by-turn driving directions.',
              badge: 'Real GPS QR',
            },
            {
              icon: Share2,
              title: 'WhatsApp Optimized 9:16 Fullscreen',
              hindi: 'व्हाट्सएप स्टेटस एवं संदेश',
              desc: 'High clarity on mobile screens with pre-formatted polite invitation message and status story aspect ratios.',
              badge: 'Instant Delivery',
            },
            {
              icon: Sparkles,
              title: 'Authentic Motifs & Vedic Shlokas',
              hindi: 'पारंपरिक मांगलिक प्रतीक',
              desc: 'Handcrafted Lord Ganesha, Manglik Kalash, Sacred Om, Swastik, Doli, Shehnai, Mandap, and Dholak vectors.',
              badge: 'Pure Heritage',
            },
            {
              icon: Palette,
              title: '50+ Devanagari & Calligraphy Fonts',
              hindi: 'राजसी हिंदी एवं अंग्रेजी फॉन्ट्स',
              desc: 'Express yourself in Shuddha Hindi, Sanskrit, or English with Rozha One, Tiro Devanagari, Cinzel, and Alex Brush.',
              badge: 'Bilingual Support',
            },
            {
              icon: Printer,
              title: '300 DPI Print-Ready Export',
              hindi: 'हाई-डेफिनिशन प्रिंट क्वालिटी',
              desc: 'Need physical prints for elders? Export in 300 DPI print-ready PDF and lossless PNG without extra charges.',
              badge: 'Lossless Clarity',
            },
            {
              icon: ShieldCheck,
              title: '100% Free & No Watermark',
              hindi: 'पूर्णतः वाटरमार्क मुक्त',
              desc: 'No hidden paywalls or ugly logos on your sacred wedding invitation cards. Your auspicious event deserves pure dignity.',
              badge: 'Zero Watermark',
            },
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="p-7 rounded-3xl bg-neutral-900/70 border border-neutral-800 hover:border-amber-500/50 transition-all duration-300 group hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/15 to-yellow-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:border-amber-400 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-amber-300">
                      {feat.badge}
                    </span>
                  </div>

                  <div className="text-[10px] font-tiro text-amber-400/90 mb-1">{feat.hindi}</div>
                  <h3 className="font-cinzel text-base font-bold text-neutral-100 group-hover:text-amber-200 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mt-2.5">{feat.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-amber-400/80">
                  <span>Included in every template</span>
                  <span>✓ Active</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. TESTIMONIALS (Royal Vivah & Griha Pravesh Stories) */}
      <section className="py-20 px-4 sm:px-6 bg-neutral-900/40 border-t border-b border-neutral-800/80 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>4.9 / 5 Star Client Rating</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-neutral-100">
              Trusted by 250,000+ Families Worldwide
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              Read how couples, parents, and event hosts created their unforgettable invitations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "The Google Maps QR code feature saved us so much time! All our relatives easily reached the palace venue in Udaipur without calling anyone for directions. The Royal Lakeside template looked like a million dollars on WhatsApp!",
                author: "Ananya & Siddharth Rathore",
                event: "Shubh Vivah (The Jagmandir Palace, Udaipur)",
                city: "Udaipur, Rajasthan",
                rating: 5,
              },
              {
                quote: "Made our Griha Pravesh card in 5 minutes with Manglik Kalash and Vedic shlokas. The Hindi fonts looked so authentic and royal! No watermark and instant download — truly phenomenal tool.",
                author: "Anoop & Kavita Sharma",
                event: "Griha Pravesh & Vastu Shanti Puja",
                city: "Delhi NCR",
                rating: 5,
              },
              {
                quote: "The 5-slide video sequence for Sangeet & Haldi is mind-blowing. It plays with traditional Shehnai music, shows our event itinerary, and our guests were mesmerized. Outstanding experience!",
                author: "Rohan & Simran Kapoor",
                event: "Royal Sangeet & Vivah Celebration",
                city: "Mumbai, Maharashtra",
                rating: 5,
              },
            ].map((testi, i) => (
              <div
                key={i}
                className="p-7 rounded-3xl bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-amber-400">
                      {[...Array(testi.rating)].map((_, r) => (
                        <Star key={r} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-amber-300 font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                      ✓ Verified Host
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-300 italic leading-relaxed">
                    "{testi.quote}"
                  </p>
                </div>

                <div className="pt-5 border-t border-neutral-800/80 mt-5">
                  <div className="font-cinzel text-xs font-bold text-amber-200">
                    {testi.author}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5 font-medium">
                    {testi.event}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">
                    📍 {testi.city}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-neutral-100">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-400 text-xs">Everything you need to know about making your digital invitation</p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'How does the Google Maps QR code work on my card?',
              a: 'When you customize your template, enter your wedding venue name or Google Maps link. The editor automatically generates a scannable QR code on the card. When guests scan it with their phone camera, Google Maps opens with turn-by-turn driving directions to your venue!',
            },
            {
              q: 'Can I type my invitation card details in Hindi or regional languages?',
              a: 'Yes! Our editor includes authentic Devanagari Hindi fonts (Rozha One, Tiro Devanagari, Kalam) and pre-made sacred Sanskrit shlokas like "|| श्री गणेशाय नमः ||" and "|| शुभ विवाह ||". You can also type directly in Hindi or paste text.',
            },
            {
              q: 'Is the downloaded card watermark-free?',
              a: 'Yes, 100% of our templates download completely watermark-free in crisp HD PNG, JPG, or PDF formats.',
            },
            {
              q: 'Can I share the digital invitation directly on WhatsApp?',
              a: 'Absolutely! Our cards are specially sized in 9:16 vertical ratio (for WhatsApp Status & fullscreen smartphone viewing) and 1:1 square ratio. We also provide a 1-click WhatsApp share button with a pre-written polite invitation message.',
            },
            {
              q: 'What is the Multi-Slide Video Invitation Sequence?',
              a: 'Templates like Royal Lakeside and Golden Mandap contain 5 full slides (Cover, Wedding Ceremony, Functions, Reception, Thank You). You can play them sequentially with Shehnai music as a digital story or edit each slide individually.',
            },
          ].map((faq, i) => (
            <div key={i} className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/40 transition">
              <h3 className="text-xs sm:text-sm font-semibold text-neutral-100 mb-2 flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-neutral-400 pl-6 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. ULTRA-LUXURY ROYAL PALACE FOOTER */}
      <footer className="mt-auto bg-gradient-to-b from-neutral-950 via-[#0d0306] to-black border-t-2 border-amber-500/40 text-neutral-400 text-xs relative overflow-hidden">
        {/* Top Ornamental Gold Shimmer Ribbon */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />

        {/* Ambient Royal Palace Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-4/5 h-64 bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-900/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-12 relative z-10 space-y-12">
          {/* TIER 1: ROYAL VIP NEWSLETTER & INSTANT STUDIO BANNER */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#24060d] via-neutral-900/95 to-[#24060d] border border-amber-500/40 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute inset-1.5 border border-dashed border-amber-400/20 rounded-2xl pointer-events-none" />

            <div className="space-y-2 text-center lg:text-left max-w-xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold tracking-wider uppercase">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Royal Muhurat & Invitation Inspiration Club</span>
              </div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-extrabold text-amber-100 tracking-wide">
                Get 50+ Exclusive 2026–2027 Royal Wedding Templates Free
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Receive auspicious Vivah Muhurat calendars, Sanskrit shloka booklets, and new palace invitation releases directly in your inbox.
              </p>
            </div>

            <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2.5 relative z-10">
              {newsletterSubscribed ? (
                <div className="px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>धन्यवाद! Welcome to the Royal Invitation Club ✨</span>
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email or WhatsApp number..."
                    className="w-full sm:w-72 bg-neutral-950/90 text-neutral-100 px-4 py-3 rounded-xl border border-amber-500/40 focus:border-amber-400 outline-none text-xs placeholder:text-neutral-500"
                  />
                  <button
                    onClick={() => {
                      if (newsletterEmail.trim()) {
                        setNewsletterSubscribed(true);
                        setNewsletterEmail('');
                      }
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/25 transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 fill-neutral-950" />
                    <span>Join VIP List</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* TIER 2: 4-PILLAR TRUST & HERITAGE GUARANTEE STRIP */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: ShieldCheck,
                title: '100% Watermark-Free',
                sub: 'Zero branding on your sacred invitations',
                badge: 'Guaranteed',
              },
              {
                icon: Printer,
                title: '300 DPI Print & 4K Digital',
                sub: 'Crystal clear PDF, PNG & WhatsApp HD',
                badge: 'Press Ready',
              },
              {
                icon: QrCode,
                title: 'Smart Google Maps GPS QR',
                sub: 'Live turn-by-turn venue directions',
                badge: 'Built-In App',
              },
              {
                icon: Heart,
                title: '250,000+ Indian Families',
                sub: '4.9★ Rated across India, USA, UK & UAE',
                badge: 'Trusted #1',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800/90 hover:border-amber-500/40 transition flex items-start gap-3.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono uppercase text-amber-400 font-bold">
                      {item.badge}
                    </span>
                    <h4 className="text-xs font-bold text-neutral-100">{item.title}</h4>
                    <p className="text-[11px] text-neutral-400 leading-snug">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* TIER 3: 6-COLUMN GRAND DIRECTORY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 pt-4 border-t border-neutral-800/80">
            {/* Column 1 & 2: Brand Heritage Story & Contact Concierge */}
            <div className="lg:col-span-2 space-y-4 pr-2">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl gold-shimmer flex items-center justify-center text-neutral-950 font-black font-cinzel text-2xl shadow-lg shadow-amber-500/30 border border-amber-300/60">
                  नि
                </div>
                <div>
                  <span className="font-cinzel font-black text-amber-200 text-lg tracking-wider block">
                    IMANTRAN CARD
                  </span>
                  <span className="text-[10px] text-amber-400 font-semibold tracking-widest uppercase">
                    Royal Indian Canva Studio • Est. 2026
                  </span>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-neutral-300">
                भारत का सर्वश्रेष्ठ डिजिटल निमंत्रण एवं वीडियो कार्ड स्टूडियो। Handcrafted for Shubh Vivah, Griha Pravesh, Sangeet, Mehendi, Haldi, Baby Showers & Milestone Anniversaries with full Canva-grade design tools.
              </p>

              {/* Cultural Blessing Box */}
              <div className="p-3 rounded-xl bg-neutral-900/90 border border-amber-500/25 space-y-1">
                <div className="font-tiro text-amber-300 text-xs font-semibold">
                  ॥ मंगलम् भगवान विष्णुः मंगलम् गरुड़ध्वजः ॥
                </div>
                <p className="text-[10px] text-neutral-400">
                  Every template is crafted with authentic Vedic symbols, Devanagari calligraphy & palace aesthetics.
                </p>
              </div>

              {/* Quick Studio Launch Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={onOpenBlankEditor}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 text-neutral-950 font-black rounded-xl transition text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Open Canva Studio</span>
                </button>
                <button
                  onClick={() => onOpenVideoCard(INITIAL_TEMPLATES[0])}
                  className="px-3.5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-amber-500/40 text-amber-200 rounded-xl transition text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-amber-300 text-amber-300" />
                  <span>5-Slide Video Demo</span>
                </button>
              </div>
            </div>

            {/* Column 3: Celebration Categories */}
            <div>
              <h4 className="font-cinzel text-xs font-bold text-amber-200 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Celebrations
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory('wedding');
                      document.getElementById('template-catalog')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-amber-300 transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>💍</span> Royal Shubh Vivah
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory('housewarming');
                      document.getElementById('template-catalog')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-amber-300 transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>🪔</span> Griha Pravesh Puja
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory('sangeet-mehendi');
                      document.getElementById('template-catalog')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-amber-300 transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>🪘</span> Sangeet, Haldi & Mehendi
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory('birthday');
                      document.getElementById('template-catalog')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-amber-300 transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>🎂</span> 1st Birthday (जन्मदिन)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory('baby-shower');
                      document.getElementById('template-catalog')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-amber-300 transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>👶</span> Godh Bharai / Baby Shower
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory('anniversary');
                      document.getElementById('template-catalog')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-amber-300 transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>✨</span> 25th / 50th Anniversary
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Canva Studio Pro Tools */}
            <div>
              <h4 className="font-cinzel text-xs font-bold text-amber-200 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Canva Studio Tools
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button onClick={onOpenBlankEditor} className="hover:text-amber-300 transition flex items-center gap-1.5 cursor-pointer">
                    <span className="text-amber-400">✦</span> Curved Arch Text & Neon
                  </button>
                </li>
                <li>
                  <button onClick={onOpenBlankEditor} className="hover:text-amber-300 transition flex items-center gap-1.5 cursor-pointer">
                    <span className="text-amber-400">✦</span> Magic Cutout Photo Studio
                  </button>
                </li>
                <li>
                  <button onClick={onOpenBlankEditor} className="hover:text-amber-300 transition flex items-center gap-1.5 cursor-pointer">
                    <span className="text-amber-400">✦</span> Itinerary Tables & Charts
                  </button>
                </li>
                <li>
                  <button onClick={onOpenBlankEditor} className="hover:text-amber-300 transition flex items-center gap-1.5 cursor-pointer">
                    <span className="text-amber-400">✦</span> Multi-Photo Collage Grids
                  </button>
                </li>
                <li>
                  <button onClick={onOpenBlankEditor} className="hover:text-amber-300 transition flex items-center gap-1.5 cursor-pointer">
                    <span className="text-amber-400">✦</span> Freehand Gold Brush Draw
                  </button>
                </li>
                <li>
                  <button onClick={onOpenBlankEditor} className="hover:text-amber-300 transition flex items-center gap-1.5 cursor-pointer">
                    <span className="text-amber-400">✦</span> Brand Hub 1-Click Restyle
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 5: Regional & Cultural Traditions */}
            <div>
              <h4 className="font-cinzel text-xs font-bold text-amber-200 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Indian Traditions
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-300">
                <li>
                  <button onClick={() => onOpenEditorWithTemplate(INITIAL_TEMPLATES[0])} className="hover:text-amber-300 transition cursor-pointer">
                    🏰 Rajasthani Rajwada Vivah
                  </button>
                </li>
                <li>
                  <button onClick={() => onOpenEditorWithTemplate(INITIAL_TEMPLATES[1] || INITIAL_TEMPLATES[0])} className="hover:text-amber-300 transition cursor-pointer">
                    🕌 Punjabi Anand Karaj & Dhol
                  </button>
                </li>
                <li>
                  <button onClick={onOpenBlankEditor} className="hover:text-amber-300 transition cursor-pointer">
                    🌴 South Indian Kanjeevaram
                  </button>
                </li>
                <li>
                  <button onClick={onOpenBlankEditor} className="hover:text-amber-300 transition cursor-pointer">
                    🌺 Gujarati & Marwari Lagna
                  </button>
                </li>
                <li>
                  <button onClick={onOpenBlankEditor} className="hover:text-amber-300 transition cursor-pointer">
                    🐚 Bengali Subho Bibaho
                  </button>
                </li>
                <li>
                  <button onClick={onOpenBlankEditor} className="hover:text-amber-300 transition cursor-pointer">
                    🌙 Royal Nikah & Walima
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 6: Smart Apps, Export & Architecture */}
            <div>
              <h4 className="font-cinzel text-xs font-bold text-amber-200 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Smart Apps & Export
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-300">
                <li>
                  <button onClick={onOpenBlankEditor} className="hover:text-amber-300 transition cursor-pointer">
                    📍 Google Maps Venue QR
                  </button>
                </li>
                <li>
                  <button onClick={onOpenBlankEditor} className="hover:text-amber-300 transition cursor-pointer">
                    💬 WhatsApp RSVP & UPI Shagun
                  </button>
                </li>
                <li>
                  <button onClick={onOpenBlankEditor} className="hover:text-amber-300 transition cursor-pointer">
                    ⏳ Live Muhurat Countdown
                  </button>
                </li>
                <li>
                  <button onClick={onOpenBlankEditor} className="hover:text-amber-300 transition cursor-pointer">
                    🎟️ VIP Venue Entry Barcode
                  </button>
                </li>
                <li>
                  <button onClick={onOpenBlankEditor} className="hover:text-amber-300 transition cursor-pointer">
                    🇮🇳 Magic Hindi / Sanskrit Translate
                  </button>
                </li>
                <li>
                  <button onClick={onOpenAnalysis} className="text-amber-300 hover:underline font-semibold transition cursor-pointer">
                    ⚡ Studio Architecture Audit →
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* TIER 4: POPULAR SEO QUICK-TAGS & ASPECT RATIO BADGES */}
          <div className="pt-6 border-t border-neutral-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mr-1">
                Supported Formats:
              </span>
              {[
                '9:16 WhatsApp Story HD',
                '5:7 Classic Print Card',
                '1:1 Instagram Square',
                '7:5 Landscape Envelope',
                'A4 300 DPI Press PDF',
                '16:9 YouTube / LED Wall Video',
              ].map((tag, i) => (
                <span
                  key={i}
                  onClick={onOpenBlankEditor}
                  className="px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 text-[10px] text-neutral-300 cursor-pointer transition"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Language & Region Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-neutral-500">Language:</span>
              <select
                value={footerLang}
                onChange={(e) => setFooterLang(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 text-amber-200 text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
              >
                <option value="English & हिंदी (India)">🇮🇳 English & हिंदी (India)</option>
                <option value="श्रीमद् संस्कृत एवं हिंदी">🕉️ संस्कृत एवं शुद्ध हिंदी</option>
                <option value="Global NRI Edition (US/UK/UAE)">🌍 Global NRI Edition (USD/GBP)</option>
              </select>
            </div>
          </div>

          {/* TIER 5: BOTTOM COPYRIGHT, SOCIAL LINKS & MADE IN INDIA BADGE */}
          <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-neutral-300 font-semibold">
                © {new Date().getFullYear()} IMANTRAN CARD Studio.
              </span>
              <span>All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-amber-400/90 font-medium">
                Crafted with ❤️ for Indian Celebrations Worldwide
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-neutral-400">
              <button onClick={onOpenBlankEditor} className="hover:text-amber-300 transition cursor-pointer">
                Privacy & Zero-Tracking
              </button>
              <span>•</span>
              <button onClick={onOpenBlankEditor} className="hover:text-amber-300 transition cursor-pointer">
                100% Free License
              </button>
              <span>•</span>
              <button onClick={onOpenAnalysis} className="hover:text-amber-300 transition cursor-pointer">
                System Status: ● Online
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* QUICK PREVIEW MODAL */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-5 max-w-md w-full text-center space-y-4">
            <h3 className="text-base font-bold text-neutral-100">{previewTemplate.title}</h3>
            <div 
              className="h-80 w-full rounded-xl p-4 flex flex-col justify-between"
              style={{ background: previewTemplate.pages[0].backgroundValue }}
            >
              <div className="text-xs text-amber-200 font-mono">{previewTemplate.aspectRatio}</div>
              <div className="font-rozha text-2xl text-amber-100">{previewTemplate.title}</div>
              <div className="text-xs text-neutral-300">Ready to personalize with your names & date</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const t = previewTemplate;
                  setPreviewTemplate(null);
                  onOpenEditorWithTemplate(t);
                }}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs"
              >
                Open in Editor →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
