export type Language = 'en' | 'hi';

export type CeremonyId = 'haldi' | 'mehendi' | 'sangeet' | 'pheras';

export interface BilingualText {
  en: string;
  hi: string;
}

export interface CeremonyItem {
  id: CeremonyId;
  indexLabel: string;
  title: BilingualText;
  subtitle: BilingualText;
  date: BilingualText;
  time: string;
  muhurat: BilingualText;
  venue: BilingualText;
  attire: BilingualText;
  accentHex: string;
  image: string;
  imageAlt: string;
  rituals: {
    time: string;
    label: BilingualText;
  }[];
  hostNote: BilingualText;
}

export interface FamilyGuestProfile {
  id: string;
  familyName: BilingualText;
  greetingNote: BilingualText;
  invitedCeremonies: CeremonyId[];
  defaultGuests: number;
}

export const COUPLE_DEFAULTS = {
  groomEn: 'Aarav',
  groomFullEn: 'Aarav Singhania',
  brideEn: 'Meera',
  brideFullEn: 'Meera Rathore',
  groomHi: 'आरव',
  brideHi: 'मीरा',
  weddingDates: {
    en: '12 – 14 February 2027',
    hi: '12 – 14 फ़रवरी 2027',
  },
  city: {
    en: 'Udaipur, Rajasthan',
    hi: 'उदयपुर, राजस्थान',
  },
  palaceName: {
    en: 'Zenana Mahal & Jagmandir Courtyard',
    hi: 'ज़नाना महल एवं जगमंदिर आँगन',
  },
  parentsLine: {
    en: 'With the blessings of Smt. Vasundhara & Shri Rajendra Singhania, and Smt. Gayatri & Shri Vikramaditya Rathore',
    hi: 'श्रीमती वसुंधरा एवं श्री राजेंद्र सिंघानिया तथा श्रीमती गायत्री एवं श्री विक्रमादित्य राठौड़ के स्नेहिल आशीर्वाद सहित',
  },
  groomParents: {
    en: 'Smt. Kavita &\nShri Mahesh Singhania',
    hi: 'श्रीमती कविता एवं\nश्री महेश सिंघानिया',
  },
  brideParents: {
    en: 'Smt. Rekha &\nShri Alok Rathore',
    hi: 'श्रीमती रेखा एवं\nश्री आलोक राठौड़',
  },
  littleOnesLine: {
    en: '“Mele Chachu & Mama ki shaadi mein jalool-jalool aana!”',
    hi: '“मेले चाचू और मामा की शादी में जलूल-जलूल आना!”',
  },
  littleOnesNames: {
    en: 'Advik & Ananya (Nephew & Niece)',
    hi: 'नन्हे अद्विक एवं अनन्या (भतीजा व भांजी)',
  },
  targetIsoDate: '2027-02-12T16:30:00+05:30',
};

export const ROYAL_COUPLE_PORTRAIT_IMAGE = '/src/assets/images/royal_couple_portrait_1794923210425.jpg';
export const BIRTHDAY_STAR_PORTRAIT_IMAGE = '/src/assets/images/birthday_star_portrait_1794943972434.jpg';
export const HERO_COURTYARD_IMAGE = '/src/assets/images/jharokha_courtyard_dusk_1794564897495.jpg';
export const HAVELI_DOORS_IMAGE = '/src/assets/images/haveli_carved_doors_1794564897457.jpg';
export const RAJWADA_AAGMAN_CLOSED_IMAGE = '/assets/covers/rajwada-aagman-cover-poster.jpg';
export const RAJWADA_AAGMAN_OPEN_IMAGE = '/assets/covers/rajwada-aagman-card-open.jpg';
export const GENDA_CURTAIN_CLOSED_IMAGE = '/src/assets/images/genda_curtain_closed_1794743950096.jpg';
export const GENDA_COURTYARD_OPEN_IMAGE = '/src/assets/images/genda_courtyard_open_1794743950926.jpg';
export const IVORY_STATIONERY_HERO_IMAGE = '/assets/covers/shahi-mohar-card-open.jpg';
export const DEEPOTSAV_CLOSED_IMAGE = '/assets/covers/ghat-deepmala-cover-poster.jpg';
export const DEEPOTSAV_OPEN_IMAGE = '/assets/covers/ghat-deepmala-card-open.jpg';
export const ROSHNI_JAALI_CLOSED_IMAGE = '/assets/covers/chiraag-mandap-cover-poster.jpg';
export const ROSHNI_MANDAP_OPEN_IMAGE = '/assets/covers/chiraag-mandap-card-open.jpg';
export const TEMPLE_GOPURAM_CLOSED_IMAGE = '/assets/covers/devasthan-kovil-cover-poster.jpg';
export const TEMPLE_SANCTUM_OPEN_IMAGE = '/assets/covers/devasthan-kovil-card-open.jpg';
export const GULAB_VEIL_CLOSED_IMAGE = '/assets/covers/pushp-vasant-cover-poster.jpg';
export const GULAB_GARDEN_OPEN_IMAGE = '/assets/covers/pushp-vasant-card-open.jpg';
export const BIRTHDAY_CAKE_LIT_IMAGE = '/assets/covers/shama-mahotsav-cover-poster.jpg';
export const BIRTHDAY_SOIREE_OPEN_IMAGE = '/assets/covers/shama-mahotsav-card-open.jpg';
export const BIRTHDAY_GIFT_CLOSED_IMAGE = '/assets/covers/khushiyan-potli-cover-poster.jpg';
export const BIRTHDAY_GARDEN_OPEN_IMAGE = '/assets/covers/khushiyan-potli-card-open.jpg';
export const BIRTHDAY_COCKTAILS_JAZZ_IMAGE = '/src/assets/images/birthday_cocktails_jazz_1794746308342.jpg';
export const BIRTHDAY_DINNER_TOAST_IMAGE = '/src/assets/images/birthday_dinner_toast_1794746308453.jpg';
export const INDIAN_BABY_PALNA_CLOSED_IMAGE = '/src/assets/images/indian_baby_palna_closed_1794747023027.jpg';
export const INDIAN_BABY_COURTYARD_OPEN_IMAGE = '/src/assets/images/indian_baby_courtyard_open_1794747023396.jpg';
export const CHANDA_MAMA_NIGHT_CLOSED_IMAGE = '/src/assets/images/chanda_mama_night_closed_1794747024642.jpg';
export const CHANDA_MAMA_COURTYARD_OPEN_IMAGE = '/src/assets/images/chanda_mama_courtyard_open_1794747025614.jpg';
export const INDIAN_BABY_KATHPUTLI_IMAGE = '/src/assets/images/indian_baby_kathputli_party_1794747025762.jpg';
export const INDIAN_BABY_CAKE_MAKHAN_IMAGE = '/src/assets/images/indian_baby_cake_makhan_1794747025476.jpg';
export const BAAL_GOPAL_CLOSED_IMAGE = '/assets/covers/murlidhar-leela-cover-poster.jpg';
export const BAAL_GOPAL_OPEN_IMAGE = '/assets/covers/murlidhar-leela-card-open.jpg';
export const SHUBH_AARTI_CLOSED_IMAGE = '/assets/covers/kalash-pravesh-cover-poster.jpg?v=2';
export const SHUBH_AARTI_OPEN_IMAGE = '/assets/covers/kalash-pravesh-card-open.jpg?v=2';
export const RANGOLI_UTSAV_CLOSED_IMAGE = '/assets/covers/alpana-utsav-cover-poster.jpg';
export const RANGOLI_UTSAV_OPEN_IMAGE = '/src/assets/images/rangoli_utsav_open_1794749385367.jpg';
export const HINDU_PUJA_AARTI_THALI_IMAGE = '/src/assets/images/hindu_puja_aarti_thali_1794749385049.jpg';
export const HINDU_MITHAI_BHOJ_IMAGE = '/src/assets/images/hindu_mithai_bhoj_1794749386077.jpg';
export const LADLI_KANYA_CLOSED_IMAGE = '/assets/covers/nandini-jhula-cover-poster.jpg';
export const LADLI_KANYA_OPEN_IMAGE = '/assets/covers/nandini-jhula-card-open.jpg';
export const DEVI_KUMKUM_CLOSED_IMAGE = '/assets/covers/kumkum-kanya-cover-poster.jpg';
export const DEVI_KUMKUM_OPEN_IMAGE = '/assets/covers/kumkum-kanya-card-open.jpg';
export const GULAB_BAISA_CLOSED_IMAGE = '/assets/covers/gulabi-garh-cover-poster.jpg';
export const GULAB_BAISA_OPEN_IMAGE = '/assets/covers/gulabi-garh-card-open.jpg';
export const KANHA_MAKHAN_CLOSED_IMAGE = '/assets/covers/gokul-matki-cover-poster.jpg';
export const KANHA_MAKHAN_OPEN_IMAGE = '/assets/covers/gokul-matki-card-open.jpg';
export const VEER_BALAK_CLOSED_IMAGE = '/assets/covers/suryavanshi-tilak-cover-poster.jpg';
export const VEER_BALAK_OPEN_IMAGE = '/assets/covers/suryavanshi-tilak-card-open.jpg';
export const GANESH_AASHISH_CLOSED_IMAGE = '/src/assets/images/ganesh_aashish_closed_1794749900687.jpg';
export const GANESH_AASHISH_OPEN_IMAGE = '/src/assets/images/temple_sanctum_open_1794744613883.jpg';
export const HINDU_GIRL_PAYAL_MEHNDI_IMAGE = '/src/assets/images/hindu_girl_payal_mehndi_1794749901576.jpg';
export const PAITHANI_ANTARPAT_CLOSED_IMAGE = '/src/assets/images/paithani_antarpat_cover_1794751701706.jpg';
export const PAITHANI_COURTYARD_OPEN_IMAGE = '/src/assets/images/paithani_wada_courtyard_1794751701047.jpg';
export const KOHINOOR_CLOSED_IMAGE = '/src/assets/images/kohinoor_seal_closed_1794831319288.jpg';
export const KOHINOOR_OPEN_IMAGE = '/src/assets/images/kohinoor_darbar_open_1794831320409.jpg';
export const VRINDAVAN_CLOSED_IMAGE = '/assets/covers/braj-madhurima-cover-poster.jpg';
export const VRINDAVAN_OPEN_IMAGE = '/assets/covers/braj-madhurima-card-open.jpg';
export const KESARIYA_CLOSED_IMAGE = '/assets/covers/bandhani-saanjh-cover-poster.jpg';
export const KESARIYA_OPEN_IMAGE = '/assets/covers/bandhani-saanjh-card-open.jpg';
export const PATTU_ZARI_CLOSED_IMAGE = '/assets/covers/kanchi-kalyanam-cover-poster.jpg';
export const PATTU_MANDAP_OPEN_IMAGE = '/assets/covers/kanchi-kalyanam-card-open.jpg';
export const MEHR_CLOSED_IMAGE = '/assets/covers/noor-e-charbagh-cover-poster.jpg';
export const MEHR_OPEN_IMAGE = '/assets/covers/noor-e-charbagh-card-open.jpg';
export const KALGI_CLOSED_IMAGE = '/assets/covers/amrit-anand-cover-poster.jpg';
export const KALGI_OPEN_IMAGE = '/assets/covers/amrit-anand-card-open.jpg';
export const SAGE_BUNNY_CLOSED_IMAGE = '/assets/covers/sage-green-birthday-cover-poster.jpg';
export const SAGE_BUNNY_OPEN_IMAGE = '/src/assets/images/van_upvan_garden_hero_1794943970118.jpg';
export const BURGUNDY_PAISLEY_CLOSED_IMAGE = '/assets/covers/burgundy-gold-cover-poster.jpg';
export const BURGUNDY_PAISLEY_OPEN_IMAGE = '/src/assets/images/burgundy_paisley_darbar_open_1794908679060.jpg';
export const MAROON_RAJHANS_CLOSED_IMAGE = '/assets/covers/opulent-maroon-ganesha-cover-poster.jpg';
export const MAROON_RAJHANS_OPEN_IMAGE = '/src/assets/images/maroon_rajhans_mandap_open_1794908680505.jpg';
export const PURPLE_FILIGREE_CLOSED_IMAGE = '/assets/covers/ornate-gold-ganesha-cover-poster.jpg';
export const PURPLE_FILIGREE_OPEN_IMAGE = '/src/assets/images/purple_filigree_palace_open_1794908682793.jpg';
export const NAVY_SILVER_CLOSED_IMAGE = '/assets/covers/elegant-navy-ganesha-cover-poster.jpg';
export const NAVY_SILVER_OPEN_IMAGE = '/src/assets/images/navy_silver_sangeet_open_1794908684870.jpg';
export const SHEESH_MAHAL_UNLIT_DOME_IMAGE = '/src/assets/images/sheesh_mahal_unlit_1795031594306.jpg';
export const SHEESH_MAHAL_PLUM_DOME_IMAGE = '/src/assets/images/sheesh_mahal_plum_dome_1794986067708.jpg';
export const SHEESH_MAHAL_COUPLE_ARCH_IMAGE = '/src/assets/images/sheesh_mahal_couple_arch_1794986067429.jpg';

export const CEREMONIES: CeremonyItem[] = [
  {
    id: 'haldi',
    indexLabel: '01',
    title: {
      en: 'Haldi & Choora',
      hi: 'हल्दी एवं चूड़ा रस्म',
    },
    subtitle: {
      en: 'Morning of Turmeric, Marigolds & Folk Songs',
      hi: 'गेंदे के फूल, हल्दी और मांगलिक लोकगीतों की प्रातः',
    },
    date: {
      en: 'Friday, 12 February 2027',
      hi: 'शुक्रवार, 12 फ़रवरी 2027',
    },
    time: '10:30 AM',
    muhurat: {
      en: 'Shubh Muhurat · 11:05 AM',
      hi: 'शुभ मुहूर्त · प्रातः 11:05 बजे',
    },
    venue: {
      en: 'Champa Bagh Courtyard, Fateh Prakash Haveli',
      hi: 'चंपा बाग आँगन, फतेह प्रकाश हवेली',
    },
    attire: {
      en: 'Sunlit Marigold Yellow, Mustard & Ivory Cotton Silks',
      hi: 'पीला, केसरिया एवं हाथीदांत सूती रेशम परिधान',
    },
    accentHex: '#C88A2B',
    image: '/src/assets/images/mehendi_haldi_painting_1794564897730.jpg',
    imageAlt: 'Mewar miniature painting of a sunlit palace courtyard prepared with turmeric bowls and marigold garlands',
    rituals: [
      {
        time: '10:30 AM',
        label: {
          en: 'Tilak welcome & fresh sugarcane juice',
          hi: 'तिलक स्वागत एवं ताज़ा गन्ने का रस',
        },
      },
      {
        time: '11:05 AM',
        label: {
          en: 'Sacred Haldi, Ubtan & Choora ceremony',
          hi: 'पावन हल्दी, उबटन एवं चूड़ा अनुष्ठान',
        },
      },
      {
        time: '01:00 PM',
        label: {
          en: 'Traditional Mewari Thali courtyard lunch',
          hi: 'पारंपरिक मेवाड़ी थाली मध्याह्न भोज',
        },
      },
    ],
    hostNote: {
      en: 'Join us under the sunlit colonnades as petals and folk melodies open the wedding festivities.',
      hi: 'धूप से सजे आँगन में फूलों की वर्षा और ढोलक की थाप के साथ उत्सव का शुभारंभ करें।',
    },
  },
  {
    id: 'mehendi',
    indexLabel: '02',
    title: {
      en: 'Mehendi & High Tea',
      hi: 'मेहंदी एवं संध्या चाय',
    },
    subtitle: {
      en: 'Henna Artistry, Lac Bangles & Dusk Diyas',
      hi: 'मेहंदी की लाली, लाख की चूड़ियाँ और संध्या दीप',
    },
    date: {
      en: 'Friday, 12 February 2027',
      hi: 'शुक्रवार, 12 फ़रवरी 2027',
    },
    time: '04:30 PM',
    muhurat: {
      en: 'Golden Hour · 04:30 PM – 07:30 PM',
      hi: 'गोधूलि बेला · सायं 4:30 – 7:30 बजे',
    },
    venue: {
      en: 'Mor Chowk Terrace, City Palace',
      hi: 'मोर चौक छत, सिटी पैलेस',
    },
    attire: {
      en: 'Emerald Green, Leheriya Silks & Bandhani',
      hi: 'पन्ना हरा, लहरिया सिल्क एवं राजस्थानी बंधेज',
    },
    accentHex: '#2F6B4F',
    image: '/src/assets/images/jharokha_courtyard_dusk_1794564897495.jpg',
    imageAlt: 'Sandstone palace courtyard at dusk glowing with brass oil diyas and marigold garlands',
    rituals: [
      {
        time: '04:30 PM',
        label: {
          en: 'Organic Sojat henna artists & lac bangle stall',
          hi: 'सोजत मेहंदी कलाकार एवं लाख चूड़ी मंडप',
        },
      },
      {
        time: '05:30 PM',
        label: {
          en: 'Manganiyar folk ensemble & Mewari chaat',
          hi: 'मांगणियार लोक संगीत एवं मेवाड़ी चाट',
        },
      },
      {
        time: '06:45 PM',
        label: {
          en: 'Lighting of the courtyard diyas at twilight',
          hi: 'गोधूलि बेला में आँगन दीप प्रज्वलन',
        },
      },
    ],
    hostNote: {
      en: 'As twilight settles over the sandstone arches, sip masala chai beside handcrafted diyas.',
      hi: 'बलुआ पत्थर के झरोखों पर ढलती शाम के साथ लोक संगीत और मेहंदी का आनंद लें।',
    },
  },
  {
    id: 'sangeet',
    indexLabel: '03',
    title: {
      en: 'Sangeet & Royal Gala',
      hi: 'संगीत एवं राजसी रात्रि भोज',
    },
    subtitle: {
      en: 'Lakeside Lanterns, Dance & Celebration',
      hi: 'झील किनारे दीपमालिका, नृत्य और सुरमयी संध्या',
    },
    date: {
      en: 'Saturday, 13 February 2027',
      hi: 'शनिवार, 13 फ़रवरी 2027',
    },
    time: '07:30 PM',
    muhurat: {
      en: 'Doors Open · 07:30 PM Onwards',
      hi: 'स्वागत · रात्रि 7:30 बजे से',
    },
    venue: {
      en: 'Jagmandir Island Palace, Lake Pichola',
      hi: 'जगमंदिर द्वीप महल, पिछोला झील',
    },
    attire: {
      en: 'Midnight Indigo, Antique Gold & Regal Indo-Western',
      hi: 'रात्रि नीला, सुनहरा एवं राजसी पारंपरिक परिधान',
    },
    accentHex: '#233559',
    image: '/src/assets/images/sangeet_palace_night_1794564898780.jpg',
    imageAlt: 'Lakeside Rajasthani palace terrace at night illuminated by hanging brass lanterns and floating candles',
    rituals: [
      {
        time: '07:00 PM',
        label: {
          en: 'Private shikara boat transfer from Bansi Ghat Jetty',
          hi: 'बंसी घाट से जगमंदिर के लिए नौका प्रस्थान',
        },
      },
      {
        time: '08:15 PM',
        label: {
          en: 'Family choreographed performances & couple dance',
          hi: 'परिवार नृत्य प्रस्तुतियाँ एवं वर-वधू नृत्य',
        },
      },
      {
        time: '09:45 PM',
        label: {
          en: 'Royal Pichola dinner under the stars',
          hi: 'तारों की छाँव में शाही रात्रि भोज',
        },
      },
    ],
    hostNote: {
      en: 'Boats depart Bansi Ghat every fifteen minutes from 7:00 PM. Warm pashminas are recommended by the water.',
      hi: 'रात्रि 7:00 बजे से प्रत्येक पंद्रह मिनट में नौका प्रस्थान। झील की शीतल बयार हेतु शॉल साथ रखें।',
    },
  },
  {
    id: 'pheras',
    indexLabel: '04',
    title: {
      en: 'Baraat & Sacred Pheras',
      hi: 'बारात एवं पावन फेरे',
    },
    subtitle: {
      en: 'Seven Vows Beneath the Sandstone Mandap',
      hi: 'सप्तपदी एवं वैदिक मंत्रोच्चार के पावन क्षण',
    },
    date: {
      en: 'Sunday, 14 February 2027',
      hi: 'रविवार, 14 फ़रवरी 2027',
    },
    time: '04:00 PM',
    muhurat: {
      en: 'Godhuli Pheras · 06:15 PM',
      hi: 'गोधूलि फेरे · सायं 6:15 बजे',
    },
    venue: {
      en: 'Zenana Mahal Courtyard, City Palace',
      hi: 'ज़नाना महल आँगन, सिटी पैलेस',
    },
    attire: {
      en: 'Sindoor Crimson, Heritage Benarasi & Pastel Gold',
      hi: 'सिंदूरी लाल, बनारसी एवं सुनहरा पारंपरिक परिधान',
    },
    accentHex: '#9E2A2B',
    image: '/src/assets/images/mandap_pheras_courtyard_1794564899328.jpg',
    imageAlt: 'Grand Rajasthani sandstone wedding mandap adorned with crimson roses, marigolds, and flickering oil lamps',
    rituals: [
      {
        time: '04:00 PM',
        label: {
          en: 'Safa tying & royal Baraat procession with shehnai',
          hi: 'साफा बंधाई एवं शहनाई के साथ शाही बारात',
        },
      },
      {
        time: '05:30 PM',
        label: {
          en: 'Varmala exchange at the lotus pavilion',
          hi: 'कमल मंडप में वरमाला मिलन',
        },
      },
      {
        time: '06:15 PM',
        label: {
          en: 'Vedic Pheras followed by Grand Reception Dinner',
          hi: 'वैदिक फेरे एवं भव्य प्रीतिभोज',
        },
      },
    ],
    hostNote: {
      en: 'Your presence and blessings as Aarav and Meera take seven vows around the sacred fire are our greatest gift.',
      hi: 'अग्नि को साक्षी मानकर लिए जाने वाले सात फेरों में आपका आशीर्वाद ही हमारा सबसे बड़ा उपहार है।',
    },
  },
];

export const FAMILY_PROFILES: FamilyGuestProfile[] = [
  {
    id: 'kapoor',
    familyName: {
      en: 'The Kapoor Family',
      hi: 'कपूर परिवार',
    },
    greetingNote: {
      en: 'Invited to all four celebrations',
      hi: 'सभी चार मांगलिक कार्यक्रमों हेतु सादर आमंत्रित',
    },
    invitedCeremonies: ['haldi', 'mehendi', 'sangeet', 'pheras'],
    defaultGuests: 4,
  },
  {
    id: 'verma',
    familyName: {
      en: 'The Verma Family',
      hi: 'वर्मा परिवार',
    },
    greetingNote: {
      en: 'Invited to Mehendi, Sangeet & Sacred Pheras',
      hi: 'मेहंदी, संगीत एवं पावन फेरों हेतु सादर आमंत्रित',
    },
    invitedCeremonies: ['mehendi', 'sangeet', 'pheras'],
    defaultGuests: 2,
  },
  {
    id: 'mehta',
    familyName: {
      en: 'The Mehta Family',
      hi: 'मेहता परिवार',
    },
    greetingNote: {
      en: 'Invited to the Sangeet Gala & Sacred Pheras',
      hi: 'संगीत संध्या एवं पावन फेरों हेतु सादर आमंत्रित',
    },
    invitedCeremonies: ['sangeet', 'pheras'],
    defaultGuests: 2,
  },
];

export const UI_COPY = {
  nav: {
    courtyard: { en: 'Courtyard', hi: 'आँगन' },
    ceremonies: { en: 'Ceremonies', hi: 'कार्यक्रम' },
    venue: { en: 'Venue & Stay', hi: 'स्थल एवं प्रवास' },
    rsvp: { en: 'RSVP', hi: 'स्वीकृति' },
    rsvpCta: { en: 'Respond Now', hi: 'स्वीकृति दें' },
  },
  gate: {
    tagline: {
      en: 'Shubh Vivah Invitation · Udaipur',
      hi: 'शुभ विवाह निमंत्रण · उदयपुर',
    },
    tapPrompt: {
      en: 'Open Haveli Doors',
      hi: 'हवेली के द्वार खोलें',
    },
    subPrompt: {
      en: 'Tap the carved teakwood doors to enter the twilight courtyard',
      hi: 'गोधूलि आँगन में प्रवेश करने हेतु नक्काशीदार द्वार पर क्लिक करें',
    },
  },
  hero: {
    blessing: {
      en: '॥ श्री गणेशाय नमः ॥',
      hi: '॥ श्री गणेशाय नमः ॥',
    },
    inviteLine: {
      en: 'Together with their families, invite you to celebrate the wedding of',
      hi: 'अपने परिवारजनों के साथ आपको सादर आमंत्रित करते हैं',
    },
    countdownLabels: {
      days: { en: 'Days', hi: 'दिन' },
      hours: { en: 'Hours', hi: 'घंटे' },
      mins: { en: 'Minutes', hi: 'मिनट' },
      secs: { en: 'Seconds', hi: 'सेकंड' },
    },
    exploreCards: {
      en: 'View Ceremony Cards',
      hi: 'निमंत्रण पत्र देखें',
    },
  },
  cardsSection: {
    eyebrow: {
      en: 'Wedding Itinerary · Mewar Suite',
      hi: 'मांगलिक कार्यक्रम · मेवाड़ पत्रिका',
    },
    heading: {
      en: 'Ceremony Cards',
      hi: 'उत्सव निमंत्रण पत्र',
    },
    description: {
      en: 'Drag, tap a tucked edge, or flip any card to inspect ceremonial timings, dress codes, and courtyard details.',
      hi: 'प्रत्येक कार्यक्रम का शुभ मुहूर्त, परिधान और स्थल देखने के लिए कार्ड को घुमाएँ या पलटें।',
    },
    deckMode: { en: 'Stacked Deck', hi: 'स्टैक डेक' },
    gridMode: { en: 'All Cards', hi: 'सभी कार्ड' },
    flipToDetails: { en: 'Turn Card Over', hi: 'विवरण देखें' },
    flipToFront: { en: 'View Artwork', hi: 'मुख्य पृष्ठ देखें' },
    rsvpThis: { en: 'RSVP for this Ceremony', hi: 'इस कार्यक्रम की स्वीकृति दें' },
  },
};

export const BIRTHDAY_CEREMONIES: CeremonyItem[] = [
  {
    id: 'haldi',
    indexLabel: '01',
    title: {
      en: 'Welcome Spritz & Vinyl Set',
      hi: 'स्वागत पेय एवं मधुर संगीत',
    },
    subtitle: {
      en: 'Chilled Saffron Spritz, Polaroids & Acoustic Vinyl',
      hi: 'गोधूलि आँगन में ठंडे पेय और मधुर धुनें',
    },
    date: {
      en: 'Sunday, 28 February 2027',
      hi: 'रविवार, 28 फ़रवरी 2027',
    },
    time: '07:30 PM',
    muhurat: {
      en: 'Doors Open · 07:30 PM',
      hi: 'स्वागत · सायं 7:30 बजे',
    },
    venue: {
      en: 'Terrace Courtyard Bar, Udaipur',
      hi: 'छत उद्यान बार, उदयपुर',
    },
    attire: {
      en: 'Velvet Plum, Champagne Silk & Smart Festive',
      hi: 'शाम का उत्सव परिधान',
    },
    accentHex: '#E6B86A',
    image: BIRTHDAY_COCKTAILS_JAZZ_IMAGE,
    imageAlt: 'Chilled botanical saffron spritz cocktails beside vinyl record player and candleholders',
    rituals: [],
    hostNote: {
      en: 'Arrive early for golden-hour spritzers and instant polaroid keepsakes.',
      hi: 'गोधूलि बेला में मित्रों संग स्नेहिल भेंट और यादगार तस्वीरें।',
    },
  },
  {
    id: 'mehendi',
    indexLabel: '02',
    title: {
      en: 'Cake & Make-a-Wish Toast',
      hi: 'केक कटाई एवं शुभकामनाएँ',
    },
    subtitle: {
      en: 'Five Taper Candles, Champagne & Toasts',
      hi: 'मोमबत्तियाँ बुझाएँ और शुभकामना दें',
    },
    date: {
      en: 'Sunday, 28 February 2027',
      hi: 'रविवार, 28 फ़रवरी 2027',
    },
    time: '08:45 PM',
    muhurat: {
      en: 'Birthday Toast · 08:45 PM',
      hi: 'केक उत्सव · रात्रि 8:45 बजे',
    },
    venue: {
      en: 'Candlelight Pavilion, Main Lawn',
      hi: 'कैंडललाइट मंडप, मुख्य उद्यान',
    },
    attire: {
      en: 'Sparkle Gold, Rosewood & Evening Tailoring',
      hi: 'सुनहरा एवं शाम का विशेष परिधान',
    },
    accentHex: '#D94F3D',
    image: BIRTHDAY_CAKE_LIT_IMAGE,
    imageAlt: 'Artisanal layered chocolate and pistachio birthday cake topped with glowing taper candles',
    rituals: [],
    hostNote: {
      en: 'Gather around the brass cake stand as we light the candles together.',
      hi: 'केक और शुभकामनाओं के साथ जन्मदिन का मुख्य उत्सव।',
    },
  },
  {
    id: 'sangeet',
    indexLabel: '03',
    title: {
      en: 'Candlelit Long-Table Dinner',
      hi: 'दीपों की छाँव में रात्रि भोज',
    },
    subtitle: {
      en: 'Seasonal Five-Course Feast & Acoustic Jazz',
      hi: 'सुस्वादु व्यंजन एवं मित्रों संग रात्रि भोज',
    },
    date: {
      en: 'Sunday, 28 February 2027',
      hi: 'रविवार, 28 फ़रवरी 2027',
    },
    time: '09:30 PM',
    muhurat: {
      en: 'Dinner Served · 09:30 PM',
      hi: 'रात्रि भोज · 9:30 बजे',
    },
    venue: {
      en: 'Lantern Courtyard Long Table',
      hi: 'लालटेन आँगन भोजन कक्ष',
    },
    attire: {
      en: 'Midnight Linen & Jewel Tones',
      hi: 'उत्सव परिधान',
    },
    accentHex: '#C98A95',
    image: BIRTHDAY_DINNER_TOAST_IMAGE,
    imageAlt: 'Overhead birthday dinner celebration table with glowing candles, sliced cake, and clinking glasses',
    rituals: [],
    hostNote: {
      en: 'Chef’s tasting menu served under warm overhead string lights.',
      hi: 'तारों की छाँव में पारंपरिक एवं विशेष रात्रि भोज।',
    },
  },
  {
    id: 'pheras',
    indexLabel: '04',
    title: {
      en: 'Midnight Chai & Lawn Afterparty',
      hi: 'मध्यरात्रि चाय एवं संगीत',
    },
    subtitle: {
      en: 'Bonfire Lounge, Chai & Dance Under the Stars',
      hi: 'तारों तले मधुर संगीत और कुल्हड़ चाय',
    },
    date: {
      en: 'Sunday, 28 February 2027',
      hi: 'रविवार, 28 फ़रवरी 2027',
    },
    time: '11:00 PM',
    muhurat: {
      en: 'Late Night · 11:00 PM Onwards',
      hi: 'रात्रि 11:00 बजे से',
    },
    venue: {
      en: 'Verandah Firepit Lounge',
      hi: 'बरामदा लाउंज',
    },
    attire: {
      en: 'Warm Shawls & Easy Evening Layers',
      hi: 'आरामदायक शाम के परिधान',
    },
    accentHex: '#F4B41A',
    image: BIRTHDAY_SOIREE_OPEN_IMAGE,
    imageAlt: 'Candlelit terrace birthday party celebration table glowing at night',
    rituals: [],
    hostNote: {
      en: 'Stay for freshly brewed cardamom chai and favourite throwbacks.',
      hi: 'इलायची चाय और मनपसंद गीतों के साथ देर रात का आनंद।',
    },
  },
];

export const BIRTHDAY_SWATCHES: Record<CeremonyId, { name: { en: string; hi: string }; colors: string[] }> = {
  haldi: {
    name: { en: 'Citrus & Buttercream', hi: 'नींबू पीला व क्रीम' },
    colors: ['#D94F3D', '#E6B86A', '#FFF8EE'],
  },
  mehendi: {
    name: { en: 'Velvet Plum & Gold', hi: 'जामुनी मखमल व सुनहरा' },
    colors: ['#321C47', '#E6B86A', '#F3EADB'],
  },
  sangeet: {
    name: { en: 'Rosewater & Terracotta', hi: 'गुलाब व टेराकोटा' },
    colors: ['#C96452', '#F4A6B8', '#23477E'],
  },
  pheras: {
    name: { en: 'Midnight Charcoal & Linen', hi: 'रात्रि स्लेटी व लिनेन' },
    colors: ['#150E1E', '#8E735B', '#FAF3E8'],
  },
};

export const BABY_BIRTHDAY_CEREMONIES: CeremonyItem[] = [
  {
    id: 'haldi',
    indexLabel: '01',
    title: {
      en: 'Tilak, Aarti & Ashirwad',
      hi: 'तिलक, आरती एवं आशीर्वाद',
    },
    subtitle: {
      en: 'Dadi’s Kumkum Tilak & Palna Jhula Blessings',
      hi: 'दादी-नानी का तिलक एवं पलना झुलाई रस्म',
    },
    date: {
      en: 'Sunday, 28 February 2027',
      hi: 'रविवार, 28 फ़रवरी 2027',
    },
    time: '04:30 PM',
    muhurat: {
      en: 'Shubh Aarti · 04:30 PM',
      hi: 'शुभ आरती · सायं 4:30 बजे',
    },
    venue: {
      en: 'Marigold Veranda & Palna Pavilion, Udaipur',
      hi: 'गेंदा बरामदा एवं पलना मंडप, उदयपुर',
    },
    attire: {
      en: 'Haldi Sunshine Yellow, Ivory Cotton & Bandhani',
      hi: 'हल्दी पीला, सूती चंदन एवं बंधेज',
    },
    accentHex: '#D98A1A',
    image: INDIAN_BABY_PALNA_CLOSED_IMAGE,
    imageAlt: 'Hand-painted Rajasthani wooden nursery doorway adorned with mango leaves and marigold toran',
    rituals: [],
    hostNote: {
      en: 'Family elders bless the little one with akshat, marigold petals, and aarti around the decorated cradle.',
      hi: 'परिवार के बड़े-बुजुर्ग नन्हे मेहमान को अक्षत, पुष्प वर्षा और आरती से आशीर्वाद देंगे।',
    },
  },
  {
    id: 'mehendi',
    indexLabel: '02',
    title: {
      en: 'Kathputli Show & Toy Garden',
      hi: 'कठपुतली शो एवं बाल खेल',
    },
    subtitle: {
      en: 'Rajasthani Puppets, Wooden Toys & Mehndi Corner',
      hi: 'राजस्थानी कठपुतली, खिलौने व मेहंदी उत्सव',
    },
    date: {
      en: 'Sunday, 28 February 2027',
      hi: 'रविवार, 28 फ़रवरी 2027',
    },
    time: '05:30 PM',
    muhurat: {
      en: 'Kids Carnival · 05:30 PM',
      hi: 'बाल मेला · सायं 5:30 बजे',
    },
    venue: {
      en: 'Champa Lawn Toy Courtyard',
      hi: 'चंपा उद्यान खेल आँगन',
    },
    attire: {
      en: 'Playful Pastels, Leheriya & Kurta-Pajama',
      hi: 'रंग-बिरंगा लहरिया एवं कुर्ता-पाजामा',
    },
    accentHex: '#C4452B',
    image: INDIAN_BABY_KATHPUTLI_IMAGE,
    imageAlt: 'Colorful Rajasthani kathputli string puppets and painted wooden Channapatna spinning tops in courtyard sunlight',
    rituals: [],
    hostNote: {
      en: 'Traditional folk puppeteers, lac bangle stalls, and Channapatna toy baskets for every child.',
      hi: 'पारंपरिक कठपुतली कलाकार, चूड़ी और खिलौनों का विशेष बाल आँगन।',
    },
  },
  {
    id: 'sangeet',
    indexLabel: '03',
    title: {
      en: 'Pehla Cake & Makhan-Mishri',
      hi: 'पहला केक एवं माखन-मिश्री',
    },
    subtitle: {
      en: 'Lighting Candle No. 1, Happy Birthday & Sweet Toast',
      hi: 'प्रथम दीप प्रज्वलन, केक और माखन-मिश्री प्रसाद',
    },
    date: {
      en: 'Sunday, 28 February 2027',
      hi: 'रविवार, 28 फ़रवरी 2027',
    },
    time: '06:45 PM',
    muhurat: {
      en: 'Milestone Cake · 06:45 PM',
      hi: 'प्रथम केक उत्सव · सायं 6:45 बजे',
    },
    venue: {
      en: 'Moonlit Courtyard Jhula Stage',
      hi: 'चाँदनी आँगन झूला मंच',
    },
    attire: {
      en: 'Lotus Rose, Peacock Indigo & Antique Gold',
      hi: 'कमल गुलाबी, मयूर नीला एवं सुनहरा',
    },
    accentHex: '#1F3A68',
    image: INDIAN_BABY_CAKE_MAKHAN_IMAGE,
    imageAlt: 'Artisanal saffron cardamom pistachio first birthday cake topped with brass number one beside mishri bowl and lit diya',
    rituals: [],
    hostNote: {
      en: 'Gather together for the first birthday wish, saffron-pistachio cake, and silver-bowl mishri.',
      hi: 'पहली जन्मदिन मोमबत्ती, केसर-पिस्ता केक और माखन-मिश्री के साथ मधुर उत्सव।',
    },
  },
  {
    id: 'pheras',
    indexLabel: '04',
    title: {
      en: 'Family Dawat & Potli Favours',
      hi: 'पारिवारिक प्रीतिभोज एवं उपहार',
    },
    subtitle: {
      en: 'Ghar-Jaisa Festive Feast, Matka Kulfi & Return Potlis',
      hi: 'स्नेह भोज, मटका कुल्फी एवं हस्तनिर्मित पोटली भेंट',
    },
    date: {
      en: 'Sunday, 28 February 2027',
      hi: 'रविवार, 28 फ़रवरी 2027',
    },
    time: '07:45 PM',
    muhurat: {
      en: 'Festive Dinner · 07:45 PM Onwards',
      hi: 'प्रीतिभोज · रात्रि 7:45 बजे से',
    },
    venue: {
      en: 'Haveli Courtyard Dining Hall',
      hi: 'हवेली आँगन भोजन कक्ष',
    },
    attire: {
      en: 'Comfortable Silk & Festive Evening Wear',
      hi: 'पारंपरिक पारिवारिक उत्सव परिधान',
    },
    accentHex: '#3F7D3A',
    image: INDIAN_BABY_COURTYARD_OPEN_IMAGE,
    imageAlt: 'Warm sunlit Indian courtyard dressed with carved wooden palna swing, marigolds, and birthday cake',
    rituals: [],
    hostNote: {
      en: 'Relish hot Dal-Baati, live kulfi cart, and take home embroidered silk potlis filled with sweets.',
      hi: 'गरमागरम पारंपरिक भोज, मटका कुल्फी और बच्चों के लिए स्नेहिल उपहार पोटली।',
    },
  },
];

export const BABY_BIRTHDAY_SWATCHES: Record<CeremonyId, { name: { en: string; hi: string }; colors: string[] }> = {
  haldi: {
    name: { en: 'Haldi Sunshine & Chandan', hi: 'हल्दी पीला व चंदन' },
    colors: ['#F2A900', '#FCE588', '#FFF7EC'],
  },
  mehendi: {
    name: { en: 'Kumkum & Leheriya', hi: 'कुमकुम व लहरिया' },
    colors: ['#C4452B', '#E8891C', '#F9EAC6'],
  },
  sangeet: {
    name: { en: 'Chanda Indigo & Silver', hi: 'चंदा नीला व चाँदी' },
    colors: ['#101935', '#F2CB78', '#E4E9F7'],
  },
  pheras: {
    name: { en: 'Mayur Peacock & Gulab', hi: 'मयूर हरा व गुलाब' },
    colors: ['#184E59', '#D95A74', '#FAF3E8'],
  },
};

export const HINDU_BIRTHDAY_CEREMONIES: CeremonyItem[] = [
  {
    id: 'haldi',
    indexLabel: '01',
    title: {
      en: 'Ganesh Vandana & Tilak',
      hi: 'गणेश वंदना एवं कुमकुम तिलक',
    },
    subtitle: {
      en: 'Purna Kalash Sthapana, Swasti Vachan & Kumkum Tilak',
      hi: 'पूर्ण कलश स्थापना, स्वस्तिवाचन एवं तिलक',
    },
    date: {
      en: 'Sunday, 28 February 2027',
      hi: 'रविवार, 28 फ़रवरी 2027',
    },
    time: '04:30 PM',
    muhurat: {
      en: 'Shubh Sankalp · 04:30 PM',
      hi: 'शुभ संकल्प · सायं 4:30 बजे',
    },
    venue: {
      en: 'Mandir Courtyard Chowki, Udaipur',
      hi: 'मंदिर आँगन चौकी, उदयपुर',
    },
    attire: {
      en: 'Pitambari Yellow, Silk Kurta & Sandalwood Ivory',
      hi: 'पीताम्बरी पीला, सिल्क कुर्ता एवं चंदन',
    },
    accentHex: '#D98A1A',
    image: HINDU_PUJA_AARTI_THALI_IMAGE,
    imageAlt: 'Hammered brass Hindu birthday aarti thali with lit diya, kumkum, haldi, akshat rice and mogra flowers',
    rituals: [],
    hostNote: {
      en: 'Begin the birthday with sacred mantras, kumkum-akshat tilak, and elders’ auspicious blessings.',
      hi: 'वैदिक मंत्रोच्चार, कुमकुम तिलक और बड़े-बुजुर्गों के आशीर्वाद से जन्मदिन उत्सव का शुभारंभ।',
    },
  },
  {
    id: 'mehendi',
    indexLabel: '02',
    title: {
      en: 'Panch-Aarti & Jhula Blessings',
      hi: 'पंच-आरती एवं झूला दर्शन',
    },
    subtitle: {
      en: 'Brass Lamp Aarti, Temple Bells & Bhajan Recital',
      hi: 'पीतल आरती, घंटानाद एवं मधुर भजन संध्या',
    },
    date: {
      en: 'Sunday, 28 February 2027',
      hi: 'रविवार, 28 फ़रवरी 2027',
    },
    time: '05:30 PM',
    muhurat: {
      en: 'Sandhya Aarti · 05:30 PM',
      hi: 'संध्या आरती · सायं 5:30 बजे',
    },
    venue: {
      en: 'Carved Veranda Mandapam',
      hi: 'नक्काशीदार बरामदा मंडपम',
    },
    attire: {
      en: 'Sindoor Red, Peacock Teal & Antique Gold',
      hi: 'सिंदूरी लाल, मयूर नीला एवं सुनहरा',
    },
    accentHex: '#9E2A2B',
    image: SHUBH_AARTI_OPEN_IMAGE,
    imageAlt: 'Hindu home mandir courtyard glowing with brass panch-aarti lamp, copper kalash, temple bells and marigold garlands',
    rituals: [],
    hostNote: {
      en: 'Chimes of temple bells and five-wick brass aarti surround the courtyard in warm golden light.',
      hi: 'मंदिर की घंटियों और पंच-आरती के दिव्य प्रकाश में परिवारजनों का स्नेह मिलन।',
    },
  },
  {
    id: 'sangeet',
    indexLabel: '03',
    title: {
      en: 'Makhan-Mishri & Saffron Cake',
      hi: 'माखन-मिश्री भोग एवं केक',
    },
    subtitle: {
      en: 'Motichoor Laddoos, Kesar Kheer & Birthday Diya',
      hi: 'मोतीचूर लड्डू, केसर खीर एवं जन्मदिन दीप',
    },
    date: {
      en: 'Sunday, 28 February 2027',
      hi: 'रविवार, 28 फ़रवरी 2027',
    },
    time: '06:45 PM',
    muhurat: {
      en: 'Bhog & Cake · 06:45 PM',
      hi: 'भोग व केक · सायं 6:45 बजे',
    },
    venue: {
      en: 'Palna & Rangoli Courtyard Pavilion',
      hi: 'पलना एवं रंगोली आँगन मंडप',
    },
    attire: {
      en: 'Banarasi Silk, Marigold Saffron & Pastels',
      hi: 'बनारसी सिल्क एवं केसरिया परिधान',
    },
    accentHex: '#134E4A',
    image: HINDU_MITHAI_BHOJ_IMAGE,
    imageAlt: 'Brass platter with saffron pistachio rose birthday cake, motichoor laddoos with silver leaf, and kesar kheer',
    rituals: [],
    hostNote: {
      en: 'Instead of blowing out flames, light the auspicious brass diya and share Makhan-Mishri & laddoos!',
      hi: 'दीपक बुझाने के बजाय शुभ दीप प्रज्वलित कर माखन-मिश्री, लड्डू और केक का आनंद लें।',
    },
  },
  {
    id: 'pheras',
    indexLabel: '04',
    title: {
      en: 'Satvik Priti Bhoj & Prashad',
      hi: 'सात्विक प्रीतिभोज एवं प्रसाद',
    },
    subtitle: {
      en: 'Traditional Rajasthani Thali & Sacred Potli Prashad',
      hi: 'पारंपरिक सात्विक थाली एवं स्नेह पोटली भेंट',
    },
    date: {
      en: 'Sunday, 28 February 2027',
      hi: 'रविवार, 28 फ़रवरी 2027',
    },
    time: '07:45 PM',
    muhurat: {
      en: 'Priti Bhoj · 07:45 PM Onwards',
      hi: 'प्रीतिभोज · रात्रि 7:45 बजे से',
    },
    venue: {
      en: 'Urli & Mango-Toran Dining Courtyard',
      hi: 'उरली एवं आम्र-तोरण भोजन आँगन',
    },
    attire: {
      en: 'Festive Handloom & Comfortable Silks',
      hi: 'हैंडलूम सिल्क एवं पारिवारिक परिधान',
    },
    accentHex: '#2E6B47',
    image: RANGOLI_UTSAV_OPEN_IMAGE,
    imageAlt: 'Festive Indian courtyard birthday gathering beside brass urli of pink lotuses and mango-leaf toran',
    rituals: [],
    hostNote: {
      en: 'Dine together on warm traditional delicacies and receive hand-packed dryfruit prashad potlis.',
      hi: 'परिवार सहित सात्विक भोज का आनंद लें और प्रसाद व स्नेह भेंट स्वीकार करें।',
    },
  },
];

export const HINDU_BIRTHDAY_SWATCHES: Record<CeremonyId, { name: { en: string; hi: string }; colors: string[] }> = {
  haldi: {
    name: { en: 'Pitambari & Chandan', hi: 'पीताम्बरी व चंदन' },
    colors: ['#F2A900', '#FCE588', '#F6EFE0'],
  },
  mehendi: {
    name: { en: 'Sindoor & Kanjivaram', hi: 'सिंदूरी लाल व काँजीवरम' },
    colors: ['#9E2A2B', '#C88A2B', '#FFF6E8'],
  },
  sangeet: {
    name: { en: 'Mayur Peacock Teal', hi: 'मयूर नीला व सुनहरा' },
    colors: ['#134E4A', '#2563EB', '#F2CB78'],
  },
  pheras: {
    name: { en: 'Tulsi Green & Saffron', hi: 'तुलसी हरा व केसरिया' },
    colors: ['#2E6B47', '#E8891C', '#FFF9ED'],
  },
};

export const HINDU_GIRL_BIRTHDAY_CEREMONIES: CeremonyItem[] = [
  {
    id: 'haldi',
    indexLabel: '01',
    title: {
      en: 'Lakshmi Puja & Kumkum Tilak',
      hi: 'लक्ष्मी पूजन एवं कुमकुम तिलक',
    },
    subtitle: {
      en: 'Haldi-Kumkum Thali, Mogra Gajra & Elders’ Ashirwad',
      hi: 'हल्दी-कुमकुम थाली, मोगरा गजरा एवं आशीर्वाद',
    },
    date: {
      en: 'Sunday, 28 February 2027',
      hi: 'रविवार, 28 फ़रवरी 2027',
    },
    time: '04:30 PM',
    muhurat: {
      en: 'Shubh Puja · 04:30 PM',
      hi: 'शुभ पूजन · सायं 4:30 बजे',
    },
    venue: {
      en: 'Kamal Mandir Courtyard, Udaipur',
      hi: 'कमल मंदिर आँगन, उदयपुर',
    },
    attire: {
      en: 'Rani Pink Silk, Gota-Patti Lehenga & Mogra',
      hi: 'रानी गुलाबी गोटा-पत्ती एवं मोगरा गजरा',
    },
    accentHex: '#B82952',
    image: DEVI_KUMKUM_CLOSED_IMAGE,
    imageAlt: 'Hammered brass kumkum haldi thali encircled by white mogra jasmine on rani-pink Banarasi silk',
    rituals: [],
    hostNote: {
      en: 'Begin with Devi Vandana, kumkum-haldi tilak, and showering flower petals around the courtyard.',
      hi: 'देवी वंदना, कुमकुम तिलक और पुष्प वर्षा के साथ लाड़ली के जन्मोत्सव का शुभारंभ।',
    },
  },
  {
    id: 'mehendi',
    indexLabel: '02',
    title: {
      en: 'Payal, Mehndi & Phool Jhula',
      hi: 'पायल, मेहंदी एवं फूलों का झूला',
    },
    subtitle: {
      en: 'Silver Ghungroos, Sojat Henna & Lotus Swing Songs',
      hi: 'चाँदी की पायल, सोजत मेहंदी और झूला लोकगीत',
    },
    date: {
      en: 'Sunday, 28 February 2027',
      hi: 'रविवार, 28 फ़रवरी 2027',
    },
    time: '05:30 PM',
    muhurat: {
      en: 'Jhula Utsav · 05:30 PM',
      hi: 'झूला उत्सव · सायं 5:30 बजे',
    },
    venue: {
      en: 'Pink Sandstone Jharokha Veranda',
      hi: 'गुलाबी झरोखा बरामदा आँगन',
    },
    attire: {
      en: 'Lotus Rose, Ivory Chanderi & Pearl Bangles',
      hi: 'कमल गुलाबी, चंदेरी एवं मोती कंगन',
    },
    accentHex: '#C7385B',
    image: HINDU_GIRL_PAYAL_MEHNDI_IMAGE,
    imageAlt: 'Brass tray with silver payal ghungroo anklets, henna cone, fresh mogra gajra and pink rose petals',
    rituals: [],
    hostNote: {
      en: 'Tiny hands painted with festive henna, jasmine gajras, and laughter on the marigold-lotus jhula.',
      hi: 'मेहंदी रचे हाथों, मोगरा गजरे और सजे हुए झूले पर सखियों संग मधुर आनंद।',
    },
  },
  {
    id: 'sangeet',
    indexLabel: '03',
    title: {
      en: 'Panch-Aarti & Rose-Saffron Cake',
      hi: 'पंच-आरती एवं केसर-गुलाब केक',
    },
    subtitle: {
      en: 'Brass Diya Lighting, Kesar Kheer & Birthday Toast',
      hi: 'शुभ दीप प्रज्वलन, केसर खीर व शुभकामनाएँ',
    },
    date: {
      en: 'Sunday, 28 February 2027',
      hi: 'रविवार, 28 फ़रवरी 2027',
    },
    time: '06:45 PM',
    muhurat: {
      en: 'Aarti & Cake · 06:45 PM',
      hi: 'आरती व केक · सायं 6:45 बजे',
    },
    venue: {
      en: 'Diya & Lotus Jhula Pavilion',
      hi: 'दीप एवं कमल झूला मंडप',
    },
    attire: {
      en: 'Antique Gold Tissue, Sindoor Red & Pastels',
      hi: 'सुनहरा टिश्यू, सिंदूरी एवं पेस्टल सिल्क',
    },
    accentHex: '#D98A1A',
    image: LADLI_KANYA_OPEN_IMAGE,
    imageAlt: 'Palace courtyard swing adorned with pink lotus garlands, glowing brass diya and saffron birthday cake',
    rituals: [],
    hostNote: {
      en: 'Light the five-wick aarti diya together for long life and wisdom, followed by rosewater pistachio cake.',
      hi: 'पंच-आरती के मंगल दीप जलाकर दीर्घायु व सौभाग्य की कामना और केसर-पिस्ता केक उत्सव।',
    },
  },
  {
    id: 'pheras',
    indexLabel: '04',
    title: {
      en: 'Kanya Bhoj & Silk Potli Favours',
      hi: 'प्रीतिभोज एवं स्नेह पोटली भेंट',
    },
    subtitle: {
      en: 'Traditional Rajasthani Feast, Kheer & Shagun Bangles',
      hi: 'सात्विक भोज, केसर खीर व चूड़ी-पोटली उपहार',
    },
    date: {
      en: 'Sunday, 28 February 2027',
      hi: 'रविवार, 28 फ़रवरी 2027',
    },
    time: '07:45 PM',
    muhurat: {
      en: 'Priti Bhoj · 07:45 PM Onwards',
      hi: 'प्रीतिभोज · रात्रि 7:45 बजे से',
    },
    venue: {
      en: 'Urli & Rose Terrace Dining Hall',
      hi: 'गुलाब उरली भोजन प्रांगण',
    },
    attire: {
      en: 'Warm Festive Silks & Leheriya',
      hi: 'रेशमी साड़ी एवं पारंपरिक परिधान',
    },
    accentHex: '#8C1622',
    image: GULAB_BAISA_OPEN_IMAGE,
    imageAlt: 'Pink Jaipur sandstone courtyard birthday feast beside rose petal brass urli and saffron cake',
    rituals: [],
    hostNote: {
      en: 'Enjoy traditional home-style delicacies, kesar kheer, and return gift potlis filled with bangles and sweets.',
      hi: 'पारिवारिक प्रीतिभोज, केसरिया खीर और सभी बहनों-सखियों के लिए स्नेह पोटली भेंट।',
    },
  },
];

export const HINDU_GIRL_BIRTHDAY_SWATCHES: Record<CeremonyId, { name: { en: string; hi: string }; colors: string[] }> = {
  haldi: {
    name: { en: 'Kumkum & Rani Silk', hi: 'कुमकुम व रानी सिल्क' },
    colors: ['#B82952', '#F4B844', '#FDF0F2'],
  },
  mehendi: {
    name: { en: 'Mogra Ivory & Rose', hi: 'मोगरा व गुलाब' },
    colors: ['#C7385B', '#FAF4EC', '#3F7D3A'],
  },
  sangeet: {
    name: { en: 'Gota Gold & Sindoor', hi: 'गोटा सुनहरा व सिंदूरी' },
    colors: ['#D98A1A', '#8C1622', '#FBE7CE'],
  },
  pheras: {
    name: { en: 'Jaipur Rose Sandstone', hi: 'जयपुरी गुलाबी बलुआ' },
    colors: ['#D9687C', '#F2A900', '#FFF2EE'],
  },
};

export const HINDU_BOY_BIRTHDAY_CEREMONIES: CeremonyItem[] = [
  {
    id: 'haldi',
    indexLabel: '01',
    title: {
      en: 'Ganesh Sthapana & Surya Tilak',
      hi: 'गणेश स्थापना एवं सूर्य तिलक',
    },
    subtitle: {
      en: 'Purna Kalash, Chandan-Kumkum Tilak & Kalawa',
      hi: 'पूर्ण कलश, चंदन-कुमकुम तिलक व रक्षासूत्र',
    },
    date: {
      en: 'Sunday, 28 February 2027',
      hi: 'रविवार, 28 फ़रवरी 2027',
    },
    time: '04:30 PM',
    muhurat: {
      en: 'Shubh Sankalp · 04:30 PM',
      hi: 'शुभ संकल्प · सायं 4:30 बजे',
    },
    venue: {
      en: 'Surya Mandir Courtyard, Udaipur',
      hi: 'सूर्य मंदिर आँगन, उदयपुर',
    },
    attire: {
      en: 'Kesari Kurta-Dhoti, Chandan Ivory & Gold',
      hi: 'केसरिया कुर्ता-धोती एवं चंदन परिधान',
    },
    accentHex: '#C94A14',
    image: HINDU_PUJA_AARTI_THALI_IMAGE,
    imageAlt: 'Hammered brass Hindu tilak aarti thali with kumkum, haldi, akshat rice and lit diya',
    rituals: [],
    hostNote: {
      en: 'Seek Lord Ganesha’s blessings with sacred mantras, raksha-kalawa tying, and elders’ chandan tilak.',
      hi: 'श्री गणेश वंदना, रक्षासूत्र बंधन और दादा-दादी के चंदन तिलक के साथ जन्मोत्सव आरंभ।',
    },
  },
  {
    id: 'mehendi',
    indexLabel: '02',
    title: {
      en: 'Safa Bandhai, Dholak & Bansuri',
      hi: 'साफा बंधाई, ढोलक एवं बाँसुरी',
    },
    subtitle: {
      en: 'Bandhani Turban Blessing, Folk Dholak & Jhula',
      hi: 'राजस्थानी साफा, लोक ढोलक और बाल उत्सव',
    },
    date: {
      en: 'Sunday, 28 February 2027',
      hi: 'रविवार, 28 फ़रवरी 2027',
    },
    time: '05:30 PM',
    muhurat: {
      en: 'Rajtilak · 05:30 PM',
      hi: 'साफा रस्म · सायं 5:30 बजे',
    },
    venue: {
      en: 'Mewar Sandstone Veranda',
      hi: 'मेवाड़ बलुआ पत्थर बरामदा',
    },
    attire: {
      en: 'Peacock Indigo, Bandhani Safa & Silk',
      hi: 'मयूर नीला, बंधेज साफा व सिल्क',
    },
    accentHex: '#134E4A',
    image: VEER_BALAK_OPEN_IMAGE,
    imageAlt: 'Rajasthani veranda dressed with bandhani silk cushions, traditional dholak drum, tilak tray and laddoos',
    rituals: [],
    hostNote: {
      en: 'Honour the birthday prince with a festive bandhani safa, joyful dholak beats, and Vrindavan flute melodies.',
      hi: 'रंग-बिरंगे बंधेज साफे, ढोलक की मंगल थाप और मधुर बाँसुरी धुन का आनंद लें।',
    },
  },
  {
    id: 'sangeet',
    indexLabel: '03',
    title: {
      en: 'Makhan-Mishri, Modak & Cake',
      hi: 'माखन-मिश्री, मोदक एवं केक',
    },
    subtitle: {
      en: 'Earthen Handi Joy, Golden Modaks & Saffron Cake',
      hi: 'माखन मटकी, सुनहरे मोदक व केसर केक उत्सव',
    },
    date: {
      en: 'Sunday, 28 February 2027',
      hi: 'रविवार, 28 फ़रवरी 2027',
    },
    time: '06:45 PM',
    muhurat: {
      en: 'Bhog & Aarti · 06:45 PM',
      hi: 'भोग व आरती · सायं 6:45 बजे',
    },
    venue: {
      en: 'Vrindavan Kadam Courtyard',
      hi: 'वृंदावन कदम्ब आँगन मंच',
    },
    attire: {
      en: 'Pitambari Saffron & Peacock Gold',
      hi: 'पीताम्बरी केसरिया व मयूर सुनहरा',
    },
    accentHex: '#1E3A8A',
    image: KANHA_MAKHAN_OPEN_IMAGE,
    imageAlt: 'Joyful sunlit Vrindavan courtyard with painted makhan handi pots, brass flute, diya and kesar pista cake',
    rituals: [],
    hostNote: {
      en: 'Celebrate with fresh makhan-mishri bowls, auspicious earthen diya lighting, and pistachio-saffron cake.',
      hi: 'ताज़ा माखन-मिश्री, शुभ दीप प्रज्वलन और केसर-पिस्ता केक के साथ नटखट जन्मोत्सव।',
    },
  },
  {
    id: 'pheras',
    indexLabel: '04',
    title: {
      en: 'Priti Bhoj & Modak Prashad',
      hi: 'सात्विक प्रीतिभोज एवं मोदक प्रसाद',
    },
    subtitle: {
      en: 'Mewari Thali Feast, Dryfruit Modak & Potli Gifts',
      hi: 'मेवाड़ी थाली भोज, मोदक व स्नेह पोटली भेंट',
    },
    date: {
      en: 'Sunday, 28 February 2027',
      hi: 'रविवार, 28 फ़रवरी 2027',
    },
    time: '07:45 PM',
    muhurat: {
      en: 'Priti Bhoj · 07:45 PM Onwards',
      hi: 'प्रीतिभोज · रात्रि 7:45 बजे से',
    },
    venue: {
      en: 'Haveli Temple Dining Courtyard',
      hi: 'हवेली मंदिर भोजन प्रांगण',
    },
    attire: {
      en: 'Handloom Kurta & Festive Silks',
      hi: 'हैंडलूम कुर्ता व पारिवारिक परिधान',
    },
    accentHex: '#A8321A',
    image: HINDU_MITHAI_BHOJ_IMAGE,
    imageAlt: 'Hammered brass platter with motichoor laddoos, kesar kheer and saffron petal birthday cake',
    rituals: [],
    hostNote: {
      en: 'Relish traditional Rajasthani delicacies together and accept golden modak prashad potlis.',
      hi: 'परिवार सहित सात्विक भोज का आनंद लें और मोदक-मिठाई की स्नेह पोटली स्वीकार करें।',
    },
  },
];

export const HINDU_BOY_BIRTHDAY_SWATCHES: Record<CeremonyId, { name: { en: string; hi: string }; colors: string[] }> = {
  haldi: {
    name: { en: 'Kesari Saffron & Chandan', hi: 'केसरिया व चंदन' },
    colors: ['#C94A14', '#F2A900', '#FDF3E2'],
  },
  mehendi: {
    name: { en: 'Vrindavan Peacock Indigo', hi: 'वृंदावन मयूर नीला' },
    colors: ['#11243E', '#F2B43A', '#1B8A7B'],
  },
  sangeet: {
    name: { en: 'Pitambari & Surya Gold', hi: 'पीताम्बरी व सूर्य स्वर्ण' },
    colors: ['#E8891C', '#F7C96B', '#2D160B'],
  },
  pheras: {
    name: { en: 'Kumkum Red & Haldi Ivory', hi: 'कुमकुम लाल व हल्दी' },
    colors: ['#A8321A', '#BD8319', '#FFF7E4'],
  },
};

export const PAITHANI_CEREMONIES: CeremonyItem[] = [
  {
    id: 'haldi',
    indexLabel: '01',
    title: {
      en: 'Halad & Telvan',
      hi: 'हळद आणि तेलवण',
    },
    subtitle: {
      en: 'Ambe-Halad, Mango Leaves & Brass Samai',
      hi: 'हल्दी स्नान, आम्रपल्लव व मंगल गीत',
    },
    date: {
      en: 'Friday, 12 February 2027',
      hi: 'शुक्रवार, 12 फ़रवरी 2027',
    },
    time: '10:30 AM',
    muhurat: {
      en: 'Muhurat · 10:45 AM',
      hi: 'शुभ मुहूर्त · प्रातः 10:45',
    },
    venue: {
      en: 'Wada Rangoli Courtyard',
      hi: 'वाडा रंगोली आँगन',
    },
    attire: {
      en: 'Haldi Yellow Cotton & Irkal Borders',
      hi: 'पीली इरकल व सूती परिधान',
    },
    accentHex: '#D98A1A',
    image: PAITHANI_COURTYARD_OPEN_IMAGE,
    imageAlt: 'Traditional Maharashtrian courtyard illuminated with rangoli and brass samai lamps',
    rituals: [
      { time: '10:30 AM', label: { en: 'Telvan & Haridra Lepan', hi: 'तेलवण एवं हल्दी अनुष्ठान' } },
      { time: '11:45 AM', label: { en: 'Mogra Chadar & Folk Songs', hi: 'मोगरा चादर एवं मंगलगीत' } },
    ],
    hostNote: {
      en: 'Fresh turmeric paste, mango leaf rituals, and Puran Poli lunch served on plantain leaves.',
      hi: 'पावन हल्दी-तेलवण रस्म के पश्चात केले के पत्ते पर पारंपरिक पूरन-पोली स्नेहभोज।',
    },
  },
  {
    id: 'mehendi',
    indexLabel: '02',
    title: {
      en: 'Hirva Chooda & Mehendi',
      hi: 'हिरवा चुडा आणि मेंदी सोहळा',
    },
    subtitle: {
      en: 'Emerald Glass Bangles, Gajras & Sanai',
      hi: 'हरी काँच की चूड़ियाँ, गजरे व शहनाई',
    },
    date: {
      en: 'Friday, 12 February 2027',
      hi: 'शुक्रवार, 12 फ़रवरी 2027',
    },
    time: '04:00 PM',
    muhurat: {
      en: 'Auspicious Hour · 04:15 PM',
      hi: 'शुभ वेला · सायं 4:15',
    },
    venue: {
      en: 'Carved Veranda Gallery',
      hi: 'नक्काशीदार बरामदा प्रांगण',
    },
    attire: {
      en: 'Muniya Leaf Green & Zari Silks',
      hi: 'मुनिया हरा व ज़री रेशम',
    },
    accentHex: '#1D6B4B',
    image: GENDA_COURTYARD_OPEN_IMAGE,
    imageAlt: 'Floral courtyard decorated for emerald bangles and henna celebration',
    rituals: [
      { time: '04:00 PM', label: { en: 'Green Bangle Blessing', hi: 'हिरवा चुडा एवं आशीर्वाद' } },
      { time: '05:15 PM', label: { en: 'Ukhane & Folk Dance', hi: 'पारंपरिक उखाणे व नृत्य' } },
    ],
    hostNote: {
      en: 'Woven green bangles, mogra gajras, and playful Maharashtrian ukhane rhymes.',
      hi: 'सुहाग की हरी चूड़ियाँ, मोगरे के गजरे और सरस मराठी उखाणे।',
    },
  },
  {
    id: 'sangeet',
    indexLabel: '03',
    title: {
      en: 'Sangeet & Lavani Sandhya',
      hi: 'संगीत व मंगल संध्या',
    },
    subtitle: {
      en: 'Acoustic Santoor, Dholki Beats & Lanterns',
      hi: 'संतूर, ढोलकी व दीप संध्या उत्सव',
    },
    date: {
      en: 'Saturday, 13 February 2027',
      hi: 'शनिवार, 13 फ़रवरी 2027',
    },
    time: '07:30 PM',
    muhurat: {
      en: 'Evening Gathering · 07:30 PM',
      hi: 'रात्रि आयोजन · 7:30 बजे',
    },
    venue: {
      en: 'Twilight Samai Courtyard',
      hi: 'दीप स्तंभ संध्या आँगन',
    },
    attire: {
      en: 'Royal Paithani Purple & Antique Zari',
      hi: 'शाही पैठणी बैंगनी व स्वर्ण ज़री',
    },
    accentHex: '#5A1668',
    image: ROSHNI_MANDAP_OPEN_IMAGE,
    imageAlt: 'Twilight courtyard glowing with warm brass lanterns and silk drapes',
    rituals: [
      { time: '07:30 PM', label: { en: 'Samai Deep-Prajwalan', hi: 'समई दीप प्रज्वलन' } },
      { time: '08:30 PM', label: { en: 'Family Sangeet Showcase', hi: 'पारिवारिक संगीत नृत्य' } },
    ],
    hostNote: {
      en: 'Celebrate beneath twilight courtyard drapes with family performances and saffron Kothimbir Vadi.',
      hi: 'दीपों की रोशनी में पारिवारिक संगीत, नृत्य एवं स्नेहिल रात्रिभोज।',
    },
  },
  {
    id: 'pheras',
    indexLabel: '04',
    title: {
      en: 'Antarpat & Saptapadi',
      hi: 'अंतर्पट आणि सप्तपदी (शुभमंगल)',
    },
    subtitle: {
      en: 'Goraj Muhurat, Akshata Rain & Mangalashtak',
      hi: 'गोरज मुहूर्त, अक्षता वर्षा व मंगलाष्टक',
    },
    date: {
      en: 'Sunday, 14 February 2027',
      hi: 'रविवार, 14 फ़रवरी 2027',
    },
    time: '06:15 PM',
    muhurat: {
      en: 'Goraj Muhurat · 06:24 PM',
      hi: 'गोरज मुहूर्त · सायं 6:24',
    },
    venue: {
      en: 'Paithani Mandap Wada Courtyard',
      hi: 'पैठणी मंडप वाडा प्रांगण',
    },
    attire: {
      en: 'Kasturi Paithani Saree & Pheta',
      hi: 'पैठणी साड़ी एवं जरी फेटा',
    },
    accentHex: '#B3261E',
    image: PAITHANI_ANTARPAT_CLOSED_IMAGE,
    imageAlt: 'Traditional handwoven Paithani silk Antarpat stretched before banana-leaf mandap',
    rituals: [
      { time: '06:00 PM', label: { en: 'Seemant Pujan & Baraat', hi: 'सीमांत पूजन एवं स्वागत' } },
      { time: '06:24 PM', label: { en: 'Mangalashtak & Antarpat Drop', hi: 'मंगलाष्टक एवं अंतर्पट उत्सव' } },
    ],
    hostNote: {
      en: 'Shower white rice akshata and mogra petals as the sacred Paithani Antarpat drops at Goraj Muhurat.',
      hi: 'गोरज मुहूर्त पर मंगलाष्टक के साथ अंतर्पट खुलने पर अक्षता एवं पुष्पवर्षा से वर-वधू को आशीर्वाद दें।',
    },
  },
];

export const PAITHANI_SWATCHES: Record<CeremonyId, { name: { en: string; hi: string }; colors: string[] }> = {
  haldi: {
    name: { en: 'Ambe-Halad & Zari Loom', hi: 'आंबे-हळद व ज़री रेशम' },
    colors: ['#E8891C', '#F2B705', '#FBF4E4'],
  },
  mehendi: {
    name: { en: 'Muniya Leaf Green & Mogra', hi: 'मुनिया हरा व मोगरा' },
    colors: ['#1D6B4B', '#65A30D', '#FAF5E8'],
  },
  sangeet: {
    name: { en: 'Royal Paithani Jamuni', hi: 'शाही पैठणी जामुनी' },
    colors: ['#4A1259', '#C9932A', '#1D142B'],
  },
  pheras: {
    name: { en: 'Kumkum & Kela Mandap', hi: 'कुमकुम व मांगलिक स्वर्ण' },
    colors: ['#B3261E', '#D49B2A', '#1D6B4B'],
  },
};
