import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { userContactsReducer } from "@/features/user/contacts";
import ContactsView from "./ContactsView";

const contact = (id) => ({ id, firstName: `Member`, lastName: id, connectionStatus: null });

const render = (url, contactsState = {}) => {
  const store = configureStore({
    reducer: { userContacts: userContactsReducer },
    preloadedState: {
      userContacts: {
        ...userContactsReducer(undefined, { type: "@@init" }),
        ...contactsState,
      },
    },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter initialEntries={[url]}>
        <ContactsView />
      </MemoryRouter>
    </Provider>,
  );
};

const loadedPage = (page, totalPages = 3) => ({
  contacts: [contact(`p${page}-a`), contact(`p${page}-b`)],
  contactsMeta: { page, pageSize: 8, total: totalPages * 8, totalPages },
});

describe("ContactsView pagination", () => {
  it("highlights the page from the URL and shows that page's contacts", () => {
    const html = render("/contacts?page=2", loadedPage(2));

    expect(html).toContain('aria-label="Page 2" aria-current="page"');
    expect(html).not.toContain('aria-label="Page 1" aria-current="page"');
    expect(html).toContain("p2-a");
    expect(html).toContain("24 members found");
  });

  it("disables Previous on the first page and Next on the last page", () => {
    const first = render("/contacts?page=1", loadedPage(1));
    expect(first).toMatch(/aria-label="Previous page"[^>]*disabled/);
    expect(first).not.toMatch(/aria-label="Next page"[^>]*disabled/);

    const last = render("/contacts?page=3", loadedPage(3));
    expect(last).toMatch(/aria-label="Next page"[^>]*disabled/);
    expect(last).not.toMatch(/aria-label="Previous page"[^>]*disabled/);
  });

  it.each(["/contacts", "/contacts?page=abc", "/contacts?page=0", "/contacts?page=-4"])(
    "treats %s as page 1",
    (url) => {
      const html = render(url, loadedPage(1));
      expect(html).toContain('aria-label="Page 1" aria-current="page"');
    },
  );

  it("shows a loading state instead of an empty page for an out-of-range page", () => {
    const html = render("/contacts?page=9", { ...loadedPage(9), contacts: [] });

    expect(html).toContain("Loading…");
    expect(html).not.toContain("No members match your search.");
  });

  it("shows skeletons while loading", () => {
    const html = render("/contacts?page=2", { contactsLoading: true });
    expect(html).toContain("Loading…");
    expect(html).not.toContain('aria-label="Pagination"');
  });

  it("shows the empty state when there are no contacts", () => {
    const html = render("/contacts?page=1", {
      contacts: [],
      contactsMeta: { page: 1, pageSize: 8, total: 0, totalPages: 1 },
    });
    expect(html).toContain("No members match your search.");
    expect(html).toContain("0 members found");
  });

  it("restores the filter, country and search from the URL", () => {
    const html = render("/contacts?page=2&country=France&q=anna", loadedPage(2));

    expect(html).toContain('<option value="France" selected="">');
    expect(html).toContain('value="anna"');
    expect(html).toContain('aria-label="Page 2" aria-current="page"');
  });

  it("restores the Requests filter from the URL", () => {
    const html = render("/contacts?filter=requests&page=1", {
      contacts: [],
      contactsMeta: { page: 1, pageSize: 8, total: 0, totalPages: 1 },
    });

    expect(html).toContain('<option value="requests" selected="">');
    expect(html).toContain("0 requests");
    expect(html).toContain("No pending connection requests.");
  });

  it("falls back to People for an unknown filter", () => {
    const html = render("/contacts?filter=admins&country=Atlantis", loadedPage(1));

    expect(html).toContain('<option value="people" selected="">');
    expect(html).toContain('<option value="All countries" selected="">');
  });

  it("shows an error state with a retry when the list fails", () => {
    const html = render("/contacts?page=2", { contactsError: "Network Error" });

    expect(html).toContain("Couldn&#x27;t load contacts.");
    expect(html).toContain("Try again");
    expect(html).not.toContain("No members match your search.");
  });
});
