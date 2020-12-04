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
    let jsonObjects: object[] = this.imageService.selectedImages.value.map(image => {
      const sorted = {};
      Object.keys(image.objects).sort().forEach(key => {
        sorted[key] = image.objects[key];
      });
      return sorted;
    });
    if (this.loadedJson.value['data']) {
      const importedObjects: object[] = this.imageService.selectedImportedImages.value.map(image => {
        const sorted = {};
        Object.keys(image.objects).sort().forEach(key => {
          sorted[key] = image.objects[key];
        });
        return sorted;
      });
      jsonObjects = jsonObjects.concat(importedObjects);
    }

    jsonObjects.sort((a, b) => {
      if (a['id']) {
        return a['id'] - b['id'];
      }
    });

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

  loadedDataMaxId(): number {
    let result = 1;

    const objects = this.loadedJson.value['data'];
    result = objects.reduce((a, b) => a.id > b.id ? a : b).id;

    return result;
  }

  maxId(): number {
    let result = 1;

    const objects = this.outputJson.value['data'];
    result = objects.reduce((a, b) => a.id > b.id ? a : b).id;

    return result;
  }

}
