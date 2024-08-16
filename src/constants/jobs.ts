import i18n from '@/configs/i18n.config';

export enum KeywordTypes {
  EXACT = 'exact',
  INCLUDE = 'include',
}

export const Jobs = [
  {
    name: 'ping',
    keywords: ['ping'],
    keywordType: KeywordTypes.EXACT,
    response: i18n.__('ping'),
  },
  {
    name: 'question',
    keywords: ['?'],
    keywordType: KeywordTypes.EXACT,
    response: i18n.__('question'),
  },
];
