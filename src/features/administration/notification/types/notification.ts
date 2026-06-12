export type Notification = {
  ID: string;
  UserID: string;
  DeviceToken: string;
  Title: string;
  Body: string;
  Data: Record<string, any>;
  FCMMessageID: string;
  FCMStatus: string;
  ErrorMessage: string | null;
  OutboxID: string;
  CreatedAt: string;
  CreatedBy: string;
  UpdatedAt: string;
  UpdatedBy: string;
  DeletedAt: string | null;
  DeletedBy: string | null;
  // TODO: Add IsRead if backend supports it
  IsRead?: boolean;
};

export type NotificationResponse = {
  data: Notification[];
  metadata: {
    page: number;
    per_page: number;
    total: number;
  };
};

export type NotificationParams = {
  page?: number;
  per_page?: number;
};

export type RegisterDeviceTokenParams = {
  device_token: string;
  platform: string;
  user_id: string;
};

export type RegisterDeviceTokenResponse = {
  data: any;
  message: string;
  error?: string;
};

export type SendNotificationPayload = {
  body: string;
  data: {
    deeplink: string;
  };
  is_send_push_notif: boolean;
  title: string;
  user_id: string;
};
