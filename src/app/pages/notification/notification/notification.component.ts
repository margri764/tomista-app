import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';
import { delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { ErrorService } from 'src/app/services/error.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ImagenPathPipe } from "../../../pipe/imagen-path.pipe";
import { UserModalComponent } from '../../user-modal/user-modal/user-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { TypeNotificationPipe } from "../../../pipe/type-notification.pipe";



@Component({
    selector: 'app-notification',
    standalone: true,
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.scss',
    imports: [CommonModule, MaterialModule, TablerIconsModule, ImagenPathPipe, TypeNotificationPipe]
})

export class NotificationComponent implements OnInit {
  
  displayedColumns: string[] = ['img','name', 'notification', 'data', 'action'];
  dataSource: MatTableDataSource<any>;
  isLoading : boolean = false;
  phone : boolean = false;
  users : any[]=[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
                private errorService : ErrorService,
                private notificationService : NotificationService,
                private dialog : MatDialog
             )
  
  {
    this.dataSource = new MatTableDataSource();
    (screen.width < 800) ? this.phone = true : this.phone = false;
      
    this.errorService.closeIsLoading$.pipe(delay(700)).subscribe( (emitted: any) => { if(emitted){this.isLoading = false}});

  }

ngOnInit(): void {
  this.getInitData();
}

getInitData(){
    
  this.isLoading = true;
  this.notificationService.getAllNotifications().subscribe(
    ( {success, notifications} )=>{
      if(success){
        this.dataSource.data = notifications;
        setTimeout(()=>{ this.isLoading = false },1000)
      }
    })

}

deleteNotificationById(notification:any){

  this.notificationService.deleteNotificationById(notification.idnotification).subscribe(
    ( {success} )=>{
      if(success){
        this.getInitData();
      }
    })
}


openDialogUser( user:any) {
  const dialogRef = this.dialog.open(UserModalComponent,{
    maxWidth: (this.phone) ? "99vw": '600px',
    maxHeight: (this.phone) ? "98vh": '800px',
    data: user
  });

  dialogRef.afterClosed().subscribe((result) => {
    console.log(`Dialog result: ${result}`);
  });
}

applyFilter(event: Event) {
  console.log(event);
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
  
}
