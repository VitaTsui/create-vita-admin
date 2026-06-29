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

// 列表
export const getOprLogList = async (params: OprLogSearch) => {
  return await get<ListRes<OprLogData>>("/sys/oprLog/page", { params });
};

// 详情
export const getOprLog = async (id: number | string) => {
  return await get<OprLogData>("/sys/oprLog/info/" + id);
};

// 清理日志
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
