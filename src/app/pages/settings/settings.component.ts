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

  jsonOutput: object = {};

  indexed = false;
  dataKey = false;

  constructor(
    private imageService: ImagesService,
    private fieldService: FieldsService,
    private fileService: FileManagerService
  ) {
    imageService.jsonOutput.subscribe(data => this.jsonOutput = data);
  }

  ngOnInit() {
  }

  onRefreshParsing(reparseAll) {
    this.imageService.reparse.next(reparseAll);
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

  onOutputPreviewChange(target) {
    this.indexed = target === 'indexJson' ? !this.indexed : this.indexed;
    this.dataKey = target === 'dataKeyJson' ? !this.dataKey : this.dataKey;
    this.imageService.updateJsonOutput(this.fieldService.updateStorage());
  }

  onSaveFile() {
    if (this.imageService.selectedImages.value.length > 0) {
      this.fileService.saveToFile(this.jsonOutput);
    }
    else {
      alert('No images selected!');
    }
  }
}
