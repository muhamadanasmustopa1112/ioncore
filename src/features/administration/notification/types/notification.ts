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
