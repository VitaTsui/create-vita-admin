import { get, post } from "@/services/Axios";

import { ListRes } from "@/services/ResType";

export interface SmsLogSearchData {}

interface SmsLogSearch {
  query: string;
}

interface ISmsLogData {
  id: string | number;
}
export type SmsLogData = Partial<ISmsLogData>;

// 列表
export const getSmsLogList = async (params: SmsLogSearch) => {
  return await get<ListRes<SmsLogData>>("/sys/smsLog/page", { params });
};

// 详情
export const getSmsLog = async (id: number | string) => {
  return await get<SmsLogData>("/sys/smsLog/info/" + id);
};

// 新增
export const createSmsLog = async (data: SmsLogData) => {
  return await post("/sys/smsLog/add", data);
};

// 修改
export const editSmsLog = async (data: SmsLogData) => {
  return await post("/sys/smsLog/upd", data);
};

// 删除
export const deleteSmsLog = async (id: number | string) => {
  return await get("/sys/smsLog/del", { params: { ids: id } });
};

export interface SendSmsData {}

// 发送短信
export const sendSms = async (data: SendSmsData) => {
  return await post("/sys/sms/send", data);
};
