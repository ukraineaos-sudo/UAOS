import { AssociationMember } from '../types';

export const INITIAL_MEMBERS: AssociationMember[] = [
  {
    id: 'assecuro',
    slug: 'assecuro',
    order: 1,
    published: true,
    profileLevel: 'extended',
    name: {
      uk: 'ТОВ "АССЕКУРО УКРАЇНА"',
      en: 'Assecuro Ukraine LLC'
    },
    shortName: 'ASSECURO',
    category: {
      uk: 'Безпека робіт на висоті',
      en: 'Safety of Work at Height'
    },
    shortDescription: {
      uk: 'ЗІЗ, навчання та комплексні системи для безпечного виконання робіт на висоті й під напругою.',
      en: 'PPE, training, and complex systems for safe execution of work at heights and under electrical tension.'
    },
    fullDescription: {
      uk: 'ASSECURO розробляє та впроваджує засоби захисту, рішення й комплексні послуги для організації безпечного виконання робіт на висоті та під напругою. Наша мета — забезпечити максимальну безпеку та надійність.',
      en: 'ASSECURO develops and implements protection systems, solutions, and comprehensive services for organizing safe work at heights and under tension. Our goal is to ensure maximum safety and reliability.'
    },
    logoUrl: 'ASSECURO',
    coverImageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800',
    websiteUrl: 'https://assecuro.ua/',
    publicEmail: 'office@assecuro.ua',
    publicPhone: '+38 (044) 338-23-23',
    competencies: [
      { uk: 'Анкерні лінії та точки кріплення', en: 'Anchor lines and securing points' },
      { uk: 'Страхувальні системи та пояси', en: 'Fall arrest systems and harnesses' },
      { uk: 'Навчання персоналу та сертифікація', en: 'Staff training and certification' },
      { uk: 'Інспекційні огляди обладнання', en: 'Equipment inspections and audits' }
    ],
    services: [
      { uk: 'Проектування та монтаж систем', en: 'System design and installation' },
      { uk: 'Аудит небезпечних зон на підприємстві', en: 'Hazardous area audits on enterprises' },
      { uk: 'Спеціалізовані тренінги з висотних робіт', en: 'Specialized high-altitude work training' }
    ],
    certificates: [
      { id: 'cert-1', title: { uk: 'Декларація відповідності засобів індивідуального захисту', en: 'Declaration of conformity for personal protective equipment' }, documentUrl: '#' },
      { id: 'cert-2', title: { uk: 'Сертифікат відповідності ISO 9001:2015', en: 'Certificate of conformity ISO 9001:2015' }, documentUrl: '#' }
    ],
    cases: [
      {
        id: 'case-1',
        title: { uk: 'Установка анкерної лінії на металургійному комбінаті', en: 'Installation of anchor line at a metallurgical plant' },
        description: { uk: 'Розробка та монтаж горизонтальної сталевої системи страхування протяжністю 120 метрів для безпечного обслуговування кранових колій.', en: 'Development and installation of a 120-meter horizontal steel fall arrest system for safe maintenance of crane runways.' },
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600'
      }
    ],
    products: [
      { id: 'prod-1', name: { uk: 'Професійний страхувальний пояс CA101', en: 'Professional safety harness CA101' }, description: { uk: 'П’ятиточковий ергономічний пояс для тривалого перебування у підвішеному стані.', en: 'Five-point ergonomic harness designed for long-term suspension.' }, price: '4,500 ₴' },
      { id: 'prod-2', name: { uk: 'Анкерна лінія "SecurLine"', en: 'Anchor Line "SecurLine"' }, description: { uk: 'Гнучка тросова система для постійного кріплення на дахах і естакадах.', en: 'Flexible wire rope system for permanent installation on roofs and overpasses.' } }
    ],
    lastUpdated: '2026-05-12'
  },
  {
    id: 'biko',
    slug: 'biko',
    order: 2,
    published: true,
    profileLevel: 'basic',
    name: {
      uk: 'ТОВ "КОМПАНІЯ "БІКО"',
      en: 'Biko Company LLC'
    },
    shortName: 'БІКО',
    category: {
      uk: 'ЗІЗ та спецодяг',
      en: 'PPE and Workwear'
    },
    shortDescription: {
      uk: 'Комплексне забезпечення підприємств засобами індивідуального захисту, спецодягом і спецвзуттям.',
      en: 'Comprehensive supply of enterprises with personal protective equipment, workwear, and safety footwear.'
    },
    fullDescription: {
      uk: 'БІКО постачає засоби індивідуального захисту, спецодяг і спецвзуття, представляє міжнародні бренди та розвиває власний напрям виробництва якісного захисного одягу з сертифікованих європейських тканин.',
      en: 'BIKO supplies personal protective equipment, workwear, and safety footwear, represents leading international brands and develops its own production of protective clothing using certified European fabrics.'
    },
    logoUrl: 'БІКО',
    coverImageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
    websiteUrl: 'https://biko.ua/',
    publicEmail: 'sales@biko.ua',
    publicPhone: '+38 (044) 498-66-00',
    lastUpdated: '2026-06-01'
  },
  {
    id: 'deltaplus',
    slug: 'deltaplus',
    order: 3,
    published: true,
    profileLevel: 'extended',
    name: {
      uk: 'ТОВ "ДЕЛЬТА ПЛЮС УКРАЇНА"',
      en: 'Delta Plus Ukraine LLC'
    },
    shortName: 'DELTA PLUS',
    category: {
      uk: 'Виробник ЗІЗ',
      en: 'PPE Manufacturer'
    },
    shortDescription: {
      uk: 'Комплексні засоби індивідуального захисту для різних професій, ризиків і галузей промисловості.',
      en: 'Comprehensive personal protective equipment for various professions, risks, and industrial fields.'
    },
    fullDescription: {
      uk: 'Delta Plus розробляє та постачає широкий спектр засобів індивідуального захисту, поєднуючи надійний захист працівників із комфортом, ергономікою та високою практичністю у використанні.',
      en: 'Delta Plus designs, manufactures, and distributes a full range of personal protective equipment, combining reliable protection for employees with comfort, ergonomics, and practical design.'
    },
    logoUrl: 'DELTA PLUS',
    coverImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    websiteUrl: 'https://www.deltaplus.eu/uk/',
    publicEmail: 'office@deltaplus.com.ua',
    publicPhone: '+38 (044) 585-11-22',
    competencies: [
      { uk: 'Захист голови, очей та слуху', en: 'Head, eye, and hearing protection' },
      { uk: 'Високоякісні захисні рукавиці', en: 'High-performance protective gloves' },
      { uk: 'Спеціалізоване взуття для промисловості', en: 'Specialized footwear for industry' },
      { uk: 'Одяг для захисту від хімічних ризиків', en: 'Protective clothing against chemical risks' }
    ],
    certificates: [
      { id: 'dp-cert-1', title: { uk: 'Європейський сертифікат відповідності CE', en: 'European CE Certificate of Conformity' }, documentUrl: '#' }
    ],
    cases: [
      {
        id: 'dp-case-1',
        title: { uk: 'Впровадження рукавиць із захистом від порізів на скляному заводі', en: 'Implementation of cut-resistant gloves at a glass factory' },
        description: { uk: 'Завдяки використанню серії рукавиць Delta Plus Venicut рівень виробничого травматизму рук на підприємстві знизився на 94%.', en: 'Due to the introduction of Delta Plus Venicut series gloves, hand injury rates on the production plant dropped by 94%.' }
      }
    ],
    products: [
      { id: 'dp-prod-1', name: { uk: 'Захисна каска Quartz IV', en: 'Quartz IV Safety Helmet' }, description: { uk: 'Вентильована каска з ABS-пластику зі стійкістю до УФ-випромінювання.', en: 'Ventilated UV-resistant ABS plastic safety helmet.' } },
      { id: 'dp-prod-2', name: { uk: 'Рукавиці Venicut52', en: 'Venicut52 Gloves' }, description: { uk: 'Високотехнологічні рукавиці з волокна TAEKI із найвищим рівнем захисту від порізів.', en: 'High-tech TAEKI fiber gloves with the highest cut protection level.' } }
    ],
    lastUpdated: '2026-04-18'
  },
  {
    id: 'effetex',
    slug: 'effetex',
    order: 4,
    published: true,
    profileLevel: 'basic',
    name: {
      uk: 'ТОВ "ЕФФІТЕКС"',
      en: 'EffeTex LLC'
    },
    shortName: 'EffeTex',
    category: {
      uk: 'Аутсорсинг спецодягу',
      en: 'Workwear Outsourcing'
    },
    shortDescription: {
      uk: 'Оренда та комплексне обслуговування спецодягу: прання, ремонт, заміна й облік.',
      en: 'Rental and comprehensive maintenance of workwear: industrial washing, repair, replacement, and tracking.'
    },
    fullDescription: {
      uk: 'EffeTex забезпечує підприємства спецодягом за моделлю аутсорсингу та виконує його регулярне професійне обслуговування (хімчистка, ремонт, підгонка, RFID-маркування та заміна) протягом усього циклу використання.',
      en: 'EffeTex supplies enterprises with workwear under the outsourcing model and performs its regular professional servicing (laundering, repairing, fitting, RFID-tracking, and replacements) throughout the entire wear cycle.'
    },
    logoUrl: 'EffeTex',
    coverImageUrl: 'https://images.unsplash.com/photo-1545156521-77bd8567090f?auto=format&fit=crop&q=80&w=800',
    websiteUrl: 'https://effetex.com/',
    publicEmail: 'info@effetex.com',
    publicPhone: '+38 (050) 410-55-11',
    lastUpdated: '2026-05-30'
  },
  {
    id: 'epg',
    slug: 'epg',
    order: 5,
    published: true,
    profileLevel: 'extended',
    name: {
      uk: 'ТОВ "ІНЖЕНЕРНО-ПРОМИСЛОВА ГРУПА"',
      en: 'Engineering Industrial Group LLC'
    },
    shortName: 'EPG',
    category: {
      uk: 'Промислова безпека',
      en: 'Industrial Safety'
    },
    shortDescription: {
      uk: 'Інженерне обладнання та рішення для ізоляції енергії, LOTO і безпечної роботи промислових систем.',
      en: 'Engineering equipment and solutions for energy isolation, LOTO, and safe operation of industrial systems.'
    },
    fullDescription: {
      uk: 'EPG постачає інженерні рішення та промислове обладнання, зокрема системи LOTO (Lockout/Tagout), пневмо- та гідрообладнання ROSS для керування енергією, ізоляції обладнання й підвищення загальної безпеки виробничих процесів.',
      en: 'EPG supplies engineering solutions and industrial equipment, specifically LOTO (Lockout/Tagout) systems, and ROSS pneumatic/hydraulic devices for energy control, equipment isolation, and overall occupational safety improvement.'
    },
    logoUrl: 'EPG',
    coverImageUrl: 'https://images.unsplash.com/photo-1513828742140-ccaa34f327bc?auto=format&fit=crop&q=80&w=800',
    websiteUrl: 'https://epg.biz.ua/',
    publicEmail: 'office@epg.biz.ua',
    publicPhone: '+38 (044) 220-44-55',
    competencies: [
      { uk: 'Системи блокування LOTO (Lockout/Tagout)', en: 'LOTO lockout/tagout systems' },
      { uk: 'Аудит систем енергоізоляції', en: 'Energy isolation system audits' },
      { uk: 'Клапани безпеки пневматичних систем', en: 'Pneumatic system safety valves' },
      { uk: 'Навчання персоналу процедурам LOTO', en: 'Staff training in LOTO procedures' }
    ],
    products: [
      { id: 'epg-prod-1', name: { uk: 'Клапани безпеки ROSS L-O-X', en: 'ROSS L-O-X Safety Valves' }, description: { uk: 'Пневматичні клапани для блокування подачі повітря під час техобслуговування.', en: 'Pneumatic valves for air supply lockout during maintenance.' } },
      { id: 'epg-prod-2', name: { uk: 'Замок безпеки Zenex™ LOTO', en: 'Zenex™ LOTO Safety Padlock' }, description: { uk: 'Непровідний замок для блокування електричних автоматів та панелей.', en: 'Non-conductive padlock for blocking electrical breakers and panels.' } }
    ],
    lastUpdated: '2026-07-01'
  },
  {
    id: 'insight',
    slug: 'insight',
    order: 6,
    published: true,
    profileLevel: 'extended',
    name: {
      uk: 'ТОВ "ІНСАЙТ.УА"',
      en: 'Insight.UA LLC'
    },
    shortName: 'INSIGHT',
    category: {
      uk: 'Функціональний спецодяг',
      en: 'Functional Workwear'
    },
    shortDescription: {
      uk: 'Сучасний функціональний спецодяг, корпоративні рішення та технологічний дизайн для різних галузей.',
      en: 'Modern functional workwear, corporate solutions, and technological design for various industries.'
    },
    fullDescription: {
      uk: 'INSIGHT розробляє та виготовляє сучасний функціональний і технологічний одяг, поєднуючи інноваційний дизайн, високий рівень комфорту, строгі вимоги стандартів безпеки та особливості корпоративного стилю замовників.',
      en: 'INSIGHT designs and manufactures modern functional and technical clothing, combining innovative design, premium comfort, strict compliance with safety standards, and customized corporate brand identity.'
    },
    logoUrl: 'INSIGHT',
    coverImageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    websiteUrl: 'https://insight.ua/',
    publicEmail: 'info@insight.ua',
    publicPhone: '+38 (044) 333-77-88',
    competencies: [
      { uk: 'Розробка корпоративного дизайну', en: 'Corporate workwear design development' },
      { uk: 'Виробництво сигнального одягу підвищеної видимості', en: 'Production of high-visibility safety clothing' },
      { uk: 'Одяг для захисту від термічних ризиків', en: 'Workwear for protection against thermal risks' },
      { uk: 'Водовідштовхувальні та вітрозахисні мембранні технології', en: 'Waterproof and windproof membrane technologies' }
    ],
    products: [
      { id: 'ins-prod-1', name: { uk: 'Робочий костюм "INSIGHT-TECH"', en: 'Workwear suit "INSIGHT-TECH"' }, description: { uk: 'Ергономічний захисний костюм із тканини підвищеної міцності Rip-Stop.', en: 'Ergonomic protective suit made of extra durable Rip-Stop fabric.' } },
      { id: 'ins-prod-2', name: { uk: 'Куртка Softshell "Active-Safety"', en: 'Softshell Jacket "Active-Safety"' }, description: { uk: 'Мембранна сигнальна куртка для роботи у складних погодних умовах.', en: 'Membrane high-visibility jacket for work in difficult weather conditions.' } }
    ],
    lastUpdated: '2026-03-24'
  },
  {
    id: 'olte',
    slug: 'olte',
    order: 7,
    published: true,
    profileLevel: 'basic',
    name: {
      uk: 'ТОВ «ОЛ&ТЕ ГРУП»',
      en: 'OL&TE Group LLC'
    },
    shortName: 'OL&TE GROUP',
    category: {
      uk: 'Комплексні рішення з безпеки',
      en: 'Complex Safety Solutions'
    },
    shortDescription: {
      uk: 'ЗІЗ, аудити, документація, навчання та цифрові рішення для системної безпеки підприємств.',
      en: 'PPE, audits, documentation, training, and digital solutions for systemic occupational safety of enterprises.'
    },
    fullDescription: {
      uk: 'OL&TE GROUP поєднує постачання засобів індивідуального захисту з професійними аудитами, консалтингом та супроводом охорони праці, розробкою технічної документації та впровадженням сучасних цифрових й навчальних VR-рішень.',
      en: 'OL&TE GROUP combines the supply of high-end protective equipment with professional safety audits, consulting and occupational safety outsourcing, technical documentation development, and implementation of cutting-edge digital and VR training solutions.'
    },
    logoUrl: 'OL&TE GROUP',
    coverImageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    websiteUrl: 'https://portal313.com.ua/',
    publicEmail: 'office@oltegroup.com',
    publicPhone: '+38 (067) 500-11-22',
    lastUpdated: '2026-02-15'
  },
  {
    id: 'stg',
    slug: 'stg',
    order: 8,
    published: true,
    profileLevel: 'extended',
    name: {
      uk: 'STG® - Special Textile Group',
      en: 'STG® - Special Textile Group'
    },
    shortName: 'STG',
    category: {
      uk: 'Захисні тканини',
      en: 'Protective Fabrics'
    },
    shortDescription: {
      uk: 'Високотехнологічні матеріали для промислового, спеціального, військового та корпоративного одягу.',
      en: 'High-tech fabrics and textiles for industrial, special, tactical, and corporate workwear.'
    },
    fullDescription: {
      uk: 'STG спеціалізується на розробці та дистрибуції професійних і захисних тканин, що використовуються для виготовлення спецодягу з чітко визначеними експлуатаційними та вогнетривкими, антистатичними або водовідштовхувальними властивостями.',
      en: 'STG specializes in developing and distributing professional and safety fabrics used to manufacture workwear with strictly defined protective qualities, including fire-resistance, anti-static, or water-repellency.'
    },
    logoUrl: 'STG',
    coverImageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
    websiteUrl: 'https://stg.ua/',
    publicEmail: 'info@stg.ua',
    publicPhone: '+38 (044) 400-50-60',
    competencies: [
      { uk: 'Вогнетривкі тканини за технологіями Proban®', en: 'Flame-retardant fabrics utilizing Proban® technologies' },
      { uk: 'Антистатичні матеріали з ниткою Negastat®', en: 'Anti-static textiles with Negastat® carbon fibers' },
      { uk: 'Тканини для термостійкого захисту від дуги', en: 'Fabrics for thermal protection against electric arc flashes' },
      { uk: 'Зносостійкі змісові тканини для промисловості', en: 'Highly durable blended fabrics for general industrial wear' }
    ],
    products: [
      { id: 'stg-prod-1', name: { uk: 'Тканина "Welder-Pro"', en: 'Fabric "Welder-Pro"' }, description: { uk: 'Важка бавовняна вогнестійка тканина для захисту зварювальників.', en: 'Heavyweight cotton flame-retardant fabric for welding protection.' } },
      { id: 'stg-prod-2', name: { uk: 'Тканина "Tornados-AntiStatic"', en: 'Fabric "Tornados-AntiStatic"' }, description: { uk: 'Змісова тканина з антистатичними вуглецевими нитками для хімічної та нафтової промисловості.', en: 'Blended fabric with static-dissipative carbon grids for chemical and petroleum industries.' } }
    ],
    lastUpdated: '2026-06-11'
  },
  {
    id: 'teksika',
    slug: 'teksika',
    order: 9,
    published: true,
    profileLevel: 'basic',
    name: {
      uk: 'ТОВ "ТЕКСІКА"',
      en: 'Teksika LLC'
    },
    shortName: 'ТЕКСІКА',
    category: {
      uk: 'Тканини та фурнітура',
      en: 'Fabrics and Accessories'
    },
    shortDescription: {
      uk: 'Тканини й швейна фурнітура для виробників робочого, медичного та корпоративного одягу.',
      en: 'Fabrics and sewing accessories for manufacturers of workwear, medical uniforms, and corporate apparel.'
    },
    fullDescription: {
      uk: 'ТЕКСІКА постачає тканини та швейну фурнітуру провідним українським швейним виробникам, пропонує широкий асортимент та розвиває глибоку професійну експертизу у виборі та випробуванні матеріалів для різних умов праці.',
      en: 'TEKSIKA supplies textile fabrics and sewing accessories to Ukrainian workwear manufacturers, offering an extensive catalog and developing deep professional expertise in choosing and testing materials for various work conditions.'
    },
    logoUrl: 'ТЕКСІКА',
    coverImageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
    websiteUrl: 'https://teksika.ua/',
    publicEmail: 'sales@teksika.com.ua',
    publicPhone: '+38 (044) 490-54-44',
    lastUpdated: '2026-05-10'
  },
  {
    id: 'ultrasafety',
    slug: 'ultrasafety',
    order: 10,
    published: true,
    profileLevel: 'basic',
    name: {
      uk: 'ТОВ "УЛЬТРАСЕЙФЕТІ"',
      en: 'UltraSafety LLC'
    },
    shortName: 'ULTRA SAFETY',
    category: {
      uk: 'Комплексне постачання ЗІЗ',
      en: 'Comprehensive PPE Supply'
    },
    shortDescription: {
      uk: 'Професійний підбір і комплексне постачання спецодягу, спецвзуття та засобів індивідуального захисту.',
      en: 'Professional selection and comprehensive supply of workwear, safety footwear, and personal protective equipment.'
    },
    fullDescription: {
      uk: 'ULTRA SAFETY забезпечує підприємства професійними засобами індивідуального захисту, якісним спецодягом і спецвзуттям провідних міжнародних та кращих вітчизняних виробників із повним супроводом та підбором рішень під ризики.',
      en: 'ULTRA SAFETY provides industrial enterprises with professional personal protective equipment, high-quality workwear, and safety footwear from leading global and local manufacturers, offering custom risk-matching and expert support.'
    },
    logoUrl: 'ULTRA SAFETY',
    coverImageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',
    websiteUrl: 'https://ultrasafety.com.ua/',
    publicEmail: 'sale@ultrasafety.com.ua',
    publicPhone: '+38 (044) 222-88-99',
    lastUpdated: '2026-06-20'
  }
];

const LOCAL_STORAGE_KEY = 'uaos_members_v2';

export function getMembers(): AssociationMember[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Sanitize legacy data to ensure all required fields like 'published' and 'profileLevel' exist
        return parsed.map((m: any) => ({
          ...m,
          published: m.published !== undefined ? !!m.published : true,
          profileLevel: m.profileLevel || 'basic',
          name: m.name || { uk: '', en: '' },
          shortName: m.shortName || '',
          category: m.category || { uk: '', en: '' },
          shortDescription: m.shortDescription || { uk: '', en: '' },
          fullDescription: m.fullDescription || { uk: '', en: '' },
          logoUrl: m.logoUrl || '',
          coverImageUrl: m.coverImageUrl || ''
        })) as AssociationMember[];
      }
    }
  } catch (e) {
    console.error('Failed to parse members from localStorage', e);
  }
  
  // If no members exist or parsing fails, save INITIAL_MEMBERS as default and return them
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MEMBERS));
  } catch (e) {
    console.error('Failed to write initial members to localStorage', e);
  }
  return INITIAL_MEMBERS;
}

export function saveMembers(members: AssociationMember[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(members));
  } catch (e) {
    console.error('Failed to save members to localStorage', e);
  }
}

export function resetMembers(): AssociationMember[] {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MEMBERS));
  } catch (e) {
    console.error('Failed to reset members in localStorage', e);
  }
  return INITIAL_MEMBERS;
}
