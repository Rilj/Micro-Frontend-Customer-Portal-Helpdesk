import React, { useState, useEffect } from "react";
import { Button, Badge } from "@mf-enterprise/ui-components";
import { Bell, X } from "lucide-react";
import { eventBus } from "@mf-enterprise/event-bus";
import { useChatStore } from "../store/chat-store";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
}

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { rooms } = useChatStore();

  useEffect(() => {
    const unsub = eventBus.on("notification:show", (data) => {
      const newNotification: NotificationItem = {
        id: crypto.randomUUID(),
        title: data.title,
        message: data.message,
        type: data.type,
        timestamp: new Date()
      };
      setNotifications((prev) => [newNotification, ...prev.slice(0, 19)]);
    });

    return unsub;
  }, []);

  const unreadCount = rooms.reduce((sum, room) => sum + room.unreadCount, 0);
  const totalNotifications = notifications.length;

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Bell className="h-5 w-5" />
        {(totalNotifications > 0 || unreadCount > 0) && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
          >
            {totalNotifications + unreadCount}
          </Badge>
        )}
      </Button>

      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-80 rounded-md border bg-popover p-2 shadow-lg z-50">
          <p className="text-xs font-medium text-muted-foreground mb-2 px-2">
            Notifications
          </p>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground px-2 py-4 text-center">
              No new notifications
            </p>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-md p-3 mb-2 hover:bg-accent"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissNotification(notification.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
