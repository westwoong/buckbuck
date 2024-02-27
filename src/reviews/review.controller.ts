import {Body, Controller, HttpCode, Param, ParseIntPipe, Post, Request, UseGuards} from '@nestjs/common';
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
        @Param('performerId', ParseIntPipe) performerId: number,
        @Body() createReviewRequestDto: CreateReviewRequestDto
    ) {
        const requesterId = req.user.userId;
        return this.reviewService.create(requesterId, performerId, createReviewRequestDto);
    }
}
