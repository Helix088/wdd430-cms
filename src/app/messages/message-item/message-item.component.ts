import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from 'src/app/contacts/contact.model';
import { ContactService } from 'src/app/contacts/contact.service';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css'],
})
export class MessageItemComponent implements OnInit, OnDestroy {
  @Input() message: Message;
  messageSender: string;
  subscription: Subscription;

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.subscription = this.contactService.contactListChangedEvent.subscribe(() => {
      console.log(this.message.sender);
      const contact: Contact = this.contactService.getContact(
        this.message.sender
      );
      if (contact) {
        this.messageSender = contact.name;
      } else {
        console.error(`Contact not found for sender: ${this.message.sender}`);
      }
    });
    this.contactService.getContacts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
