import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { user } from './interfaces/user.interface';
import { Router } from '@angular/router';
import { products } from './interfaces/products.interface';
import { userCartResponse } from './interfaces/usercartresponse.interface';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class HomeService {
  isLoading  = new BehaviorSubject<boolean>(false)
  cookieCheckInterval !:any; 
  isLoggedIn  = new BehaviorSubject<boolean>(false)
  userLoggedData = new BehaviorSubject<user>({} as user)
  selectedCategory = new BehaviorSubject<string>('all')
  productsData = new BehaviorSubject<products>({})
  searchText = new BehaviorSubject<String>('')
  limit = new BehaviorSubject<number>(9);
  currentPage = new BehaviorSubject<number>(0);
  userCartResponse = new BehaviorSubject<any>({}) 
  constructor(private http:HttpClient,private router:Router,private cookieService: CookieService) {
    
   }


  login(userData:any):Observable<any>
  {
    this.isLoading.next(true); // Set loading to true

   
    
    return this.http.post('https://dummyjson.com/auth/login',userData)
    .pipe(
      tap( resData=>{
       
        this.handleLogin(resData)
        
      }
        
      )
    )
  }




  handleLogin(resData:any){

     
    const newUser:user = resData
    this.userLoggedData.next(newUser) // update the BehaviorSubject with values
    this.isLoggedIn.next(true) 
    this.setCookie(resData) // set data in local cookies
    
   
  }

  setCookie(resData: user) {
    const existingData = this.cookieService.get('userData');
    
    // Check if userData cookie already exists
    if (!existingData) {
      const expiresInMinutes = 60;
      const expires = new Date();
      expires.setTime(expires.getTime() + (expiresInMinutes * 60 * 1000)); // 60 minutes converted to milliseconds

      this.cookieService.set('userData', JSON.stringify(resData), { expires: expires, path: '/' });
      
      
      this.router.navigate(['/home']);
    } else {
      console.log('User data already exists in cookies');
     
  
    }

   
  }
 


getCookieData() {
  const userData = this.cookieService.get('userData');
  

  if (userData) {
    try {
      const newUser: user = JSON.parse(userData);
     
      
      this.isLoggedIn.next(true);
      this.userLoggedData.next(newUser);
      
    } catch (error) {
     
      this.logOut();
    }
  } else {
    
    this.logOut();
  }
}
 

  logOut() {
   
    
    // Clear user data and cookies
    this.userLoggedData.next(<user>({}));
    this.cookieService.delete('userData');
    this.isLoggedIn.next(false);
  
    
   
  }




  getCategoriesList():Observable<any>
  {
      return this.http.get('https://dummyjson.com/products/category-list')
  }

  getAllProducts(limit:number,skip:number):Observable<any>
  {
    
    let params = new HttpParams()
    .set('limit', limit.toString())  
    .set('skip', skip.toString())  
  
    
 

    return this.http.get('https://dummyjson.com/products',
    {
      params
    }
    ) 
  }


  getProductsByCategory(cat:string,limit:number,skip:number):Observable<any>
  {
   
    let params = new HttpParams()
    .set('limit', limit.toString()) 
    .set('skip', skip.toString())  
  
    return this.http.get(`https://dummyjson.com/products/category/${cat}`,{params})
  }

  getProductsBySearch(userInput:string,limit:number,skip:number)
  {
    let params = new HttpParams()
    .set('limit', limit.toString())  
    .set('skip', skip.toString())  
    
    
    return this.http.get(`https://dummyjson.com/products/search?q=${userInput}`,{params})
  }
  updateProductsData(data:products): void {
    this.productsData.next(data);
  }

  getUserCart(userId:number):Observable<any>
  {
    
    

    return this.http.get(`https://dummyjson.com/carts/user/${userId}`)

  }

  updateUserCart(product:{},cartId:number):Observable<any>
  {
    
    
    return this.http.put(`https://dummyjson.com/carts/${cartId}`,{
      merge:true,
      products:[product]
    })
  }


  addNewCart(product:{},userId:number){
    return this.http.post('https://dummyjson.com/carts/add',
    {
      userId:userId,
      products:[product]
    }
    )
  }


}
