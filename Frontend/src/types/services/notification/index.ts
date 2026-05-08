/**
 * Notification Service Types
 * Toast notifications and user messaging types
 */

export interface NotificationConfig {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary';
}