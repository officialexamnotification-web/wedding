/**
 * Gemstone Service
 * Based on Vedic Astrology (BPHS classical rules - Trikaal Vaani method)
 * Maps the chart's ascendant lord to a traditional gemstone association.
 * This is not a personalized suitability assessment or a verified recommendation.
 */

import { ChartResponse } from '../types';

// Sign to Planet mapping (Lagna Lord)
const LAGNA_LORDS: Record<string, string> = {
  'Aries': 'Mars',
  'Taurus': 'Venus',
  'Gemini': 'Mercury',
  'Cancer': 'Moon',
  'Leo': 'Sun',
  'Virgo': 'Mercury',
  'Libra': 'Venus',
  'Scorpio': 'Mars',
  'Sagittarius': 'Jupiter',
  'Capricorn': 'Saturn',
  'Aquarius': 'Saturn',
  'Pisces': 'Jupiter'
};

// Planet to Gemstone mapping (Main gemstones)
const PLANET_GEMSTONE: Record<string, {
  name: string;
  hindiName: string;
  metal: string;
  finger: string;
  day: string;
  mantra: string;
  weight: string;
  color: string;
}> = {
  'Sun': {
    name: 'Ruby',
    hindiName: 'Manikya (माणिक्य)',
    metal: 'Gold',
    finger: 'Ring finger',
    day: 'Sunday',
    mantra: 'Om Hrim Hraum Suryaya Namah',
    weight: '4-6 carats',
    color: 'Red/Pink'
  },
  'Moon': {
    name: 'Pearl',
    hindiName: 'Moti (मोती)',
    metal: 'Silver',
    finger: 'Little finger',
    day: 'Monday',
    mantra: 'Om Som Somaya Namah',
    weight: '5-7 carats',
    color: 'White/Cream'
  },
  'Mars': {
    name: 'Red Coral',
    hindiName: 'Moonga (मूंगा)',
    metal: 'Gold or Copper',
    finger: 'Ring finger',
    day: 'Tuesday',
    mantra: 'Om Ang Angarkaya Namah',
    weight: '6-9 carats',
    color: 'Red/Orange'
  },
  'Mercury': {
    name: 'Emerald',
    hindiName: 'Panna (पन्ना)',
    metal: 'Gold',
    finger: 'Little finger',
    day: 'Wednesday',
    mantra: 'Om Bum Budhaya Namah',
    weight: '4-6 carats',
    color: 'Green'
  },
  'Jupiter': {
    name: 'Yellow Sapphire',
    hindiName: 'Pukhraj (पुखराज)',
    metal: 'Gold',
    finger: 'Index finger',
    day: 'Thursday',
    mantra: 'Om Brim Brihaspataye Namah',
    weight: '5-8 carats',
    color: 'Yellow'
  },
  'Venus': {
    name: 'Diamond',
    hindiName: 'Heera (हीरा)',
    metal: 'Platinum or Silver',
    finger: 'Ring finger',
    day: 'Friday',
    mantra: 'Om Shum Shukraya Namah',
    weight: '0.5-1 carat',
    color: 'White/Clear'
  },
  'Saturn': {
    name: 'Blue Sapphire',
    hindiName: 'Neelam (नीलम)',
    metal: 'Silver',
    finger: 'Middle finger',
    day: 'Saturday',
    mantra: 'Om Sham Shanicharaya Namah',
    weight: '5-7 carats',
    color: 'Blue'
  },
  'Rahu': {
    name: 'Hessonite',
    hindiName: 'Gomed (गोमेद)',
    metal: 'Silver',
    finger: 'Middle finger',
    day: 'Saturday',
    mantra: 'Om Raam Rahave Namah',
    weight: '6-8 carats',
    color: 'Honey Brown'
  },
  'Ketu': {
    name: "Cat's Eye",
    hindiName: 'Lehsunia (लहसुनिया)',
    metal: 'Silver',
    finger: 'Little finger',
    day: 'Tuesday',
    mantra: 'Om Kem Ketave Namah',
    weight: '5-7 carats',
    color: 'Brown/Green'
  }
};

// Alternative gemstones (Uparatna) - cheaper alternatives
const UPARATNA: Record<string, string[]> = {
  'Sun': ['Garnet', 'Red Spinel', 'Sunstone'],
  'Moon': ['Moonstone', 'White Coral', 'Opal'],
  'Mars': ['Carnelian', 'Red Jasper', 'Bloodstone'],
  'Mercury': ['Peridot', 'Green Tourmaline', 'Green Zircon'],
  'Jupiter': ['Yellow Topaz', 'Citrine', 'Golden Topaz'],
  'Venus': ['White Sapphire', 'White Topaz', 'White Zircon'],
  'Saturn': ['Iolite', 'Amethyst', 'Lapis Lazuli'],
  'Rahu': ['Brown Tourmaline', 'Smoky Quartz', 'Tiger Eye'],
  'Ketu': ['Green Tourmaline', 'Alexandrite', 'Cat\'s Eye Chrysoberyl']
};

export interface GemstoneResult {
  lifeStone: {
    planet: string;
    name: string;
    hindiName: string;
    metal: string;
    finger: string;
    day: string;
    mantra: string;
    weight: string;
    color: string;
  };
  lagnaSign: string;
  lagnaLord: string;
  suitability: { verdict: string };
  uparatna: string[];
  wearingInstructions: string[];
  precautions: string[];
}

export function calculateGemstone(chartData: ChartResponse): GemstoneResult {
  const lagnaSign = chartData.ascendant.sign;
  const lagnaLord = LAGNA_LORDS[lagnaSign];
  if (!lagnaLord) throw new Error('The chart has an unrecognized ascendant sign; no gemstone association was generated.');

  const lifeStoneData = PLANET_GEMSTONE[lagnaLord];
  if (!lifeStoneData) throw new Error('No traditional gemstone mapping is available for this ascendant lord.');
  const uparatnaList = UPARATNA[lagnaLord] || [];

  const suitability = {
    verdict: 'This is a traditional Lagna-lord association only. Personalized gemstone suitability is not determined because planetary strength, house ownership, condition, and dasha have not been fully assessed.',
  };

  const wearingInstructions = [
    `Traditional association: ${lifeStoneData.name} is linked with ${lagnaLord}, the ruler of the ${lagnaSign} ascendant.`,
    'Consult a qualified astrologer before buying or wearing a gemstone; this report does not establish personal suitability.'
  ];

  const precautions = [
    'Consult a qualified astrologer before wearing',
    'Gemstone traditions are belief-based and are not scientifically proven to change outcomes.',
    'If you choose to buy one, use an independent gemological certificate and avoid unsupported health or financial claims.'
  ];

  return {
    lifeStone: {
      planet: lagnaLord,
      name: lifeStoneData.name,
      hindiName: lifeStoneData.hindiName,
      metal: lifeStoneData.metal,
      finger: lifeStoneData.finger,
      day: lifeStoneData.day,
      mantra: lifeStoneData.mantra,
      weight: lifeStoneData.weight,
      color: lifeStoneData.color
    },
    lagnaSign,
    lagnaLord,
    suitability,
    uparatna: uparatnaList,
    wearingInstructions,
    precautions
  };
}

// Get gemstone by planet (for Mahadasha lord)
export function getGemstoneByPlanet(planet: string) {
  return PLANET_GEMSTONE[planet] || null;
}
