import {Body, Controller, HttpCode, Param, ParseIntPipe, Post, Request, UseGuards} from '@nestjs/common';
import {ReviewService} from "./review.service";
import {JwtAuthGuard} from "../auth/jwtPassport/jwtAuth.guard";
import {UserIdRequest} from "../common/userId.request.interface";
import {CreateReviewRequestDto} from "./dto/createReview.request.dto";
import {ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('리뷰 API')
@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {
    }

    @Post('performers/:performerId')
    @ApiBearerAuth()
    @ApiOperation({summary: '리뷰 작성 API', description: '리뷰를 작성한다.'})
    @ApiResponse({status: 201, description: 'No Content'})
    @ApiParam({
        name: 'performerId',
        description: '리뷰를 작성할 performerId 값을 입력한다',
        type: 'number'
    })
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
