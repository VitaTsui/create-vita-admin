import wsCache from "@/utils/wsCache";

// ========== AccessTokenKey ==========

const AccessTokenKey = "FZXVM_ACCESS_TOKEN";

// 获取token
export const getAccessToken = () => {
  return wsCache.get(AccessTokenKey);
};

// 设置token
export const setToken = (token: string) => {
  wsCache.set(AccessTokenKey, token);
};

// 删除token
export const removeToken = () => {
  wsCache.delete(AccessTokenKey);
};

// ========== 账号相关 ==========

const UserInfoKey = "FZXVM_USER_INFO";

export const setUserInfo = (userInfo: object) => {
  wsCache.set(UserInfoKey, userInfo);
};

export const getUserInfo = () => {
  return wsCache.get(UserInfoKey) || {};
};
