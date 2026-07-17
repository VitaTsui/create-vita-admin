import { get, post } from "../Axios";
import { ListRes } from "../ResType";

// Alert info and task scheduling failure info
export interface AlertInfoData {
  alertCount: number;
  taskFailCount: number;
  alertWeekRate: number;
  taskFailWeekRate: number;
  datasourceSize: string;
  redisSize: string;
  apiExcepCount: number;
  apiLongUnuseCount: number;
  mqExcepCount: number;
  diskFreeSize: string;
}
export const getAlertInfo = async () => {
  return await get<AlertInfoData>("/data/home/screen/alert/info");
};

// Home page API config info
export interface MaintainedInfo {
  apiUnmaintainedCount: number;
  apiMaintainedCount: number;
  apiMaintainedRate: string;
}

export interface SecurityAudits {
  apiExceptionCount: number;
  apiCallExceptionCount: number;
  apiCallFailedCount: number;
  apiLongTimeNoCallCount: number;
  apiCallFailedRate: string;
  apiCallExceptionRate: string;
  apiLongTimeNoCallRate: string;
  otherRate: string;
}

export interface ApiConfigData {
  proxyNodeCount: number;
  projectTotalCount: number;
  projectActiveCount: number;
  userTotalCount: number;
  userActiveCount: number;
  maintainedInfo: MaintainedInfo;
  apiTotalCount: number;
  apiParsedCount: number;
  apiActiveCount: number;
  monitApiStratApiCount: number;
  monitApiStratApiEnabledCount: number;
  monitBlackCount: number;
  monitBlackEnabledCount: number;
  monitApiExcepStratCount: number;
  monitApiExcepStratEnabledCount: number;
  securityAudits: SecurityAudits;
}
export const getApiConfig = async () => {
  return await get<ApiConfigData>("/data/home/screen/api/config");
};

// Home page MQ config info
export interface MqConfig {
  mqNodeCount: number;
  mqQueueCount: number;
  mqTopicCount: number;
  activeSourceCount: number;
}

export interface MqConfigData {
  amq: MqConfig;
  rmq: MqConfig;
}
export const getMqConfig = async () => {
  return await get<MqConfigData>("/data/home/screen/mq/config");
};

// API call trend
export interface ApiTrendParams {
  apiId?: number;
  indicatorsType?: number;
  projId?: number;
  timeType?: number;
  type?: number;
  userIdList?: number[];
  [key: string]: unknown;
}

export interface ApiTrendData {
  timeName: string;
  count: number;
  growthRate: string;
  yearOnYearGrowthRate: string;
}

export const getApiTrend = async (data: ApiTrendParams = {}) => {
  return await post<ListRes<ApiTrendData>>("/data/home/screen/api/trend", data);
};

// MQ message trend
export interface MqTrendParams {
  indicatorsType?: number;
  msgType?: string;
  queueId?: number;
  source?: string;
  timeType?: number;
  type?: number;
  [key: string]: unknown;
}

export interface MqTrendData {
  timeName: string;
  count: number;
  growthRate: string;
  yearOnYearGrowthRate: string;
}

export const getMqTrend = async (data: MqTrendParams = {}) => {
  return await post<ListRes<MqTrendData>>("/data/home/screen/mq/trend", data);
};

// MQ message type list
export const getMqMsgTypeList = async () => {
  return await post<ListRes<string>>("/data/home/screen/mq/msgType/list");
};

// MQ message source list
export const getMqSourceList = async () => {
  return await post<ListRes<string>>("/data/home/screen/mq/source/list");
};
