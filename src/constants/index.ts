export enum ContextType {
  EXACT = 'exact',
  INCLUDE = 'include',
}

export const contexts = [
  {
    keywords: ['ping'],
    response: 'Ping cđmm?',
    type: ContextType.EXACT,
  },
  {
    keywords: ['?'],
    response: '?',
    type: ContextType.EXACT,
  },
];
