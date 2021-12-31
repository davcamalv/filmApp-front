import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaginationDTO } from '../models/paginationDTO';
import { ReviewProfileDTO } from '../models/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  reviewURL = environment.reviewURL;

  constructor(private httpClient: HttpClient) { }

  public findByUser(PaginationDTO: PaginationDTO): Observable<ReviewProfileDTO[]> {
    return this.httpClient.post<ReviewProfileDTO[]>(this.reviewURL + 'findByUser', PaginationDTO);
  }

  public deleteReview(id: Number): Observable<void> {
    return this.httpClient.post<void>(this.reviewURL + 'delete', id);
  }
  
}
