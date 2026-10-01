/** Map API conversations / messages onto the Messenger UI models. */

const toDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const clockTime = (date) =>
  date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

/** Short relative label for conversation lists: 14:05, Yesterday, Mon, Sep 3, Sep 3, 2025. */
export function formatMessageTime(value, now = new Date()) {
  const date = toDate(value);
  if (!date) return "";

  if (sameDay(date, now)) return clockTime(date);

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (sameDay(date, yesterday)) return "Yesterday";

  const sixDaysAgo = new Date(now);
  sixDaysAgo.setHours(0, 0, 0, 0);
  sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
  if (date >= sixDaysAgo) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(date.getFullYear() === now.getFullYear() ? {} : { year: "numeric" }),
  });
}

/** Label under a message bubble: clock time today, otherwise day + time. */
export function formatBubbleTime(value, now = new Date()) {
  const date = toDate(value);
  if (!date) return "";
  if (sameDay(date, now)) return clockTime(date);
  return `${formatMessageTime(date, now)} ${clockTime(date)}`;
}

export function attachmentSummary(attachments = []) {
  if (!attachments.length) return "";
  return attachments.length === 1
    ? "Sent an attachment"
    : `Sent ${attachments.length} attachments`;
}

export const isImageAttachment = (attachment) =>
  String(attachment?.mimeType || "").startsWith("image/");

export function toConversationModel(conversation, { onlineUserIds } = {}) {
  if (!conversation?.id) return null;
  const online =
    !conversation.isGroup &&
    Boolean(conversation.otherUserId) &&
    Boolean(onlineUserIds?.has?.(conversation.otherUserId));

  return {
    id: conversation.id,
    isGroup: Boolean(conversation.isGroup),
    name: conversation.name || "Conversation",
    subtitle: conversation.subtitle || null,
    initials: conversation.initials || "?",
    avatar: conversation.avatar || null,
    preview: conversation.preview || "",
    time: formatMessageTime(conversation.time),
    unread: conversation.unreadCount ?? 0,
    otherUserId: conversation.otherUserId || null,
    isAdmin: !conversation.isGroup && conversation.otherUserRole === "ADMIN",
    myRole: conversation.myRole || null,
    participants: Array.isArray(conversation.participants)
      ? conversation.participants
      : [],
    online,
  };
}

/**
 * @param {object} message API or realtime message
 * @param {string} [currentUserId]
 */
export function toMessageModel(message, currentUserId) {
  if (!message?.id) return null;
  const isMine =
    currentUserId && message.senderId
      ? message.senderId === currentUserId
      : message.from === "me";
  const body = message.body || "";

  return {
    id: message.id,
    body,
    text: body,
    attachments: Array.isArray(message.attachments) ? message.attachments : [],
    from: isMine ? "me" : "them",
    senderId: message.senderId || null,
    sender: typeof message.sender === "string" ? message.sender : null,
    senderAvatar: message.senderAvatar || null,
    senderInitials: message.senderInitials || null,
    time: formatBubbleTime(message.time),
    createdAt: message.time || null,
  };
}

/**
 * For direct chats: true when the other participant has read up to the
 * caller's latest message.
 */
export function isSeenByOther(conversation, messages, currentUserId) {
  if (!conversation || conversation.isGroup || !currentUserId) return false;
  const lastMine = [...messages].reverse().find((m) => m.senderId === currentUserId);
  if (!lastMine?.createdAt) return false;
  const other = conversation.participants?.find((p) => p.id !== currentUserId);
  const readAt = toDate(other?.lastReadAt);
  const sentAt = toDate(lastMine.createdAt);
  return Boolean(readAt && sentAt && readAt >= sentAt);
}
