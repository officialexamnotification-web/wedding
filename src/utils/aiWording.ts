import { GoogleGenAI } from '@google/genai';

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

export async function generateAiWording(
  eventType: string,
  names: string,
  tone: string,
  language: string,
  customNotes?: string
): Promise<string> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (window as any).GEMINI_API_KEY;

  if (!apiKey) {
    // Return high quality curated wording based on inputs
    if (eventType.toLowerCase().includes('wedding') || eventType.toLowerCase().includes('vivah')) {
      if (language === 'hindi') {
        return `|| श्री गणेशाय नमः ||\nमान्यवर, परमपिता परमेश्वर की असीम कृपा से ${names || 'वर एवं वधू'} का पावन परिणय संस्कार संपन्न होने जा रहा है।\nइस पुनीत एवं मांगलिक अवसर पर आपकी गरिमामयी उपस्थिति एवं पावन आशीर्वाद हमारे लिए अत्यंत हर्ष का विषय होगा।\n\nदर्शनाभिलाषी: समस्त परिवार`;
      }
      return `Two lives, two hearts, joined together in friendship, united forever in love.\nTogether with their families, ${names || 'The Bride & Groom'} joyfully invite you to celebrate their union and share in the blessing of marriage.\nYour presence and blessings will make our special day complete.`;
    }

    if (eventType.toLowerCase().includes('griha') || eventType.toLowerCase().includes('house')) {
      return `|| ॐ श्री गणेशाय नमः ||\nWith the blessings of God and our elders, we have found a place to call home.\nWe warmly invite you to join us for our Griha Pravesh Pooja followed by Mahaprasad.\nHosted with love by ${names || 'The Family'}.`;
    }

    return `Join us as we celebrate the special celebration of ${names || 'Our Loved Ones'}!\nMark your calendars for an unforgettable day filled with laughter, love, and cherished memories.`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are an expert Indian invitation card copywriter. Write a concise, beautiful, and culturally appropriate ${tone} invitation card text for ${eventType}.
Names / Hosts: ${names}
Language: ${language}
Additional Notes: ${customNotes || 'None'}
Keep it within 3-5 lines, formatted cleanly with line breaks, suitable for direct placement onto a luxury invitation card. Do not include markdown code fences or conversational filler.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || 'Join us to celebrate this joyous occasion!';
  } catch (err) {
    console.warn('Gemini API call failed, falling back to curated wording', err);
    return `|| श्री गणेशाय नमः ||\nTogether with their families, ${names || 'Our Family'} cordially invites you to grace the auspicious occasion with your presence and blessings.`;
  }
}
