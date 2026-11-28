import { AUDIO_TRACKS } from '../../card-studio/src/data/audioTracks';

/** Card Studio soundtrack selected to fit each invitation's style. */
const THEME_MUSIC_TRACK_IDS: Record<string, string> = {
  ivory: 'at-the-palace-gates',
  gulab: 'under-the-marigold-canopy',
  'confetti-garden': 'toast-in-the-garden',
  'jashn-birthday': 'marigold-and-saffron',
  'kanha-makhan': 'petals-for-the-cradle',
  'sheesh-mahal': 'at-the-palace-gates',
  'shahi-badami': 'the-gilded-threshold',
  'van-upvan': 'petals-for-the-cradle',
  'sindoori-rajhans': 'under-the-marigold-arch',
  'rajsi-baingani': 'the-heirloom-waltz',
  'neel-chandani': 'morning-of-our-promise',
  jharokha: 'at-the-palace-gates',
  paithani: 'saffron-and-silk',
  'mehndi-jhoola': 'marigold-and-saffron',
  deepotsav: 'threshold-of-grace',
  roshni: 'under-the-marigold-canopy',
  temple: 'threshold-of-grace',
  'baal-gopal': 'petals-for-the-cradle',
  'shubh-aarti': 'threshold-of-grace',
  'rangoli-utsav': 'marigold-and-saffron',
  'ladli-kanya': 'petals-for-the-cradle',
  'devi-kumkum': 'saffron-and-marigold',
  'gulab-baisa': 'toast-in-the-garden',
  'veer-balak': 'marigold-and-saffron',
  kohinoor: 'under-the-marigold-arch-grand',
  vrindavan: 'under-the-marigold-canopy',
  kesariya: 'marigold-skies-at-sangeet',
  'pattu-zari': 'saffron-and-silk',
  mehr: 'the-heirloom-waltz',
  kalgi: 'at-the-palace-gates',
};

export const getThemeMusicUrl = (themeId: string): string => {
  const trackId = THEME_MUSIC_TRACK_IDS[themeId];
  return AUDIO_TRACKS.find((track) => track.id === trackId)?.audioUrl ?? '';
};
