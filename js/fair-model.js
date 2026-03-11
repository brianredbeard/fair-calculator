/**
 * FAIR Model Definition
 * Defines the factor ontology tree, combination rules, and default CI values.
 */

const FAIR = (() => {
  const tree = {
    id: 'risk',
    label: 'Risk',
    unit: 'dollars',
    defaultLow: 10000,
    defaultHigh: 10000000,
    tooltip: 'Annualized Loss Expectancy (ALE) - expected annual loss from a risk scenario',
    children: [
      {
        id: 'lef',
        label: 'LEF',
        unit: 'events/year',
        defaultLow: 1,
        defaultHigh: 10,
        tooltip: 'Loss Event Frequency - expected number of loss events per year',
        children: [
          {
            id: 'tef',
            label: 'TEF',
            unit: 'events/year',
            defaultLow: 5,
            defaultHigh: 50,
            tooltip: 'Threat Event Frequency - rate at which threat agents act against assets',
            children: [
              {
                id: 'cf',
                label: 'CF',
                unit: 'events/year',
                defaultLow: 10,
                defaultHigh: 100,
                tooltip: 'Contact Frequency - rate at which threat agents come into contact with assets',
                children: null
              },
              {
                id: 'poa',
                label: 'PoA',
                unit: 'probability',
                defaultLow: 0.1,
                defaultHigh: 0.8,
                tooltip: 'Probability of Action - likelihood threat agent acts given contact opportunity',
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
            tooltip: 'Vulnerability - probability that threat action results in loss',
            children: [
              {
                id: 'tcap',
                label: 'TCap',
                unit: 'score',
                defaultLow: 20,
                defaultHigh: 80,
                tooltip: 'Threat Capability - skill/resources of threat agent (0-100 scale)',
                children: null
              },
              {
                id: 'rs',
                label: 'RS',
                unit: 'score',
                defaultLow: 30,
                defaultHigh: 70,
                tooltip: 'Resistance Strength - strength of controls protecting asset (0-100 scale)',
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
        tooltip: 'Loss Magnitude - expected dollar loss from a single event',
        children: [
          {
            id: 'primary',
            label: 'Primary',
            unit: 'dollars',
            defaultLow: 30000,
            defaultHigh: 3000000,
            tooltip: 'Primary Loss - direct losses from the event itself',
            children: [
              {
                id: 'productivity',
                label: 'Productivity',
                unit: 'dollars',
                defaultLow: 10000,
                defaultHigh: 1000000,
                tooltip: 'Productivity loss from disrupted operations',
                children: null
              },
              {
                id: 'response',
                label: 'Response',
                unit: 'dollars',
                defaultLow: 10000,
                defaultHigh: 500000,
                tooltip: 'Cost of responding to and recovering from the event',
                children: null
              },
              {
                id: 'replacement',
                label: 'Replacement',
                unit: 'dollars',
                defaultLow: 5000,
                defaultHigh: 500000,
                tooltip: 'Cost of replacing compromised assets',
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
            tooltip: 'Secondary Loss - losses from external stakeholder reactions',
            children: [
              {
                id: 'slef',
                label: 'SLEF',
                unit: 'probability',
                defaultLow: 0.2,
                defaultHigh: 0.9,
                tooltip: 'Secondary Loss Event Frequency - probability that secondary losses occur',
                children: null
              },
              {
                id: 'slm',
                label: 'SLM',
                unit: 'dollars',
                defaultLow: 50000,
                defaultHigh: 5000000,
                tooltip: 'Secondary Loss Magnitude - expected dollar loss from secondary effects',
                children: [
                  {
                    id: 'reputation',
                    label: 'Reputation',
                    unit: 'dollars',
                    defaultLow: 10000,
                    defaultHigh: 2000000,
                    tooltip: 'Reputational damage costs',
                    children: null
                  },
                  {
                    id: 'competitive',
                    label: 'Competitive Advantage',
                    unit: 'dollars',
                    defaultLow: 5000,
                    defaultHigh: 1000000,
                    tooltip: 'Loss of competitive advantage',
                    children: null
                  },
                  {
                    id: 'fines',
                    label: 'Fines & Judgments',
                    unit: 'dollars',
                    defaultLow: 5000,
                    defaultHigh: 2000000,
                    tooltip: 'Regulatory fines and legal judgments',
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
