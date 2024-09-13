import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  
  const cookieService = inject(CookieService);
  const router = inject(Router);

  const isUserAuth = cookieService.get('userData');
  if (isUserAuth) {
    try{
      console.log('from guard auth true');
      
      router.navigate(['/home']);  // Redirect to home if already authenticated
      return false;
    }
    catch(err)
    {
      return true
    }
  }else{
    console.log('from guard auth false');
    return true;  // Allow access to the login page if not authenticated

  }

};
