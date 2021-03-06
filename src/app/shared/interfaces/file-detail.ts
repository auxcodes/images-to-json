import { ImageFile } from './image-file';

export interface FileDetail {
  file: ImageFile;
  objects: object;
  idValues?: {};
  selected: boolean;
  previewImage?: string;
}
