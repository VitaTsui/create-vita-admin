import { ListRes } from "@/services/ResType";
import { get, post } from "@/services/Axios";

export interface LoginLogSearchData {
  username: string;
  crtTm: [string, string];
}

interface LoginLogSearch {
  query: string;
}

interface ILoginLogData {
  id: string | number;
  crtTm: string | [string, string];
}
export type LoginLogData = Partial<ILoginLogData>;

// List
export const getLoginLogList = async (params: LoginLogSearch) => {
  return await get<ListRes<LoginLogData>>("/sys/logLogin/page", { params });
};

// Detail
export const getLoginLog = async (id: number | string, query: string) => {
  return await get<LoginLogData>("/sys/logLogin/info/" + id, {
    params: { query },
  });
};

// Clean logs
export interface CleanLogParams {
  logType: string;
  retentionPeriod: string;
}

export const cleanLoginLog = async (retentionPeriod: string) => {
  return await post<string>("/sys/log/clean", {
    logType: "登录日志",
    retentionPeriod,
  });
};
