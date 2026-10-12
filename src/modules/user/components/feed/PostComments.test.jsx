import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import PostComments from "./PostComments";

const comment = (id, authorId, overrides = {}) => ({
  id,
  author: { id: authorId, name: authorId === "me" ? "Me Author" : "Other Author" },
  content: `Comment ${id}`,
  time: "2h",
  liked: false,
  likeCount: 0,
  replies: [],
  ...overrides,
});

const comments = [
  comment("mine", "me", { replies: [comment("their-reply", "other")] }),
  comment("theirs", "other", { replies: [comment("my-reply", "me")] }),
];

const noop = async () => true;
const render = (props = {}) =>
  renderToStaticMarkup(
    <PostComments
      comments={comments}
      currentUser={{ id: "me", name: "Me Author" }}
      onAddComment={noop}
      onLikeComment={noop}
      onEditComment={noop}
      onDeleteComment={noop}
      {...props}
    />,
  );

const menuCount = (html) => html.split('aria-label="Comment options"').length - 1;

describe("PostComments owner actions", () => {
  it("shows the comment menu only on the viewer's own comments and replies", () => {
    expect(menuCount(render())).toBe(2);
  });

  it("shows no menu to a viewer who owns none of the comments", () => {
    expect(menuCount(render({ currentUser: { id: "visitor" } }))).toBe(0);
    expect(menuCount(render({ currentUser: null }))).toBe(0);
  });

  it("shows no menu when edit and delete aren't supported", () => {
    expect(
      menuCount(render({ onEditComment: undefined, onDeleteComment: undefined })),
    ).toBe(0);
  });

  it("does not render the delete dialog until a delete is requested", () => {
    expect(render()).not.toContain("Delete comment?");
  });
});
