import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NewUser } from '../models/user';
import { Observable } from 'rxjs';
import { UserLogin } from '../models/user';
import { Jwt } from '../models/jwt';
import { environment } from './../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authURL = environment.authURL;

  constructor(private httpClient: HttpClient) { }

  public new(newUser: NewUser): Observable<Jwt> {
    return this.httpClient.post<Jwt>(this.authURL + 'new', newUser);
  }

  public login(UserLogin: UserLogin): Observable<Jwt> {
    return this.httpClient.post<Jwt>(this.authURL + 'login', UserLogin);
  }

  public refresh(dto: Jwt): Observable<Jwt> {
    return this.httpClient.post<Jwt>(this.authURL + 'refresh', dto);
  }

}
