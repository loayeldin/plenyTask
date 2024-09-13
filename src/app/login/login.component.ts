import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Validators,FormControl,FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HomeService } from '../home.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor( private homeSerivce:HomeService){}
  passwordVisible = false;
  loginSub: Subscription = new Subscription(); // Initialize subscription
  // loginForm = new FormGroup(
  //   {
  //     username:new FormControl('oliviaw', [Validators.required]),
  //     password:new FormControl('oliviawpass',[Validators.required])
  //   }
  // )

  loginForm = new FormGroup(
    {
      username:new FormControl('abigailr', [Validators.required]),
      password:new FormControl('abigailrpass',[Validators.required])
    }
  )
  togglePasswordVisibility() { // togglePasswordVisibilityIcon 
    this.passwordVisible = !this.passwordVisible;
  }



  submit(){
    this.loginSub.add(this.homeSerivce.login(this.loginForm.value).subscribe(data=>{
      console.log(data);
      
    })
    )
  }

  ngOnDestroy(): void {
      this.loginSub.unsubscribe()
    
  }
}
