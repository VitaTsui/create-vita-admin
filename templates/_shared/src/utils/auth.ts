import wsCache from "@/utils/wsCache";

// ========== AccessTokenKey ==========

const AccessTokenKey = "FZXVM_ACCESS_TOKEN";

// Get token
export const getAccessToken = () => {
  return wsCache.get(AccessTokenKey);
};

// Set token
export const setToken = (token: string) => {
  wsCache.set(AccessTokenKey, token);
};

// Remove token
export const removeToken = () => {
  wsCache.delete(AccessTokenKey);
};

// ========== Account ==========

const UserInfoKey = "FZXVM_USER_INFO";

export const setUserInfo = (userInfo: object) => {
  wsCache.set(UserInfoKey, userInfo);
};

export const getUserInfo = () => {
  return wsCache.get(UserInfoKey) || {};
};
