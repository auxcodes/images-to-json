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

  allFiles: FileDetail[] = [];
  selectedFiles: FileDetail[] = [];
  jsonOutput: object = {};

  allSelectedDefault = false;
  allSelectedExtra = false;
  allSelectedUser = false;
  indexed = false;
  dataKey = false;

  constructor(
    private imageService: ImagesService,
    private fieldService: FieldsService,
    private fileService: FileManagerService,
  ) {
    fieldService.defaultFields.subscribe(fields => {
      this.defaultFields = fields;
    });
    fieldService.extraFields.subscribe(fields => {
      this.extraFields = fields;
      this.imageService.images.next(this.parseImages(this.selectedFiles));
      this.refreshParsing();
    });
    fieldService.userFields.subscribe(fields => {
      this.userFields = fields;
      this.refreshParsing();
    });
    imageService.jsonOutput.subscribe(data => this.jsonOutput = data);
  }

  ngOnInit() {
    this.imageService.images.subscribe(files => {
      this.allFiles = files;
    });
    this.imageService.selectedImages.subscribe(files => {
      this.selectedFiles = files;
      if (files.length > 0) {
        this.refreshParsing();
      }
    });
  }

  get code() {
    return JSON.stringify(this.jsonOutput, null, 2);
  }

  set code(jsonString) {
    try {
      if (jsonString) {
        this.imageService.jsonOutput.next(JSON.parse(jsonString));
      }
    }
    catch (e) {
      console.log('Error occored while you were typing the JSON', e);
    };
  }

  onFileSelected(event) {
    console.log(event);
    this.imageService.updateImageList(event.target.files);
    this.imageService.images.next(this.parseImages(this.allFiles));
    this.imageService.updateSelectedImages();
    this.imageService.updateJsonOutput();
  }

  parseImages(images: FileDetail[]) {
    let result: FileDetail[] = this.fieldService.updateIdValues(images);
    result = this.fieldService.parseSelectedFields(result);
    return result;
  }

  onImageChecked(imageId) {
    this.allFiles[imageId].selected = !this.allFiles[imageId].selected;
    this.imageService.updateSelectedImages(this.allFiles);
  }

  onFieldChange(field) {
    switch (field.parentElement.id) {
      case 'extraFields': {
        if (field.id === 'id') {
          this.fieldService.updateIdReference(field.value);
        }
        if (this.checkIdValidity(field.value)) {
          this.fieldService.updateExtraFieldValue(field.id, field.value);
        }
        break;
      }
      case 'userFields': {
        if (this.checkIdValidity(field.value)) {
          this.fieldService.updateUserFieldValue(field.id, field.value);
        }
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
    this.refreshParsing();
  }

  onExtraSelection(fieldName) {
    const index = this.extraFields.findIndex(field => field.name === fieldName);
    this.extraFields[index].selected = !this.extraFields[index].selected;

    this.refreshParsing();
  }

  onUserSelection(fieldName) {
    const index = this.userFields.findIndex(field => field.name === fieldName);
    this.userFields[index].selected = !this.userFields[index].selected;

    this.refreshParsing();
  }

  onSelectAll(checkBox) {
    switch (checkBox.id) {
      case "defaultSelectAll": {
        this.allSelectedDefault = checkBox.checked;
        this.defaultFields.forEach(sid => sid.selected = checkBox.checked);
        break;
      }
      case "extraSelectAll": {
        this.allSelectedExtra = checkBox.checked;
        this.extraFields.forEach(sid => sid.selected = checkBox.checked);
        break;
      }
      case "userSelectAll": {
        this.allSelectedUser = checkBox.checked;
        this.userFields.forEach(sid => sid.selected = checkBox.checked);
        break;
      }
    }

    this.refreshParsing();
  }

  onOutputPreviewChange(target) {
    this.indexed = target === 'indexJson' ? !this.indexed : this.indexed;
    this.dataKey = target === 'dataKeyJson' ? !this.dataKey : this.dataKey;
    this.imageService.updateJsonOutput();
  }

  onAddField(event) {
    const selected: boolean = event.target[0].checked;
    const name: string = event.target[1].value;
    const value: string = event.target[2].value;
    if (!this.fieldNameExists(name)) {
      alert('Field with that name already exists!\n\n');
      return;
    }

    if (this.checkIdValidity(value)) {
      const newField: JsonField = { name: name, value: value, selected: selected, id: '$' + name, type: FieldType.string, text: this.fieldNameToText(name) };
      this.userFields.push(newField);
      this.fieldService.userFields.next(this.userFields);
    }
  }

  onDeleteField(fieldIndex: number) {
    this.userFields.splice(fieldIndex, 1);
    this.fieldService.userFields.next(this.userFields);
    this.refreshParsing();
  }

  onSaveFile() {
    if (this.selectedFiles.length > 0) {
      this.fileService.saveToFile(this.jsonOutput);
    }
    else {
      alert('No images selected!');
    }
  }

  private checkIdValidity(fieldValue: string): boolean {
    const idCount = this.valueIdCount(fieldValue);
    const validIds = this.validId(fieldValue, idCount);
    const validId = idCount === validIds.length;

    if (!validId) {
      let validatedString = fieldValue;
      validIds.forEach(id => {
        validatedString = validatedString.replace(id, '<valid>');
      });

      alert('An id used in the field value does NOT exist!\n\n' + validatedString);
      return false;
    }
    else {
      return true;
    }
  }

  private refreshParsing() {
    if (this.selectedFiles.length > 0) {
      this.selectedFiles = this.parseImages(this.selectedFiles);
      this.imageService.updateJsonOutput();
    }
  }

  private fieldNameExists(fieldName: string): boolean {
    return !this.defaultFields.find(field => field.name === fieldName) &&
      !this.extraFields.find(field => field.name === fieldName) &&
      !this.userFields.find(field => field.name === fieldName)
  }

  private valueIdCount(fieldValue: string): number {
    let idCount = 0;
    for (let i = 0; i < fieldValue.length; i++) {
      if (fieldValue[i] === '$') {
        idCount++;
      }
    }
    return idCount;
  }

  private validId(fieldValue: string, idCount) {
    const foundIds: string[] = [];

    for (let i = 0; i < idCount; i++) {
      const id = this.findId(fieldValue);
      if (id !== null) {
        fieldValue = fieldValue.replace(id, '<valid>');
        foundIds.push(id);
      }
    }

    return foundIds;
  }

  private findId(fieldValue: string): string {
    let result: string = null;
    this.defaultFields.some(field => {
      if (fieldValue.includes(field.id)) {
        result = field.id;
      }
    });
    if (!result) {
      this.extraFields.some(field => {
        if (fieldValue.includes(field.id)) {
          result = field.id;
        }
      });
    }
    if (!result) {
      this.userFields.some(field => {
        if (fieldValue.includes(field.id)) {
          result = field.id;
        }
      });
    }
    return result;
  }

  private fieldNameToText(fieldName: string): string {
    const spacedText = fieldName.replace(/([A-Z])/g, " $1");
    const result = spacedText.charAt(0).toUpperCase() + spacedText.slice(1);
    return result;
  }
}
