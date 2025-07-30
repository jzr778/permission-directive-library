import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PermissionRequestManagerService {
  private requestsSubject = new Subject<{id: string, data: any}>();
  private allRequestsCompleted = new Subject<void>();
  private activeRequests = new Set<string>();
  private isLoading = new Subject<boolean>();

  // 指令调用此方法注册权限检查请求
  registerRequest(requestId: string): void {
    this.activeRequests.add(requestId);
    if (this.activeRequests.size === 1) {
      this.isLoading.next(true);
    }
  }

  // 指令调用此方法标记权限检查请求完成
  completeRequest(requestId: string, data?: any): void {    
    if (this.activeRequests.has(requestId)) {
      this.activeRequests.delete(requestId);
      this.requestsSubject.next({id: requestId, data});
      
      if (this.activeRequests.size === 0) {
        this.isLoading.next(false);
        this.allRequestsCompleted.next();
      }
    }
  }

  // 监听单个请求完成
  onRequestComplete(): Observable<{id: string, data: any}> {
    return this.requestsSubject.asObservable();
  }

  // 监听所有请求完成
  onAllRequestsCompleted(): Observable<void> {
    return this.allRequestsCompleted.asObservable();
  }

  // 监听加载状态变化
  onLoadingChange(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  // 获取当前活跃请求数
  getActiveRequestCount(): number {
    return this.activeRequests.size;
  }

  // 重置所有请求（用于错误恢复）
  resetRequests(): void {
    this.activeRequests.clear();
    this.isLoading.next(false);
    this.allRequestsCompleted.next();
  }
}