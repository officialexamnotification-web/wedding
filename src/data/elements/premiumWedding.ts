import { GraphicAssetItem } from '../../types/elements';

const svg = (art: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${art}</svg>`;

const gold = '#D4AF37';

/** A small, hand-curated set of original wedding motifs, shown before the broad utility catalogue. */
export const PREMIUM_WEDDING_ELEMENTS: GraphicAssetItem[] = [
  {
    id: 'premium-lotus-medallion', name: 'Lotus Medallion', category: 'graphics', subcategory: 'flowers-botanicals',
    svgContent: svg(`<g stroke-width="1.5"><circle cx="60" cy="60" r="46"/><circle cx="60" cy="60" r="40" stroke-dasharray="1 4"/><path d="M60 82C45 74 40 59 60 36C80 59 75 74 60 82Z"/><path d="M60 82C42 78 30 66 31 51C43 54 53 65 60 82Z"/><path d="M60 82C78 78 90 66 89 51C77 54 67 65 60 82Z"/><path d="M60 82C43 85 32 80 25 69C38 66 50 71 60 82Z"/><path d="M60 82C77 85 88 80 95 69C82 66 70 71 60 82Z"/><path d="M40 90Q60 98 80 90M60 82V101"/><circle cx="60" cy="60" r="3" fill="${gold}"/></g>`),
    filePath: '/assets/elements/graphics/premium/lotus-medallion.svg', defaultColor: gold, tags: ['premium','lotus','kamal','medallion','wedding','floral','ornament'],
  },
  {
    id: 'premium-paisley-pair', name: 'Mughal Paisley Pair', category: 'graphics', subcategory: 'flowers-botanicals',
    svgContent: svg(`<g stroke-width="1.6"><path d="M39 99C10 80 22 47 49 36C70 27 70 11 65 6C91 18 96 44 78 63C64 77 48 75 43 62C39 52 47 43 56 44C43 37 27 52 31 68C34 83 46 88 58 88"/><path d="M61 99C90 80 78 47 51 36M48 81C66 68 75 52 71 39M37 68Q49 58 61 64M52 51Q62 45 70 49"/><path d="M38 96Q58 103 79 96M60 87C62 92 65 96 70 99"/><circle cx="65" cy="20" r="2" fill="${gold}"/></g>`),
    filePath: '/assets/elements/graphics/premium/paisley-pair.svg', defaultColor: gold, tags: ['premium','paisley','mughal','wedding','ornament','mango'],
  },
  {
    id: 'premium-floral-corners', name: 'Floral Corner Flourish', category: 'graphics', subcategory: 'flowers-botanicals',
    svgContent: svg(`<g stroke-width="1.5"><path d="M12 108C15 75 31 54 59 43C68 20 87 11 108 12M17 99C32 95 40 82 41 67M28 91C45 94 57 84 59 68M43 77C41 59 51 47 68 43M58 57C78 58 92 46 94 27M73 41C71 24 83 17 99 19"/><path d="M34 86C18 80 17 68 19 61C31 64 37 73 34 86ZM48 76C35 65 38 54 42 48C52 57 55 66 48 76ZM64 52C57 38 64 28 70 24C77 36 76 45 64 52ZM84 36C82 24 90 17 97 15C101 28 95 35 84 36Z"/><circle cx="20" cy="60" r="2" fill="${gold}"/><circle cx="70" cy="23" r="2" fill="${gold}"/><circle cx="98" cy="15" r="2" fill="${gold}"/></g>`),
    filePath: '/assets/elements/graphics/premium/floral-corners.svg', defaultColor: gold, tags: ['premium','floral','corner','botanical','frame','wedding','border'],
  },
  {
    id: 'premium-diya-pair', name: 'Ceremonial Diya Pair', category: 'graphics', subcategory: 'celebration-festive',
    svgContent: svg(`<g stroke-width="1.7"><path d="M31 72Q60 81 89 72Q84 94 60 96Q36 94 31 72Z"/><path d="M25 70H95M39 98H81"/><path d="M60 62C47 51 54 37 60 25C66 37 73 51 60 62Z" fill="${gold}" fill-opacity=".28"/><path d="M60 53C56 44 60 39 60 35C66 44 64 49 60 53Z" fill="${gold}"/><path d="M35 63C29 54 34 47 37 42C41 50 42 57 35 63ZM85 63C91 54 86 47 83 42C79 50 78 57 85 63Z"/><path d="M18 34L21 40L27 43L21 46L18 52L15 46L9 43L15 40ZM102 34L105 40L111 43L105 46L102 52L99 46L93 43L99 40Z" fill="${gold}" fill-opacity=".5"/></g>`),
    filePath: '/assets/elements/graphics/premium/diya-pair.svg', defaultColor: gold, tags: ['premium','diya','lamp','light','deepak','ceremony','wedding','festive'],
  },
  {
    id: 'premium-kalash', name: 'Kalash with Mango Leaves', category: 'graphics', subcategory: 'celebration-festive',
    svgContent: svg(`<g stroke-width="1.7"><path d="M60 12C54 24 53 29 60 34C67 29 66 24 60 12Z"/><path d="M60 33C42 24 32 15 34 9C46 11 55 20 60 33ZM60 33C78 24 88 15 86 9C74 11 65 20 60 33Z"/><path d="M43 38Q60 29 77 38L73 47Q91 59 81 83Q74 98 60 99Q46 98 39 83Q29 59 47 47Z"/><path d="M41 59Q60 66 79 59M39 81Q60 88 81 81M49 47L45 39M71 47L75 39"/><path d="M52 46V34M68 46V34" stroke-dasharray="2 3"/><path d="M34 57L28 63M86 57L92 63"/></g>`),
    filePath: '/assets/elements/graphics/premium/kalash.svg', defaultColor: gold, tags: ['premium','kalash','mangal','auspicious','wedding','ceremony','pot'],
  },
  {
    id: 'premium-wedding-rings', name: 'Heirloom Wedding Rings', category: 'graphics', subcategory: 'celebration-festive',
    svgContent: svg(`<g stroke-width="2"><ellipse cx="48" cy="67" rx="25" ry="30" transform="rotate(-28 48 67)"/><ellipse cx="72" cy="67" rx="25" ry="30" transform="rotate(28 72 67)"/><path d="M37 35L48 23L59 35L48 48Z" fill="${gold}" fill-opacity=".3"/><path d="M61 35L72 23L83 35L72 48Z" fill="${gold}" fill-opacity=".3"/><path d="M48 23V48M72 23V48M60 15V21M54 18L56 23M66 18L64 23"/><circle cx="60" cy="14" r="2" fill="${gold}"/><path d="M20 101Q60 108 100 101" stroke-dasharray="1 5"/></g>`),
    filePath: '/assets/elements/graphics/premium/wedding-rings.svg', defaultColor: gold, tags: ['premium','rings','engagement','marriage','wedding','love','heirloom'],
  },
  {
    id: 'premium-shehnai', name: 'Shehnai with Rosette', category: 'graphics', subcategory: 'celebration-festive',
    svgContent: svg(`<g stroke-width="1.7"><path d="M27 88L77 38M21 80L33 92M72 32L84 44M77 38L94 21L100 27L84 44M24 83L37 70M36 71L43 78M46 61L53 68M56 51L63 58M66 41L73 48"/><path d="M90 82C90 68 98 62 105 59C102 70 99 77 90 82ZM90 82C76 75 74 66 75 58C86 63 92 71 90 82Z"/><circle cx="91" cy="85" r="3" fill="${gold}"/><path d="M19 96L14 101M29 97L27 105M11 87L4 88" stroke-dasharray="1 3"/></g>`),
    filePath: '/assets/elements/graphics/premium/shehnai.svg', defaultColor: gold, tags: ['premium','shehnai','music','baraat','instrument','wedding','festive'],
  },
  {
    id: 'premium-peacock-feather', name: 'Peacock Feather', category: 'graphics', subcategory: 'flowers-botanicals',
    svgContent: svg(`<g stroke-width="1.6"><path d="M59 111C57 81 54 50 38 20M59 111C66 79 78 54 93 33"/><path d="M39 21C18 17 12 35 22 47C30 57 46 57 53 47C61 36 52 23 39 21Z"/><path d="M39 28C27 26 23 36 29 43C34 49 43 48 47 42C51 36 47 29 39 28Z"/><ellipse cx="39" cy="37" rx="5" ry="7"/><path d="M72 75C62 57 68 42 83 39C98 36 106 51 99 62C93 72 82 73 72 75Z"/><path d="M79 66C73 55 78 47 86 47C94 47 98 55 94 61C91 66 85 67 79 66Z"/><ellipse cx="86" cy="56" rx="4" ry="5"/><path d="M57 107Q53 88 43 72M63 99Q72 82 82 76"/></g>`),
    filePath: '/assets/elements/graphics/premium/peacock-feather.svg', defaultColor: gold, tags: ['premium','peacock','feather','mor','royal','wedding','mughal'],
  },
  {
    id: 'premium-mandap-arch', name: 'Ceremony Mandap Arch', category: 'graphics', subcategory: 'celebration-festive',
    svgContent: svg(`<g stroke-width="1.6"><path d="M19 105V51C19 27 38 14 60 8C82 14 101 27 101 51V105M27 105V52C27 32 43 22 60 17C77 22 93 32 93 52V105M12 105H108M16 97H104"/><path d="M36 105V68M84 105V68M29 53Q60 65 91 53M43 27Q60 40 77 27"/><path d="M50 10L60 2L70 10L60 18Z"/><circle cx="60" cy="52" r="4" fill="${gold}"/><path d="M19 44C11 48 10 58 17 62M101 44C109 48 110 58 103 62M32 35L27 30M88 35L93 30"/></g>`),
    filePath: '/assets/elements/graphics/premium/mandap-arch.svg', defaultColor: gold, tags: ['premium','mandap','arch','wedding','ceremony','palace','jharokha'],
  },
  {
    id: 'premium-floral-wreath', name: 'Rose & Jasmine Wreath', category: 'graphics', subcategory: 'flowers-botanicals',
    svgContent: svg(`<g stroke-width="1.4"><circle cx="60" cy="60" r="43" stroke-dasharray="2 3"/><circle cx="60" cy="60" r="37"/><path d="M31 35C22 28 26 18 35 17C39 7 51 11 51 20C59 23 56 34 48 36C43 43 32 42 31 35ZM89 35C98 28 94 18 85 17C81 7 69 11 69 20C61 23 64 34 72 36C77 43 88 42 89 35ZM31 85C22 92 26 102 35 103C39 113 51 109 51 100C59 97 56 86 48 84C43 77 32 78 31 85ZM89 85C98 92 94 102 85 103C81 113 69 109 69 100C61 97 64 86 72 84C77 77 88 78 89 85Z"/><circle cx="40" cy="28" r="3" fill="${gold}"/><circle cx="80" cy="28" r="3" fill="${gold}"/><circle cx="40" cy="92" r="3" fill="${gold}"/><circle cx="80" cy="92" r="3" fill="${gold}"/><path d="M55 60Q60 54 65 60Q60 67 55 60Z" fill="${gold}" fill-opacity=".35"/></g>`),
    filePath: '/assets/elements/graphics/premium/floral-wreath.svg', defaultColor: gold, tags: ['premium','wreath','rose','jasmine','floral','frame','wedding'],
  },
  {
    id: 'premium-dhol-pair', name: 'Sangeet Dhol Pair', category: 'graphics', subcategory: 'celebration-festive',
    svgContent: svg(`<g stroke-width="1.8"><path d="M24 36Q42 25 59 36V81Q42 92 24 81ZM24 36Q15 56 24 81M59 36Q68 56 59 81M19 45L64 73M19 58L64 45M19 72L64 58"/><path d="M61 31Q78 21 96 32V77Q78 88 61 77ZM61 31Q52 54 61 77M96 32Q105 54 96 77M56 41L101 69M56 55L101 41M56 68L101 55"/><path d="M18 27L13 19M8 31L4 23M69 93L64 102M102 89L108 98" stroke-linecap="round"/><circle cx="42" cy="58" r="4" fill="${gold}" fill-opacity=".45"/><circle cx="79" cy="54" r="4" fill="${gold}" fill-opacity=".45"/></g>`),
    filePath: '/assets/elements/graphics/premium/dhol-pair.svg', defaultColor: gold, tags: ['premium','dhol','dholak','sangeet','music','celebration','wedding'],
  },
  {
    id: 'premium-royal-seal', name: 'Wax Seal Monogram Frame', category: 'graphics', subcategory: 'stickers-badges',
    svgContent: svg(`<g stroke-width="1.5"><path d="M60 10L69 17L81 15L86 26L98 32L94 44L102 55L94 65L97 78L84 83L79 96L66 94L56 103L46 94L33 97L28 84L15 79L17 66L8 56L16 45L13 32L26 27L31 15L44 18L54 10Z"/><circle cx="56" cy="56" r="35"/><circle cx="56" cy="56" r="29" stroke-dasharray="1 4"/><path d="M43 68C43 48 49 39 57 39C65 39 70 47 70 68M47 57H67M40 74H74"/><circle cx="56" cy="27" r="2" fill="${gold}"/><circle cx="56" cy="85" r="2" fill="${gold}"/></g>`),
    filePath: '/assets/elements/graphics/premium/royal-seal.svg', defaultColor: gold, tags: ['premium','wax seal','monogram','badge','crest','royal','wedding'],
  },
  {
    id: 'premium-floral-divider', name: 'Jasmine Floral Divider', category: 'graphics', subcategory: 'arrows-doodles',
    svgContent: svg(`<g stroke-width="1.5"><path d="M7 60H43M77 60H113M43 60Q60 32 77 60Q60 88 43 60Z"/><path d="M15 51C9 43 15 37 22 39C26 32 35 36 33 44C37 50 30 56 24 53M105 51C111 43 105 37 98 39C94 32 85 36 87 44C83 50 90 56 96 53Z"/><circle cx="23" cy="45" r="2" fill="${gold}"/><circle cx="97" cy="45" r="2" fill="${gold}"/><path d="M52 60Q60 53 68 60Q60 67 52 60ZM60 44V76M9 60L15 56M9 60L15 64M111 60L105 56M111 60L105 64"/></g>`),
    filePath: '/assets/elements/graphics/premium/floral-divider.svg', defaultColor: gold, tags: ['premium','divider','jasmine','floral','wedding','ornament','rule'],
  },
  {
    id: 'premium-rose-bouquet', name: 'Rose & Leaf Bouquet', category: 'graphics', subcategory: 'flowers-botanicals',
    svgContent: svg(`<g stroke-width="1.5"><path d="M58 53L49 105M62 53L75 105M58 66L35 103M62 68L91 101"/><path d="M48 50C37 40 44 28 55 30C62 21 74 28 70 39C74 49 63 57 55 53ZM86 50C97 40 90 28 79 30C72 21 60 28 64 39C60 49 71 57 79 53Z"/><path d="M55 37C49 32 47 39 53 43C56 46 60 42 55 37ZM79 37C85 32 87 39 81 43C78 46 74 42 79 37Z" fill="${gold}" fill-opacity=".3"/><path d="M54 71C35 58 26 67 31 78C41 82 48 79 54 71ZM67 78C85 63 96 71 92 82C83 88 74 84 67 78ZM56 89C44 78 35 85 39 94C45 98 51 95 56 89ZM70 91C79 80 88 85 84 95C79 98 74 96 70 91Z"/><path d="M42 104Q62 110 82 104"/></g>`),
    filePath: '/assets/elements/graphics/premium/rose-bouquet.svg', defaultColor: gold, tags: ['premium','rose','bouquet','floral','bride','wedding','botanical'],
  },
];
