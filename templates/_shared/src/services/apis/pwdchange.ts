import { post } from "@/services/Axios";

interface IPwdChangeData {
  oldPassword: string;
  password: string;
}
export type PwdChangeData = Partial<IPwdChangeData>;

// Update
export const editPwdChange = async (data: PwdChangeData) => {
  return await post("/sys/user/updPwd", data);
};
