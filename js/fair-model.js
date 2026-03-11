/**
 * FAIR Model Definition
 * Defines the factor ontology tree, combination rules, and default CI values.
 */

const FAIR_REF = 'Open FAIR Risk Taxonomy (O-RT), The Open Group Standard (C13K), §';
const FAIR_BOOK = 'Freund & Jones, "Measuring and Managing Information Risk: A FAIR Approach" (2014)';

const FAIR = (() => {
  const tree = {
    id: 'risk',
    label: 'Risk',
    unit: 'dollars',
    defaultLow: 10000,
    defaultHigh: 10000000,
    tooltip: 'Annualized Loss Expectancy (ALE)',
    description: `Risk (Annualized Loss Exposure). The probable frequency and magnitude of future loss, expressed as an annualized dollar figure. This is the top-level output: ALE = Loss Event Frequency × Loss Magnitude. Enter the 90% confidence interval for your overall estimated annual loss, or expand to decompose into LEF and LM. [${FAIR_REF}3.1; ${FAIR_BOOK}, Ch. 3]`,
    children: [
      {
        id: 'lef',
        label: 'LEF',
        unit: 'events/year',
        defaultLow: 1,
        defaultHigh: 10,
        tooltip: 'Loss Event Frequency',
        description: `Loss Event Frequency (LEF). The probable number of times a loss event will occur within a given timeframe (typically one year). Enter the 90% CI for how many loss events you expect per year, or expand into Threat Event Frequency and Vulnerability for a more granular estimate. [${FAIR_REF}3.2; ${FAIR_BOOK}, Ch. 4]`,
        children: [
          {
            id: 'tef',
            label: 'TEF',
            unit: 'events/year',
            defaultLow: 5,
            defaultHigh: 50,
            tooltip: 'Threat Event Frequency',
            description: `Threat Event Frequency (TEF). The probable number of times a threat agent will act against an asset within a given timeframe, whether or not the action succeeds. Enter the 90% CI for how many threat events (attempts, not successes) you expect per year. Expand into Contact Frequency and Probability of Action for further decomposition. [${FAIR_REF}3.2.1; ${FAIR_BOOK}, Ch. 5]`,
            children: [
              {
                id: 'cf',
                label: 'CF',
                unit: 'events/year',
                defaultLow: 10,
                defaultHigh: 100,
                tooltip: 'Contact Frequency',
                description: `Contact Frequency (CF). The probable number of times a threat agent will come into contact with an asset within a given timeframe. This is any encounter — scanning, reconnaissance, physical access attempts, phishing emails received — regardless of whether the threat agent decides to act. Enter the 90% CI for contact events per year. [${FAIR_REF}3.2.1.1; ${FAIR_BOOK}, Ch. 5]`,
                children: null
              },
              {
                id: 'poa',
                label: 'PoA',
                unit: 'probability',
                defaultLow: 0.1,
                defaultHigh: 0.8,
                tooltip: 'Probability of Action',
                description: `Probability of Action (PoA). The probability that a threat agent will act once contact has been made. This captures the threat agent's motivation, risk tolerance, and perceived value of the target. Enter a probability between 0 and 1 (e.g., 0.3 means 30% chance of acting per contact). [${FAIR_REF}3.2.1.2; ${FAIR_BOOK}, Ch. 5]`,
                children: null
              }
            ]
          },
          {
            id: 'vuln',
            label: 'Vuln',
            unit: 'probability',
            defaultLow: 0.1,
            defaultHigh: 0.5,
            tooltip: 'Vulnerability',
            description: `Vulnerability (Vuln). The probability that a threat event results in a loss. When entered directly, provide a probability between 0 and 1. When expanded into Threat Capability and Resistance Strength, vulnerability is computed as a binary comparison per simulation iteration: if TCap > RS, the threat succeeds (Vuln = 1); otherwise the control holds (Vuln = 0). [${FAIR_REF}3.2.2; ${FAIR_BOOK}, Ch. 6]`,
            children: [
              {
                id: 'tcap',
                label: 'TCap',
                unit: 'score',
                defaultLow: 20,
                defaultHigh: 80,
                tooltip: 'Threat Capability',
                description: `Threat Capability (TCap). The probable level of force or skill a threat agent can apply against an asset, on a scale of 0–100. Consider the threat actor's technical sophistication, resources, and tools. A script kiddie might be 10–30; a nation-state actor 70–95. Use the same scale as Resistance Strength for meaningful comparison. [${FAIR_REF}3.2.2.1; ${FAIR_BOOK}, Ch. 6]`,
                children: null
              },
              {
                id: 'rs',
                label: 'RS',
                unit: 'score',
                defaultLow: 30,
                defaultHigh: 70,
                tooltip: 'Resistance Strength',
                description: `Resistance Strength (RS). The probable level of resistance a control can provide against a threat, on a scale of 0–100. Consider control maturity, coverage, and effectiveness. A basic firewall might be 20–40; defense-in-depth with monitoring, patching, and segmentation might be 60–85. Use the same scale as Threat Capability. [${FAIR_REF}3.2.2.2; ${FAIR_BOOK}, Ch. 6]`,
                children: null
              }
            ]
          }
        ]
      },
      {
        id: 'lm',
        label: 'LM',
        unit: 'dollars',
        defaultLow: 50000,
        defaultHigh: 5000000,
        tooltip: 'Loss Magnitude',
        description: `Loss Magnitude (LM). The probable dollar magnitude of loss from a single loss event. Enter the 90% CI in dollars (supports shorthand: 50K, 1.5M, 2B), or expand into Primary and Secondary loss categories to estimate each cost component separately. [${FAIR_REF}3.3; ${FAIR_BOOK}, Ch. 7]`,
        children: [
          {
            id: 'primary',
            label: 'Primary',
            unit: 'dollars',
            defaultLow: 30000,
            defaultHigh: 3000000,
            tooltip: 'Primary Loss',
            description: `Primary Loss. Direct losses resulting from the event itself — costs incurred by the organization as a first-order effect. Expand to break down into Productivity, Response, and Replacement costs. Enter the 90% CI in dollars. [${FAIR_REF}3.3.1; ${FAIR_BOOK}, Ch. 7]`,
            children: [
              {
                id: 'productivity',
                label: 'Productivity',
                unit: 'dollars',
                defaultLow: 10000,
                defaultHigh: 1000000,
                tooltip: 'Productivity Loss',
                description: `Productivity Loss. Revenue or output lost due to the disruption. Consider: how long will systems be down? What revenue is generated per hour? How many employees are affected and at what cost? Enter the 90% CI in dollars. [${FAIR_REF}3.3.1.1; ${FAIR_BOOK}, Ch. 7]`,
                children: null
              },
              {
                id: 'response',
                label: 'Response',
                unit: 'dollars',
                defaultLow: 10000,
                defaultHigh: 500000,
                tooltip: 'Response Cost',
                description: `Response Cost. The cost of investigating, containing, and remediating the event. Include: incident response team hours, forensics, external consultants, legal counsel during the response, crisis communications, and customer notification. Enter the 90% CI in dollars. [${FAIR_REF}3.3.1.2; ${FAIR_BOOK}, Ch. 7]`,
                children: null
              },
              {
                id: 'replacement',
                label: 'Replacement',
                unit: 'dollars',
                defaultLow: 5000,
                defaultHigh: 500000,
                tooltip: 'Replacement Cost',
                description: `Replacement Cost. The cost to repair or replace compromised assets. Include: hardware replacement, software re-licensing, data restoration, and infrastructure rebuilding. Enter the 90% CI in dollars. [${FAIR_REF}3.3.1.3; ${FAIR_BOOK}, Ch. 7]`,
                children: null
              }
            ]
          },
          {
            id: 'secondary',
            label: 'Secondary',
            unit: 'dollars',
            defaultLow: 10000,
            defaultHigh: 2000000,
            tooltip: 'Secondary Loss',
            description: `Secondary Loss. Losses resulting from the reactions of external stakeholders (customers, regulators, partners) to the primary event. These are often the largest component of loss. Expand into SLEF (probability these occur) and SLM (magnitude when they do). Enter the 90% CI in dollars. [${FAIR_REF}3.3.2; ${FAIR_BOOK}, Ch. 8]`,
            children: [
              {
                id: 'slef',
                label: 'SLEF',
                unit: 'probability',
                defaultLow: 0.2,
                defaultHigh: 0.9,
                tooltip: 'Secondary Loss Event Frequency',
                description: `Secondary Loss Event Frequency (SLEF). The probability that a primary loss event triggers secondary stakeholder reactions. Not all incidents become public or trigger regulatory action. Enter a probability between 0 and 1 (e.g., 0.3 means 30% chance that secondary losses materialize). [${FAIR_REF}3.3.2.1; ${FAIR_BOOK}, Ch. 8]`,
                children: null
              },
              {
                id: 'slm',
                label: 'SLM',
                unit: 'dollars',
                defaultLow: 50000,
                defaultHigh: 5000000,
                tooltip: 'Secondary Loss Magnitude',
                description: `Secondary Loss Magnitude (SLM). The probable dollar magnitude of secondary losses when they occur. Expand to break down into Reputation, Competitive Advantage, and Fines & Judgments. Enter the 90% CI in dollars. [${FAIR_REF}3.3.2.2; ${FAIR_BOOK}, Ch. 8]`,
                children: [
                  {
                    id: 'reputation',
                    label: 'Reputation',
                    unit: 'dollars',
                    defaultLow: 10000,
                    defaultHigh: 2000000,
                    tooltip: 'Reputation Damage',
                    description: `Reputation Damage. Dollar impact of lost customer trust and brand value. Consider: customer churn rate, cost to reacquire lost customers, reduced pricing power, and diminished market position. Enter the 90% CI in dollars. [${FAIR_REF}3.3.2.2.1; ${FAIR_BOOK}, Ch. 8]`,
                    children: null
                  },
                  {
                    id: 'competitive',
                    label: 'Competitive Advantage',
                    unit: 'dollars',
                    defaultLow: 5000,
                    defaultHigh: 1000000,
                    tooltip: 'Competitive Advantage Loss',
                    description: `Competitive Advantage Loss. Dollar impact of losing proprietary information, trade secrets, or market position to competitors. Consider: R&D investment exposed, time-to-market advantage lost, and strategic initiative compromise. Enter the 90% CI in dollars. [${FAIR_REF}3.3.2.2.2; ${FAIR_BOOK}, Ch. 8]`,
                    children: null
                  },
                  {
                    id: 'fines',
                    label: 'Fines & Judgments',
                    unit: 'dollars',
                    defaultLow: 5000,
                    defaultHigh: 2000000,
                    tooltip: 'Fines & Judgments',
                    description: `Fines & Judgments. Regulatory penalties, legal settlements, and court judgments. Consider: applicable regulations (GDPR, HIPAA, PCI-DSS), per-record penalty rates, class-action exposure, and contractual penalties. Enter the 90% CI in dollars. [${FAIR_REF}3.3.2.2.3; ${FAIR_BOOK}, Ch. 8]`,
                    children: null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const combinationRules = {
    risk: (values) => values.lef * values.lm,
    lef: (values) => values.tef * values.vuln,
    tef: (values) => values.cf * values.poa,
    vuln: (values) => values.tcap > values.rs ? 1 : 0,
    lm: (values) => values.primary + values.secondary,
    primary: (values) => values.productivity + values.response + values.replacement,
    secondary: (values) => values.slef * values.slm,
    slm: (values) => values.reputation + values.competitive + values.fines
  };

  function findNode(id, node = tree) {
    if (node.id === id) {
      return node;
    }
    if (node.children) {
      for (const child of node.children) {
        const found = findNode(id, child);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  function combine(factorId, childValues) {
    const rule = combinationRules[factorId];
    if (!rule) {
      throw new Error(`No combination rule for factor: ${factorId}`);
    }
    return rule(childValues);
  }

  return {
    tree,
    combinationRules,
    findNode,
    combine
  };
})();

// Register on globalThis for importScripts (Web Worker)
if (typeof globalThis !== 'undefined') {
  globalThis.FAIR = FAIR;
}

// ES module export
export { FAIR };
