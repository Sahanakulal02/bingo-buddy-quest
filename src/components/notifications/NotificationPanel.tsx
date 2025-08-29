import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  X, 
  Check, 
  UserPlus, 
  GamepadIcon,
  Trophy,
  Clock,
  Users
} from "lucide-react";

interface Notification {
  id: string;
  type: 'game_invite' | 'game_result' | 'friend_request' | 'achievement';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
  fromUser?: {
    id: string;
    username: string;
  };
  gameId?: string;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onAcceptInvite: (gameId: string) => void;
  onDeclineInvite: (gameId: string) => void;
  onMarkAsRead: (notificationId: string) => void;
  onClearAll: () => void;
}

export const NotificationPanel = ({
  notifications,
  onAcceptInvite,
  onDeclineInvite,
  onMarkAsRead,
  onClearAll
}: NotificationPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'game_invite':
        return <GamepadIcon className="h-4 w-4 text-primary" />;
      case 'game_result':
        return <Trophy className="h-4 w-4 text-accent" />;
      case 'friend_request':
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case 'achievement':
        return <Trophy className="h-4 w-4 text-bingo-winner" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center animate-pulse"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-80 z-50 max-h-96 overflow-hidden animate-fade-in">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="secondary">{unreadCount}</Badge>
                )}
              </CardTitle>
              <div className="flex gap-1">
                {notifications.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={onClearAll}>
                    Clear All
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No notifications</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {notifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div 
                        className={`p-4 hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-sm truncate">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0 ml-2" />
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatTimestamp(notification.timestamp)}
                              </div>
                              
                              {notification.actionable && notification.type === 'game_invite' && notification.gameId && (
                                <div className="flex gap-1">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => onDeclineInvite(notification.gameId!)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => onAcceptInvite(notification.gameId!)}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                              
                              {!notification.read && !notification.actionable && (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => onMarkAsRead(notification.id)}
                                >
                                  Mark Read
                                </Button>
                              )}
                            </div>
                            
                            {notification.fromUser && (
                              <div className="flex items-center gap-2 mt-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {notification.fromUser.username.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">
                                  from {notification.fromUser.username}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {index < notifications.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};