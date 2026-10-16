export interface BackgroundOption {
  id: string;
  name: string;
  type: 'color' | 'gradient' | 'pattern';
  value: string;
  previewClass: string;
  category: 'royal' | 'pastel' | 'traditional' | 'minimal';
}

export const BACKGROUNDS: BackgroundOption[] = [
  // Royal & Velvet
  {
    id: 'royal-burgundy',
    name: 'Royal Velvet Maroon',
    type: 'gradient',
    value: 'radial-gradient(circle at 50% 30%, #5e0b1d 0%, #3d0510 50%, #200007 100%)',
    previewClass: 'bg-[#3d0510]',
    category: 'royal',
  },
  {
    id: 'emerald-luxury',
    name: 'Deep Emerald & Gold',
    type: 'gradient',
    value: 'radial-gradient(circle at 50% 30%, #0d3826 0%, #062316 60%, #02120b 100%)',
    previewClass: 'bg-[#062316]',
    category: 'royal',
  },
  {
    id: 'midnight-sapphire',
    name: 'Midnight Royal Blue',
    type: 'gradient',
    value: 'radial-gradient(circle at 50% 35%, #132742 0%, #0a1728 60%, #040912 100%)',
    previewClass: 'bg-[#0a1728]',
    category: 'royal',
  },
  {
    id: 'imperial-purple',
    name: 'Imperial Purple',
    type: 'gradient',
    value: 'radial-gradient(circle at 50% 30%, #3c1340 0%, #220826 65%, #100213 100%)',
    previewClass: 'bg-[#220826]',
    category: 'royal',
  },

  // Traditional Festive
  {
    id: 'festive-haldi-yellow',
    name: 'Haldi & Marigold Ochre',
    type: 'gradient',
    value: 'linear-gradient(135deg, #fff7d6 0%, #fed876 50%, #fca311 100%)',
    previewClass: 'bg-[#fed876]',
    category: 'traditional',
  },
  {
    id: 'vermilion-kumkum',
    name: 'Vermilion Kumkum Red',
    type: 'gradient',
    value: 'linear-gradient(145deg, #991b1b 0%, #7f1d1d 60%, #450a0a 100%)',
    previewClass: 'bg-[#7f1d1d]',
    category: 'traditional',
  },

  // Pastels & Modern
  {
    id: 'ivory-parchment',
    name: 'Royal Ivory Parchment',
    type: 'gradient',
    value: 'radial-gradient(circle at 50% 40%, #fffdf8 0%, #fbf6ec 70%, #f4ebd7 100%)',
    previewClass: 'bg-[#fbf6ec]',
    category: 'pastel',
  },
  {
    id: 'blush-rose',
    name: 'Blush Rose & Champagne',
    type: 'gradient',
    value: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%)',
    previewClass: 'bg-[#ffe4e6]',
    category: 'pastel',
  },
  {
    id: 'sage-mint',
    name: 'Sage Green Serenity',
    type: 'gradient',
    value: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 60%, #bbf7d0 100%)',
    previewClass: 'bg-[#dcfce7]',
    category: 'pastel',
  },
  {
    id: 'lavender-mist',
    name: 'Lavender Mist',
    type: 'gradient',
    value: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 60%, #e9d5ff 100%)',
    previewClass: 'bg-[#f3e8ff]',
    category: 'pastel',
  },

  // Minimalist
  {
    id: 'classic-obsidian',
    name: 'Obsidian & Gold Minimal',
    type: 'color',
    value: '#121212',
    previewClass: 'bg-[#121212]',
    category: 'minimal',
  },
  {
    id: 'pure-snow',
    name: 'Pure Snow White',
    type: 'color',
    value: '#ffffff',
    previewClass: 'bg-[#ffffff] border border-neutral-300',
    category: 'minimal',
  },
];
