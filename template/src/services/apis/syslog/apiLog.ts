import { ListRes } from "@/services/ResType";
import { get, post } from "@/services/Axios";

export interface ApiLogSearchData {
  username: string;
  crtTm: [string, string];
}

interface ApiLogSearch {
  query: string;
}

interface IApiLogData {
  id: string | number;
  status: number;
  statusDsr: string;
  crtTm: string | [string, string];
}
export type ApiLogData = Partial<IApiLogData>;

// 列表
export const getApiLogList = async (params: ApiLogSearch) => {
  return await get<ListRes<ApiLogData>>("/sys/log/page", { params });
};

// 详情
export const getApiLog = async (id: number | string, query: string) => {
  return await get<ApiLogData>("/sys/log/info/" + id, { params: { query } });
};

// 清理日志
export interface CleanLogParams {
  logType: string;
  retentionPeriod: string;
}

export const cleanApiLog = async (retentionPeriod: string) => {
  return await post<string>("/sys/log/clean", {
    logType: "接口日志",
    retentionPeriod,
  });
};
