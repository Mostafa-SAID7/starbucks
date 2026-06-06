import { Injectable, inject } from '@angular/core';
import { Observable, of, catchError } from 'rxjs';
import { ApiService } from './api.service';

export interface SystemSetting {
  key: string;
  value: string;
  label: string;
  description: string;
  type: 'number' | 'text' | 'boolean';
  group: string;
}

const MOCK_SETTINGS: SystemSetting[] = [
  { key: 'TaxRate',           value: '14',     label: 'Tax Rate (%)',            description: 'VAT applied to all orders in Egypt',               type: 'number',  group: 'Payments' },
  { key: 'DeliveryFee',       value: '15',     label: 'Delivery Fee (EGP)',      description: 'Flat delivery fee charged per order',               type: 'number',  group: 'Payments' },
  { key: 'MinOrderAmount',    value: '50',     label: 'Min. Order Amount (EGP)', description: 'Minimum cart value required to place an order',     type: 'number',  group: 'Payments' },
  { key: 'FreeDeliveryThreshold', value: '200', label: 'Free Delivery Threshold (EGP)', description: 'Cart value above which delivery is free',    type: 'number',  group: 'Payments' },
  { key: 'LoyaltyPointsRate', value: '10',     label: 'Loyalty Points Rate',     description: 'Points earned per EGP spent',                       type: 'number',  group: 'Loyalty' },
  { key: 'LoyaltyRedeemRate', value: '100',    label: 'Points Redeem Rate',      description: 'Points required to redeem 1 EGP discount',          type: 'number',  group: 'Loyalty' },
  { key: 'MaintenanceMode',   value: 'false',  label: 'Maintenance Mode',        description: 'Temporarily disable the customer-facing website',   type: 'boolean', group: 'System' },
  { key: 'AllowGuestOrders',  value: 'true',   label: 'Allow Guest Orders',      description: 'Allow customers to order without an account',       type: 'boolean', group: 'System' },
  { key: 'SupportEmail',      value: 'support@starbucks.eg', label: 'Support Email', description: 'Customer support contact email',               type: 'text',    group: 'Contact' },
  { key: 'SupportPhone',      value: '+20 19 505', label: 'Support Phone',       description: 'Customer support hotline number',                   type: 'text',    group: 'Contact' },
];

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private api = inject(ApiService);

  getSettings(): Observable<SystemSetting[]> {
    return this.api.get<SystemSetting[]>('/admin/settings').pipe(
      catchError(() => of(MOCK_SETTINGS))
    );
  }

  updateSetting(key: string, value: string): Observable<void> {
    return this.api.put<void>(`/admin/settings/${key}`, { value }).pipe(
      catchError(() => of(undefined as unknown as void))
    );
  }
}
