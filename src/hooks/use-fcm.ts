import { useEffect, useState } from "react";
import { messaging } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { toast } from "sonner";
import { env } from "@/config/env";
import { useAuthStore } from "@/store/auth-store";
import { useNotificationStore } from "@/store/notification-store";
import { registerDeviceToken } from "@/features/administration/notification/api/register-device-token";

export const useFcm = () => {
  const [token, setToken] = useState<string | null>(null);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  // Ambil state dan tindakan dari Notification Zustand Store dengan built-in Persistence
  const {
    registeredFcmToken,
    registeredFcmUserId,
    setRegistered,
    clearRegistered,
  } = useNotificationStore();

  useEffect(() => {
    // 1. Enterprise Guard: Jika user logout, bersihkan cache token lokal
    if (!isAuthenticated || !user) {
      if (registeredFcmToken || registeredFcmUserId) {
        clearRegistered();
      }
      return;
    }

    const requestPermissionAndRegister = async () => {
      if (!messaging) {
        return;
      }

      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const currentToken = await getToken(messaging, {
            vapidKey: env.FIREBASE_VAPID_KEY,
          });

          if (currentToken) {
            setToken(currentToken);

            // 2. Bandingkan secara reactive menggunakan state dari Zustand Store
            if (
              registeredFcmToken !== currentToken ||
              registeredFcmUserId !== user.id
            ) {
              await registerDeviceToken({
                device_token: currentToken,
                platform: "web",
                user_id: user.id,
              });

              // 3. Simpan state terdaftar (Zustand otomatis menyimpan ke localStorage di background)
              setRegistered(currentToken, user.id);
            }
          }
        }
      } catch (error) {
        console.error("❌ [FCM] Terjadi kesalahan saat registrasi device token:", error);
      }
    };

    requestPermissionAndRegister();

    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        toast.info(payload.notification?.title || "Notifikasi Baru", {
          description: payload.notification?.body,
        });
      });

      return () => unsubscribe();
    }
  }, [
    isAuthenticated,
    user?.id,
    registeredFcmToken,
    registeredFcmUserId,
    setRegistered,
    clearRegistered,
  ]);

  return { token };
};
