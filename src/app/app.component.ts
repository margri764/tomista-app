import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { getDataSS, saveDataSS } from './storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit {

  title = 'Modernize Angular Admin Tempplate';

  constructor(
              private cookieService : CookieService,
              private authService : AuthService,
              private router : Router
             )
  
  {

  }
  
  ngOnInit(): void {

  const token = this.cookieService.get('token');
  const session = getDataSS('session')

  //quiere decir q tiene la opcion de guardar las credenciales y que no esta en la misma session
    if (token &&  !session) {
        this.authService.checkJsonWebToken(token).subscribe(
          ({message, user})=>{
            if(message === 'Token válido.' && user.role === 'admin'){
              this.router.navigateByUrl('dashboards/dashboard1');
              saveDataSS('session', 'true')
            }else if(message === 'Token válido.' && user.role === 'user'){
              
            }
          })
    }

  }

}
