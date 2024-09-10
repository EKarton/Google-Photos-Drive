import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { LoginCallbackComponent } from './login-callback/login-callback.component';
import { AuthService } from './auth.service';

@NgModule({
  imports: [CommonModule, LoginComponent, LoginCallbackComponent],
  exports: [LoginComponent, LoginCallbackComponent],
  providers: [AuthService],
})
export class AuthModule {}
