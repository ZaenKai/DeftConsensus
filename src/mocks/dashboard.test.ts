import {
  FEATURE_STATUS_ORDER,
  dashboardMock,
  filterAndSortProjects,
  getMyWorkBuckets,
  groupFeaturesByStatus,
  projectNeedsAttention,
} from "./dashboard";

describe("dashboard mock helpers", () => {
  it("groups every feature into exactly one status bucket", () => {
    const grouped = groupFeaturesByStatus(dashboardMock.features);

    const flattenedIds = FEATURE_STATUS_ORDER.flatMap((status) => grouped[status].map((feature) => feature.id));
    expect(new Set(flattenedIds).size).toBe(dashboardMock.features.length);
    expect(flattenedIds.length).toBe(dashboardMock.features.length);
  });

  it("filters and sorts projects by search and attention state", () => {
    const searched = filterAndSortProjects(dashboardMock.projects, dashboardMock.features, {
      search: "horizon",
      filter: "all",
      sort: "name-asc",
    });
    expect(searched).toHaveLength(1);
    expect(searched[0].id).toBe("horizon");

    const attention = filterAndSortProjects(dashboardMock.projects, dashboardMock.features, {
      search: "",
      filter: "needs-attention",
      sort: "name-asc",
    });
    expect(attention.some((project) => project.id === "horizon")).toBe(true);
    expect(attention.every((project) => projectNeedsAttention(project.id, dashboardMock.features))).toBe(true);
  });

  it("scopes my work buckets to selected company context", () => {
    const acmeBuckets = getMyWorkBuckets("acme");
    const northstarBuckets = getMyWorkBuckets("northstar");

    expect(acmeBuckets.actionRequired.length).toBeGreaterThan(0);
    expect(
      Object.values(acmeBuckets)
        .flat()
        .every((item) => item.companyId === "acme"),
    ).toBe(true);

    expect(
      Object.values(northstarBuckets)
        .flat()
        .every((item) => item.companyId === "northstar"),
    ).toBe(true);
  });
});
