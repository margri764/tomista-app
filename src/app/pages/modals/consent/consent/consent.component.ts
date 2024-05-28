import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-consent',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './consent.component.html',
  styleUrl: './consent.component.scss'
})
export class ConsentComponent {

}
