export interface DesignColorPalette {
  name: string;
  mood: 'Royal' | 'Soft' | 'Modern' | 'Festive';
  colors: [string, string, string, string];
}

// Four coordinated colors per palette: page background, ink, accent, and highlight.
export const DESIGN_COLOR_PALETTES: DesignColorPalette[] = [
  { name: 'Ivory & Antique Gold', mood: 'Royal', colors: ['#FFF8EA', '#6D1D26', '#B8944E', '#342D25'] },
  { name: 'Crimson & Champagne', mood: 'Royal', colors: ['#F7ECE6', '#7A1E2B', '#D3B47D', '#FFFDF8'] },
  { name: 'Emerald & Heirloom Gold', mood: 'Royal', colors: ['#EEF2E7', '#174B3B', '#B9954B', '#FCFAF2'] },
  { name: 'Navy & Champagne', mood: 'Royal', colors: ['#F3F4F6', '#18233E', '#C8A96A', '#FFFFFF'] },
  { name: 'Midnight & Champagne', mood: 'Royal', colors: ['#171B2E', '#F8F3E8', '#D8C49A', '#9A7C4A'] },
  { name: 'Peacock Teal', mood: 'Royal', colors: ['#E9F1EF', '#0D5554', '#C49A55', '#F8F4EE'] },
  { name: 'Plum & Antique Gold', mood: 'Royal', colors: ['#F1EAF2', '#60435E', '#B99563', '#FDF9F0'] },
  { name: 'Black Tie Gold', mood: 'Modern', colors: ['#F7F5F1', '#171615', '#C8A455', '#FFFFFF'] },
  { name: 'Sage & Champagne', mood: 'Soft', colors: ['#F1F0E6', '#66745D', '#B7A77C', '#FFFDF7'] },
  { name: 'Dusty Rose & Wine', mood: 'Soft', colors: ['#F7ECEC', '#843F52', '#C98E99', '#FFF9F6'] },
  { name: 'Terracotta & Sand', mood: 'Soft', colors: ['#F5EADD', '#A6533C', '#C99A6B', '#FFF9F1'] },
  { name: 'Lavender & Silver', mood: 'Soft', colors: ['#F3EFF8', '#6F607F', '#AAA1BA', '#FCFAFF'] },
  { name: 'Peach Blossom', mood: 'Soft', colors: ['#FFF1E9', '#B85F51', '#D99A79', '#FFFDF9'] },
  { name: 'Rose Quartz', mood: 'Soft', colors: ['#F6E7EA', '#8F405C', '#D79EAA', '#FFF9FA'] },
  { name: 'Sky & Pearl', mood: 'Soft', colors: ['#EDF4F9', '#456681', '#AFC7DA', '#FDFEFF'] },
  { name: 'Mint & Pearl', mood: 'Soft', colors: ['#E8F4EF', '#347561', '#A8C8B4', '#FCFFFD'] },
  { name: 'Olive & Cream', mood: 'Soft', colors: ['#F0EFDF', '#626A3E', '#A99A5E', '#FCFAF0'] },
  { name: 'Cocoa & Cream', mood: 'Soft', colors: ['#F4EDE5', '#75513F', '#BC916B', '#FFF9F1'] },
  { name: 'Marigold & Ivory', mood: 'Festive', colors: ['#FFF4D8', '#8A431F', '#D69A29', '#FFFDF2'] },
  { name: 'Indigo & Marigold', mood: 'Festive', colors: ['#EDF0F9', '#384987', '#D99C26', '#FAFBFF'] },
  { name: 'Haldi Saffron', mood: 'Festive', colors: ['#FFF1D5', '#7A3D16', '#E5A127', '#FFF9E9'] },
  { name: 'Coral & Teal', mood: 'Festive', colors: ['#FFF0E8', '#155A59', '#D87962', '#FFFDF9'] },
  { name: 'Blush Garden', mood: 'Soft', colors: ['#F9EDF0', '#704552', '#B57683', '#FFF9FA'] },
  { name: 'Sapphire Night', mood: 'Royal', colors: ['#111C35', '#F7F2E7', '#D9B86B', '#7485A8'] },
];

export const DESIGN_COLOR_MOODS = ['All', 'Royal', 'Soft', 'Modern', 'Festive'] as const;
