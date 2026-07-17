import { get, post } from "@/services/Axios";

import { ListRes } from "@/services/ResType";

export interface OprLogSearchData {
  userNm__busNm: string;
  crtTm: [string, string];
}

interface OprLogSearch {
  query: string;
}

interface IOprLogData {
  id: string | number;
}
export type OprLogData = Partial<IOprLogData>;

// List
export const getOprLogList = async (params: OprLogSearch) => {
  return await get<ListRes<OprLogData>>("/sys/oprLog/page", { params });
};

// Detail
export const getOprLog = async (id: number | string) => {
  return await get<OprLogData>("/sys/oprLog/info/" + id);
};

// Clean logs
export interface CleanLogParams {
  logType: string;
  retentionPeriod: string;
}

export const cleanOprLog = async (retentionPeriod: string) => {
  return await post<string>("/sys/log/clean", {
    logType: "操作日志",
    retentionPeriod,
  });
};
