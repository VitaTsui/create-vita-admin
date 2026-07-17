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
 * Get the list
 * @param params query params
 */
export const getInternalErrorLogList = async (
  params: InternalErrorLogSearch
) => {
  return await get<ListRes<InternalErrorLogData>>("/sys/logErrorInner/page", {
    params,
  });
};

/**
 * Get the detail
 * @param id record ID
 */
export const getInternalErrorLog = async (id: number | string) => {
  return await get<InternalErrorLogData>("/sys/logErrorInner/info/" + id);
};

/**
 * Create
 * @param data data
 */
export const createInternalErrorLog = async (data: InternalErrorLogData) => {
  return await post("/sys/logErrorInner/add", data);
};

/**
 * Update
 * @param data data
 */
export const editInternalErrorLog = async (data: InternalErrorLogData) => {
  return await post("/sys/logErrorInner/upd", data);
};

/**
 * Delete
 * @param id record ID
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
