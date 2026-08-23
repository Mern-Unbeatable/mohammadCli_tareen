import { useState } from 'react';
import Card from '@/components/ui/Card';
import { notifications as initialNotifications } from '@/modules/user/data/notifications';

const NotificationItem = ({ item, onMarkRead }) => {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={() => onMarkRead(item.id)}
      className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-[#F9FAFB] sm:px-6"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.iconClass}`}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold leading-snug text-deep-blue">{item.title}</p>
        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#64748B]">
          {item.subtitle}
        </p>
        <p className="mt-2 text-[12px] text-[#98A2B3]">{item.time}</p>
      </div>

      {item.unread && (
        <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" aria-label="Unread" />
      )}
    </button>
  );
};

const NotificationsPageContent = () => {
  const [items, setItems] = useState(initialNotifications);

  const markRead = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  return (
    <Card>
      <div className="flex items-center justify-between gap-4 border-b border-[#E4E7EC] px-5 py-4 sm:px-6">
        <h1 className="text-[22px] font-bold text-deep-blue sm:text-[24px]">Notifications</h1>
        <button
          type="button"
          onClick={markAllRead}
          className="shrink-0 rounded-lg border border-[#E4E7EC] px-3 py-1.5 text-[12px] font-semibold text-[#475467] hover:bg-[#F9FAFB]"
        >
          Mark all as read
        </button>
      </div>

      <ul className="divide-y divide-[#E4E7EC]">
        {items.map((item) => (
          <li key={item.id}>
            <NotificationItem item={item} onMarkRead={markRead} />
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default NotificationsPageContent;
