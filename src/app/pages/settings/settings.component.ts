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

  allSelectedDefault = false;
  allSelectedExtra = false;
  allSelectedUser = false;

  constructor(
    private imageService: ImagesService,
    private fieldService: FieldsService
  ) {
    fieldService.defaultFields.subscribe(fields => {
      this.defaultFields = fields;
    });
    fieldService.extraFields.subscribe(fields => {
      this.extraFields = fields;
      this.imageService.images.next(this.parseImages(this.fileList));
    });
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
    let result: FileDetail[] = this.fieldService.updateIdValues(images);
    result = this.fieldService.parseSelectedFields(result);
    return result;
  }

  onFieldChange(field) {
    switch (field.id) {
      case 'id': {
        this.fieldService.updateIdReference(field.value);
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
      this.fileList = this.parseImages(this.fileList);
    }
  }

  onExtraSelection(fieldName) {
    const index = this.extraFields.findIndex(field => field.name === fieldName);
    this.extraFields[index].selected = !this.extraFields[index].selected;

    if (this.fileList.length > 0) {
      this.fileList = this.parseImages(this.fileList);
    }
  }

  onUserSelection(fieldName) {
    const index = this.userFields.findIndex(field => field.name === fieldName);
    this.userFields[index].selected = !this.userFields[index].selected;

    if (this.fileList.length > 0) {
      this.fileList = this.parseImages(this.fileList);
    }
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

    if (this.fileList.length > 0) {
      this.fileList = this.parseImages(this.fileList);
    }
  }

  addField(event) {
    const selected: boolean = event.target[0].checked;
    const name: string = event.target[1].value;
    const value: string = event.target[2].value;

    if (!this.defaultFields.find(field => field.name === name) && !this.extraFields.find(field => field.name === name) && !this.userFields.find(field => field.name === name)) {
      this.userFields.push({ name: name, value: value, selected: selected, id: '$' + name, type: FieldType.string, text: this.fieldNameToText(name) });
      this.fieldService.userFields.next(this.userFields);
      if (this.fileList.length > 0) {
        this.fileList = this.parseImages(this.fileList);
      }
    }
    else {
      alert('Field with that name already exists!');
    }
  }

  fieldNameToText(fieldName: string): string {
    const spacedText = fieldName.replace(/([A-Z])/g, " $1");
    const result = spacedText.charAt(0).toUpperCase() + spacedText.slice(1);
    return result;
  }
}
