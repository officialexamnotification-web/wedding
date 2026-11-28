import React, { useState } from 'react';
import { Check, MessageCircle, Users, Globe2, Plus, Send } from 'lucide-react';
import { CEREMONIES, FAMILY_PROFILES } from '../data/weddingData';

export const StudioFeaturesSection: React.FC = () => {
  const [selectedFamilyId, setSelectedFamilyId] = useState(FAMILY_PROFILES[0].id);
  const [simLang, setSimLang] = useState<'en' | 'hi'>('en');
  const [customGuestName, setCustomGuestName] = useState('');
  const [customInvitedIds, setCustomInvitedIds] = useState<string[]>([
    'haldi',
    'mehendi',
    'sangeet',
    'pheras',
  ]);

  const activeProfile =
    FAMILY_PROFILES.find((f) => f.id === selectedFamilyId) || FAMILY_PROFILES[0];

  const effectiveGuestName = customGuestName.trim() || activeProfile.familyName[simLang];
  const effectiveCeremonies = customGuestName.trim()
    ? customInvitedIds
    : activeProfile.invitedCeremonies;

  const toggleCeremonyForCustom = (id: string) => {
    setCustomInvitedIds((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((x) => x !== id) : prev) : [...prev, id]
    );
  };

  const capabilities = [
    {
      num: '01.',
      title: 'Parivar Personalized Family Links (Free)',
      desc: 'Generate a unique link per family group. Greet the Sharmas or Kapoors by their own name and show only the ceremonies they are invited to—keeping intimate Haldi or Mehendi private.',
    },
    {
      num: '02.',
      title: '6 Authentic Opening Gestures & Motion',
      desc: '3D carved haveli gate doors, embroidered silk Antarpat drops, wax-sealed envelopes, rising sky lanterns, pink satin bows, and scratch-to-reveal dates.',
    },
    {
      num: '03.',
      title: 'Written for Friends & Dadi Alike',
      desc: 'One-tap bilingual switching between crisp English and traditional, respectful Hindi phrasing so grandparents read effortlessly alongside college friends.',
    },
    {
      num: '04.',
      title: 'WhatsApp-Native RSVP & Catering Headcount',
      desc: 'No app downloads for relatives. Guests tap RSVP, pick functions, and their headcount comes straight to your WhatsApp while updating your function-wise tally.',
    },
  ];

  const invitedTitles = CEREMONIES.filter((c) => effectiveCeremonies.includes(c.id))
    .map((c) => c.title.en)
    .join(', ');

  const whatsappInviteUrl = `https://wa.me/?text=${encodeURIComponent(
    `Namaste ${effectiveGuestName}! You are warmly invited to celebrate with us (${invitedTitles}). Open your personal invitation here: ${window.location.origin}/?guest=${encodeURIComponent(effectiveGuestName)}`
  )}`;

  return (
    <section
      id="studio"
      className="bg-[#FAF6EE] py-20 sm:py-28 px-6 border-b border-[#D8C8AA]"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs tracking-[0.18em] uppercase text-[#9E2A2B] font-medium">
            <span>NIMANTRAN Parivar Links &amp; Interactive Studio</span>
            <span aria-hidden="true">·</span>
            <span className="line-through text-[#6D5A49]">₹999</span>
            <span aria-hidden="true">→</span>
            <span className="font-bold text-[#15803D]">FREE</span>
          </div>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl font-semibold text-[#231B15] text-balance">
            Every Guest Greeted by Name, Only for Their Functions
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left 7 Columns: Editorial Numbered Capabilities */}
          <div className="lg:col-span-7 divide-y divide-[#D8C8AA]">
            {capabilities.map((cap) => (
              <div key={cap.num} className="py-6 first:pt-0 last:pb-0">
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#231B15]">
                  <span className="mr-3 font-sans text-sm font-semibold tabular-nums text-[#9E2A2B]">
                    {cap.num}
                  </span>
                  {cap.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-[#5C4B3D] leading-relaxed pl-9">
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Right 5 Columns: Interactive Aangan Family Link & WhatsApp RSVP Simulator */}
          <div className="lg:col-span-5 rounded-xl border border-[#C88A2B]/55 bg-[#F2EAD9]/75 p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-[#D8C8AA] pb-4">
              <div>
                <p className="text-[11px] tracking-[0.16em] uppercase text-[#15803D] font-semibold">
                  Parivar Link Builder · <span className="line-through opacity-75">₹999</span> FREE
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-[#231B15]">
                  Personal Family Links
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSimLang((l) => (l === 'en' ? 'hi' : 'en'))}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#C8B493] bg-[#FAF6EE] px-3 py-1.5 text-xs font-medium text-[#231B15] hover:bg-white cursor-pointer whitespace-nowrap shrink-0"
              >
                <Globe2 className="h-3.5 w-3.5 text-[#9E2A2B]" />
                <span>{simLang === 'en' ? 'हिन्दी' : 'English'}</span>
              </button>
            </div>

            {/* Preset Family Switcher OR Custom Guest Input */}
            <div className="mt-4">
              <span className="flex items-center gap-1.5 text-xs text-[#5C4B3D]">
                <Users className="h-3.5 w-3.5 text-[#9E2A2B]" />
                <span>Choose sample family or type any guest name:</span>
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {FAMILY_PROFILES.map((fam) => (
                  <button
                    key={fam.id}
                    type="button"
                    onClick={() => {
                      setCustomGuestName('');
                      setSelectedFamilyId(fam.id);
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      !customGuestName.trim() && fam.id === activeProfile.id
                        ? 'bg-[#231B15] text-[#FAF6EE]'
                        : 'bg-[#FAF6EE] text-[#5C4B3D] border border-[#D8C8AA] hover:text-[#231B15]'
                    }`}
                  >
                    {fam.familyName[simLang]}
                  </button>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Plus className="h-3.5 w-3.5 text-[#9E2A2B] shrink-0" />
                <input
                  type="text"
                  value={customGuestName}
                  onChange={(e) => setCustomGuestName(e.target.value)}
                  placeholder="Or type custom family (e.g. Verma Family)"
                  className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-1.5 text-xs text-[#231B15] placeholder:text-[#8C7A6B] focus:border-[#9E2A2B] focus:outline-none"
                />
              </div>
            </div>

            {/* Simulated Guest View with Interactive Ceremony Toggles */}
            <div className="mt-4 rounded-lg border border-[#D8C8AA] bg-[#FAF6EE] p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#6D5A49]">
                <span className="font-mono truncate max-w-[205px]">
                  invitationcards.site/?guest={effectiveGuestName.toLowerCase().replace(/\s+/g, '-')}
                </span>
                <span className="text-[#15803D] font-semibold tabular-nums">
                  {effectiveCeremonies.length} of {CEREMONIES.length} functions visible
                </span>
              </div>

              <p className="font-display text-xl font-semibold text-[#231B15]">
                {simLang === 'en'
                  ? `Padharo, ${effectiveGuestName}`
                  : `पधारो, ${effectiveGuestName}`}
              </p>

              <div className="space-y-1.5 pt-1">
                {CEREMONIES.map((c) => {
                  const visible = effectiveCeremonies.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        if (!customGuestName.trim()) {
                          setCustomGuestName(activeProfile.familyName[simLang]);
                        }
                        toggleCeremonyForCustom(c.id);
                      }}
                      className={`w-full flex items-center justify-between rounded px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                        visible
                          ? 'bg-[#F2EAD9]/85 text-[#231B15]'
                          : 'bg-stone-100/70 text-[#9D8B74] line-through'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Check
                          className={`h-3.5 w-3.5 ${
                            visible ? 'text-[#15803D]' : 'opacity-25'
                          }`}
                        />
                        {c.title[simLang]}
                      </span>
                      <span className="tabular-nums">{c.time}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulated Auto-Formatted WhatsApp Reply & Share Link */}
            <div className="mt-4 rounded-lg border border-[#2F6B4F]/30 bg-[#FAF6EE] p-3.5 text-xs text-[#231B15]">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[#15803D] font-semibold">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>WhatsApp Link &amp; RSVP Payload (FREE)</span>
                </div>
                <a
                  href={whatsappInviteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-[#15803D] px-2.5 py-1 text-[11px] font-medium text-white hover:bg-[#166534] whitespace-nowrap shrink-0"
                >
                  <Send className="h-3 w-3" />
                  <span>Share Link</span>
                </a>
              </div>
              <p className="mt-1.5 text-[#4A3B2F] leading-relaxed">
                “Namaste! {effectiveGuestName} confirmed for {invitedTitles}.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
