import { Component , Output, EventEmitter, OnInit } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  documents: Document[] = [
    new Document(
      '1',
      'WDD 430 - Full Stack Development',
      'Learn how to develop using Angular and NodeJS stack.',
      'https://content.byui.edu/integ/gen/afbb619f-a6a2-423e-9698-d6618ca708a5/0/?.vi=file&attachment.uuid=dfe3b6e1-6434-4d9a-b985-0269119d0bc0',
      undefined
    ),
    new Document(
      '2',
      'CSE 341 - Web Backend Development II',
      'Learn how to develop using NodeJS, Swagger and MongoDB stack.',
      'https://content.byui.edu/integ/gen/afbb619f-a6a2-423e-9698-d6618ca708a5/0/?.vi=file&attachment.uuid=1e6f33e3-71f2-4f04-acc3-2a79a1a5be55',
      undefined
    ),
    new Document(
      '3',
      'CSE 130 - Algorithm Design',
      'Learn how to design Algorithms using Python and C languages.',
      'https://content.byui.edu/integ/gen/afbb619f-a6a2-423e-9698-d6618ca708a5/0/?.vi=file&attachment.uuid=25daac5d-a48d-4f2f-81f5-7b4393c6b03a',
      undefined
    ),
    new Document(
      '4',
      'CSE 222B - Kotlin Language',
      'Learn how to program in the Kotlin language',
      'https://content.byui.edu/integ/gen/afbb619f-a6a2-423e-9698-d6618ca708a5/0/?.vi=file&attachment.uuid=ae0a5198-5ef8-4750-bc5b-989daf9ea3c4',
      undefined
    ),
    new Document(
      '5',
      'CSE 220C - C++ Language',
      'Learn how to program in the C++ language',
      'https://content.byui.edu/integ/gen/afbb619f-a6a2-423e-9698-d6618ca708a5/0/?.vi=file&attachment.uuid=da02d8dc-7bae-4bac-a853-b4ac7bf1d90a',
      undefined
    ),
  ];

  constructor() {}

  ngOnInit() {}

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
