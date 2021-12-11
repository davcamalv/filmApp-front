import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProfileDetails, UserProfile } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userURL = environment.userURL;

  constructor(private httpClient: HttpClient) { }

  public getProfile(): Observable<UserProfile> {
    return this.httpClient.get<UserProfile>(this.userURL + 'getProfile');
  }

  public addGenresToPrincipal(ids: number[]): Observable<UserProfile> {
    return this.httpClient.post<UserProfile>(this.userURL + 'addGenresToPrincipal', ids);
  }

  public changeAvatar(avatar: string): Observable<void> {
    return this.httpClient.post<void>(this.userURL + 'changeAvatar', avatar);
  }

  public saveDetails(profileDetails: ProfileDetails): Observable<UserProfile> {
    return this.httpClient.post<UserProfile>(this.userURL + 'saveDetails', profileDetails);
  }
}
