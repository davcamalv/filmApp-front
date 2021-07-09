import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NewUser } from '../models/user';
import {FormControl, Validators,AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  name = new FormControl('', { validators: [Validators.required] });
  username = new FormControl('', { validators: [Validators.required] });
  email = new FormControl('', { validators: [Validators.required, Validators.email] });
  password = new FormControl('', { validators: [Validators.required] });
  confirmPassword = new FormControl('', { validators: [Validators.required, this.samePasswordValidator(this.password)] });
  disabled: boolean = false;
  hide = true;
  hideConfirmPass = true;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    public dialogRef: MatDialogRef<RegistrationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  abled(): boolean{
    if(this.disabled){
      return true;
    }else{
      return !this.validForm();
    }
  }

  validForm(): boolean{
    let valid: boolean = true;
    valid = valid && this.username.valid;
    valid = valid && this.password.valid;
    valid = valid && this.name.valid;
    valid = valid && this.confirmPassword.valid;
    valid = valid && this.email.valid;

    return valid
  }

  samePasswordValidator(password: FormControl) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let res = control.value != password.value ? { 'notSamePassword': "La contraseña no coincide" } : null;
      return res;
    };
  }

  onRegister(): void {
    this.disabled = true;
    let newUser : NewUser = {name: this.name.value, username: this.username.value, email: this.email.value, password: this.password.value};
    this.authService.new(newUser).subscribe(
      data => {
        this.tokenService.setToken(data.token);
        this.dialogRef.close();
      },
      err => {
        this.disabled = false;
        if(err.error.message == "Username alredy exists"){
          this.username.setErrors({usernameAlredyExists: true});
        }else{
          this.username.updateValueAndValidity();
        }
      }
    );
  }

  getErrorMessageUsername() : string{
    return this.username.hasError('required')? "Debes introducir el nombre de usuario": this.username.hasError('usernameAlredyExists')? "El nombre de usuario introducido ya está en uso":"";
  }

  getErrorMessageEmail() : string{
    return this.email.hasError('required')? "Debes introducir un email":
    this.email.hasError('email') ? "El email no cumple con un formato correcto": '';
  }

  getErrorMessagePass(): string{
    return this.password.hasError('required')? "Debes introducir una contraseña":"";
  }

  getErrorMessageName(): string{
    return this.name.hasError('required')? "Debes introducir un nombre":"";
  }

  getErrorMessageConfirmPass():string {
    return this.confirmPassword.hasError('required') ? "Debes confirmar la contraseña" :
      this.confirmPassword.hasError('notSamePassword') ? "La contraseña no coincide":"";
  }


}