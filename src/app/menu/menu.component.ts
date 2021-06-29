import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../auth/login.component';
import { Router } from '@angular/router';
import { RegistrationComponent } from '../auth/registration.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  isLogged = false;
  isAdmin = false;

  constructor(private tokenService: TokenService, private dialog: MatDialog, 
    private router: Router,
    ) { }

  ngOnInit() {
   this.isLogged = this.tokenService.isLogged();
   this.isAdmin = this.tokenService.isAdmin();
  }

  onLogOut(): void {
    this.tokenService.logOut();
    this.ngOnInit();
  }

  openLogin(): void {
    if(this.dialog.openDialogs.length==0){
      let dialog = this.dialog.open(LoginComponent, {
        width: '300px',
      });
      dialog.afterClosed().subscribe(()=>{
        this.router.navigate(['/']);
        this.ngOnInit();
      });
    };
  }

  openRegister(): void {
    if(this.dialog.openDialogs.length==0){
      let dialog = this.dialog.open(RegistrationComponent, {
        width: '300px',
      });
      dialog.afterClosed().subscribe(()=>{
        this.router.navigate(['/']);
        this.ngOnInit();
      });
    };
  }

}