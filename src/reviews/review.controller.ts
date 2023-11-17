import {Body, Controller, HttpCode, Param, Post, Request, UseGuards} from '@nestjs/common';
import {ReviewService} from "./review.service";
import {JwtAuthGuard} from "../auth/jwtPassport/jwtAuth.guard";
import {UserIdRequest} from "../common/userId.request.interface";
import {CreateReviewRequestDto} from "./dto/createReview.request.dto";

@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {
    }

    @Post('performers/:performerId')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    create(
        @Request() req: UserIdRequest,
        @Param('performerId') performerId: string,
        @Body() createReviewRequestDto: CreateReviewRequestDto
    ) {
        const requesterId = req.user.userId;
        const parsedPerformerId = parseInt(performerId)
        return this.reviewService.create(requesterId, parsedPerformerId, createReviewRequestDto);
    }
}
