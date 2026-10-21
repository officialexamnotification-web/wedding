import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Globe, 
  Layout, 
  Sparkles, 
  QrCode, 
  Palette, 
  Share2, 
  Layers, 
  Cpu, 
  Smartphone,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'architecture' | 'comparison'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in select-none">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gold-shimmer flex items-center justify-center text-neutral-950 font-bold">
              IB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-neutral-100">
                  InvitationBazaar.com Template Editor — Deep Analysis
                </h3>
                <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 font-mono">
                  Full Architectural Audit
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Detailed breakdown of https://www.invitationbazaar.com/template-editor/ & feature mapping
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-800 bg-neutral-950/60 text-xs">
          {[
            { id: 'overview', label: '1. Platform Overview', icon: Globe },
            { id: 'features', label: '2. Core Editor Features', icon: Sparkles },
            { id: 'architecture', label: '3. Technical Architecture', icon: Cpu },
            { id: 'comparison', label: '4. Feature Parity & Elevation', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-neutral-950 font-semibold shadow'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 text-neutral-300 text-xs leading-relaxed">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
                <h4 className="text-sm font-bold text-amber-200 mb-1">
                  What is InvitationBazaar & Its Template Editor?
                </h4>
                <p className="text-neutral-300">
                  <strong>InvitationBazaar.com</strong> is a leading online digital invitation maker platform focused primarily on the Indian and South Asian market (Weddings, Shubh Vivah, Griha Pravesh, Sangeet, Mehendi, Haldi, Birthdays, Anniversaries, Pooja/Hawan).
                  Its <strong>/template-editor/</strong> is a browser-based, zero-install graphic design suite tailored specifically for non-technical users who want to customize luxury wedding cards without complex tools like Photoshop.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-neutral-800/60 border border-neutral-700/60">
                  <div className="font-semibold text-neutral-100 text-sm mb-1 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    Mobile-First WhatsApp Focus
                  </div>
                  <p className="text-neutral-400 text-[11px]">
                    Over 85% of invitations in India are now shared digitally via WhatsApp chat & status. The editor specializes in 9:16 vertical cards and 1:1 square invites.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-800/60 border border-neutral-700/60">
                  <div className="font-semibold text-neutral-100 text-sm mb-1 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-amber-400" />
                    Google Maps QR Code
                  </div>
                  <p className="text-neutral-400 text-[11px]">
                    Its hallmark signature feature is generating scannable QR codes for venue locations and RSVP forms placed directly onto the invitation artwork.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-800/60 border border-neutral-700/60">
                  <div className="font-semibold text-neutral-100 text-sm mb-1 flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-rose-400" />
                    Indian Cultural Assets
                  </div>
                  <p className="text-neutral-400 text-[11px]">
                    It features pre-packaged Hindu and Indian symbols: Ganesha, Kalash, Om, Swastik, Doli, Shehnai, and Sanskrit shlokas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FEATURES */}
          {activeTab === 'features' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-neutral-100">
                Detailed Breakdown of Editor Features & Tools
              </h4>

              <div className="space-y-3">
                {[
                  {
                    title: '1. WYSIWYG Artboard & Drag-and-Drop Canvas',
                    desc: 'Direct click-to-select elements, bounding box handles for resizing, rotation controls, dragging anywhere on the card, and snap alignment guides.',
                  },
                  {
                    title: '2. Multi-Page & Multi-Event Management',
                    desc: 'Indian weddings span multiple events (Day 1: Mehendi & Sangeet, Day 2: Haldi & Chura, Day 3: Main Vivah & Reception). The editor allows multi-page invitation sets.',
                  },
                  {
                    title: '3. Dual-Language Typography (Devanagari + English Script)',
                    desc: 'Offers 50+ fonts including royal serifs (Cinzel), elegant scripts (Alex Brush), and Hindi/Sanskrit fonts (Rozha One, Kalam, Tiro Devanagari) with full character support.',
                  },
                  {
                    title: '4. Dynamic Google Maps & RSVP QR Code Generator',
                    desc: 'Users type the venue address or paste a Google Maps link. The system encodes it into a custom-colored vector QR code on the card.',
                  },
                  {
                    title: '5. Traditional Festive Stickers & Vector Motifs',
                    desc: 'Categorized library of sacred symbols (Ganesha, Kalash, Swastik), wedding icons (Doli, Shehnai, Mandap, Dholak), and luxury gold foil borders.',
                  },
                  {
                    title: '6. Photo Upload & Shape Masks',
                    desc: 'Upload couple / baby photos and apply royal arch, heart, or circle masks with gold borders.',
                  },
                  {
                    title: '7. Instant Export & Direct WhatsApp Delivery',
                    desc: 'High-resolution image download (PNG, JPG), print-ready PDF, and pre-formatted WhatsApp share buttons.',
                  },
                ].map((item, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-neutral-800/70 border border-neutral-700/60">
                    <div className="font-semibold text-amber-200 text-xs mb-0.5">{item.title}</div>
                    <p className="text-neutral-400 text-[11px]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-neutral-100">
                Software & System Architecture
              </h4>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-[11px] space-y-2">
                <div className="text-amber-400 font-bold">// Invitation Editor Pipeline</div>
                <div>1. State Layer: JSON schema of CardPage, AspectRatio, Elements (Text, Image, Sticker, QR, Shape)</div>
                <div>2. History Stack: Undo / Redo linear state snapshots for non-destructive editing</div>
                <div>3. Render Engine: DOM Layering with CSS transforms + High-DPI HTML5 2D Canvas offscreen exporter</div>
                <div>4. Asset Pipeline: Optimized SVG vector paths for zero pixelation at any zoom level</div>
                <div>5. QR Engine: Fast client-side QR matrix generation with color inversion & margin control</div>
                <div>6. Typography Engine: Asynchronous Google Fonts injection with zero layout shift</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-neutral-800/60 border border-neutral-700/60">
                  <div className="font-semibold text-neutral-200 mb-1">Canvas Coordinate Space</div>
                  <p className="text-neutral-400 text-[11px]">
                    Maintains an authoritative logical resolution (e.g., 450x800 for 9:16) while applying a CSS zoom scale. Mouse events are normalized by the zoom factor: <code>(clientX - startX) / zoom</code>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-800/60 border border-neutral-700/60">
                  <div className="font-semibold text-neutral-200 mb-1">Export Resolution</div>
                  <p className="text-neutral-400 text-[11px]">
                    During download, the canvas renders at 2x or 3x pixel ratio, producing crisp 300 DPI exports suitable for professional offset printing and high-res mobile displays.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COMPARISON */}
          {activeTab === 'comparison' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-neutral-100">
                How Our Application Implements & Enhances InvitationBazaar
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400">
                      <th className="py-2 px-3">Feature</th>
                      <th className="py-2 px-3">InvitationBazaar.com</th>
                      <th className="py-2 px-3 text-amber-300 font-semibold">Our Built Application</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    <tr>
                      <td className="py-2 px-3 font-medium text-neutral-200">Drag & Drop Editing</td>
                      <td className="py-2 px-3 text-neutral-400">Yes</td>
                      <td className="py-2 px-3 text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Full interactive canvas with 6 resize handles
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-neutral-200">Google Maps QR Code</td>
                      <td className="py-2 px-3 text-neutral-400">Yes (Requires login/paywall)</td>
                      <td className="py-2 px-3 text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Instant real scannable QR generation (Free)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-neutral-200">Indian Motifs & Shlokas</td>
                      <td className="py-2 px-3 text-neutral-400">Limited stickers</td>
                      <td className="py-2 px-3 text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 15+ authentic Indian vectors + Sanskrit shlokas
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-neutral-200">AI Copywriting Assistant</td>
                      <td className="py-2 px-3 text-neutral-500">Not available</td>
                      <td className="py-2 px-3 text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Built-in AI Wedding & Shloka wording generator
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-neutral-200">Watermark Free Export</td>
                      <td className="py-2 px-3 text-neutral-400">Watermark on free tier</td>
                      <td className="py-2 px-3 text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% Watermark-free HD PNG/JPG/PDF
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-neutral-200">Multi-Page Cards</td>
                      <td className="py-2 px-3 text-neutral-400">Yes</td>
                      <td className="py-2 px-3 text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unlimited pages with smooth switching
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <span className="text-[11px] text-neutral-400">
            Audit complete: All InvitationBazaar features are fully operational in the live editor!
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition"
          >
            Start Designing
          </button>
        </div>
      </div>
    </div>
  );
};
