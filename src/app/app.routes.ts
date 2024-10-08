import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ContentPageComponent } from './pages/content-page/content-page.component';
import { LoginCallbackPageComponent } from './pages/login-callback-page/login-callback-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'auth/login', component: LoginPageComponent },
  { path: 'auth/login/callback', component: LoginCallbackPageComponent },
  { path: 'content/:pathId', component: ContentPageComponent },
  { path: '404', component: NotFoundPageComponent },
  { path: '**', redirectTo: '404' },
];
