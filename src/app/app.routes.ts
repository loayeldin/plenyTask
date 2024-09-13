import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { homeGuard } from './guards/home.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
        
    },

    {
    path:'login',
   
     loadComponent:()=>
     import('./login/login.component').then( (c)=>c.LoginComponent),
     canActivate: [authGuard]
    },

    {
        path:'home',
        
        loadComponent:()=>
        import('./home/home.component').then( (c)=>c.HomeComponent),
        canActivate:[homeGuard]
        
    }
    

];
