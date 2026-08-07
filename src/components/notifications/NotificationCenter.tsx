/**
 * IDN-UI-GEN-001: NOTIFICATION CENTER
 * 
 * Derives from:
 * - IDN-DS-001 PART 3.5 (Notifications)
 * - IDN-UIC-001 (Notification Component)
 * - EPOS-CORE-DOC-001 (Component patterns)
 * 
 * Implements:
 * - Global notification display
 * - Toast/Banner notifications
 * - 4 notification types: success, error, warning, info
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Auto-dismiss with manual close option
 */

import React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import type { NotificationType, Notification } from '~/hooks/useCustom';

// =============================================================================
// NOTIFICATION ITEM COMPONENT
// =============================================================================

interface NotificationItemProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClose,
}) => {
  // Map notification types to styling
  const typeConfig = {
    success: {
      bgColor: 'bg-success dark:bg-green-900',
      borderColor: 'border-success dark:border-green-700',
      textColor: 'text-success dark:text-green-200',
      icon: CheckCircle,
    },
    error: {
      bgColor: 'bg-danger/10 dark:bg-red-900/30',
      borderColor: 'border-danger dark:border-red-700',
      textColor: 'text-danger dark:text-red-200',
      icon: AlertCircle,
    },
    warning: {
      bgColor: 'bg-warning/10 dark:bg-amber-900/30',
      borderColor: 'border-warning dark:border-amber-700',
      textColor: 'text-warning dark:text-amber-200',
      icon: AlertTriangle,
    },
    info: {
      bgColor: 'bg-info/10 dark:bg-blue-900/30',
      borderColor: 'border-info dark:border-blue-700',
      textColor: 'text-info dark:text-blue-200',
      icon: Info,
    },
  };

  const config = typeConfig[notification.type];
  const IconComponent = config.icon;

  return (
    <div
      className={`
        flex items-start gap-3
        rounded-lg border px-4 py-3 mb-3
        ${config.bgColor}
        ${config.borderColor}
        border-l-4
        animate-in fade-in slide-in-from-top-2 duration-200
      `}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <IconComponent className={`h-5 w-5 flex-shrink-0 mt-0.5 ${config.textColor}`} />

      {/* Message */}
      <div className="flex-1 text-sm text-neutral-900 dark:text-white">
        {notification.message}
      </div>

      {/* Close Button */}
      <button
        onClick={() => onClose(notification.id)}
        className="flex-shrink-0 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
        aria-label={`Dismiss notification: ${notification.message}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// =============================================================================
// NOTIFICATION CENTER COMPONENT (Global Toast Container)
// =============================================================================

interface NotificationCenterProps {
  notifications: Notification[];
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onClose,
  position = 'top-right',
}) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div
      className={`
        fixed z-50 pointer-events-none
        ${positionClasses[position]}
      `}
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="pointer-events-auto w-96 max-w-[calc(100vw-2rem)]">
        {notifications.length > 0 && (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClose={onClose}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// NOTIFICATION CONTEXT (Global Notification State)
// =============================================================================

import { createContext, useContext } from 'react';
import type { UseNotificationReturn } from '~/hooks/useCustom';

const NotificationContext = createContext<UseNotificationReturn | undefined>(undefined);

export const useGlobalNotification = (): UseNotificationReturn => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useGlobalNotification must be used within NotificationProvider');
  }
  return context;
};

export { NotificationContext };
