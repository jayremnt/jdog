import { contexts, ContextType } from '@/constants';

const loadMessageResponse = (message: string) => {
  const validContext = contexts.find((context) => {
    return context.keywords.some((keyword) => {
      return context.type === ContextType.INCLUDE
        ? message.toLowerCase().includes(keyword.toLowerCase())
        : message.toLowerCase() === keyword.toLowerCase();
    });
  });

  return validContext?.response;
};

export default loadMessageResponse;
