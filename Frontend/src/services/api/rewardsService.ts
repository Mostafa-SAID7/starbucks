import { ApiService } from './ApiService';
import { RewardOffer, UserReward } from '@/lib/schemas';

export class RewardsService extends ApiService {
  private static instance: RewardsService;

  public static getInstance(): RewardsService {
    if (!RewardsService.instance) {
      RewardsService.instance = new RewardsService();
    }
    return RewardsService.instance;
  }

  public async getStatus(): Promise<{ pointsBalance: number; availableOffers: RewardOffer[] }> {
    return this.get('/rewards/status');
  }

  public async redeemOffer(offerId: string): Promise<{ voucherCode: string; newBalance: number; message: string }> {
    return this.post('/rewards/redeem', { offerId });
  }
}

export const rewardsService = RewardsService.getInstance();
