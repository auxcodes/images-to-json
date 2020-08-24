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
    console.log('File selected: ', event.target.files);
    const images = event.target.files;
    for (var i = 0; i < images.length; i++) {
      const image: FileDetail = { file: images[i], values: "" };
      const jsonObj = this.parseSelectedDefaultFields(image.file);
      image.values = jsonObj;
      console.log(image);
      this.fileList.push(image);
    }
    console.log("FileList: ", JSON.stringify(this.fileList));
    this.fileService.openFile(event.target.files[0]);
  }

  private parseSelectedDefaultFields(image): string {
    console.log("image: ", image);
    let result = {};
    this.defaultFields.forEach(field => {
      if (field.name === "name" && field.selected) {
        result[field.name] = image.name.toString();
      }
      if (field.name === "size" && field.selected) {
        result[field.name] = image.size;
      }
      if (field.name === "type" && field.selected) {
        result[field.name] =  image.type.toString();
      }
      if (field.name === "lastModified" && field.selected) {
        result[field.name] = image.lastModified;
      }
      console.log("loop: ", result);
    });
    console.log(JSON.stringify(result));
    return JSON.stringify(result);
  }
}
