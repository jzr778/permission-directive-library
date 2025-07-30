import {
  Directive,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { DirectiveConfig, PermissionConfig } from '../models/directive-config';
import { UserConfigService } from '../services/user-config.service';
import { ESBPermissionsService } from '../services/esb.permissions.service';
import { PermissionRequestManagerService } from '../services/permission-request-manager.service';
import { Subscription } from 'rxjs';
import { AuthorizationType } from '../../public-api';

@Directive({
  selector: '[permissionDirective]',
})
export class PermissionDirective implements OnInit, OnChanges {
  @Input() permissionDirective: DirectiveConfig;
  @Input() permissionId: string;

  private isPermissionsLoaded = false;
  private requestId: string;
  private configLoaded = false;
  private configSubscription: Subscription;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionsService: ESBPermissionsService,
    private renderer: Renderer2,
    private el: ElementRef,
    private userConfig: UserConfigService,
    private requestManager: PermissionRequestManagerService
  ) {}

  ngOnInit(): void {
    this.requestId =
      this.permissionId ||
      `perm_${Math.random().toString(36).substring(2, 11)}`;

    // 先订阅配置变化
    this.configSubscription = this.userConfig.config$.subscribe((config) => {
      this.configLoaded = true;
      this.checkAndApplyPermissions();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['permissionDirective'] &&
      !changes['permissionDirective'].firstChange
    ) {
      this.checkAndApplyPermissions();
    }
  }

  ngOnDestroy(): void {
    //   // 确保请求被标记为完成
    //   this.requestManager.completeRequest(this.requestId);
    //   // 取消订阅
    //   if (this.configSubscription) {
    //     this.configSubscription.unsubscribe();
    //   }
  }

  private async checkAndApplyPermissions(): Promise<void> {
    // 如果配置尚未加载，则跳过
    if (!this.configLoaded) {
      return;
    }

    this.requestManager.registerRequest(this.requestId);
    try {
      if (!this.permissionDirective) {
        this.viewContainer.clear();
        this.viewContainer.createEmbeddedView(this.templateRef);
        return;
      }

      if (!this.isPermissionsLoaded) {
        const permissions = await this.permissionsService
          .GetPermissions()
          .toPromise();
        if (!permissions || permissions.length === 0) {
          console.warn('No permissions loaded for user');
          this.isPermissionsLoaded = false;
          return;
        }
        this.isPermissionsLoaded = true;
      }

      await this.applyPermissionConfig(this.permissionDirective);
    } catch (error) {
      console.error('Permission check error:', error);
    } finally {
      this.requestManager.completeRequest(this.requestId);
    }
  }

  private async checkVisibleConfig(config?: PermissionConfig) {
    if (config) {
      const hasVisiblePermission = await this.checkPermission(config);
      // 清除视图容器，防止重复创建
      this.viewContainer.clear();

      if (hasVisiblePermission) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }

      // 如果元素不可见，就不需要处理其他属性了
      if (!hasVisiblePermission) {
        return;
      }
    }
  }

  private async checkHiddenConfig(config?: PermissionConfig) {
    if (config) {
      const hasHiddenPermission = await this.checkPermission(config);

      try {
        if (!hasHiddenPermission) {
          this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
          return; // 如果元素被隐藏，就不需要处理其他属性了
        } else {
          this.renderer.removeStyle(this.el.nativeElement, 'display');
        }
      } catch (error) {
        console.warn('Failed to set display style:', error);
      }
    }
  }

  private async checkDisabledConfig(config?: PermissionConfig) {
    if (config) {
      const hasDisabledPermission = await this.checkPermission(config);

      try {
        if (!hasDisabledPermission) {
          this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
        } else {
          this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
        }
      } catch (error) {
        console.warn('Failed to set disabled attribute:', error);
      }
    }
  }

  private async checkReadonlyConfig(config?: PermissionConfig) {
    if (config) {
      const hasReadonlyPermission = await this.checkPermission(config);

      try {
        if (!hasReadonlyPermission) {
          this.renderer.setAttribute(this.el.nativeElement, 'readonly', 'true');
        } else {
          this.renderer.removeAttribute(this.el.nativeElement, 'readonly');
        }
      } catch (error) {
        console.warn('Failed to set readonly attribute:', error);
      }
    }
  }

  private async applyPermissionConfig(config: DirectiveConfig): Promise<void> {
    if (config.disabledConfig && !config.disabledConfig.authorizationType) {
      config.disabledConfig.authorizationType = AuthorizationType.UseLoginUser;
    }
    if (config.visibleConfig && !config.visibleConfig.authorizationType) {
      config.visibleConfig.authorizationType = AuthorizationType.UseLoginUser;
    }
    if (config.hiddenConfig && !config.hiddenConfig.authorizationType) {
      config.hiddenConfig.authorizationType = AuthorizationType.UseLoginUser;
    }
    if (config.readonlyConfig && !config.readonlyConfig.authorizationType) {
      config.readonlyConfig.authorizationType = AuthorizationType.UseLoginUser;
    }
    await this.checkVisibleConfig(config.visibleConfig);
    // 处理隐藏状态
    await this.checkHiddenConfig(config.hiddenConfig);

    // 处理禁用状态
    await this.checkDisabledConfig(config.disabledConfig);

    // 处理只读状态
    await this.checkReadonlyConfig(config.readonlyConfig);
  }

  private async checkPermission(config: PermissionConfig): Promise<boolean> {
    if (!this.isPermissionsLoaded || !config.Paths) {
      return false;
    }

    try {
      return await this.permissionsService.checkPermission(config);
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }
}
