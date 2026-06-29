import { get, post } from "@/services/Axios";

import { ListRes } from "@/services/ResType";

export interface InternalErrorLogSearchData {
  crtTm: [string, string];
}

interface InternalErrorLogSearch {
  query: string;
}

interface IInternalErrorLogData {
  id: string | number;
}

export type InternalErrorLogData = Partial<IInternalErrorLogData>;

/**
 * 获取列表
 * @param params 查询参数
 */
export const getInternalErrorLogList = async (
  params: InternalErrorLogSearch
) => {
  return await get<ListRes<InternalErrorLogData>>("/sys/logErrorInner/page", {
    params,
  });
};

/**
 * 获取详情
 * @param id 记录ID
 */
export const getInternalErrorLog = async (id: number | string) => {
  return await get<InternalErrorLogData>("/sys/logErrorInner/info/" + id);
};

/**
 * 新增
 * @param data 数据
 */
export const createInternalErrorLog = async (data: InternalErrorLogData) => {
  return await post("/sys/logErrorInner/add", data);
};

/**
 * 修改
 * @param data 数据
 */
export const editInternalErrorLog = async (data: InternalErrorLogData) => {
  return await post("/sys/logErrorInner/upd", data);
};

/**
 * 删除
 * @param id 记录ID
 */
export const deleteInternalErrorLog = async (id: number | string) => {
  return await get("/sys/logErrorInner/del", { params: { ids: id } });
};

export const cleanInternalErrorLog = async (retentionPeriod: string) => {
  return await post<string>("/sys/log/clean", {
    logType: "内部日志",
    retentionPeriod,
  });
};
