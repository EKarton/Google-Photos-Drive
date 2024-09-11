import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthRequestIntercepter implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  /**
   * Intercepts the Http request
   * @param req the original request
   * @param next the request handler
   * @returns
   */
  intercept(
    req: HttpRequest<object>,
    next: HttpHandler
  ): Observable<HttpEvent<object>> {
    return next.handle(req).pipe(
      catchError((res: HttpErrorResponse) => {
        if (res.status === 401) {
          const authTokenObservable = this.authService.refreshAccessToken();
          return authTokenObservable.pipe(
            switchMap((accessToken: string) => {
              const newRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${accessToken}`,
                },
              });

              return next.handle(newRequest);
            })
          );
        } else {
          return throwError(() => res);
        }
      })
    );
  }
}
