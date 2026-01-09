import { useState, useCallback } from 'react';
import type { NotificationType } from '@/ui/components/feedback/Notification';

interface Notification {
  id: string;
  title: string;
  message: string;
  type?: NotificationType;
}

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    title: string,
    message: string,
    type: NotificationType = 'info'
  ) => {
    const id = Math.random().toString(36).substring(7);
    setNotifications((prev) => [...prev, { id, title, message, type }]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const success = useCallback(
    (title: string, message: string) => addNotification(title, message, 'success'),
    [addNotification]
  );
  
  const error = useCallback(
    (title: string, message: string) => addNotification(title, message, 'error'),
    [addNotification]
  );
  
  const warning = useCallback(
    (title: string, message: string) => addNotification(title, message, 'warning'),
    [addNotification]
  );
  
  const info = useCallback(
    (title: string, message: string) => addNotification(title, message, 'info'),
    [addNotification]
  );

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
  };
}
