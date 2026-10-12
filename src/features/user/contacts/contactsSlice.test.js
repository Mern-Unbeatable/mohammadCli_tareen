import { describe, expect, it } from "vitest";
import reducer, {
  invalidateContactsList,
  selectPendingRequestCount,
} from "./contactsSlice";
import {
  acceptConnection,
  declineConnection,
  fetchContactsList,
  fetchPendingRequestCount,
} from "./contactsThunks";
import { logoutUser } from "../../auth/authThunks";

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

describe("pending request badge count", () => {
  const withCount = (count) => {
    let state = reducer(initial, fetchPendingRequestCount.pending("c"));
    return reducer(state, fetchPendingRequestCount.fulfilled(count, "c"));
  };

  it("starts at zero and stores the fetched count", () => {
    expect(selectPendingRequestCount({ userContacts: initial })).toBe(0);
    expect(withCount(3).pendingRequestCount).toBe(3);
  });

  it("keeps the latest count when responses arrive out of order", () => {
    let state = reducer(initial, fetchPendingRequestCount.pending("old"));
    state = reducer(state, fetchPendingRequestCount.pending("new"));
    state = reducer(state, fetchPendingRequestCount.fulfilled(2, "new"));
    state = reducer(state, fetchPendingRequestCount.fulfilled(9, "old"));
    expect(state.pendingRequestCount).toBe(2);
  });

  it("keeps the last count when a refresh fails", () => {
    let state = withCount(4);
    state = reducer(state, fetchPendingRequestCount.pending("r"));
    state = reducer(
      state,
      fetchPendingRequestCount.rejected(null, "r", undefined, "Failed"),
    );
    expect(state.pendingRequestCount).toBe(4);
  });

  it("drops by one when a request is confirmed or declined, never below zero", () => {
    let state = withCount(2);
    state = reducer(
      state,
      acceptConnection.fulfilled({ connectionId: "c1" }, "a", "c1"),
    );
    expect(state.pendingRequestCount).toBe(1);
    state = reducer(
      state,
      declineConnection.fulfilled({ connectionId: "c2" }, "d", "c2"),
    );
    expect(state.pendingRequestCount).toBe(0);
    state = reducer(
      state,
      declineConnection.fulfilled({ connectionId: "c3" }, "d2", "c3"),
    );
    expect(state.pendingRequestCount).toBe(0);
  });

  it("syncs from the Requests list total but not from other lists", () => {
    const requestsArgs = { page: 1, status: "pending", direction: "incoming" };
    let state = reducer(initial, fetchContactsList.pending("r1", requestsArgs));
    state = reducer(
      state,
      fetchContactsList.fulfilled(
        { data: [], meta: { page: 1, pageSize: 8, total: 5, totalPages: 1 } },
        "r1",
        requestsArgs,
      ),
    );
    expect(state.pendingRequestCount).toBe(5);

    state = reducer(state, fetchContactsList.pending("r2", { page: 1 }));
    state = reducer(state, fetchContactsList.fulfilled(page(1), "r2", { page: 1 }));
    expect(state.pendingRequestCount).toBe(5);
  });

  it("resets on logout", () => {
    const state = reducer(withCount(3), logoutUser.fulfilled(undefined, "l"));
    expect(state.pendingRequestCount).toBe(0);
  });
});
