import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ValidateService } from 'src/app/services/validate.service';
import { ErrorService } from 'src/app/services/error.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './side-register.component.html',
})

export class AppSideRegisterComponent {

  options = this.settings.getOptions();
  showLabel : boolean = false;
  isLoading : boolean = false;

  constructor(
                private settings: CoreService, 
                private router: Router,
                private authService : AuthService,
                private validatorService : ValidateService,
                private errorService : ErrorService
                
             )
  {
    this.errorService.closeIsLoading$.pipe(delay(700)).subscribe( (emitted) => { if(emitted){this.isLoading = false}});

   }

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(this.validatorService.emailPattern)]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {

    this.isLoading = true;

    this.authService.signUp(this.form.value).subscribe( 
      ( {success} )=>{
        if(success){
          this.showLabel = true;
          this.isLoading = false;
          // this.router.navigate(['/dashboards/dashboard1']);
        }
      })

  }
}
