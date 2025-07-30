import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionDirective } from './directives/permission.directive';
import { UserConfigService } from './services/user-config.service';
import { ESBPermissionsService } from './services/esb.permissions.service';
import { PermissionRequestManagerService } from './services/permission-request-manager.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PermissionDirective,
  ],
  exports: [
    PermissionDirective,
  ],
  providers: [
    ESBPermissionsService,
    PermissionRequestManagerService
  ],
})
export class PermissionDirectiveModule { }

