
import React, { useState } from 'react';
import { Language, BirthDetailsForm, ChartResponse } from '../types';
import { calculateGemstone } from '../services/gemstoneService';
import { fetchChartData } from '../services/astrologyService';
import { t } from '../services/translations';
import { downloadPDF } from '../services/pdfService';
import { InputForm } from './InputForm';
import { Diamond, ArrowLeft, Loader, Download, Edit2, RotateCcw, Gem, Shield, AlertTriangle } from 'lucide-react';

interface Props {
  lang: Language;
  onBack: () => void;
}

export const Gemstones: React.FC<Props> = ({ lang, onBack }) => {
  const [gemstoneData, setGemstoneData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [clientName, setClientName] = useState('');
  // Store details to enable edit mode
  const [formData, setFormData] = useState<BirthDetailsForm | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (data: BirthDetailsForm) => {
    setFormData(data);
    setLoading(true);
    setError('');
    setClientName(data.name);
    setShowForm(false);
    try {
        // First get chart data (Swiss Ephemeris)
        const chartData: ChartResponse = await fetchChartData(data);
        // Then calculate gemstone based on Lagna
        const gemData = calculateGemstone(chartData);
        setGemstoneData(gemData);
    } catch (e) {
        setGemstoneData(null);
        setError(e instanceof Error ? e.message : 'Could not calculate the birth chart. No gemstone result was generated.');
    } finally {
        setLoading(false);
    }
  };

  const handleEdit = () => {
     setError('');
     setShowForm(true);
     // formData is already set, will be passed to InputForm
  };

  const handleNew = () => {
     setError('');
     setFormData(null);
     setShowForm(true);
  };

  const handleDownload = () => {
    if (gemstoneData) {
        downloadPDF('gemstones-report', `Gemstones_${clientName}.pdf`);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in pb-10">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="flex items-center text-saffron-400 hover:text-saffron-200">
            <ArrowLeft size={16} className="mr-1"/> Back
        </button>

        {/* Action Bar */}
        {gemstoneData && !showForm && (
            <div className="flex gap-2">
                 <button
                    onClick={handleEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron-900/20 border border-saffron-500/30 text-saffron-300 hover:bg-saffron-900/40 text-sm transition-colors"
                  >
                    <Edit2 size={14} /> Edit Details
                  </button>
                  <button
                    onClick={handleNew}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron-900/20 border border-saffron-500/30 text-saffron-300 hover:bg-saffron-900/40 text-sm transition-colors"
                  >
                     <RotateCcw size={14} /> New Check
                  </button>
            </div>
        )}
      </div>

      <div className="grid md:grid-cols-12 gap-8">
         <div className="md:col-span-12 bg-maroon-900/60 backdrop-blur-md border border-saffron-900/30 rounded-2xl overflow-hidden shadow-2xl print:bg-white print:border-2 print:border-gray-400 print:shadow-none print:rounded-none">
            <div className="p-6 border-b border-saffron-900/30 bg-black/20 flex justify-between items-center print:bg-white print:border-b-2 print:border-gray-400">
                <div>
                    <h2 className="text-2xl font-serif text-saffron-100 flex items-center gap-2 print:text-black">
                        <Diamond className="text-saffron-500 print:text-gray-700" /> {t('gemstones', lang)}
                    </h2>
                    <p className="text-saffron-600 text-sm mt-1 print:text-gray-700">{t('gemstones_desc', lang)}</p>
                </div>
                {gemstoneData && (
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 bg-saffron-900/30 border border-saffron-500/30 text-saffron-200 px-3 py-1.5 rounded-lg hover:bg-saffron-900/50 transition-colors text-sm print:hidden"
                    >
                        <Download size={16} />
                        <span className="hidden sm:inline">PDF</span>
                    </button>
                )}
            </div>

            <div className="p-6 md:p-8">
                {error && <div role="alert" className="mb-5 rounded-lg border border-red-800/60 bg-red-950/40 px-4 py-3 text-sm text-red-200"><p>{error}</p><button type="button" onClick={() => { setError(''); setShowForm(true); }} className="mt-2 underline underline-offset-2">Edit details and retry</button></div>}
                {showForm && !loading && (
                    <div className="flex flex-col items-center print:hidden">
                        <p className="text-saffron-200/80 mb-8 text-center max-w-xl">
                            This report shows a traditional gemstone association with the calculated ascendant lord. It does not determine personal suitability or promise an effect.
                        </p>
                        <InputForm
                            onSubmit={handleSubmit}
                            isLoading={loading}
                            lang={lang}
                            initialValues={formData}
                        />
                    </div>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 print:hidden">
                        <div className="relative">
                            <div className="absolute inset-0 bg-saffron-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                            <Diamond className="w-16 h-16 text-saffron-400 animate-bounce relative z-10" />
                        </div>
                        <p className="text-saffron-200/80 font-serif mt-6 animate-pulse text-lg">Analyzing planetary vibrations...</p>
                    </div>
                )}

                {gemstoneData && !showForm && (
                    <div className="animate-fade-in" id="gemstones-report">
                         <div className="mb-6 pb-4 border-b border-saffron-900/30 print:border-b-2 print:border-gray-400">
                            <h3 className="text-2xl font-serif text-saffron-100 print:text-black">रत्न विवरण - {clientName}</h3>
                            <p className="text-saffron-500 text-sm print:text-gray-700">Traditional association from the calculated ascendant; not a personal gemstone prescription.</p>
                        </div>

                        {/* Traditional association */}
                        <h4 className="text-lg font-serif text-saffron-400 mb-3 print:text-black">1. पारंपरिक रत्न संबंध (Traditional Association)</h4>
                        <div className="bg-saffron-900/20 border border-saffron-500/30 rounded-xl p-6 mb-6 print:bg-white print:border-2 print:border-gray-400 print:shadow-none">
                            <div className="flex items-center gap-3 mb-4">
                                <Gem className="text-saffron-500 print:text-gray-700" size={24} />
                                <h4 className="text-xl font-serif text-saffron-200 print:text-black">लग्नेश से पारंपरिक संबंध</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-saffron-400 text-sm mb-1 print:text-gray-700">रत्न (Gemstone)</p>
                                    <p className="text-saffron-100 font-semibold print:text-black">{gemstoneData.lifeStone.name}</p>
                                    <p className="text-saffron-500 text-sm print:text-gray-600">{gemstoneData.lifeStone.hindiName}</p>
                                </div>
                                <div>
                                    <p className="text-saffron-400 text-sm mb-1 print:text-gray-700">शासक ग्रह (Ruling Planet)</p>
                                    <p className="text-saffron-100 font-semibold print:text-black">{gemstoneData.lifeStone.planet}</p>
                                </div>
                                <div>
                                    <p className="text-saffron-400 text-sm mb-1 print:text-gray-700">रंग (Color)</p>
                                    <p className="text-saffron-100 print:text-black">{gemstoneData.lifeStone.color}</p>
                                </div>
                            </div>
                        </div>

                        {/* Lagna Info */}
                        <h4 className="text-lg font-serif text-saffron-400 mb-3 print:text-black">2. लग्न विवरण (Lagna Information)</h4>
                        <div className="bg-saffron-900/20 border border-saffron-500/30 rounded-xl p-4 mb-6 print:bg-white print:border-2 print:border-gray-400 print:shadow-none">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-saffron-400 print:text-gray-700">लग्न राशि (Lagna Sign)</p>
                                    <p className="text-saffron-100 print:text-black">{gemstoneData.lagnaSign}</p>
                                </div>
                                <div>
                                    <p className="text-saffron-400 print:text-gray-700">लग्नेश (Lagna Lord)</p>
                                    <p className="text-saffron-100 print:text-black">{gemstoneData.lagnaLord}</p>
                                </div>
                            </div>
                        </div>

                        {/* Suitability Check */}
                        <h4 className="text-lg font-serif text-saffron-400 mb-3 print:text-black">3. पारंपरिक लग्नेश संबंध (Traditional Association)</h4>
                        <div className="border border-yellow-700/50 bg-yellow-900/20 rounded-xl p-4 mb-6 print:rounded-lg print:border-2 print:bg-yellow-50 print:border-yellow-500">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="text-yellow-400 print:text-yellow-700" size={20} />
                                <h4 className="text-saffron-200 font-serif print:text-black">यह व्यक्तिगत रत्न सलाह नहीं है</h4>
                            </div>
                            <p className="text-saffron-100/90 text-sm print:text-gray-800">{gemstoneData.suitability.verdict}</p>
                        </div>

                        {/* No unverified wearing advice */}
                        <h4 className="text-lg font-serif text-saffron-400 mb-3 print:text-black">4. सावधानियाँ (Precautions)</h4>
                        <div className="bg-saffron-900/20 border border-saffron-500/30 rounded-xl p-4 mb-6 print:bg-white print:border-2 print:border-gray-400 print:shadow-none">
                            <h4 className="text-saffron-200 font-serif mb-3 print:text-black">यह रत्न पहनने की सलाह नहीं है</h4>
                            <ul className="space-y-2 text-sm text-saffron-100/90 print:text-gray-800">
                                {gemstoneData.wearingInstructions.map((instruction: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-saffron-500 print:text-gray-600">•</span>
                                        <span>{instruction}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                )}
            </div>
         </div>
      </div>
    </div>
  );
};
