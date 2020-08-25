import { Component, OnInit } from '@angular/core';
import { FileManagerService } from 'src/app/services/file-manager.service';
import { JsonField } from 'src/app/shared/interfaces/json-field';
import { FileDetail } from 'src/app/shared/interfaces/file-detail';
import { FileDetector } from 'protractor';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private fileService: FileManagerService) { }

  defaultFields: JsonField[] = [
    { name: "name", selected: true, content: "" },
    { name: "size", selected: false, content: "" },
    { name: "type", selected: false, content: "" },
    { name: "lastModified", selected: false, content: "" }
  ];
  fileList: FileDetail[] = [];

  ngOnInit() {
  }


  onFileSelected(event) {
    const rawImages = event.target.files;
    let images: FileDetail[] = [];
    for (var i = 0; i < rawImages.length; i++) {
      const image: FileDetail = { file: rawImages[i], values: "" };
      images.push(image);
    }
    this.fileList = this.parseImages(images);
  }

  parseImages(images: FileDetail[]) {
    let result: FileDetail[] = [];
    for (var i = 0; i < images.length; i++) {
      const image: FileDetail = { file: images[i].file, values: "" };
      const jsonObj = this.parseSelectedDefaultFields(image.file);
      image.values = jsonObj;
      result.push(image);
    }
    return result;
  }

  private parseSelectedDefaultFields(image): string {
    let result = {};
    this.defaultFields.forEach(field => {
      if (field.selected) {
        result[field.name] = image[field.name];
      }
    });
    return JSON.stringify(result);
  }

  onSelection(fieldName) {
    const index = this.defaultFields.findIndex(field => field.name === fieldName);
    this.defaultFields[index].selected = !this.defaultFields[index].selected;

    if (this.fileList.length > 0) {
      this.fileList = this.parseImages(this.fileList);
    }
  }
}
