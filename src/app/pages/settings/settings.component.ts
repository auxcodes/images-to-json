import { Component, OnInit } from '@angular/core';
import { FileManagerService } from 'src/app/services/file-manager.service';
import { FileDetail } from 'src/app/shared/interfaces/file-detail';
import { ImagesService } from '../../services/images.service';
import { FieldsService } from '../../services/fields.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  allFiles: FileDetail[] = [];
  selectedFiles: FileDetail[] = [];
  jsonOutput: object = {};

  indexed = false;
  dataKey = false;

  constructor(
    private imageService: ImagesService,
    private fieldService: FieldsService,
    private fileService: FileManagerService,
    
  ) {

    imageService.jsonOutput.subscribe(data => this.jsonOutput = data);
  }

  ngOnInit() {
    this.imageService.images.subscribe(files => {
      this.allFiles = files;
    });
    this.imageService.selectedImages.subscribe(files => {
      this.selectedFiles = files;
      if (files.length > 0) {
        this.refreshParsing(false);
      }
    });
  }

  get code() {
    return JSON.stringify(this.jsonOutput, null, 2);
  }

  set code(jsonString) {
    try {
      if (jsonString) {
        this.imageService.jsonOutput.next(JSON.parse(jsonString));
      }
    }
    catch (e) {
      console.log('Error occored while you were typing the JSON', e);
    };
  }

  onFileSelected(event) {
    this.imageService.updateImageList(event.target.files);
    this.imageService.images.next(this.parseImages(this.allFiles));
    this.imageService.updateSelectedImages();
    this.imageService.updateJsonOutput(this.fieldService.updateStorage());
  }

  parseImages(images: FileDetail[]) {
    let result: FileDetail[] = this.fieldService.updateIdValues(images);
    result = this.fieldService.parseSelectedFields(result);
    return result;
  }

  onImageChecked(imageId) {
    this.allFiles[imageId].selected = !this.allFiles[imageId].selected;
    this.imageService.updateSelectedImages(this.allFiles);
  }

  onOutputPreviewChange(target) {
    this.indexed = target === 'indexJson' ? !this.indexed : this.indexed;
    this.dataKey = target === 'dataKeyJson' ? !this.dataKey : this.dataKey;
    this.imageService.updateJsonOutput(this.fieldService.updateStorage());
  }

  onSaveFile() {
    if (this.selectedFiles.length > 0) {
      this.fileService.saveToFile(this.jsonOutput);
    }
    else {
      alert('No images selected!');
    }
  }

  refreshParsing(parseAllImages: boolean) {
    if (this.selectedFiles.length > 0) {
      if (parseAllImages) {
        this.imageService.images.next(this.parseImages(this.selectedFiles));
      }
      this.selectedFiles = this.parseImages(this.selectedFiles);
      this.imageService.updateJsonOutput(this.fieldService.updateStorage());  
    }
  }

}
