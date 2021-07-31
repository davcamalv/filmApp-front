import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  conversationURL = environment.conversationURL;

  constructor(private httpClient: HttpClient) { }

  public sendMessage(message: Message): Observable<Message> {
    return this.httpClient.post<Message>(this.conversationURL + 'sendMessage', message);
  }
}
