import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { ValidateService } from 'src/app/services/validate.service';
import { getDataSS } from 'src/app/storage';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { TakePictureModalComponent } from '../../modals/take-picture-modal/take-picture-modal/take-picture-modal.component';


@Component({
  selector: 'app-form-congress',
  standalone: true,
  imports: [ CommonModule, MaterialModule, ReactiveFormsModule, TablerIconsModule],
  templateUrl: './form-congress.component.html',
  styleUrl: './form-congress.component.scss'
})
export class FormCongressComponent {

  @ViewChild('fileUploader') fileUploader: ElementRef;

  pictureDataUrl: string;
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
              private dialog : MatDialog
             )  
    { }



  ngOnInit(): void {

    // WebcamUtil.getAvailableVideoInputs()
    //   .then((mediaDevices: MediaDeviceInfo[]) => {
    //     this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    //   });


      this.errorService.closeIsLoading$.pipe(delay(700)).subscribe( (emitted) => { if(emitted){this.isLoading = false}});

      this.user = getDataSS('user')

      // this.form = this.fb.group({
      //   fullName: new FormControl('', [Validators.required]),
      //   address: new FormControl('', [Validators.required]),
      //   phone : new FormControl('', [Validators.required]),
      //   profession : new FormControl('', [Validators.required]),
      // });

      this.form = this.fb.group({
        fullName: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
        phone : new FormControl('', [Validators.required]),
        profession : new FormControl('', [Validators.required]),
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

    if (!this.selectedImg) {
      return
    } 

    const body = {
      ...this.form.value,
      // password: this.passwordForm.get('password')?.value,
      // email: this.user.email
     }
    console.log(body);

    this.isLoading = true;
    this.authService.createInscription(body, this.selectedImg).subscribe(
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
   
  openDialog() {
    const dialogRef = this.dialog.open(TakePictureModalComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      
      // Convertir la imagen en base64 a un objeto File y manejarla como un archivo seleccionado
      const file = this.base64ToFile(result, 'captured-image.png');
      this.onFileSelected({ target: { files: [file] } });
    });
  }

  base64ToFile(base64: string, filename: string): File {
    const arr : any [] = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
  
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
  
    return new File([u8arr], filename, { type: mime });
  }
  
  
  onFileSelected(event: any) {
    this.selectedImg = event.target.files[0];
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
