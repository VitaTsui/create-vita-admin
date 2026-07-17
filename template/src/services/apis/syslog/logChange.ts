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

// List
export const getLogChangeList = async (params: LogChangeSearch) => {
  return await get<ListRes<LogChangeData>>("/sys/logChange/page", { params });
};

// Detail
export const getLogChange = async (id: number | string) => {
  return await get<LogChangeData>("/sys/logChange/info/" + id);
};

// Current latest released version (shown in the top bar)
export const getLatestLogChange = async () => {
  return await get<LogChangeData>("/sys/logChange/getLatest");
};

// Create
export const createLogChange = async (data: LogChangeData) => {
  return await post("/sys/logChange/add", data);
};

// Update
export const editLogChange = async (data: LogChangeData) => {
  return await post("/sys/logChange/upd", data);
};

// Delete
export const deleteLogChange = async (id: number | string) => {
  return await get("/sys/logChange/del", { params: { ids: id } });
};
