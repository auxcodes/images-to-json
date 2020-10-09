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
    const jsonObjects: object[] = this.imageService.selectedImages.value.map(image => { return image.objects; });
    if (this.loadedJson.value['data']) {
      console.log(this.loadedJson.value['data']);
      jsonObjects.concat(this.loadedJson.value['data']);
    }
    const fieldsJson = includeFields ? { fields: fieldsUsed } : null;
    const jsonObj = {
      data: jsonObjects,
      ...fieldsJson
    };
    //console.log(jsonObj);
    this.outputJson.next(jsonObj);
  }

  loadJson(jsonFileContent: object) {
    //this.outputJson.next(jsonFileContent);
    this.loadedJson.next(jsonFileContent);
  }
}
