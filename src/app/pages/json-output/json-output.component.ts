import { Component, OnInit } from '@angular/core';
import { FileManagerService } from 'src/app/services/file-manager.service';
import { ImagesService } from '../../services/images.service';
import { FieldsService } from '../../services/fields.service';

@Component({
  selector: 'app-json-output',
  templateUrl: './json-output.component.html',
  styleUrls: ['./json-output.component.scss']
})
export class JsonOutputComponent implements OnInit {

  jsonOutput: object = {};
  includeFieldsInterface = true;

  indexed = false;
  dataKey = false;

  constructor(
    private imageService: ImagesService,
    private fieldService: FieldsService,
    private fileService: FileManagerService
  ) {
    imageService.jsonOutput.subscribe(data => {
      this.jsonOutput = data;
    });
  }

  ngOnInit() {
    this.imageService.fieldsInterface.subscribe(checked => {
      this.includeFieldsInterface = checked;
      this.imageService.updateJsonOutput(this.fieldService.updateStorage(), checked);
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

  onIncludeInterface(checked) {
    this.imageService.fieldsInterface.next(checked);
  }

  onOutputPreviewChange(target) {
    this.indexed = target === 'indexJson' ? !this.indexed : this.indexed;
    this.dataKey = target === 'dataKeyJson' ? !this.dataKey : this.dataKey;
    this.imageService.updateJsonOutput(this.fieldService.updateStorage(), this.includeFieldsInterface);
  }

  onSaveFile() {
    if (this.imageService.selectedImages.value.length > 0 || this.includeFieldsInterface) {
      this.fileService.saveToFile(this.jsonOutput);
    }
    else {
      alert('No images selected!');
    }
  }

}
