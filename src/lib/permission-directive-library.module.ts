import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PermissionDirectiveModule } from './permission-directive.module';
import { ESBPermissionGuard } from './guards/esb.permission.guard';

@NgModule({
  declarations: [
    // 移除 PermissionDirective 的声明
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    PermissionDirectiveModule // 导入包含指令的模块
  ],
  exports: [
    PermissionDirectiveModule // 导出模块而不是直接导出指令
  ],
  providers: [
    ESBPermissionGuard
  ]
})
export class PermissionDirectiveLibraryModule { }
