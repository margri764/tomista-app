import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-more-info',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './more-info.component.html',
  styleUrl: './more-info.component.scss'
})
export class MoreInfoComponent {

  phone : boolean = false;

  constructor()
  {
    (screen.width < 800) ? this.phone = true : this.phone = false;
  }

}
