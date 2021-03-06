import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { ImagesService } from '../../services/images.service';
import { FileDetail } from '../../shared/interfaces/file-detail';
import { FieldsService } from '../../services/fields.service';
import { JsonService } from '../../services/json.service';

@Component({
  selector: 'app-image-selection',
  templateUrl: './image-selection.component.html',
  styleUrls: ['./image-selection.component.scss']
})
export class ImageSelectionComponent implements OnInit {

  allFiles: FileDetail[] = [];
  selectedFiles: FileDetail[] = [];
  importedFiles: FileDetail[] = [];
  selectedImportedFiles: FileDetail[] = [];


  defaultImages: object[] = [
    { imagePreview: 'assets/images/image_default.svg', fileName: 'imae_default.svg' },
    { imagePreview: 'assets/images/image_default.svg', fileName: 'imae_default.svg' }]
  filesSelected = false;
  private addMore = false;

  @ViewChild('ImageSelectInputDialog', { static: false }) fileSelectDialog: ElementRef;

  constructor(
    private imageService: ImagesService,
    private fieldService: FieldsService,
    private jsonService: JsonService) {
  }

  ngOnInit() {
    this.imageService.images.subscribe(files => {
      this.allFiles = files;
      this.filesSelected = files.length > 0;
    });
    this.imageService.selectedImages.subscribe(files => {
      this.selectedFiles = files;
      this.refreshParsing(false);
    });
    this.imageService.importedImages.subscribe(files => {
      this.importedFiles = files;
    });
    this.imageService.selectedImportedImages.subscribe(files => {
      this.selectedImportedFiles = files;
      this.refreshImportedParsing(false);
    });

    this.imageService.reparseTrigger.subscribe(reparseAll => {
      this.refreshParsing(reparseAll);
      this.refreshImportedParsing(reparseAll);
    });
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
    this.jsonService.updateJsonOutput(this.fieldService.updateStorage(), this.imageService.fieldsInterface.value);
  }

  onImageChecked(imageId) {
    this.allFiles[imageId].selected = !this.allFiles[imageId].selected;
    this.imageService.updateSelectedImages(this.allFiles);
  }

  onImportedImageChecked(image) {
    this.importedFiles[image.value].selected = !this.importedFiles[image.value].selected;
    this.imageService.updateImportedImages(this.importedFiles);
  }

  onImagesReset() {
    this.imageService.resetImages();
    this.jsonService.updateJsonOutput(this.fieldService.updateStorage(), this.imageService.fieldsInterface.value);
  }

  onDrop(event) {
    this.addMore = true;
    event.preventDefault();
    const files = this.fileTypeCheck(event.dataTransfer.files);
    const data = { target: { files: files } };
    this.onFileSelected(data);
    this.onDragLeave(event);
  }

  private fileTypeCheck(files) {
    const count = files.length;
    const filterFiles = [];
    for (let i = 0; i < count; i++) {
      if (files[i].type.match('image/*')) {
        filterFiles.push(files[i]);
      }
      else {
        if (confirm(files[i].name + ' is not an image file! \n\n - OK to include \n - Cancel to skip')) {
          filterFiles.push(files[i]);
        }
      }
    }
    return filterFiles;
  }

  onDragOver(event) {
    event.currentTarget.style.background = "#f1f1f1";
    event.stopPropagation();
    event.preventDefault();
  }

  onDragLeave(event) {
    event.currentTarget.style.background = "none";
    event.currentTarget.style.border = "3px dashed #e1e1e1";
  }

  parseImages(images: FileDetail[]) {
    let result: FileDetail[] = this.fieldService.updateIdValues(images);
    result = this.fieldService.parseSelectedFields(result);
    return result;
  }

  parseImportedImages(images: FileDetail[]) {
    const result: FileDetail[] = this.fieldService.updateIdValues(images);
    const updateFields = this.fieldService.compareImportedFields();

    result.forEach(resultImage => {
      // add fields
      for (const field in updateFields.add) {
        resultImage.objects[field] = resultImage.idValues['$' + field];
      }
      // remove fields
      updateFields.remove.forEach(key => {
        delete resultImage.objects[key];
      });
    });

    if (updateFields.add['id']) {
      this.fieldService.updateIdReference(this.jsonService.loadedDataMaxId() + 1);
    }

    return result;
  }

  refreshParsing(parseAllImages: boolean) {
    if (this.selectedFiles.length > 0) {
      if (parseAllImages) {
        this.imageService.images.next(this.parseImages(this.allFiles));
      }
      this.selectedFiles = this.parseImages(this.selectedFiles);
    }
    this.jsonService.updateJsonOutput(this.fieldService.updateStorage(), this.imageService.fieldsInterface.value);

  }

  refreshImportedParsing(parseAllImages: boolean) {
    if (this.selectedImportedFiles.length > 0) {
      this.parseImportedImages(this.importedFiles);
      if (parseAllImages) {
        //this.imageService.images.next(this.parseImages(this.allFiles));
      }
      //this.selectedFiles = this.parseImages(this.selectedFiles);
    }
    this.jsonService.updateJsonOutput(this.fieldService.updateStorage(), this.imageService.fieldsInterface.value);
  }
}
