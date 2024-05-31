import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { ImagenPathPipe } from "../../../pipe/imagen-path.pipe";

@Component({
    selector: 'app-user-modal',
    standalone: true,
    templateUrl: './user-modal.component.html',
    styleUrl: './user-modal.component.scss',
    imports: [CommonModule, MaterialModule, ReactiveFormsModule, NgScrollbarModule, RouterModule, TablerIconsModule, ImagenPathPipe]
})
export class UserModalComponent implements OnInit {

  user:any;
  myForm : FormGroup;
  isLoading : boolean = false;
  

  constructor(
               private fb : FormBuilder,
               @Inject(MAT_DIALOG_DATA) public data: any
             )
  {

    this.myForm = this.fb.group({
      fullName: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      phone : new FormControl('', [Validators.required]),
      profession : new FormControl('', [Validators.required]),
      email: [''],
    })
  }

  ngOnInit(): void {
    console.log(this.data);
    this.user = this.data;

    
    this.myForm = this.fb.group({
      fullName: new FormControl(this.data.fullName, [Validators.required]),
      email: new FormControl(this.data.email, [Validators.required]),
      address: new FormControl( this.data.address, [Validators.required]),
      phone : new FormControl(this.data.phone, [Validators.required]),
      profession : new FormControl(this.data.profession, [Validators.required]),
    })
  }

  isTextTruncated(text: string): boolean {
    return text.length > 20; 
  }
  


}
