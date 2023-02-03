import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root',
})
export class ContactService implements OnInit {
  contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();

  constructor() {
    this.contacts = MOCKCONTACTS;
  }

  ngOnInit() {}

  //Maybe add :Contacts[]
  getContacts() {
    return this.contacts.slice();
  }

  //Maybe add :Contact
  // getContact(id: string) {
  //   this.contacts.forEach((contact) => {
  //     if (contact.id == id) {
  //       return contact;
  //     }
  //   });
  //   return null;
  // }
  getContact(id: string) {
    for (const contact of this.contacts) {
      if (contact.id == id) {
        return contact;
      }
    }
    return null;
  }
}
