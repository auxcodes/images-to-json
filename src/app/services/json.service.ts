import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImagesService } from './images.service';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  outputJson: BehaviorSubject<object> = new BehaviorSubject<object>({});
  loadedJson: BehaviorSubject<object> = new BehaviorSubject<object>({});

  constructor(private imageService: ImagesService) { }

  updateJsonOutput(fieldsUsed: object, includeFields: boolean) {
    let jsonObjects: object[] = this.imageService.selectedImages.value.map(image => { return image.objects; });
    if (this.loadedJson.value['data']) {
      const importedObjects: object[] = this.imageService.selectedImportedImages.value.map(image => { return image.objects; });
      jsonObjects = jsonObjects.concat(importedObjects);
    }
    const fieldsJson = includeFields ? { fields: fieldsUsed } : null;
    const jsonObj = {
      data: jsonObjects,
      ...fieldsJson
    };
    this.outputJson.next(jsonObj);
  }

  loadJson(jsonFileContent: object) {
    this.loadedJson.next(jsonFileContent);
  }
}
