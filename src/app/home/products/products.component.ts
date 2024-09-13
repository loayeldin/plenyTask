import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HomeService } from '../../home.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  productsData!:any
  limit!: number;
  currentPage!: number;
  total: number = 0;
  totalPages: number = 0;
  pages: (number | any)[] = []; 

  constructor(private homeService:HomeService){}

  ngOnInit(){
 

    this.homeService.currentPage.subscribe(data=>{
      this.currentPage = data
    })
    this.homeService.limit.subscribe(data=>{
      this.limit = data
    })

    // subscribe on products data to update the products if user make changes
    this.homeService.productsData.subscribe(data=>{
      this.productsData = data
      console.log(data);
      this.total = this.productsData.total;
      this.totalPages = Math.ceil(this.total / this.limit);

      this.createPagination(this.totalPages, this.currentPage);


    })
    this.getProducts()


  }

  calcRealPrice(Price: number, discount: number)
  {
    const realPrice = Price - (Price * (discount / 100))
    return realPrice.toFixed(2);
  }





  getProducts(): void {
    // user current page to calc how many products should skip 
    const skip = this.currentPage * this.limit;
    if (this.homeService.selectedCategory.value === 'all' && this.homeService.searchText.value ==='') {
      this.homeService.getAllProducts(this.limit, skip).subscribe(data => {
        this.homeService.updateProductsData(data);
      });
    }
    else if (this.homeService.selectedCategory.value && this.homeService.searchText.value ==='') {
      this.homeService.getProductsByCategory(this.homeService.selectedCategory.value, this.limit, skip).subscribe(data => {
        this.homeService.updateProductsData(data);
        console.log('wwwwwwwwwwwwwwwww');
        
      });
    } 
    else if (this.homeService.searchText) {
      this.homeService.getProductsBySearch(this.homeService.searchText.value as string, this.limit, skip).subscribe(data => {
        this.homeService.updateProductsData(data);
      });
    }
  
  }






  createPagination(totalPages: number, page: number): void {
    console.log(this.currentPage);

    let liTag = [];
    let beforePage = page - 1;
    let afterPage = page + 1;

    // Add "Prev" button
    if (page > 0) {
        liTag.push({ label: 'Prev', value: page - 1, type: 'btn' });
    }

    // Add "1" button and ellipsis before the current page if necessary
    if (page > 1) {
        liTag.push({ label: 1, value: 0, type: 'numb' });
        if (page > 2) {
            liTag.push({ label: '...', type: 'dots' });
        }
    }

    // Adjust how many pages are shown before and after the current page
    if (page >= totalPages - 1) {
        beforePage = Math.max(totalPages - 5, 0);
        afterPage = totalPages - 1;
    } else if (page <= 1) {
        beforePage = 0;
        afterPage = Math.min(4, totalPages - 1);
    } else {
        beforePage = Math.max(page - 1, 0);
        afterPage = Math.min(page + 1, totalPages - 1);
    }

    // Add pages before and after the current page
    for (let i = beforePage; i <= afterPage; i++) {
        if (i >= 0 && i < totalPages) {
            liTag.push({
                label: i + 1,
                value: i, 
                type: 'numb',
                active: page === i
            });
        }
    }

    // Add ellipsis and last page if necessary
    if (afterPage < totalPages - 2) {
        liTag.push({ label: '...', type: 'dots' });
    }

    if (afterPage < totalPages - 1) {
        liTag.push({
            label: totalPages, 
            value: totalPages - 1, 
            type: 'numb'
        });
    }

    // Add "Next" button
    if (page < totalPages - 1) {
        liTag.push({ label: 'Next', value: page + 1, type: 'btn' });
    }

    this.pages = liTag;
}


  goToPage(page: number): void {
    this.currentPage = page;
    this.getProducts()
    this.createPagination(this.totalPages, this.currentPage);
  }

  isNumber(value: any): boolean {
    return typeof value === 'number';
  }




  addtoCart(index:number){
    console.log(index);
    
    const product = {
      id:this.productsData.products[index].id,
      quantity:1
    }

    this.homeService.userCartResponse.subscribe(data=>{

      //check if user has cart already or create new cart
      if(data.total==0){
        const userId = this.homeService.userLoggedData.value.id
        this.homeService.addNewCart(product,userId).subscribe(data=>{
          console.log(data,'new cart created');
          
        })
        
        
      }else{
        const cart = data
        const cartId = cart.carts[0].id
        
        
        
        this.homeService.updateUserCart(product,cartId).subscribe(data=>{
          console.log(data, 'updated succ');
          
        })
        
      }
    })
    
  }

}
