import { Component, ElementRef, Renderer2 } from '@angular/core';
import { HomeService } from '../../home.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {

  selectedCategory!:string 
  constructor(private homeSerivce:HomeService,private el:ElementRef,private renderer:Renderer2){}
  categories!:any
  
  ngOnInit(){
    this.homeSerivce.getCategoriesList().subscribe(data=>{

      this.categories = data
      console.log(this.categories);
      



    },
    error=>{
      console.log(error);
      
    }
    )



    // get the default value for selected category
    this.homeSerivce.selectedCategory.subscribe(data=>{
      this.selectedCategory = data
    })

  }







// to change the products instat when user select category
  onCategoryChange(){
    const pageLimit = this.homeSerivce.limit.value
    // update the selected category in service first
    this.homeSerivce.selectedCategory.next(this.selectedCategory)
    this.openFilterCat()

 
    this.homeSerivce.currentPage.next(0)
    if(this.selectedCategory=='all'){
      // call getallprodcust method if user selet 'all' and update products data in service

      this.homeSerivce.getAllProducts(pageLimit,0).subscribe(data=>{
        this.homeSerivce.productsData.next(data)
      })

    }else{
      // call products by category method and update products data in service
      this.homeSerivce.getProductsByCategory(this.selectedCategory,pageLimit,0).subscribe(data=>{
        this.homeSerivce.productsData.next(data)
        
        
      })

    }
    
  }



  openFilterCat() {
    const catContainer = this.el.nativeElement.querySelector('.category-container');
  
    
    if (catContainer.classList.contains('show')) {
      // hide elements
      this.renderer.removeClass(catContainer, 'show');
 
    } else {
      // Show elements
      this.renderer.addClass(catContainer, 'show');
    
    }
  }


}
