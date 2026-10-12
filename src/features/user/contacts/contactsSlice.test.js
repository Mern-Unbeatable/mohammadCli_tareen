import { describe, expect, it } from "vitest";
import reducer, { invalidateContactsList } from "./contactsSlice";
import { fetchContactsList } from "./contactsThunks";

const initial = reducer(undefined, { type: "@@init" });
const meta = (page) => ({ page, pageSize: 8, total: 20, totalPages: 3 });
const page = (n) => ({ data: [{ id: `p${n}` }], meta: meta(n) });

describe("contacts list pagination state", () => {
  it("shows the latest requested page even if an older response arrives last", () => {
    let state = reducer(initial, fetchContactsList.pending("req-1", { page: 1 }));
    state = reducer(state, fetchContactsList.pending("req-2", { page: 2 }));
    state = reducer(state, fetchContactsList.fulfilled(page(2), "req-2", { page: 2 }));
    state = reducer(state, fetchContactsList.fulfilled(page(1), "req-1", { page: 1 }));

    expect(state.contacts).toEqual([{ id: "p2" }]);
    expect(state.contactsMeta.page).toBe(2);
    expect(state.contactsLoading).toBe(false);
  });

  it("keeps loading until the latest request settles", () => {
    let state = reducer(initial, fetchContactsList.pending("req-1", { page: 1 }));
    state = reducer(state, fetchContactsList.pending("req-2", { page: 2 }));
    state = reducer(state, fetchContactsList.fulfilled(page(1), "req-1", { page: 1 }));

    expect(state.contactsLoading).toBe(true);
    expect(state.contacts).toEqual([]);
  });

  it("records list failures and clears them on the next request", () => {
    let state = reducer(initial, fetchContactsList.pending("req-1", { page: 2 }));
    state = reducer(
      state,
      fetchContactsList.rejected(null, "req-1", { page: 2 }, "Network Error"),
    );
    expect(state.contactsError).toBe("Network Error");
    expect(state.contactsLoading).toBe(false);

    state = reducer(state, fetchContactsList.pending("req-2", { page: 2 }));
    expect(state.contactsError).toBeNull();
  });

  it("ignores a failure from a request the user already left", () => {
    let state = reducer(initial, fetchContactsList.pending("req-1", { page: 1 }));
    state = reducer(state, fetchContactsList.pending("req-2", { page: 2 }));
    state = reducer(
      state,
      fetchContactsList.rejected(null, "req-1", { page: 1 }, "Network Error"),
    );
    expect(state.contactsError).toBeNull();
    expect(state.contactsLoading).toBe(true);
  });

  it("clears a list error when filters invalidate the list", () => {
    let state = reducer(initial, fetchContactsList.pending("req-1", { page: 1 }));
    state = reducer(state, fetchContactsList.rejected(null, "req-1", { page: 1 }, "Failed"));
    state = reducer(state, invalidateContactsList());
    expect(state.contactsError).toBeNull();
    expect(state.contactsLoading).toBe(true);
  });
});
