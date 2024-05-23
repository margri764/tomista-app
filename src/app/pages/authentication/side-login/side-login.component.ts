import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { AuthService } from 'src/app/services/auth.service';
import { ValidateService } from 'src/app/services/validate.service';
import { ErrorService } from 'src/app/services/error.service';
import { delay } from 'rxjs';
import { saveDataLS } from 'src/app/storage';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-login.component.html',
})

export class AppSideLoginComponent implements OnInit {

  options = this.settings.getOptions();
  isLoading : boolean = false;

  constructor(
              private settings: CoreService, 
              private router: Router,
              private authService : AuthService,
              private validatorService : ValidateService,
              private errorService : ErrorService,
              private cookieService: CookieService,


             ) 
{


 }
  ngOnInit(): void {
      this.errorService.closeIsLoading$.pipe(delay(700)).subscribe( (emitted) => { if(emitted){this.isLoading = false}});
  }

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(this.validatorService.emailPattern)]),
    password: new FormControl('', [Validators.required]),
    rememberCredentials : new FormControl(false)
  });

  get f() {
    return this.form.controls;
  }

  submit() {


    this.isLoading = true;
    this.authService.login(this.form.value).subscribe( 
      ({success, user, token})=>{
        if(success){
          setTimeout(()=>{ 
            this.isLoading = false;
            if(user.role === "user"){
              this.router.navigate(['/formulario']);
            }else if(user.role === "admin"){
              this.router.navigate(['/dashboards/dashboard1']);
            }
          }, 1000)

          const rememberCredentials = this.form.get('rememberCredentials')?.value;
          if(rememberCredentials && user){
              saveDataLS('loggedUser', user);
              if (this.cookieService.check('token')) {
                this.cookieService.delete('token', '/');    
              }
              this.cookieService.set('token', token, {path:'/'});
          } 
       
          
        }
      })
  }
}
