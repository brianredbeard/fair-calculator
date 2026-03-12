/**
 * Insider Data Exfiltration Tutorial
 * Intermediate difficulty - Understanding high-impact insider risks
 */

export default {
  id: 'insider-threat',
  title: 'Insider Data Exfiltration Tutorial',
  subtitle: 'Understanding high-impact insider risks',
  difficulty: 'intermediate',
  estimatedMinutes: 15,
  scenarioIndex: 5,

  chapters: [
    {
      title: 'Chapter 1: Understanding Frequency',
      steps: [
        {
          factorId: 'lef',
          action: 'focus',
          narrative: 'Loss Event Frequency (LEF) for insider data exfiltration represents successful theft of sensitive data by employees or contractors per year. We estimate 0.5 to 14 incidents annually. This is much lower than external threats (brute force LEF=30–120, phishing LEF=10–1500) because insiders are few in number, but each incident is catastrophic.',
          scenarioContext: 'Your organization has 500 employees with varying access levels. 50 employees (engineers, finance, HR) have access to sensitive data: source code, customer databases, financial records. Insider theft occurs when a trusted employee exfiltrates this data before leaving for a competitor or selling it for profit.',
          whyTheseNumbers: 'LEF of 0.5–14/year means one incident every month to two years. This reflects that most employees are trustworthy (PoA is low), but those who do act have legitimate access (Vulnerability is high). Unlike external attackers who must breach perimeter defenses, insiders are already inside.'
        },
        {
          factorId: 'tef',
          action: 'expand',
          narrative: 'LEF decomposes into Threat Event Frequency (TEF) and Vulnerability. Let\'s expand to see TEF — how often insiders are in a position to exfiltrate data (opportunities for theft), whether or not they act on it.',
          scenarioContext: 'TEF includes: employees with data access who are leaving the company (voluntarily or involuntarily), employees approached by competitors or foreign governments offering money for data, financially distressed employees tempted to sell data, and disgruntled employees seeking revenge.',
          whyTheseNumbers: null
        },
        {
          factorId: 'cf',
          action: 'focus',
          narrative: 'Contact Frequency (CF) represents situations where insiders have both motive and opportunity to exfiltrate data. We estimate 5 to 24 events per year. This includes employees leaving for competitors (12–20/year), employees in financial distress (2–8/year), and employees who become disgruntled (1–5/year). These are "contact" events where the insider could act.',
          scenarioContext: 'CF events: senior engineer gives two-week notice, has access to source code repository (Contact). Sales director with customer database gets recruited by competitor (Contact). Finance manager facing personal bankruptcy has access to M&A plans (Contact). Security analyst with admin access gets passed over for promotion and becomes disgruntled (Contact).',
          whyTheseNumbers: 'CF of 5–24/year reflects normal employee lifecycle. In a 500-person organization, 10–15% annual turnover = 50–75 departures. Of those, 10–30 have access to sensitive data. Most leave on good terms, but 5–24/year leave under circumstances that create exfiltration risk (competitive job, financial distress, dissatisfaction).',
          experiment: {
            prompt: 'Try doubling Contact Frequency to 10–48 to model higher turnover or more permissive data access. Watch the Median and 90th Percentile — risk scales with the number of trusted insiders who have opportunity.',
            resetAfter: true
          }
        },
        {
          factorId: 'poa',
          action: 'focus',
          narrative: 'Probability of Action (PoA) is the likelihood that an insider with motive and opportunity actually exfiltrates data. We estimate 0.1–0.6 (10–60%), much higher than phishing (1–10%) but lower than brute force automation (70–100%). PoA reflects that most people are ethical and fear consequences, but some are willing to steal if they believe they won\'t be caught.',
          scenarioContext: 'PoA drivers: employee leaving for non-competitor role (PoA≈10%, low motive). Employee joining direct competitor (PoA≈30%, temptation to bring customer list or code samples). Employee approached by foreign government offering $50K for source code (PoA≈40%, financial incentive). Disgruntled employee with admin access seeking revenge (PoA≈60%, emotional motivation).',
          whyTheseNumbers: 'PoA of 0.1–0.6 reflects human psychology. Unlike external attackers (who have zero relationship with the victim), insiders have employment history, personal relationships, and fear of prosecution. But financial pressure, competitive opportunity, or anger can override ethics. The wide range reflects uncertainty in individual decision-making.'
        },
        {
          factorId: 'vuln',
          action: 'expand',
          narrative: 'Vulnerability is the probability that an insider attempting to exfiltrate data succeeds without detection. This depends on Threat Capability (insider\'s access level and technical skill) versus Resistance Strength (your Data Loss Prevention tools, access logging, behavioral analytics). Let\'s decompose it.',
          scenarioContext: 'Your defenses include: Data Loss Prevention (DLP) monitoring file transfers and email attachments, access logs recording database queries, USB port blocking, and background checks during hiring. But insiders have legitimate reasons to access data, making detection difficult.',
          whyTheseNumbers: null
        },
        {
          factorId: 'tcap',
          action: 'focus',
          narrative: 'Threat Capability (TCap) for insiders is 0.7–0.95 on a 0–100 scale, much higher than external attackers. Insiders know what data is valuable, where it\'s stored, and how to access it. They have legitimate credentials, so they don\'t trigger intrusion detection. They understand monitoring systems and can evade them. A senior engineer can exfiltrate source code in ways that look like normal work.',
          scenarioContext: 'Insider advantages: legitimate database credentials (no hacking required), knowledge of data location ("customer emails are in the CRM, financial projections in this SharePoint folder"), understanding of security controls ("DLP flags .zip files but not Git repos"), and ability to time exfiltration when monitoring is light (evenings, weekends).',
          whyTheseNumbers: 'TCap of 0.7–0.95 reflects that insiders bypass most security controls designed for external threats. Firewalls, VPNs, and authentication don\'t help when the attacker has valid credentials. Only data-centric controls (DLP, access analytics) defend against insiders, and these are incomplete.'
        },
        {
          factorId: 'rs',
          action: 'focus',
          narrative: 'Resistance Strength (RS) against insiders is your ability to detect and prevent data exfiltration by authorized users. We rate your defenses at 0.4–0.8 on a 0–100 scale. DLP catches obvious exfiltration (emailing customer database to personal email), but insiders evade detection by using approved channels (Git commits, encrypted cloud storage, printing to PDF, photographing screens).',
          scenarioContext: 'Your controls: DLP monitors email and cloud uploads, blocks USB drives, logs database queries. But gaps exist: engineers can commit code to personal GitHub repos (looks legitimate), sales can export CRM data to CSV for "quarterly reports" (authorized action), finance can screenshot sensitive documents (undetectable by DLP).',
          whyTheseNumbers: 'RS of 0.4–0.8 reflects partial visibility. You can block blatant exfiltration but sophisticated insiders find workarounds. The wide range represents uncertainty in how clever the insider is. RS=0.4 assumes the insider knows your controls and evades them. RS=0.8 assumes they panic and use obvious methods (email to personal account) that DLP catches.',
          experiment: {
            prompt: 'Increase Resistance Strength to 0.7–0.95 to model implementing User and Entity Behavior Analytics (UEBA) that flags abnormal data access. See how detection improves but never reaches 100%.',
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
          narrative: 'Loss Magnitude (LM) for insider data exfiltration is $200K to $3M per incident, driven by forensic investigation, legal proceedings, data remediation, and potential regulatory fines. This exceeds most external threats except ransomware ($1M–$8M) because insider cases involve criminal investigation, lawsuits, and extensive damage control.',
          scenarioContext: 'When an insider exfiltrates customer data or source code, you must: conduct forensic investigation to determine what was taken, engage legal counsel for potential prosecution, notify affected customers if PII was stolen, implement emergency access revocations, and possibly pursue civil litigation to prevent data use.',
          whyTheseNumbers: 'LM of $200K–$3M reflects legal complexity. Lower end: junior employee downloaded customer list, quick investigation, no prosecution, minimal notification. Upper end: senior engineer exfiltrated entire source code repository to competitor, 6-month FBI investigation, trade secret lawsuit, customer breach notifications, regulatory fines.'
        },
        {
          factorId: 'primary',
          action: 'expand',
          narrative: 'Primary losses include lost productivity (team disruption during investigation), response costs (forensics, legal, law enforcement coordination), and replacement costs (rotating credentials, changing affected systems to invalidate stolen data). For insider threats, Response costs dominate because investigations are labor-intensive.',
          scenarioContext: 'Primary costs: forensic investigation to trace data access ($50K–$300K), legal counsel for criminal and civil proceedings ($50K–$500K), law enforcement coordination (FBI, state AG), emergency credential rotation, and team productivity loss during investigation (interviews, access restrictions).',
          whyTheseNumbers: null
        },
        {
          factorId: 'productivity',
          action: 'focus',
          narrative: 'Productivity loss during insider investigations is $50K to $1M. The entire team with access to stolen data must be interviewed, access logs audited, and systems locked down. Engineering teams lose weeks to forensics rather than product development. HR and legal teams dedicate full-time effort to the case for months.',
          scenarioContext: 'Productivity impact: 20 engineers interviewed (2 hours each, $10K), 5 engineers pulled off projects to review code commits for data exfiltration ($50K over 2 weeks), IT team auditing access logs (40 hours/week for a month, $50K), management time coordinating response (100 hours, $50K). Upper bound: 6-month investigation affecting entire engineering department ($500K–$1M).',
          whyTheseNumbers: 'Productivity of $50K–$1M reflects investigation scope. Lower end: isolated incident, limited employee interviews, quick resolution. Upper end: systemic exfiltration discovered, entire department under suspicion, months of forensic review, product roadmap delayed. Unlike external attacks (where response is contained), insider cases create lasting organizational disruption.'
        },
        {
          factorId: 'response',
          action: 'focus',
          narrative: 'Response costs for insider threats are $100K to $1.5M, the highest response cost of any common threat. This includes forensic analysis (tracing data access across systems), legal counsel (criminal referral, civil litigation), law enforcement cooperation (FBI, state authorities), and potential private investigators. Insider cases often take 6–12 months to resolve.',
          scenarioContext: 'Response involves: digital forensics firm analyzing logs and devices ($50K–$300K), law firm handling criminal referral and trade secret protection ($100K–$500K for multi-month case), outside counsel for employee termination ($20K–$50K), crisis PR firm if breach becomes public ($30K–$100K), and potential settlement costs to prevent competitor from using stolen data ($100K–$500K).',
          whyTheseNumbers: 'Response of $100K–$1.5M reflects legal complexity and duration. Insider cases aren\'t just technical incidents — they\'re criminal investigations and civil litigation. Lower end: employee caught quickly via DLP, confesses, limited legal action. Upper end: sophisticated exfiltration, criminal trial, civil lawsuit against new employer, 18-month legal battle, settlement or judgment.'
        },
        {
          factorId: 'replacement',
          action: 'focus',
          narrative: 'Replacement costs are $50K to $500K, covering emergency credential rotation, system hardening, and data invalidation strategies. Unlike ransomware (rebuild infrastructure) or laptop theft (buy new device), insider theft requires making stolen data obsolete: rotate API keys, change database schemas, invalidate credentials, and potentially redesign stolen features.',
          scenarioContext: 'Replacement actions: rotate all credentials the insider had access to (database passwords, API keys, SSH keys, $10K–$50K labor), change authentication systems to invalidate stolen credentials ($20K–$100K), potentially redesign stolen source code features to prevent competitor from using them ($50K–$300K), and implement enhanced access controls ($20K–$100K).',
          whyTheseNumbers: 'Replacement of $50K–$500K depends on data stolen. Customer list exfiltration: rotate CRM access, implement field-level encryption ($50K–$100K). Source code theft: consider redesigning stolen modules, changing APIs to break compatibility, implementing code obfuscation ($200K–$500K). The goal is reducing the value of stolen data.'
        }
      ]
    },
    {
      title: 'Chapter 3: Understanding Ripple Effects',
      steps: [
        {
          factorId: 'secondary',
          action: 'expand',
          narrative: 'Secondary losses for insider threats are massive, often exceeding Primary losses. Unlike external attacks (where attackers are anonymous), insider cases involve trusted employees, creating deep reputational damage ("Who else might be stealing data?"). SLEF is 70–100% because investigations almost always become known (law enforcement, lawsuits, customer notifications). Let\'s decompose into SLEF and SLM.',
          scenarioContext: 'Insider cases rarely stay confidential. Criminal referrals create public records. Civil lawsuits require filings. If customer PII was stolen, breach notification laws mandate disclosure. Media coverage follows because "insider betrayal" is newsworthy. Customers, investors, and employees all learn about the incident.',
          whyTheseNumbers: null
        },
        {
          factorId: 'slef',
          action: 'focus',
          narrative: 'Secondary Loss Event Frequency (SLEF) for insider threats is 0.7–1.0 (70–100%), the highest SLEF of any common threat. This reflects that insider cases almost always trigger public consequences: criminal charges (public records), civil lawsuits (court filings), breach notifications (regulatory requirement), and media coverage (newsworthy story). Confidentiality is nearly impossible.',
          scenarioContext: 'Why SLEF is so high: FBI involvement creates public records searchable by journalists. Trade secret lawsuits against the new employer are public court cases. If customer PII was stolen, you must notify customers under breach laws (creating public knowledge). Employees gossip internally and externally. Confidential resolution is rare.',
          whyTheseNumbers: 'SLEF of 0.7–1.0 reflects unavoidable disclosure. Unlike phishing (SLEF=1–10%, most incidents stay internal) or S3 misconfig (SLEF=10–40%, depends on data type), insider cases involve law enforcement and legal proceedings that create public records. The only scenario with SLEF<70% is when you discover attempted exfiltration and fire the employee quietly before they succeed.'
        },
        {
          factorId: 'slm',
          action: 'expand',
          narrative: 'Secondary Loss Magnitude (SLM) for insider threats is $500K to $20M, driven by catastrophic reputation damage, regulatory fines for inadequate data protection, and competitive losses when trade secrets are stolen. This is the highest SLM of any common threat, approaching or exceeding ransomware\'s secondary losses ($1M–$15M). Let\'s break it down.',
          scenarioContext: 'Insider exfiltration suggests systemic security failures to customers and regulators. "If an employee could steal our data, how is our own data protected?" Customers delay purchases pending security audits. Regulators investigate your access controls. Competitors hire your employees for insider knowledge, knowing you can\'t stop it.',
          whyTheseNumbers: null
        },
        {
          factorId: 'fines',
          action: 'focus',
          narrative: 'Regulatory fines for insider data theft are $100K to $5M, appearing when stolen data includes customer PII and regulators find inadequate access controls. Under GDPR, HIPAA, or state laws, you must demonstrate "reasonable safeguards." If an employee downloaded 100,000 customer records without detection, regulators view that as negligent data protection deserving penalties.',
          scenarioContext: 'Fines occur when: (1) PII was stolen, (2) you lacked DLP or access monitoring, (3) the employee had excessive privileges (violates least-privilege principle), or (4) you didn\'t detect the theft for months. Regulators see insider threats as preventable through proper access controls, so failure to prevent them is negligence.',
          whyTheseNumbers: 'Fines of $100K–$5M reflect regulatory view that insider risks are controllable. Lower end: small-scale theft (1,000 records), you had some controls (DLP), regulators issue warning + $100K fine. Upper end: massive exfiltration (100,000 records), no DLP, employee had God-mode access, discovered only when competitor launched copied product — regulators impose $5M penalty for gross negligence.'
        },
        {
          factorId: 'reputation',
          action: 'focus',
          narrative: 'Reputation damage from insider threats is $200K to $10M, the highest reputation loss of any common threat. Insider cases create lasting brand damage because they suggest organizational dysfunction: "They can\'t even trust their own employees. How can we trust them with our data?" Customer churn, delayed sales cycles, and talent flight compound for years.',
          scenarioContext: 'Reputation pathways: customers question your security posture, requesting expensive audits before renewing ($200K–$1M in delayed deals). Prospective employees avoid you ("that company where an engineer stole the code"), increasing hiring costs ($500K–$2M over 2 years in higher salaries/recruiters). Investors devalue the company if stolen IP was core competitive advantage ($5M–$10M in valuation loss).',
          whyTheseNumbers: 'Reputation of $200K–$10M models trust erosion. Lower end: junior employee stole non-critical data, quickly contained, minimal publicity ($200K in customer audit costs). Upper end: senior engineer stole core IP, joined competitor, launched competing product, media coverage ("Startup X built on stolen code"), 20–30% customer churn, 50% increase in customer acquisition cost, talent exodus ($5M–$10M). Compare to ransomware (Reputation=$500K–$8M) — similar scale because both suggest systemic failure.'
        },
        {
          factorId: 'competitive',
          action: 'focus',
          narrative: 'Competitive advantage loss from insider theft is $200K to $5M, occurring when stolen data includes trade secrets, source code, customer lists, or strategic plans. If a competitor hires your engineer and launches a suspiciously similar product 6 months later, you\'ve lost years of R&D advantage. This is the most direct competitive damage of any threat.',
          scenarioContext: 'Competitive loss mechanisms: Engineer exfiltrates proprietary algorithm, joins competitor, competitor launches competing feature in 6 months instead of 2 years (you\'ve lost 18-month head start = $1M–$3M R&D wasted). Sales director takes customer database to competitor, they target your best accounts with inside knowledge of pricing and pain points ($500K–$2M in lost deals). CFO joins competitor with M&A plans, they outbid you ($2M–$5M deal lost).',
          whyTheseNumbers: 'Competitive of $200K–$5M reflects stolen competitive intelligence. Lower end: customer list stolen, competitor markets to your clients, 5–10% churn ($200K–$500K). Upper end: core IP stolen, competitor launches knock-off product, you lose market leadership, forced to compete on price instead of innovation ($2M–$5M in lost revenue over 2 years). This is higher than ransomware Competitive ($300K–$4M) because insider theft specifically targets valuable secrets.',
          experiment: {
            prompt: 'Increase Competitive loss to $1M–$20M to model theft of core IP by a founding engineer who starts a direct competitor. See how insider threats can threaten company survival.',
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
          narrative: 'You\'ve estimated all factors. Examine the results. The Loss Exceedance Curve shows your risk distribution. The 90th percentile is typically $2M–$25M annually for insider data exfiltration risk. Notice the unique profile: Secondary losses (Fines + Reputation + Competitive = $500K–$20M) often exceed Primary losses ($200K–$3M). This is similar to ransomware, where the attack cost is less than the aftermath. The breakdown reveals insider threats as the highest-consequence internal risk because they combine access (insiders bypass perimeter defenses) with intent (deliberate theft, not accidental exposure). Compare control strategies: external threats (firewalls, authentication) vs. insider threats (DLP, access analytics, least privilege, separation of duties). Use these results to justify data-centric security: implementing DLP and UEBA raises RS from 0.6 to 0.8, cutting LEF by 50%, reducing annual risk from $15M to $7M — a $8M risk reduction for $500K investment in tools and processes. The curve also reveals that insider risk is driven by Secondary losses, meaning the most valuable controls are those that reduce SLEF (make incidents less likely to become public) and SLM (reduce damage when they do). This justifies: strict access controls (least privilege, need-to-know), monitoring (DLP, access analytics), legal preparedness (NDAs, non-competes, trade secret protection), and rapid detection (reduces time insider has access to data).',
          scenarioContext: 'Your CISO asked: "Should we invest $300K in User and Entity Behavior Analytics (UEBA) to detect anomalous data access?" You can now answer: "We face 5–24 insider exfiltration opportunities per year. Current defenses (RS=0.4–0.8) result in 0.5–14 successful thefts annually, costing $200K–$3M in Primary losses plus $500K–$20M in Secondary losses (reputation, competitive damage, fines), with a 10% chance of exceeding $20M annually. UEBA raises RS from 0.6 to 0.75, cutting successful thefts by 30%, reducing our 90th percentile risk from $20M to $12M — a $8M annual reduction for $300K investment plus $50K annual operational cost. ROI is 23x in year one, 16x ongoing. The protection is most valuable for high-value employees (senior engineers, executives) with access to trade secrets."',
          whyTheseNumbers: 'Insider threats illustrate that security is not just perimeter defense — it\'s data-centric. Unlike external threats (where you can block IP addresses, require MFA, segment networks), insiders have legitimate access. Your only defenses are: limiting access (least privilege), monitoring access (DLP, UEBA), and detecting anomalies (behavioral analytics). The FAIR model reveals that for organizations with high-value IP or customer data, the cost of insider theft (especially Secondary losses: reputation, competitive damage) far exceeds the cost of prevention. This tutorial teaches that trust is not a security control — even trusted insiders need monitoring, access limits, and deterrents (NDAs, non-competes, prosecution). The hardest security problem is not keeping adversaries out; it\'s preventing trusted insiders from stealing on their way out.'
        }
      ]
    }
  ]
};
