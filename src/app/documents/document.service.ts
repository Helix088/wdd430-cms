import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { Document } from './document.model';
// import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService implements OnInit {
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

  sortAndSend() {
    this.documents.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    this.documentListChangedEvent.next(this.documents.slice());
  }

  getDocuments() {
    // return this.documents.slice();
    this.http.get('http://localhost:3000/documents').subscribe(
      (documents: Document[] = []) => {
        this.documents = documents;
        this.maxDocumentId = this.getMaxId();
        documents.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
        this.documentListChangedEvent.next(this.documents.slice());
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getDocument(index: string) {
    const numIndex = parseInt(index);
    return this.documents[numIndex];
  }

  // getDocument(index: string) {
  //   return this.documents[index];
  //   // this.documents.forEach((document) => {
  //   //   if (document.id == id) {
  //   //     return document;
  //   //   }
  //   // });
  //   // return null;
  // }

  storeDocuments() {
    let documents = JSON.parse(JSON.stringify(this.documents));
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .put(
        'https://cms-project-acb01-default-rtdb.firebaseio.com/documents.json',
        documents,
        { headers }
      )
      .subscribe(
        (response) => {
          this.documentListChangedEvent.next(this.documents.slice()), response;
        },
        (error) => {
          console.error('Error saving documents: ', error);
        }
      );
  }

  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string; document: Document }>(
        'http://localhost:3000/documents',
        document,
        { headers: headers }
      )
      .subscribe((responseData) => {
        // add new document to documents
        this.documents.push(responseData.document);
        this.sortAndSend();
      });
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex((d) => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    // newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put(
        'http://localhost:3000/documents/' + originalDocument.id,
        newDocument,
        { headers: headers }
      )
      .subscribe((response: Response) => {
        this.documents[pos] = newDocument;
        this.sortAndSend();
      });
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.findIndex((d) => d.id === document.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http
      .delete('http://localhost:3000/documents/' + document.id)
      .subscribe((response: Response) => {
        this.documents.splice(pos, 1);
        this.sortAndSend();
      });
  }

  // getMaxId() {
  //   let maxId = 0;
  //   for (const document of this.documents) {
  //     const currentId = Number(document.id);
  //     if (currentId > maxId) {
  //       maxId = currentId;
  //     }
  //   }
  //   return maxId;
  // }
  getMaxId() {
    let maxId = 0;
    if (this.documents) {
      for (const document of this.documents) {
        const currentId = Number(document.id);
        if (currentId > maxId) {
          maxId = currentId;
        }
      }
    }
    return maxId;
  }
}
