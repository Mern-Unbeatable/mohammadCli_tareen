import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import FeedPost from "./FeedPost";
import CreatePostModal from "./CreatePostModal";
import { toFeedPostModel, userFeedReducer } from "@/features/user/feed";
import { userProfileReducer } from "@/features/user/profile";
import { anna, originalPost, repostOf } from "@/features/user/feed/feedRepostFixtures";

const storeFor = (viewer) =>
  configureStore({
    reducer: { userFeed: userFeedReducer, userProfile: userProfileReducer },
    preloadedState: {
      userProfile: { ...userProfileReducer(undefined, { type: "@@init" }), user: viewer },
    },
  });

const renderPost = (post, { viewer = anna, ...props } = {}) =>
  renderToStaticMarkup(
    <Provider store={storeFor(viewer)}>
      <FeedPost post={toFeedPostModel(post)} {...props} />
    </Provider>,
  );

const renderEditor = (post) =>
  renderToStaticMarkup(
    <CreatePostModal open mode="edit" post={toFeedPostModel(post)} user={{ name: "Anna Berg" }} />,
  );

const noop = () => {};

describe("FeedPost edit entry point", () => {
  it("gives the author a post menu when editing is available", () => {
    const html = renderPost(originalPost(), { onEdit: noop });
    expect(html).toContain('aria-label="Post options"');
    expect(html).not.toContain('aria-label="Report post"');
  });

  it("shows other members the report button instead", () => {
    const html = renderPost(originalPost(), {
      viewer: { id: "someone-else", firstName: "Sam" },
      onEdit: noop,
      onDelete: noop,
    });
    expect(html).toContain('aria-label="Report post"');
    expect(html).not.toContain('aria-label="Post options"');
  });

  it("labels edited posts", () => {
    expect(renderPost(originalPost({ editedAt: "2026-10-12T09:00:00.000Z" }))).toContain(
      "Edited",
    );
    expect(renderPost(originalPost())).not.toContain("Edited");
  });
});

describe("CreatePostModal edit mode", () => {
  it("starts from the post and can't be saved until something changes", () => {
    const html = renderEditor(
      originalPost({ content: "Hello lab", imageUrl: "https://cdn.test/a.png" }),
    );
    expect(html).toContain("Edit Post");
    expect(html).toContain("Hello lab");
    expect(html).toContain('src="https://cdn.test/a.png"');
    expect(html).toContain('aria-label="Remove image"');
    expect(html).not.toContain("aria-pressed");
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*>Save<\/button>/);
  });

  it("lets a repost add, replace or remove its own attachments", () => {
    const html = renderEditor(
      repostOf(originalPost(), { documentUrl: "https://cdn.test/specs.pdf" }),
    );
    expect(html).toContain("Worth a read");
    expect(html).toContain('placeholder="Add a caption (optional)"');
    expect(html).toContain(">Image<");
    expect(html).toContain(">Document<");
    expect(html).toContain("specs.pdf");
    expect(html).toContain('aria-label="Remove document"');
  });
});

describe("FeedPost repost attachments", () => {
  it("shows the repost's own image and document above the original", () => {
    const html = renderPost(
      repostOf(originalPost(), {
        imageUrl: "https://cdn.test/mine.png",
        documentUrl: "https://cdn.test/notes.pdf",
      }),
      { viewer: { id: "sam", firstName: "Sam" } },
    );
    const original = html.indexOf('aria-label="Original post by Anna Berg"');
    expect(html.indexOf('src="https://cdn.test/mine.png"')).toBeGreaterThan(-1);
    expect(html.indexOf('src="https://cdn.test/mine.png"')).toBeLessThan(original);
    expect(html.indexOf("notes.pdf")).toBeGreaterThan(-1);
    expect(html.indexOf("notes.pdf")).toBeLessThan(original);
  });
});
