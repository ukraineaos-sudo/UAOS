import { DocumentItem } from '../types';

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'statut',
    title: {
      uk: 'Статут Громадської спілки «УАПБ»',
      en: 'Statute of the UAOS Public Union'
    },
    description: {
      uk: 'Основний установчий документ, що регулює діяльність спілки, права та обов’язки її членів.',
      en: 'The main founding document governing the activities of the Union, rights, and duties of its members.'
    },
    type: 'pdf',
    size: '1.2 MB',
    language: 'UA',
    dateUpdated: '2026-03-10',
    fileUrl: '#'
  },
  {
    id: 'rules',
    title: {
      uk: 'Правила вступу до асоціації',
      en: 'Membership Admission Rules'
    },
    description: {
      uk: 'Регламент та вимоги до кандидатів, перелік документів та процедура розгляду заявок.',
      en: 'Regulations and requirements for candidates, document checklist, and application review process.'
    },
    type: 'pdf',
    size: '640 KB',
    language: 'UA/EN',
    dateUpdated: '2026-04-15',
    fileUrl: '#'
  },
  {
    id: 'code-of-conduct',
    title: {
      uk: 'Кодекс поведінки учасників UAOS',
      en: 'UAOS Members Code of Conduct'
    },
    description: {
      uk: 'Звід етичних принципів, стандартів доброчесності, відповідальності та якості для всіх партнерів.',
      en: 'A compilation of ethical principles, standards of integrity, responsibility, and quality for all partners.'
    },
    type: 'pdf',
    size: '820 KB',
    language: 'UA/EN',
    dateUpdated: '2026-05-20',
    fileUrl: '#'
  },
  {
    id: 'presentation',
    title: {
      uk: 'Офіційна презентація асоціації UAOS',
      en: 'Official UAOS Association Presentation'
    },
    description: {
      uk: 'Коротка презентація про місію, цілі, засновників та практичну користь для учасників ринку.',
      en: 'A brief presentation about the mission, goals, founders, and practical values for market participants.'
    },
    type: 'pdf',
    size: '4.5 MB',
    language: 'UA/EN',
    dateUpdated: '2026-06-01',
    fileUrl: '#'
  },
  {
    id: 'board-regulations',
    title: {
      uk: 'Положення про органи управління',
      en: 'Regulations on Governing Bodies'
    },
    description: {
      uk: 'Документ, що визначає повноваження та порядок роботи Наглядової ради, Загальних зборів та Правління.',
      en: 'Document defining the authority and procedures of the Supervisory Board, General Assembly, and Board of Directors.'
    },
    type: 'pdf',
    size: '950 KB',
    language: 'UA',
    dateUpdated: '2026-03-12',
    fileUrl: '#'
  }
];

const STORAGE_KEY = 'uaos_documents_v1';

export function getDocuments(): DocumentItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse documents from localStorage', e);
  }

  // If no documents exist or parsing fails, save INITIAL_DOCUMENTS as default and return them
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DOCUMENTS));
  } catch (e) {
    console.error('Failed to write initial documents to localStorage', e);
  }
  return INITIAL_DOCUMENTS;
}

export function saveDocuments(docs: DocumentItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  } catch (e) {
    console.error('Failed to save documents to localStorage', e);
  }
}
