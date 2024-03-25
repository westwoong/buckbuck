export interface MulterS3FileLocation extends Express.Multer.File {
    key: string;
    location: string;
}