import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { ValidateService } from 'src/app/services/validate.service';
import { getDataSS } from 'src/app/storage';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { TakePictureModalComponent } from '../../modals/take-picture-modal/take-picture-modal/take-picture-modal.component';
import { ConsentComponent } from '../../modals/consent/consent/consent.component';
import { MatTabGroup } from '@angular/material/tabs';
import { PaymentService } from 'src/app/services/payment.service';
import { ImagenPathPipe } from 'src/app/pipe/imagen-path.pipe';
import { MoreInfoComponent } from "../../more-info/more-info/more-info.component";
import Swal from 'sweetalert2';



interface User {
    fullName: string,
    address: string;
    phone: string;
    profession: string;
    email: string;
    filePath: string,
    payment : string
}

@Component({
    selector: 'app-form-congress',
    standalone: true,
    templateUrl: './form-congress.component.html',
    styleUrl: './form-congress.component.scss',
    imports: [CommonModule, MaterialModule, ReactiveFormsModule, TablerIconsModule, ImagenPathPipe, MoreInfoComponent]
})

export class FormCongressComponent {

  @ViewChild('fileUploader') fileUploader: ElementRef;
  @ViewChild('top') top: ElementRef;
  @ViewChild('topMain') topMain: ElementRef;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  changeTab(index: number): void {
    this.isLoading = true;
    setTimeout(()=>{
      this.isLoading = false;
    } ,1500)
    this.tabGroup.selectedIndex = index;
    this.goToTop();
  }

  pictureDataUrl: string;
  myForm! : FormGroup;
  myFormPayment! : FormGroup;
  passwordForm! : FormGroup;
  user : any;
  selectedImg : File | null = null;
  pathImg : string | null;
  isLoading : boolean = false;
  passwordVisible = false;
  confirmVisible = false;
  phone : boolean = false;
  public isFileInputDisabled = true;
  consent : boolean = false;
  isEditing : boolean = false;
  showChecked : boolean = false;
  conference : any;
  payment : any;
  blockPayment : boolean = false;

  constructor(
              // private router: Router,
              private fb : FormBuilder,
              private authService : AuthService,
              private validatorService : ValidateService,
              private errorService : ErrorService,
              private paymentService : PaymentService,
              private toastr: ToastrService,
              private dialog : MatDialog
             )  
    { 
      (screen.width < 800) ? this.phone = true : this.phone = false;
    }
    
    
    
    ngOnInit(): void {

   


      this.errorService.closeIsLoading$.pipe(delay(700)).subscribe( (emitted) => { if(emitted){this.isLoading = false}});

      this.checkIfUserExist();

      this.myForm = this.fb.group({
        fullName: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
        phone : new FormControl('', [Validators.required]),
        profession : new FormControl('', [Validators.required]),
        email: [''],
        conditions:  new FormControl(false, [Validators.requiredTrue]),
        age:  new FormControl(false, [Validators.requiredTrue]),
        consent:  new FormControl(false, [Validators.requiredTrue]),
       
      });
      
      this.myFormPayment = this.fb.group({
        fullNamePayment: new FormControl( '', [Validators.required]),
        emailPayment: new FormControl('', [Validators.required]),
        price: new FormControl('300', [Validators.required]),
        // cpf:  new FormControl('', [Validators.required]),
        cpf:  new FormControl('05693810615', [Validators.required]),
        payment:  new FormControl('', [Validators.required]),

      });

     
  }



   checkIfUserExist(){
     
     let userSS = getDataSS('user');
     
     if(userSS){
       this.paymentService.getUserByEmail(userSS.email).subscribe(
         ( {success, user, conference, payment} )=>{

            this.conference = conference;
            this.payment = payment;
           if(success){
             this.user = user;
             this.setUserData(user);

            }else{
              this.user = userSS;
          }
        })
     }else{

     }

    //  const fullName = this.myForm.get('fullName')?.value;
    
   }


  get f() {
    return this.myForm.controls;
  }

  get fp() {
    return this.myFormPayment.controls;
  }

  setUserData( user:User ){

    this.isEditing = true;

    if( this.conference ){

      this.conference.forEach((element: any) => {
        if(element.name === 'tomista'){
          this.blockPayment = true;
        }
      }); 

    }  

    this.myForm.patchValue({
      fullName : user.fullName,
      email : user.email,
      address: user.address,
      phone : user.phone,
      profession : user.profession,
      conditions:  true,
      age:  true,
      consent:  true,
    })

    this.myFormPayment.patchValue({
      fullNamePayment : user.fullName,
      emailPayment : user.email,
      payment : (this.payment) ? this.payment.paymentOption : null
    })

    this.pathImg = user.filePath;
    
  }

  onSave() {

    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched(); 
      return;
    }



    console.log(this.selectedImg, this.pathImg );
    

    if (!this.selectedImg && !this.pathImg  ) {
      this.warningToast('Sua foto de perfil é obrigatória');
      return;
    } 

    let body = {
      ...this.myForm.value,
      email: this.user.email
     }

     if(!this.selectedImg){
      body = { ...body, filePath: this.pathImg }
    }
    
     const { confirm, age, consent, conditions, ...bodyWithout } = body;

    this.isLoading = true;
    this.authService.createProfile(bodyWithout, this.selectedImg).subscribe(
      ( {success} )=>{
        if(success){
          this.changeTab(1);

          this.myFormPayment.patchValue({
            fullNamePayment : this.myForm.get('fullName')?.value,
            emailPayment : this.myForm.get('email')?.value,
          })
          setTimeout(()=>{  
            this.successToast('Formulario salvo com sucesso');
            this.isLoading = false;
          },1000)
        }
      });
    

    // this.isLoading = true;
  
  }

  onSavePayment() {

    console.log(this.myFormPayment.value);
    
    if (this.myFormPayment.invalid) {
      this.myFormPayment.markAllAsTouched(); 
      return;
    }

    const body = {
      fullName: this.myFormPayment.get('fullNamePayment')?.value,
      paymentOption: this.myFormPayment.get('payment')?.value,
      price: this.myFormPayment.get('price')?.value,
      cpf: this.myFormPayment.get('cpf')?.value,
      email: this.myFormPayment.get('emailPayment')?.value,
     }


    this.isLoading = true;
    this.paymentService.createPayment(body).subscribe(
      ( {success} )=>{
        if(success){
          setTimeout(()=>{  
            this.showSuccessAlert('Sua fatura foi enviada com sucesso','Verifique seu e-mail');
            this.isLoading = false;
            this.blockPayment = true;
          },1000)
        }
      });
  }

  showSuccessAlert(title:string, subtitle : string){
    Swal.fire({
      title: title,
      text:subtitle,
      icon: "success"
    });
  }

  checkCPF() {

    this.showChecked = false;
    const cpf = this.myFormPayment.get('cpf');
    console.log(cpf);
  
    if (cpf && cpf.value !== '') {
      const isValidCPF = this.paymentService.validaCPF(cpf.value);
  
      if (!isValidCPF) {
        cpf.setErrors({ 'invalidCPF': true });
      } else {
        cpf.setErrors(null); // Limpiar errores si el CPF es válido
        this.showChecked = true;
        // this.cpf = cpf.value;
   
      }
    }
  }

  get validateNumberCount() : string {
    const errors = this.myFormPayment.get('cpf')?.errors;
    if ( errors?.['invalidCPF'] ) {
      return 'CPF inválido';
    }
    
    return '';
  }
  
  togglePasswordVisibility(value : string) : void {
      (value == "password") ? this.passwordVisible = !this.passwordVisible : '';
      (value == "confirm") ? this.confirmVisible = !this.confirmVisible : '';
  }
   
  openDialog() {
    const dialogRef = this.dialog.open(TakePictureModalComponent,{
      maxWidth: (this.phone) ? "98vw": '',
      panelClass: "custom-modal-picture"
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      
      // Convertir la imagen en base64 a un objeto File y manejarla como un archivo seleccionado
      const file = this.base64ToFile(result, 'captured-image.png');
      this.onFileSelected({ target: { files: [file] } });
    });
  }

  openDialogConsent() {

    setTimeout(()=>{ this.myForm.get('consent')?.setValue(null) }, 100)

    const dialogRef = this.dialog.open(ConsentComponent,{
      disableClose: true, 
    });

    dialogRef.afterClosed().subscribe((result) => {

      if(result){
        this.myForm.get('consent')?.setValue(true);
        this.consent = true;
      }else{
        this.consent = false;
      }
     
    });
  }

  goToTop(){
    setTimeout( () => {
      this.top.nativeElement.scrollIntoView(
      { 
        alignToTop: true,
        block: "center",
      });
     }
    )
  }

  goToTopMain(){
    setTimeout( () => {
      this.topMain.nativeElement.scrollIntoView(
      { 
        alignToTop: true,
        block: "center",
      });
     }
    )
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

  warningToast( msg:string){
    this.toastr.warning(msg, 'Sucesso!!', {
      positionClass: 'toast-bottom-right', 
      timeOut: 3500, 
      messageClass: 'message-toast',
      titleClass: 'title-toast'
    });
  }


}
