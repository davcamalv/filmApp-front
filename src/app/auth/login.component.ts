import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserLogin } from '../models/user';
import { TokenService } from '../services/token.service';
import {FormControl, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  username = new FormControl('', { validators: [Validators.required] });
  password = new FormControl('', { validators: [Validators.required] });
  disabled: boolean = false;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  
  ) { }

  ngOnInit() {
    
  }

  cancel(): void {
    this.dialogRef.close();
  }

  updateValidationInvalidPassword(): void {
    this.password.setErrors({invalid: true});
    this.password.updateValueAndValidity();
  }

  abled(): boolean{
    if(this.disabled){
      return true;
    }else{
      return !this.validForm();
    }
  }

  onLogin(): void {
    this.disabled = true;
    let userLogin : UserLogin = {username: this.username.value, password: this.password.value};
    this.authService.login(userLogin).subscribe(
      data => {
        this.tokenService.setToken(data.token);
        this.dialogRef.close();
      },
      err => {
        this.disabled = false;
        this.password.setErrors({invalid: true});
      }
    );
  }

  validForm(): boolean{
    let valid: boolean = true;
    valid = valid && this.username.valid;
    valid = valid && this.password.valid;
    return valid
  }

  getErrorMessageUsername() : string{
    return this.username.hasError('required')? "Debes introducir el nombre de usuario": "";
  }
  getErrorMessagePassword(): string{
    return this.password.hasError('required')? "Debes introducir la contraseña": this.password.hasError('invalid')? "El nombre de usuario o la contraseña no son correctos":"";
  }

}