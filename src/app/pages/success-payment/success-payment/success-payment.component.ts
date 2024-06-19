import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-success-payment',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './success-payment.component.html',
  styleUrl: './success-payment.component.scss'
})
export class SuccessPaymentComponent implements OnInit {

  constructor(
            ) { }


  ngOnInit(): void {



  }






  

}
