/** Map API feed posts onto Home feed card props. */

const TYPE_LABEL = {
  QUESTION: "question",
  INFORMATION: "information",
  SUPPLIERS: "suppliers",
  question: "question",
  information: "information",
  suppliers: "suppliers",
};

const initialsFromName = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "MB";

export function formatRelativeTime(dateValue) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function toAuthorModel(author = {}) {
  const name =
    author.name ||
    [author.firstName, author.lastName].filter(Boolean).join(" ") ||
    "Member";
  const title = author.title || author.role || "Lab professional";
  const company = author.company || "";
  const country = author.country || author.location || "";

  return {
    id: author.id || null,
    name,
    initials: author.initials || initialsFromName(name),
    subtitle: [title, company].filter(Boolean).join(" · ") || title,
    meta: [country, author.meta].filter(Boolean).join(" · ") || "",
    avatar: author.avatar || null,
  };
}

function toCommentModel(comment) {
  if (!comment) return null;
  return {
    id: comment.id,
    author: toAuthorModel(comment.author || comment.user || {}),
    content: comment.content || comment.body || "",
    time: formatRelativeTime(comment.createdAt || comment.time),
    replies: comment.replies ?? 0,
    liked: Boolean(comment.liked),
    raw: comment,
  };
}

export function toFeedPostModel(post) {
  if (!post) return null;

  const type = TYPE_LABEL[post.type] || String(post.type || "").toLowerCase();
  const author = toAuthorModel(post.author || post.user || {});
  const comments = Array.isArray(post.comments)
    ? post.comments.map(toCommentModel).filter(Boolean)
    : [];

  const reactionCount =
    post.stats?.reactions ??
    post.reactionCount ??
    post.reactionsCount ??
    (Array.isArray(post.reactions) ? post.reactions.length : 0);

  const commentCount =
    post.stats?.comments ?? post.commentCount ?? comments.length;

  const shareCount = post.stats?.shares ?? post.shareCount ?? 0;

  const country = post.author?.country || post.author?.location || "";
  const postedAgo = formatRelativeTime(post.createdAt);

  return {
    id: post.id,
    type,
    filter: type === "question" ? "questions" : type,
    author: {
      ...author,
      meta:
        author.meta ||
        [country, postedAgo].filter(Boolean).join(" · ") ||
        postedAgo,
    },
    content: post.content || post.body || post.text || "",
    image: post.image || post.imageUrl || null,
    attachment: post.attachment
      ? post.attachment
      : post.documentUrl
        ? {
            name:
              post.documentName ||
              decodeURIComponent(
                String(post.documentUrl).split("/").pop() || "Document",
              ),
            meta: post.documentMeta || "Document",
            url: post.documentUrl,
          }
        : null,
    stats: {
      reactions: reactionCount,
      comments: commentCount,
      shares: shareCount,
    },
    comments,
    myReaction: post.myReaction
      ? String(post.myReaction).toLowerCase()
      : post.reaction
        ? String(post.reaction).toLowerCase()
        : null,
    reactionCounts: post.reactionCounts || null,
    raw: post,
  };
}
