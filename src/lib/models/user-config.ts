import { AuthorizationType } from "../../enums/authorization-type";

export interface UserGlobalConfig {
    /** 用户唯一标识（必填） */
    userCode: string;
    agentCode?: string;
    systemId: number;
    webApiUrl?: string;
    /** 默认的权限拒绝重定向URL */
    defaultRedirectUrl?: string;
    /** 自定义权限校验逻辑（可选） */
    customCheck?: (userCode: string, requiredCode: string) => boolean;
}

// 默认配置
export const DEFAULT_USER_CONFIG: UserGlobalConfig = {
  userCode: 'guest',
  webApiUrl: 'https://localhost:6600/api',
  systemId: 670359824257094,
  defaultRedirectUrl: '/exception/403/1',
  agentCode: 'guest',
};
