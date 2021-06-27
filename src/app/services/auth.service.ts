import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NewUser } from '../models/new-user';
import { Observable } from 'rxjs';
import { UserLogin } from '../models/user-login';
import { JwtDTO } from '../models/jwt-dto';
import { environment } from './../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authURL = environment.authURL;

  constructor(private httpClient: HttpClient) { }

  public new(newUser: NewUser): Observable<any> {
    return this.httpClient.post<any>(this.authURL + 'new', newUser);
  }

  public login(UserLogin: UserLogin): Observable<JwtDTO> {
    return this.httpClient.post<JwtDTO>(this.authURL + 'login', UserLogin);
  }

  public refresh(dto: JwtDTO): Observable<JwtDTO> {
    return this.httpClient.post<JwtDTO>(this.authURL + 'refresh', dto);
  }

}
