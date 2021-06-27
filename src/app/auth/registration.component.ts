import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NewUser } from '../models/new-user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  newUser: NewUser = new NewUser('', '', '', '');
  name: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
  }

  onRegister(): void {
    this.newUser = new  NewUser(this.name, this.username, this.email, this.password);
    this.authService.new(this.newUser).subscribe(
      data => {
        this.toastr.success('Cuenta Creada', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });

        this.router.navigate(['/login']);
      },
      err => {
        this.errorMessage = err.error.mensaje;
        this.toastr.error(this.errorMessage, 'Fail', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
      }
    );
  }

}