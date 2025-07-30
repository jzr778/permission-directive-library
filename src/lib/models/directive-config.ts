import { AuthorizationType } from "../../public-api";

export interface DirectiveConfig {
    visibleConfig?: PermissionConfig;
    disabledConfig?: PermissionConfig;
    hiddenConfig?: PermissionConfig;
    readonlyConfig?: PermissionConfig;
}

export interface PermissionConfig {
    authorizationType?:AuthorizationType
    Paths?: string[];
    CustomParams?: boolean;
    matchType?: 'AND' | 'OR'; // 新增属性，指定匹配逻辑
    logic?: string; // 复杂逻辑表达式，例如 "(A && B) || C"
}