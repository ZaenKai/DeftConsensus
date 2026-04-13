import {
  deriveInProgressSections,
  evaluateSectionVote,
  getFeaturePageFixture,
  getFeatureRouteContext,
  isParentFeatureComplete,
  resolveGovernancePolicy,
  shouldSuggestSubfeatureSplit,
} from "./feature-page";

describe("feature-page mock contracts", () => {
  it("resolves valid route context and rejects invalid combinations", () => {
    const valid = getFeatureRouteContext("acme", "apollo", "feat-consensus");
    expect(valid).not.toBeNull();
    expect(valid?.companyId).toBe("acme");

    const invalid = getFeatureRouteContext("northstar", "apollo", "feat-consensus");
    expect(invalid).toBeNull();
  });

  it("applies governance overrides deterministically", () => {
    const effective = resolveGovernancePolicy(
      {
        voteModel: "simple-majority",
        quorum: 3,
        passThreshold: 0.5,
        sectionVotingEnabled: true,
      },
      {
        voteModel: "two-thirds",
        passThreshold: 0.66,
      },
    );

    expect(effective.voteModel).toBe("two-thirds");
    expect(effective.quorum).toBe(3);
    expect(effective.passThreshold).toBe(0.66);
  });

  it("keeps high-risk AI updates gated until explicit approval", () => {
    const fixture = getFeaturePageFixture("acme", "apollo", "feat-consensus");
    if (!fixture) {
      throw new Error("missing fixture");
    }

    const gated = deriveInProgressSections(fixture.originalBrief, fixture.aiUpdateEvents, []);
    expect(gated.sections.find((section) => section.id === "scope")?.content).toContain("rationale sign-off");

    const approved = deriveInProgressSections(fixture.originalBrief, fixture.aiUpdateEvents, ["update-2"]);
    expect(approved.sections.find((section) => section.id === "scope")?.content).toContain(
      "external partner approval checkpoints",
    );
  });

  it("evaluates section vote outcomes against quorum and threshold", () => {
    const outcome = evaluateSectionVote(
      {
        id: "vote",
        sectionId: "scope",
        requestedBy: "user-1",
        yesVotes: 2,
        noVotes: 1,
        abstainVotes: 0,
      },
      {
        voteModel: "two-thirds",
        quorum: 3,
        passThreshold: 0.66,
        sectionVotingEnabled: true,
      },
    );

    expect(outcome.metQuorum).toBe(true);
    expect(outcome.approved).toBe(true);
  });

  it("enforces split suggestion and required-subfeature completion semantics", () => {
    expect(shouldSuggestSubfeatureSplit(8, 7)).toBe(true);
    expect(
      isParentFeatureComplete([
        { id: "a", title: "A", required: true, completed: true, route: "/x" },
        { id: "b", title: "B", required: true, completed: false, route: "/x" },
        { id: "c", title: "C", required: false, completed: false, route: "/x" },
      ]),
    ).toBe(false);
  });

  it("provides fork suggestion candidates in fixture data", () => {
    const fixture = getFeaturePageFixture("acme", "apollo", "feat-consensus");
    expect(fixture?.forkCandidates.length).toBeGreaterThan(0);
  });
});
