import {Body, Controller, HttpCode, Param, Post} from '@nestjs/common';
import {ReviewService} from "./review.service";

@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {
    }

    @Post('performers/:performerId')
    @HttpCode(201)
    create(
        @Param('performerId') performerId: string,
        @Body() createReviewRequestDto: any
    ) {
        const parsedPerformerId = parseInt(performerId)
        return this.reviewService.create(parsedPerformerId, createReviewRequestDto);
    }
}
