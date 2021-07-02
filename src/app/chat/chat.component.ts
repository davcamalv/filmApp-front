import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { Option } from '../models/Option';
import { Selectable } from '../models/Selectable';
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
  options: Option[] = [];
  specialKeyboard: boolean = false;
  selectableId: number = 0;
  conversation:Message[] = [];
  ngOnInit(): void {
  }

  scrollToBottom(){
    let chatContent = document.getElementById("chat-content");
    if(chatContent != null){
      chatContent.scrollTop = chatContent.scrollHeight;
    }
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
        if(err.error.message == "The functionality is not yet available"){
          this.conversation.push({sender: "server", message: "<p style='margin: 0 0 0'>Disculpe, actualmente no tengo implementada esa funcionalidad</p>", specialKeyboard: false});
          setTimeout(() => {this.scrollToBottom()}, 500);
        } 
      }
    );
  }

}
