import { get, post } from "../Axios";

// Login
export type LoginData = {
  username: string;
  password: string;
  cryptoKey: string;
  codeKey: string;
  codeVal: string;
};
export interface UserInfo {}
export interface LoginResData {
  userInfo: UserInfo;
  token: string;
}
export const login = async (data: LoginData) => {
  return await post<LoginResData>("/auth/access/login", data);
};

// Register
export type RegisterData = {
  username: string;
  password: string;
  cryptoKey: string;
  nickname?: string;
  codeKey?: string;
  codeVal?: string;
};
export const register = async (data: RegisterData) => {
  return await post<LoginResData>("/auth/access/register", data);
};

// Crypto key
export const getCryptoKey = async () => {
  return await get<string>("/auth/access/getCryptoKey");
};

// Logout
export const logout = async () => {
  return await get("/auth/access/logout");
};

// Whether a captcha is required
export const isNeedLoginCaptcha = async () => {
  return await get<boolean>("/auth/access/isNeedLoginCaptcha");
};

// DingTalk QR-code authorization URL
export type DingtalkUrlRes = { enabled: boolean; url: string };
export const getDingtalkUrl = async (state: string) => {
  return await get<DingtalkUrlRes>("/auth/access/dingtalk/url", {
    params: { state },
    // Logged-out probe on the login page: on 401, silently hide the entry without triggering the login redirect
    skipAuthRedirect: true,
  });
};

// DingTalk QR-code login (exchange the callback auth code for a login session)
export const dingtalkLogin = async (data: {
  authCode: string;
  state?: string;
}) => {
  return await post<LoginResData>("/auth/access/dingtalk", data);
};
