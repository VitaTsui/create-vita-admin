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

// 列表
export const getDictList = async (params: DictSearch) => {
  return await get<ListRes<DictData>>("/sys/cat/page", { params });
};

// 详情
export const getDict = async (id: number | string) => {
  return await get<DictData>("/sys/cat/info/" + id);
};

// 新增
export const createDict = async (data: DictData) => {
  return await post("/sys/cat/add", data);
};

// 修改
export const editDict = async (data: DictData) => {
  return await post("/sys/cat/upd", data);
};

// 删除
export const deleteDict = async (id: number | string) => {
  return await get("/sys/cat/del", { params: { ids: id } });
};

// 字典数据详情
export const getDictData = async (params: DictSearch) => {
  return await get<ListRes<DictData>>("/sys/cat/listItmTreeNode", { params });
};
