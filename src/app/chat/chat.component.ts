import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(
    private chatService: ChatService,
  ) { }

  text: string = "";
  conversation:Message[] = [];
  ngOnInit(): void {
  }

  scrollToBottom(){
    let chatContent = document.getElementById("chat-content");
    if(chatContent != null){
      chatContent.scrollTop = chatContent.scrollHeight;
    }
  }

  sendText(text: string): void {
    let message : Message = {sender: "user", message: text};
    this.text = "";
    this.conversation.push(message);
    setTimeout(() => {this.scrollToBottom()}, 1000);
    this.chatService.sendMessage(message).subscribe(
      data => {
        this.conversation.push({sender: "server", message: data.message});
        setTimeout(() => {this.scrollToBottom()}, 1000);
      },
      err => {
      }
    );
  }

}
