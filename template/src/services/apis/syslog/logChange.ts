import { get, post } from "@/services/Axios";

import { ListRes } from "@/services/ResType";

export interface LogChangeSearchData {
  nm__developer: string;
  releTm: [string, string];
}

interface LogChangeSearch {
  query: string;
}

interface ILogChangeData {
  id: string | number;
  cont: string;
  developer: string;
  nm: string;
  releTm: string;
  rmks: string;
  tntId: number;
  ver: string;
}
export type LogChangeData = Partial<ILogChangeData>;

// 列表
export const getLogChangeList = async (params: LogChangeSearch) => {
  return await get<ListRes<LogChangeData>>("/sys/logChange/page", { params });
};

// 详情
export const getLogChange = async (id: number | string) => {
  return await get<LogChangeData>("/sys/logChange/info/" + id);
};

// 当前最新发布版本（用于顶栏展示）
export const getLatestLogChange = async () => {
  return await get<LogChangeData>("/sys/logChange/getLatest");
};

// 新增
export const createLogChange = async (data: LogChangeData) => {
  return await post("/sys/logChange/add", data);
};

// 修改
export const editLogChange = async (data: LogChangeData) => {
  return await post("/sys/logChange/upd", data);
};

// 删除
export const deleteLogChange = async (id: number | string) => {
  return await get("/sys/logChange/del", { params: { ids: id } });
};
