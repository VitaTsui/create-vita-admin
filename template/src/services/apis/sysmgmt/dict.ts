import { get, post } from "@/services/Axios";

import { ListRes } from "@/services/ResType";

export interface DictSearchData {}

interface DictSearch {
  query: string;
  pid?: number | string;
}

interface IDictData {
  id: string | number;
  pid: string | number;
  tid: string | number;
}
export type DictData = Partial<IDictData>;

// List
export const getDictList = async (params: DictSearch) => {
  return await get<ListRes<DictData>>("/sys/cat/page", { params });
};

// Detail
export const getDict = async (id: number | string) => {
  return await get<DictData>("/sys/cat/info/" + id);
};

// Create
export const createDict = async (data: DictData) => {
  return await post("/sys/cat/add", data);
};

// Update
export const editDict = async (data: DictData) => {
  return await post("/sys/cat/upd", data);
};

// Delete
export const deleteDict = async (id: number | string) => {
  return await get("/sys/cat/del", { params: { ids: id } });
};

// Dictionary data detail
export const getDictData = async (params: DictSearch) => {
  return await get<ListRes<DictData>>("/sys/cat/listItmTreeNode", { params });
};
