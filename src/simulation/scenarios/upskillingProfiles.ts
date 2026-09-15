import type { AuthoredResponse, DigitalHumanDefinition } from "@/simulation/types";

export type ScenarioProfile = {
  learnerRole: string;
  title: string;
  situation: string;
  openingLine: string;
  persona: Omit<DigitalHumanDefinition, "id">;
  supportingRoles: Array<{ name: string; role: string; palette: string }>;
  responses: AuthoredResponse[];
};

const commonSafeResponses: AuthoredResponse[] = [
  { intent: "prompt-injection", text: "I can only discuss the workplace situation we are handling. What do you need to understand about what happened?", consequence: "The Digital Human remains in role and protects hidden assessment information.", stateDelta: { trust: -2 }, organisationDelta: {}, },
  { intent: "unsafe", text: "I am not comfortable proceeding without the required safety or compliance step. We should stop and address that first.", consequence: "A mandatory control was challenged before harm occurred.", stateDelta: { trust: -8, stress: 10 }, organisationDelta: { complianceRisk: 18 }, criticalRuleId: "mandatory-control-bypass" },
  { intent: "dismiss", text: "That response makes me feel that the concern is not being taken seriously. I need you to listen before deciding.", consequence: "Trust falls and the concern remains unresolved.", stateDelta: { trust: -14, frustration: 16, engagement: -8 }, organisationDelta: { trust: -10, morale: -8 } },
  { intent: "neutral", text: "Could you be more specific about what you need from me and how it connects to the situation?", consequence: "The conversation continues, but no material evidence has been gathered yet.", stateDelta: { engagement: -2 }, organisationDelta: {} },
];

function profile(overrides: Omit<ScenarioProfile, "responses"> & { language: { acknowledge: string; investigate: string; policy: string; resolve: string; escalate: string } }): ScenarioProfile {
  return {
    ...overrides,
    responses: [
      { intent: "acknowledge", text: overrides.language.acknowledge, consequence: "The person feels heard and becomes more willing to engage.", stateDelta: { trust: 9, stress: -6, engagement: 7 }, organisationDelta: { trust: 4, morale: 2 }, objectiveId: "establish-trust" },
      { intent: "investigate", text: overrides.language.investigate, consequence: "A material fact is added to the evidence trail.", stateDelta: { trust: 5, willingnessToDisclose: 12 }, organisationDelta: { complianceRisk: -3 }, evidenceId: "primary-account", objectiveId: "gather-evidence" },
      { intent: "clarify", text: overrides.language.investigate, consequence: "The learner separates assumptions from verified facts.", stateDelta: { confidence: 4, engagement: 5 }, organisationDelta: { productivity: 2 }, evidenceId: "clarified-fact", objectiveId: "gather-evidence" },
      { intent: "policy", text: overrides.language.policy, consequence: "The next step is anchored to an applicable workplace standard.", stateDelta: { confidence: 7, stress: -3 }, organisationDelta: { complianceRisk: -12, trust: 3 }, evidenceId: "policy-reference", objectiveId: "apply-policy" },
      { intent: "resolve", text: overrides.language.resolve, consequence: "A practical, measurable resolution is agreed.", stateDelta: { trust: 8, confidence: 6, engagement: 6 }, organisationDelta: { trust: 5, productivity: 6, customerConfidence: 4 }, objectiveId: "agree-action" },
      { intent: "escalate", text: overrides.language.escalate, consequence: "The matter is escalated with context and an auditable evidence trail.", stateDelta: { stress: -5, confidence: 5 }, organisationDelta: { complianceRisk: -8 }, objectiveId: "agree-action" },
      ...commonSafeResponses,
    ],
  };
}

const fallback = profile({
  learnerRole: "Workplace response lead", title: "High-consequence workplace conversation",
  situation: "A colleague needs a professional response to a developing workplace concern.",
  openingLine: "Thank you for meeting with me. I need help with a situation that is beginning to affect my work.",
  persona: { name: "Amahle Dlamini", role: "Concerned colleague", organisationRole: "Operations coordinator", biography: "Amahle is capable, observant, and deciding whether this is a safe conversation.", traits: ["thoughtful", "direct", "cautious"], motivation: "Resolve the concern without retaliation or unnecessary conflict.", objectives: ["Be heard", "Understand the next step"], publicKnowledge: ["A workplace issue has persisted"], privateKnowledge: ["A second colleague has supporting information"], disclosureRules: ["Disclose supporting information after trust rises above 60"], speakingStyle: "Measured and practical", stressResponse: "Becomes brief when dismissed", conflictTolerance: 45, initialState: { trust: 52, confidence: 58, stress: 42, frustration: 18, engagement: 68, willingnessToDisclose: 46 }, avatar: { fallbackPalette: "#0f766e" } },
  supportingRoles: [{ name: "Kabelo", role: "Team manager", palette: "#334155" }, { name: "Zinhle", role: "Workplace witness", palette: "#b45309" }],
  language: { acknowledge: "I appreciate that. It helps to know you are listening before forming a view.", investigate: "The issue happened more than once. I can give you dates and explain who was present.", policy: "That process sounds fair. Please explain how confidentiality and follow-up will work.", resolve: "I can agree to that next step if it is documented and we check progress again.", escalate: "I understand why formal escalation is needed. I want the facts and confidentiality protected." },
});

const profiles: Record<string, ScenarioProfile> = {
  "human-resources": profile({
    learnerRole: "HR interviewer", title: "Structured interview under pressure", situation: "A strong candidate is nervous and has a sensitive employment gap that should only be discussed appropriately.", openingLine: "Good morning. I am glad to be here, although I am a little nervous about the interview.",
    persona: { name: "Naledi Mokoena", role: "Job candidate", organisationRole: "Candidate for operations analyst", biography: "Naledi is prepared, thoughtful, and cautious about a previous workplace conflict.", traits: ["prepared", "slightly nervous", "thoughtful"], motivation: "Present her capability fairly without being pushed into irrelevant personal disclosure.", objectives: ["Understand the role", "Demonstrate competence", "Experience a fair interview"], publicKnowledge: ["Five years of relevant experience", "A six-month employment gap"], privateKnowledge: ["The gap followed a workplace conflict"], disclosureRules: ["Discuss the conflict only after rapport and a relevant follow-up question"], speakingStyle: "Professional, concise, and reflective", stressResponse: "Withdraws when interrupted or asked biased questions", conflictTolerance: 35, initialState: { trust: 55, confidence: 70, stress: 34, frustration: 12, engagement: 78, willingnessToDisclose: 45 }, avatar: { fallbackPalette: "#7c3aed" } },
    supportingRoles: [{ name: "Thandi", role: "Hiring manager", palette: "#0f766e" }, { name: "Kagiso", role: "Panel observer", palette: "#b45309" }],
    language: { acknowledge: "Thank you. That helps me settle in and understand how the conversation will work.", investigate: "A useful example is when I rebuilt our weekly reporting process and reduced unresolved cases by 23 percent.", policy: "I appreciate that you are keeping the questions relevant to the role and applying the same structure to candidates.", resolve: "That summary reflects my evidence. I understand the next steps and when I should expect feedback.", escalate: "I would be comfortable with the panel reviewing the evidence against the published criteria." },
  }),
  "business-ethics": profile({
    learnerRole: "Ethics response lead", title: "Integrity challenge with management pressure", situation: "A manager asks the learner to omit an uncomfortable supplier conflict from a decision record.", openingLine: "We are close to deadline. Leave the supplier relationship out of the record and we can deal with it later.",
    persona: { ...fallback.persona, name: "Lerato Nkosi", role: "Commercial manager", organisationRole: "Procurement sponsor", biography: "Lerato is target-driven and testing whether the learner will protect integrity under pressure.", motivation: "Protect the deadline and avoid executive scrutiny.", avatar: { fallbackPalette: "#be123c" } },
    supportingRoles: [{ name: "Mpho", role: "Compliance officer", palette: "#0f766e" }, { name: "David", role: "Supplier lead", palette: "#334155" }],
    language: { acknowledge: "I hear your concern about transparency, even though the deadline pressure is real.", investigate: "The supplier contact is a relative of one of the evaluators. That was not entered in the declaration log.", policy: "The conflict policy does require disclosure before an award decision. We need to record it.", resolve: "Document the conflict, recuse the evaluator, and preserve the deadline where the process still allows it.", escalate: "Compliance review is appropriate. I will provide the procurement record and pause the award decision." },
  }),
  "workplace-compliance": profile({
    learnerRole: "Compliance coordinator", title: "Incident triage and mandatory escalation", situation: "An employee reports a control failure that may create a legal notification obligation.", openingLine: "I noticed the inspection record was changed after sign-off. I am worried I will get blamed for reporting it.",
    persona: { ...fallback.persona, name: "Thabo Molefe", role: "Reporting employee", organisationRole: "Quality technician", motivation: "Protect customers and avoid retaliation.", avatar: { fallbackPalette: "#0369a1" } },
    supportingRoles: [{ name: "Nomsa", role: "Compliance manager", palette: "#0f766e" }, { name: "Peter", role: "Site supervisor", palette: "#9f1239" }],
    language: { acknowledge: "Thank you for taking the concern seriously and explaining that retaliation is not acceptable.", investigate: "The original record is in the audit folder. The timestamp and changed value can be compared.", policy: "The incident process requires preservation of the record and notification to the compliance manager.", resolve: "I can provide a written statement while you secure the records and restrict further edits.", escalate: "Please escalate it now. I will remain available for the formal investigation." },
  }),
  sales: profile({
    learnerRole: "Consultative sales specialist", title: "Ethical objection handling", situation: "A customer is interested but doubts value, implementation effort, and whether the solution fits their actual need.", openingLine: "Your proposal sounds polished, but I am not convinced the return justifies the disruption to my team.",
    persona: { ...fallback.persona, name: "Ayanda Jacobs", role: "Prospective customer", organisationRole: "Operations director", motivation: "Reduce service delays without buying unnecessary features.", avatar: { fallbackPalette: "#c2410c" } },
    supportingRoles: [{ name: "Sizwe", role: "Technical adviser", palette: "#0f766e" }, { name: "Helen", role: "Finance reviewer", palette: "#334155" }],
    language: { acknowledge: "Good. I need you to understand the disruption risk, not just defend the proposal.", investigate: "Our biggest loss is repeat customer calls caused by incomplete handovers between teams.", policy: "A transparent scope and opt-out clause would make the proposal easier to assess responsibly.", resolve: "A limited pilot tied to handover time and repeat-call measures would give us evidence before scaling.", escalate: "Bring in the technical and finance reviewers, but keep the decision tied to our agreed outcomes." },
  }),
  "customer-service": profile({
    learnerRole: "Customer resolution adviser", title: "Service recovery conversation", situation: "A frustrated customer has contacted the organisation three times and received conflicting promises.", openingLine: "This is my fourth call. Every person gives me a different answer and I have lost confidence in your service.",
    persona: { ...fallback.persona, name: "Ayanda Jacobs", role: "Frustrated customer", organisationRole: "Small business owner", motivation: "Get a reliable resolution and regain control of the impact.", avatar: { fallbackPalette: "#c2410c" } },
    supportingRoles: [{ name: "Relebohile", role: "Service manager", palette: "#0f766e" }, { name: "Sam", role: "Billing specialist", palette: "#334155" }],
    language: { acknowledge: "That is the first time someone has clearly recognised the impact of the repeated calls.", investigate: "The reference numbers are on the three emails. The second promise was for delivery by Tuesday.", policy: "I understand the service recovery policy. Please be clear about what you can actually authorise.", resolve: "A confirmed replacement date, one owner, and a written update by close of business would resolve this.", escalate: "Escalate it with the full history so I do not have to repeat everything again." },
  }),
  "project-management": profile({
    learnerRole: "Project recovery lead", title: "Stakeholder recovery meeting", situation: "A critical milestone is slipping while two teams disagree about the source and impact of the delay.", openingLine: "I heard about the delay from another team. I need the real impact and a credible recovery plan today.",
    persona: { ...fallback.persona, name: "Sipho Naidoo", role: "Project sponsor", organisationRole: "Executive stakeholder", motivation: "Protect the outcome and avoid another surprise.", avatar: { fallbackPalette: "#4338ca" } },
    supportingRoles: [{ name: "Boitumelo", role: "Delivery lead", palette: "#0f766e" }, { name: "Mark", role: "Supplier manager", palette: "#b45309" }],
    language: { acknowledge: "Owning the communication gap is important. Now show me how you will restore visibility.", investigate: "The dependency is three days late, but the larger risk is the untested handover that follows it.", policy: "Use the agreed change and escalation process so the baseline and accountability stay clear.", resolve: "I can support that recovery sequence if owners, dates, and decision points are visible today.", escalate: "Escalate the supplier dependency with options, impact, and a decision deadline rather than a vague warning." },
  }),
  cybersecurity: profile({
    learnerRole: "Security incident responder", title: "Suspicious activity response", situation: "An employee clicked a convincing link and is unsure whether credentials or documents were exposed.", openingLine: "I clicked a link that looked like our payroll portal. The page disappeared after I entered my password. Am I in trouble?",
    persona: { ...fallback.persona, name: "Nandi Maseko", role: "Reporting employee", organisationRole: "Payroll administrator", motivation: "Contain harm while avoiding humiliation or blame.", avatar: { fallbackPalette: "#0e7490" } },
    supportingRoles: [{ name: "Abdul", role: "Security analyst", palette: "#0f766e" }, { name: "Megan", role: "IT operations lead", palette: "#334155" }],
    language: { acknowledge: "Thank you for focusing on containment rather than blame. I will tell you exactly what happened.", investigate: "I entered my password, approved one prompt, and then opened a payroll spreadsheet before calling you.", policy: "I understand why we must preserve the email and use the incident channel instead of deleting evidence.", resolve: "I will disconnect the device, reset credentials from a clean device, and follow your containment instructions.", escalate: "Please escalate immediately. The payroll access and approval prompt make this time-sensitive." },
  }),
  marketing: profile({
    learnerRole: "Campaign strategy lead", title: "Evidence-led client challenge", situation: "A client wants to replace the agreed audience strategy with a fashionable idea unsupported by the campaign evidence.", openingLine: "Competitors are using short-form video everywhere. Drop the research plan and move the budget there this week.",
    persona: { ...fallback.persona, name: "Mariam Adams", role: "Client marketing director", organisationRole: "Campaign sponsor", motivation: "Demonstrate momentum to executives without wasting budget.", avatar: { fallbackPalette: "#a21caf" } },
    supportingRoles: [{ name: "Neo", role: "Insights analyst", palette: "#0f766e" }, { name: "Grace", role: "Creative lead", palette: "#334155" }],
    language: { acknowledge: "I appreciate that you understand the urgency and visibility pressure behind my request.", investigate: "The executive concern is declining engagement among new customers, not video usage by itself.", policy: "A controlled test with agreed consent, brand, and measurement standards would protect the campaign.", resolve: "Test the format against the existing audience hypothesis before reallocating the full budget.", escalate: "Bring the evidence and test recommendation to the steering group for a documented decision." },
  }),
};

export function getScenarioProfile(courseSlug: string): ScenarioProfile {
  return profiles[courseSlug] ?? fallback;
}
