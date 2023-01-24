import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
})
export class MessageListComponent {
  messages: Message[] = [
    new Message(
      '2',
      'How are you?',
      'How is it going in the class so far?',
      'Devin Patterson'
    ),
    new Message(
      '3',
      'Assistance?',
      'Is there anything I can help you with so far?',
      'Bro. Murff'
    ),
    new Message(
      '4',
      'Can you help?',
      'Hey do you know how to make this app work?',
      'Paulina Rugerio'
    )
  ];

  constructor() {}

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
