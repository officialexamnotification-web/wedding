export interface WordingSnippet {
  id: string;
  category: string;
  language: 'hindi' | 'english' | 'sanskrit';
  title: string;
  content: string;
}

export const PRESET_WORDINGS: WordingSnippet[] = [
  {
    id: 'shloka-ganesh',
    category: 'Religious Shloka',
    language: 'sanskrit',
    title: 'Ganesh Vandana',
    content: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
  },
  {
    id: 'shloka-vishnu',
    category: 'Religious Shloka',
    language: 'sanskrit',
    title: 'Mangalam Shloka',
    content: 'मंगलम् भगवान विष्णुः मंगलम् गरुड़ध्वजः।\nमंगलम् पुण्डरीकाक्षः मंगलाय तनो हरिः॥',
  },
  {
    id: 'shloka-vivah',
    category: 'Religious Shloka',
    language: 'sanskrit',
    title: 'Vivah Mangal Shloka',
    content: 'यदेतद् हृदयं तव तदस्तु हृदयं मम।\nयदिदं हृदयं मम तदस्तु हृदयं तव॥\n(May your heart be mine, and my heart be yours)',
  },
  {
    id: 'invite-royal-eng',
    category: 'Wedding Invite',
    language: 'english',
    title: 'Royal Wedding Formal',
    content: 'With immense pleasure and joyful hearts, we solicit your gracious presence with family to celebrate the auspicious wedding ceremony of our beloved children.',
  },
  {
    id: 'invite-hindi-vivah',
    category: 'Wedding Invite',
    language: 'hindi',
    title: 'शुभ विवाह निमंत्रण',
    content: 'परमपिता परमात्मा की असीम अनुकंपा से हमारे सुपुत्र/सुपुत्री का शुभ विवाह संपन्न होने जा रहा है। इस मांगलिक अवसर पर पधारकर वर-वधू को अपना स्नेह व शुभाशीर्वाद प्रदान करें।',
  },
  {
    id: 'invite-housewarming',
    category: 'Housewarming',
    language: 'english',
    title: 'New Home Blessing',
    content: 'A house is made of brick and stone, but a home is built with love and shared memories. Please bless our new abode with your presence as we celebrate our Griha Pravesh Pooja.',
  },
  {
    id: 'invite-griha-hindi',
    category: 'Housewarming',
    language: 'hindi',
    title: 'गृहप्रवेश निमंत्रण',
    content: 'ईश्वर की कृपा और बड़ों के आशीर्वाद से हम अपने नवनिर्मित गृह में प्रवेश करने जा रहे हैं। वास्तु पूजा एवं प्रीतिभोज के इस पावन अवसर पर आप सपरिवार सादर आमंत्रित हैं।',
  },
  {
    id: 'invite-sangeet-party',
    category: 'Sangeet & Haldi',
    language: 'english',
    title: 'Sangeet & Cocktails Beats',
    content: 'Get ready for an evening of music, thumkas, laughter, and high energy! Join us as we dance the night away in celebration of two hearts becoming one.',
  },
  {
    id: 'invite-birthday-fun',
    category: 'Birthday',
    language: 'english',
    title: 'Milestone Birthday Delight',
    content: 'Another year bolder, wiser, and more fabulous! Join us for a night of cocktails, cake, and celebration as we raise a toast to new beginnings.',
  },
  {
    id: 'invite-rsvp-warm',
    category: 'RSVP Note',
    language: 'english',
    title: 'Warm RSVP & Wishes',
    content: 'Your presence is the greatest gift. Kindly confirm your attendance to help us arrange warm hospitality for you and your family.',
  },
];

export async function generateInvitationWording(
  eventType: string,
  names: string,
  tone: string,
  language: string,
  customNotes?: string
): Promise<string> {
  // Suggestions are composed locally from the curated copy library.
  const event = eventType.toLowerCase();
  let wording: string;

  if (event.includes('wedding') || event.includes('vivah')) {
    wording = language === 'hindi'
      ? `॥ श्री गणेशाय नमः ॥\nपरिवारजनों के स्नेह और बड़ों के आशीर्वाद सहित, ${names || 'वर-वधू'} के शुभ विवाह में आपकी गरिमामयी उपस्थिति सादर आमंत्रित है।\nआपका स्नेह और आशीर्वाद हमारे लिए अमूल्य होगा।`
      : `Together with their families, ${names || 'the couple'} invite you to celebrate their wedding.\nJoin us for a joyful occasion filled with love, family and cherished memories.\nYour presence and blessings will mean so much.`;
  } else if (event.includes('griha') || event.includes('house')) {
    wording = language === 'hindi'
      ? `॥ ॐ श्री गणेशाय नमः ॥\nअपने नए घर के शुभारंभ पर ${names || 'हमारा परिवार'} आपको सपरिवार आमंत्रित करता है।\nगृह प्रवेश पूजा और इस आनंद के अवसर पर आपका स्वागत है।`
      : `With the blessings of our families, ${names || 'we'} warmly invite you to celebrate our new home.\nPlease join us for the Griha Pravesh ceremony and a joyful gathering.`;
  } else {
    const occasion = eventType || 'special occasion';
    wording = `With warm wishes, ${names || 'our family'} invite you to celebrate ${occasion}.\nJoin us for a lovely gathering and a day to remember.`;
  }

  const notes = customNotes?.trim();
  const style = tone?.trim();
  return [style ? `${style} style` : '', wording, notes ? `\n${notes}` : ''].filter(Boolean).join('\n');
}
