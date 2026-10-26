import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, CalendarDays, Compass, Download, Gem, HeartHandshake, LockKeyhole, MapPin, MoonStar, Navigation, Sparkles, Sun } from 'lucide-react';
import { calculateAshtakoota, calculateBirthChart, calculateNumbers, GEMSTONES, LAGNA_LORDS, NAKSHATRAS, RASHIS, type BirthChart, type BirthInput } from '../services/vedicAstrology';

type Tab = 'kundali' | 'matching' | 'numerology' | 'gemstones';
type ResultLanguage = 'en' | 'hi';
type PrintRow = { label:string; value:string };
type PrintSection = { title:string; rows:PrintRow[] };
type PrintDocument = { title:string; language:ResultLanguage; sections:PrintSection[]; charts?:BirthChart[] };
const HI_SIGNS = ['मेष','वृषभ','मिथुन','कर्क','सिंह','कन्या','तुला','वृश्चिक','धनु','मकर','कुंभ','मीन'];
const HI_PLANETS:Record<string,string> = {Sun:'सूर्य',Moon:'चंद्र',Mars:'मंगल',Mercury:'बुध',Jupiter:'गुरु',Venus:'शुक्र',Saturn:'शनि',Rahu:'राहु',Ketu:'केतु',Ascendant:'लग्न'};
const HI_NAKSHATRAS = ['अश्विनी','भरणी','कृत्तिका','रोहिणी','मृगशिरा','आर्द्रा','पुनर्वसु','पुष्य','आश्लेषा','मघा','पूर्वा फाल्गुनी','उत्तर फाल्गुनी','हस्त','चित्रा','स्वाति','विशाखा','अनुराधा','ज्येष्ठा','मूल','पूर्वाषाढ़ा','उत्तराषाढ़ा','श्रवण','धनिष्ठा','शतभिषा','पूर्वा भाद्रपद','उत्तर भाद्रपद','रेवती'];
const HI_LABELS:Record<string,string> = {
  'Birth details used':'जन्म विवरण','Name':'नाम','Date & local time':'जन्म तिथि और समय','Birth place':'जन्म स्थान','Time zone':'समय क्षेत्र',
  Ascendant:'लग्न', 'Moon sign':'चंद्र राशि','Birth star':'जन्म नक्षत्र','Janma Nakshatra':'जन्म नक्षत्र','Pada':'चरण','Nadi':'नाड़ी','Gana':'गण','Rāśi chart':'राशि कुंडली',
  North:'उत्तर भारतीय','South':'दक्षिण भारतीय','Sidereal planetary placements':'ग्रहों की स्थिति','House':'भाव','Panchanga at birth':'जन्म पंचांग',
  tithi:'तिथि',yoga:'योग',karana:'करण',vara:'वार',Sun:'सूर्य',Moon:'चंद्र',Mars:'मंगल',Mercury:'बुध',Jupiter:'गुरु',Venus:'शुक्र',Saturn:'शनि',Rahu:'राहु',Ketu:'केतु',
  'Groom':'वर','Bride':'वधू','Birth':'जन्म','Place':'स्थान','Lagna':'लग्न','Ashtakoota Guna Milan':'अष्टकूट गुण मिलान',Koota:'कूट','Traditional area':'विवरण',Score:'अंक',
  Varna:'वर्ण',Vashya:'वश्य','Tara (Dina)':'तारा (दिन)','Yoni':'योनि','Graha Maitri':'ग्रह मैत्री','Bhakoot (Rashi)':'भकूट (राशि)',
  'Traditional temperament and outlook':'स्वभाव और दृष्टिकोण','Mutual influence':'आपसी प्रभाव','Birth-star harmony':'जन्म नक्षत्र का तालमेल','Instinctive compatibility':'स्वाभाविक अनुकूलता','Moon-sign lord relationship':'चंद्र राशि स्वामियों का संबंध','Temperament grouping':'स्वभाव का मेल','Moon-sign relationship':'चंद्र राशियों का संबंध','Nadi grouping':'नाड़ी का मेल',
  Mulank:'मूलांक','Birth number':'जन्मांक','Bhagyank':'भाग्यांक','Destiny number':'भाग्यांक','Naamank':'नामांक','Chaldean name number':'चाल्डियन नामांक',
  Ruby:'माणिक्य',Pearl:'मोती','Red coral':'मूंगा',Emerald:'पन्ना','Yellow sapphire':'पुखराज',Diamond:'हीरा','Blue sapphire':'नीलम',
  'High traditional score (31–36)':'उच्च पारंपरिक गुण मिलान (31–36)','Moderate-to-high traditional score (21–30)':'अच्छा पारंपरिक गुण मिलान (21–30)','Mid-range traditional score (17–20)':'मध्यम पारंपरिक गुण मिलान (17–20)','Lower traditional score (0–16)':'कम पारंपरिक गुण मिलान (0–16)',
  'Monday':'सोमवार','Tuesday':'मंगलवार','Wednesday':'बुधवार','Thursday':'गुरुवार','Friday':'शुक्रवार','Saturday':'शनिवार','Sunday':'रविवार',
};
const localize = (value:string, language:ResultLanguage) => language==='hi' ? (HI_LABELS[value] ?? value) : value;
const localizeSign = (value:string, language:ResultLanguage) => language==='hi' ? (HI_SIGNS[RASHIS.indexOf(value as typeof RASHIS[number])] ?? value) : value;
const localizePlanet = (value:string, language:ResultLanguage) => language==='hi' ? (HI_PLANETS[value] ?? value) : value;
const localizeNakshatra = (value:string, language:ResultLanguage) => language==='hi' ? (HI_NAKSHATRAS[NAKSHATRAS.indexOf(value as typeof NAKSHATRAS[number])] ?? value) : value;
const localizePanchanga = (key:string,value:string,language:ResultLanguage) => {
  if(language==='en')return value;
  const tithis:Record<string,string>={Pratipada:'प्रतिपदा',Dvitiya:'द्वितीया',Tritiya:'तृतीया',Chaturthi:'चतुर्थी',Panchami:'पंचमी',Shashthi:'षष्ठी',Saptami:'सप्तमी',Ashtami:'अष्टमी',Navami:'नवमी',Dashami:'दशमी',Ekadashi:'एकादशी',Dwadashi:'द्वादशी',Trayodashi:'त्रयोदशी',Chaturdashi:'चतुर्दशी',Purnima:'पूर्णिमा',Amavasya:'अमावस्या'};
  const sanskrit:Record<string,string>={Vishkambha:'विष्कंभ',Priti:'प्रीति',Ayushman:'आयुष्मान',Saubhagya:'सौभाग्य',Shobhana:'शोभन',Atiganda:'अतिगंड',Sukarma:'सुकर्मा',Dhriti:'धृति',Shula:'शूल',Ganda:'गंड',Vriddhi:'वृद्धि',Dhruva:'ध्रुव',Vyaghata:'व्याघात',Harshana:'हर्षण',Vajra:'वज्र',Siddhi:'सिद्धि',Vyatipata:'व्यतीपात',Variyana:'वरीयान',Parigha:'परिघ',Shiva:'शिव',Siddha:'सिद्ध',Sadhya:'साध्य',Shubha:'शुभ',Shukla:'शुक्ल',Brahma:'ब्रह्म',Indra:'इंद्र',Vaidhriti:'वैधृति',Kimstughna:'किंस्तुघ्न',Bava:'बव',Balava:'बालव',Kaulava:'कौलव',Taitila:'तैतिल',Garaja:'गरज',Vanija:'वणिज',Vishti:'विष्टि',Shakuni:'शकुनि',Chatushpada:'चतुष्पद',Naga:'नाग'};
  if(key==='tithi')return value.split(' ').map((part)=>part==='Shukla'?'शुक्ल':part==='Krishna'?'कृष्ण':tithis[part]??part).join(' ');
  if(key==='vara')return localize(value,language);
  return sanskrit[value]??value;
};
const tabs: { id:Tab; label:string; icon:React.ElementType; helper:string }[] = [
  { id:'kundali', label:'Birth chart', icon:MoonStar, helper:'Janam Kundali' },
  { id:'matching', label:'Kundali match', icon:HeartHandshake, helper:'Ashtakoota Milan' },
  { id:'numerology', label:'Numerology', icon:Sparkles, helper:'Mulank · Bhagyank · Naamank' },
  { id:'gemstones', label:'Gemstones', icon:Gem, helper:'Traditional associations' },
];
const initialBirth = (name = ''): BirthInput => ({ name, date:'', time:'', latitude:0, longitude:0, timezone:'Asia/Kolkata', place:'custom' });
const todayInputDate = () => { const now=new Date(); now.setMinutes(now.getMinutes()-now.getTimezoneOffset()); return now.toISOString().slice(0,10); };
const NAK_LORDS = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];
const NAK_NADIS = ['Adi','Madhya','Antya','Antya','Madhya','Adi','Adi','Madhya','Antya','Antya','Madhya','Adi','Adi','Madhya','Antya','Antya','Madhya','Adi','Adi','Madhya','Antya','Antya','Madhya','Adi','Adi','Madhya','Antya'];
const NAK_GANAS = ['Deva','Manushya','Rakshasa','Manushya','Deva','Manushya','Deva','Deva','Rakshasa','Rakshasa','Manushya','Manushya','Deva','Rakshasa','Deva','Rakshasa','Deva','Rakshasa','Rakshasa','Manushya','Manushya','Deva','Rakshasa','Rakshasa','Manushya','Manushya','Deva'];
const POPULAR_PLACES = [
  {name:'New Delhi — Delhi',searchName:'New Delhi',mainText:'New Delhi',district:'New Delhi',state:'Delhi',lat:28.6139,lon:77.2090},{name:'Jaipur — Rajasthan',searchName:'Jaipur',mainText:'Jaipur',district:'Jaipur',state:'Rajasthan',lat:26.9124,lon:75.7873},
  {name:'Kanpur — Kanpur Nagar, Uttar Pradesh',searchName:'Kanpur',mainText:'Kanpur',district:'Kanpur Nagar',state:'Uttar Pradesh',lat:26.4499,lon:80.3319},
  // Kanpur Dehat's district headquarters, Mati-Akbarpur.
  {name:'Kanpur Dehat — Uttar Pradesh',searchName:'Kanpur Dehat',mainText:'Kanpur Dehat',district:'Kanpur Dehat',state:'Uttar Pradesh',lat:26.3790,lon:79.9510},
  {name:'Mumbai — Mumbai City, Maharashtra',searchName:'Mumbai',mainText:'Mumbai',district:'Mumbai City',state:'Maharashtra',lat:19.0760,lon:72.8777},{name:'Kolkata — West Bengal',searchName:'Kolkata',mainText:'Kolkata',district:'Kolkata',state:'West Bengal',lat:22.5726,lon:88.3639},
  {name:'Bengaluru — Bengaluru Urban, Karnataka',searchName:'Bengaluru',mainText:'Bengaluru',district:'Bengaluru Urban',state:'Karnataka',lat:12.9716,lon:77.5946},{name:'Hyderabad — Telangana',searchName:'Hyderabad',mainText:'Hyderabad',district:'Hyderabad',state:'Telangana',lat:17.3850,lon:78.4867},
  {name:'Chennai — Tamil Nadu',searchName:'Chennai',mainText:'Chennai',district:'Chennai',state:'Tamil Nadu',lat:13.0827,lon:80.2707},{name:'Ahmedabad — Gujarat',searchName:'Ahmedabad',mainText:'Ahmedabad',district:'Ahmedabad',state:'Gujarat',lat:23.0225,lon:72.5714},
  {name:'Lucknow — Uttar Pradesh',searchName:'Lucknow',mainText:'Lucknow',district:'Lucknow',state:'Uttar Pradesh',lat:26.8467,lon:80.9467},{name:'Varanasi — Uttar Pradesh',searchName:'Varanasi',mainText:'Varanasi',district:'Varanasi',state:'Uttar Pradesh',lat:25.3176,lon:82.9739},
  {name:'Udaipur — Rajasthan',searchName:'Udaipur',mainText:'Udaipur',district:'Udaipur',state:'Rajasthan',lat:24.5854,lon:73.7125},{name:'Pune — Maharashtra',searchName:'Pune',mainText:'Pune',district:'Pune',state:'Maharashtra',lat:18.5204,lon:73.8567},
];
type PlaceSuggestion = {name:string;lat:number;lon:number;searchName?:string;mainText?:string;district?:string;state?:string;rank?:number;source?:'local'|'online'};
const normalizePlace = (text:string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const placeDistanceKm = (a:PlaceSuggestion,b:PlaceSuggestion) => {
  const rad = Math.PI / 180;
  const dLat=(b.lat-a.lat)*rad, dLon=(b.lon-a.lon)*rad;
  const h=Math.sin(dLat/2)**2+Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(dLon/2)**2;
  return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));
};
function dedupePlaces(places:PlaceSuggestion[]) {
  const result:PlaceSuggestion[]=[];
  for(const candidate of places){
    const name=normalizePlace(candidate.searchName??candidate.name.split(' — ')[0]);
    const region=normalizePlace(`${candidate.district??''}|${candidate.state??''}`);
    const duplicateIndex=result.findIndex((existing)=>{
      const existingName=normalizePlace(existing.searchName??existing.name.split(' — ')[0]);
      const sameName=existingName===name;
      const sameRegion=normalizePlace(`${existing.district??''}|${existing.state??''}`)===region;
      const samePlaceNear=normalizePlace(existing.state??'')===normalizePlace(candidate.state??'')&&placeDistanceKm(existing,candidate)<8;
      const sameDisplay=normalizePlace(existing.name)===normalizePlace(candidate.name);
      return sameDisplay||(sameName&&(sameRegion||samePlaceNear));
    });
    if(duplicateIndex<0) result.push(candidate);
    else if((candidate.rank??10)<(result[duplicateIndex].rank??10)) result[duplicateIndex]=candidate;
  }
  return result;
}

function BirthFields({ value, onChange, compact = false }: { value:BirthInput; onChange:(value:BirthInput)=>void; compact?:boolean }) {
  const update = (patch:Partial<BirthInput>) => onChange({ ...value, ...patch });
  const field = 'mt-1 w-full rounded-xl border border-amber-100/10 bg-[#100d10] px-3.5 py-3 text-sm text-[#fff8ee] outline-none transition focus:border-amber-300/60 focus:ring-2 focus:ring-amber-400/10';
  const [query, setQuery] = useState(value.place === 'custom' ? '' : value.place);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [locationError, setLocationError] = useState('');
  const sequence = useRef(0);
  useEffect(() => {
    const term = query.trim();
    const request = ++sequence.current;
    if (term.length < 3 || term === value.place) { setSuggestions([]); setSearching(false); return; }
    const timer = window.setTimeout(async () => {
      setSearching(true);
      try {
        const url = new URL('https://photon.komoot.io/api/');
        url.searchParams.set('q', term); url.searchParams.set('limit', '20'); url.searchParams.set('lang', 'en');
        url.searchParams.set('countrycode', 'IN');
        url.searchParams.set('lat', '22.5'); url.searchParams.set('lon', '79'); url.searchParams.set('zoom', '5');
        const response = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('Place search is temporarily unavailable. Please try again shortly.');
        const payload = await response.json() as {features?:{geometry?:{coordinates?:number[]};properties?:Record<string,unknown>}[]};
        if (request !== sequence.current) return;
        const items:PlaceSuggestion[] = (payload.features ?? []).flatMap((feature) => {
          const [lon, lat] = feature.geometry?.coordinates ?? [];
          const p = feature.properties ?? {};
          const stringValue=(key:string)=>typeof p[key]==='string'?(p[key] as string).trim():'';
          if (!Number.isFinite(lat) || !Number.isFinite(lon) || stringValue('countrycode').toUpperCase() !== 'IN') return [];
          const namePart=stringValue('name');
          if(!namePart) return [];
          const district=stringValue('district')||stringValue('county');
          const state=stringValue('state');
          const secondary=[district,state].filter((part,index,all)=>part&&normalizePlace(part)!==normalizePlace(namePart)&&all.findIndex((item)=>normalizePlace(item)===normalizePlace(part))===index).join(', ');
          const name=secondary?`${namePart} — ${secondary}`:namePart;
          if(!name) return [];
          const type=(stringValue('osm_value')||stringValue('type')).toLowerCase();
          const rank=type==='city'?0:type==='town'?1:type==='municipality'?2:type==='village'?3:type==='suburb'?4:5;
          return [{name,lat,lon,searchName:namePart,mainText:namePart,district,state,rank:rank+1,source:'online' as const}];
        });
        const normalizedTerm=normalizePlace(term);
        const queryWords=normalizedTerm.split(' ').filter(Boolean);
        const localMatches:PlaceSuggestion[]=POPULAR_PLACES.filter((place)=>queryWords.every((word)=>normalizePlace(`${place.searchName} ${place.name}`).includes(word))).map((place)=>({...place,rank:0,source:'local'}));
        const combined=dedupePlaces([...localMatches,...items]).sort((a,b)=>{
          const rank=(a.rank??8)-(b.rank??8); if(rank) return rank;
          const aExact=normalizePlace(a.searchName??a.name.split(',')[0])===normalizedTerm?0:1;
          const bExact=normalizePlace(b.searchName??b.name.split(',')[0])===normalizedTerm?0:1;
          return aExact-bExact;
        }).slice(0,6);
        setSuggestions(combined); setOpen(true); setLocationError('');
      } catch (cause) {
        if (request === sequence.current) { const words=normalizePlace(term).split(' ').filter(Boolean); const localMatches=POPULAR_PLACES.filter((place)=>words.every((word)=>normalizePlace(`${place.searchName} ${place.name}`).includes(word))).map((place)=>({...place,rank:0,source:'local' as const})); setSuggestions(dedupePlaces(localMatches).slice(0,6)); setOpen(localMatches.length>0); setLocationError(localMatches.length?'Online place search is unavailable. Choose a listed city or try again later.':cause instanceof Error ? cause.message : 'Place search failed.'); }
      } finally { if (request === sequence.current) setSearching(false); }
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [query, value.place]);
  const chooseLocation = (place:PlaceSuggestion) => { update({place:place.name,latitude:place.lat,longitude:place.lon}); setQuery(place.name); setSuggestions([]); setOpen(false); setLocationError(''); };
  const useCurrentLocation = () => {
    setLocationError('');
    if (!navigator.geolocation) { setLocationError('Location access is unavailable in this browser. Search for your birth place instead.'); return; }
    setSearching(true);
    navigator.geolocation.getCurrentPosition(async ({coords}) => {
      try {
        const url = new URL('https://photon.komoot.io/reverse');
        url.searchParams.set('lat', String(coords.latitude)); url.searchParams.set('lon', String(coords.longitude));
        const response = await fetch(url.toString(), {headers:{Accept:'application/json'}});
        const payload = response.ok ? await response.json() as {features?:{properties?:Record<string,unknown>}[]} : {};
        const p = payload.features?.[0]?.properties ?? {};
        const value=(key:string)=>typeof p[key]==='string'?(p[key] as string).trim():'';
        const locality = value('city')||value('town')||value('village')||value('municipality')||value('district')||value('county');
        const district = value('district')||value('county');
        const state = value('state');
        const secondary = [district,state].filter((part,index,all)=>part&&normalizePlace(part)!==normalizePlace(locality)&&all.findIndex((item)=>normalizePlace(item)===normalizePlace(part))===index).join(', ');
        const name = locality ? (secondary ? `${locality} — ${secondary}` : locality) : state || 'Current location';
        chooseLocation({name,lat:coords.latitude,lon:coords.longitude});
      } catch { chooseLocation({name:'Current location',lat:coords.latitude,lon:coords.longitude}); }
      finally { setSearching(false); }
    }, () => { setSearching(false); setLocationError('Could not access device location. Search for the birth place instead.'); }, {enableHighAccuracy:false,timeout:10000,maximumAge:60000});
  };
  return <div className={`grid gap-4 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
    <label className="text-xs font-medium text-neutral-400">Name<input className={field} autoComplete="name" value={value.name} onChange={(e)=>update({name:e.target.value})} placeholder="Your name" /></label>
    <label className="text-xs font-medium text-neutral-400">Date of birth<input required type="date" max={todayInputDate()} style={{colorScheme:'dark'}} className={field} value={value.date} onChange={(e)=>update({date:e.target.value})} onInput={(e)=>update({date:e.currentTarget.value})} /></label>
    <label className="text-xs font-medium text-neutral-400">Birth time<input required type="time" style={{colorScheme:'dark'}} className={field} value={value.time} onChange={(e)=>update({time:e.target.value})} onInput={(e)=>update({time:e.currentTarget.value})} /></label>
    <div className="relative text-xs font-medium text-neutral-400 sm:col-span-2 lg:col-span-1"><label htmlFor={`birth-place-${value.name||'main'}`}>Birth place</label><div className="relative mt-1"><MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-200/60"/><input id={`birth-place-${value.name||'main'}`} className={`${field} mt-0 pl-9 pr-3`} autoComplete="off" role="combobox" aria-expanded={open && suggestions.length>0} aria-controls={`place-list-${value.name||'main'}`} value={query} onFocus={()=>suggestions.length&&setOpen(true)} onChange={(e)=>{setQuery(e.target.value);update({place:'custom'});setOpen(true);}} placeholder="Search city or town"/>{open&&suggestions.length>0&&<div id={`place-list-${value.name||'main'}`} role="listbox" className="absolute inset-x-0 top-full z-30 mt-1 max-h-64 overflow-y-auto rounded-xl border border-amber-200/20 bg-[#171216] shadow-2xl">{suggestions.map((place)=><button key={`${normalizePlace(place.name)}-${place.lat.toFixed(3)}-${place.lon.toFixed(3)}`} type="button" role="option" className="block w-full border-b border-white/[.06] px-3 py-2.5 text-left text-sm text-neutral-100 last:border-0 hover:bg-amber-300/10" onClick={()=>chooseLocation(place)}>{place.name}</button>)}</div>}</div><div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-neutral-500"><button type="button" onClick={useCurrentLocation} className="inline-flex items-center gap-1 text-amber-200/80 hover:text-amber-100" disabled={searching}><Navigation size={11}/>{searching?'Finding place…':'Use current location'}</button><span>Search by <a className="underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a></span></div>{locationError&&<p role="status" className="mt-1 text-[11px] text-rose-200">{locationError}</p>}{query.trim().length>=3&&!searching&&!suggestions.length&&!locationError&&query!==value.place&&<p className="mt-1 text-[11px] text-neutral-500">No matching place found. Try a nearby city.</p>}</div>
    <label className="text-xs font-medium text-neutral-400">Birth time zone<select className={field} value={value.timezone} onChange={(e)=>update({timezone:e.target.value})}><option value="Asia/Kolkata">India Standard Time (IST)</option><option value="Asia/Kathmandu">Nepal Time (NPT)</option><option value="Asia/Dubai">Gulf Standard Time (GST)</option><option value="Europe/London">UK time</option><option value="America/New_York">US Eastern time</option><option value="America/Los_Angeles">US Pacific time</option><option value="Australia/Sydney">Sydney time</option><option value="UTC">UTC</option></select></label>
  </div>;
}

function PrintRashiChart({chart,language}:{chart:BirthChart;language:ResultLanguage}) {
  const ascIndex=RASHIS.indexOf(chart.ascendant.sign as typeof RASHIS[number]);
  const planets=chart.planets.filter((planet)=>!['Uranus','Neptune','Pluto'].includes(planet.name));
  const houses=[{n:1,x:150,y:45},{n:2,x:75,y:44},{n:3,x:43,y:86},{n:4,x:43,y:150},{n:5,x:43,y:214},{n:6,x:75,y:256},{n:7,x:150,y:256},{n:8,x:225,y:256},{n:9,x:257,y:214},{n:10,x:257,y:150},{n:11,x:257,y:86},{n:12,x:225,y:44}];
  return <svg viewBox="0 0 300 300" role="img" aria-label={language==='hi'?'उत्तर भारतीय राशि कुंडली':'North Indian Rashi chart'} style={{width:'100%',maxWidth:390,display:'block',margin:'14px auto',background:'#fffdf8',color:'#684817',border:'1px solid #b8904a'}}><path d="M1 1H299V299H1Z M1 1L299 299 M299 1L1 299 M150 1L299 150L150 299L1 150Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>{houses.map(({n,x,y})=>{const sign=RASHIS[(ascIndex+n-1)%12];const occupants=[...(n===1?[`${language==='hi'?'लग्न':'ASC'} ${chart.ascendant.degree.toFixed(1)}°`]:[]),...planets.filter((planet)=>planet.house===n).map((planet)=>`${localizePlanet(planet.name,language)}${planet.retrograde?' ℞':''}`)];return <g key={n} textAnchor="middle"><text x={x} y={y-15} fill="#936c29" fontSize="8">{n}{n===1?(language==='hi'?' · लग्न':' · LAGNA'):''}</text><text x={x} y={y-3} fill="#392515" fontSize="9">{localizeSign(sign,language)}</text><text x={x} y={y+11} fill="#38291e" fontSize="7.5">{occupants.length?occupants.join(' · '):'—'}</text></g>})}</svg>;
}

function PrintableReport({document:printDocument}:{document:PrintDocument|null}) {
  if(!printDocument)return null;
  const hi=printDocument.language==='hi';
  const hasRetrograde = printDocument.charts?.some((chart)=>chart.planets.some((planet)=>planet.retrograde)) ?? false;
  return <article className="jyotish-print-root" lang={hi?'hi':'en'}>
    <style>{`@page{size:A4;margin:16mm} .jyotish-print-root{display:none} @media print{html,body{background:#fff!important;color:#201912!important}body *{display:none!important;visibility:hidden!important}.jyotish-print-root,.jyotish-print-root *{display:revert!important;visibility:visible!important}.jyotish-print-root{display:block!important;position:static!important;width:100%!important;padding:0!important;color:#201912!important;background:#fff!important;font:11pt/1.55 Arial,"Nirmala UI","Noto Sans Devanagari","Mangal",sans-serif!important}.jyotish-print-root h1{font:24pt Georgia,serif!important;color:#5c3b12!important;margin:0 0 5mm!important}.jyotish-print-root h2{font:15pt Georgia,serif!important;color:#6b4b1b!important;border-bottom:1px solid #d8c7a4;padding-bottom:2mm;margin:7mm 0 3mm!important;break-after:avoid}.jyotish-print-root p{margin:1.5mm 0!important}.jyotish-print-root table{width:100%;border-collapse:collapse;margin-top:3mm}.jyotish-print-root th,.jyotish-print-root td{border:1px solid #ded6c8;padding:2.2mm;text-align:left}.jyotish-print-root th{background:#f5f0e7}.jyotish-print-root svg{display:block!important;width:100%!important;max-width:390px!important;height:auto!important;max-height:155mm;margin:14px auto!important;break-inside:avoid}.jyotish-print-brand{font:9pt Georgia,serif!important;letter-spacing:2px;color:#986d27!important;margin-bottom:7mm}.jyotish-print-section{break-inside:avoid}.jyotish-print-footer{margin-top:10mm;padding-top:3mm;border-top:1px solid #ded6c8;color:#766d60;font-size:9pt}}`}</style>
    <div className="jyotish-print-brand">NIMANTRAN JYOTISH</div>
    <h1>{printDocument.title}</h1>
      {printDocument.sections.map((section,index)=><section className="jyotish-print-section" key={`${section.title}-${index}`}>
      <h2>{section.title}</h2>
      {section.rows.length>0&&<table><tbody>{section.rows.map((row)=><tr key={`${row.label}-${row.value}`}><th>{row.label}</th><td>{row.value}</td></tr>)}</tbody></table>}
    </section>)}
    {printDocument.charts?.map((chart,index)=><section className="jyotish-print-section" key={`chart-${index}`}><h2>{hi?`${chart.birth.name||'जन्म'} की राशि कुंडली`:`${chart.birth.name||'Birth'} Rashi chart`}</h2><PrintRashiChart chart={chart} language={printDocument.language}/></section>)}
    {hasRetrograde&&<p className="jyotish-print-symbol-note">{hi?'℞ का अर्थ वक्री है। यह चिह्न बताता है कि पृथ्वी से देखने पर ग्रह पीछे की ओर चलता हुआ प्रतीत होता है।':'℞ means retrograde. It marks a planet that appears to move backward as seen from Earth.'}</p>}
    <div className="jyotish-print-footer">{hi?'यह रिपोर्ट आपके दिए गए जन्म विवरण के आधार पर तैयार की गई है।':'Prepared from the birth details provided.'}</div>
  </article>;
}

function PdfButton({language,onClick}:{language:ResultLanguage;onClick:()=>void}) {
  return <button type="button" onClick={onClick} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-amber-300/25 bg-amber-300/[.08] px-4 py-2 text-xs font-semibold text-amber-100 transition hover:bg-amber-300/[.15] print:hidden"><Download size={15}/>{language==='hi'?'प्रिंट / PDF सेव करें':'Print / Save PDF'}</button>;
}

function ChartResult({ chart, language, onDownloadPdf }: { chart:BirthChart; language:ResultLanguage; onDownloadPdf:()=>void }) {
  const [chartStyle,setChartStyle] = useState<'north'|'south'>('north');
  const rashis = chart.planets.filter((planet)=>!['Uranus','Neptune','Pluto'].includes(planet.name));
  const ascIndex = RASHIS.indexOf(chart.ascendant.sign as typeof RASHIS[number]);
  const nakIndex = Math.floor(chart.birthStar.longitude / (360 / 27));
  const nadi = NAK_NADIS[nakIndex];
  const gana = NAK_GANAS[nakIndex];
  const houses = [
    {n:1,x:150,y:45},{n:2,x:75,y:44},{n:3,x:43,y:86},{n:4,x:43,y:150},
    {n:5,x:43,y:214},{n:6,x:75,y:256},{n:7,x:150,y:256},{n:8,x:225,y:256},
    {n:9,x:257,y:214},{n:10,x:257,y:150},{n:11,x:257,y:86},{n:12,x:225,y:44},
  ];
  return <div className="mt-7 space-y-5" lang={language==='hi'?'hi':'en'}>
    <div className="flex justify-end"><PdfButton language={language} onClick={onDownloadPdf}/></div>
    <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4"><div className="mb-3 text-[10px] font-semibold uppercase tracking-[.16em] text-neutral-500">{localize('Birth details used',language)}</div><div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4"><div><span className="block text-[10px] text-neutral-500">{localize('Name',language)}</span><span className="text-neutral-200">{chart.birth.name||'—'}</span></div><div><span className="block text-[10px] text-neutral-500">{localize('Date & local time',language)}</span><span className="text-neutral-200">{chart.birth.date} · {chart.birth.time}</span></div><div><span className="block text-[10px] text-neutral-500">{localize('Birth place',language)}</span><span className="text-neutral-200">{chart.birth.place==='custom'||chart.birth.place==='coordinates'?`${chart.birth.latitude.toFixed(4)}, ${chart.birth.longitude.toFixed(4)}`:chart.birth.place}</span></div><div><span className="block text-[10px] text-neutral-500">{localize('Time zone',language)}</span><span className="text-neutral-200">{chart.birth.timezone}</span></div></div></div>
    <div className="grid gap-3 sm:grid-cols-3">
      {[[localize('Ascendant',language),localizeSign(chart.ascendant.sign,language)],[localize('Moon sign',language),localizeSign(chart.birthStar.sign,language)],[localize('Birth star',language),`${localizeNakshatra(chart.birthStar.nakshatra,language)} · ${language==='hi'?'चरण':'Pada'} ${chart.birthStar.pada}`]].map(([label,value])=><div key={label} className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.045] p-4"><div className="text-[10px] uppercase tracking-[.18em] text-amber-200/65">{label}</div><div className="mt-2 font-cormorant text-xl text-[#fff2d7]">{value}</div></div>)}
    </div>
    <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-amber-300/15 bg-amber-300/[.04] p-4"><div className="text-[10px] uppercase tracking-[.18em] text-amber-200/65">{language==='hi'?'जन्म नक्षत्र':'Janma Nakshatra'}</div><div className="mt-2 font-cormorant text-xl text-[#fff2d7]">{localizeNakshatra(chart.birthStar.nakshatra,language)} · {language==='hi'?'चरण':'Pada'} {chart.birthStar.pada}</div><div className="mt-1 text-xs text-neutral-400">{localizePlanet(NAK_LORDS[nakIndex%9],language)} {language==='hi'?'स्वामी':'lord'} · {language==='hi'?({Adi:'आदि',Madhya:'मध्य',Antya:'अंत्य'}[nadi]??nadi):nadi} {language==='hi'?'नाड़ी':'Nadi'} · {language==='hi'?({Deva:'देव',Manushya:'मनुष्य',Rakshasa:'राक्षस'}[gana]??gana):gana} {language==='hi'?'गण':'Gana'} · {language==='hi'?'चंद्र राशि':'Moon in'} {localizeSign(chart.birthStar.sign,language)}</div></div><div className="rounded-2xl border border-amber-300/15 bg-amber-300/[.04] p-4"><div className="text-[10px] uppercase tracking-[.18em] text-amber-200/65">{language==='hi'?'लग्न':'Ascendant (Lagna)'}</div><div className="mt-2 font-cormorant text-xl text-[#fff2d7]">{localizeSign(chart.ascendant.sign,language)} · {chart.ascendant.degree.toFixed(2)}°</div><div className="mt-1 text-xs text-neutral-400">{language==='hi'?'पूर्ण राशि भाव · लाहिड़ी सायन':'Whole-sign house chart · Lahiri sidereal'}</div></div></div>
    <section className="rounded-2xl border border-amber-200/15 bg-[radial-gradient(ellipse_at_top,rgba(194,139,52,.08),transparent_65%),#100d10] p-4 sm:p-6"><div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h3 className="font-cormorant text-2xl text-[#fff2d7]">{localize('Rāśi chart',language)} <span className="text-lg text-amber-200/80">· {localize(chartStyle==='north'?'North':'South',language)} {language==='hi'?'भारतीय':'Indian'}</span></h3><p className="mt-1 text-xs text-neutral-500">{language==='hi'?'पूर्ण राशि भाव · लग्न':'Whole-sign houses · Ascendant in'} {localizeSign(chart.ascendant.sign,language)}</p></div><div className="flex rounded-xl border border-white/10 bg-black/20 p-1" aria-label={language==='hi'?'कुंडली शैली':'Rashi chart style'}><button type="button" onClick={()=>setChartStyle('north')} aria-pressed={chartStyle==='north'} className={`rounded-lg px-3 py-1.5 text-xs ${chartStyle==='north'?'bg-amber-300/15 text-amber-100':'text-neutral-400 hover:text-white'}`}>{localize('North',language)}</button><button type="button" onClick={()=>setChartStyle('south')} aria-pressed={chartStyle==='south'} className={`rounded-lg px-3 py-1.5 text-xs ${chartStyle==='south'?'bg-amber-300/15 text-amber-100':'text-neutral-400 hover:text-white'}`}>{localize('South',language)}</button></div></div>{chartStyle==='north'?<svg viewBox="0 0 300 300" role="img" aria-label={language==='hi'?'उत्तर भारतीय राशि कुंडली':'North Indian Rashi chart'} className="mx-auto block w-full max-w-[430px] overflow-visible rounded-xl border border-amber-200/35 bg-[#171116] text-amber-100"><path d="M1 1H299V299H1Z M1 1L299 299 M299 1L1 299 M150 1L299 150L150 299L1 150Z" fill="none" stroke="currentColor" strokeOpacity=".62" strokeWidth="1.4"/>{houses.map(({n,x,y})=>{const sign=RASHIS[(ascIndex+n-1)%12];const occupants=[...(n===1?[`${language==='hi'?'लग्न':'ASC'} ${chart.ascendant.degree.toFixed(1)}°`]:[]),...rashis.filter((planet)=>planet.house===n).map((planet)=>`${localizePlanet(planet.name,language)}${planet.retrograde?' ℞':''}`)];return <g key={n} textAnchor="middle"><text x={x} y={y-15} fill="#d6ad67" fontSize="8">{n}{n===1?(language==='hi'?' · लग्न':' · LAGNA'):''}</text><text x={x} y={y-3} fill="#f9e9cb" fontSize="9">{localizeSign(sign,language)}</text><text x={x} y={y+11} fill="#d9c7ad" fontSize="7.5">{occupants.length?occupants.join(' · '):'—'}</text></g>})}</svg>:<div role="img" aria-label={language==='hi'?'दक्षिण भारतीय राशि कुंडली':'South Indian Rashi chart'} className="mx-auto grid aspect-square w-full max-w-[430px] grid-cols-4 grid-rows-4 overflow-hidden rounded-xl border border-amber-200/35 bg-[#171116] text-center text-amber-100">{[11,0,1,2,10,null,null,3,9,null,null,4,8,7,6,5].map((signIndex,index)=>{const placement=index===5?{gridColumn:'2 / span 2',gridRow:'2 / span 2'}:index<4?{gridColumn:String(index+1),gridRow:'1'}:index===4?{gridColumn:'1',gridRow:'2'}:index===7?{gridColumn:'4',gridRow:'2'}:index===8?{gridColumn:'1',gridRow:'3'}:index===11?{gridColumn:'4',gridRow:'3'}:index>=12?{gridColumn:String(index-11),gridRow:'4'}:undefined;if(index===5)return <div key="center" style={placement} className="flex flex-col items-center justify-center border border-amber-200/25 bg-amber-300/[.035] p-2"><span className="font-cormorant text-2xl text-amber-100">राशि</span><span className="mt-1 text-[10px] text-neutral-400">{localizeSign(chart.ascendant.sign,language)} {language==='hi'?'लग्न':'Lagna'} · {chart.ascendant.degree.toFixed(1)}°</span></div>;if(signIndex===null)return null;const house=(signIndex-ascIndex+12)%12+1;const occupants=[...(house===1?[language==='hi'?'लग्न':'ASC']:[]),...rashis.filter((planet)=>RASHIS.indexOf(planet.sign as typeof RASHIS[number])===signIndex).map((planet)=>`${language==='hi'?localizePlanet(planet.name,language).slice(0,1):planet.name.slice(0,2)}${planet.retrograde?'℞':''}`)];return <div key={signIndex} style={placement} className="flex min-w-0 flex-col items-center justify-center border border-amber-200/25 p-1"><span className="text-[8px] text-amber-200/65">{house}{house===1?(language==='hi'?' · लग्न':' · LAGNA'):''}</span><span className="mt-0.5 text-[10px] font-medium text-[#fff2d7]">{localizeSign(RASHIS[signIndex],language)}</span><span className="mt-1 max-w-full break-words text-[9px] leading-3 text-neutral-300">{occupants.join(' · ')||'—'}</span></div>})}</div>}<p className="mt-3 text-center text-[10px] leading-4 text-neutral-500">{language==='hi'?'ग्रह राशि और पूर्ण राशि भाव के अनुसार रखे गए हैं; ℞ वक्री गति दर्शाता है।':'Planets are placed by sign/whole-sign house; ℞ marks retrograde motion.'}</p></section>
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3"><div className="text-sm font-semibold text-neutral-200">{localize('Sidereal planetary placements',language)}</div><div className="text-xs text-neutral-500">Lahiri · {language==='hi'?'पूर्ण राशि भाव':'Whole-sign houses'}</div></div>
      <div className="grid grid-cols-2 gap-px bg-white/[.06] sm:grid-cols-3 lg:grid-cols-4">{rashis.map((planet)=><div key={planet.name} className="bg-[#100d10] px-4 py-3"><div className="flex items-center justify-between text-xs text-neutral-500"><span>{localizePlanet(planet.name,language)}</span>{planet.retrograde&&<span className="text-amber-300">℞</span>}</div><div className="mt-1 text-sm text-[#fff6eb]">{localizeSign(planet.sign,language)} <span className="text-neutral-500">{planet.degree.toFixed(1)}°</span></div><div className="mt-1 text-[11px] text-neutral-500">{localize('House',language)} {planet.house} · {localizeNakshatra(planet.nakshatra,language)}</div></div>)}</div>
    </div>
    <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4"><div className="mb-3 text-xs font-semibold uppercase tracking-[.15em] text-neutral-400">{localize('Panchanga at birth',language)}</div><div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">{Object.entries(chart.panchanga).map(([key,value])=><div key={key}><div className="text-[11px] capitalize text-neutral-500">{localize(key,language)}</div><div className="mt-1 text-neutral-200">{localizePanchanga(key,value,language)}</div></div>)}</div></div>
  </div>;
}

const kootaMeaning:Record<string,string> = {
  Varna:'Traditional temperament and outlook', Vashya:'Mutual influence', 'Tara (Dina)':'Birth-star harmony', Yoni:'Instinctive compatibility',
  'Graha Maitri':'Moon-sign lord relationship', Gana:'Temperament grouping', 'Bhakoot (Rashi)':'Moon-sign relationship', Nadi:'Nadi grouping',
};
const planetShort:Record<string,string> = { Sun:'Su',Moon:'Mo',Mars:'Ma',Mercury:'Me',Jupiter:'Ju',Venus:'Ve',Saturn:'Sa',Rahu:'Ra',Ketu:'Ke' };
function MatchRashiChart({ chart, label, language }: {chart:BirthChart;label:string;language:ResultLanguage}) {
  const ascIndex=RASHIS.indexOf(chart.ascendant.sign as typeof RASHIS[number]);
  const houses=[{n:1,x:150,y:45},{n:2,x:75,y:44},{n:3,x:43,y:86},{n:4,x:43,y:150},{n:5,x:43,y:214},{n:6,x:75,y:256},{n:7,x:150,y:256},{n:8,x:225,y:256},{n:9,x:257,y:214},{n:10,x:257,y:150},{n:11,x:257,y:86},{n:12,x:225,y:44}];
  return <svg viewBox="0 0 300 300" role="img" aria-label={`${label} ${language==='hi'?'उत्तर भारतीय राशि कुंडली':'North Indian Rashi chart'}`} className="mx-auto block w-full max-w-[280px] rounded-xl border border-amber-200/25 bg-[#171116] text-amber-100"><path d="M1 1H299V299H1Z M1 1L299 299 M299 1L1 299 M150 1L299 150L150 299L1 150Z" fill="none" stroke="currentColor" strokeOpacity=".5" strokeWidth="1.2"/>{houses.map(({n,x,y})=>{const sign=RASHIS[(ascIndex+n-1)%12];const occupants=[...(n===1?[language==='hi'?'लग्न':'ASC']:[]),...chart.planets.filter((planet)=>planet.house===n&&!['Uranus','Neptune','Pluto'].includes(planet.name)).map((planet)=>language==='hi'?localizePlanet(planet.name,language).slice(0,1):(planetShort[planet.name]??planet.name.slice(0,2)))];return <g key={n} textAnchor="middle"><text x={x} y={y-12} fill="#d6ad67" fontSize="7">{n}{n===1?(language==='hi'?' · लग्न':' · L'):''}</text><text x={x} y={y-2} fill="#f9e9cb" fontSize="8">{localizeSign(sign,language).slice(0,3)}</text><text x={x} y={y+9} fill="#d9c7ad" fontSize="6.5">{occupants.length?occupants.join(' '):'—'}</text></g>})}</svg>;
}
function CompatibilityReport({groom,bride,match,language}:{groom:BirthChart;bride:BirthChart;match:ReturnType<typeof calculateAshtakoota>;language:ResultLanguage}) {
  const marsHouse=(chart:BirthChart)=>chart.planets.find((planet)=>planet.name==='Mars')?.house??0;
  const flagged=(house:number)=>[1,2,4,7,8,12].includes(house);
  const scoreBand=match.total>=31?'High traditional score (31–36)':match.total>=21?'Moderate-to-high traditional score (21–30)':match.total>=17?'Mid-range traditional score (17–20)':'Lower traditional score (0–16)';
  const profiles=[{label:groom.birth.name||'Groom',chart:groom},{label:bride.birth.name||'Bride',chart:bride}];
  return <div className="mt-7 space-y-5" lang={language==='hi'?'hi':'en'}>
    <section className="grid gap-3 lg:grid-cols-2" aria-label={language==='hi'?'दोनों की जन्म कुंडली':'Partner birth chart summaries'}>{profiles.map(({label,chart})=><article key={label} className="rounded-2xl border border-amber-200/15 bg-[#151115] p-4"><div className="mb-3 flex items-baseline justify-between gap-2"><h3 className="font-semibold text-amber-100">{label}</h3><span className="text-[10px] text-neutral-500">Lahiri · {language==='hi'?'पूर्ण राशि भाव':'whole-sign'}</span></div><div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_180px] sm:items-center"><div className="space-y-2 text-xs text-neutral-300"><p><span className="text-neutral-500">{language==='hi'?'जन्म':'Birth'}:</span> {chart.birth.date} · {chart.birth.time}</p><p><span className="text-neutral-500">{language==='hi'?'स्थान':'Place'}:</span> {chart.birth.place}</p><p><span className="text-neutral-500">{language==='hi'?'लग्न':'Lagna'}:</span> {localizeSign(chart.ascendant.sign,language)} · <span className="text-neutral-500">{language==='hi'?'चंद्र राशि':'Moon'}:</span> {localizeSign(chart.birthStar.sign,language)}</p><p><span className="text-neutral-500">{language==='hi'?'जन्म नक्षत्र':'Janma Nakshatra'}:</span> {localizeNakshatra(chart.birthStar.nakshatra,language)}, {language==='hi'?'चरण':'Pada'} {chart.birthStar.pada}</p><p><span className="text-neutral-500">{language==='hi'?'मंगल':'Mars'}:</span> {language==='hi'?'भाव':'House'} {marsHouse(chart)} — {language==='hi'?(flagged(marsHouse(chart))?'आमतौर पर देखे जाने वाले मांगलिक भाव में':'आमतौर पर देखे जाने वाले मांगलिक भावों से बाहर'):(flagged(marsHouse(chart))?'in a commonly checked Manglik house':'outside the commonly checked Manglik houses')}</p></div><MatchRashiChart chart={chart} label={label} language={language}/></div></article>)}</section>
    <section className="rounded-2xl border border-amber-300/15 bg-amber-300/[.035] p-4 sm:p-5"><div className="flex flex-wrap items-end justify-between gap-3"><div><div className="text-xs text-neutral-400">{localize('Ashtakoota Guna Milan',language)}</div><h3 className="mt-1 font-cormorant text-3xl text-[#fff0d7]">{Number.isInteger(match.total)?match.total:match.total.toFixed(1)} <span className="text-lg text-neutral-500">/ 36</span></h3></div><div className="text-right"><div className="text-sm font-medium text-amber-100">{localize(scoreBand,language)}</div><p className="mt-1 text-[10px] text-neutral-500">{language==='hi'?'अलग-अलग परंपराओं में गुणों की व्याख्या बदल सकती है।':'Traditional scoring bands differ by source and lineage.'}</p></div></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-200" style={{width:`${Math.max(0,Math.min(100,match.total/36*100))}%`}}/></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[520px] text-left text-xs"><thead className="text-[10px] uppercase tracking-wider text-neutral-500"><tr><th className="pb-2 font-medium">{localize('Koota',language)}</th><th className="pb-2 font-medium">{localize('Traditional area',language)}</th><th className="pb-2 text-right font-medium">{localize('Score',language)}</th></tr></thead><tbody>{match.scores.map((item)=><tr key={item.name} className="border-t border-white/[.07]"><td className="py-2.5 font-medium text-neutral-200">{localize(item.name,language)}</td><td className="py-2.5 text-neutral-400">{localize(kootaMeaning[item.name]??'Traditional compatibility factor',language)}</td><td className="py-2.5 text-right text-amber-100">{item.score} / {item.max}</td></tr>)}</tbody></table></div></section>
    <div className="rounded-xl border border-white/[.08] bg-white/[.02] p-4 text-xs leading-5 text-neutral-400"><p className="font-medium text-neutral-200">{language==='hi'?'इस रिपोर्ट को समझें':'How to read this responsibly'}</p><p className="mt-1">{language==='hi'?'यह रिपोर्ट चंद्र राशि पर आधारित अष्टकूट गुणों और लग्न से मंगल की सामान्य स्थिति दिखाती है। इसमें दोष-निवारण के सभी नियम शामिल नहीं हैं; परंपराओं के अनुसार नियम बदल सकते हैं। केवल गुणों के अंक के आधार पर विवाह का निर्णय न लें।':'This report compares Moon-based Ashtakoota factors and shows a basic Mars-from-Lagna screen. It does not calculate dosha cancellation or replace a full chart review; traditions use different rules. A Guna score alone should not decide a relationship or marriage.'}</p>{match.notes.length>0&&<ul className="mt-3 list-disc space-y-1 pl-4 text-amber-100/80">{match.notes.map((note)=><li key={note}>{language==='hi'?(note.startsWith('Same Nadi')?'समान नाड़ी को पारंपरिक रूप से ध्यान देने योग्य माना जाता है; नियम और अपवाद परंपरा के अनुसार बदल सकते हैं।':'इस भकूट संबंध को पारंपरिक रूप से ध्यान देने योग्य माना जाता है; नियम और अपवाद परंपरा के अनुसार बदल सकते हैं।'):note}</li>)}</ul>}</div>
  </div>;
}

export function VedicAstrologyStudio({ onBack }: { onBack:()=>void }) {
  const [tab,setTab] = useState<Tab>('kundali');
  const [language,setLanguage] = useState<ResultLanguage>('en');
  const [printDocument,setPrintDocument] = useState<PrintDocument|null>(null);
  const [birth,setBirth] = useState(()=>initialBirth());
  const [groom,setGroom] = useState(()=>initialBirth('Groom'));
  const [bride,setBride] = useState(()=>initialBirth('Bride'));
  const [chart,setChart] = useState<BirthChart|null>(null);
  const [match,setMatch] = useState<ReturnType<typeof calculateAshtakoota>|null>(null);
  const [matchedCharts,setMatchedCharts] = useState<{groom:BirthChart;bride:BirthChart}|null>(null);
  const [numbers,setNumbers] = useState<ReturnType<typeof calculateNumbers>|null>(null);
  const [error,setError] = useState('');
  const lagnaLord = chart ? LAGNA_LORDS[chart.ascendant.sign] : '';
  const stone = lagnaLord ? GEMSTONES[lagnaLord] : undefined;
  const button = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 px-5 py-3 text-sm font-semibold text-[#241507] shadow-lg shadow-amber-950/30 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200';
  const heading = useMemo(()=>tabs.find((item)=>item.id===tab)!,[tab]);
  const run = (action:()=>void) => { setError(''); try { action(); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Please check the entered details and try again.'); } };
  const openPdf = (document:PrintDocument) => { setPrintDocument(document); window.setTimeout(()=>window.print(),180); };
  useEffect(()=>{const clear=()=>setPrintDocument(null);window.addEventListener('afterprint',clear);return()=>window.removeEventListener('afterprint',clear);},[]);
  const birthRows = (value:BirthChart):PrintRow[] => [
    {label:localize('Name',language),value:value.birth.name||'—'},
    {label:localize('Date & local time',language),value:`${value.birth.date} · ${value.birth.time}`},
    {label:localize('Birth place',language),value:value.birth.place},
    {label:localize('Time zone',language),value:value.birth.timezone},
  ];
  const chartSections = (value:BirthChart):PrintSection[] => [
    {title:localize('Birth details used',language),rows:birthRows(value)},
    {title:language==='hi'?'मुख्य जन्म विवरण':'Birth summary',rows:[
      {label:localize('Ascendant',language),value:`${localizeSign(value.ascendant.sign,language)} · ${value.ascendant.degree.toFixed(2)}°`},
      {label:localize('Moon sign',language),value:localizeSign(value.birthStar.sign,language)},
      {label:localize('Birth star',language),value:`${localizeNakshatra(value.birthStar.nakshatra,language)} · ${language==='hi'?'चरण':'Pada'} ${value.birthStar.pada}`},
    ]},
    {title:localize('Sidereal planetary placements',language),rows:value.planets.filter((p)=>!['Uranus','Neptune','Pluto'].includes(p.name)).map((p)=>({label:localizePlanet(p.name,language),value:`${localizeSign(p.sign,language)} · ${p.degree.toFixed(2)}° · ${localize('House',language)} ${p.house} · ${localizeNakshatra(p.nakshatra,language)}${p.retrograde?' · ℞':''}`}))},
    {title:localize('Panchanga at birth',language),rows:Object.entries(value.panchanga).map(([label,result])=>({label:localize(label,language),value:localizePanchanga(label,result,language)}))},
  ];
  const downloadChartPdf = (value:BirthChart) => openPdf({title:language==='hi'?'जन्म कुंडली':'Birth chart',language,sections:chartSections(value),charts:[value]});
  const downloadMatchPdf = (g:BirthChart,b:BirthChart,result:ReturnType<typeof calculateAshtakoota>) => openPdf({title:language==='hi'?'कुंडली मिलान रिपोर्ट':'Kundali matching report',language,sections:[
    {title:`${g.birth.name||localize('Groom',language)} · ${localize('Birth details used',language)}`,rows:birthRows(g)},
    {title:`${b.birth.name||localize('Bride',language)} · ${localize('Birth details used',language)}`,rows:birthRows(b)},
    {title:localize('Ashtakoota Guna Milan',language),rows:[{label:language==='hi'?'कुल गुण':'Total score',value:`${result.total} / 36`},...result.scores.map((item)=>({label:localize(item.name,language),value:`${item.score} / ${item.max} · ${localize(kootaMeaning[item.name]??'Traditional compatibility factor',language)}`})),...result.notes.map((note,index)=>({label:language==='hi'?`ध्यान दें ${index+1}`:`Note ${index+1}`,value:note}))]},
  ],charts:[g,b]});
  const calculateChart = () => run(()=>{if(birth.place==='custom') throw new Error('Choose your birth place from the search suggestions or use current location.');setChart(calculateBirthChart(birth));});
  const calculateMatch = () => run(()=>{if(groom.place==='custom'||bride.place==='custom') throw new Error('Choose a birth place for both people from the search suggestions or use current location.');const g=calculateBirthChart(groom), b=calculateBirthChart(bride);setMatchedCharts({groom:g,bride:b});setMatch(calculateAshtakoota(g,b));});
  const calculateNum = () => run(()=>{if(!birth.date) throw new Error('Enter a date of birth first.'); setNumbers(calculateNumbers(birth.date,birth.name));});

  return <><main className="min-h-dvh bg-[#090709] text-neutral-100 selection:bg-amber-400/25">
    <header className="sticky top-0 z-20 border-b border-amber-300/10 bg-[#0b080b]/95 backdrop-blur-xl"><div className="mx-auto max-w-7xl px-3 sm:px-6"><div className="flex h-14 items-center justify-between"><button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-neutral-300 transition hover:text-amber-200"><ArrowLeft size={17}/> Home</button><div className="text-right"><div className="font-cinzel text-xs font-bold tracking-[.16em] text-amber-100 sm:text-sm">NIMANTRAN <span className="text-amber-400">JYOTISH</span></div><div className="mt-0.5 text-[9px] tracking-wide text-neutral-500">A thoughtful Vedic astrology guide</div></div></div><nav aria-label="Choose an astrology tool" className="-mx-1 flex gap-1 overflow-x-auto pb-2 sm:justify-center">{tabs.map((item)=>{const Icon=item.icon;return <button key={item.id} type="button" aria-current={tab===item.id?'page':undefined} onClick={()=>{setTab(item.id);setError('');}} className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] transition ${tab===item.id?'bg-amber-300/15 text-amber-100':'text-neutral-400 hover:bg-white/[.06] hover:text-white'}`}><Icon size={13}/>{item.label}</button>})}</nav></div></header>
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
      <section className="relative overflow-hidden rounded-[28px] border border-amber-300/15 bg-[radial-gradient(ellipse_at_top_right,rgba(177,115,37,.18),transparent_42%),linear-gradient(135deg,#21140f,#100c10_58%,#0d0b0d)] px-5 py-8 sm:px-9 sm:py-11">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-amber-200/10"/><div className="absolute -right-8 -top-12 h-48 w-48 rounded-full border border-amber-200/[.08]"/>
        <div className="relative max-w-3xl"><div className="inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-black/20 px-3 py-1.5 text-[10px] uppercase tracking-[.2em] text-amber-200"><Sun size={13}/> Vedic traditions · made personal</div><h1 className="mt-5 font-cormorant text-4xl font-semibold leading-tight text-[#fff4e3] sm:text-6xl">Wisdom in the <span className="text-amber-300">stars.</span></h1><p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-300 sm:text-base sm:leading-7">Explore your birth chart, compare kundalis, and discover traditional numerology and gemstone associations in one calm, private space.</p><div className="mt-5 inline-flex items-center gap-2 text-xs text-emerald-200/80"><LockKeyhole size={14}/> Chart details stay on this device; place search uses OpenStreetMap data.</div></div>
      </section>
      <section className="mt-7 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" aria-label="Astrology tools">{tabs.map((item)=>{const Icon=item.icon;return <button key={item.id} onClick={()=>{setTab(item.id);setError('');}} className={`rounded-2xl border px-4 py-4 text-left transition ${tab===item.id?'border-amber-300/40 bg-amber-300/[.09] shadow-[0_8px_28px_rgba(187,126,34,.08)]':'border-white/[.08] bg-white/[.025] hover:border-amber-200/20 hover:bg-white/[.045]'}`}><div className="flex items-center justify-between"><Icon size={18} className={tab===item.id?'text-amber-300':'text-neutral-500'}/>{tab===item.id&&<span className="h-1.5 w-1.5 rounded-full bg-amber-300"/>}</div><div className="mt-3 text-sm font-semibold text-neutral-100">{item.label}</div><div className="mt-1 text-[11px] text-neutral-500">{item.helper}</div></button>})}</section>
      <section className="mt-5 rounded-[26px] border border-white/[.09] bg-[#100d10] p-5 shadow-2xl shadow-black/20 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/[.08] pb-5"><div className="flex items-start gap-3"><div className="rounded-xl border border-amber-300/15 bg-amber-300/[.07] p-2.5 text-amber-200"><heading.icon size={19}/></div><div><h2 className="font-cormorant text-2xl font-semibold text-[#fff2dc] sm:text-3xl">{heading.label}</h2><p className="mt-1 text-xs text-neutral-500">{tab==='kundali'?'A sidereal birth chart with Rashi, houses, Nakshatra and Panchanga.':tab==='matching'?'A traditional 36-point Ashtakoota comparison using both birth charts.':tab==='numerology'?'Explore birth, destiny and name numbers through traditional numerology.':'View a traditional Lagna-lord association from your calculated birth chart.'}</p></div></div><div className="flex items-center gap-1 rounded-xl border border-white/10 p-1" role="group" aria-label="Result language"><button type="button" onClick={()=>setLanguage('en')} aria-pressed={language==='en'} className={`rounded-lg px-3 py-1.5 text-xs ${language==='en'?'bg-amber-300/15 text-amber-100':'text-neutral-400'}`}>English</button><button type="button" onClick={()=>setLanguage('hi')} aria-pressed={language==='hi'} className={`rounded-lg px-3 py-1.5 text-xs ${language==='hi'?'bg-amber-300/15 text-amber-100':'text-neutral-400'}`}>हिंदी</button></div></div>
        {tab==='kundali'&&<div className="pt-5"><BirthFields value={birth} onChange={(next)=>{setBirth(next);setChart(null);}}/><div className="mt-5 flex flex-wrap items-center gap-3"><button className={button} onClick={calculateChart}><Compass size={16}/> Calculate birth chart</button><span className="text-xs text-neutral-500">For an exact ascendant, use the recorded local birth time.</span></div>{chart&&<ChartResult chart={chart} language={language} onDownloadPdf={()=>downloadChartPdf(chart)}/>}</div>}
        {tab==='matching'&&<div className="pt-5"><div className="grid gap-7 lg:grid-cols-2"><div><h3 className="mb-4 text-sm font-semibold text-amber-100">{language==='hi'?'वर का जन्म विवरण':'Groom’s birth details'}</h3><BirthFields value={groom} onChange={(next)=>{setGroom(next);setMatch(null);setMatchedCharts(null);}} compact/></div><div><h3 className="mb-4 text-sm font-semibold text-amber-100">{language==='hi'?'वधू का जन्म विवरण':'Bride’s birth details'}</h3><BirthFields value={bride} onChange={(next)=>{setBride(next);setMatch(null);setMatchedCharts(null);}} compact/></div></div><button className={`${button} mt-5`} onClick={calculateMatch}><HeartHandshake size={16}/>{language==='hi'?'कुंडली मिलाएँ':'Compare kundalis'}</button>{match&&matchedCharts&&<><div className="mt-5 flex justify-end"><PdfButton language={language} onClick={()=>downloadMatchPdf(matchedCharts.groom,matchedCharts.bride,match)}/></div><CompatibilityReport groom={matchedCharts.groom} bride={matchedCharts.bride} match={match} language={language}/></>}</div>}
        {tab==='numerology'&&<div className="pt-5"><div className="max-w-3xl"><BirthFields value={birth} onChange={(next)=>{setBirth(next);setNumbers(null);}}/><button className={`${button} mt-5`} onClick={calculateNum}><Sparkles size={16}/>{language==='hi'?'अंक निकालें':'Calculate numbers'}</button></div>{numbers&&<><div className="mt-5 flex justify-end"><PdfButton language={language} onClick={()=>openPdf({title:language==='hi'?'अंक ज्योतिष रिपोर्ट':'Numerology report',language,sections:[{title:language==='hi'?'आपके अंक':'Your numbers',rows:[{label:`${localize('Mulank',language)} · ${localize('Birth number',language)}`,value:String(numbers.mulank)},{label:`${localize('Bhagyank',language)} · ${localize('Destiny number',language)}`,value:String(numbers.bhagyank)},{label:`${localize('Naamank',language)} · ${localize('Chaldean name number',language)}`,value:String(numbers.naamank??'—')},{label:localize('Name',language),value:birth.name||'—'},{label:localize('Date & local time',language),value:birth.date}]}]})}/></div><div className="mt-3 grid gap-3 sm:grid-cols-3">{[['Mulank',numbers.mulank,'Birth number'],['Bhagyank',numbers.bhagyank,'Destiny number'],['Naamank',numbers.naamank??'—','Chaldean name number']].map(([label,value,description])=><div key={label} className="rounded-2xl border border-amber-300/15 bg-amber-300/[.045] p-5"><div className="text-xs uppercase tracking-[.16em] text-amber-200/70">{localize(String(label),language)}</div><div className="mt-2 font-cormorant text-4xl text-[#fff2dc]">{value}</div><div className="mt-1 text-xs text-neutral-500">{localize(String(description),language)}</div></div>)}</div></>}<p className="mt-5 text-xs leading-5 text-neutral-500">{language==='hi'?'अंक ज्योतिष एक पारंपरिक विश्वास प्रणाली है और इसे व्यक्तिगत रुचि के लिए देखें।':'Numerology is a traditional belief system and is shared here for personal reflection.'}</p></div>}
        {tab==='gemstones'&&<div className="pt-5">{!chart?<div className="max-w-3xl"><p className="mb-5 text-sm leading-6 text-neutral-400">{language==='hi'?'अपना लग्न और पारंपरिक रत्न संबंध देखने के लिए जन्म विवरण भरें। यह टूल रत्न पहनने की व्यक्तिगत सलाह नहीं देता।':'Enter birth details to calculate your ascendant and view a traditional stone association. This tool does not prescribe gemstones.'}</p><BirthFields value={birth} onChange={(next)=>{setBirth(next);setChart(null);}}/><button className={`${button} mt-5`} onClick={calculateChart}><Compass size={16}/>{language==='hi'?'कुंडली निकालें':'Calculate chart'}</button></div>:<><div className="mb-4 flex justify-end"><PdfButton language={language} onClick={()=>openPdf({title:language==='hi'?'पारंपरिक रत्न जानकारी':'Gemstone association',language,sections:[...chartSections(chart),{title:language==='hi'?'लग्न के अनुसार पारंपरिक रत्न':'Traditional gemstone association',rows:[{label:language==='hi'?'लग्न':'Ascendant',value:localizeSign(chart.ascendant.sign,language)},{label:language==='hi'?'लग्न स्वामी':'Ascendant lord',value:localizePlanet(lagnaLord,language)},{label:language==='hi'?'पारंपरिक रत्न':'Traditional stone',value:localize(stone?.stone??'No general association',language)},{label:language==='hi'?'हिंदी नाम':'Hindi name',value:stone?.hindi??'—'},{label:language==='hi'?'ध्यान दें':'Note',value:language==='hi'?'यह सामान्य पारंपरिक संबंध है, व्यक्तिगत रत्न पहनने की सलाह नहीं।':'This is a general traditional association, not an individual recommendation.'}]}],charts:[chart]})}/></div><div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]"><div className="flex flex-col items-start justify-center rounded-2xl border border-amber-300/15 bg-[radial-gradient(ellipse_at_30%_0%,rgba(196,141,51,.17),transparent_60%),#151014] p-6"><div className="rounded-2xl border border-amber-200/15 bg-black/20 p-3 text-amber-300"><Gem size={22}/></div><div className="mt-5 text-xs uppercase tracking-[.16em] text-neutral-500">{localizeSign(chart.ascendant.sign,language)} {language==='hi'?'लग्न':'ascendant'} · {localizePlanet(lagnaLord,language)} {language==='hi'?'संबंध':'association'}</div><h3 className="mt-1 font-cormorant text-3xl text-[#fff0d8]">{localize(stone?.stone??'No general association',language)}</h3><div className="mt-1 text-sm text-amber-200/75">{stone?.hindi}</div></div><div className="rounded-2xl border border-white/[.08] bg-white/[.025] p-5"><div className="text-sm font-semibold text-neutral-200">{language==='hi'?'रत्न परंपराओं के बारे में':'A note on gemstone traditions'}</div><p className="mt-3 text-sm leading-6 text-neutral-400">{language==='hi'?'रत्नों के पारंपरिक संबंध अलग-अलग ज्योतिष परंपराओं में बदल सकते हैं।':stone?.caution??'Gemstone associations vary between astrological traditions.'}</p><p className="mt-3 text-xs leading-5 text-neutral-500">{language==='hi'?'यह सामान्य लग्न-स्वामी संबंध पूरी कुंडली या व्यक्तिगत उपयुक्तता का आकलन नहीं करता। इसे रत्न खरीदने या पहनने की सलाह न मानें।':'This general Lagna-lord association does not assess the full chart or individual suitability. It is not a recommendation to buy or wear a stone.'}</p><button className="mt-4 text-xs text-amber-200/80 underline underline-offset-4" onClick={()=>setTab('kundali')}>{language==='hi'?'जन्म कुंडली देखें':'Review birth chart'}</button></div></div></>}</div>}
        {error&&<div role="alert" className="mt-5 rounded-xl border border-rose-400/20 bg-rose-400/[.06] px-4 py-3 text-sm text-rose-200">{error}</div>}
      </section>
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/[.07] bg-white/[.02] p-4 text-xs leading-5 text-neutral-500"><CalendarDays className="mt-0.5 shrink-0 text-amber-300/70" size={16}/><p>Astrological and numerological readings reflect traditional systems for personal interest. They are not scientific predictions or a substitute for professional medical, financial, legal or relationship advice.</p></div>
    </div>
  </main>{createPortal(<PrintableReport document={printDocument}/>,document.body)}</>;
}

export default VedicAstrologyStudio;
