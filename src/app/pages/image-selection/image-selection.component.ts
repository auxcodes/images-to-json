import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { ImagesService } from '../../services/images.service';
import { FileDetail } from '../../shared/interfaces/file-detail';
import { FieldsService } from '../../services/fields.service';

@Component({
  selector: 'app-image-selection',
  templateUrl: './image-selection.component.html',
  styleUrls: ['./image-selection.component.scss']
})
export class ImageSelectionComponent implements OnInit {

  allFiles: FileDetail[] = [];
  selectedFiles: FileDetail[] = [];
  filesSelected = false;
  private addMore = false; 

  @ViewChild('ImageSelectInputDialog', { static: false }) fileSelectDialog: ElementRef;

  constructor(
    private imageService: ImagesService,
    private fieldService: FieldsService) {
  }

  ngOnInit() {
    this.imageService.images.subscribe(files => {
      this.allFiles = files;
      this.filesSelected = files.length > 0;
    });
    this.imageService.selectedImages.subscribe(files => {
      this.selectedFiles = files;
      if (files.length > 0) {
        this.refreshParsing(false);
      }
    });
    this.imageService.reparse.subscribe(reparseAll => this.refreshParsing(reparseAll));
  }

  onOpenFileDialog(addMore: boolean) {
    this.addMore = addMore;
    const e: HTMLElement = this.fileSelectDialog.nativeElement;
    e.click();
  }

  onFileSelected(event) {
    if (this.addMore) {
      this.imageService.addToImageList(event.target.files);
    }
    else {
      this.imageService.newImageList(event.target.files);
    }
    this.imageService.images.next(this.parseImages(this.allFiles));
    this.imageService.updateSelectedImages();
    this.imageService.updateJsonOutput(this.fieldService.updateStorage(), this.imageService.fieldsInterface.value);
  }

  onImageChecked(imageId) {
    this.allFiles[imageId].selected = !this.allFiles[imageId].selected;
    this.imageService.updateSelectedImages(this.allFiles);
  }

  onImagesReset() {
    this.imageService.resetImages();
  }

  parseImages(images: FileDetail[]) {
    let result: FileDetail[] = this.fieldService.updateIdValues(images);
    result = this.fieldService.parseSelectedFields(result);
    return result;
  }

  refreshParsing(parseAllImages: boolean) {
    if (this.selectedFiles.length > 0) {
      if (parseAllImages) {
        this.imageService.images.next(this.parseImages(this.selectedFiles));
      }
      this.selectedFiles = this.parseImages(this.selectedFiles);
      this.imageService.updateJsonOutput(this.fieldService.updateStorage(), this.imageService.fieldsInterface.value);
    }
  }
}
