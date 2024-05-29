import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { ErrorService } from 'src/app/services/error.service';
import { PaymentService } from 'src/app/services/payment.service';
import { ImagenPathPipe } from "../../../pipe/imagen-path.pipe";
import { PaymentStatusPipe } from "../../../pipe/payment-status.pipe";
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
    selector: 'app-participants',
    standalone: true,
    templateUrl: './participants.component.html',
    styleUrl: './participants.component.scss',
    animations: [
      trigger('detailExpand', [
        state('collapsed,void', style({height: '0px', minHeight: '0'})),
        state('expanded', style({height: '*'})),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
    ],
    imports: [CommonModule, MaterialModule, ImagenPathPipe, PaymentStatusPipe]
})
export class ParticipantsComponent {

  displayedColumns: string[] = ['img', 'name', 'address', 'conference', 'paymentOption', 'paymentStatus'];
  dataSource: MatTableDataSource<any>;
  isLoading : boolean = false;
  payments : any[]=[];



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
              private errorService : ErrorService,
              private paymentService : PaymentService

             ) 
  {

    this.errorService.closeIsLoading$.pipe(delay(700)).subscribe( (emitted: any) => { if(emitted){this.isLoading = false}});

    this.getInitData();
  }
  
  getInitData(){
    
    this.isLoading = true;
    
    this.paymentService.getAllPayments().subscribe(
      ( {success, payments} )=>{
        if(success){
          this.payments = payments;
          this.dataSource = new MatTableDataSource(payments);
          setTimeout(()=>{this.isLoading = false },1000)

        }
      })

  }

  ngAfterViewInit() {
    // Configurar paginación y ordenamiento
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



}
