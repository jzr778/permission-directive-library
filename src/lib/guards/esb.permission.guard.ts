import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { filter, Observable, take } from 'rxjs';
import { ESBPermissionsService } from '../services/esb.permissions.service';
import { PermissionConfig } from '../models/directive-config';
import { UserConfigService } from '../services/user-config.service';

@Injectable({
  providedIn: 'root',
})
export class ESBPermissionGuard implements CanActivate {
  constructor(
    private permissionsService: ESBPermissionsService,
    private router: Router,
    private userConfigService: UserConfigService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkPermission(route, state);
  }

  private async checkPermission(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    if (
      (route.routeConfig && route.routeConfig.path === 'blank') ||
      route.routeConfig?.path === ''
    ) {
      return true;
    }

    // 等待 config 加载完成
    await this.userConfigService.userReady$
      .pipe(
        filter((ready) => ready),
        take(1)
      )
      .toPromise();

    const config = await this.userConfigService.config$
      .pipe(take(1))
      .toPromise();

    const permissionConfig = route.data['permission'] as PermissionConfig;
    if (!permissionConfig || !permissionConfig.Paths) {
      return true;
    }

    const hasPermission = await this.permissionsService.checkPermission(
      permissionConfig
    );
    if (hasPermission) {
      return hasPermission;
    }

    const redirectUrl =
      route.data['redirectUrl'] || this.userConfigService.defaultRedirectUrl;
    return this.router.createUrlTree([redirectUrl]);
  }
}

