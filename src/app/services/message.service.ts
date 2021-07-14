import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Message } from '../models/message';
import { PaginationDTO } from '../models/paginationDTO';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messageURL = environment.messageURL;

  constructor(private httpClient: HttpClient) { }

  public findMessagesByUser(PaginationDTO: PaginationDTO): Observable<Message[]> {
    return this.httpClient.post<Message[]>(this.messageURL + 'findByUser', PaginationDTO);
  }
}
