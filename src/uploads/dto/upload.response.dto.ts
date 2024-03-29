import {ApiProperty} from "@nestjs/swagger";

export class UploadResponseDto {
    @ApiProperty({
        description: '업로드 된 파일의 S3 URL',
        example:
            [
                "https://buckbuck-uploaded.s3.ap-northeast-2.amazonaws.com/1710605624135-images.jpeg",
                "https://buckbuck-uploaded.s3.ap-northeast-2.amazonaws.com/1710605624136-184293.jpg"
            ]
    })
    location: string[];

    constructor(locations: string[]) {
        this.location = locations.map(location => (location));
    }
}
