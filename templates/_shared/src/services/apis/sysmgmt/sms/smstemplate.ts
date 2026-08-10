import { get, post } from "@/services/Axios";

import { ListRes } from "@/services/ResType";

export interface SmsTemplateSearchData {}

interface SmsTemplateSearch {
  query: string;
}

interface ISmsTemplateData {
  id: string | number;
}
export type SmsTemplateData = Partial<ISmsTemplateData>;

// List
export const getSmsTemplateList = async (params: SmsTemplateSearch) => {
  return await get<ListRes<SmsTemplateData>>("/sys/smsTemplate/page", { params });
};

// Detail
export const getSmsTemplate = async (id: number | string) => {
  return await get<SmsTemplateData>("/sys/smsTemplate/info/" + id);
};

// Create
export const createSmsTemplate = async (data: SmsTemplateData) => {
  return await post("/sys/smsTemplate/add", data);
};

// Update
export const editSmsTemplate = async (data: SmsTemplateData) => {
  return await post("/sys/smsTemplate/upd", data);
};

// Delete
export const deleteSmsTemplate = async (id: number | string) => {
  return await get("/sys/smsTemplate/del", { params: { ids: id } });
};
