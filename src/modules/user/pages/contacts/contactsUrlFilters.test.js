import { describe, expect, it } from "vitest";
import {
  applyFilterChanges,
  parseCountryParam,
  parseFilterParam,
  parseSearchParam,
  withoutInvalidFilters,
} from "./contactsUrlFilters";

const params = (query) => new URLSearchParams(query);

describe("contacts URL filters", () => {
  it("reads valid values and falls back to defaults", () => {
    expect(parseFilterParam("requests")).toBe("requests");
    expect(parseFilterParam("admins")).toBe("people");
    expect(parseFilterParam(null)).toBe("people");
    expect(parseCountryParam("France")).toBe("France");
    expect(parseCountryParam("Atlantis")).toBe("All countries");
    expect(parseSearchParam(null)).toBe("");
    expect(parseSearchParam("x".repeat(250))).toHaveLength(200);
  });

  it("sets a filter and resets to page 1, keeping other params", () => {
    const next = applyFilterChanges(params("page=3&country=France"), { filter: "connected" });
    expect(Object.fromEntries(next)).toEqual({
      page: "1",
      country: "France",
      filter: "connected",
    });
  });

  it("drops default values so the URL stays minimal", () => {
    const next = applyFilterChanges(params("page=2&filter=requests&country=France&q=anna"), {
      filter: "people",
      country: "All countries",
      q: "",
    });
    expect(next.toString()).toBe("page=1");
  });

  it("removes invalid filter values and leaves valid ones alone", () => {
    expect(withoutInvalidFilters(params("page=2&filter=connected&country=Italy&q=ok"))).toBeNull();

    const fixed = withoutInvalidFilters(params("page=2&filter=admins&country=Atlantis"));
    expect(fixed.toString()).toBe("page=2");
  });
});
