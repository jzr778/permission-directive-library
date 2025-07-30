import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, shareReplay, finalize, catchError } from 'rxjs/operators';
import { PermissionConfig } from '../models/directive-config';
import { UserConfigService } from './user-config.service';
import { AuthorizationType } from '../../enums/authorization-type';

@Injectable({
  providedIn: 'root',
})
export class ESBPermissionsService {
  private permissionsCache = new Map<string, any>();
  private ongoingRequests = new Map<string, Observable<any>>();
  private Permissions: any[] = [];

  constructor(
    private http: HttpClient,
    private userConfig: UserConfigService
  ) {}

  GetPermissions() {
    const systemId = this.userConfig.currentSystemId;
    const UserCode = this.userConfig.currentUserCode;

    if (UserCode === 'guest') {
      return of([]);
    }

    if (this.permissionsCache.has(UserCode)) {
      return of(this.permissionsCache.get(UserCode));
    }

    const requestKey = `permissions_${UserCode}`;
    if (this.ongoingRequests.has(requestKey)) {
      return this.ongoingRequests.get(requestKey)!;
    }

    const request = this.http
      .get<any>(
        `${this.userConfig.webApiUrl}/authorization/GetPermissions/${UserCode}/${systemId}`
      )
      .pipe(
        map((response) => {
          if (response && response.Data && response.Data.ResourcePermissions) {
            this.permissionsCache.set(
              UserCode,
              response.Data.ResourcePermissions
            );
            this.Permissions = response.Data.ResourcePermissions || [];
            return this.Permissions;
          }
          return [];
        }),
        catchError((error) => {
          return of([]);
        }),
        shareReplay(1),
        finalize(() => {
          this.ongoingRequests.delete(requestKey);
        })
      );

    this.ongoingRequests.set(requestKey, request);
    return request;
  }

  public async checkPermission(config: PermissionConfig): Promise<boolean> {
    try {
        const authType = config.authorizationType;
      let UserCode = '';
      if (authType === AuthorizationType.UseAgent) {
        UserCode = this.userConfig.agentCode || 'guest';
      } else {
        UserCode = this.userConfig.currentUserCode;
      }
      const systemId = this.userConfig.currentSystemId;

      
      if (!this.permissionsCache.has(UserCode)) {
      const permissions = await this.http
        .get<any>(`${this.userConfig.webApiUrl}/authorization/GetPermissions/${UserCode}/${systemId}`)
        .toPromise()
        .then((response) =>
          response && response.Data && response.Data.ResourcePermissions
            ? response.Data.ResourcePermissions
            : []
        );
      this.permissionsCache.set(UserCode, permissions);
    }
    this.Permissions = this.permissionsCache.get(UserCode) || [];

      if (!config.Paths && config.CustomParams) {
        return config.CustomParams;
      }

      if (!this.Permissions || !config.Paths) {
        return false;
      }

      if (config.logic) {
        return this.evaluateLogic(config.logic, config.Paths);
      }

      let hasPermission = false;
      if (config.matchType === 'OR') {
        hasPermission = config.Paths.some(
          (path) =>
            this.Permissions.some((p) => p.Path === path && p.HasPermission) ||
            config.CustomParams
        );
      } else {
        hasPermission = config.Paths.every(
          (path) =>
            this.Permissions.some((p) => p.Path === path && p.HasPermission) &&
            config.CustomParams !== false
        );
      }
      return hasPermission;
    } catch (error) {
      return false;
    }
  }

  // 添加同步方法，用于检查权限
  public hasPermission(
    paths: string[],
    matchType: 'AND' | 'OR' = 'OR'
  ): boolean {
    if (
      !this.Permissions ||
      this.Permissions.length === 0 ||
      !paths ||
      paths.length === 0
    ) {
      return false;
    }

    if (matchType === 'OR') {
      return paths.some((path) =>
        this.Permissions.some((p) => p.Path === path && p.HasPermission)
      );
    } else {
      return paths.every((path) =>
        this.Permissions.some((p) => p.Path === path && p.HasPermission)
      );
    }
  }

  private evaluateLogic(logic: string, paths: string[]): boolean {
    const pathPermissions = paths.reduce((acc, path) => {
      acc[path] = this.Permissions.some(
        (p) => p.ResourceId === path && p.HasPermission
      );
      return acc;
    }, {} as Record<string, boolean>);

    const expression = logic.replace(/\b[A-Za-z0-9_]+\b/g, (match) => {
      return pathPermissions[match] !== undefined
        ? String(pathPermissions[match])
        : 'false';
    });

    try {
      return eval(expression);
    } catch (error) {
      return false;
    }
  }
}
