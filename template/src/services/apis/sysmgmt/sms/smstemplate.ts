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

// 列表
export const getSmsTemplateList = async (params: SmsTemplateSearch) => {
  return await get<ListRes<SmsTemplateData>>("/sys/smsTemplate/page", { params });
};

// 详情
export const getSmsTemplate = async (id: number | string) => {
  return await get<SmsTemplateData>("/sys/smsTemplate/info/" + id);
};

// 新增
export const createSmsTemplate = async (data: SmsTemplateData) => {
  return await post("/sys/smsTemplate/add", data);
};

// 修改
export const editSmsTemplate = async (data: SmsTemplateData) => {
  return await post("/sys/smsTemplate/upd", data);
};

// 删除
export const deleteSmsTemplate = async (id: number | string) => {
  return await get("/sys/smsTemplate/del", { params: { ids: id } });
};
