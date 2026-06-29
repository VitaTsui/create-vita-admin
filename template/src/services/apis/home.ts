import { get, post } from "../Axios";
import { ListRes } from "../ResType";

// 告警信息和任务调度失败信息
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

// 首页API配置信息
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

// 首页mq配置信息
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

// API调用趋势
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

// MQ消息趋势
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

// MQ 消息类型列表
export const getMqMsgTypeList = async () => {
  return await post<ListRes<string>>("/data/home/screen/mq/msgType/list");
};

// MQ 消息来源列表
export const getMqSourceList = async () => {
  return await post<ListRes<string>>("/data/home/screen/mq/source/list");
};
