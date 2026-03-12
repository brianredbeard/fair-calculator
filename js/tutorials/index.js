/**
 * Tutorial Registry - Metadata and lazy loading for tutorial content
 */

/**
 * Shared framework recap used by all tutorials
 * ~300 words explaining the FAIR model basics
 */
export const FRAMEWORK_RECAP = `FAIR stands for Factor Analysis of Information Risk. It's a framework for quantifying cyber risk in financial terms, making risk discussions concrete instead of abstract.

At its core, FAIR breaks risk down into two components: how often bad things happen (Loss Event Frequency), and how bad they are when they do happen (Loss Magnitude). Risk equals frequency times magnitude.

Loss Event Frequency (LEF) comes from the interaction between threats and your defenses. We estimate how many times a threat agent will act against you (Threat Event Frequency), and what percentage of those attempts will succeed given your controls (Vulnerability). Strong controls mean low vulnerability. Weak controls mean high vulnerability.

Loss Magnitude (LM) captures the financial impact when an event occurs. We break this into Primary losses (the direct costs: productivity lost, incident response, asset replacement) and Secondary losses (the ripple effects: fines, reputation damage, competitive disadvantage). Often, the secondary losses dwarf the primary ones.

The power of FAIR is in the decomposition. You don't need to know your total risk right away. You can break it down into smaller, estimable pieces. Contact Frequency is easier to estimate than Threat Event Frequency. Productivity loss is easier to estimate than total Loss Magnitude. Each factor becomes a building block.

This tutorial will walk you through a real scenario, step by step, showing you how to estimate each factor and how they combine to produce the final risk number. You'll see the logic of the model, and you'll practice the judgment calls that every FAIR analysis requires.`;

/**
 * Tutorial registry - metadata for all tutorials
 * Content is lazy-loaded via dynamic import when needed
 */
export const TUTORIAL_REGISTRY = [
  {
    id: 'ransomware',
    title: 'Ransomware Outbreak Tutorial',
    subtitle: 'Understanding high-impact, low-frequency risks',
    difficulty: 'intermediate',
    estimatedMinutes: 15,
    scenarioIndex: 3, // Example: Ransomware outbreak (Stage 2)
    module: './ransomware.js'
  },
  {
    id: 'brute-force',
    title: 'Brute Force Attack Tutorial',
    subtitle: 'Analyzing high-frequency, low-impact threats',
    difficulty: 'beginner',
    estimatedMinutes: 12,
    scenarioIndex: 1, // Example: External brute force (Stage 2)
    module: './brute-force.js'
  },
  {
    id: 'phishing',
    title: 'Phishing Campaign Tutorial',
    subtitle: 'Evaluating very high frequency, very low impact scenarios',
    difficulty: 'beginner',
    estimatedMinutes: 12,
    scenarioIndex: 11, // Example: Phishing on back-office (Stage 2)
    module: './phishing.js'
  },
  {
    id: 's3-misconfig',
    title: 'S3 Bucket Misconfiguration Tutorial',
    subtitle: 'Assessing configuration errors and exposure risks',
    difficulty: 'beginner',
    estimatedMinutes: 12,
    scenarioIndex: 7, // Example: S3 bucket misconfiguration (Stage 2)
    module: './s3-misconfig.js'
  },
  {
    id: 'laptop-theft',
    title: 'Laptop Theft Tutorial',
    subtitle: 'Physical security and data breach analysis',
    difficulty: 'intermediate',
    estimatedMinutes: 14,
    scenarioIndex: 15, // Example: Physical laptop theft (Stage 2)
    module: './laptop-theft.js'
  },
  {
    id: 'ddos',
    title: 'DDoS Attack Tutorial',
    subtitle: 'Availability risks and service disruption',
    difficulty: 'intermediate',
    estimatedMinutes: 14,
    scenarioIndex: 9, // Example: DDoS on public website (Stage 2)
    module: './ddos.js'
  },
  {
    id: 'crm-outage',
    title: 'CRM Outage Tutorial',
    subtitle: 'Third-party service dependencies and business continuity',
    difficulty: 'intermediate',
    estimatedMinutes: 14,
    scenarioIndex: 17, // Example: SaaS CRM outage (Stage 2)
    module: './crm-outage.js'
  },
  {
    id: 'insider-threat',
    title: 'Insider Data Exfiltration Tutorial',
    subtitle: 'Internal threat analysis and data loss',
    difficulty: 'intermediate',
    estimatedMinutes: 15,
    scenarioIndex: 5, // Example: Insider data exfiltration (Stage 2)
    module: './insider-threat.js'
  },
  {
    id: 'legacy-system',
    title: 'Legacy System Compromise Tutorial',
    subtitle: 'Technical debt and security risk trade-offs',
    difficulty: 'intermediate',
    estimatedMinutes: 14,
    scenarioIndex: 19, // Example: Legacy system compromise (Stage 2)
    module: './legacy-system.js'
  },
  {
    id: 'regulatory',
    title: 'Regulatory Audit Failure Tutorial',
    subtitle: 'Compliance violations and secondary loss dominance',
    difficulty: 'advanced',
    estimatedMinutes: 16,
    scenarioIndex: 21, // Example: Regulatory audit failure (Stage 2)
    module: './regulatory.js'
  },
  {
    id: 'cloud-kms',
    title: 'Cloud KMS Compromise Tutorial',
    subtitle: 'Catastrophic tail risk and encryption key management',
    difficulty: 'advanced',
    estimatedMinutes: 17,
    scenarioIndex: 13, // Example: Cloud KMS compromise (Stage 2)
    module: './cloud-kms.js'
  },
  {
    id: 'apt-ip-theft',
    title: 'APT Intellectual Property Theft Tutorial',
    subtitle: 'Advanced persistent threats and competitive advantage loss',
    difficulty: 'advanced',
    estimatedMinutes: 17,
    scenarioIndex: 23, // Example: APT IP theft (Stage 2)
    module: './apt-ip-theft.js'
  }
];

/**
 * Get full tutorial data by ID (lazy loads content module)
 * @param {string} tutorialId - Tutorial ID from registry
 * @returns {Promise<Object>} Tutorial data with frameworkRecap defaulted
 */
export async function getTutorial(tutorialId) {
  const entry = TUTORIAL_REGISTRY.find(t => t.id === tutorialId);
  if (!entry) {
    throw new Error(`Tutorial not found: ${tutorialId}`);
  }

  try {
    // Dynamic import of tutorial content module
    const module = await import(entry.module);
    const tutorialData = module.default;

    // Merge with FRAMEWORK_RECAP if not provided
    if (!tutorialData.frameworkRecap) {
      tutorialData.frameworkRecap = FRAMEWORK_RECAP;
    }

    return tutorialData;
  } catch (error) {
    console.error(`Failed to load tutorial ${tutorialId}:`, error);
    throw new Error(`Tutorial module not available: ${tutorialId}`);
  }
}

/**
 * Get lightweight tutorial metadata (no content import)
 * @returns {Array} Array of tutorial metadata objects
 */
export function listTutorials() {
  return TUTORIAL_REGISTRY.map(t => ({
    id: t.id,
    title: t.title,
    subtitle: t.subtitle,
    difficulty: t.difficulty,
    estimatedMinutes: t.estimatedMinutes,
    scenarioIndex: t.scenarioIndex
  }));
}

/**
 * Check if a tutorial exists for a given scenario index
 * @param {number} scenarioIndex - Index in EXAMPLE_SCENARIOS array
 * @returns {boolean} True if tutorial exists
 */
export function hasTutorial(scenarioIndex) {
  return TUTORIAL_REGISTRY.some(t => t.scenarioIndex === scenarioIndex);
}

/**
 * Get tutorial ID by scenario index
 * @param {number} scenarioIndex - Index in EXAMPLE_SCENARIOS array
 * @returns {string|null} Tutorial ID or null if not found
 */
export function getTutorialIdByScenarioIndex(scenarioIndex) {
  const entry = TUTORIAL_REGISTRY.find(t => t.scenarioIndex === scenarioIndex);
  return entry ? entry.id : null;
}
