import { Component, OnInit } from '@angular/core';
import { FileManagerService } from '../../../services/file-manager.service';
import { ImagesService } from '../../../services/images.service';
import { FileDetail } from '../../interfaces/file-detail';
import { ImageFile } from '../../interfaces/image-file';
import { FieldsService } from '../../../services/fields.service';
import { JsonField } from '../../interfaces/json-field';
import { FieldType } from '../../enums/field-type.enum';

@Component({
  selector: 'app-open-json-file',
  templateUrl: './open-json-file.component.html',
  styleUrls: ['./open-json-file.component.scss']
})
export class OpenJsonFileComponent implements OnInit {

  private jsonObjects: object[] = [];
  private fieldKeys: string[] = [];

  constructor(
    private fileService: FileManagerService,
    private imageService: ImagesService,
    private fieldService: FieldsService) { }

  ngOnInit() {
    this.fileService.jsonFile.subscribe(file => {
      this.jsonObjects = Object.values(file)[0];
      if (this.jsonObjects) {
        this.selectedFields(Object.keys(this.jsonObjects[0]));
        this.imageService.jsonOutput.next(this.jsonObjects);
        this.imageService.images.next(this.imageFiles(this.jsonObjects));
      }
    });
  }

  onOpenFile(file) {
    if (file) {
      this.fileService.openFile(file[0]);
    }
    else {
      alert('File failed to open!');
    }
  }

  private imageFiles(jsonObjects: object[]): FileDetail[] {
    const result: FileDetail[] = []

    jsonObjects.forEach(obj => {
      const imageFile: ImageFile = {
        name: obj['name'] ? obj['name'] : 'unknown',
        size: obj['size'] ? obj['size'] : -1,
        lastModified: obj['lastModified'] ? obj['lastModified']: (new Date()).getTime(),
        type: obj['type']
      }
      const fileDetail: FileDetail = {
        file: imageFile,
        objects: obj,
        idValues: {},
        selected: true,
        previewImage: 'assets/images/image_broken.svg'
      }
      result.push(fileDetail);
    });

    return result;
  }

  private selectedFields(keys: string[]) {
    console.log(keys);
    const defaultFields = this.fieldService.defaultFields.getValue().map(field => { field.selected = false; return field });
    const extraFields = this.fieldService.extraFields.getValue().map(field => { field.selected = false; return field });
    this.fieldService.userFields.next([]);
    const userFields = this.fieldService.userFields.value;

    keys.forEach(key => {
      let addToUser = true;
      let index = this.findKey(defaultFields, key);
      if (index !== -1) {
        defaultFields[index].selected = true;
        addToUser = false;
      }

      index = this.findKey(extraFields, key);
      if (index !== -1) {
        extraFields[index].selected = true;
        addToUser = false;
      }
      if (addToUser) {
        userFields.push(this.addUserField(key));
      }
    });

    this.fieldService.defaultFields.next(defaultFields);
    this.fieldService.extraFields.next(extraFields);
    this.fieldService.userFields.next(userFields);
  }

  private findKey(fields: JsonField[], key: string): number {
    return fields.findIndex(field => field.name === key);
  }

  private addUserField(key: string): JsonField {
      return { name: key, value: '', selected: true, id: '$' + key, type: FieldType.string, text: this.fieldNameToText(key) };
  }

  private fieldNameToText(fieldName: string): string {
    const spacedText = fieldName.replace(/([A-Z])/g, " $1");
    const result = spacedText.charAt(0).toUpperCase() + spacedText.slice(1);
    return result;
  }
}
