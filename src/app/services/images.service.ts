import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileDetail } from '../shared/interfaces/file-detail';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  images: BehaviorSubject<FileDetail[]> = new BehaviorSubject<FileDetail[]>([]);
  jsonOutput: BehaviorSubject<object> = new BehaviorSubject<object>({});

  constructor() { }

  updateImageList(files) {
    const rawImages = files;
    const images: FileDetail[] = [];
    for (let i = 0; i < rawImages.length; i++) {
      const image: FileDetail = { file: rawImages[i], objects: {}, idValues: [] };
      images.push(image);
    }
    this.images.next(images);
  }

  updateJsonOutput() {
    const jsonObjects = this.images.value.map(image => { return image.objects; });
    const jsonObj = { data: jsonObjects };
    this.jsonOutput.next(jsonObj);
  }

}
