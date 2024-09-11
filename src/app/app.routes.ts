import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { ContentComponent } from './content/content.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginCallbackComponent } from './auth/login-callback/login-callback.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/login/callback', component: LoginCallbackComponent },
  { path: 'content', component: ContentComponent },
  { path: '**', component: NotFoundComponent },
];
