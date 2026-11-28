import { Language } from '../data/weddingData';

// Curated bidirectional glossary for Indian invitations (dates, cities, ceremonies, venues, blessings)
const EN_TO_HI_WORDS: Record<string, string> = {
  // Months
  january: 'जनवरी',
  jan: 'जनवरी',
  february: 'फ़रवरी',
  feb: 'फ़रवरी',
  march: 'मार्च',
  mar: 'मार्च',
  april: 'अप्रैल',
  apr: 'अप्रैल',
  may: 'मई',
  june: 'जून',
  jun: 'जून',
  july: 'जुलाई',
  jul: 'जुलाई',
  august: 'अगस्त',
  aug: 'अगस्त',
  september: 'सितम्बर',
  sept: 'सितम्बर',
  sep: 'सितम्बर',
  october: 'अक्टूबर',
  oct: 'अक्टूबर',
  november: 'नवम्बर',
  nov: 'नवम्बर',
  december: 'दिसम्बर',
  dec: 'दिसम्बर',

  // Weekdays
  sunday: 'रविवार',
  sun: 'रविवार',
  monday: 'सोमवार',
  mon: 'सोमवार',
  tuesday: 'मंगलवार',
  tue: 'मंगलवार',
  wednesday: 'बुधवार',
  wed: 'बुधवार',
  thursday: 'गुरुवार',
  thu: 'गुरुवार',
  friday: 'शुक्रवार',
  fri: 'शुक्रवार',
  saturday: 'शनिवार',
  sat: 'शनिवार',

  // Ordinals & birthday terms
  '1st': 'प्रथम',
  first: 'प्रथम',
  '2nd': 'द्वितीय',
  second: 'द्वितीय',
  '3rd': 'तृतीय',
  third: 'तृतीय',
  '4th': 'चतुर्थ',
  '5th': 'पंचम',
  birthday: 'जन्मदिन',
  janmotsav: 'जन्मोत्सव',
  shubh: 'शुभ',
  happy: 'शुभ',
  celebration: 'उत्सव',
  celebrations: 'उत्सव',
  party: 'उत्सव',
  baby: 'नन्हे',
  little: 'नन्हे',
  princess: 'राजकुमारी',
  prince: 'राजकुमार',
  turns: 'पूर्ण वर्ष',
  year: 'वर्ष',
  years: 'वर्ष',
  milestone: 'विशेष अवसर',

  // Wedding & Ceremony terms
  wedding: 'विवाह',
  vivah: 'विवाह',
  shaadi: 'शादी',
  nikah: 'निकाह',
  walima: 'वलीमा',
  haldi: 'हल्दी',
  mehndi: 'मेहंदी',
  mehendi: 'मेहंदी',
  sangeet: 'संगीत',
  reception: 'प्रीतिभोज',
  roka: 'रोका',
  tilak: 'तिलक',
  aarti: 'आरती',
  puja: 'पूजन',
  pooja: 'पूजन',
  havan: 'हवन',
  pheras: 'शुभ फेरे',
  baraat: 'बारात',
  baarat: 'बारात',
  engagement: 'सगाई',
  sagai: 'सगाई',
  cocktail: 'संध्या उत्सव',
  dinner: 'प्रीतिभोज',
  lunch: 'भोज',
  brunch: 'दोपहर भोज',
  cake: 'केक',
  cutting: 'कटिंग',
  wishes: 'शुभकामनाएँ',
  games: 'खेल',
  magic: 'जादू',
  music: 'संगीत',
  dance: 'नृत्य',
  ceremony: 'समारोह',
  utsav: 'उत्सव',
  night: 'रात्रि',
  evening: 'संध्या',
  morning: 'प्रातः',
  gala: 'संध्या',
  grand: 'भव्य',
  royal: 'शाही',
  traditional: 'पारंपरिक',
  festive: 'उत्सव',
  attire: 'परिधान',
  ethnic: 'पारंपरिक परिधान',
  formal: 'औपचारिक',
  yellow: 'पीला',
  green: 'हरा',
  red: 'लाल',
  gold: 'सुनहरा',
  golden: 'सुनहरा',
  pink: 'गुलाबी',
  blue: 'नीला',
  white: 'श्वेत',
  pastel: 'हल्के रंग',
  pastels: 'हल्के रंग',
  kurta: 'कुर्ता',
  saree: 'साड़ी',
  lehenga: 'लहंगा',
  blessings: 'आशीर्वाद',
  elders: 'बड़ों',
  parents: 'माता-पिता',
  grandparents: 'दादा-दादी',
  family: 'परिवार',
  warm: 'स्नेहिल',
  welcome: 'स्वागत',
  invite: 'निमंत्रण',
  invitation: 'निमंत्रण',
  shri: 'श्री',
  shree: 'श्री',
  smt: 'श्रीमती',
  mrs: 'श्रीमती',
  mr: 'श्री',
  and: 'एवं',
  with: 'सहित',
  from: 'से',
  near: 'के पास',
  opposite: 'के सामने',
  behind: 'के पीछे',
  beside: 'के पास',
  at: 'पर',
  in: 'में',
  on: 'पर',
  by: 'द्वारा',
  the: '',
  of: 'के',
  to: 'को',
  for: 'के लिए',
  available: 'उपलब्ध',
  parking: 'पार्किंग',
  valet: 'वैलेट',
  gate: 'द्वार',
  main: 'मुख्य',
  airport: 'हवाई अड्डा',
  station: 'स्टेशन',
  railway: 'रेलवे',
  mins: 'मिनट',
  minutes: 'मिनट',
  km: 'किमी',
  shuttle: 'शटल',

  // Venues & Places
  palace: 'पैलेस',
  hotel: 'होटल',
  resort: 'रिसॉर्ट',
  resorts: 'रिसॉर्ट्स',
  banquet: 'बैंक्वेट',
  hall: 'हॉल',
  lawn: 'लॉन',
  lawns: 'लॉन',
  garden: 'गार्डन',
  gardens: 'गार्डन',
  courtyard: 'प्रांगण',
  haveli: 'हवेली',
  mandir: 'मंदिर',
  temple: 'मंदिर',
  gurdwara: 'गुरुद्वारा',
  club: 'क्लब',
  farm: 'फ़ार्म',
  farmhouse: 'फ़ार्महाउस',
  house: 'भवन',
  bhawan: 'भवन',
  bhavan: 'भवन',
  road: 'रोड',
  marg: 'मार्ग',
  nagar: 'नगर',
  colony: 'कॉलोनी',
  sector: 'सेक्टर',
  phase: 'फ़ेज़',
  chowk: 'चौक',
  bazaar: 'बाज़ार',
  bazar: 'बाज़ार',
  market: 'मार्केट',
  park: 'पार्क',
  city: 'सिटी',
  lake: 'लेक',
  fort: 'फ़ोर्ट',
  mahal: 'महल',
  villa: 'विला',
  heritage: 'हेरिटेज',
  taj: 'ताज',
  oberoi: 'ओबेरॉय',
  leela: 'लीला',
  itc: 'आईटीसी',
  marriott: 'मैरियट',
  hyatt: 'हयात',
  radisson: 'रैडिसन',
  hilton: 'हिल्टन',

  // Major Indian Cities & States
  india: 'भारत',
  rajasthan: 'राजस्थान',
  udaipur: 'उदयपुर',
  jaipur: 'जयपुर',
  jodhpur: 'जोधपुर',
  jaisalmer: 'जैसलमेर',
  bikaner: 'बीकानेर',
  ajmer: 'अजमेर',
  kota: 'कोटा',
  delhi: 'दिल्ली',
  'new delhi': 'नई दिल्ली',
  noida: 'नोएडा',
  gurgaon: 'गुरुग्राम',
  gurugram: 'गुरुग्राम',
  faridabad: 'फ़रीदाबाद',
  ghaziabad: 'गाज़ियाबाद',
  mumbai: 'मुंबई',
  pune: 'पुणे',
  nagpur: 'नागपुर',
  nashik: 'नाशिक',
  maharashtra: 'महाराष्ट्र',
  gujarat: 'गुजरात',
  ahmedabad: 'अहमदाबाद',
  surat: 'सूरत',
  vadodara: 'वडोदरा',
  rajkot: 'राजकोट',
  lucknow: 'लखनऊ',
  kanpur: 'कानपुर',
  varanasi: 'वाराणसी',
  banaras: 'बनारस',
  agra: 'आगरा',
  prayagraj: 'प्रयागराज',
  allahabad: 'प्रयागराज',
  ayodhya: 'अयोध्या',
  mathura: 'मथुरा',
  vrindavan: 'वृंदावन',
  meerut: 'मेरठ',
  gorakhpur: 'गोरखपुर',
  uttar: 'उत्तर',
  pradesh: 'प्रदेश',
  madhya: 'मध्य',
  bhopal: 'भोपाल',
  indore: 'इंदौर',
  gwalior: 'ग्वालियर',
  ujjain: 'उज्जैन',
  jabalpur: 'जबलपुर',
  bihar: 'बिहार',
  patna: 'पटना',
  gaya: 'गया',
  jharkhand: 'झारखंड',
  ranchi: 'राँची',
  jamshedpur: 'जमशेदपुर',
  punjab: 'पंजाब',
  amritsar: 'अमृतसर',
  ludhiana: 'लुधियाना',
  jalandhar: 'जालंधर',
  chandigarh: 'चंडीगढ़',
  haryana: 'हरियाणा',
  himachal: 'हिमाचल',
  shimla: 'शिमला',
  uttarakhand: 'उत्तराखंड',
  dehradun: 'देहरादून',
  haridwar: 'हरिद्वार',
  rishikesh: 'ऋषिकेश',
  bengal: 'बंगाल',
  kolkata: 'कोलकाता',
  bengaluru: 'बेंगलुरु',
  bangalore: 'बेंगलुरु',
  karnataka: 'कर्नाटक',
  mysuru: 'मैसूरु',
  hyderabad: 'हैदराबाद',
  telangana: 'तेलंगाना',
  chennai: 'चेन्नई',
  tamil: 'तमिल',
  nadu: 'नाडु',
  kerala: 'केरल',
  kochi: 'कोच्चि',
  goa: 'गोवा',
  assam: 'असम',
  guwahati: 'गुवाहाटी',
  odisha: 'ओडिशा',
  bhubaneswar: 'भुवनेश्वर',
  chhattisgarh: 'छत्तीसगढ़',
  raipur: 'रायपुर',

  // Common Indian first & last names
  aarav: 'आरव',
  meera: 'मीरा',
  advik: 'अद्विक',
  ananya: 'अनन्या',
  vihaan: 'विहान',
  aadhya: 'आध्या',
  reyansh: 'रेयांश',
  diya: 'दिया',
  kabir: 'कबीर',
  myrah: 'मायरा',
  arjun: 'अर्जुन',
  priya: 'प्रिया',
  rohan: 'रोहन',
  neha: 'नेहा',
  rahul: 'राहुल',
  pooja_name: 'पूजा',
  vikram: 'विक्रम',
  aditya: 'आदित्य',
  siddharth: 'सिद्धार्थ',
  abhishek: 'अभिषेक',
  akash: 'आकाश',
  aman: 'अमन',
  amit: 'अमित',
  ankit: 'अंकित',
  ayush: 'आयुष',
  dev: 'देव',
  harsh: 'हर्ष',
  ishaan: 'ईशान',
  karan: 'करण',
  krishna: 'कृष्ण',
  kunal: 'कुनाल',
  manish: 'मनीष',
  nikhil: 'निखिल',
  pranav: 'प्रणव',
  rajesh: 'राजेश',
  ravi: 'रवि',
  rishabh: 'ऋषभ',
  sahil: 'साहिल',
  saurabh: 'सौरभ',
  shivam: 'शिवम',
  shubham: 'शुभम',
  suraj: 'सूरज',
  varun: 'वरुण',
  yash: 'यश',
  aishwarya: 'ऐश्वर्या',
  anjali: 'अंजलि',
  divya: 'दिव्या',
  kavita: 'कविता',
  khushi: 'खुशी',
  kriti: 'कृति',
  nandini: 'नंदिनी',
  nisha: 'निशा',
  radhika: 'राधिका',
  rekha: 'रेखा',
  riya: 'रिया',
  sakshi: 'साक्षी',
  shreya: 'श्रेया',
  simran: 'सिमरन',
  sneha: 'स्नेहा',
  sunita: 'सुनीता',
  tanvi: 'तन्वी',
  vaishnavi: 'वैष्णवी',
  sharma: 'शर्मा',
  verma: 'वर्मा',
  singh: 'सिंह',
  singhania: 'सिंघानिया',
  rathore: 'राठौड़',
  patel: 'पटेल',
  gupta: 'गुप्ता',
  agarwal: 'अग्रवाल',
  agrawal: 'अग्रवाल',
  yadav: 'यादव',
  mishra: 'मिश्रा',
  tiwari: 'तिवारी',
  tripathi: 'त्रिपाठी',
  pandey: 'पांडेय',
  dubey: 'दुबे',
  shukla: 'शुक्ला',
  chaturvedi: 'चतुर्वेदी',
  joshi: 'जोशी',
  mehta: 'मेहता',
  shah: 'शाह',
  jain: 'जैन',
  kapoor: 'कपूर',
  malhotra: 'मल्होत्रा',
  khanna: 'खन्ना',
  bhatia: 'भाटिया',
  arora: 'अरोड़ा',
  chopra: 'चोपड़ा',
  saxena: 'सक्सेना',
  srivastava: 'श्रीवास्तव',
  sinha: 'सिन्हा',
  kumar: 'कुमार',
  kumari: 'कुमारी',
  chauhan: 'चौहान',
  thakur: 'ठाकुर',
  rajput: 'राजपूत',
  deshmukh: 'देशमुख',
  kulkarni: 'कुलकर्णी',
  patil: 'पाटिल',
  reddy: 'रेड्डी',
  nair: 'नायर',
  iyer: 'अय्यर',
  menon: 'मेनन',
  rao: 'राव',
  choudhary: 'चौधरी',
  chaudhary: 'चौधरी',
  mahesh: 'महेश',
  alok: 'आलोक',
  rajendra: 'राजेंद्र',
  vikramaditya: 'विक्रमादित्य',
  gayatri: 'गायत्री',
  vasundhara: 'वसुंधरा',
  kamal: 'कमल',
};

const HI_TO_EN_WORDS: Record<string, string> = {};
for (const [en, hi] of Object.entries(EN_TO_HI_WORDS)) {
  if (!hi || en === 'pooja_name' || en.length <= 3) continue;
  if (!HI_TO_EN_WORDS[hi]) {
    HI_TO_EN_WORDS[hi] = en
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}
HI_TO_EN_WORDS['एवं'] = '&';
HI_TO_EN_WORDS['श्री'] = 'Shri';
HI_TO_EN_WORDS['श्रीमती'] = 'Smt.';
HI_TO_EN_WORDS['प्रथम'] = '1st';
HI_TO_EN_WORDS['द्वितीय'] = '2nd';
HI_TO_EN_WORDS['तृतीय'] = '3rd';

const CONSONANTS: Array<[string, string]> = [
  ['ksh', 'क्ष'],
  ['gya', 'ज्ञ'],
  ['dny', 'ज्ञ'],
  ['chh', 'छ'],
  ['shr', 'श्र'],
  ['kh', 'ख'],
  ['gh', 'घ'],
  ['ng', 'ङ'],
  ['ch', 'च'],
  ['jh', 'झ'],
  ['th', 'थ'],
  ['dh', 'ध'],
  ['ph', 'फ'],
  ['bh', 'भ'],
  ['sh', 'श'],
  ['tr', 'त्र'],
  ['k', 'क'],
  ['q', 'क'],
  ['g', 'ग'],
  ['c', 'क'],
  ['j', 'ज'],
  ['z', 'ज़'],
  ['t', 'त'],
  ['d', 'द'],
  ['n', 'न'],
  ['p', 'प'],
  ['f', 'फ़'],
  ['b', 'ब'],
  ['m', 'म'],
  ['y', 'य'],
  ['r', 'र'],
  ['l', 'ल'],
  ['v', 'व'],
  ['w', 'व'],
  ['s', 'स'],
  ['h', 'ह'],
  ['x', 'क्स'],
];

const INDEPENDENT_VOWELS: Array<[string, string]> = [
  ['aa', 'आ'],
  ['ai', 'ऐ'],
  ['au', 'औ'],
  ['ee', 'ई'],
  ['oo', 'ऊ'],
  ['ou', 'औ'],
  ['ri', 'ऋ'],
  ['a', 'अ'],
  ['i', 'इ'],
  ['u', 'उ'],
  ['e', 'ए'],
  ['o', 'ओ'],
];

const MATRAS: Array<[string, string]> = [
  ['aa', 'ा'],
  ['ai', 'ै'],
  ['au', 'ौ'],
  ['ee', 'ी'],
  ['oo', 'ू'],
  ['ou', 'ौ'],
  ['a', ''],
  ['i', 'ि'],
  ['u', 'ु'],
  ['e', 'े'],
  ['o', 'ो'],
];

function phoneticRomanWordToDevanagari(word: string): string {
  const lower = word.toLowerCase();
  if (!/[a-z]/.test(lower)) return word;
  if (EN_TO_HI_WORDS[lower] !== undefined) {
    return EN_TO_HI_WORDS[lower] || word;
  }

  // Handle ordinal numbers like 25th -> 25वाँ
  const ordMatch = /^(\d+)(st|nd|rd|th)$/i.exec(lower);
  if (ordMatch) {
    return `${ordMatch[1]}वाँ`;
  }

  let i = 0;
  let out = '';
  const n = lower.length;

  while (i < n) {
    // Check consonant
    let matchedConsonant: [string, string] | null = null;
    for (const pair of CONSONANTS) {
      if (lower.startsWith(pair[0], i)) {
        matchedConsonant = pair;
        break;
      }
    }

    if (matchedConsonant) {
      const [cRoman, cDev] = matchedConsonant;
      i += cRoman.length;

      // Check following vowel for matra
      let matchedMatra: [string, string] | null = null;
      for (const pair of MATRAS) {
        if (lower.startsWith(pair[0], i)) {
          matchedMatra = pair;
          break;
        }
      }

      if (matchedMatra) {
        // Final 'a' in Indian English names often corresponds to 'ा' if preceded by consonant (e.g., Meera, Priya, Sharma)
        if (matchedMatra[0] === 'a' && i + 1 === n && n >= 3) {
          out += cDev + 'ा';
        } else {
          out += cDev + matchedMatra[1];
        }
        i += matchedMatra[0].length;
      } else {
        // Check if end of word vs consonant cluster
        if (i < n && /[a-z]/.test(lower[i])) {
          // Use anusvara for n/m before stop consonant
          if ((cRoman === 'n' || cRoman === 'm') && out.length > 0) {
            out += 'ं';
          } else {
            out += cDev + '्';
          }
        } else {
          out += cDev;
        }
      }
      continue;
    }

    // Check independent vowel
    let matchedVowel: [string, string] | null = null;
    for (const pair of INDEPENDENT_VOWELS) {
      if (lower.startsWith(pair[0], i)) {
        matchedVowel = pair;
        break;
      }
    }
    if (matchedVowel) {
      out += matchedVowel[1];
      i += matchedVowel[0].length;
      continue;
    }

    out += lower[i];
    i += 1;
  }

  return out;
}

const DEV_TO_ROMAN_CHAR: Record<string, string> = {
  अ: 'a',
  आ: 'aa',
  इ: 'i',
  ई: 'ee',
  उ: 'u',
  ऊ: 'oo',
  ऋ: 'ri',
  ए: 'e',
  ऐ: 'ai',
  ओ: 'o',
  औ: 'au',
  क: 'k',
  ख: 'kh',
  ग: 'g',
  घ: 'gh',
  ङ: 'ng',
  च: 'ch',
  छ: 'chh',
  ज: 'j',
  झ: 'jh',
  ञ: 'ny',
  ट: 't',
  ठ: 'th',
  ड: 'd',
  ढ: 'dh',
  ण: 'n',
  त: 't',
  थ: 'th',
  द: 'd',
  ध: 'dh',
  न: 'n',
  प: 'p',
  फ: 'ph',
  ब: 'b',
  भ: 'bh',
  म: 'm',
  य: 'y',
  र: 'r',
  ल: 'l',
  व: 'v',
  श: 'sh',
  ष: 'sh',
  स: 's',
  ह: 'h',
  क्ष: 'ksh',
  त्र: 'tr',
  ज्ञ: 'gy',
  ड़: 'd',
  ढ़: 'dh',
  फ़: 'f',
  ज़: 'z',
  क़: 'q',
};

const DEV_MATRA_TO_ROMAN: Record<string, string> = {
  'ा': 'a',
  'ि': 'i',
  'ी': 'ee',
  'ु': 'u',
  'ू': 'oo',
  'ृ': 'ri',
  'े': 'e',
  'ै': 'ai',
  'ो': 'o',
  'ौ': 'au',
  'ं': 'n',
  'ँ': 'n',
  'ः': 'h',
  '्': '',
};

const DEV_DIGITS: Record<string, string> = {
  '०': '0',
  '१': '1',
  '२': '2',
  '३': '3',
  '४': '4',
  '५': '5',
  '६': '6',
  '७': '7',
  '८': '8',
  '९': '9',
};

function phoneticDevanagariWordToRoman(word: string): string {
  if (!/[\u0900-\u097F]/.test(word)) return word;
  if (HI_TO_EN_WORDS[word]) return HI_TO_EN_WORDS[word];

  let out = '';
  const chars = Array.from(word);
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (DEV_DIGITS[ch] !== undefined) {
      out += DEV_DIGITS[ch];
      continue;
    }
    if (DEV_MATRA_TO_ROMAN[ch] !== undefined) {
      out += DEV_MATRA_TO_ROMAN[ch];
      continue;
    }
    const mapped = DEV_TO_ROMAN_CHAR[ch];
    if (mapped !== undefined) {
      const isVowel = 'अआइईउऊऋएऐओऔ'.includes(ch);
      out += mapped;
      if (!isVowel) {
        const next = chars[i + 1];
        const nextIsMatraOrHalant = next !== undefined && DEV_MATRA_TO_ROMAN[next] !== undefined;
        const isLast = i === chars.length - 1;
        if (!nextIsMatraOrHalant && !isLast) {
          out += 'a';
        }
      }
      continue;
    }
    if (ch === '।') {
      out += '.';
    } else {
      out += ch;
    }
  }
  return out.charAt(0).toUpperCase() + out.slice(1);
}

function convertTextLine(line: string, targetLang: Language): string {
  if (!line.trim()) return '';
  if (targetLang === 'hi') {
    // Replace multi-word known phrases first
    let working = line.replace(/\bNew Delhi\b/gi, 'नई दिल्ली');
    working = working.replace(/\s*&\s*/g, ' एवं ');
    // Tokenize keeping separators & punctuation
    return working
      .split(/([A-Za-z0-9']+)/)
      .map((token) => {
        if (!token || !/[A-Za-z]/.test(token)) return token;
        return phoneticRomanWordToDevanagari(token);
      })
      .join('')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  return line
    .split(/([\u0900-\u097F]+)/)
    .map((token) => {
      if (!token || !/[\u0900-\u097F]/.test(token)) return token;
      return phoneticDevanagariWordToRoman(token);
    })
    .join('')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function offlineTranslateInviteFields(params: {
  sourceLang: Language;
  targetLang: Language;
  fields: Record<string, string>;
}): Record<string, string> {
  const { sourceLang, targetLang, fields } = params;
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value !== 'string' || !value.trim()) continue;
    if (sourceLang === targetLang) {
      out[key] = value.trim();
      continue;
    }
    out[key] = value
      .split('\n')
      .map((line) => convertTextLine(line, targetLang))
      .join('\n')
      .trim();
  }
  return out;
}
