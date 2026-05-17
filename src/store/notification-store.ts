import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NotificationStore {
  registeredFcmToken: string | null;
  registeredFcmUserId: string | null;
  setRegistered: (token: string, userId: string) => void;
  clearRegistered: () => void;
}

/**
 * Zustand Store with built-in Persistence to track registered FCM tokens.
 * This completely abstracts direct localStorage reads/writes, ensuring a clean,
 * reactive state that is safe from Next.js hydration issues.
 */
export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      registeredFcmToken: null,
      registeredFcmUserId: null,
      setRegistered: (token, userId) =>
        set({ registeredFcmToken: token, registeredFcmUserId: userId }),
      clearRegistered: () =>
        set({ registeredFcmToken: null, registeredFcmUserId: null }),
    }),
    {
      name: "ion-notification-storage",
    }
  )
);
