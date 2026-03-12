/**
 * External Brute Force Tutorial
 * Beginner difficulty - Introduction to FAIR quantification basics
 */

export default {
  id: 'brute-force',
  title: 'External Brute Force Tutorial',
  subtitle: 'Introduction to FAIR quantification basics',
  difficulty: 'beginner',
  estimatedMinutes: 12,
  scenarioIndex: 1,

  chapters: [
    {
      title: 'Chapter 1: Understanding Frequency',
      steps: [
        {
          factorId: 'lef',
          action: 'focus',
          narrative: 'Let\'s start by understanding Loss Event Frequency (LEF) — the number of times per year that brute force attacks successfully compromise your authentication systems. We\'re estimating between 30 and 120 successful breaches annually. This might seem high, but brute force attacks are automated and relentless.',
          scenarioContext: 'Your organization has 500 user accounts exposed through a web login portal. Automated bots constantly try common username/password combinations.',
          whyTheseNumbers: 'LEF of 30–120/year means multiple successful breaches per month. This reflects weak passwords, no multi-factor authentication, and the sheer volume of automated attacks hitting your login endpoint.'
        },
        {
          factorId: 'tef',
          action: 'expand',
          narrative: 'LEF is calculated from two components: Threat Event Frequency (TEF) and Vulnerability. Let\'s expand LEF to see TEF — how often brute force attempts occur, regardless of whether they succeed.',
          scenarioContext: 'Your web server logs show thousands of failed login attempts daily from distributed IP addresses. Most attempts try common passwords like "password123" or "admin".',
          whyTheseNumbers: null
        },
        {
          factorId: 'cf',
          action: 'focus',
          narrative: 'Contact Frequency (CF) is how often threat actors encounter your login page. For a publicly accessible web portal, we see 200 to 800 malicious contact events per year. This includes credential stuffing, dictionary attacks, and brute force bots.',
          scenarioContext: 'Your login page is indexed by search engines and discoverable via port scans. Attackers continuously probe your authentication endpoint.',
          whyTheseNumbers: 'CF of 200–800/year reflects constant automated scanning. Bots rotate through IP addresses, so each campaign counts as a separate contact event. This is lower than commodity malware (thousands/year) but higher than targeted attacks (1–10/year).',
          experiment: {
            prompt: 'Try increasing Contact Frequency to 500–2000 to simulate a more prominent target. Watch the Median and 90th Percentile — more brute-force attempts means more breaches per year.',
            resetAfter: true
          }
        },
        {
          factorId: 'poa',
          action: 'focus',
          narrative: 'Probability of Action (PoA) measures how often attackers follow through once they\'ve found your login page. For brute force, PoA is 0.7–1.0 (70–100%) because automated tools make acting almost cost-free. If your login endpoint exists, bots will try it.',
          scenarioContext: 'Brute force tools are commoditized. A single script can try millions of password combinations with minimal attacker effort. There\'s no reason for them NOT to act.',
          whyTheseNumbers: 'PoA of 0.7–1.0 reflects automation. Unlike manual attacks requiring human time, bots execute automatically. If a target is discovered, it WILL be attacked.'
        },
        {
          factorId: 'vuln',
          action: 'expand',
          narrative: 'Vulnerability is the probability that an attack succeeds. This depends on the attacker\'s skill versus your defensive strength. Let\'s decompose this into Threat Capability (TCap) and Resistance Strength (RS).',
          scenarioContext: 'Your defenses include password complexity requirements and rate limiting (5 failed attempts = 30-minute lockout). But you don\'t have multi-factor authentication, and users often choose weak passwords.',
          whyTheseNumbers: null
        },
        {
          factorId: 'tcap',
          action: 'focus',
          narrative: 'Threat Capability (TCap) is the attacker\'s skill and resources. Brute force attackers rate 0.7–0.95 on a 0–100 scale. They use precomputed password lists, distributed botnets to bypass rate limiting, and credential databases from prior breaches.',
          scenarioContext: 'Modern brute force tools include rockyou.txt (14 million passwords), breach compilations (billions of email/password pairs), and GPU-accelerated cracking. Attackers are sophisticated and well-equipped.',
          whyTheseNumbers: 'TCap of 0.7–0.95 reflects mature tooling. This isn\'t guessing random strings — it\'s intelligently trying the most common passwords, reused credentials, and patterns first.'
        },
        {
          factorId: 'rs',
          action: 'focus',
          narrative: 'Resistance Strength (RS) is how well your controls hold up. We rate your defenses at 0.3–0.7 on the same 0–100 scale. Rate limiting helps, but without multi-factor authentication or password breach detection, attackers eventually succeed.',
          scenarioContext: 'Your password policy requires 8 characters with at least one number. Rate limiting slows attackers but doesn\'t stop distributed attacks. Users often reuse passwords from breached sites.',
          whyTheseNumbers: 'RS of 0.3–0.7 is realistic for basic controls. Rate limiting raises the cost but doesn\'t eliminate the vulnerability. TCap often exceeds RS in simulations, meaning attackers eventually break through.',
          experiment: {
            prompt: 'Increase Resistance Strength to 0.6–0.9 to model adding multi-factor authentication (MFA). See how vulnerability drops dramatically.',
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
          narrative: 'Now let\'s estimate Loss Magnitude (LM) — the cost when a brute force attack succeeds. We\'re looking at $5K to $48K per breach, driven by incident response, account cleanup, and credential resets.',
          scenarioContext: 'When an account is compromised, you must investigate which data was accessed, reset credentials, notify affected users, and potentially report to regulators if sensitive data was exposed.',
          whyTheseNumbers: 'LM of $5K–$48K reflects small to mid-sized breaches. Lower end: single account, quick containment. Upper end: multiple accounts, data exfiltration, regulatory reporting required.'
        },
        {
          factorId: 'primary',
          action: 'expand',
          narrative: 'Loss Magnitude splits into Primary (direct costs) and Secondary (ripple effects). Primary losses are the immediate, tangible costs: staff time for investigation, password resets, and any account recovery processes.',
          scenarioContext: 'Primary costs include: IT staff investigating logs (10–20 hours), resetting affected accounts, communicating with compromised users, and reviewing what data the attacker accessed.',
          whyTheseNumbers: null
        },
        {
          factorId: 'productivity',
          action: 'focus',
          narrative: 'Productivity loss is work disrupted during the breach response. With account compromise requiring investigation and user notification, we estimate $2K to $15K in lost productivity. IT teams stop planned work to respond, and affected users can\'t access systems during password resets.',
          scenarioContext: 'A brute force breach affecting 5–10 accounts means: 2 IT staff spend a day investigating, 10 users lose half a day waiting for password resets, managers spend time explaining the situation to customers.',
          whyTheseNumbers: 'Productivity of $2K–$15K captures disruption. $2K = minimal (single account, no data access). $15K = broader impact (multiple accounts, sensitive data viewed, customer-facing systems offline).'
        },
        {
          factorId: 'response',
          action: 'focus',
          narrative: 'Response costs cover investigation, containment, and recovery. This includes forensic analysis to determine what the attacker accessed, forced password resets across potentially affected accounts, and communication with users. We estimate $3K to $25K.',
          scenarioContext: 'Response involves: reviewing authentication logs, identifying compromised accounts, forcing password resets, sending notification emails to affected users, and potentially engaging external forensics if data was exfiltrated.',
          whyTheseNumbers: 'Response of $3K–$25K includes internal labor (IT, security, communications teams) and potential external consultants. Lower end: quick containment, no data theft. Upper end: extensive forensics, multi-account compromise, legal review.'
        },
        {
          factorId: 'replacement',
          action: 'focus',
          narrative: 'Replacement costs are for fixing or replacing compromised assets. For brute force breaches, this is usually minimal ($0–$8K) — you\'re resetting credentials, not rebuilding servers. Replacement costs appear when attackers use the breached account to install malware or exfiltrate proprietary data requiring re-encryption.',
          scenarioContext: 'Most brute force breaches don\'t require hardware replacement. But if an attacker installs backdoors or cryptominers after gaining access, you may need to re-image workstations or replace compromised API keys.',
          whyTheseNumbers: 'Replacement of $0–$8K reflects low infrastructure impact. $0 = credential reset only. $8K = re-imaging affected workstations, rotating API keys, replacing certificates if the attacker gained deeper access.'
        }
      ]
    },
    {
      title: 'Chapter 3: Understanding Ripple Effects',
      steps: [
        {
          factorId: 'secondary',
          action: 'expand',
          narrative: 'Primary costs are the immediate response, but Secondary losses — customer reactions, regulatory scrutiny, brand damage — can exceed them. Let\'s decompose Secondary loss into probability (SLEF) and magnitude (SLM).',
          scenarioContext: 'If customer data was accessed or if the breach becomes public, you face notification requirements, customer churn, and potential regulatory fines.',
          whyTheseNumbers: null
        },
        {
          factorId: 'slef',
          action: 'focus',
          narrative: 'Secondary Loss Event Frequency (SLEF) is the probability that a brute force breach triggers secondary consequences like regulatory reporting or customer notifications. We estimate 0.05 to 0.2 (5–20%), reflecting that most brute force breaches are contained before data leaves the organization.',
          scenarioContext: 'Many brute force breaches are caught quickly — attackers log in, look around, log out. Secondary losses occur when attackers exfiltrate customer data, triggering breach notification laws.',
          whyTheseNumbers: 'SLEF of 0.05–0.2 reflects low but non-zero notification risk. Most brute force attacks are opportunistic reconnaissance. The 5–20% accounts for cases where attackers actually steal data before detection.'
        },
        {
          factorId: 'slm',
          action: 'expand',
          narrative: 'Secondary Loss Magnitude (SLM) quantifies the long-term damage. We estimate $0 to $40K, driven by regulatory fines for breach notification failures, customer churn if breach is publicized, and reputational damage. Let\'s break it down.',
          scenarioContext: 'If attackers access customer PII (emails, addresses, payment data), you must notify affected customers and may face state or federal fines for inadequate security controls.',
          whyTheseNumbers: null
        },
        {
          factorId: 'fines',
          action: 'focus',
          narrative: 'Regulatory fines for brute force breaches depend on whether personal data was accessed and whether you had reasonable security controls. For a small breach with prompt notification, fines are typically $0. But if regulators find you ignored basic security (no MFA, weak passwords), fines can reach $20K under state breach notification laws.',
          scenarioContext: 'Your login portal handles customer accounts with names, emails, and order histories. If brute force leads to data access and you lacked MFA, regulators may impose penalties.',
          whyTheseNumbers: 'Fines of $0–$20K reflect enforcement variability. Most small brute force breaches result in no fines if you notify promptly. The $20K upper bound reflects state attorney general actions for negligent security practices.'
        },
        {
          factorId: 'reputation',
          action: 'focus',
          narrative: 'Reputation damage is the hardest to quantify but can be significant. Customer churn, loss of trust, and negative publicity cost $0 to $20K over the following year for small brute force breaches.',
          scenarioContext: 'If news spreads that customer accounts were compromised, some customers may close accounts or delay purchases. B2B customers may ask for security audits before renewing contracts.',
          whyTheseNumbers: 'Reputation of $0–$20K models modest customer churn (2–5% of affected customers leave) and increased sales friction (security questionnaires, delayed renewals). This is lower than ransomware because brute force breaches are common and often perceived as less severe.'
        },
        {
          factorId: 'competitive',
          action: 'focus',
          narrative: 'Competitive advantage loss occurs when attackers steal proprietary data — customer lists, pricing strategies, product roadmaps. For typical brute force breaches targeting consumer accounts, competitive loss is minimal ($0–$20K). Most attackers are after credentials for resale, not corporate secrets.',
          scenarioContext: 'If your login portal only provides access to customer order histories and account settings, there\'s little competitive intelligence to steal. Competitive loss becomes significant only if admin accounts with access to business-critical data are compromised.',
          whyTheseNumbers: 'Competitive of $0–$20K reflects low strategic impact. Brute force attacks typically target consumer accounts, not executive or administrator accounts with access to sensitive business data. The upper bound accounts for rare cases where an admin account is compromised.',
          experiment: {
            prompt: 'Increase Competitive loss to $5K–$50K to model a scenario where admin accounts with pricing data were compromised. See how secondary losses grow.',
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
          narrative: 'You\'ve estimated every factor. Now examine the results. The Loss Exceedance Curve shows your risk distribution. The 90th percentile — the loss you\'ll exceed 10% of the time — is your planning number. For brute force attacks, this is often $15K–$60K annually. The breakdown shows Primary losses (response labor, productivity) dominate Secondary losses (fines, reputation). This is typical for brute force: the attack is cheap to execute, so it happens frequently, but each breach is relatively low-cost to remediate. Use these results to justify controls: adding multi-factor authentication (raising Resistance Strength) could cut your annual risk by 70%. The curve also reveals frequency matters: reducing Contact Frequency through IP-based blocking has less impact than improving Resistance Strength, because attackers will rotate IPs. This is FAIR in action: decomposing "How bad is brute force risk?" into specific, estimable factors, revealing where controls provide the most risk reduction per dollar spent.',
          scenarioContext: 'Your CFO asked: "Should we invest $10K in MFA?" You can now answer: "We face 30–120 brute force breaches per year, costing $5K–$48K each, with a 10% chance of exceeding $50K annually. MFA raises Resistance Strength from 0.3–0.7 to 0.6–0.9, cutting our 90th percentile risk from $50K to $15K — a $35K annual reduction for a one-time $10K investment. ROI is positive in 4 months."',
          whyTheseNumbers: 'This tutorial demonstrates foundational FAIR concepts: LEF × LM = Risk, TCap vs RS determines Vulnerability, and Primary vs Secondary losses help prioritize controls. Brute force is an ideal beginner scenario because the attack is easy to understand (automated password guessing) and the controls are concrete (MFA, rate limiting, password policies).'
        }
      ]
    }
  ]
};
