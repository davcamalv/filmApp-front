import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { Option } from '../models/option';
import { Selectable } from '../models/selectable';
import { ChatService } from '../services/chat.service';
import { MessageService } from '../services/message.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor(
    private chatService: ChatService,
    private messageService: MessageService,

  ) { }

  text: string = "";
  options: Option[] = [];
  specialKeyboard: boolean = false;
  selectableId: number = 0;
  pageNumber: number = 0;
  conversation:Message[] = [];
  existsMessages = true;
  refreshMessages = true;

  ngOnInit(): void {
    this.updateMessages();
    setTimeout(() => {this.scrollToBottom()}, 500);
  }

  scrollToBottom(){
    let chatContent = document.getElementById("chat-content");
    if(chatContent != null){
      chatContent.scrollTop = chatContent.scrollHeight;
    }
  }

  scrollOnTop(){
    if(this.refreshMessages == true){
      let chatContent = document.getElementById("chat-content");
      let scrollHeight = 0;
      if(chatContent != null){
        scrollHeight = chatContent.scrollHeight - chatContent.scrollTop;
      }
      if(chatContent != null && chatContent.scrollTop == 0 && this.existsMessages == true){
        this.refreshMessages = false;
        this.updateMessages();
        chatContent = document.getElementById("chat-content");
        setTimeout(() => {if(chatContent != null){
          chatContent.scrollTop = chatContent.scrollHeight - scrollHeight;
          this.refreshMessages = true;
        }}, 500);
        
      }
    }
  }

  updateMessages(){
    this.messageService.findMessagesByUser({pageNumber:this.pageNumber, pageSize:20}).subscribe(
      data => {
          if(data.length == 0){
            this.existsMessages = false;
          }
          this.conversation = data.concat(this.conversation);
          this.pageNumber = this.pageNumber + 1;
        },
      err => {
      }
    );
  }

  changeInputType(keyboard: boolean, selectable: Selectable | undefined){
    this.options = [];
    if(keyboard === true && selectable !== undefined){
      this.specialKeyboard = true;
      this.selectableId = selectable.id;
      for (let index = 0; index < selectable.options.length; index++) {
        let option = selectable.options[index];
        this.options.push({label: option.label, text: option.text});
      }
    }else{
      this.specialKeyboard = false;
    }
  }

  sendText(text: string): void {
    this.specialKeyboard = false;
    let message : Message = {sender: "user", message: text, specialKeyboard: false};
    this.text = "";
    this.conversation.push(message);
    setTimeout(() => {this.scrollToBottom()}, 500);
    this.chatService.sendMessage(message).subscribe(
      data => {
        this.conversation.push({sender: "server", message: data.message, specialKeyboard: data.specialKeyboard, selectable: data.selectable});
        this.changeInputType(data.specialKeyboard, data.selectable);
        setTimeout(() => {this.scrollToBottom()}, 500);
      },
      err => {
      }
    );
  }

}
