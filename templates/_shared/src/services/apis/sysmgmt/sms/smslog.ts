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

// List
export const getSmsLogList = async (params: SmsLogSearch) => {
  return await get<ListRes<SmsLogData>>("/sys/smsLog/page", { params });
};

// Detail
export const getSmsLog = async (id: number | string) => {
  return await get<SmsLogData>("/sys/smsLog/info/" + id);
};

// Create
export const createSmsLog = async (data: SmsLogData) => {
  return await post("/sys/smsLog/add", data);
};

// Update
export const editSmsLog = async (data: SmsLogData) => {
  return await post("/sys/smsLog/upd", data);
};

// Delete
export const deleteSmsLog = async (id: number | string) => {
  return await get("/sys/smsLog/del", { params: { ids: id } });
};

export interface SendSmsData {}

// Send SMS
export const sendSms = async (data: SendSmsData) => {
  return await post("/sys/sms/send", data);
};
