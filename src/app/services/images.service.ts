import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileDetail } from '../shared/interfaces/file-detail';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  images: BehaviorSubject<FileDetail[]> = new BehaviorSubject<FileDetail[]>([]);
  selectedImages: BehaviorSubject<FileDetail[]> = new BehaviorSubject<FileDetail[]>([]);
  reparse: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  fieldsInterface: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() { }

  newImageList(files) {
    const rawImages = files;
    const images: FileDetail[] = [];
    for (const rawImage of rawImages) {
      const image: FileDetail = { file: rawImage, objects: {}, idValues: [], selected: true, previewImage: 'assets/images/image_broken.svg' };
      images.push(image);
      this.images.next(images);
      this.imagePreview(rawImage);
    }
  }

  addToImageList(files) {
    const rawImages = files;
    const images: FileDetail[] = this.images.value;
    for (const rawImage of rawImages) {
      const image: FileDetail = { file: rawImage, objects: {}, idValues: [], selected: true, previewImage: 'assets/images/image_broken.svg' };
      images.push(image);
      this.images.next(images);
      this.imagePreview(rawImage);
    }
  }

  private imagePreview(file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.updateImagePreviews(file.name, file.type.match('image/*') ? reader.result.toString() : 'assets/images/image_broken.svg');
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

  resetImages() {
    this.images.next([]);
    this.selectedImages.next([]);
  }

}
