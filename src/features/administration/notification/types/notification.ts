export type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  data?: Record<string, any>;
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
