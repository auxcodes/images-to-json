import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {

  jsonFile: BehaviorSubject<object> = new BehaviorSubject<object>({});

  constructor() { }

  saveToFile(contents) {
    const fileContent = contents;
    const filename = 'ImagesTojson' + '_' + this.fileDate() + '.json';
    const blob = new Blob([JSON.stringify(fileContent)], { type: 'text/plain' });
    saveAs(blob, filename);
  }

  openFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.jsonFile.next(JSON.parse(reader.result.toString()));
    }
    reader.readAsText(file);
  }

  private fileDate(): string {
    const pipe = new DatePipe('en-US');
    const date = Date.now();
    const dateString = pipe.transform(date, 'yyyy-MM-dd_hhmmss');
    return dateString;
  }
}
