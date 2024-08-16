import { Jobs, KeywordTypes } from '@/constants/jobs';

const findJob = (message: string) => {
  return Jobs.find((job) =>
    job.keywords.some((keyword) =>
      job.keywordType === KeywordTypes.INCLUDE
        ? message.toLowerCase().includes(keyword.toLowerCase())
        : message.toLowerCase() === keyword.toLowerCase()
    )
  );
};

export default findJob;
