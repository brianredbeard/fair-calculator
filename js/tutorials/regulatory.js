/**
 * Regulatory Audit Failure Tutorial
 * Advanced difficulty - Understanding compliance as existential risk
 */

export default {
  id: 'regulatory',
  title: 'Regulatory Audit Failure Tutorial',
  subtitle: 'Understanding compliance as existential risk',
  difficulty: 'advanced',
  estimatedMinutes: 18,
  scenarioIndex: 21,

  chapters: [
    {
      title: 'Chapter 1: Understanding Frequency',
      steps: [
        {
          factorId: 'lef',
          action: 'focus',
          narrative: 'Loss Event Frequency (LEF) for regulatory audit failures represents incidents where you fail a compliance audit (GDPR, HIPAA, SOC 2, PCI-DSS) due to security control deficiencies, triggering enforcement action. We estimate 0.2 to 10 failures per year. This is much lower than technical threats (ransomware LEF=0.1–0.6, phishing LEF=10–1500) but consequences are catastrophic: multi-million dollar fines, operating restrictions, and existential business risk.',
          scenarioContext: 'Your organization processes 500,000 EU customer records under GDPR and handles payment card data under PCI-DSS. You undergo annual compliance audits: GDPR data protection assessment, PCI-DSS QSA audit, SOC 2 Type II examination. Any material control deficiency can trigger regulatory enforcement.',
          whyTheseNumbers: 'LEF of 0.2–10/year reflects that audit failures are rare but not impossible. Most organizations pass audits with minor findings (not LEF events). Failures occur when: (1) auditors discover unremediated critical findings from prior audits, (2) data breaches reveal systemic control failures, or (3) whistleblowers report violations triggering investigations. The wide range reflects organizational maturity.'
        },
        {
          factorId: 'tef',
          action: 'expand',
          narrative: 'LEF decomposes into Threat Event Frequency (TEF) and Vulnerability. Let\'s expand to see TEF — how often regulatory audits or investigations occur, whether or not they result in enforcement action.',
          scenarioContext: 'Regulatory events include: scheduled annual audits (GDPR DPA review, PCI-DSS QSA assessment), incident-triggered investigations (data breach prompts regulator inquiry), competitor complaints (triggering targeted examination), and random sampling (regulators select organizations for spot checks).',
          whyTheseNumbers: null
        },
        {
          factorId: 'cf',
          action: 'focus',
          narrative: 'Contact Frequency (CF) represents regulatory touchpoints — audits, investigations, and examinations where control deficiencies could be discovered. We estimate 2 to 20 events per year. This includes scheduled audits (1–4/year depending on regulations), incident-triggered investigations (0–5/year), and self-reported violations (1–10/year under mandatory breach notification laws).',
          scenarioContext: 'CF events: annual GDPR DPA audit (1/year), PCI-DSS QSA assessment (1/year), SOC 2 Type II examination (1–2/year), data breach notification triggers regulator investigation (0–3/year if you have breaches), whistleblower complaint initiates targeted audit (0–2/year), random regulatory sampling (0–5/year).',
          whyTheseNumbers: 'CF of 2–20/year is much lower than technical threats because regulators have limited audit capacity. Unlike attackers (unlimited, automated), regulators audit a small percentage of entities annually. Higher CF for heavily regulated industries (finance CF=10–20, healthcare CF=5–15) vs. general commerce (CF=2–5).',
          experiment: {
            prompt: 'Try increasing Contact Frequency to 10–50 to model a heavily regulated industry (banking, healthcare) with multiple oversight bodies. Watch the Median and 90th Percentile — more audits means more chances to be found non-compliant.',
            resetAfter: true
          }
        },
        {
          factorId: 'poa',
          action: 'focus',
          narrative: 'Probability of Action (PoA) is the likelihood that a regulatory audit actually examines security controls (vs. just reviewing documentation). We estimate 0.1–0.5 (10–50%). Not all audits are comprehensive: some are desk reviews, others are deep technical assessments. PoA reflects audit depth and whether auditors probe beyond compliance theater.',
          scenarioContext: 'PoA scenarios: Annual SOC 2 audit by same firm for 5 years, auditor accepts prior year\'s evidence with minimal new testing (PoA≈10%). New regulator investigation triggered by data breach, auditors perform comprehensive technical testing (PoA≈50%). GDPR DPA spot check, auditors sample 20% of controls (PoA≈30%).',
          whyTheseNumbers: 'PoA of 0.1–0.5 reflects audit economics. Comprehensive testing is expensive, so routine audits often rely on documentation review and sampling. PoA increases dramatically when: (1) prior audit had major findings (regulator increases scrutiny), (2) incident triggered the audit (deep investigation), or (3) whistleblower provided specific allegations (targeted examination). Unlike technical threats (where PoA is attacker-driven), regulatory PoA is resource-constrained.'
        },
        {
          factorId: 'vuln',
          action: 'expand',
          narrative: 'Vulnerability is the probability that an audit discovers material control deficiencies warranting enforcement action. This depends on Threat Capability (auditor skill and tools) versus Resistance Strength (your actual control implementation vs. documented controls). Let\'s decompose it.',
          scenarioContext: 'Your defenses: documented security policies (encryption, access controls, incident response), regular compliance self-assessments, dedicated compliance team, third-party penetration testing, and automated compliance monitoring tools. But gaps exist: legacy systems not in compliance scope, undocumented shadow IT, incomplete remediation of prior findings.',
          whyTheseNumbers: null
        },
        {
          factorId: 'tcap',
          action: 'focus',
          narrative: 'Threat Capability (TCap) for regulatory audits is the auditor\'s skill at uncovering control deficiencies, rated 0.5–0.9 on a 0–100 scale. Routine audits by compliance firms (TCap=0.5–0.6, follow checklist, don\'t probe deeply) vs. regulator investigations post-breach (TCap=0.8–0.9, forensic-level examination, unlimited time). TCap also reflects auditor motivation: passing you quickly (revenue) vs. protecting public (enforcement).',
          scenarioContext: 'TCap factors: Annual SOC 2 audit by same firm (conflict of interest: they want to keep your business, TCap≈0.5). GDPR DPA investigation after data breach affecting 100,000 EU citizens (regulator politically motivated to show enforcement, TCap≈0.9). PCI-DSS QSA spot check by new auditor (proving competence, TCap≈0.7).',
          whyTheseNumbers: 'TCap of 0.5–0.9 reflects that auditing quality varies wildly. Compliance firms doing routine audits have financial incentive to pass you (repeat business). Regulators conducting investigations post-incident have political incentive to find violations (demonstrate consumer protection). The range also reflects auditor skill: junior auditors following checklists (TCap=0.5) vs. former CISOs with forensic tools (TCap=0.9).'
        },
        {
          factorId: 'rs',
          action: 'focus',
          narrative: 'Resistance Strength (RS) is the gap between documented controls and actual implementation, rated 0.2–0.7 on a 0–100 scale. Perfect compliance (documented controls match reality) would be RS=1.0, but all organizations have gaps: legacy systems exempt from policies, shadow IT, incomplete remediation, or "checkbox compliance" (policies exist but aren\'t enforced). RS measures actual security posture vs. compliance theater.',
          scenarioContext: 'Your RS gaps: encryption policy requires all PII encrypted, but 15% of databases are unencrypted (legacy systems, RS≈0.4). Access control policy requires annual reviews, but 30% of accounts haven\'t been reviewed in 2 years (process failure, RS≈0.5). Incident response plan exists but hasn\'t been tested in 18 months (documentation vs. readiness, RS≈0.3). Network segmentation policy documented but not implemented (unfunded, RS≈0.2).',
          whyTheseNumbers: 'RS of 0.2–0.7 reflects that compliance is aspirational for most organizations. Lower end (RS=0.2): controls documented but largely unenforced, auditors will find widespread violations. Upper end (RS=0.7): controls mostly implemented, gaps are edge cases and legacy systems. RS=1.0 is theoretical — even well-run organizations have some control drift. The question is whether auditors discover your gaps.',
          experiment: {
            prompt: 'Increase Resistance Strength to 0.6–0.95 to model investing in automated compliance monitoring (infrastructure-as-code, continuous compliance scanning). See how closing the documentation-reality gap reduces risk.',
            resetAfter: true
          }
        }
      ]
    },
    {
      title: 'Chapter 2: Estimating Direct Costs',
      steps: [
        {
          factorId: 'lm',
          action: 'focus',
          narrative: 'Loss Magnitude (LM) for regulatory audit failure is $300K to $30M per incident, driven overwhelmingly by Secondary losses (fines, reputation damage, business restrictions). Primary losses ($100K–$1.5M) are modest compared to Secondary ($500K–$28M). This inverted loss profile — where aftermath exceeds direct costs by 10–100x — is unique to regulatory risks and similar to ransomware\'s secondary-dominated pattern.',
          scenarioContext: 'When a GDPR audit discovers you\'re storing 500,000 unencrypted EU customer records in violation of Article 32 (security requirements), you face: immediate remediation costs (Primary), but the real damage is regulatory fines (up to 4% of global revenue or €20M), customer trust erosion, and potential operating restrictions (can\'t process EU data until compliant).',
          whyTheseNumbers: 'LM of $300K–$30M reflects regulatory enforcement severity. Lower end: minor violation (incomplete documentation), remediation order, no fine ($300K remediation costs). Upper end: material violation (widespread unencrypted PII), max GDPR fine ($20M), reputation damage, customer exodus ($8M), competitive losses ($2M), total $30M+. Compare to ransomware (LM=$1M–$8M) — regulatory failures can be even more costly.'
        },
        {
          factorId: 'primary',
          action: 'expand',
          narrative: 'Primary losses for regulatory failures include lost productivity (staff time during remediation), response costs (legal defense, compliance consultants, audit cooperation), and replacement costs ($0 — you\'re remediating controls, not replacing infrastructure). For regulatory risks, Primary is the smaller component; the existential threat is Secondary.',
          scenarioContext: 'Primary costs: compliance team working 60-hour weeks for 6 months to remediate findings ($100K–$300K), external compliance consultants ($50K–$200K), legal counsel defending against enforcement ($100K–$500K), but all primary costs combined are typically under $1M. The real cost is what comes next: fines, reputation damage, lost business.',
          whyTheseNumbers: null
        },
        {
          factorId: 'productivity',
          action: 'focus',
          narrative: 'Productivity loss during regulatory remediation is $50K to $800K. When auditors issue a Notice of Violation, your entire organization pivots to remediation: compliance team stops all other work, engineering freezes features to implement security controls, legal coordinates responses, executives testify at hearings. This can consume 6–12 months of organizational capacity.',
          scenarioContext: 'Productivity impact: Compliance team (5 people) dedicated full-time to remediation for 6 months ($200K salary costs). Engineering team (20 people) spends 50% of time implementing encryption, access controls, audit logging for 6 months ($400K in delayed product development). Legal and executive time defending against enforcement action (200 hours at $300–$500/hour = $60K–$100K).',
          whyTheseNumbers: 'Productivity of $50K–$800K reflects remediation scope. Lower end: single control deficiency (incomplete logging), 2-month remediation project. Upper end: systemic failures (no encryption, no access controls, no incident response capability), 12-month organization-wide remediation consuming all discretionary capacity. Unlike technical incidents (restore from backup, return to normal), regulatory remediation requires permanent control improvements.'
        },
        {
          factorId: 'response',
          action: 'focus',
          narrative: 'Response costs for regulatory violations are $50K to $700K, covering legal defense, expert consultants, audit cooperation, and regulatory negotiations. Unlike technical incidents (where response is internal), regulatory response involves external legal counsel, compliance specialists, and potentially expert witnesses if enforcement escalates to administrative hearings or court.',
          scenarioContext: 'Response involves: Law firm specializing in data protection ($250–$500/hour, 100–500 hours = $25K–$250K), compliance consulting firm to design remediation plan ($50K–$200K), forensic experts to validate control implementation ($20K–$100K), public relations firm if violation becomes public ($30K–$150K), potential settlement negotiations with regulator ($0–$200K in legal fees, separate from actual fine).',
          whyTheseNumbers: 'Response of $50K–$700K scales with enforcement severity. Lower end: cooperative remediation, regulator accepts your plan, minimal legal involvement. Upper end: contested enforcement, you challenge the violation in administrative court, 18-month legal battle with expert witnesses, depositions, hearings. The upper bound approaches insider threat Response costs ($100K–$1.5M) because both involve legal proceedings, not just technical incident response.'
        },
        {
          factorId: 'replacement',
          action: 'focus',
          narrative: 'Replacement costs are $0 for regulatory violations. You\'re not replacing compromised infrastructure (like ransomware) or stolen devices (like laptop theft). Instead, you\'re implementing missing controls (encryption, access management, logging) which are captured in Productivity (engineering time) and Response (consultant fees). Replacement only applies when tangible assets are lost or destroyed.',
          scenarioContext: 'Post-violation remediation: implement encryption ($0 in new hardware, encryption is software), deploy access control system ($0 in servers, SaaS IAM solution), enhance logging ($0 in infrastructure, forward logs to existing SIEM). All costs are labor (Productivity) or services (Response), not capital equipment (Replacement).',
          whyTheseNumbers: 'Replacement of $0 reflects that compliance is process and control implementation, not infrastructure. This contrasts with ransomware (Replacement=$200K–$3M, rebuilding servers) or DDoS (Replacement=$20K–$200K, adding CDN capacity). Regulatory remediation is "implement what you should have done already," not "rebuild what was destroyed." The costs are entirely labor and services.'
        }
      ]
    },
    {
      title: 'Chapter 3: Understanding Ripple Effects',
      steps: [
        {
          factorId: 'secondary',
          action: 'expand',
          narrative: 'Secondary losses for regulatory violations are catastrophic ($500K–$28M), often exceeding Primary losses by 20–100x. SLEF is 80–100% (violations almost always become public via enforcement actions, court filings, or mandatory disclosures). SLM is dominated by fines (up to $20M under GDPR) but also includes massive reputation damage and competitive losses. This is a secondary-loss-dominated risk profile similar to ransomware but with even higher potential magnitude. Let\'s decompose into SLEF and SLM.',
          scenarioContext: 'Regulatory enforcement is inherently public: EU GDPR violations are published on regulator websites, HIPAA settlements are press releases, PCI-DSS failures result in public "non-compliant merchant" listings. Customers, competitors, and media all learn about violations. Secondary consequences include: regulatory fines (contractual, unavoidable), customer churn (trust erosion), competitive damage (sales objections, "are they secure enough?").',
          whyTheseNumbers: null
        },
        {
          factorId: 'slef',
          action: 'focus',
          narrative: 'Secondary Loss Event Frequency (SLEF) for regulatory violations is 0.8–1.0 (80–100%), the highest SLEF of any risk. Unlike technical incidents (which you can sometimes keep confidential), regulatory enforcement is public by design: regulators publish violations to deter others, court proceedings are public record, and many regulations mandate public disclosure. Confidential resolution is nearly impossible.',
          scenarioContext: 'Why SLEF is 100%: GDPR enforcement actions are published on Data Protection Authority websites (public). HIPAA settlements require HHS to issue press releases (public). PCI-DSS failures result in your being listed as non-compliant (public). Even if you settle before formal enforcement, the settlement terms often require public acknowledgment. The only sub-100% scenarios are when you remediate before violation is formally documented.',
          whyTheseNumbers: 'SLEF of 0.8–1.0 reflects that regulatory transparency is policy, not accident. Regulators exist to protect consumers, and they demonstrate effectiveness through publicized enforcement. This matches insider threats (SLEF=70–100%, law enforcement creates public records) but exceeds ransomware (SLEF=60–100%, where some incidents stay confidential). SLEF<100% only when you self-report, remediate immediately, and regulator agrees not to pursue formal enforcement.'
        },
        {
          factorId: 'slm',
          action: 'expand',
          narrative: 'Secondary Loss Magnitude (SLM) for regulatory violations is $500K to $28M, driven by astronomical fines (up to $20M), severe reputation damage ($200K–$8M in customer churn), and competitive losses ($100K–$2M as prospects question your security). This is the highest SLM of any common threat, potentially exceeding even ransomware ($1M–$15M secondary). Regulatory risk is existential for some organizations. Let\'s break it down.',
          scenarioContext: 'If GDPR audit reveals systematic encryption failures affecting 500,000 EU customers, regulators can fine up to 4% of global annual revenue or €20M (whichever is higher). Add reputation damage (30% EU customer churn = $5M–$8M) and competitive losses (lost deals due to "GDPR non-compliant" stigma = $2M), total secondary losses approach $30M. This can threaten company survival.',
          whyTheseNumbers: null
        },
        {
          factorId: 'fines',
          action: 'focus',
          narrative: 'Regulatory fines for compliance violations are $200K to $20M, the highest fine exposure of any risk. GDPR allows up to 4% of global revenue or €20M. HIPAA allows up to $1.5M per violation category per year. PCI-DSS allows card brands to fine $5K–$100K per month until compliant. State laws (CCPA, etc.) add $2.5K per violation. These fines are not probabilistic — if you\'re found in violation, you WILL pay.',
          scenarioContext: 'Fine examples: GDPR violation (inadequate encryption) affecting 100,000 EU customers, regulator fines €10M ($11M USD). HIPAA violation (lack of encryption) affecting 50,000 patient records, HHS fines $1M. PCI-DSS failure to remediate known vulnerabilities, Visa fines $50K/month for 6 months = $300K. The fines are calculated based on violation severity, number of affected individuals, and your revenue (ability to pay).',
          whyTheseNumbers: 'Fines of $200K–$20M reflect regulatory enforcement maximums. Lower end: single control deficiency, small number of affected individuals, cooperative remediation ($200K–$500K). Upper end: systematic failures, hundreds of thousands affected, regulator seeking to "make an example" ($10M–$20M). The $20M max is GDPR\'s hard cap, but for companies with revenue >$500M, the 4% revenue cap can exceed $20M. These are the largest predictable fines in cybersecurity.'
        },
        {
          factorId: 'reputation',
          action: 'focus',
          narrative: 'Reputation damage from regulatory violations is $200K to $8M, rivaling or exceeding ransomware reputation losses ($500K–$8M). Regulatory violations signal systematic organizational failure ("they don\'t care about compliance"), not just bad luck (like DDoS). Customers, especially enterprise B2B, flee to compliant competitors. SOC 2, ISO 27001 certifications may be revoked, blocking entire market segments.',
          scenarioContext: 'Reputation pathways: GDPR violation publicized, 20–30% of EU customers cancel within 6 months ($3M–$5M lost recurring revenue over 2 years). Enterprise prospects require proof of remediation before signing, sales cycles elongate 3–6 months ($2M–$3M in delayed revenue). SOC 2 auditor revokes certification due to material control deficiencies, you lose access to enterprise market for 12 months ($5M–$8M opportunity cost). Talent flight: engineers leave for "more compliant" employers.',
          whyTheseNumbers: 'Reputation of $200K–$8M models trust erosion. Unlike DDoS (customers understand availability attacks) or laptop theft (relatable accident), regulatory violations suggest management negligence: "They knew the requirements and chose not to comply." This is harder to recover from. The $8M upper bound represents existential threat for mid-market companies where losing SOC 2 or GDPR compliance blocks core markets.'
        },
        {
          factorId: 'competitive',
          action: 'focus',
          narrative: 'Competitive advantage loss from regulatory violations is $100K to $2M, occurring when compliance status becomes a sales differentiator. "We\'re GDPR compliant" vs. "they were fined for violations" closes deals. Competitors actively weaponize your violations in RFP responses and sales calls. You\'re forced to discount or offer extended warranties to overcome objections.',
          scenarioContext: 'Competitive loss mechanisms: Enterprise RFPs include "no regulatory violations in past 3 years" requirement, you\'re automatically disqualified ($500K–$1M in lost opportunities). Competitor includes "Unlike Company X (fined $5M for GDPR violations), we\'ve never had an enforcement action" in pitch decks ($200K–$500K in lost deals). You offer 20% discounts plus indemnification clauses to overcome security objections ($500K–$1M in margin erosion).',
          whyTheseNumbers: 'Competitive of $100K–$2M reflects that compliance is a qualifier, not just a differentiator. B2B enterprise buyers have compliance checklists: SOC 2 Type II, GDPR compliant, no recent violations. Fail any criterion, you\'re out. The $2M upper bound represents 2 years of lost enterprise deals plus margin erosion on deals you do close. Compare to ransomware Competitive ($300K–$4M) — regulatory violations create similar competitive disadvantage.',
          experiment: {
            prompt: 'Increase Competitive loss to $5M–$20M to model being banned from an entire regulated market (healthcare, finance) due to compliance failure. See how regulatory risk can be company-ending.',
            resetAfter: true
          }
        }
      ]
    },
    {
      title: 'Chapter 4: Interpreting Results',
      steps: [
        {
          factorId: 'risk',
          action: 'focus',
          narrative: 'You\'ve estimated all factors. Examine the results. The Loss Exceedance Curve shows your risk distribution. The 90th percentile is typically $3M–$35M annually for regulatory compliance risk — the highest of any analyzed threat. Notice the defining characteristic: Secondary losses ($500K–$28M) dominate Primary losses ($100K–$1.5M) by 20–100x. This is the most extreme secondary-dominated loss profile in FAIR analysis. The breakdown reveals Fines ($200K–$20M) as the single largest cost component, followed by Reputation ($200K–$8M). Unlike technical threats (where you can invest in prevention), regulatory risk is about compliance discipline: documented controls must match implemented controls. The gap between policy and reality (measured by Resistance Strength) drives all risk. Use these results to justify compliance programs: investing $1M annually in automated compliance monitoring (infrastructure-as-code, continuous scanning, policy-as-code) raises RS from 0.4 to 0.7, cutting LEF by 60%, reducing 90th percentile risk from $30M to $10M — a $20M annual risk reduction for $1M investment. ROI is 20x. The curve also reveals that regulatory risk has binary outcomes: you\'re either compliant (low risk) or non-compliant (catastrophic risk). There\'s no middle ground. This justifies treating compliance as a hard requirement, not a best-effort goal.',
          scenarioContext: 'Your board asked: "Why should we invest $2M in a compliance automation platform when we\'ve never been fined?" You can now answer: "We face 2–20 regulatory audits per year. Current documentation-reality gap (RS=0.2–0.7) results in 0.2–10 audit failures annually. A single GDPR violation costs $200K–$20M in fines plus $300K–$8M in reputation damage and competitive losses, with a 10% chance of exceeding $30M annually. This risk is existential — a $20M fine on $100M revenue is 20% of annual profit. Compliance automation raises RS from 0.4 to 0.8 (closing the documentation-reality gap), cutting our 90th percentile risk from $30M to $5M — a $25M risk reduction for $2M investment. ROI is 12.5x in year one. Additionally, compliance automation enables continuous evidence collection for audits, potentially reducing audit costs by $200K/year. The question isn\'t whether we can afford compliance automation; it\'s whether we can afford the existential risk of a major violation."',
          whyTheseNumbers: 'Regulatory compliance failure illustrates that some risks are not about preventing attacks but about organizational discipline. Unlike ransomware (attackers breach despite your controls) or DDoS (attackers overwhelm your capacity), regulatory violations happen because documented controls don\'t match reality. This is entirely within your control, which is why fines are so severe — regulators view non-compliance as willful negligence. The FAIR model reveals that for regulated industries (healthcare, finance, any EU data processing), regulatory risk often exceeds all technical risks combined. This justifies treating compliance not as overhead but as core risk management. This tutorial teaches the most important lesson in enterprise security: the biggest risks aren\'t always technical. Regulatory penalties for control failures can exceed the cost of the breaches those controls would have prevented. Compliance is not checkbox theater — it\'s quantifiable risk reduction where the avoided loss (regulatory fines) is measurable, predictable, and often exceeds all technical threat losses combined.'
        }
      ]
    }
  ]
};
