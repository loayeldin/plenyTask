import { Component, ElementRef, Renderer2 } from '@angular/core';
import { HomeService } from '../home.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
 
  constructor(private homeSerivce:HomeService,private el: ElementRef ,private renderer: Renderer2){}
  userCartLength!:number
  loggedIn:boolean = false
  loginSubscriptions: Subscription = new Subscription();

  userId!:number
  isLoaded:boolean = false
  ngOnInit(){
    
      
    this.loginSubscriptions = 
        this.homeSerivce.isLoggedIn.subscribe(data=>{
          this.loggedIn = data
          
          this.isLoaded = false
          if(this.loggedIn)
          {
              // get user id from service
            const userId = this.homeSerivce.userLoggedData.value.id

            // get user cart length
            this.homeSerivce.getUserCart(userId).subscribe(data=>{

              if(data.carts.length !==0){
                this.userCartLength = data.carts[0].totalProducts
              }else{
                this.userCartLength =0
              }
            
              this.homeSerivce.userCartResponse.next(data)

              this.isLoaded = true
            })
          }else{
        
          
      
          this.isLoaded = true
          }



      
        
        })

   
   
   
  

  }







  search(event: Event): void {
    const currentPage = 0
    const pageLimit = this.homeSerivce.limit.value
    const inputValue = (event.target as HTMLInputElement).value;

    // set selected cat to default value
    this.homeSerivce.selectedCategory.next('all')
    //update search text in service 
    this.homeSerivce.searchText.next(inputValue)
    // set current page to default (0)
    this.homeSerivce.currentPage.next(0) 
    this.homeSerivce.getProductsBySearch(inputValue,pageLimit,currentPage).subscribe(data=>{
     
      
      // update products data
      this.homeSerivce.updateProductsData(data)
      
     })
    
  }

  openNav() {
    const rightside = this.el.nativeElement.querySelector('.right-side');
    const leftside = this.el.nativeElement.querySelector('.left-side');
  
    
    if (rightside.classList.contains('show') && leftside.classList.contains('show')) {
      // hide elements
      this.renderer.removeClass(rightside, 'show');
      this.renderer.removeClass(leftside, 'show');
    } else {
      // Show elements
      this.renderer.addClass(rightside, 'show');
      this.renderer.addClass(leftside, 'show');
    }
  }
  ngOnDestroy() {
    this.loginSubscriptions.unsubscribe();
  }

}
