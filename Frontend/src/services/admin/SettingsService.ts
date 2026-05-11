import { ApiService } from '../api/ApiService';
import { SystemSetting, UpdateSettingRequest } from '@/lib/schemas';

export class SettingsService extends ApiService {
  private static instance: SettingsService;

  public static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  public async getAllSettings(): Promise<SystemSetting[]> {
    return this.get<SystemSetting[]>('/admin/settings');
  }

  public async updateSetting(key: string, request: UpdateSettingRequest): Promise<void> {
    await this.put(`/admin/settings/${key}`, request);
  }
}

export const settingsService = SettingsService.getInstance();
