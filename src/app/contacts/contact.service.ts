import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { catchError, map, Observable, Subject, tap, throwError } from 'rxjs';
import { Contact } from './contact.model';
// import { MOCKCONTACTS } from './MOCKCONTACTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactService implements OnInit {
  contacts: Contact[] = [];
  contactListChangedEvent = new Subject<Contact[]>();
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  maxContactId: number;

  constructor(private http: HttpClient) {
    // this.contacts = MOCKCONTACTS;
    // this.maxContactId = this.getMaxId();
  }

  ngOnInit() {}

  getContacts() {
    this.http
      .get(
        'https://cms-project-acb01-default-rtdb.firebaseio.com/contacts.json'
      )
      .pipe(
        map((responseData: { [key: string]: Contact }) => {
          const contactsArray: Contact[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              contactsArray.push({ ...responseData[key], id: key });
            }
          }
          return contactsArray;
        }),
        tap((contacts: Contact[]) => {
          contacts.sort((a, b) => a.name.localeCompare(b.name));
          for (let i = 0; i < contacts.length; i++) {
            contacts[i].id = String(i);
          }
        })
      )
      .subscribe(
        (contacts: Contact[]) => {
          this.contacts = contacts;
          this.maxContactId = this.getMaxId();
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  // getContacts() {
  //   // return this.contacts.slice();
  //   this.http
  //     .get(
  //       'https://cms-project-acb01-default-rtdb.firebaseio.com/contacts.json'
  //     )
  //     .subscribe(
  //       (contacts: Contact[] = []) => {
  //         this.contacts = contacts;
  //         this.maxContactId = this.getMaxId();
  //         contacts.sort((a, b) =>
  //           a.name < b.name ? -1 : a.name > b.name ? 1 : 0
  //         );
  //         this.contactListChangedEvent.next(this.contacts.slice());
  //       },
  //       (error: any) => {
  //         console.error(error);
  //       }
  //     );
  // }

  getContact(id: string) {
    return this.contacts.find((contact) => contact.id === id);
    // return this.contacts[index];
    //   for (const contact of this.contacts) {
    //     if (contact.id == id) {
    //       return contact;
    //     }
    //   }
    //   return null;
  }

  storeContacts() {
    let contacts = JSON.parse(JSON.stringify(this.contacts));
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .put(
        'https://cms-project-acb01-default-rtdb.firebaseio.com/contacts.json',
        contacts,
        { headers }
      )
      .subscribe(
        (response) => {
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error) => {
          console.error('Error saving contacts: ', error);
        }
      );
  }

  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }
    this.maxContactId++;
    newContact.id = String(this.maxContactId);
    this.contacts.push(newContact);
    let contactsListClone = this.contacts.slice();
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }
    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    let contactsListClone = this.contacts.slice();
    this.storeContacts();
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    let contactsListClone = this.contacts.slice();
    this.storeContacts();
  }

  getMaxId() {
    let maxId = 0;
    for (const contact of this.contacts) {
      const currentId = Number(contact.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }
}
