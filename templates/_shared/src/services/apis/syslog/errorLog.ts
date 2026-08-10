import { ListRes } from "@/services/ResType";
import { get, post } from "@/services/Axios";

export interface ErrorLogSearchData {
  username: string;
  crtTm: [string, string];
}

interface ErrorLogSearch {
  query: string;
}

interface IErrorLogData {
  id: string | number;
  crtTm: string | [string, string];
}
export type ErrorLogData = Partial<IErrorLogData>;

// List
export const getErrorLogList = async (params: ErrorLogSearch) => {
  return await get<ListRes<ErrorLogData>>("/sys/logError/page", { params });
};

// Detail
export const getErrorLog = async (id: number | string, query: string) => {
  return await get<ErrorLogData>("/sys/logError/info/" + id, {
    params: { query },
  });
};

// Clean logs
export interface CleanLogParams {
  logType: string;
  retentionPeriod: string;
}

export const cleanErrorLog = async (retentionPeriod: string) => {
  return await post<string>("/sys/log/clean", {
    logType: "错误日志",
    retentionPeriod,
  });
};
