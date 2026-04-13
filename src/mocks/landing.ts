export type ValueProp = {
  title: string;
  description: string;
};

export type HowItWorksStep = {
  title: string;
  description: string;
};

export type ModalBenefit = {
  title: string;
  description: string;
  details: string[];
};

export type LandingMock = {
  hero: {
    headline: string;
    subheadline: string;
  };
  valueProps: ValueProp[];
  howItWorks: HowItWorksStep[];
  modalBenefits: ModalBenefit[];
  ctas: {
    primaryLabel: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
};

export const landingMock: LandingMock = {
  hero: {
    headline: "Align every team before code gets written",
    subheadline:
      "Capture stakeholder input, synthesize consensus with swarms, and track verified execution from brief to delivery.",
  },
  valueProps: [
    {
      title: "Cross-functional voice",
      description:
        "Give product, operations, compliance, and engineering a shared channel to shape what gets built and why.",
    },
    {
      title: "Swarm-assisted planning",
      description:
        "Use specialized agents to transform discussion into structured, technically grounded implementation direction.",
    },
    {
      title: "Transparent roadmap progress",
      description:
        "Track each initiative from initial discussion to verified delivery with clear, auditable status changes.",
    },
  ],
  howItWorks: [
    {
      title: "Discuss needs",
      description: "Capture cross-team input and clarify outcomes before implementation starts.",
    },
    {
      title: "Synthesize consensus",
      description: "Convert discussion into a shared implementation brief with rationale and constraints.",
    },
    {
      title: "Verify delivery",
      description: "Validate implementation against requirements and keep roadmap status visible to stakeholders.",
    },
  ],
  modalBenefits: [
    {
      title: "Cross-functional voice",
      description: "Unify stakeholder input before execution.",
      details: [
        "Collect input from business and engineering in one workflow.",
        "Reduce misalignment by requiring explicit rationale before coding.",
        "Preserve decision history for future roadmap context.",
      ],
    },
    {
      title: "Swarm-assisted planning",
      description: "Parallel analysis with specialized agent roles.",
      details: [
        "Summarize conversation threads into action-ready themes.",
        "Pressure-test feasibility and identify dependency risks early.",
        "Draft implementation plans that map to requirements.",
      ],
    },
    {
      title: "Transparent roadmap progress",
      description: "Track movement from consensus to verified outcomes.",
      details: [
        "Expose high-level state transitions without exposing proprietary code.",
        "Tie delivery status to explicit verification checkpoints.",
        "Surface blockers as conflict briefs instead of silent failures.",
      ],
    },
  ],
  ctas: {
    primaryLabel: "Explore how it works",
    secondaryLabel: "Sign in to dashboard",
    secondaryHref: "/login",
  },
};
