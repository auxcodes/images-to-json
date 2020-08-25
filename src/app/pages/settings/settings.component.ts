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
    { name: "name", text: "Name", selected: true, content: "$name", value: "file value" },
    { name: "size", text: "Size", selected: false, content: "$size", value: "file value"},
    { name: "type", text: "Type", selected: false, content: "$type", value: "file value"},
    { name: "lastModified", text: "Last Modified", selected: false, content: "$lastModified",value: "file value" }
  ];

  date: Date = new Date();
  extraFields: JsonField[] = [
    { name: "id", text: "File id", selected: false, content: "$id", value: 1 },
    { name: "currentDate", text: "Current Date", selected: false, content: "$currentDate", value: this.date.getTime() },
    { name: "fullpath", text: "Full Path", selected: false, content: "$fullpath", value: "https://fullpath.com/images/$name" },
    { name: "relativePath", text: "Relative Path", selected: false, content: "$relativePath", value: "images/$name" },
    { name: "thumbnail", text: "Thumbnail Path", selected: false, content: "$thumbnail", value: "images/thumbnail/$name" },
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

  addField(event) {
    const name = event.target.name.value;
    let content: string = event.target.content.value;
    console.log(name);
    console.log(content);
    content = content.replace('$name', this.defaultFields.find(field => field.name === 'name').name);
    console.log(content);
  }
}
