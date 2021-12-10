import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Genre } from '../models/genre';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  genreURL = environment.genreURL;

  constructor(private httpClient: HttpClient) { }

  public findAll(): Observable<Genre[]> {
    return this.httpClient.get<Genre[]>(this.genreURL + 'findAll');
  }
}
