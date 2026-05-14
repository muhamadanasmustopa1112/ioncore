import { useEffect, useState } from "react";
import { messaging } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { toast } from "sonner";

import { env } from "@/config/env";

export const useFcm = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const requestPermission = async () => {
      if (!messaging) return;

      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const currentToken = await getToken(messaging, {
            vapidKey: env.FIREBASE_VAPID_KEY,
          });


          if (currentToken) {
            setToken(currentToken);
          }
        }
      } catch (error) {
        console.error("An error occurred while retrieving token:", error);
      }
    };

    requestPermission();

    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        toast.info(payload.notification?.title || "New Notification", {
          description: payload.notification?.body,
        });
      });

      return () => unsubscribe();
    }
  }, []);

  return { token };
};
