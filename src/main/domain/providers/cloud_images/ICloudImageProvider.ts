export interface ICloudImageProvider {
  uploadImage(image: Express.Multer.File, filename: string): Promise<string>
  removePicture(filename: string): Promise<void>

  uploadImageWithBuffer(buffer: string, filename: string): Promise<string>
}
