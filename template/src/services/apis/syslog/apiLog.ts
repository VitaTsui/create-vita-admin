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

// List
export const getApiLogList = async (params: ApiLogSearch) => {
  return await get<ListRes<ApiLogData>>("/sys/log/page", { params });
};

// Detail
export const getApiLog = async (id: number | string, query: string) => {
  return await get<ApiLogData>("/sys/log/info/" + id, { params: { query } });
};

// Clean logs
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
