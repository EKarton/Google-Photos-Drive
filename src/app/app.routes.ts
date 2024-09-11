import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ContentComponent } from './pages/content/content.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginCallbackComponent } from './pages/auth/login-callback/login-callback.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/login/callback', component: LoginCallbackComponent },
  { path: 'content/:pathId', component: ContentComponent },
  { path: '**', component: NotFoundComponent },
];
