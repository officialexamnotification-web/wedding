import React, { useState } from 'react';
import { Compass, Plane, Ship, BedDouble, ExternalLink } from 'lucide-react';
import { Language } from '../data/weddingData';

interface VenueStaySectionProps {
  language: Language;
}

export const VenueStaySection: React.FC<VenueStaySectionProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<'stay' | 'travel' | 'etiquette'>('stay');

  const content = {
    eyebrow: {
      en: 'Udaipur Hospitality · Travel & Stay',
      hi: 'उदयपुर आतिथ्य · यात्रा एवं प्रवास',
    },
    heading: {
      en: 'By the Waters of Lake Pichola',
      hi: 'पिछोला झील के सुरम्य तट पर',
    },
    lead: {
      en: 'All wedding ceremonies take place within the City Palace complex and Jagmandir Island Palace. Dedicated vintage boats and heritage chauffeurs will escort guests between venues.',
      hi: 'सभी मांगलिक कार्यक्रम सिटी पैलेस परिसर एवं जगमंदिर द्वीप महल में आयोजित हैं। अतिथियों हेतु नौका एवं वाहन की विशेष व्यवस्था रहेगी।',
    },
  };

  return (
    <section
      id="venue"
      className="bg-[#F2EAD9]/65 py-20 sm:py-28 px-6 border-t border-[#D8C8AA]"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Editorial Architectural Narrative & Segmented Travel Guide */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <p className="text-xs tracking-[0.22em] uppercase text-[#9E2A2B] font-medium">
                {content.eyebrow[language]}
              </p>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl font-semibold text-[#231B15] text-balance">
                {content.heading[language]}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#4A3B2F] leading-relaxed max-w-2xl">
                {content.lead[language]}
              </p>

              {/* Segmented Guide Tabs */}
              <div className="mt-7 inline-flex items-center gap-1 rounded-lg border border-[#D8C8AA] bg-[#FAF6EE] p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('stay')}
                  className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTab === 'stay'
                      ? 'bg-[#9E2A2B] text-[#FAF6EE]'
                      : 'text-[#5C4B3D] hover:text-[#231B15]'
                  }`}
                >
                  {language === 'en' ? 'Heritage Stays' : 'शाही प्रवास'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('travel')}
                  className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTab === 'travel'
                      ? 'bg-[#9E2A2B] text-[#FAF6EE]'
                      : 'text-[#5C4B3D] hover:text-[#231B15]'
                  }`}
                >
                  {language === 'en' ? 'Arrivals & Boats' : 'आगमन एवं नौका'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('etiquette')}
                  className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTab === 'etiquette'
                      ? 'bg-[#9E2A2B] text-[#FAF6EE]'
                      : 'text-[#5C4B3D] hover:text-[#231B15]'
                  }`}
                >
                  {language === 'en' ? 'November Weather' : 'मौसम सलाह'}
                </button>
              </div>

              {/* Dynamic Tab Details */}
              <div className="mt-6 border-t border-[#D8C8AA] pt-6 space-y-5">
                {activeTab === 'stay' && (
                  <>
                    <div className="flex items-start gap-3.5">
                      <BedDouble className="h-5 w-5 text-[#9E2A2B] shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-display text-2xl font-semibold text-[#231B15]">
                          {language === 'en'
                            ? 'Taj Fateh Prakash Palace & Shiv Niwas'
                            : 'ताज फतेह प्रकाश एवं शिव निवास पैलेस'}
                        </h3>
                        <p className="mt-1 text-sm text-[#5C4B3D] leading-relaxed">
                          {language === 'en'
                            ? 'Reserved suites are held under the Singhania–Rathore Wedding Block from 12–15 November. Check-in opens at 12:00 PM with traditional aarti welcome.'
                            : '12–15 नवम्बर के लिए सिंघानिया–राठौड़ विवाह अतिथि ब्लॉक में कक्ष आरक्षित हैं। पारंपरिक आरती एवं तिलक के साथ स्वागत।'}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'travel' && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3.5">
                      <Plane className="h-5 w-5 text-[#9E2A2B] shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-display text-2xl font-semibold text-[#231B15]">
                          {language === 'en'
                            ? 'Maharana Pratap Airport (UDR) · 40 mins'
                            : 'महाराणा प्रताप हवाई अड्डा (UDR) · 40 मिनट'}
                        </h3>
                        <p className="mt-1 text-sm text-[#5C4B3D] leading-relaxed">
                          {language === 'en'
                            ? 'Share your flight number in the RSVP form below so our hospitality desk can arrange your private airport transfer.'
                            : 'नीचे स्वीकृति पत्र में अपनी उड़ान का विवरण लिखें ताकि हमारे प्रतिनिधि आपका स्वागत कर सकें।'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3.5">
                      <Ship className="h-5 w-5 text-[#C88A2B] shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-display text-2xl font-semibold text-[#231B15]">
                          {language === 'en'
                            ? 'Bansi Ghat Jetty to Jagmandir Island'
                            : 'बंसी घाट से जगमंदिर नौका विहार'}
                        </h3>
                        <p className="mt-1 text-sm text-[#5C4B3D] leading-relaxed">
                          {language === 'en'
                            ? 'Continuous private boats ferry guests across Lake Pichola for Friday’s Sangeet Gala starting at 7:00 PM.'
                            : 'शुक्रवार की संगीत संध्या हेतु रात्रि 7:00 बजे से लगातार निजी नौकाएँ उपलब्ध रहेंगी।'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'etiquette' && (
                  <div className="flex items-start gap-3.5">
                    <Compass className="h-5 w-5 text-[#9E2A2B] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-[#231B15]">
                        {language === 'en'
                          ? 'Crisp Heritage Evenings (15°C – 26°C)'
                          : 'सुहावनी गुलाबी ठंड (15°C – 26°C)'}
                      </h3>
                      <p className="mt-1 text-sm text-[#5C4B3D] leading-relaxed">
                        {language === 'en'
                          ? 'Afternoons in the courtyards are warm and sunlit, while lakeside nights drop to a pleasant chill. Pashmina shawls will also be provided at Jagmandir.'
                          : 'दोपहर में हल्की गुनगुनी धूप रहेगी और झील किनारे रात में सुहावनी ठंडक होगी। जगमंदिर में शॉल की व्यवस्था भी रहेगी।'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* External Google Maps Directions Link (clean anchor, no window.open) */}
            <div className="mt-8 pt-6 border-t border-[#D8C8AA] flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-[#5C4B3D]">
                <span className="font-medium text-[#231B15]">City Palace Complex</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span className="tabular-nums">24.5764° N, 73.6835° E</span>
              </div>
              <a
                href="https://maps.google.com/?q=City+Palace+Udaipur+Rajasthan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[#231B15]/25 bg-[#FAF6EE] px-4 py-2 text-xs font-medium text-[#231B15] transition-colors hover:bg-[#231B15] hover:text-[#FAF6EE] whitespace-nowrap shrink-0"
              >
                <span>{language === 'en' ? 'Open Palace Directions' : 'मानचित्र देखें'}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Full-height Framed Heritage Palace Visual */}
          <div className="lg:col-span-5">
            <div className="relative h-full min-h-[380px] overflow-hidden rounded-t-[180px] rounded-b-xl border border-[#C88A2B]/50 bg-[#1B130E] shadow-lg">
              <img
                src="/src/assets/images/sangeet_palace_night_1794564898780.jpg"
                alt="Jagmandir Island Palace on Lake Pichola lit by lanterns at night"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-[#FAF6EE]">
                <p className="text-[11px] tracking-[0.2em] uppercase text-[#E6B86A]">
                  {language === 'en' ? 'Featured Venue' : 'मुख्य समारोह स्थल'}
                </p>
                <p className="mt-1 font-display text-2xl font-semibold">
                  {language === 'en'
                    ? 'Jagmandir & Zenana Mahal'
                    : 'जगमंदिर एवं ज़नाना महल'}
                </p>
                <p className="mt-1 text-xs text-[#FAF6EE]/80">
                  {language === 'en'
                    ? '17th-century lakeside sandstone courtyards'
                    : 'सत्रहवीं शताब्दी की ऐतिहासिक बलुआ पत्थर हवेली'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
