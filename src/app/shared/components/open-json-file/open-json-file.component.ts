import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FileManagerService } from '../../../services/file-manager.service';
import { ImagesService } from '../../../services/images.service';
import { FileDetail } from '../../interfaces/file-detail';
import { ImageFile } from '../../interfaces/image-file';
import { FieldsService } from '../../../services/fields.service';
import { JsonField } from '../../interfaces/json-field';
import { FieldType } from '../../enums/field-type.enum';
import { JsonService } from '../../../services/json.service';


@Component({
  selector: 'app-open-json-file',
  templateUrl: './open-json-file.component.html',
  styleUrls: ['./open-json-file.component.scss']
})
export class OpenJsonFileComponent implements OnInit {

  private jsonObjects: object = null;
  private importedFields: object = null;

  @ViewChild('FileSelectInputDialog', { static: false }) fileSelectDialog: ElementRef;

  constructor(
    private fileService: FileManagerService,
    private jsonService: JsonService,
    private imageService: ImagesService,
    private fieldService: FieldsService) { }

  ngOnInit() {
    this.jsonService.loadedJson.subscribe(file => {
      if (Object.values(file)[0]) {
        let fieldsJson: object = (Object.keys(file)[1] && Object.keys(file)[1] === 'fields') ? { fields: Object.values(file)[1] } : null;
        const imagesJson = Object.keys(file)[0] === 'data' ? { data: Object.values(file)[0] } : { data: [] };
        const sample = imagesJson.data[0];
        if (!fieldsJson) {
          this.importedFields = this.repeatingValues(sample);
          this.fieldService.importedFields = this.importedFields;
          fieldsJson = this.selectedFields(imagesJson.data[0]);
        }
        this.jsonObjects = {
          ...imagesJson,
          ...fieldsJson
        }
        if (this.jsonObjects) {
          this.fieldService.setAllFields(fieldsJson['fields']);
          if (imagesJson.data.length > 0) {
            const imageFiles = this.imageFiles(imagesJson.data);
            this.imageService.importedImages.next(imageFiles);
            this.imageService.selectedImportedImages.next(imageFiles);
          }
        }
      }
    });
  }

  onOpenFileDialog() {
    const e: HTMLElement = this.fileSelectDialog.nativeElement;
    e.click();
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
        name: obj['name'] ? obj['name'] : this.findName(obj),
        size: obj['size'] ? obj['size'] : 0,
        lastModified: obj['lastModified'] ? obj['lastModified'] : (new Date()).getTime(),
        type: obj['type'] ? obj['type'] : this.findExtension(obj)
      }
      const fileDetail: FileDetail = {
        file: imageFile,
        objects: obj,
        idValues: {},
        selected: true,
        previewImage: 'assets/images/image_default.svg'
      }
      result.push(fileDetail);
    });

    return result;
  }

  private repeatingValues(fields: object): object {
    const fieldResults: object = { ...fields };

    for (const field in fields) {
      const fieldValue = fields[field];

      if (fieldValue.length > 0) {
        for (const innerField in fields) {
          const value = fields[innerField];

          if (value.length > 0 && field !== innerField && !fieldResults[innerField].includes('$')) {
            const index = value.indexOf(fieldValue);

            if (index > -1) {
              fieldResults[innerField] = value.replace(fieldValue, '$' + field);
            }
          }
        }
      }
    }
    // check for $name value
    Object.entries(fieldResults).find(entry => {
      if (/(jpg|gif|png|webp|tiff|svg)$/.test(entry[1])) {
        fieldResults[entry[0]] = '$name';
      }
    });
    // remove values without id's
    for (const field in fieldResults) {
      const fieldValue = fieldResults[field];
      if (fieldValue.length > 0 && !fieldValue.includes('$')) {
        fieldResults[field] = fieldValue.replace(fieldValue, '');
      }
    }

    return fieldResults;
  }

  private findName(jsonObject: object) {
    let result = 'unknown';
    Object.values(jsonObject).find(value => {
      if (/(jpg|gif|png|webp|tiff|svg)$/.test(value)) {
        result = value.split(/[\\\/]/).pop();
      }
    });
    return result;
  }

  private findExtension(jsonObject: object) {
    let result = 'image/unknown';
    Object.values(jsonObject).forEach(value => {
      if (/(jpg|gif|png|webp|tiff|svg)$/.test(value)) {
        result = 'image/' + ((/[.]/.exec(value)) ? /[^.]+$/.exec(value)[0] : 'unknown').toLowerCase();
      }
    });
    return result;
  }

  private selectedFields(fieldsObj: object): object {
    const keys = Object.keys(fieldsObj);
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
        if (key === 'id') {
          this.fieldService.updateIdReference(this.findMaxId() + 1);
        }
      }
      if (addToUser) {
        userFields.push(this.addUserField({ key: key, value: fieldsObj[key] }));
      }
    });

    return {
      fields: {
        defaultFields: defaultFields,
        extraFields: extraFields,
        userFields: userFields
      }
    };
  }

  private findMaxId(): number {
    let result = 1;

    const objects = this.jsonService.loadedJson.value['data'];
    result = objects.reduce((a, b) => a.id > b.id ? a : b).id;

    return result;
  }

  private findKey(fields: JsonField[], key: string): number {
    return fields.findIndex(field => field.name === key);
  }

  private addUserField(field: object): JsonField {
    const key = field['key'];
    return { name: key, value: this.addValue(key), selected: true, id: '$' + key, type: FieldType.string, text: this.fieldNameToText(key) };
  }

  private fieldNameToText(fieldName: string): string {
    const spacedText = fieldName.replace(/([A-Z])/g, " $1");
    const result = spacedText.charAt(0).toUpperCase() + spacedText.slice(1);
    return result;
  }

  private addValue(key: string): string {
    return this.importedFields[key] ? this.importedFields[key] : '';
  }
}
