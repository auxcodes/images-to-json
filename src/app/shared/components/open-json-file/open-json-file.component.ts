import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  private jsonObjects: object = null;

  @ViewChild('FileSelectInputDialog', { static: false }) fileSelectDialog: ElementRef;

  constructor(
    private fileService: FileManagerService,
    private imageService: ImagesService,
    private fieldService: FieldsService) { }

  ngOnInit() {
    this.fileService.jsonFile.subscribe(file => {
      if (Object.values(file)[0]) {
        let fieldsJson: object = (Object.keys(file)[1] && Object.keys(file)[1] === 'fields') ? { fields: Object.values(file)[1] } : null;
        const imagesJson = Object.keys(file)[0] === 'data' ? { data: Object.values(file)[0] } : { data: [] };
        this.jsonObjects = {
          ...imagesJson,
          ...fieldsJson
        }
        if (this.jsonObjects) {
          if (!fieldsJson) {
            fieldsJson = this.selectedFields(Object.keys(imagesJson.data[0]));
          }
          this.fieldService.setAllFields(fieldsJson['fields']);
          this.imageService.jsonOutput.next(this.jsonObjects);
          this.imageService.images.next(this.imageFiles(imagesJson.data));
          this.imageService.selectedImages.next(this.imageFiles(imagesJson.data));
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
        name: obj['name'] ? obj['name'] : 'unknown',
        size: obj['size'] ? obj['size'] : 0,
        lastModified: obj['lastModified'] ? obj['lastModified'] : (new Date()).getTime(),
        type: obj['type'] ? obj['type'] : 'image/unknown'
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

  private selectedFields(keys: string[]): object {
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

    return {
      fields: {
        defaultFields: defaultFields,
        extraFields: extraFields,
        userFields: userFields
      }
    };
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
