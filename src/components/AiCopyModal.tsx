import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, Plus, RefreshCw, BookOpen } from 'lucide-react';
import { PRESET_WORDINGS, generateAiWording, WordingSnippet } from '../utils/aiWording';

interface AiCopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertText: (text: string, font: string, size: number) => void;
}

export const AiCopyModal: React.FC<AiCopyModalProps> = ({ isOpen, onClose, onInsertText }) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'presets'>('generate');
  const [eventType, setEventType] = useState('Royal Indian Wedding');
  const [names, setNames] = useState('Vikramaditya & Ananya');
  const [tone, setTone] = useState('Regal & Traditional');
  const [language, setLanguage] = useState<'english' | 'hindi'>('hindi');
  const [notes, setNotes] = useState('');
  const [generatedText, setGeneratedText] = useState(
    '|| श्री गणेशाय नमः ||\nमान्यवर, परमपिता परमेश्वर की असीम अनुकंपा से हमारे सुपुत्र एवं सुपुत्री का पावन परिणय संस्कार संपन्न होने जा रहा है।\nइस मांगलिक अवसर पर आप सपरिवार पधारकर वर-वधू को अपना शुभाशीर्वाद प्रदान करें।\n\nदर्शनाभिलाषी: समस्त परिवार'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateAiWording(eventType, names, tone, language, notes);
      setGeneratedText(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = (text: string, isHindi: boolean) => {
    const font = isHindi ? "'Tiro Devanagari Hindi', serif" : "'Playfair Display', serif";
    const size = isHindi ? 14 : 13;
    onInsertText(text, font, size);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in select-none">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-100">
                AI Invitation Copywriter & Traditional Shlokas
              </h3>
              <p className="text-[11px] text-neutral-400">
                Generate authentic Sanskrit shlokas, Hindi quotes, and royal wedding invitations
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

        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-800 bg-neutral-950/60 text-xs">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'generate'
                ? 'bg-purple-600 text-white font-semibold shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Smart Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'presets'
                ? 'bg-purple-600 text-white font-semibold shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sanskrit Shlokas & Presets</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'generate' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-neutral-300 font-medium block mb-1">Occasion / Event:</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-lg p-2 outline-none focus:border-purple-500"
                  >
                    <option value="Royal Indian Wedding">Shubh Vivah (Wedding)</option>
                    <option value="Sangeet & Mehendi Night">Sangeet & Mehendi Night</option>
                    <option value="Shubh Griha Pravesh">Griha Pravesh (Housewarming)</option>
                    <option value="1st Birthday Party">1st Birthday Party</option>
                    <option value="Baby Shower / Godh Bharai">Baby Shower / Godh Bharai</option>
                    <option value="25th Silver Wedding Anniversary">Silver/Golden Anniversary</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 font-medium block mb-1">Language:</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-lg p-2 outline-none focus:border-purple-500"
                  >
                    <option value="hindi">Hindi / Shuddha Hindi</option>
                    <option value="english">English (Luxury Formal)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-neutral-300 font-medium block mb-1">Couple / Host Names:</label>
                  <input
                    type="text"
                    value={names}
                    onChange={(e) => setNames(e.target.value)}
                    placeholder="e.g. Vikram & Ananya"
                    className="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-lg p-2 outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 font-medium block mb-1">Tone & Aesthetic:</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-lg p-2 outline-none focus:border-purple-500"
                  >
                    <option value="Regal & Traditional">Regal & Traditional</option>
                    <option value="Modern & Poetic">Modern & Poetic</option>
                    <option value="Warm & Heartfelt">Warm & Heartfelt</option>
                    <option value="Playful & Fun">Playful & Fun</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Composing Invitation Wording...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate AI Invitation Text</span>
                  </>
                )}
              </button>

              {/* Output Display */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Generated Card Copy:</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-purple-300 hover:text-purple-200 transition"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-amber-200 font-serif leading-relaxed whitespace-pre-line min-h-[90px]">
                  {generatedText}
                </div>

                <button
                  onClick={() => handleInsert(generatedText, language === 'hindi')}
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Insert this Text into Card Canvas
                </button>
              </div>
            </div>
          ) : (
            /* PRESETS LIST */
            <div className="space-y-3">
              {PRESET_WORDINGS.map((preset) => (
                <div
                  key={preset.id}
                  className="p-3.5 rounded-xl bg-neutral-800/70 border border-neutral-700/60 space-y-2 hover:border-purple-500/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-neutral-200">{preset.title}</span>
                      <span className="text-[10px] text-neutral-400 ml-2">({preset.category})</span>
                    </div>
                    <button
                      onClick={() => handleInsert(preset.content, preset.language !== 'english')}
                      className="px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white rounded text-[11px] font-medium transition"
                    >
                      + Insert on Card
                    </button>
                  </div>
                  <p className="text-amber-200/90 text-xs font-serif whitespace-pre-line bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800">
                    {preset.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
