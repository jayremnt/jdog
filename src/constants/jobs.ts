export enum KeywordTypes {
  EXACT = 'exact',
  INCLUDE = 'include',
}

export const Jobs = [
  {
    name: 'ping',
    keywords: ['ping'],
    keywordType: KeywordTypes.EXACT,
    priority: 3,
  },
  {
    name: 'question',
    keywords: ['?'],
    keywordType: KeywordTypes.EXACT,
    priority: 2,
  },
  {
    name: 'mute',
    keywords: [
      'mute',
      'cấm sủa',
      'tắt mic',
      'khóa mic',
      'khóa mõm',
      'câm',
      'tắt tiếng',
    ],
    keywordType: KeywordTypes.INCLUDE,
    priority: 1,
  },
  {
    name: 'unmute',
    keywords: [
      'unmute',
      'gỡ mute',
      'hủy mute',
      'bật mic',
      'mở mic',
      'cho phép sủa',
      'bật tiếng',
    ],
    keywordType: KeywordTypes.INCLUDE,
    priority: 0,
  },
];
