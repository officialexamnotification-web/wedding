import React, { useState } from 'react';
import { Check, ChevronDown, Sparkles, ShieldCheck } from 'lucide-react';
import { PricingPlan, STUDIO_FAQ, STUDIO_PLANS } from '../data/studioData';

interface PricingAndFaqSectionProps {
  selectedPlanId: string | null;
  onSelectPlan: (plan: PricingPlan) => void;
  groomName: string;
  brideName: string;
}

export const PricingAndFaqSection: React.FC<PricingAndFaqSectionProps> = ({
  selectedPlanId,
  onSelectPlan,
  groomName,
  brideName,
}) => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [contactInput, setContactInput] = useState('');
  const [bookedPlan, setBookedPlan] = useState<PricingPlan | null>(null);

  const activePlan =
    STUDIO_PLANS.find((p) => p.id === selectedPlanId) || STUDIO_PLANS[0];

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInput.trim()) return;
    setBookedPlan(activePlan);
  };

  return (
    <>
      {/* ==================== PRICING SECTION (ALL CROSSED OUT -> FREE) ==================== */}
      <section
        id="pricing"
        className="bg-[#F2EAD9]/65 py-20 sm:py-28 px-6 border-b border-[#D8C8AA]"
      >
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs tracking-[0.16em] uppercase text-[#9E2A2B] font-medium">
              <span>All Cards &amp; Studio Tools Unlocked</span>
              <span aria-hidden="true">·</span>
              <span className="line-through text-[#6D5A49]">₹1,699 – ₹8,400</span>
              <span aria-hidden="true">→</span>
              <span className="font-bold text-[#15803D]">100% FREE (₹0)</span>
            </div>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl font-semibold text-[#231B15] text-balance">
              Every Design &amp; Parivar Link — Now Free
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#5C4B3D] leading-relaxed">
              All original template prices (₹499 to ₹2,000) are crossed out. Customize any wedding or celebration card, add your photos &amp; music, and share on WhatsApp for ₹0.
            </p>
          </div>

          {/* 4-Tier Pricing Grid with Crossed-Out Prices -> FREE */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {STUDIO_PLANS.map((plan) => {
              const isSelected = plan.id === selectedPlanId;
              return (
                <div
                  key={plan.id}
                  className={`flex flex-col justify-between rounded-xl border p-6 transition-all ${
                    plan.recommended
                      ? 'border-[#15803D] bg-[#FAF6EE] shadow-md'
                      : isSelected
                        ? 'border-[#C88A2B] bg-[#FAF6EE]'
                        : 'border-[#D8C8AA] bg-[#FAF6EE]/85'
                  }`}
                >
                  <div>
                    <p className="text-[11px] tracking-[0.16em] uppercase text-[#9E2A2B] font-medium">
                      {plan.badge}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-[#231B15]">
                      {plan.name}
                    </h3>

                    <div className="mt-4 flex flex-wrap items-baseline gap-2.5 border-b border-[#D8C8AA] pb-4">
                      <span className="font-display text-2xl tabular-nums text-[#8C7A6B] line-through">
                        {plan.originalPrice}
                      </span>
                      <span className="font-display text-4xl font-bold tabular-nums text-[#15803D]">
                        {plan.price}
                      </span>
                      <span className="text-xs font-medium text-[#6D5A49]">/ {plan.period}</span>
                    </div>

                    <p className="mt-4 text-xs sm:text-sm text-[#5C4B3D] leading-relaxed">
                      {plan.summary}
                    </p>

                    <ul className="mt-5 space-y-2.5">
                      {plan.highlights.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-xs text-[#231B15]"
                        >
                          <Check className="h-3.5 w-3.5 shrink-0 text-[#15803D] mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setBookedPlan(null);
                      onSelectPlan(plan);
                    }}
                    className={`mt-7 w-full rounded-lg px-4 py-2.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      plan.recommended || isSelected
                        ? 'bg-[#9E2A2B] text-[#FAF6EE] hover:bg-[#822021]'
                        : 'border border-[#C8B493] bg-[#F2EAD9] text-[#231B15] hover:bg-[#E7DAC0]'
                    }`}
                  >
                    {plan.ctaLabel}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Interactive Free Studio Activation Panel */}
          <div className="mt-10 rounded-xl border border-[#15803D]/45 bg-[#FAF6EE] p-6 sm:p-8">
            {!bookedPlan ? (
              <form
                onSubmit={handlePlanSubmit}
                className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
              >
                <div className="space-y-1.5 max-w-xl">
                  <p className="inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.14em] uppercase text-[#15803D]">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>
                      Selected: {activePlan.name} (
                      <span className="line-through opacity-75 mr-1">{activePlan.originalPrice}</span>
                      FREE · ₹0)
                    </span>
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#231B15]">
                    Send Free Studio Link for {groomName || 'Aarav'} &amp; {brideName || 'Meera'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C4B3D]">
                    Enter your WhatsApp number or email to save your free personalized invitation workspace link.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                  <input
                    type="text"
                    required
                    value={contactInput}
                    onChange={(e) => setContactInput(e.target.value)}
                    placeholder="WhatsApp number or email"
                    className="w-full sm:w-64 rounded-lg border border-[#C8B493] bg-white px-4 py-2.5 text-sm text-[#231B15] placeholder:text-[#9D8B74] focus:border-[#9E2A2B] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-[#15803D] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#166534] cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Claim Free Access (₹0)
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.16em] uppercase text-[#15803D] font-semibold">
                    100% Free Workspace Activated · {bookedPlan.name}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-semibold text-[#231B15]">
                    Free invite workspace ready for {groomName || 'Aarav'} &amp; {brideName || 'Meera'}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-[#5C4B3D]">
                    Details prepared for <span className="font-medium text-[#231B15]">{contactInput}</span> (₹0 charged).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setBookedPlan(null)}
                  className="rounded-lg border border-[#C8B493] bg-[#F2EAD9] px-4 py-2 text-xs font-medium text-[#231B15] hover:bg-[#E7DAC0] cursor-pointer whitespace-nowrap shrink-0"
                >
                  Update Contact
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==================== FAQ SECTION ==================== */}
      <section id="faq" className="bg-[#FAF6EE] py-20 sm:py-24 px-6 border-b border-[#D8C8AA]">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs tracking-[0.22em] uppercase text-[#9E2A2B] font-medium">
              Questions &amp; Privacy
            </p>
            <h2 className="mt-2 font-display text-4xl font-semibold text-[#231B15]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-10 divide-y divide-[#D8C8AA] border-y border-[#D8C8AA]">
            {STUDIO_FAQ.map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div key={item.q} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <span className="font-display text-xl sm:text-2xl font-semibold text-[#231B15]">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#9E2A2B] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-sm sm:text-base text-[#5C4B3D] leading-relaxed pr-8">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#6D5A49]">
            <ShieldCheck className="h-4 w-4 text-[#2F6B4F] shrink-0" />
            <span>
              Your family photographs and guest lists stay strictly private—never used to train AI models.
            </span>
          </div>
        </div>
      </section>
    </>
  );
};
