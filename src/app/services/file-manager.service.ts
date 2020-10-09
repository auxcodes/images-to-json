import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { JsonService } from './json.service';

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {

  constructor(private jsonService: JsonService) { }

  saveToFile(contents) {
    const fileContent = contents;
    const filename = 'ImagesTojson' + '_' + this.fileDate() + '.json';
    const blob = new Blob([JSON.stringify(fileContent)], { type: 'text/plain' });
    saveAs(blob, filename);
  }

  openFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.jsonService.loadJson(JSON.parse(reader.result.toString()));
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
