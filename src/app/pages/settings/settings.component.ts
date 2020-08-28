import { Component, OnInit } from '@angular/core';
import { FileManagerService } from 'src/app/services/file-manager.service';
import { JsonField } from 'src/app/shared/interfaces/json-field';
import { FileDetail } from 'src/app/shared/interfaces/file-detail';
import { FieldType } from '../../shared/enums/field-type.enum';
import { ImagesService } from '../../services/images.service';
import { FieldsService } from '../../services/fields.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {


  defaultFields: JsonField[] = [];
  extraFields: JsonField[] = [];
  userFields: JsonField[] = [];

  fileList: FileDetail[] = [];
  fileIdReference = 1;

  constructor(
    private imageService: ImagesService,
    private fieldService: FieldsService
  ) {
    fieldService.defaultFields.subscribe(fields => this.defaultFields = fields);
    fieldService.extraFields.subscribe(fields => this.extraFields = fields);
    fieldService.userFields.subscribe(fields => this.userFields = fields);
  }

  ngOnInit() {
    this.imageService.images.subscribe(files => {
      this.fileList = files;
    });
  }

  onFileSelected(event) {
    this.imageService.updateImageList(event.target.files);

    this.imageService.images.next(this.parseImages(this.fileList));
  }

  parseImages(images: FileDetail[]) {
    const result: FileDetail[] = [];
    for (let i = 0; i < images.length; i++) {
      const image: FileDetail = { file: images[i].file, objects: '', idValues: [] };
      result.push(image);
      image.idValues = this.fieldService.updateFieldValues(image);
      const jsonObj = this.parseFields(image.file);
      image.objects = jsonObj;
      result
    }
    return result;
  }

  private parseFields(image): string {
    const result = {
      ...this.parseDefaultFields(image),
      ...this.parseExtraFields(image)
    };

    return JSON.stringify(result);
  }

  private parseDefaultFields(image, selected?: boolean): object {
    const result = {};
    this.defaultFields.forEach(field => {
      if (field.selected || selected) {
        result[field.name] = image[field.name];
      }
    });
    return result;
  }

  private parseExtraFields(image: FileDetail): object {
    const result = {}; 
    this.extraFields.forEach(field => {
      if (field.selected) {
        result[field.name] = this.fieldService.setExtraField(field, image, true);
      }
    });
    return result;
  }

  private getInputValue(content: string, image: FileDetail): string {
    let result = content;
    this.defaultFields.forEach(field => {
      result = result.replace(field.id, image.idValues[field.id]);
      console.log("forEach field: ", field, content.replace(field.id, image.idValues[field.id]));
    });
    this.extraFields.forEach(field => {
      result = result.replace(field.id, image.idValues[field.id]);
      console.log("forEach field: ", field, content.replace(field.id, image.idValues[field.id]));
    });
    return result;
  }

  // private incrementId(){
  //   const index = this.extraFields.findIndex(field => field.name === 'id');
  //   this.extraFields.[index].id = !this.defaultFields[index].selected;
  // }

  onFieldChange(field) {
    console.log(field);

    switch (field.id) {
      case 'id': {
        this.fileIdReference = field.value;
        this.fieldService.fileIdCurrent = field.value;
        this.extraFields.find(field => field.name === 'id').value = field.value;
        console.log(field.value);
        break;
      }
      default: {
        break;
      }
    }

  }

  onDefaultSelection(fieldName) {
    const index = this.defaultFields.findIndex(field => field.name === fieldName);
    this.defaultFields[index].selected = !this.defaultFields[index].selected;

    if (this.fileList.length > 0) {
      console.log("ExtraSelection: ",this.fileList);
      this.fileList = this.parseImages(this.fileList);
    }
  }

  onExtraSelection(fieldName) {
    console.log("es: ", fieldName);

    const index = this.extraFields.findIndex(field => field.name === fieldName);
    this.extraFields[index].selected = !this.extraFields[index].selected;

    if (this.fileList.length > 0) {
      this.fileList = this.parseImages(this.fileList);
      console.log("ExtraSelection: ",this.fileList);
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
