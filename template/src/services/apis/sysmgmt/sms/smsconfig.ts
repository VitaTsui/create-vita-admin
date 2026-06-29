import { get, post } from "@/services/Axios";

import { ListRes } from "@/services/ResType";

export interface SmsConfigSearchData {}

interface SmsConfigSearch {
  query: string;
}

interface ISmsConfigData extends Record<string, unknown> {
  id: string | number;
  nm: string;
  active: number;
  type: number;
  endpoint: string;
  accessKey: string;
  accessSecret: string;
  signName: string;
  rmks: string;
  status: number;
  crtTm: string;
  config: string;
}
export type SmsConfigData = Partial<ISmsConfigData>;

// 列表
export const getSmsConfigList = async (params: SmsConfigSearch) => {
  return await get<ListRes<SmsConfigData>>("/sys/smsConf/page", { params });
};

// 详情
export const getSmsConfig = async (id: number | string) => {
  return await get<SmsConfigData>("/sys/smsConf/info/" + id);
};

// 新增
export const createSmsConfig = async (data: SmsConfigData) => {
  return await post("/sys/smsConf/add", data);
};

// 修改
export const editSmsConfig = async (data: SmsConfigData) => {
  return await post("/sys/smsConf/upd", data);
};

// 删除
export const deleteSmsConfig = async (id: number | string) => {
  return await get("/sys/smsConf/del", { params: { ids: id } });
};
