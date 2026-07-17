import { get, post } from "@/services/Axios";

import { ListRes } from "@/services/ResType";

export interface JobLogSearchData {
  crtTm: [string, string];
  status: number;
  /** Business start time */
  execStartTm?: string;
  /** Business end time */
  execEndTm?: string;
}

interface JobLogSearch {
  query: string;
}

interface IJobLogData {
  id: string | number;
  crtTm: string | [string, string];
  /** Business start time */
  execStartTm?: string;
  /** Business end time */
  execEndTm?: string;
}
export type JobLogData = Partial<IJobLogData>;

// List
export const getJobLogList = async (params: JobLogSearch) => {
  return await get<ListRes<JobLogData>>("/sys/jobLog/page", { params });
};

// Detail
export const getJobLog = async (id: number | string, query: string) => {
  return await get<JobLogData>("/sys/jobLog/info/" + id, {
    params: { query },
  });
};

// Clean logs
export interface CleanLogParams {
  logType: string;
  retentionPeriod: string;
}

export const cleanJobLog = async (retentionPeriod: string) => {
  return await post<string>("/sys/log/clean", {
    logType: "调度日志",
    retentionPeriod,
  });
};
