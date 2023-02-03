import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css'],
})
export class MessageEditComponent implements OnInit {
  currentSender = '5';
  @ViewChild('subject') subjectInputRef: ElementRef;
  @ViewChild('msgText') msgTextInputRef: ElementRef;

  constructor(private messageService: MessageService) {
    
  }

  onSendMessage() {
    const ingSubject = this.subjectInputRef.nativeElement.value;
    const ingMsgText = this.msgTextInputRef.nativeElement.value;
    const newMessage = new Message(
      '1',
      ingSubject,
      ingMsgText,
      this.currentSender
    );
    this.messageService.addMessage(newMessage);
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = '';
    this.msgTextInputRef.nativeElement.value = '';
  }

  ngOnInit() {
      
  }
}
