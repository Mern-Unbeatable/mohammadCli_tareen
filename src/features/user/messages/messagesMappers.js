/** Map conversations / messages onto the user messaging UI. */

const initialsFromName = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "M";

export function formatMessageTime(dateValue) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return String(dateValue);

  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (sameDay) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  ) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function toConversationModel(conversation) {
  if (!conversation) return null;

  const isGroup =
    conversation.isGroup === true ||
    conversation.type === "GROUP" ||
    conversation.type === "group";

  const name =
    conversation.name ||
    conversation.title ||
    conversation.participant?.name ||
    [conversation.participant?.firstName, conversation.participant?.lastName]
      .filter(Boolean)
      .join(" ") ||
    "Conversation";

  const lastMessage =
    conversation.lastMessage ||
    conversation.previewMessage ||
    conversation.latestMessage ||
    null;

  const preview =
    conversation.preview ||
    lastMessage?.body ||
    lastMessage?.text ||
    lastMessage?.content ||
    "";

  const participants = Array.isArray(conversation.participants)
    ? conversation.participants
    : [];

  return {
    id: conversation.id,
    name,
    initials: conversation.initials || initialsFromName(name),
    avatar:
      conversation.avatar ||
      conversation.participant?.avatar ||
      null,
    preview,
    time: formatMessageTime(
      conversation.updatedAt ||
        lastMessage?.createdAt ||
        conversation.lastMessageAt,
    ),
    isGroup,
    participants,
    unread: conversation.unreadCount ?? conversation.unread ?? 0,
    subtitle: conversation.subtitle || null,
    raw: conversation,
  };
}

/**
 * @param {object} message
 * @param {string} [currentUserId]
 */
export function toMessageModel(message, currentUserId) {
  if (!message) return null;

  const senderId =
    message.senderId ||
    message.sender?.id ||
    message.userId ||
    message.fromUserId;

  const isMine =
    message.from === "me" ||
    message.isMine === true ||
    (currentUserId && senderId === currentUserId);

  const senderName =
    message.sender?.name ||
    [message.sender?.firstName, message.sender?.lastName]
      .filter(Boolean)
      .join(" ") ||
    message.senderName ||
    null;

  return {
    id: message.id,
    body: message.body || message.text || message.content || "",
    from: isMine ? "me" : "them",
    sender: senderName,
    time: formatMessageTime(message.createdAt || message.time),
    raw: message,
  };
}
