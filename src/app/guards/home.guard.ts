import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const homeGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const isUserAuth = cookieService.get('userData')
  const router = inject(Router)
  if(isUserAuth){
   try
   {
    return true
   }
   catch(err)
  {
     console.log('from sadasda');
     
    router.navigate(['/login']);
    return false
  }  

}
  router.navigate(['/login']);
  return false


};
