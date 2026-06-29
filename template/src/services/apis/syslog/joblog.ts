import { get, post } from "@/services/Axios";

import { ListRes } from "@/services/ResType";

export interface JobLogSearchData {
  crtTm: [string, string];
  status: number;
  /** 业务开始时间 */
  execStartTm?: string;
  /** 业务结束时间 */
  execEndTm?: string;
}

interface JobLogSearch {
  query: string;
}

interface IJobLogData {
  id: string | number;
  crtTm: string | [string, string];
  /** 业务开始时间 */
  execStartTm?: string;
  /** 业务结束时间 */
  execEndTm?: string;
}
export type JobLogData = Partial<IJobLogData>;

// 列表
export const getJobLogList = async (params: JobLogSearch) => {
  return await get<ListRes<JobLogData>>("/sys/jobLog/page", { params });
};

// 详情
export const getJobLog = async (id: number | string, query: string) => {
  return await get<JobLogData>("/sys/jobLog/info/" + id, {
    params: { query },
  });
};

// 清理日志
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
