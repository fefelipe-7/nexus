import { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@nexus/shared';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  title: string;
  message: string;
  type?: NotificationType;
  duration?: number;
  onClose: () => void;
}

export function Notification({ title, message, type = 'info', duration = 5000, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'error':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-amber-500';
      default:
        return 'border-l-blue-500';
    }
  };

  return (
    <div
      className={cn(
        'bg-card border-l-4 rounded-lg shadow-lg p-4',
        'min-w-[350px] max-w-[450px]',
        getBorderColor(),
        isVisible
          ? 'animate-in slide-in-from-right-5 fade-in duration-300'
          : 'animate-out slide-out-to-right-5 fade-out duration-300'
      )}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="p-1 hover:bg-accent rounded transition-colors flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

interface NotificationContainerProps {
  notifications: Array<{ 
    id: string; 
    title: string; 
    message: string; 
    type?: NotificationType;
  }>;
  onRemove: (id: string) => void;
}

export function NotificationContainer({ notifications, onRemove }: NotificationContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div className="flex flex-col gap-3">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <Notification
              title={notification.title}
              message={notification.message}
              type={notification.type}
              onClose={() => onRemove(notification.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
