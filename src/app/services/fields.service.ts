import { Injectable } from '@angular/core';
import { JsonField } from '../shared/interfaces/json-field';
import { FieldType } from '../shared/enums/field-type.enum';
import { ImagesService } from './images.service';
import { BehaviorSubject } from 'rxjs';
import { ImageFile } from '../shared/interfaces/image-file';
import { FileDetail } from '../shared/interfaces/file-detail';

@Injectable({
  providedIn: 'root'
})
export class FieldsService {

  date: Date = new Date();
  fileIdCurrent = 1;

  defaultFields: BehaviorSubject<JsonField[]> = new BehaviorSubject<JsonField[]>([
    { name: 'name', text: 'Name', selected: true, id: '$name', value: 'eg: example.jpg', type: FieldType.string },
    { name: 'size', text: 'Size', selected: false, id: '$size', value: 'eg: 174026', type: FieldType.number },
    { name: 'type', text: 'Type', selected: false, id: '$type', value: 'eg: image/jpeg', type: FieldType.string },
    { name: 'lastModified', text: 'Last Modified', selected: false, id: '$lastModified', value: 'eg: 1491809664570', type: FieldType.number }
  ]);

  extraFields: BehaviorSubject<JsonField[]> = new BehaviorSubject<JsonField[]>([
    { name: 'id', text: 'File id', selected: false, id: '$id', value: 1, type: FieldType.number },
    { name: 'addDate', text: 'Add Date', selected: false, id: '$addDate', value: this.date.getTime(), type: FieldType.number },
    { name: 'fullpath', text: 'Full Path', selected: false, id: '$fullpath', value: 'https://fullpath.com/images/$name', type: FieldType.string },
    { name: 'relativePath', text: 'Relative Path', selected: false, id: '$relativePath', value: 'images/$name', type: FieldType.string },
    { name: 'thumbnail', text: 'Thumbnail Path', selected: false, id: '$thumbnail', value: 'images/thumbnail/$name', type: FieldType.string },
  ]);

  userFields: BehaviorSubject<JsonField[]> = new BehaviorSubject<JsonField[]>([]);

  constructor(private imageService: ImagesService) { }

  updateFieldValues(image: FileDetail): string[] {
    let result: string[] = [];
    result = this.defaultFieldValues(image);
    result = result.concat(this.extraFieldValues(image))
    return result;
  }

  private defaultFieldValues(image: FileDetail): string[] {
    const result: string[] = [];
    this.defaultFields.value.forEach(field => {
      result[field.id] = image.file[field.name];
    });
    return result;
  }

  private extraFieldValues(image: FileDetail): string[] {
    const result: string[] = [];
    this.extraFields.value.forEach(field => {
      result[field.id] = image[field.name];
      //this.setExtraField(field, image, false);
      // set all values and then use them as reference, requires seperate function
    });
    return result;
  }

  setExtraField(field, image: FileDetail, increment: boolean) {
    let result;
    console.log("Set extra field", field, image);
    switch (field.name) {
      case 'id': {
        if (increment) {
            this.extraFields.value.find(field => field.name === 'id').value = (this.fileIdCurrent++);
        }
        result = field.value;
        break;
      }
      case 'addDate': {
        console.log(field.value);
        result = field.value;
        break;
      }
      case 'fullpath': {
        console.log(field.value);
        result = this.getInputValue(field.value, image);
        break;
      }
      case 'relativePath': {
        console.log(field.value);
        result = this.getInputValue(field.value, image);
        break;
      }
      case 'thumbnail': {
        console.log(field.value);
        result = this.getInputValue(field.value, image);
        break;
      }
      default: {
        break;
      }
    }
    return result;
  }

  private getInputValue(content: string, image: FileDetail): string {
    let result = content;
    this.defaultFields.value.forEach(field => {
      result = result.replace(field.id, image.idValues[field.id]);
      console.log("forEach field: ", field, content.replace(field.id, image.idValues[field.id]));
    });
    this.extraFields.value.forEach(field => {
      result = result.replace(field.id, image.idValues[field.id]);
      console.log("forEach field: ", field, content.replace(field.id, image.idValues[field.id]));
    });
    return result;
  }
}
