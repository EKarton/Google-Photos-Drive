import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { LoginCallbackComponent } from './login-callback/login-callback.component';
import { AuthService } from './auth.service';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AuthRequestIntercepter } from './AuthRequestIntercepter';

@NgModule({
  imports: [CommonModule, LoginComponent, LoginCallbackComponent],
  exports: [LoginComponent, LoginCallbackComponent],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthRequestIntercepter,
      multi: true,
    },
  ],
})
export class AuthModule {}
