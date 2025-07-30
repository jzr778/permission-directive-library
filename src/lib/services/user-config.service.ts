import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserGlobalConfig, DEFAULT_USER_CONFIG } from '../models/user-config';

@Injectable({ providedIn: 'root' })
export class UserConfigService {
  private config = new BehaviorSubject<UserGlobalConfig>(DEFAULT_USER_CONFIG);
  private userReadySubject = new BehaviorSubject<boolean>(false);
  public userReady$ = this.userReadySubject.asObservable();
  // 公开为Observable便于监听变化
  config$ = this.config.asObservable();

  // 更新全局配置
  setUserConfig(config: Partial<UserGlobalConfig>) {
    this.config.next({
      ...DEFAULT_USER_CONFIG,
      ...config, 
    });
    if (config.userCode) {
      this.userReadySubject.next(true);
    }
  }

  // 获取当前用户编码
  get currentUserCode() {
    return this.config.value.userCode;
  }

  get webApiUrl() {
    return this.config.value.webApiUrl;
  }

  get currentSystemId() {
    return this.config.value.systemId;
  }

  // 获取默认重定向URL
  get defaultRedirectUrl() {
    return this.config.value.defaultRedirectUrl || '/exception/403/3';
  }

  

  get agentCode() {
    return this.config.value.agentCode;
  }

}
