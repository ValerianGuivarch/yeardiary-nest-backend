import { ICloudImageProvider } from '../../domain/providers/cloud_images/ICloudImageProvider'
import { ProviderErrors } from '../errors/ProviderErrors'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UploadApiErrorResponse, v2 as cloudinary } from 'cloudinary'
import { createReadStream } from 'streamifier'
@Injectable()
export class CloudinaryProvider implements ICloudImageProvider {
  private readonly logger = new Logger(CloudinaryProvider.name)
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('cloudinary.cloudName'),
      api_key: this.configService.get('cloudinary.apiKey'),
      api_secret: this.configService.get('cloudinary.apiSecret')
    })
  }

  async uploadImage(image: Express.Multer.File, filename: string): Promise<string> {
    try {
      const res = (await new Promise((resolve, reject) => {
        const cld_upload_stream = cloudinary.uploader.upload_stream(
          {
            filename_override: filename,
            folder: this.configService.get('cloudinary.folder'),
            unique_filename: false,
            overwrite: true,
            discard_original_filename: true,
            use_filename: true
          },
          (
            error: UploadApiErrorResponse | undefined,
            result:
              | {
                  url: string
                }
              | undefined
          ) => {
            if (result) {
              resolve(result)
            } else {
              reject(error)
            }
          }
        )

        createReadStream(image.buffer).pipe(cld_upload_stream)
      })) as {
        url: string
      }
      return res.url
    } catch (e) {
      throw ProviderErrors.UploadImageToCloudinaryFailed()
    }
  }

  async uploadImageWithBuffer(buffer: string, filename: string): Promise<string> {
    const res = await cloudinary.uploader.upload(
      buffer,
      {
        filename_override: filename,
        folder: this.configService.get('cloudinary.folder'),
        unique_filename: false,
        overwrite: true,
        discard_original_filename: true,
        use_filename: true
      },
      (
        error: UploadApiErrorResponse | undefined,
        result:
          | {
              url: string
            }
          | undefined
      ) => {
        if (error) {
          throw ProviderErrors.UploadImageToCloudinaryFailed()
        } else {
          return result
        }
      }
    )
    return res['url']
  }

  async removePicture(filename: string): Promise<void> {
    try {
      const result = await cloudinary.uploader.destroy(`${this.configService.get('cloudinary.folder')}/${filename}`, {
        type: 'upload',
        invalidate: true,
        resource_type: 'image'
      })
      console.log(result)
    } catch (e) {
      this.logger.error(`Error deleting image ${filename}`)
    }
  }
}
