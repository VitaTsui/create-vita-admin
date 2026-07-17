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

// List
export const getParamList = async (params: ParamSearch) => {
  return await get<ListRes<ParamData>>("/sys/param/page", { params });
};

// Detail
export const getParam = async (id: number | string) => {
  return await get<ParamData>("/sys/param/info/" + id);
};

// Create
export const createParam = async (data: ParamData) => {
  return await post("/sys/param/add", data);
};

// Update
export const editParam = async (data: ParamData) => {
  return await post("/sys/param/upd", data);
};

// Delete
export const deleteParam = async (id: number | string) => {
  return await get("/sys/param/del", { params: { ids: id } });
};
