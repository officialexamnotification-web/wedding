import {
  Body,
  EclipticGeoMoon,
  GeoVector,
  MakeTime,
  Rotation_EQJ_ECT,
  SiderealTime,
  e_tilt,
} from 'astronomy-engine';

export const RASHIS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'] as const;
export const NAKSHATRAS = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'] as const;
const NAK_LORDS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const NAK_GANA = ['Deva','Manushya','Rakshasa','Manushya','Deva','Manushya','Deva','Deva','Rakshasa','Rakshasa','Manushya','Manushya','Deva','Rakshasa','Deva','Rakshasa','Deva','Rakshasa','Rakshasa','Manushya','Manushya','Deva','Rakshasa','Rakshasa','Manushya','Manushya','Deva'];
const NAK_NADI = ['Adi','Madhya','Antya','Antya','Madhya','Adi','Adi','Madhya','Antya','Antya','Madhya','Adi','Adi','Madhya','Antya','Antya','Madhya','Adi','Adi','Madhya','Antya','Antya','Madhya','Adi','Adi','Madhya','Antya'];
const NAK_YONI = ['Horse','Elephant','Sheep','Serpent','Serpent','Dog','Cat','Sheep','Cat','Rat','Rat','Cow','Buffalo','Tiger','Buffalo','Tiger','Deer','Deer','Dog','Monkey','Mongoose','Monkey','Lion','Horse','Lion','Cow','Elephant'];
const SIGNS_LORDS = ['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter'];
const FRIENDS: Record<string, string[]> = { Sun:['Moon','Mars','Jupiter'], Moon:['Sun','Mercury'], Mars:['Sun','Moon','Jupiter'], Mercury:['Sun','Venus'], Jupiter:['Sun','Moon','Mars'], Venus:['Mercury','Saturn'], Saturn:['Mercury','Venus'] };
const ENEMIES: Record<string, string[]> = { Sun:['Venus','Saturn'], Moon:[], Mars:['Mercury'], Mercury:['Moon'], Jupiter:['Mercury','Venus'], Venus:['Sun','Moon'], Saturn:['Sun','Moon','Mars'] };
const YONIS = ['Horse','Elephant','Sheep','Serpent','Dog','Cat','Rat','Cow','Buffalo','Tiger','Deer','Monkey','Mongoose','Lion'];
const YONI_POINTS = [[4,2,3,2,2,3,3,3,0,1,3,2,2,1],[2,4,3,2,2,3,3,3,3,2,2,2,2,0],[3,3,4,3,2,3,1,3,3,1,3,0,3,1],[2,2,3,4,2,2,1,1,2,2,2,2,0,2],[2,2,2,2,4,1,1,2,2,1,0,2,2,1],[2,2,3,2,1,4,0,2,2,1,2,2,2,2],[2,2,2,1,1,0,4,2,2,2,2,2,2,1],[3,2,3,1,2,2,2,4,3,0,3,2,3,1],[0,3,3,2,2,2,2,3,4,1,2,2,2,3],[1,2,1,2,1,1,2,0,1,4,2,1,2,2],[3,2,3,2,0,2,2,3,2,1,4,2,2,2],[2,3,0,2,2,2,2,2,2,1,2,4,2,3],[2,2,3,0,2,2,2,3,2,2,2,2,4,2],[1,0,1,2,1,2,1,1,3,2,2,2,2,4]];
const GANA_POINTS: Record<string, Record<string, number>> = { Deva:{Deva:6,Manushya:5,Rakshasa:1}, Manushya:{Deva:6,Manushya:6,Rakshasa:0}, Rakshasa:{Deva:0,Manushya:0,Rakshasa:6} };
const VASHYA_ORDER = ['Chatushpada','Manav','Jalchar','Vanchar','Keet'];
// Common North Indian five-group scoring table; traditions can use variants.
const VASHYA_POINTS = [[2,.5,1,0,2],[.5,2,0,0,0],[1,0,2,2,2],[0,0,2,2,0],[2,2,2,0,2]];
function vashyaGroup(longitude:number) {
  const sign=signIndex(longitude), degree=wrap(longitude)%30;
  if(sign===0||sign===1||(sign===8&&degree>=15)||(sign===9&&degree<15)) return 'Chatushpada';
  if([2,5,6,10].includes(sign)||(sign===8&&degree<15)) return 'Manav';
  if([3,11].includes(sign)||(sign===9&&degree>=15)) return 'Jalchar';
  if(sign===4) return 'Vanchar';
  return 'Keet';
}

export interface BirthInput { name: string; date: string; time: string; latitude: number; longitude: number; timezone: string; place: string }
export interface CelestialPoint { name: string; longitude: number; sign: string; degree: number; house: number; retrograde: boolean; nakshatra: string; pada: number }
export interface BirthChart { ascendant: CelestialPoint; planets: CelestialPoint[]; ayanamsa: number; birthStar: CelestialPoint; panchanga: { tithi: string; yoga: string; karana: string; vara: string }; birth: BirthInput }
export interface Koota { name: string; score: number; max: number }

const wrap = (n: number) => ((n % 360) + 360) % 360;
const signIndex = (longitude: number) => Math.floor(wrap(longitude) / 30);
const nakshatraAt = (longitude: number) => {
  const size = 360 / 27;
  const position = wrap(longitude);
  const index = Math.min(26, Math.floor(position / size));
  return { index, name: NAKSHATRAS[index], pada: Math.min(4, Math.floor((position - index * size) / (size / 4)) + 1) };
};
const pointAt = (name: string, longitude: number, ascSign: number, retrograde = false): CelestialPoint => {
  const pos = wrap(longitude);
  const nak = nakshatraAt(pos);
  return { name, longitude: pos, sign: RASHIS[signIndex(pos)], degree: pos % 30, house: (signIndex(pos) - ascSign + 12) % 12 + 1, retrograde, nakshatra: nak.name, pada: nak.pada };
};

function lahiriAyanamsa(date: Date) {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const centuries = (jd - 2451545) / 36525;
  // Lahiri/Chitrapaksha reference at J2000 and its conventional mean precession rate.
  return 23 + 51 / 60 + 25.5323 / 3600 + 1.3969713 * centuries + 0.0003086 * centuries * centuries;
}

function tropicalLongitude(body: Body, date: Date) {
  if (body === Body.Moon) return EclipticGeoMoon(date).lon;
  const vector = GeoVector(body, date, true);
  const matrix = Rotation_EQJ_ECT(date).rot;
  // Astronomy Engine stores the coordinate rotation in the orientation
  // convention used by its transforms; apply its transpose for EQJ → ECT.
  const x = matrix[0][0] * vector.x + matrix[1][0] * vector.y + matrix[2][0] * vector.z;
  const y = matrix[0][1] * vector.x + matrix[1][1] * vector.y + matrix[2][1] * vector.z;
  return wrap(Math.atan2(y, x) * 180 / Math.PI);
}

function parseBirthDate(input: BirthInput) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || !/^\d{2}:\d{2}$/.test(input.time)) throw new Error('Enter a valid birth date and time.');
  const todayParts = new Intl.DateTimeFormat('en-CA', { timeZone: input.timezone, year:'numeric', month:'2-digit', day:'2-digit' }).formatToParts(new Date());
  const today = `${todayParts.find((part)=>part.type==='year')?.value}-${todayParts.find((part)=>part.type==='month')?.value}-${todayParts.find((part)=>part.type==='day')?.value}`;
  if (input.date > today) throw new Error('Birth date cannot be in the future.');
  const [year, month, day] = input.date.split('-').map(Number);
  const [hour, minute] = input.time.split(':').map(Number);
  const check = new Date(Date.UTC(year, month - 1, day));
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day || hour > 23 || minute > 59) throw new Error('Enter a valid birth date and time.');
  const formatter = new Intl.DateTimeFormat('en-US', { timeZone: input.timezone, timeZoneName: 'longOffset' });
  const offsetLabel = formatter.formatToParts(new Date(Date.UTC(year, month - 1, day, hour, minute))).find((part) => part.type === 'timeZoneName')?.value ?? 'GMT+05:30';
  const match = offsetLabel.match(/GMT(?:([+-])(\d{2}):(\d{2}))?/);
  if (!match) throw new Error('Choose a supported time zone.');
  const offsetMinutes = match[1] ? (match[1] === '+' ? 1 : -1) * (Number(match[2]) * 60 + Number(match[3])) : 0;
  return new Date(Date.UTC(year, month - 1, day, hour, minute) - offsetMinutes * 60000);
}

export function calculateBirthChart(input: BirthInput): BirthChart {
  if (!Number.isFinite(input.latitude) || Math.abs(input.latitude) > 90 || !Number.isFinite(input.longitude) || Math.abs(input.longitude) > 180) throw new Error('Enter valid latitude and longitude for the birth place.');
  const date = parseBirthDate(input);
  const ayanamsa = lahiriAyanamsa(date);
  const sidereal = (body: Body, when = date) => wrap(tropicalLongitude(body, when) - lahiriAyanamsa(when));
  const ascTime = SiderealTime(date) * 15 + input.longitude;
  const obliquity = e_tilt(MakeTime(date)).tobl * Math.PI / 180;
  const latitude = Math.max(-89.999, Math.min(89.999, input.latitude)) * Math.PI / 180;
  const theta = ascTime * Math.PI / 180;
  const ascTropical = wrap(Math.atan2(-Math.cos(theta), Math.cos(obliquity) * Math.sin(theta) + Math.sin(obliquity) * Math.tan(latitude)) * 180 / Math.PI + 180);
  const asc = wrap(ascTropical - ayanamsa);
  const ascSign = signIndex(asc);
  const ascendant = pointAt('Ascendant', asc, ascSign);
  ascendant.house = 1;
  const bodies: [string, Body][] = [['Sun',Body.Sun],['Moon',Body.Moon],['Mercury',Body.Mercury],['Venus',Body.Venus],['Mars',Body.Mars],['Jupiter',Body.Jupiter],['Saturn',Body.Saturn],['Uranus',Body.Uranus],['Neptune',Body.Neptune],['Pluto',Body.Pluto]];
  const planets = bodies.map(([name, body]) => {
    const longitude = sidereal(body);
    const before = sidereal(body, new Date(date.getTime() - 6 * 3600000));
    const after = sidereal(body, new Date(date.getTime() + 6 * 3600000));
    const speed = ((after - before + 540) % 360) - 180;
    return pointAt(name, longitude, ascSign, speed < 0);
  });
  const daysSinceJ2000 = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / 86400000;
  const t = daysSinceJ2000 / 36525;
  const meanNode = wrap(125.04452 - 1934.136261 * t + 0.0020708 * t * t + t * t * t / 450000);
  planets.push(pointAt('Rahu', wrap(meanNode - ayanamsa), ascSign, true), pointAt('Ketu', wrap(meanNode + 180 - ayanamsa), ascSign, true));
  const moon = planets.find((planet) => planet.name === 'Moon')!;
  const sun = planets.find((planet) => planet.name === 'Sun')!;
  const elongation = wrap(moon.longitude - sun.longitude);
  const yogaNames = ['Vishkambha','Priti','Ayushman','Saubhagya','Shobhana','Atiganda','Sukarma','Dhriti','Shula','Ganda','Vriddhi','Dhruva','Vyaghata','Harshana','Vajra','Siddhi','Vyatipata','Variyana','Parigha','Shiva','Siddha','Sadhya','Shubha','Shukla','Brahma','Indra','Vaidhriti'];
  const tithiNum = Math.floor(elongation / 12) + 1;
  const fortnight = elongation < 180 ? 'Shukla' : 'Krishna';
  const tithiNames = ['Pratipada','Dvitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi',fortnight === 'Shukla' ? 'Purnima' : 'Amavasya'];
  const karanaIndex = Math.floor(elongation / 6);
  const movable = ['Bava','Balava','Kaulava','Taitila','Garaja','Vanija','Vishti'];
  const karana = karanaIndex === 0 ? 'Kimstughna' : karanaIndex < 57 ? movable[(karanaIndex - 1) % 7] : ['Shakuni','Chatushpada','Naga'][karanaIndex - 57];
  const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const weekdayDate = new Date(`${input.date}T12:00:00`);
  return {
    ascendant, planets, ayanamsa, birthStar: moon,
    panchanga: { tithi: `${fortnight} ${tithiNames[(tithiNum - 1) % 15]}`, yoga: yogaNames[Math.min(26, Math.floor(wrap(moon.longitude + sun.longitude) / (360 / 27)))], karana, vara: weekdays[weekdayDate.getDay()] },
    birth: input,
  };
}

export function calculateAshtakoota(groom: BirthChart, bride: BirthChart): { scores: Koota[]; total: number; notes: string[] } {
  const gMoon = groom.planets.find((p) => p.name === 'Moon')!;
  const bMoon = bride.planets.find((p) => p.name === 'Moon')!;
  const gi = nakshatraAt(gMoon.longitude).index;
  const bi = nakshatraAt(bMoon.longitude).index;
  const gs = signIndex(gMoon.longitude) + 1;
  const bs = signIndex(bMoon.longitude) + 1;
  const varnaRank: Record<number, number> = {1:3,2:2,3:1,4:4,5:3,6:2,7:1,8:4,9:3,10:2,11:1,12:4};
  const taraGood = (a: number, b: number) => ![3,5,7].includes(((b - a + 27) % 27) % 9 + 1);
  const tara = (Number(taraGood(bi, gi)) + Number(taraGood(gi, bi))) * 1.5;
  const yoni = YONI_POINTS[YONIS.indexOf(NAK_YONI[bi])][YONIS.indexOf(NAK_YONI[gi])];
  const vashyaIndexG=VASHYA_ORDER.indexOf(vashyaGroup(gMoon.longitude));
  const vashyaIndexB=VASHYA_ORDER.indexOf(vashyaGroup(bMoon.longitude));
  const lord1 = SIGNS_LORDS[bs - 1], lord2 = SIGNS_LORDS[gs - 1];
  const relation = (a: string, b: string) => FRIENDS[a]?.includes(b) ? 'friend' : ENEMIES[a]?.includes(b) ? 'enemy' : 'neutral';
  const r1 = relation(lord1, lord2), r2 = relation(lord2, lord1);
  const maitri = lord1 === lord2 || (r1 === 'friend' && r2 === 'friend') ? 5 : [r1,r2].includes('friend') && [r1,r2].includes('neutral') ? 4 : r1 === 'neutral' && r2 === 'neutral' ? 3 : [r1,r2].includes('friend') && [r1,r2].includes('enemy') ? 1 : [r1,r2].includes('neutral') && [r1,r2].includes('enemy') ? .5 : 0;
  const bhakootBad = [1,4,5,7,8,11].includes((gs - bs + 12) % 12);
  const gana = GANA_POINTS[NAK_GANA[bi]][NAK_GANA[gi]];
  const scores: Koota[] = [
    { name:'Varna', score:varnaRank[gs] >= varnaRank[bs] ? 1 : 0, max:1 },
    { name:'Vashya', score:VASHYA_POINTS[vashyaIndexG][vashyaIndexB], max:2 },
    { name:'Tara (Dina)', score:tara, max:3 },
    { name:'Yoni', score:yoni, max:4 },
    { name:'Graha Maitri', score:maitri, max:5 },
    { name:'Gana', score:gana, max:6 },
    { name:'Bhakoot (Rashi)', score:bhakootBad ? 0 : 7, max:7 },
    { name:'Nadi', score:NAK_NADI[bi] === NAK_NADI[gi] ? 0 : 8, max:8 },
  ];
  const notes: string[] = [];
  if (NAK_NADI[bi] === NAK_NADI[gi]) notes.push('Same Nadi is traditionally flagged; cancellation rules can vary and need an experienced practitioner’s review.');
  if (bhakootBad) notes.push('This Bhakoot relation is traditionally flagged; cancellation rules can vary and need an experienced practitioner’s review.');
  return { scores, total: scores.reduce((sum, item) => sum + item.score, 0), notes };
}

export function calculateNumbers(date: string, name: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Enter a valid date of birth.');
  const [dateYear,dateMonth,dateDay]=date.split('-').map(Number);
  const parsedDate=new Date(Date.UTC(dateYear,dateMonth-1,dateDay));
  if(parsedDate.getUTCFullYear()!==dateYear||parsedDate.getUTCMonth()!==dateMonth-1||parsedDate.getUTCDate()!==dateDay) throw new Error('Enter a valid date of birth.');
  const now=new Date(); now.setMinutes(now.getMinutes()-now.getTimezoneOffset());
  if(date>now.toISOString().slice(0,10)) throw new Error('Birth date cannot be in the future.');
  const [year, month, day] = date.split('-').map(Number);
  const reduce = (value: number) => { while (value > 9) value = String(value).split('').reduce((sum, digit) => sum + Number(digit), 0); return value; };
  const mulank = reduce(day);
  const bhagyank = reduce(`${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`.split('').reduce((sum, digit) => sum + Number(digit), 0));
  const map: Record<string, number> = { A:1,I:1,J:1,Q:1,Y:1,B:2,K:2,R:2,C:3,G:3,L:3,S:3,D:4,M:4,T:4,E:5,H:5,N:5,X:5,U:6,V:6,W:6,O:7,Z:7,F:8,P:8 };
  const letters = name.toUpperCase().replace(/[^A-Z]/g, '');
  const naamank = letters ? reduce([...letters].reduce((sum, letter) => sum + (map[letter] || 0), 0)) : undefined;
  const planets = ['', 'Sun','Moon','Jupiter','Rahu','Mercury','Venus','Ketu','Saturn','Mars'];
  return { mulank, bhagyank, naamank, mulankPlanet:planets[mulank], bhagyankPlanet:planets[bhagyank] };
}

export const GEMSTONES: Record<string, { stone:string; hindi:string; caution:string }> = {
  Sun:{stone:'Ruby',hindi:'Manikya',caution:'Sun’s gemstone associations vary by chart and tradition; do not treat this as a personal prescription.'},
  Moon:{stone:'Pearl',hindi:'Moti',caution:'Moon’s gemstone associations vary by chart and tradition; do not treat this as a personal prescription.'},
  Mars:{stone:'Red coral',hindi:'Moonga',caution:'Mars’ gemstone associations vary by chart and tradition; do not treat this as a personal prescription.'},
  Mercury:{stone:'Emerald',hindi:'Panna',caution:'Mercury’s gemstone associations vary by chart and tradition; do not treat this as a personal prescription.'},
  Jupiter:{stone:'Yellow sapphire',hindi:'Pukhraj',caution:'Jupiter’s gemstone associations vary by chart and tradition; do not treat this as a personal prescription.'},
  Venus:{stone:'Diamond',hindi:'Heera',caution:'Venus’ gemstone associations vary by chart and tradition; do not treat this as a personal prescription.'},
  Saturn:{stone:'Blue sapphire',hindi:'Neelam',caution:'Saturn’s gemstone associations vary by chart and tradition; do not treat this as a personal prescription.'},
};
export const LAGNA_LORDS: Record<string,string> = { Aries:'Mars',Taurus:'Venus',Gemini:'Mercury',Cancer:'Moon',Leo:'Sun',Virgo:'Mercury',Libra:'Venus',Scorpio:'Mars',Sagittarius:'Jupiter',Capricorn:'Saturn',Aquarius:'Saturn',Pisces:'Jupiter' };
