import { get, post } from "@/services/Axios";

import { ListRes } from "@/services/ResType";

export interface ParamSearchData {}

interface ParamSearch {
  query: string;
}

interface IParamData {
  id: string | number;
  cd: string;
  val: string;
  seq: number;
}
export type ParamData = Partial<IParamData>;

// 列表
export const getParamList = async (params: ParamSearch) => {
  return await get<ListRes<ParamData>>("/sys/param/page", { params });
};

// 详情
export const getParam = async (id: number | string) => {
  return await get<ParamData>("/sys/param/info/" + id);
};

// 新增
export const createParam = async (data: ParamData) => {
  return await post("/sys/param/add", data);
};

// 修改
export const editParam = async (data: ParamData) => {
  return await post("/sys/param/upd", data);
};

// 删除
export const deleteParam = async (id: number | string) => {
  return await get("/sys/param/del", { params: { ids: id } });
};
