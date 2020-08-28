import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileDetail } from '../shared/interfaces/file-detail';
import { JsonField } from '../shared/interfaces/json-field';
import { FieldType } from '../shared/enums/field-type.enum';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  images: BehaviorSubject<FileDetail[]> = new BehaviorSubject<FileDetail[]>([]);


  constructor() { }

  updateImageList(files) {
    const rawImages = files;
    const images: FileDetail[] = [];
    for (let i = 0; i < rawImages.length; i++) {
      const image: FileDetail = { file: rawImages[i], objects: '' };
      images.push(image);
    }
    this.images.next(images);
  }




}
