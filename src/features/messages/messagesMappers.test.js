import { describe, expect, it } from "vitest";
import {
  attachmentSummary,
  formatMessageTime,
  isSeenByOther,
  toConversationModel,
  toMessageModel,
} from "./messagesMappers";

const now = new Date(2026, 8, 26, 15, 0, 0);

describe("formatMessageTime", () => {
  it("returns clock time for today", () => {
    expect(formatMessageTime(new Date(2026, 8, 26, 9, 5), now)).toBe("09:05");
  });

  it("returns Yesterday for the previous day", () => {
    expect(formatMessageTime(new Date(2026, 8, 25, 23, 0), now)).toBe("Yesterday");
  });

  it("returns a weekday within the last week", () => {
    expect(formatMessageTime(new Date(2026, 8, 22, 12, 0), now)).toBe("Tue");
  });

  it("returns month/day for older dates and adds the year when different", () => {
    expect(formatMessageTime(new Date(2026, 7, 3), now)).toBe("Aug 3");
    expect(formatMessageTime(new Date(2025, 7, 3), now)).toBe("Aug 3, 2025");
  });

  it("returns an empty string for missing or invalid values", () => {
    expect(formatMessageTime(null, now)).toBe("");
    expect(formatMessageTime("not-a-date", now)).toBe("");
  });
});

describe("attachmentSummary", () => {
  it("summarises attachment counts", () => {
    expect(attachmentSummary([])).toBe("");
    expect(attachmentSummary([{}])).toBe("Sent an attachment");
    expect(attachmentSummary([{}, {}])).toBe("Sent 2 attachments");
  });
});

describe("toConversationModel", () => {
  const base = {
    id: "c1",
    isGroup: false,
    name: "Jane Doe",
    otherUserId: "u2",
    unreadCount: 3,
    participants: [],
  };

  it("marks direct chats online only when the other user is online", () => {
    expect(toConversationModel(base, { onlineUserIds: new Set(["u2"]) }).online).toBe(true);
    expect(toConversationModel(base, { onlineUserIds: new Set() }).online).toBe(false);
    expect(toConversationModel(base).online).toBe(false);
  });

  it("never marks groups online", () => {
    const group = { ...base, isGroup: true };
    expect(toConversationModel(group, { onlineUserIds: new Set(["u2"]) }).online).toBe(false);
  });

  it("maps unread count and falls back for missing fields", () => {
    const model = toConversationModel({ id: "c2" });
    expect(model).toMatchObject({ name: "Conversation", initials: "?", unread: 0 });
    expect(toConversationModel(base).unread).toBe(3);
    expect(toConversationModel(null)).toBeNull();
  });
});

describe("toMessageModel", () => {
  const message = {
    id: "m1",
    body: "Hello",
    senderId: "u1",
    sender: "Jane",
    time: new Date(2026, 8, 26, 10, 0).toISOString(),
  };

  it("derives direction from the sender id", () => {
    expect(toMessageModel(message, "u1").from).toBe("me");
    expect(toMessageModel(message, "u2").from).toBe("them");
  });

  it("falls back to the from field without a current user", () => {
    expect(toMessageModel({ ...message, from: "me" }).from).toBe("me");
  });

  it("normalises attachments and keeps the raw timestamp", () => {
    const model = toMessageModel(message, "u1");
    expect(model.attachments).toEqual([]);
    expect(model.text).toBe("Hello");
    expect(model.createdAt).toBe(message.time);
  });
});

describe("isSeenByOther", () => {
  const sentAt = "2026-09-26T10:00:00.000Z";
  const messages = [{ id: "m1", senderId: "me", createdAt: sentAt }];
  const conversation = (lastReadAt) => ({
    isGroup: false,
    participants: [
      { id: "me", lastReadAt: sentAt },
      { id: "other", lastReadAt },
    ],
  });

  it("is true once the other participant read the latest own message", () => {
    expect(isSeenByOther(conversation("2026-09-26T10:00:01.000Z"), messages, "me")).toBe(true);
  });

  it("is false before the other participant reads it", () => {
    expect(isSeenByOther(conversation("2026-09-26T09:59:00.000Z"), messages, "me")).toBe(false);
    expect(isSeenByOther(conversation(null), messages, "me")).toBe(false);
  });

  it("is false for groups", () => {
    const group = { ...conversation("2026-09-26T11:00:00.000Z"), isGroup: true };
    expect(isSeenByOther(group, messages, "me")).toBe(false);
  });
});
