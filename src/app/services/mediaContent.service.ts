import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaginationDTO } from '../models/paginationDTO';
import { MediaContent } from '../models/mediaContent';

@Injectable({
  providedIn: 'root'
})
export class MediaContentService {

  mediaContentURL = environment.mediaContentURL;

  constructor(private httpClient: HttpClient) { }

  public findMediaContentByUser(PaginationDTO: PaginationDTO): Observable<MediaContent[]> {
    return this.httpClient.post<MediaContent[]>(this.mediaContentURL + 'findByUser', PaginationDTO);
  }

  public deleteElementMediaContentList(id: Number): Observable<void> {
    return this.httpClient.post<void>(this.mediaContentURL + 'deleteElementMediaContentList', id);
  }
}
