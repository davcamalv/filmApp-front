import { HostListener, Component, ElementRef, HostBinding, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { TokenService } from './services/token.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './auth/login.component';
import { Router } from '@angular/router';
import { RegistrationComponent } from './auth/registration.component';
import { FormControl } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'filmApp-front';

isLogged = false;
isAdmin = false;
toggleControl = new FormControl(false);
@HostBinding('class') className = '';
@HostListener('window:beforeunload', ['$event'])
beforeunloadHandler() {
    localStorage.clear();
}
  
constructor(private tokenService: TokenService, private dialog: MatDialog, 
  private router: Router, private overlay: OverlayContainer, private _renderer: Renderer2, private _elementRef : ElementRef

  ) { }

ngOnInit() {
  this.toggleControl.valueChanges.subscribe((darkMode) => {
    const darkClassName = 'darkMode';
    this.className = darkMode ? darkClassName : '';
    if (darkMode) {
      this._renderer.addClass(document.body, "darkMode");
      this.overlay.getContainerElement().classList.add(darkClassName);
    } else {
      this._renderer.removeClass(document.body, "darkMode");
      this.overlay.getContainerElement().classList.remove(darkClassName);
    }
  });
 this.isLogged = this.tokenService.isLogged();
 this.isAdmin = this.tokenService.isAdmin();
}

onLogOut(): void {
  this.tokenService.logOut();
  this.isLogged = this.tokenService.isLogged();
  this.isAdmin = this.tokenService.isAdmin();
}

openLogin(): void {
  if(this.dialog.openDialogs.length==0){
    let dialog = this.dialog.open(LoginComponent, {
      width: '300px',
    });
    dialog.afterClosed().subscribe(()=>{
      this.router.navigate(['/profile']);
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
      this.router.navigate(['/profile']);
      this.ngOnInit();
    });
  };
}
}