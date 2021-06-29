import { AuthService } from './../services/auth.service';
import { Jwt } from '../models/jwt';
import { catchError, concatMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';

const AUTHORIZATION = 'Authorization';

@Injectable({
  providedIn: 'root'
})
export class ChatInterceptorService implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
    private authService: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this.tokenService.isLogged()) {
      return next.handle(req);
    }

    let intReq = req;
    let token = this.tokenService.getToken();
    if (token == null){
      token = '';
    }

    intReq = this.addToken(req, token);

    return next.handle(intReq).pipe(catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        let tokenFromService = this.tokenService.getToken();
        if(tokenFromService == null){
          tokenFromService = '';
        }
        let dto: Jwt = {token: tokenFromService};
        return this.authService.refresh(dto).pipe(concatMap((data: any) => {
          console.log('refreshing....');
          this.tokenService.setToken(data.token);
          intReq = this.addToken(req, data.token);
          return next.handle(intReq);
        }));
      } else {
        this.tokenService.logOut();
        return throwError(err);
      }
    }));
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
  }
}

export const interceptorProvider = [{ provide: HTTP_INTERCEPTORS, useClass: ChatInterceptorService, multi: true }];