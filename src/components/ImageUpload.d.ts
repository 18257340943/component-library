import React from "react";
import { ComValue } from './index';

interface ImageUploadProps extends ComValue {
  uploadMax: number,
  single: boolean,
  style: {}
}


declare const ImageUpload: React.FC<ImageUploadProps>;

export default ImageUpload;

