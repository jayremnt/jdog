import { Jobs, KeywordTypes } from '@/constants/jobs';

const findJob = (message: string) => {
  const jobs = Jobs.filter((job) =>
    job.keywords.some((keyword) =>
      job.keywordType === KeywordTypes.INCLUDE
        ? message.toLowerCase().includes(keyword.toLowerCase())
        : message.toLowerCase() === keyword.toLowerCase()
    )
  );

  return jobs.sort((a, b) => a.priority - b.priority)[0];
};

export default findJob;
