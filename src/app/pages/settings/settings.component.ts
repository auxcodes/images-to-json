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
    const images = event.target.files;
    for (var i = 0; i < images.length; i++) {
        const image = images[i];
        console.log(image);
        this.fileList.push({ filename: image.name, path: "assets/images/", size: image.size, type: image.type });
    }
    console.log("FileList: ", JSON.stringify(this.fileList));
    this.fileService.openFile(event.target.files[0]);
  }
}
