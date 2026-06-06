import { PositionReviewService } from "./positions/positionReviewService.js";

const service = new PositionReviewService();

const reviews = service.generateReviews();

console.log(`Generated ${reviews.length} review candidates`);

console.log(JSON.stringify(reviews, null, 2));
