
import { Injectable  } from '@angular/core';
import {
  HttpHeaders,
  HttpClient,
  HttpParams,
  HttpRequest,

} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class HttpClientService {



  constructor(private http: HttpClient,private router: Router) { }



  httpPost(url: string, data: any, searchparams?: HttpParams): Observable<any> {
    // var agent = {
    //   PrincipleName: this.user.Agent.PrincipleName,
    //   Code: this.user.Agent.PrincipalCode,
    //   DisplayName: this.user.Agent.PrincipalName,
    // }
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'Accept': 'application/json;charset=utf-8',
        // Authorization: 'Bearer'+' '+this.user.accessToken,
        // AgentAuthorization:  btoa(encodeURIComponent(JSON.stringify(this.getAgent()))),
        // TimeZone: btoa(encodeURIComponent(JSON.stringify(this.getTimeZone()))),
        "OriginalType":"1"
      }),
      params: searchparams
    };
    return this.http.post(url, data, options).pipe(
      catchError(this.handleError) // then handle the error
    );
  }

  


  httpPut(url: string, data: any, searchparams?: HttpParams): Observable<any> {
    // var agent = {
    //   PrincipleName: this.user.Agent.PrincipleName,
    //   Code: this.user.Agent.PrincipalCode,
    //   DisplayName: this.user.Agent.PrincipalName,
    // }
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'Accept': 'application/json;charset=utf-8',
        // Authorization: 'Bearer'+' '+this.user.accessToken,
        // AgentAuthorization:  btoa(encodeURIComponent(JSON.stringify(this.getAgent()))),
        // TimeZone: btoa(encodeURIComponent(JSON.stringify(this.getTimeZone()))),
        // "OriginalType":"1"
        // 'principleName': this.user.principleName,
        // 'token': this.user.TokenId,
        // 'code': this.user.employeeCode,
        // 'displayName': this.user.DisplayName,
        // OperatorCode: this.user.OperatorCode,
        // OperatorName: this.user.OperatorName,
        // OperatorDisplayName: this.user.OperatorDisplayName,
      }),
      params: searchparams
    };
    return this.http.put(url, data, options).pipe(
      catchError(this.handleError) // then handle the error
    );
  }



  handleError=(error: any) =>{

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      return throwError(error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
      if(error.status == 401)//return 401 when authentication failed
      {
        sessionStorage.setItem('RedirectUrl', this.router.url);
        this.router.navigate(['/login']);
      }
      if (error.status != 500) {
        return throwError({status:error.status,message:error.message});
      }
    }
    return throwError({status:error.status,message:error.error.ExceptionMessage?error.error.ExceptionMessage:error.error.exceptionMessage});
  }

  // private getAgent(){
  //   var agent = {
  //     PrincipleName: this.user.Agent.PrincipleName,
  //     Code: this.user.Agent.PrincipalCode,
  //     DisplayName: this.user.Agent.PrincipalName,
  //   }
  //   return agent;
  // }

  private getTimeZone(){
    var timeZone = {
      TimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      Offset: new Date().getTimezoneOffset(),
    }
    return timeZone;
  }

}
