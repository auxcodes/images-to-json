import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { JsonField } from 'src/app/shared/interfaces/json-field';
import { FieldsService } from '../../services/fields.service';
import { FieldType } from '../../shared/enums/field-type.enum';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-field-settings',
  templateUrl: './field-settings.component.html',
  styleUrls: ['./field-settings.component.scss']
})
export class FieldSettingsComponent implements OnInit {

  defaultFields: JsonField[] = [];
  extraFields: JsonField[] = [];
  userFields: JsonField[] = [];

  allSelectedDefault = false;
  allSelectedExtra = false;
  allSelectedUser = false;

  constructor(
    private fieldService: FieldsService,
    private imageService: ImagesService
  ) {

  }

  ngOnInit() {
    this.fieldService.checkStorage();
    this.subscribeToFields();
  }

  private subscribeToFields() {
    this.fieldService.defaultFields.subscribe(fields => {
      this.defaultFields = fields;
    });
    this.fieldService.extraFields.subscribe(fields => {
      this.extraFields = fields;
      this.refreshParsing(true);
    });
    this.fieldService.userFields.subscribe(fields => {
      this.userFields = fields;
      this.refreshParsing(true);
    });
  }

  private refreshParsing(parseAllImages: boolean) {
    this.imageService.reparse.next(parseAllImages);
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
    this.fieldService.updateStorage();
  }

  onDefaultSelection(fieldName) {
    const index = this.defaultFields.findIndex(field => field.name === fieldName);
    this.defaultFields[index].selected = !this.defaultFields[index].selected;
    this.fieldService.updateStorage();
    this.refreshParsing(false);
  }

  onExtraSelection(fieldName) {
    const index = this.extraFields.findIndex(field => field.name === fieldName);
    this.extraFields[index].selected = !this.extraFields[index].selected;
    this.fieldService.updateStorage();
    this.refreshParsing(false);
  }

  onUserSelection(fieldName) {
    const index = this.userFields.findIndex(field => field.name === fieldName);
    this.userFields[index].selected = !this.userFields[index].selected;
    this.fieldService.updateStorage();
    this.refreshParsing(false);
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
    this.refreshParsing(false);
    this.fieldService.updateStorage();
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
      this.fieldService.updateStorage();
    }
  }

  onDeleteField(fieldIndex: number) {
    this.userFields.splice(fieldIndex, 1);
    this.fieldService.userFields.next(this.userFields);
    this.refreshParsing(false);
  }

  onClearStorage() {
    this.fieldService.clearStorage();
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
