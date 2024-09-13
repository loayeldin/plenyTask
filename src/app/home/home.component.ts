import { Component } from '@angular/core';
import { CategoriesComponent } from './categories/categories.component';
import { ProductsComponent } from './products/products.component';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CategoriesComponent,ProductsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  selectedCategory!:string
  constructor(private homeService:HomeService){}
  ngOnInit(){
    this.homeService.selectedCategory.subscribe(data=>{
      this.selectedCategory = data
    })
  }

}
