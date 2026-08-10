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

// List
export const getSmsConfigList = async (params: SmsConfigSearch) => {
  return await get<ListRes<SmsConfigData>>("/sys/smsConf/page", { params });
};

// Detail
export const getSmsConfig = async (id: number | string) => {
  return await get<SmsConfigData>("/sys/smsConf/info/" + id);
};

// Create
export const createSmsConfig = async (data: SmsConfigData) => {
  return await post("/sys/smsConf/add", data);
};

// Update
export const editSmsConfig = async (data: SmsConfigData) => {
  return await post("/sys/smsConf/upd", data);
};

// Delete
export const deleteSmsConfig = async (id: number | string) => {
  return await get("/sys/smsConf/del", { params: { ids: id } });
};
