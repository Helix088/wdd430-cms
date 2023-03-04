import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { Document } from './document.model';
// import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService implements OnInit{
  documents: Document[] = [];
  documentListChangedEvent = new Subject<Document[]>();
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();
  maxDocumentId: number;

  constructor(private http: HttpClient) {
    // this.documents = MOCKDOCUMENTS;
    // this.maxDocumentId = this.getMaxId();
  }

  ngOnInit() {}

  getDocuments() {
    // return this.documents.slice();
    this.http.get(
      'https://cms-project-acb01-default-rtdb.firebaseio.com/documents.json'
    ).subscribe(
      (documents: Document[] = []) => {
        this.documents = documents;
        this.maxDocumentId = this.getMaxId();
        documents.sort((a, b) => (a.id < b.id) ? -1 : (a.id > b.id) ? 1 : 0);
        this.documentListChangedEvent.next(this.documents.slice());
      },
      (error: any) => {
        console.error(error);
      }
    )
  }

  getDocument(index: string) {
    return this.documents[index];
    // this.documents.forEach((document) => {
    //   if (document.id == id) {
    //     return document;
    //   }
    // });
    // return null;
  }

  storeDocuments() {
    let documents = JSON.parse(JSON.stringify(this.documents));
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.put(
      'https://cms-project-acb01-default-rtdb.firebaseio.com/documents.json',
      documents,
      {headers}
    ).subscribe(
     (response) => {
      this.documentListChangedEvent.next(this.documents.slice()), response;
     },
      (error) => {
        console.error('Error saving documents: ', error);
      }
    );
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }
    this.maxDocumentId++;
    newDocument.id = String(this.maxDocumentId);
    this.documents.push(newDocument);
    let documentsListClone = this.documents.slice();
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if(!originalDocument || !newDocument) {
      return;
    }
    const pos = this.documents.indexOf(originalDocument);
    if(pos < 0) {
      return;
    }
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    let documentsListClone = this.documents.slice();
    this.storeDocuments();
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    let documentsListClone = this.documents.slice();
    this.storeDocuments();
  }

  getMaxId() {
    let maxId = 0;
    for (const document of this.documents) {
      const currentId = Number(document.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }
}
