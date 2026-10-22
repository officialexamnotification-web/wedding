import type { AudioTrack } from '../types/editor';

export const AUDIO_TRACKS: AudioTrack[] = [
  ...[
    { id: 'at-the-palace-gates', name: 'At the Palace Gates', category: 'shehnai', description: 'A regal instrumental welcome for a palace celebration', file: 'At_The_Palace_Gates.mp3' },
    { id: 'marigold-and-saffron', name: 'Marigold & Saffron', category: 'dhol', description: 'Bright festive music for Haldi and family celebrations', file: 'Marigold_and_Saffron.mp3' },
    { id: 'marigold-skies-at-sangeet', name: 'Marigold Skies at Sangeet', category: 'dhol', description: 'An upbeat soundtrack for Sangeet night', file: 'Marigold_Skies_at_Sangeet.mp3' },
    { id: 'morning-of-our-promise', name: 'Morning of Our Promise', category: 'sitar', description: 'A calm, romantic instrumental for the wedding morning', file: 'Morning_of_Our_Promise.mp3' },
    { id: 'parting-at-the-threshold', name: 'Parting at the Threshold', category: 'flute', description: 'A gentle, reflective melody for the farewell', file: 'Parting_at_the_Threshold.mp3' },
    { id: 'petals-for-the-cradle', name: 'Petals for the Cradle', category: 'flute', description: 'A tender melody for a baby shower or naming ceremony', file: 'Petals_for_the_Cradle.mp3' },
    { id: 'saffron-and-marigold', name: 'Saffron & Marigold', category: 'dhol', description: 'A warm festive instrumental for pre-wedding rituals', file: 'Saffron_and_Marigold.mp3' },
    { id: 'saffron-and-silk', name: 'Saffron & Silk', category: 'sitar', description: 'A graceful traditional instrumental for the ceremony', file: 'Saffron_and_Silk.mp3' },
    { id: 'the-gilded-threshold', name: 'The Gilded Threshold', category: 'shehnai', description: 'A ceremonial tune for auspicious beginnings', file: 'The_Gilded_Threshold.mp3' },
    { id: 'the-heirloom-waltz', name: 'The Heirloom Waltz', category: 'bollywood', description: 'A romantic instrumental for the couple’s entrance', file: 'The_Heirloom_Waltz.mp3' },
    { id: 'threshold-of-grace', name: 'Threshold of Grace', category: 'mantra', description: 'A serene devotional instrumental for sacred ceremonies', file: 'Threshold_of_Grace.mp3' },
    { id: 'toast-in-the-garden', name: 'Toast in the Garden', category: 'bollywood', description: 'A light celebratory instrumental for the reception', file: 'Toast_in_the_Garden.mp3' },
    { id: 'under-the-marigold-arch', name: 'Under the Marigold Arch', category: 'shehnai', description: 'A festive ceremonial instrumental beneath the flower canopy', file: 'Under_the_Marigold_Arch.mp3' },
    { id: 'under-the-marigold-arch-grand', name: 'Under the Marigold Arch · Grand', category: 'shehnai', description: 'A longer, fuller version for the full celebration video', file: 'Under_the_Marigold_Arch (1).mp3' },
    { id: 'under-the-marigold-canopy', name: 'Under the Marigold Canopy', category: 'flute', description: 'A soft romantic instrumental for the wedding ceremony', file: 'Under_the_Marigold_Canopy.mp3' },
  ].map((track) => ({
    ...track,
    category: track.category as AudioTrack['category'],
    ragaNotes: [293.66, 329.63, 369.99, 440, 493.88, 587.33],
    tempo: 1,
    audioUrl: `/music/${encodeURIComponent(track.file)}`,
  })),
];
