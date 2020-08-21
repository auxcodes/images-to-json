import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {


  constructor() { }

  openFile(file) {
    let contents;
    const reader = new FileReader();
    reader.onload = progressEvent => {
        contents = reader.result;
    }
    reader.readAsText(file);
  }

  saveToFile(contents) {
    const fileContent = contents;
    const filename = 'Images2json' + '_' + this.fileDate() + '.json';
    const blob = new Blob([JSON.stringify(fileContent)], { type: 'text/plain' });
    saveAs(blob, filename);
  }

  private fileDate(): string{
    const pipe = new DatePipe('en-US');
    const date = Date.now();
    const dateString = pipe.transform(date, 'yyyy-MM-dd_hhmmss');
    return dateString;
  }
}
