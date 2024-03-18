export interface MulterS3FileLocation extends Express.Multer.File {
    location: string;
}