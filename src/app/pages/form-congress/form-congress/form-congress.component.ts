import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { ValidateService } from 'src/app/services/validate.service';
import { getDataSS } from 'src/app/storage';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-congress',
  standalone: true,
  imports: [ CommonModule, MaterialModule, ReactiveFormsModule, TablerIconsModule],
  templateUrl: './form-congress.component.html',
  styleUrl: './form-congress.component.scss'
})
export class FormCongressComponent {

  @ViewChild('fileUploader') fileUploader: ElementRef;

  form! : FormGroup;
  passwordForm! : FormGroup;
  user : any;
  selectedImg : File | null = null;
  pathImg :any;
  isLoading : boolean = false;
  passwordVisible = false;
  confirmVisible = false;

  constructor(
              // private router: Router,
              private fb : FormBuilder,
              private authService : AuthService,
              private validatorService : ValidateService,
              private errorService : ErrorService,
              private toastr: ToastrService,
             ) 
{


 }

  ngOnInit(): void {
      this.errorService.closeIsLoading$.pipe(delay(700)).subscribe( (emitted) => { if(emitted){this.isLoading = false}});

      this.user = getDataSS('user')

      this.form = this.fb.group({
        fullName: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
        phone : new FormControl('', [Validators.required]),
        profession : new FormControl('', [Validators.required]),
      });

      this.passwordForm = this.fb.group({
        email: [{ value: this.user.email, disabled: true }],
        password: new FormControl('', [Validators.required, Validators.pattern(this.validatorService.passwordPattern)]),
        confirm:  new FormControl('', [Validators.required]),
      },{
        validators: [this.validatorService.passwordValidator('password','confirm')]
     });
  }



  get f() {
    return this.form.controls;
  }

  get fp() {
    return this.passwordForm.controls;
  }

  onSave() {

    const body = {
      ...this.form.value,
      password: this.passwordForm.get('password')?.value,
      email: this.user.email
     }
    console.log(body);

    this.isLoading = true;
    this.authService.createInscription(body).subscribe(
      ( {success} )=>{
        if(success){
          setTimeout(()=>{  
            this.successToast('Formulario salvo com sucesso');
            this.isLoading = false;
          },1000)
        }
      });
    

    // this.isLoading = true;
  
  }
  

    togglePasswordVisibility(value : string) : void {
      (value == "password") ? this.passwordVisible = !this.passwordVisible : '';
      (value == "confirm") ? this.confirmVisible = !this.confirmVisible : '';
}
 
  
  onFileSelected(event: any) {
    this.selectedImg = event.target.files[0];

    console.log(this.selectedImg);
    this.showPreview();
  }

  showPreview() {
    const reader = new FileReader();
  
    reader.onload = (event: any) => {
      this.pathImg = event.target.result;
    };
  
    if (this.selectedImg) {
      reader.readAsDataURL(this.selectedImg);
    }
  }

  cancelImag(){
    this.selectedImg = null;
    this.pathImg = null;
    // Restablecer el valor del input de archivo
    const fileInput = this.fileUploader.nativeElement;
    fileInput.value = '';
  }

  successToast( msg:string){
    this.toastr.success(msg, 'Sucesso!!', {
      positionClass: 'toast-bottom-right', 
      timeOut: 3500, 
      messageClass: 'message-toast',
      titleClass: 'title-toast'
    });
  }


}
