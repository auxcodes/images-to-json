import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileDetail } from '../shared/interfaces/file-detail';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  images: BehaviorSubject<FileDetail[]> = new BehaviorSubject<FileDetail[]>([]);
  selectedImages: BehaviorSubject<FileDetail[]> = new BehaviorSubject<FileDetail[]>([]);
  jsonOutput: BehaviorSubject<object> = new BehaviorSubject<object>({ data: [] });

  constructor() { }

  updateImageList(files) {
    const rawImages = files;
    const images: FileDetail[] = [];
    for (let i = 0; i < rawImages.length; i++) {
      this.imagePreview(rawImages[i]);
      const image: FileDetail = { file: rawImages[i], objects: {}, idValues: [], selected: true, previewImage: 'assets/images/image_broken.svg' };
      images.push(image);
    }
    this.images.next(images);
  }

  private imagePreview(file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.updateImagePreviews(file.name, reader.result.toString());
    }
    reader.readAsDataURL(file);
  }

  private updateImagePreviews(name: string, preview) {
    this.images.getValue().find(image => image.file.name === name).previewImage = preview;
  }

  updateSelectedImages(updatedList?: FileDetail[]) {
    if (updatedList) {
      this.images.next(updatedList);
    }

    const selected: FileDetail[] = [];
    this.images.value.forEach(image => {
      if (image.selected) {
        selected.push(image);
      }
    });
    this.selectedImages.next(selected);
  }

  updateJsonOutput(fieldsUsed) {
    const jsonObjects = this.selectedImages.value.map(image => { return image.objects; });
    const jsonObj = {
      data: jsonObjects,
      fields: fieldsUsed
    };
    this.jsonOutput.next(jsonObj);
  }

  resetImages() {
    this.images.next([]);
    this.selectedImages.next([]);
    this.jsonOutput.next({ data: []});
  }

}
