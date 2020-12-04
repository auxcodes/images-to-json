import { Injectable } from '@angular/core';
import { JsonField } from '../shared/interfaces/json-field';
import { FieldType } from '../shared/enums/field-type.enum';
import { BehaviorSubject } from 'rxjs';
import { FileDetail } from '../shared/interfaces/file-detail';
import { LocalStorageService } from './local-storage.service';
import { StoredFields } from '../shared/interfaces/stored-fields';
import { FieldsUpdate } from '../shared/interfaces/fields-update';

@Injectable({
  providedIn: 'root'
})
export class FieldsService {

  storageKey = 'images2json.aux.codes';
  tempFieldValues: object = {};
  date: Date = new Date();
  fileIdReference = 1;
  fileIdCurrent = 1;

  defaultFields: BehaviorSubject<JsonField[]> = new BehaviorSubject<JsonField[]>([]);
  extraFields: BehaviorSubject<JsonField[]> = new BehaviorSubject<JsonField[]>([]);
  userFields: BehaviorSubject<JsonField[]> = new BehaviorSubject<JsonField[]>([]);

  importedFields: object = null;

  constructor(private storageService: LocalStorageService) {
    this.resetFields();
  }

  async checkStorage() {
    await this.storageService.readJSONEntry(this.storageKey).then(storage => {
      if (storage) {
        this.setAllFields(storage);
      }
    });
  }

  clearStorage() {
    this.storageService.clearStorage();
    this.resetFields();
  }

  private resetFields() {
    this.defaultFields.next([
      { name: 'name', text: 'Name', selected: true, id: '$name', value: 'eg: example.jpg', type: FieldType.string },
      { name: 'size', text: 'Size', selected: false, id: '$size', value: 'eg: 174026', type: FieldType.number },
      { name: 'type', text: 'Type', selected: false, id: '$type', value: 'eg: image/jpeg', type: FieldType.string },
      { name: 'lastModified', text: 'Last Modified', selected: false, id: '$lastModified', value: 'eg: 1491809664570', type: FieldType.number }
    ]);
    this.extraFields.next([
      { name: 'id', text: 'File id', selected: false, id: '$id', value: 1, type: FieldType.number },
      { name: 'addDate', text: 'Add Date', selected: false, id: '$addDate', value: this.date.getTime(), type: FieldType.number },
      { name: 'fullpath', text: 'Full Path', selected: false, id: '$fullpath', value: 'https://fullpath.com/images/$name', type: FieldType.string },
      { name: 'relativePath', text: 'Relative Path', selected: false, id: '$relativePath', value: 'images/$name', type: FieldType.string },
      { name: 'thumbnail', text: 'Thumbnail Path', selected: false, id: '$thumbnail', value: 'images/thumbnail/$name', type: FieldType.string },
    ]);
    this.userFields.next([]);
  }

  setAllFields(fields: StoredFields) {
    this.defaultFields.next(fields.defaultFields);
    this.extraFields.next(fields.extraFields);
    this.userFields.next(fields.userFields);
  }

  updateStorage(): object {
    const jsonEntry: StoredFields = {
      'defaultFields': this.defaultFields.value,
      'extraFields': this.extraFields.value,
      'userFields': this.userFields.value
    }
    this.storageService.updateJSONEntry(this.storageKey, jsonEntry);
    return jsonEntry;
  }

  updateIdReference(value: number) {
    this.fileIdReference = value;
    this.fileIdCurrent = value;
    this.updateExtraFieldValue('id', value);
  };

  resetIdCount() {
    this.fileIdCurrent = this.fileIdReference - 1;
  }

  updateIdValues(images: FileDetail[]): FileDetail[] {
    const result: FileDetail[] = images;
    this.resetIdCount();
    result.forEach(image => {
      this.fileIdCurrent++;
      const idValues = {
        ...this.defaultIdValues(image),
        ...this.extraIdValues(image),
        ...this.userIdValues(image)
      }
      image.idValues = idValues;
    });

    return result;
  }

  updateExtraFieldValue(fieldName: string, value) {
    this.extraFields.value.find(field => field.name === fieldName).value = value;
    this.extraFields.next(this.extraFields.value);
  }

  updateUserFieldValue(fieldName: string, value) {
    this.userFields.value.find(field => field.name === fieldName).value = value;
    this.userFields.next(this.userFields.value);
  }

  private defaultIdValues(image: FileDetail): object {
    const result = {};
    this.tempFieldValues = {};
    this.defaultFields.value.forEach(field => {
      result[field.id] = image.file[field.name];
      this.tempFieldValues[field.id] = image.file[field.name];
    });
    return result;
  }

  private extraIdValues(image: FileDetail): object {
    const result = {};
    this.extraFields.value.forEach(field => {
      result[field.id] = image[field.name];
      this.tempFieldValues[field.id] = this.getIdValues(field, image);
      result[field.id] = this.getIdValues(field, image);
    });
    return result;
  }

  private userIdValues(image: FileDetail): object {
    const result = {};
    this.userFields.value.forEach(field => {
      result[field.id] = image[field.name];
      this.tempFieldValues[field.id] = this.getIdValues(field, image);
      result[field.id] = this.getInputValue(field.value, image);
    });
    return result;
  }

  private getIdValues(field, image: FileDetail): string {
    let result;
    switch (field.name) {
      case 'id': {
        result = this.fileIdCurrent;
        break;
      }
      case 'addDate': {
        result = field.value;
        break;
      }
      case 'fullpath': {
        result = this.getInputValue(field.value, image);
        break;
      }
      case 'relativePath': {
        result = this.getInputValue(field.value, image);
        break;
      }
      case 'thumbnail': {
        result = this.getInputValue(field.value, image);
        break;
      }
      default: {
        break;
      }
    }
    return result;
  }

  parseSelectedFields(images: FileDetail[]): FileDetail[] {
    const result: FileDetail[] = images;
    this.resetIdCount();
    result.forEach(fileDetail => {
      this.fileIdCurrent++;
      const jsonObj = this.parseFields(fileDetail);
      fileDetail.objects = jsonObj;
    });
    return result;
  }

  private parseFields(image: FileDetail): object {
    const result = {
      ...this.parseDefaultFields(image),
      ...this.parseExtraFields(image),
      ...this.parseUserFields(image)
    };

    return result;
  }

  private parseDefaultFields(image: FileDetail): object {
    const result = {};
    this.defaultFields.value.forEach(field => {
      if (field.selected) {
        result[field.name] = image.file[field.name];
      }
    });
    return result;
  }

  private parseExtraFields(image: FileDetail): object {
    const result = {};
    this.extraFields.value.forEach(field => {
      if (field.selected) {
        result[field.name] = this.setExtraField(field, image);
      }
    });
    return result;
  }

  private parseUserFields(image: FileDetail): object {
    const result = {};
    this.userFields.value.forEach(field => {
      if (field.selected) {
        result[field.name] = this.getInputValue(field.value, image);
      }
    });
    return result;
  }

  private setExtraField(field, image: FileDetail) {
    let result;
    switch (field.name) {
      case 'id': {
        result = this.fileIdCurrent;
        break;
      }
      case 'addDate': {
        result = field.value;
        break;
      }
      case 'fullpath': {
        result = this.getInputValue(field.value, image);
        break;
      }
      case 'relativePath': {
        result = this.getInputValue(field.value, image);
        break;
      }
      case 'thumbnail': {
        result = this.getInputValue(field.value, image);
        break;
      }
      default: {
        break;
      }
    }
    return result;
  }

  getInputValue(content: string, image: FileDetail): string {
    let result = content;
    content = content.toString();
    if (content && content.includes('$')) {
      this.defaultFields.value.forEach(field => {
        const value = image.idValues[field.id] ? image.idValues[field.id] : this.tempFieldValues[field.id];
        result = result.replace(field.id, value);
      });
      this.extraFields.value.forEach(field => {
        const value = image.idValues[field.id] ? image.idValues[field.id] : this.tempFieldValues[field.id];
        result = result.replace(field.id, value);
      });
      this.userFields.value.forEach(field => {
        const value = image.idValues[field.id] ? image.idValues[field.id] : this.tempFieldValues[field.id];
        result = result.replace(field.id, value);
      });
    }
    return result;
  }

  compareImportedFields(): FieldsUpdate {
    const allFields: JsonField[] = this.defaultFields.value.concat(this.extraFields.value, this.userFields.value);
    const result = {
      add: {},
      remove: []
    }

    allFields.forEach(field => {
      const key = field.name;
      if (field.selected && !(key in this.importedFields)) {
        this.importedFields[key] = field.value;
        result.add[key] = field.value;
      }
      if (!field.selected && (key in this.importedFields)) {
        delete this.importedFields[key];
        result.remove.push(key);
      }
    });

    return result;
  }
}
