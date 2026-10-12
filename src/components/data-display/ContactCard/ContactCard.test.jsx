import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import ContactCard from "./ContactCard";

const contact = {
  id: "u1",
  connectionId: "c1",
  name: "Élises Moreaus",
  initials: "EM",
  title: "Quality Control Manager",
  company: "Novagen Labs",
  country: "France",
};

const render = (props) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <ContactCard contact={contact} {...props} />
    </MemoryRouter>,
  );

const buttons = (html) => [...html.matchAll(/<button[^>]*>/g)].length;

describe("ContactCard actions", () => {
  it("shows only the Profile link for a connected contact", () => {
    const html = render({ connected: true });
    expect(html).toContain("Profile");
    expect(html).toContain("grid-cols-1");
    expect(html).not.toContain("Connected");
    expect(buttons(html)).toBe(0);
  });

  it("shows Connect for a contact with no connection", () => {
    const html = render({});
    expect(html).toContain("Connect");
    expect(html).toContain("grid-cols-2");
    expect(buttons(html)).toBe(1);
  });

  it("shows Pending for an outgoing request", () => {
    const html = render({ pending: true });
    expect(html).toContain("Pending");
    expect(buttons(html)).toBe(1);
  });

  it("shows an enabled Confirm for an incoming request", () => {
    const html = render({ pending: true, incoming: true });
    expect(html).toContain("Confirm");
    expect(html).toContain("bg-green-primary");
    expect(html).not.toContain("Pending");
    expect(html).not.toContain('disabled=""');
  });
});
