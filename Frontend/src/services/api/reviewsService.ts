import { ApiService } from './ApiService';
import { Review, CreateReviewRequest } from '@/lib/schemas';

export class ReviewsService extends ApiService {
  private static instance: ReviewsService;

  public static getInstance(): ReviewsService {
    if (!ReviewsService.instance) {
      ReviewsService.instance = new ReviewsService();
    }
    return ReviewsService.instance;
  }

  public async getMenuItemReviews(menuItemId: string): Promise<Review[]> {
    return this.get<Review[]>(`/reviews/menu-item/${menuItemId}`);
  }

  public async submitReview(request: CreateReviewRequest): Promise<Review> {
    return this.post<Review>('/reviews', request);
  }
}

export const reviewsService = ReviewsService.getInstance();
