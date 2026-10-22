import type { CardTemplate, FrameElement, ImageElement, TextElement } from '../types/editor';
import { FRAMES_LIBRARY_ITEMS } from './elements/framesGridsManifest';
import { ensureTextContrast } from '../utils/colorContrast';

type SquareCategory = 'wedding' | 'housewarming' | 'sangeet-mehendi' | 'birthday' | 'baby-shower' | 'anniversary' | 'gold-velvet';
type Palette = { background: string; shade: string; paper: string; gold: string; ink: string; soft: string };
type CategoryDesigns = {
  category: SquareCategory;
  label: string;
  names: string[];
  intro: string;
  event: string;
  hosts: string;
  photos: string[];
  motif: string;
  palettes: Palette[];
};

const theme = (background: string, shade: string, paper: string, gold: string, ink: string, soft: string): Palette => ({ background, shade, paper, gold, ink, soft });

const weddingPalettes = [
  theme('#4A1020','#17070D','#FFF7EA','#D9B665','#542A32','#A16D62'), theme('#123C35','#071B19','#F8F4E8','#D2B66D','#294A3E','#728B71'),
  theme('#172647','#080F20','#F8F1E4','#D9BC70','#293B5C','#7887A5'), theme('#612B35','#220D15','#FFF2E9','#E3BD76','#61323C','#AD7376'),
  theme('#49304D','#190D20','#FCF3E8','#D6B46E','#503853','#92708C'), theme('#6A3821','#24120C','#FFF3DB','#E6BD61','#633E27','#B9844C'),
  theme('#1C5149','#09231F','#F2F5E9','#D7C27A','#31594C','#789C86'), theme('#6B304C','#260F1B','#FFF2EE','#E5C07A','#68374D','#B47A90'),
  theme('#29354D','#101724','#F8F4EB','#D4B768','#344253','#8892A1'), theme('#764B32','#28170E','#FFF6E7','#D9AC5C','#6A4A31','#B68A65'),
  theme('#45352A','#17120F','#F7F0E2','#E2C77E','#4E4034','#A28D68'), theme('#23434D','#0C1C22','#F2F1E8','#D1B36C','#334D56','#7A9695'),
  theme('#542631','#1D0B12','#FFF3E5','#E3C478','#5D3038','#A56C6E'), theme('#4C3D66','#1B1429','#F7F0E8','#D6BD7C','#524664','#9386A0'),
  theme('#193C2B','#09190F','#F5F1DF','#D5BD70','#2C4B37','#778A68'),
];
const grihaPalettes = [
  theme('#315B45','#10271D','#FFF7E7','#D8B75D','#38513E','#87915D'), theme('#7C4725','#2A170D','#FFF5E2','#E4BB55','#6E482D','#B18A4C'),
  theme('#23555A','#0C2528','#F5F4E8','#D7C070','#315455','#7AA29A'), theme('#584672','#1C1530','#FBF3E7','#D7BA70','#55466B','#9B8AAB'),
  theme('#6C352D','#25100D','#FFF5E5','#E4C06A','#643B30','#B5765E'), theme('#35513C','#142319','#F4F3E2','#D6B45F','#415542','#80926C'),
  theme('#804B35','#2D180F','#FFF4DF','#E7C46C','#6E4934','#BA8B5D'), theme('#31586C','#102332','#F0F5F3','#D4B46C','#3C5669','#7896A0'),
  theme('#5D5540','#1F1D15','#F7F0E0','#D9BC6B','#5A523D','#9C916B'), theme('#693C59','#251227','#FCF2E7','#E1BF72','#633D5B','#AA7E9B'),
  theme('#335C52','#0E2823','#F5F3E5','#D9BE71','#355A4E','#83A18A'), theme('#754A27','#28170C','#FFF4E0','#E7C466','#6A492A','#B88C4C'),
  theme('#34455C','#111B2A','#F4F3E9','#D4B76C','#3E4A5A','#8492A2'), theme('#754039','#291211','#FFF0E4','#E4C075','#704139','#B77E70'),
  theme('#476146','#182619','#F5F3E4','#D7BD6C','#485B43','#8E9A70'),
];
const sangeetPalettes = [
  theme('#82304B','#2B1020','#FFF2DE','#F0C75E','#71384B','#D4938D'), theme('#18574D','#09241F','#F8F2D9','#E4C34D','#27574A','#96B97A'),
  theme('#9A5522','#35180E','#FFF0D7','#F4CA52','#7E481F','#D38D4E'), theme('#56336D','#1B1030','#FFF0E8','#F3C55E','#583D67','#C08DBD'),
  theme('#A62E4D','#3B1020','#FFF1E1','#F7D15B','#8F3450','#D68498'), theme('#17616B','#08282E','#EEF6EF','#E7C85D','#315D64','#86BEC0'),
  theme('#734334','#25120D','#FFF0DA','#ECC354','#704532','#C28B59'), theme('#55436F','#1C1531','#FFF1E3','#EBC968','#59496B','#B399D0'),
  theme('#A24931','#32140F','#FFF4DF','#EEC54D','#88452F','#D69A6C'), theme('#284E76','#101F39','#F5F1E9','#F1C45B','#3C5273','#90A9C9'),
  theme('#7D2852','#290D24','#FFF2E5','#EFC85A','#793859','#C77A9D'), theme('#23604C','#0D261E','#F4F2DC','#E7C450','#315947','#8FB879'),
  theme('#B35321','#3B170C','#FFF2DA','#F4C441','#8C4A22','#D99247'), theme('#5B3556','#1E1026','#F9F0E5','#E8C15B','#613B5A','#A987AA'),
  theme('#315B61','#11282D','#F4F1E5','#E9C566','#385C5E','#8AB1A5'),
];
const birthdayPalettes = [
  theme('#49335F','#1B122B','#FFF4E9','#F0CE75','#51405F','#A788B5'), theme('#8A3D58','#2E1220','#FFF3E5','#EAC165','#7B3D54','#D08BA1'),
  theme('#21626A','#0C292F','#F4FAF3','#F1CF62','#315A62','#8DC3C2'), theme('#344D82','#101D42','#F5F3FF','#F3CC69','#3C5076','#93A9D7'),
  theme('#A9583C','#34180F','#FFF3E2','#F3C55D','#8A4B39','#D79172'), theme('#71523B','#241A12','#FFF5E4','#E7C06B','#70533C','#BC9B64'),
  theme('#623F75','#241231','#FFF3EB','#EDC86A','#614474','#B798CB'), theme('#39705B','#132B21','#F5F5E5','#EBC75B','#3F6853','#95B88A'),
  theme('#9B6A2F','#331C0D','#FFF6E6','#F2CA5A','#79572F','#D1A95F'), theme('#914656','#31131E','#FFF3E9','#ECC46B','#864858','#D18F98'),
  theme('#365B7C','#111F31','#F2F6F7','#E9C761','#3F5A70','#86A8C3'), theme('#78517A','#25152E','#FFF2EA','#E8C16A','#705074','#B894B5'),
  theme('#246256','#0A2821','#F5F5E8','#E9C85D','#315E50','#8BB8A0'), theme('#A94D39','#3B170F','#FFF2E0','#F2C461','#8E4938','#D88869'),
  theme('#53445F','#1B1724','#F7F0E5','#E7C66C','#55475E','#A494A8'),
];
const babyPalettes = [
  theme('#806078','#2A1A2B','#FFF4F0','#E8C995','#704D69','#C49DB7'), theme('#4E7168','#182D29','#F6F5E9','#DCC394','#4D6960','#9BBBA8'),
  theme('#78628C','#281B38','#FBF5FC','#E6C7A2','#6D5A7B','#B7A0CA'), theme('#A35D73','#351923','#FFF4F2','#E9C38D','#8C5267','#D29AAA'),
  theme('#5F7A8A','#1B2D37','#F4F8F7','#D9C29D','#566F7B','#A1C0C8'), theme('#9A7158','#342219','#FFF5E8','#E5C793','#89694E','#C7A184'),
  theme('#597A66','#1B3023','#F5F4E7','#DCC48F','#536F5E','#A9BE9C'), theme('#8D718A','#302034','#FBF3FA','#E7C89D','#80677E','#C2A7BD'),
  theme('#A86F63','#351F1C','#FFF4EC','#E8C795','#946259','#D5A69B'), theme('#6A718F','#20243B','#F6F4F8','#E7CBA0','#636B86','#A9B4D1'),
  theme('#547A77','#172F2E','#F2F7F2','#D9C396','#4D6D68','#9EBAB2'), theme('#AC7952','#382416','#FFF6E9','#EACB93','#906848','#D0A880'),
  theme('#735D4E','#292019','#F8F2E8','#E4C78F','#6C5949','#B8A28A'), theme('#8A5964','#321B22','#FFF4EF','#E9C99E','#80535D','#C999A1'),
  theme('#64745C','#23291D','#F5F4E9','#DFCA9C','#606D55','#ACB69A'),
];
const anniversaryPalettes = [
  theme('#69303B','#230D14','#FFF3E6','#E3C47A','#68363F','#B98783'), theme('#1D5045','#09221D','#F5F1E1','#D6BC72','#315447','#81A18C'),
  theme('#293959','#10192B','#F7F2E7','#D7BD77','#38465E','#8391A8'), theme('#694659','#28121D','#FFF2EA','#DDBF83','#69465C','#B685A2'),
  theme('#73522C','#2B1B0F','#FFF4E1','#E8C46F','#725333','#BE9B5C'), theme('#4D3C68','#1B1428','#F8F2E8','#D7C17D','#544567','#9184A7'),
  theme('#3F5B50','#14231C','#F4F1E4','#D3B778','#3E5B4E','#819B86'), theme('#793B32','#29120F','#FFF3E5','#E4BD71','#713D33','#B97A65'),
  theme('#31545D','#101F25','#F6F1E7','#D7BE78','#3A5660','#819DA0'), theme('#794856','#2D121C','#FFF2EA','#E7C67C','#714650','#BD8591'),
  theme('#574A3B','#201A13','#F8F1E2','#DEC47C','#5C4C3B','#A69877'), theme('#35496B','#111C31','#F3F3EE','#D8BF7A','#3E4E6A','#8A9DB5'),
  theme('#6A523C','#26190F','#FFF4E5','#E7C47A','#6C523D','#B4956D'), theme('#254D3C','#0C2018','#F6F1E1','#D5BB73','#345341','#78937C'),
  theme('#6C364C','#26111D','#FFF2E9','#E1C078','#693C4E','#B87E91'),
];
const velvetPalettes = [
  theme('#510D1D','#20050C','#FFF2D2','#F1D17A','#FFF0C3','#C89C52'), theme('#76151C','#31070C','#FFF0D0','#F4D47A','#FFECC0','#DBA34D'),
  theme('#3E0A18','#18040B','#FFF4D8','#E6C66D','#F7EAC4','#B58B48'), theme('#671021','#26050B','#FFF0D0','#F6D77C','#FFF0CB','#C98B56'),
  theme('#4A1029','#1C0611','#FFF2D7','#E8C674','#F7E7C1','#C49B61'), theme('#7B1018','#38070D','#FFF1D2','#F1CA5F','#FFE9B0','#D89149'),
  theme('#390B16','#15040A','#FFF3DC','#EBC86F','#F7E8C7','#AA7B42'), theme('#63131A','#26060A','#FFF4D7','#F2D076','#F5E8C5','#C88D4D'),
  theme('#521327','#1D0610','#FFF1D2','#E6C275','#F8EACB','#B88650'), theme('#80151A','#36070B','#FFF4D9','#F2CB69','#FFE9C2','#D89950'),
  theme('#420A19','#18040B','#FFF0D2','#E5C56C','#F8E9C1','#B48345'), theme('#70111C','#2B060C','#FFF3D9','#EFCE70','#F7E7C2','#C1914E'),
  theme('#4C0D17','#1A0408','#FFF4DA','#E9C973','#F8E9C5','#BD8C49'), theme('#74121E','#30060B','#FFF2D6','#F3D17A','#F8E9C5','#D19950'),
  theme('#350811','#130308','#FFF3D8','#E9C779','#F5E8C4','#AF8149'),
];

const categories: CategoryDesigns[] = [
  {
    category: 'wedding', label: 'Shubh Vivah', names: ['Ivory Jharokha Vows','Mughal Garden Promise','Rosewater Mandap','Peacock Courtyard','Saffron Heirloom','Moonlit Pheras','Lotus Palace Union','The Kundan Vows','Jade Garden Wedding','Velvet Shehnai Night','Champagne Jharokha','Ruby Rajwada Vows','The Mogra Ceremony','Golden Hour Pheras','Pichwai Wedding Story'],
    intro: 'TOGETHER WITH OUR FAMILIES', event: 'THE WEDDING CELEBRATION', hosts: 'Aarav & Meera', motif: 'mandap', photos: ['wedding-jharokha-sunrise-01.webp','wedding-palace-stairs-02.webp','wedding-lotus-pond-03.webp','wedding-mandap-vows-04.webp','wedding-coastal-ceremony-05.webp'], palettes: weddingPalettes,
  },
  {
    category: 'housewarming', label: 'Griha Pravesh', names: ['Aangan of Light','The First Diya','Mango Toran Welcome','Vastu Garden Blessing','Sacred Threshold','Lotus Doorway','Shubh Aangan','Mogra at Home','The New Home Story','Kalash & Courtyard','Sunlit Griha','Tulsi Blessings','Rangoli Welcome','The Ivory Haveli','Auspicious Beginnings'],
    intro: 'WITH THE BLESSINGS OF OUR ELDERS', event: 'GRIHA PRAVESH & PUJA', hosts: 'The Sharma Family', motif: 'kalash', photos: ['home-diya-entry-01.webp','home-courtyard-kalash-02.webp','home-first-breakfast-03.webp','home-balcony-garden-04.webp','home-vastu-puja-05.webp'], palettes: grihaPalettes,
  },
  {
    category: 'sangeet-mehendi', label: 'Sangeet & Haldi', names: ['Marigold Mehfil','Rang Raas Night','Dhol & Dandiya','Saffron Beats','Mogra Music Soirée','Henna Garden Party','Genda Phool Glow','The Golden Dhol','Mehendi Afterglow','Rang Barse Celebration','Sunset Sangeet','Haldi in Bloom','The Courtyard Jashn','Neon Raas Royale','Sitar & Shimmer'],
    intro: 'A NIGHT OF MUSIC & CELEBRATION', event: 'SANGEET & HALDI', hosts: 'Aarav & Meera', motif: 'dhol', photos: ['sangeet-garden-dance-01.webp','sangeet-mirror-mehendi-02.webp','sangeet-dhol-courtyard-03.webp','sangeet-haldi-sunlight-04.webp','sangeet-raas-terrace-05.webp'], palettes: sangeetPalettes,
  },
  {
    category: 'birthday', label: 'Birthday Celebration', names: ['Little Star Gala','Golden Balloon Brunch','Confetti & Cake','A Year in Bloom','The Birthday Atelier','Moonlight Candles','Pastel Party Club','Royal Birthday Soirée','Wildflower Wishes','Sparkle & Sprinkles','The Grand Birthday','Daisy Garden Party','Midnight Celebration','Pearl Balloon Story','A Wish in Gold'],
    intro: 'COME CELEBRATE A VERY SPECIAL DAY', event: 'BIRTHDAY CELEBRATION', hosts: 'Aarav Turns One', motif: 'cake', photos: ['birthday-garden-brunch-01.webp','birthday-carnival-02.webp','birthday-cake-candles-03.webp','birthday-poolside-party-04.webp','birthday-studio-confetti-05.webp'], palettes: birthdayPalettes,
  },
  {
    category: 'baby-shower', label: 'Godh Bharai', names: ['Little Moon Blessing','Peach Petal Godh Bharai','Maa & Mogra','The Nesting Soirée','A Little Bloom','Cloud Nine Blessings','Blush Lotus Gathering','Cradle & Chandni','Tiny Toes Celebration','The Golden Cradle','Pastel Peacock Blessing','A New Little Light','Garden of Beginnings','Sweet Pea Celebration','Moonstone Naamkaran'],
    intro: 'WITH JOYFUL HEARTS & LOVING BLESSINGS', event: 'GODH BHARAI CELEBRATION', hosts: 'A Little One Is on the Way', motif: 'cradle', photos: ['godh-bloom-portrait-01.webp','godh-cradle-blessings-02.webp','godh-moon-mogra-03.webp','godh-peach-petal-04.webp','godh-little-light-05.webp'], palettes: babyPalettes,
  },
  {
    category: 'anniversary', label: 'Royal Anniversary', names: ['Pearl & Petals','A Lifetime in Light','Ruby Rose Evening','Golden Years Together','Still in Bloom','The Silver Chapter','Champagne & Memories','Jade Jubilee','Forever in Jaipur','The Heirloom Dance','Sapphire Years','A Love in Bloom','Velvet Anniversary','Timeless Together','The Pearl Soirée'],
    intro: 'A BEAUTIFUL STORY, STILL BEING WRITTEN', event: 'ANNIVERSARY CELEBRATION', hosts: 'Vikram & Ananya', motif: 'rings', photos: ['anniversary-pearl-petals-01.webp','anniversary-lifetime-light-02.webp','anniversary-ruby-album-03.webp','anniversary-golden-vows-04.webp','anniversary-still-us-05.webp'], palettes: anniversaryPalettes,
  },
  {
    category: 'gold-velvet', label: '24K Gold Foil & Velvet', names: ['Oxblood Mughal Jharokha','Ruby Deco Heirloom','Burgundy Lotus Soirée','Vermilion Toran','Garnet Palace Vows','Crimson Kundan Night','Maroon Peacock Darbar','The Scarlet Sheesh Mahal','Velvet Rose Jashn','Heirloom in Gold','Rajwada Crimson','The Golden Arch','Mughal Velvet Garden','Ruby Mandap Royale','Noor of the Durbar'],
    intro: 'A ROYAL CELEBRATION', event: 'A NIGHT TO REMEMBER', hosts: 'Aarav & Meera', motif: 'peacock', photos: ['wedding-sunset-terrace-10.webp','wedding-night-terrace-08.webp','wedding-mehendi-portrait-06.webp','wedding-ivory-studio-07.webp','wedding-floral-garden-09.webp'], palettes: velvetPalettes,
  },
];

const photoLayouts = [2, 5, 8, 11, 14];
const frameIds = ['frame-01', 'frame-05', 'frame-12', 'frame-14', 'frame-19'];
const photoSlots = [
  [{ x: 154, y: 78, width: 292, height: 190 }],
  [{ x: 62, y: 144, width: 222, height: 300 }],
  [{ x: 190, y: 92, width: 220, height: 220 }],
  [{ x: 66, y: 108, width: 202, height: 174 }, { x: 332, y: 108, width: 202, height: 174 }],
  [{ x: 184, y: 64, width: 232, height: 236 }],
];
const motifMarkup: Record<string, string> = {
  mandap: '<path d="M0 90V42Q0 8 50 0q50 8 50 42v48M12 90V44Q12 22 50 14q38 8 38 30v46M20 90v-24m60 24V66M50 0v-12"/><path d="M5 55h14m62 0h14"/>',
  kalash: '<path d="M50 8c-12 17-11 26 0 31 11-5 12-14 0-31Zm-26 34h52M31 42c2 18 8 34 19 44 11-10 17-26 19-44m-34 15h30m-28 14h26M18 36c-10-13-10-23-6-31 13 4 22 14 25 28m20 0c3-14 12-24 25-28 4 8 4 18-6 31"/>',
  dhol: '<path d="M27 25h46l15 15v30L73 85H27L12 70V40l15-15Zm0 0v60m46-60v60M12 40l76 30M12 70l76-30M25 15 8 5m67 10 17-10"/>',
  cake: '<path d="M16 54h68v34H16zM24 38h52v16H24zM50 38V20m0 0c-10-13-2-22 0-28 3 6 10 15 0 28Zm-20 0V27m0 0c-8-10-2-16 0-21 2 5 8 11 0 21Zm40 0V27m0 0c-8-10-2-16 0-21 2 5 8 11 0 21Z"/><path d="M16 68q9-9 17 0t17 0 17 0 17 0"/>',
  cradle: '<path d="M18 47h64l-7 28H25l-7-28Zm8 28v13m48-13v13M24 47c5-19 16-29 26-29s21 10 26 29M50 18V7m-9 10c-8-7-8-14-5-20 8 3 13 8 13 16m10 4c8-7 8-14 5-20-8 3-13 8-13 16"/>',
  rings: '<circle cx="39" cy="50" r="24"/><circle cx="61" cy="50" r="24"/><path d="m50 19 5 7-5 7-5-7 5-7Zm-34 65h68"/>',
  peacock: '<path d="M50 15c12 12 17 27 14 42-2 11-8 19-14 25-6-6-12-14-14-25-3-15 2-30 14-42Zm0 0c-8 7-18 11-29 10 4 11 13 18 26 21m3-31c8 7 18 11 29 10-4 11-13 18-26 21M50 82v14m-12 0h24"/><circle cx="50" cy="44" r="4"/>',
};

const squareSvg = (palette: Palette, motif: string, variant: number) => {
  const patternId = `sq-pattern-${variant}`;
  const light = variant % 3 === 0 ? palette.soft : palette.gold;
  const frame = variant % 5;
  const border = frame === 0
    ? '<rect x="20" y="20" width="560" height="560" rx="28"/><rect x="30" y="30" width="540" height="540" rx="22" stroke-dasharray="2 7"/>'
    : frame === 1
      ? '<path d="M48 120V48h135m234 0h135v72M48 480v72h135m234 0h135v-72"/><path d="M65 128V65h110m240 0h110v63M65 472v63h110m240 0h110v-63"/>'
      : frame === 2
        ? '<rect x="24" y="24" width="552" height="552" rx="276"/><rect x="36" y="36" width="528" height="528" rx="264" stroke-dasharray="3 8"/>'
        : frame === 3
          ? '<path d="M34 90Q34 34 90 34h420q56 0 56 56v420q0 56-56 56H90q-56 0-56-56Z"/><path d="M49 101q0-37 37-37h428q37 0 37 37v398q0 37-37 37H86q-37 0-37-37Z"/>'
          : '<path d="M42 42h516v516H42zM58 58h484v484H58z"/><path d="M42 160q58 0 58-58m400 0q0 58 58 58M42 440q58 0 58 58m400 0q0-58 58-58"/>';
  const ornament = frame === 2
    ? '<circle cx="300" cy="300" r="206"/><circle cx="300" cy="300" r="190" stroke-dasharray="1 8"/>'
    : `<path d="M62 174q38-72 110-110M538 174q-38-72-110-110M62 426q38 72 110 110M538 426q-38 72-110 110"/><path d="M90 180q42-58 88-82m332 82q-42-58-88-82M90 420q42 58 88 82m332-82q-42 58-88 82"/>`;
  const stars = Array.from({ length: 12 }, (_, i) => {
    const x = 92 + ((i * 173 + variant * 37) % 416);
    const y = 72 + ((i * 127 + variant * 61) % 456);
    const radius = i % 3 === 0 ? 3 : 1.8;
    return `<circle cx="${x}" cy="${y}" r="${radius}"/>`;
  }).join('');
  const embellishment = [
    '<path d="M300 34v82m-24-58h48M300 484v82m-24-58h48"/><circle cx="300" cy="42" r="7"/><circle cx="300" cy="558" r="7"/>',
    '<path d="M82 300h64m308 0h64M300 82v64m0 308v64"/><path d="m300 70 9 18-9 18-9-18 9-18Zm0 416 9 18-9 18-9-18 9-18Z"/>',
    '<path d="M80 220q40-46 80 0t80 0m200 0q40-46 80 0M80 380q40 46 80 0t80 0m200 0q40 46 80 0"/>',
    '<path d="M88 104v392m424-392v392" stroke-dasharray="1 8"/><circle cx="88" cy="88" r="8"/><circle cx="512" cy="88" r="8"/><circle cx="88" cy="512" r="8"/><circle cx="512" cy="512" r="8"/>',
    '<path d="M300 72c-18 20-18 36 0 50 18-14 18-30 0-50Zm-31 30h62m-31 318c-18 20-18 36 0 50 18-14 18-30 0-50Zm-31 30h62"/>',
    '<path d="M80 118h150M370 118h150M80 482h150m140 0h150"/><circle cx="300" cy="118" r="4"/><circle cx="300" cy="482" r="4"/>',
    '<path d="M150 300h70m160 0h70M300 150v70m0 160v70"/><circle cx="300" cy="300" r="168" stroke-dasharray="2 10"/>',
  ][variant % 7];
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><defs><linearGradient id="sq-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${palette.background}"/><stop offset=".54" stop-color="${palette.shade}"/><stop offset="1" stop-color="${palette.background}"/></linearGradient><radialGradient id="sq-glow"><stop stop-color="${light}" stop-opacity=".22"/><stop offset="1" stop-color="${light}" stop-opacity="0"/></radialGradient><pattern id="${patternId}" width="17" height="17" patternUnits="userSpaceOnUse"><path d="M0 8.5h17M8.5 0v17" stroke="${palette.gold}" stroke-opacity=".055" stroke-width=".5"/><circle cx="8.5" cy="8.5" r="1" fill="${palette.gold}" fill-opacity=".14"/></pattern></defs><rect width="600" height="600" fill="url(#sq-bg)"/><rect width="600" height="600" fill="url(#sq-glow)"/><rect width="600" height="600" fill="url(#${patternId})"/><g fill="none" stroke="${palette.gold}" stroke-width="1.4" opacity=".85">${border}${ornament}${embellishment}</g><g fill="none" stroke="${palette.gold}" stroke-width="1.1" opacity=".68" transform="translate(252 100) scale(.48)">${motifMarkup[motif]}</g><g fill="${palette.gold}" opacity=".8">${stars}</g><g fill="none" stroke="${palette.paper}" stroke-opacity=".12"><path d="M52 300h76m344 0h76"/><circle cx="300" cy="300" r="245"/></g></svg>`)}`;
};

function textLayer(id: string, text: string, x: number, y: number, width: number, height: number, size: number, color: string, font: string, weight: TextElement['fontWeight'] = 'normal', spacing = 0, align: TextElement['textAlign'] = 'center'): TextElement {
  return { id, type: 'text', text, fontFamily: font, fontSize: size, color, fontWeight: weight, fontStyle: 'normal', textAlign: align, letterSpacing: spacing, lineHeight: 1.16, x, y, width, height, rotation: 0, opacity: 1, zIndex: 7 };
}

const photoIntro = (category: SquareCategory) => category === 'wedding' || category === 'gold-velvet' ? 'A MOMENT TO TREASURE' : category === 'housewarming' ? 'A NEW HOME, A NEW BEGINNING' : category === 'sangeet-mehendi' ? 'MEMORIES IN THE MAKING' : category === 'birthday' ? 'A DAY FULL OF JOY' : category === 'baby-shower' ? 'A LITTLE ONE, SO MUCH LOVE' : 'A BEAUTIFUL LIFE TOGETHER';
const frameIdsByCategory: Record<SquareCategory, string[]> = {
  wedding: ['frame-01','frame-02','frame-05','frame-12','frame-14'],
  housewarming: ['frame-02','frame-16','frame-17','frame-05','frame-19'],
  'sangeet-mehendi': ['frame-11','frame-06','frame-13','frame-15','frame-20'],
  birthday: ['frame-10','frame-04','frame-11','frame-20','frame-12'],
  'baby-shower': ['frame-05','frame-15','frame-03','frame-17','frame-18'],
  anniversary: ['frame-05','frame-04','frame-09','frame-14','frame-18'],
  'gold-velvet': ['frame-01','frame-14','frame-12','frame-19','frame-05'],
};

function makeSquareTemplate(collection: CategoryDesigns, index: number): CardTemplate {
  const name = collection.names[index];
  const id = `square-${collection.category}-${String(index + 1).padStart(2, '0')}`;
  const palette = collection.palettes[index];
  const isPhotoTemplate = photoLayouts.includes(index);
  const photoLayoutIndex = photoLayouts.indexOf(index);
  const background: ImageElement = {
    id: `${id}-artwork`, type: 'image', src: squareSvg(palette, collection.motif, index + Object.keys(frameIdsByCategory).indexOf(collection.category) * 15),
    alt: `${name} original square invitation artwork with decorative border`, mask: 'none', x: 0, y: 0, width: 600, height: 600,
    rotation: 0, opacity: 1, zIndex: 1, objectFit: 'cover', locked: true,
  };
  const elements: CardTemplate['pages'][number]['elements'] = [background];

  if (isPhotoTemplate) {
    const frameId = frameIdsByCategory[collection.category][photoLayoutIndex];
    const frameDefinition = FRAMES_LIBRARY_ITEMS.find((frame) => frame.id === frameId) || FRAMES_LIBRARY_ITEMS[0];
    const slots = photoSlots[photoLayoutIndex];
    slots.forEach((slot, slotIndex) => {
      const photoName = collection.photos[(photoLayoutIndex + slotIndex) % collection.photos.length];
      const frame: FrameElement = {
        id: `${id}-photo-${slotIndex + 1}`, type: 'frame', frameId: frameDefinition.id, frameName: frameDefinition.name,
        clipPathSvg: frameDefinition.clipPathSvg, borderSvg: frameDefinition.borderSvg,
        imageSrc: `/images/photo-library/${photoName}`, imageScale: 1, imageOffsetX: 0, imageOffsetY: 0, naturalImageFit: true,
        borderColor: palette.gold, borderWidth: 2.4, placeholderColor: palette.paper,
        x: slot.x, y: slot.y, width: slot.width, height: slot.height, rotation: photoLayoutIndex === 1 && slotIndex === 0 ? -2 : 0, opacity: 1, zIndex: 4 + slotIndex,
      };
      elements.push(frame);
    });
  }

  const ink = ensureTextContrast(palette.ink, palette.background);
  const gold = ensureTextContrast(palette.gold, palette.background);
  const editorialAlign: TextElement['textAlign'] = !isPhotoTemplate && (index % 5 === 1 || index % 5 === 3) ? 'left' : 'center';
  const textX = isPhotoTemplate && photoLayoutIndex === 1 ? 310 : editorialAlign === 'left' ? 76 : 52;
  const textWidth = isPhotoTemplate && photoLayoutIndex === 1 ? 238 : editorialAlign === 'left' ? 448 : 496;
  const layout = isPhotoTemplate ? photoLayoutIndex : index % 5;
  const top = isPhotoTemplate
    ? [294, 104, 326, 304, 316][photoLayoutIndex]
    : [122, 118, 126, 124, 132][layout];
  const titleY = isPhotoTemplate
    ? [top + 42, 191, 362, 334, 344][photoLayoutIndex]
    : [top + 42, top + 56, top + 40, top + 50, top + 36][layout];
  const detailsY = isPhotoTemplate
    ? [top + 146, 342, 464, 438, 446][photoLayoutIndex]
    : [titleY + 132, titleY + 126, titleY + 132, titleY + 126, titleY + 134][layout];
  const compact = isPhotoTemplate && photoLayoutIndex === 1;
  const displayEvent = collection.category === 'gold-velvet' ? 'THE ROYAL CELEBRATION' : collection.event;
  const titleFonts = ["'Cormorant Garamond', serif", "'Playfair Display', serif", "'Cinzel', serif", "'Great Vibes', cursive", "'Bodoni Moda', serif"];
  const titleSize = compact ? 28 : [42, 38, 40, 44, 40][layout];
  const lineAlign = compact ? 'center' : isPhotoTemplate ? 'center' : editorialAlign;

  elements.push(
    textLayer(`${id}-intro`, isPhotoTemplate ? photoIntro(collection.category) : collection.intro, textX, top, textWidth, 22, compact ? 8 : 10, gold, "'Montserrat', sans-serif", '600', compact ? 1 : 1.5, lineAlign),
    textLayer(`${id}-names`, collection.hosts, textX, titleY, textWidth, compact ? 54 : 62, titleSize, ink, compact ? "'Great Vibes', cursive" : titleFonts[layout], '600', 0, lineAlign),
    textLayer(`${id}-event`, displayEvent, textX, titleY + (compact ? 61 : 70), textWidth, 25, compact ? 9 : 12, gold, "'Cinzel', serif", '700', compact ? .8 : 1.6, lineAlign),
    textLayer(`${id}-date`, 'SATURDAY  ·  7:30 PM', textX, detailsY, textWidth, 24, compact ? 9 : 11, ink, "'Montserrat', sans-serif", '600', .7, lineAlign),
    textLayer(`${id}-venue`, 'THE ROYAL COURTYARD  ·  JAIPUR', textX, detailsY + 31, textWidth, 22, compact ? 7 : 9, gold, "'Cinzel', serif", '600', compact ? .4 : 1, lineAlign),
    textLayer(`${id}-closing`, 'With love, we look forward to celebrating with you', 58, 554, 484, 24, 12, ink, "'Cormorant Garamond', serif", '500'),
  );

  const frameTag = isPhotoTemplate ? ['Photo Frame', 'Editable Photo', 'Natural Photo Fit'] : ['Ornamental Artwork', 'Editable Text'];
  return {
    id, title: `${name} · ${collection.label} Square Invitation`, category: collection.category,
    aspectRatio: 'square', tags: [collection.label, '1:1 Square', ...frameTag, name],
    thumbnailGradient: ({ wedding: 'from-rose-950 via-red-950 to-amber-800', housewarming: 'from-emerald-950 via-teal-950 to-amber-700', 'sangeet-mehendi': 'from-fuchsia-950 via-rose-900 to-amber-600', birthday: 'from-violet-950 via-fuchsia-900 to-amber-500', 'baby-shower': 'from-rose-100 via-pink-200 to-amber-200', anniversary: 'from-rose-950 via-purple-950 to-amber-700', 'gold-velvet': 'from-red-950 via-rose-950 to-amber-500' } as Record<SquareCategory, string>)[collection.category],
    pages: [{ id: `${id}-page`, title: `${name} Invitation`, backgroundType: 'color', backgroundValue: palette.background, elements }],
  };
}

export const SQUARE_TEMPLATES: CardTemplate[] = categories.flatMap((category) => {
  const existingSquareCount = category.category === 'birthday' ? 1 : 0;
  return category.names.slice(0, 15 - existingSquareCount).map((_, index) => makeSquareTemplate(category, index));
});
