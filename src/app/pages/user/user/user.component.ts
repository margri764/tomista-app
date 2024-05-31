import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { delay } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { ErrorService } from 'src/app/services/error.service';
import { ImagenPathPipe } from "../../../pipe/imagen-path.pipe";
import { PaymentStatusPipe } from "../../../pipe/payment-status.pipe";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserModalComponent } from '../../user-modal/user-modal/user-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { NgScrollbarModule } from 'ngx-scrollbar';

interface User {
  img : string, 
  name: string, 
  address: string,
  role: string
}


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, MatSortModule , MaterialModule, ImagenPathPipe, PaymentStatusPipe, RouterModule, ReactiveFormsModule, NgScrollbarModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {


  displayedColumns: string[] = ['img','fullName','address','role'];
  dataSource: MatTableDataSource<User>;
  isLoading : boolean = false;
  phone : boolean = false;
  users : any[]=[];
  toppings = new FormControl('');
  toppingList: string[] = ['user', 'admin'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  

  constructor(
              private errorService : ErrorService,
              private authService : AuthService,
              private activatedRoute : ActivatedRoute,
              public toastr: ToastrService,
              private dialog : MatDialog

             ) 
  {

    this.activatedRoute.params.subscribe(
      ( {id} )=>{ console.log(id)});

      this.dataSource = new MatTableDataSource();

      (screen.width) ? this.phone = true : this.phone = false;
      
      this.errorService.closeIsLoading$.pipe(delay(700)).subscribe( (emitted: any) => { if(emitted){this.isLoading = false}});

    this.getInitData();
  }
  
  getInitData(){
    
    this.isLoading = true;
    this.authService.getAllUsers().subscribe(
      ( {success, users} )=>{
        if(success){
          this.users = users;
          this.dataSource.data = users;
          setTimeout(()=>{ this.isLoading = false },1000)

        }
      })

  }

  onRoleChange(selectedRole: any, id:any) {

    this.isLoading = true;

    const body = { role : selectedRole}

    this.authService.changeRole( id, body).subscribe(
      ({success})=>{
        if(success){
          this.successToast('Função atribuída com sucesso');
          setTimeout(()=>{ this.isLoading = false }, 1000)
          this.getInitData();
        }
      })
  
  }

  ngAfterViewInit() {
    // Configurar paginación y ordenamiento
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

      
  successToast( msg:string){
    this.toastr.success(msg, 'Sucesso!!', {
      positionClass: 'toast-bottom-right', 
      timeOut: 3500, 
      messageClass: 'message-toast',
      titleClass: 'title-toast'
    });
  }



}
