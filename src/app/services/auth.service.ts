import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { saveDataSS } from '../storage';
import { ErrorService } from './error.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // closeLoginWebmaster$ : EventEmitter<boolean> = new EventEmitter<boolean>; 

  // user! : User;
  user! : any;
  private baseUrl = environment.baseUrl;
  notAnswer : boolean = true;

  constructor(
                private http : HttpClient,
                private errorService : ErrorService,
                private cookieService: CookieService,
             ) 
  {

   }


  login( body:any){
 
    this.errorService.closeNotAnswerLogin$.subscribe( (emmited)=>{ if(emmited){ this.notAnswer = false} })

    const intervalId = setInterval(() => {
      if (this.notAnswer) {
          this.showErrorSwal("Está demorando muito, por favor aguarde...", "O serviço de mensagens está demorando muito para enviar o e-mail","")
      }
      clearInterval(intervalId); 
    }, 10000); 

    return this.http.post<any>(`${this.baseUrl}api/auth/login`, body) 
    .pipe(
      tap( ( {user, success }) =>{
            this.notAnswer = false;
            if(success ){
              this.user = user;
              const userToSS = { name: user.Nome_Completo, role:user.role, email: user.email,};
              saveDataSS('user', userToSS);
              saveDataSS('session', "true");

            }
          }  
      ),            
      map( res => {console.log("from login Service: ",res);return res} )
    )
  }

  checkJsonWebToken( token:any ){

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.post<any>(`${this.baseUrl}api/auth/checkJsonWebToken`, null ,{headers}) 
    .pipe(
      tap( ( res) =>{
                    console.log("from checkJsonWebToken Service: ",res);
                }  
      ),            
      map( (res: any) => res )
    )
  }


  signUp(body:any){
    
    return this.http.post<any>(`${this.baseUrl}api/auth/signUp`, body) 
    
    .pipe(
      tap( ( res) =>{
                     
                    console.log("from signUp Service: ",res);
                }  
      ),            
      map( (res: any) => res )
    )
  }

  createInscription(body:any){
    
    return this.http.put<any>(`${this.baseUrl}api/inscription/createInscription`, body) 
    
    .pipe(
      tap( ( res) =>{console.log("from createInscription Service: ", res);  }  
      ),            
      map( (res: any) => res )
    )
  }

  validateEmail(body: any){

    return this.http.post<any>(`${this.baseUrl}api/auth/validateEmail`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from validateEmail service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  adminContactUs(body: any){

    return this.http.post<any>(`${this.baseUrl}api/auth/adminContactUs`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from adminContactUs service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  resendPasword(email: any){
    const body = {email}
  
    return this.http.post<any>(`${this.baseUrl}api/auth/resendPassword`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from resendPasword service: ",res);
                }  
      ),            
      map( res => res )
    )
  }

  showErrorSwal( title : string, msg : string, footer : string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: msg,
      footer: footer,
      allowOutsideClick: false,  
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed && footer === 'Por favor, tente novamente mais tarde') {
        // this.router.navigateByUrl('/login')
      }
    });
  }

}
