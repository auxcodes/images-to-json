import { Component, OnInit } from '@angular/core';
import { FileManagerService } from 'src/app/services/file-manager.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private fileService: FileManagerService) { }

  fileList: object[] = [];

  ngOnInit() {
  }


  onFileSelected(event) {
    console.log('File selected: ', event.target.files);
    const images: object[] = event.target.files;
    this.fileList = images.map(image => {
      console.log(image);
      return image;
    });

    console.log("FileList: ", this.fileList);
    this.fileService.openFile(event.target.files[0]);

  }
}
