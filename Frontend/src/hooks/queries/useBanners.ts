import { useQuery } from '@tanstack/react-query';
import { bannersService } from '@/services/api/bannersService';

export const useBanners = () => {
  return useQuery({
    queryKey: ['banners', 'active'],
    queryFn: () => bannersService.getActiveBanners(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
