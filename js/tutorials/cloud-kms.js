/**
 * Cloud KMS Compromise Tutorial
 * Advanced difficulty - Understanding catastrophic tail risks
 */

export default {
  id: 'cloud-kms',
  title: 'Cloud KMS Compromise Tutorial',
  subtitle: 'Understanding catastrophic tail risks',
  difficulty: 'advanced',
  estimatedMinutes: 20,
  scenarioIndex: 13,

  chapters: [
    {
      title: 'Chapter 1: Understanding Frequency',
      steps: [
        {
          factorId: 'lef',
          action: 'focus',
          narrative: 'Loss Event Frequency (LEF) for cloud Key Management Service (KMS) compromise represents successful theft or unauthorized access to your master encryption keys per year. We estimate 0.3 to 5 incidents annually. This is the lowest LEF of any threat we\'ve analyzed — KMS compromise is extremely rare. But when it happens, consequences are extinction-level: all encrypted data (customer PII, financial records, backups) becomes readable. This is catastrophic tail risk: low probability, infinite impact.',
          scenarioContext: 'Your organization uses AWS KMS to encrypt 5 million customer records, all payment data, all database backups, and all internal documents. The KMS master keys protect the data encryption keys. If an attacker gains access to KMS (via compromised AWS credentials, insider access, or AWS itself being breached), they can decrypt everything. This is a single point of cryptographic failure.',
          whyTheseNumbers: 'LEF of 0.3–5/year combines extremely low Contact Frequency (CF=0.5–5, very few attackers target KMS) with very high Probability of Action (PoA=0.6–1.0, attackers who find KMS access WILL exploit it) and mixed Vulnerability (RS=0.6–0.95, good controls but not perfect). The result: rare but not impossible. One incident every few years to several per year depending on your security posture.'
        },
        {
          factorId: 'tef',
          action: 'expand',
          narrative: 'LEF decomposes into Threat Event Frequency (TEF) and Vulnerability. Let\'s expand to see TEF — how often attackers are in a position to access your KMS, whether or not they succeed in exploiting it.',
          scenarioContext: 'TEF includes: attackers gaining AWS root account credentials (via phishing, stolen tokens, insider access), AWS insider threats (rogue employees), nation-state attacks on AWS infrastructure itself, supply chain attacks on AWS KMS software, or misconfigurations exposing KMS API access.',
          whyTheseNumbers: null
        },
        {
          factorId: 'cf',
          action: 'focus',
          narrative: 'Contact Frequency (CF) represents how often attackers are positioned to access KMS — having credentials or access that could potentially reach KMS APIs. We estimate 0.5 to 5 events per year. This is the lowest CF of any threat (ransomware CF=5–50, DDoS CF=50–500) because KMS is not directly exposed: attackers must first compromise AWS IAM, which requires compromising your organization, then escalating to KMS permissions.',
          scenarioContext: 'CF events: phishing attack steals AWS credentials of engineer with IAM permissions that could be escalated to KMS access (0.5–2/year). Insider threat: AWS employee with infrastructure access (0.1–0.5/year). Nation-state attack on AWS KMS service itself (0.01–0.1/year, theoretical). Misconfiguration: IAM role with overly broad KMS permissions accessible via SSRF vulnerability (0.5–1/year). Stolen root account credentials (0.5–1/year).',
          whyTheseNumbers: 'CF of 0.5–5/year reflects deep defense: attackers must breach your organization AND escalate to AWS admin AND target KMS (not just any AWS resource). This is much rarer than surface-level attacks. It\'s higher than zero because credential theft happens, privilege escalation happens, and determined attackers (APTs, nation-states) specifically target encryption keys.',
          experiment: {
            prompt: 'Try reducing Contact Frequency to 0.1–1 to model strict IAM least-privilege and hardware MFA for all AWS access. Watch the Median and 90th Percentile — reducing the attack surface dramatically lowers loss.',
            resetAfter: true
          }
        },
        {
          factorId: 'poa',
          action: 'focus',
          narrative: 'Probability of Action (PoA) for KMS access is 0.6–1.0 (60–100%), the highest PoA we\'ve seen except for automated attacks (DDoS=80–100%). This reflects that attackers who reach KMS access are highly sophisticated (they\'ve already breached deep defenses) and KMS is a high-value target. If you\'ve compromised AWS admin credentials, accessing KMS to decrypt all data is the obvious next step. PoA is near-certain.',
          scenarioContext: 'PoA scenarios: Opportunistic attacker steals AWS credentials, explores permissions, finds KMS access, may or may not exploit it immediately (PoA≈60%). APT specifically targeting your organization to steal customer data, reaches AWS admin, immediately pivots to KMS to decrypt databases (PoA≈100%). Nation-state actor targeting encryption keys as strategic intelligence, KMS is primary objective (PoA=100%). Insider threat stealing data for sale, KMS access enables mass exfiltration (PoA≈90%).',
          whyTheseNumbers: 'PoA of 0.6–1.0 reflects attacker sophistication. By the time someone has AWS admin access, they\'re not a script kiddie — they\'re a skilled attacker or malicious insider with specific goals. KMS is the "crown jewels" for data theft. Unlike brute force (where attackers try millions of random targets), KMS attackers are few but highly motivated. If they\'ve gotten this far, they will act.'
        },
        {
          factorId: 'vuln',
          action: 'expand',
          narrative: 'Vulnerability is the probability that an attacker with AWS admin access can successfully use KMS to decrypt your data. This depends on Threat Capability (attacker skill at using KMS APIs and evading detection) versus Resistance Strength (your IAM policies, KMS key policies, CloudTrail monitoring, and key rotation). Let\'s decompose it.',
          scenarioContext: 'Your defenses: IAM least-privilege (only 3 roles have KMS decrypt permissions), KMS key policies restricting usage to specific services, CloudTrail logging all KMS API calls with real-time alerting, automatic key rotation every 90 days, and multi-region key replication. But if an attacker has root account access, many of these controls can be bypassed.',
          whyTheseNumbers: null
        },
        {
          factorId: 'tcap',
          action: 'focus',
          narrative: 'Threat Capability (TCap) for KMS exploitation is 0.8–1.0 on a 0–100 scale, the highest TCap of any threat. Attackers who reach KMS access are APT groups, nation-states, or malicious insiders with deep technical skill. They understand cloud IAM, encryption key hierarchies, and how to use KMS APIs to decrypt data. They also know how to evade detection (delete CloudTrail logs, create backdoor IAM roles, exfiltrate data slowly to avoid rate-limit alarms).',
          scenarioContext: 'TCap factors: APT group has custom tooling for AWS credential theft, privilege escalation, and KMS exploitation (TCap=0.95). Nation-state actor has zero-day exploits for AWS services, can compromise KMS without triggering alarms (TCap=1.0). Malicious AWS insider with legitimate KMS access, knows exactly how to use it (TCap=1.0). Even "lower" TCap (0.8) represents skilled attackers, not amateurs — KMS isn\'t a target for script kiddies.',
          whyTheseNumbers: 'TCap of 0.8–1.0 reflects that KMS attackers are the most sophisticated adversaries. Unlike phishing (TCap=0.6–0.95, wide skill range) or brute force (TCap=0.7–0.95, commodity tools), KMS exploitation requires: (1) compromise of deep AWS access, (2) understanding of encryption key hierarchies, (3) ability to evade sophisticated monitoring. Only APTs, nation-states, and highly skilled insiders operate at this level. There are no low-TCap KMS attacks.'
        },
        {
          factorId: 'rs',
          action: 'focus',
          narrative: 'Resistance Strength (RS) for KMS protection is 0.6–0.95 on a 0–100 scale, the highest RS we\'ve modeled for any threat. Your controls are extensive: IAM least-privilege, KMS key policies, CloudTrail monitoring, automatic rotation, multi-region redundancy, and hardware security module (HSM) backing. But RS can never reach 1.0 because root account access or AWS insider threat can bypass most controls. Perfect security is impossible.',
          scenarioContext: 'Your RS components: IAM least-privilege (only 3 roles have KMS permissions, RS contribution=0.3), CloudTrail real-time monitoring with automated response (RS=0.2), KMS key policies preventing cross-account access (RS=0.2), automatic key rotation invalidating stolen keys every 90 days (RS=0.15), HSM-backed keys resistant to extraction (RS=0.1). Total RS=0.6–0.95 depending on attacker\'s path.',
          whyTheseNumbers: 'RS of 0.6–0.95 reflects best-practice cloud security but acknowledges irreducible risk. Lower end (RS=0.6): attacker has root account access or is AWS insider, can bypass many controls. Upper end (RS=0.95): attacker has limited IAM permissions, multiple layers detect and block them. RS can never be 1.0 because: (1) root account access exists (break-glass for emergencies), (2) AWS insiders exist (human factor), (3) zero-day vulnerabilities in AWS services are possible. The question is not "can we make KMS unbreakable" but "can we make compromise unlikely enough."',
          experiment: {
            prompt: 'Increase Resistance Strength to 0.8–0.99 to model implementing AWS Key Management Service with customer-managed HSMs (CloudHSM) where you control the master key material. See how reducing trust in AWS lowers vulnerability.',
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
          narrative: 'Loss Magnitude (LM) for KMS compromise is $2.5M to $40M per incident, the highest LM of any analyzed threat. This exceeds ransomware ($1M–$8M), regulatory violations ($300K–$30M in extreme cases), and insider threats ($200K–$3M). Primary losses alone ($2.5M–$40M) are catastrophic before considering Secondary. KMS compromise is an extinction-level event for most organizations: all encrypted data is exposed, all customer trust is destroyed, regulatory fines are maximal, competitive advantage is eliminated.',
          scenarioContext: 'When an attacker gains KMS access and decrypts your 5 million customer records, you face: immediate incident response mobilizing 50+ people for 6 months ($2M–$10M), complete infrastructure rebuild with new encryption keys ($1M–$10M), regulatory fines under GDPR/HIPAA for exposing all customer PII ($1M–$60M), customer exodus (30–50% churn = $2M–$30M), and competitors acquiring your entire customer database and strategic data ($2M–$10M). Total losses can exceed annual revenue.',
          whyTheseNumbers: 'LM of $2.5M–$40M reflects total cryptographic failure. Lower end: limited KMS access (attacker decrypted subset of data), quick detection and re-encryption, minimal customer impact. Upper end: full KMS compromise (all data decrypted and exfiltrated), months before detection, all customers notified, max regulatory fines, existential business threat. Compare to ransomware (LM=$1M–$8M, you can restore from backups) — KMS compromise means backups are also encrypted with compromised keys, useless for recovery.'
        },
        {
          factorId: 'primary',
          action: 'expand',
          narrative: 'Primary losses for KMS compromise are astronomical: Productivity ($500K–$10M, entire organization responding for months), Response ($1M–$20M, forensics, legal, re-keying infrastructure), and Replacement ($1M–$10M, rebuilding cryptographic infrastructure with new keys). Unlike other threats where Primary is contained, KMS compromise requires organizational-scale response lasting 6–18 months.',
          scenarioContext: 'Primary costs: 50-person incident response team (security, engineering, legal, PR) working 60-hour weeks for 6 months ($3M–$8M in salary + opportunity cost). External forensics, cryptography consultants, legal counsel ($1M–$5M). Complete re-keying: rotate all encryption keys, re-encrypt all databases, regenerate all certificates, rebuild all encrypted backups with new keys ($2M–$10M infrastructure + labor). Test all applications after re-keying ($500K–$2M).',
          whyTheseNumbers: null
        },
        {
          factorId: 'productivity',
          action: 'focus',
          narrative: 'Productivity loss during KMS compromise response is $500K to $10M. This is not "one team working on an incident" — it\'s organizational paralysis. Every team that uses encrypted data (which is everyone) must participate in impact assessment, re-keying, and validation. Product development stops for months. Customer support is overwhelmed. Sales stalls as prospects question your security.',
          scenarioContext: 'Productivity impact: Engineering (100 people) stops all feature work for 3 months to re-key systems and validate ($5M in delayed product roadmap). Customer support (20 people) handles breach notification calls full-time for 2 months ($200K). Sales team (30 people) faces 50% productivity loss for 6 months as prospects defer decisions pending security review ($3M in delayed revenue). Executive team dedicates 50% of time to crisis management for 6 months ($500K opportunity cost).',
          whyTheseNumbers: 'Productivity of $500K–$10M reflects organizational-scale disruption. Lower end: limited KMS access, fast detection and remediation, minimal business impact. Upper end: total KMS compromise, 6–12 month recovery, product roadmap delayed 1–2 years, revenue growth stalls. Unlike DDoS (Productivity=$10K–$200K, one-time outage) or ransomware (Productivity=$500K–$3M, restore and resume), KMS requires complete cryptographic rebuild touching every system. The organization doesn\'t recover for a year.'
        },
        {
          factorId: 'response',
          action: 'focus',
          narrative: 'Response costs for KMS compromise are $1M to $20M, exceeding all other threats. This includes: world-class forensics firms tracing KMS access across cloud infrastructure ($500K–$3M), cryptography consultants validating re-keying strategy ($200K–$1M), legal counsel for criminal referral, civil litigation, and regulatory response ($500K–$5M), crisis PR managing customer and media relations ($200K–$1M), and potential settlement with regulators to avoid max fines ($0–$10M).',
          scenarioContext: 'Response involves: Mandiant or CrowdStrike forensics for 6-month engagement ($1M–$3M), cryptography experts from academic institutions or NIST to validate new key architecture ($200K–$500K), white-shoe law firm handling regulatory investigations in multiple jurisdictions ($1M–$5M over 18 months), crisis PR firm managing breach notification to 5 million customers ($500K–$1M), potential settlement with EU DPA to reduce $60M max fine to $10M ($10M settlement).',
          whyTheseNumbers: 'Response of $1M–$20M reflects that KMS compromise is not a technical incident — it\'s an organizational crisis requiring world-class external help. Lower end: limited breach, cooperative regulators, settlement. Upper end: total compromise, multi-jurisdiction enforcement, contested litigation, settlements approaching max fines. The $20M upper bound is conservative — if you\'re facing $60M in potential GDPR fines, spending $20M on legal defense and settlement is rational.'
        },
        {
          factorId: 'replacement',
          action: 'focus',
          narrative: 'Replacement costs are $1M to $10M, covering complete cryptographic infrastructure rebuild. This is not "rotate a few keys" — it\'s building a new encryption architecture from scratch: new KMS setup with customer-managed HSMs, new key hierarchies, re-encryption of all data (petabytes), new certificate authorities, and validation that nothing uses old compromised keys. This is infrastructure replacement at cloud scale.',
          scenarioContext: 'Replacement involves: Migrate from AWS-managed KMS to AWS CloudHSM with customer-controlled master keys ($500K setup + $300K/year ongoing), re-encrypt all databases (petabytes of data, 2–4 weeks of compute time = $200K–$1M in AWS costs), regenerate all application certificates and deploy via automated pipeline ($100K–$500K), rebuild encrypted backups with new keys (6–12 months of backups = $500K–$2M storage + compute), validate no systems still use old keys ($200K–$1M in testing).',
          whyTheseNumbers: 'Replacement of $1M–$10M reflects cloud-scale re-keying. Lower end: modest data volumes, modern infrastructure-as-code enabling rapid re-deployment. Upper end: petabytes of encrypted data, legacy systems requiring manual re-keying, multi-cloud architecture requiring parallel re-keying across AWS/Azure/GCP. Unlike laptop theft (Replacement=$10K–$80K, buy new device) or DDoS (Replacement=$20K–$200K, add capacity), KMS requires rebuilding trust root for all cryptography.'
        }
      ]
    },
    {
      title: 'Chapter 3: Understanding Ripple Effects',
      steps: [
        {
          factorId: 'secondary',
          action: 'expand',
          narrative: 'Secondary losses for KMS compromise are $4M to $100M, potentially exceeding Primary losses ($2.5M–$40M) and threatening company survival. SLEF is 80–100% (near-certain disclosure via breach notification laws, regulatory enforcement, and media coverage). SLM is dominated by regulatory fines ($1M–$60M under GDPR) but also includes catastrophic reputation damage ($2M–$30M in customer churn) and complete competitive intelligence loss ($2M–$10M as all proprietary data is exposed). This is existential risk. Let\'s decompose into SLEF and SLM.',
          scenarioContext: 'KMS compromise exposes ALL encrypted data simultaneously: 5 million customer records, all payment card data, all proprietary algorithms, all M&A plans, all source code, all employee records. This triggers: mandatory breach notification to all affected parties (SLEF=100%), max regulatory fines for "worst possible security failure" ($60M under GDPR), total customer trust destruction (50% churn = $20M–$30M), and competitors gaining complete access to your competitive secrets ($10M damage).',
          whyTheseNumbers: null
        },
        {
          factorId: 'slef',
          action: 'focus',
          narrative: 'Secondary Loss Event Frequency (SLEF) for KMS compromise is 0.8–1.0 (80–100%), effectively certain. Unlike isolated data breaches (where you might contain disclosure), KMS compromise affects ALL encrypted data, triggering breach notification laws in every jurisdiction where you have customers. With 5 million customer records across 50 states and 30 countries, public disclosure is unavoidable and immediate.',
          scenarioContext: 'Why SLEF is 100%: GDPR Article 33 requires breach notification within 72 hours when customer PII is compromised (5 million EU customers = mandatory notification). HIPAA Breach Notification Rule requires notification when patient data is compromised (all healthcare customers). State breach notification laws (all 50 U.S. states) require notification. You must notify: data protection authorities (public), affected customers (public via media coverage), and potentially issue public statement (SEC filing if public company). There is zero scenario where this stays confidential.',
          whyTheseNumbers: 'SLEF of 0.8–1.0 reflects that KMS compromise is the ultimate "public breach." Unlike insider threats (SLEF=70–100%, criminal proceedings create records) or regulatory violations (SLEF=80–100%, enforcement is public), KMS affects millions of individuals across jurisdictions, creating unstoppable notification cascade. SLEF<100% only in theoretical scenarios: detected before data exfiltrated, attacker neutralized before acting, compromise limited to test environment not production.'
        },
        {
          factorId: 'slm',
          action: 'expand',
          narrative: 'Secondary Loss Magnitude (SLM) for KMS compromise is $4M to $100M, the highest SLM of any threat — exceeding even regulatory violations ($500K–$28M). This is driven by: astronomical fines ($1M–$60M GDPR + $0–$20M HIPAA + $0–$10M state penalties), catastrophic reputation damage ($2M–$30M as "the company that lost all customer data"), and total competitive intelligence loss ($2M–$10M as all trade secrets exposed). This is company-ending risk. Let\'s break it down.',
          scenarioContext: 'If KMS is compromised and 5 million customer records are exposed: EU regulators can impose 4% of global revenue or €60M under GDPR (largest breach penalty category). Add HIPAA fines for healthcare data ($1.5M per violation category), state AG penalties ($100K–$10M cumulative), customer churn (40–50% = $20M–$30M recurring revenue loss), stock price collapse if public (30–50% = $50M–$200M market cap), credit rating downgrade (increasing cost of capital), and competitors gaining all your strategic data. Many companies would not survive.',
          whyTheseNumbers: null
        },
        {
          factorId: 'fines',
          action: 'focus',
          narrative: 'Regulatory fines for KMS compromise are $1M to $60M, the absolute maximum under current regulations. GDPR allows up to 4% of global annual revenue or €60M. If you process 5 million EU customer records, KMS compromise is the worst-case scenario triggering maximum fines. Add HIPAA (up to $1.5M per violation category), state breach notification penalties ($100–$10K per record), and PCI-DSS assessments ($50K–$500K/month until re-certified). Total regulatory exposure can exceed $100M.',
          scenarioContext: 'Fine calculation: GDPR Article 83 allows up to €20M or 4% of global revenue for data protection violations. KMS compromise affecting 5 million EU customers is worst-case, likely triggering maximum: $60M. HIPAA fines for Tier 4 willful neglect: $1.5M per violation category (4 categories = $6M potential). 50 state AGs coordinate investigation, collective penalties $5M–$10M. PCI-DSS: card brands fine $50K/month for 12 months until re-certified ($600K). Total: $70M+.',
          whyTheseNumbers: 'Fines of $1M–$60M reflect that KMS compromise is regulatory worst-case. Lower end ($1M–$5M): limited data exposure, cooperative remediation, first-time offender, regulators show mercy. Upper end ($20M–$60M): millions of customers affected, evidence of negligent key management, regulators making an example. The $60M is GDPR\'s hard cap, but for companies with revenue >$1.5B, the 4% revenue cap exceeds $60M. KMS compromise generates the largest fines in cybersecurity history.'
        },
        {
          factorId: 'reputation',
          action: 'focus',
          narrative: 'Reputation damage from KMS compromise is $2M to $30M, representing catastrophic brand destruction. This is "the company that lost everything" — 5 million customer records, all payment data, all strategic secrets. Customer churn rates of 40–60% are realistic. Enterprise B2B customers immediately terminate contracts. Consumer trust is permanently destroyed. Recruiting becomes impossible ("who wants to work for the company with the worst breach in history?"). This is existential reputation risk.',
          scenarioContext: 'Reputation pathways: Consumer churn: 50% of 5 million customers cancel within 12 months ($20M–$30M lost recurring revenue). Enterprise B2B: 80% of enterprise customers terminate contracts citing material breach of trust ($5M–$10M). Brand value destruction: consumer surveys show 70% negative sentiment, brand needs complete rebrand ($2M–$5M). Talent flight: 20% of engineers leave for competitors, recruiting costs triple ($1M–$3M). Media coverage: "Worst breach of decade," top headline for months.',
          whyTheseNumbers: 'Reputation of $2M–$30M models trust annihilation. Unlike ransomware (Reputation=$500K–$8M, "we were attacked") or insider threats (Reputation=$200K–$10M, "rogue employee"), KMS compromise suggests organizational negligence: "They put all customer data under one master key and lost it." This is unforgivable. The $30M upper bound represents 50% customer churn plus brand rebuild costs. For many B2C companies, this is extinction. Compare to Target breach (40% CEO approval drop, eventual CEO resignation) or Equifax (stock down 30%, CEO resigned). KMS is worse because it\'s ALL data simultaneously.'
        },
        {
          factorId: 'competitive',
          action: 'focus',
          narrative: 'Competitive advantage loss from KMS compromise is $2M to $10M, representing total competitive intelligence exposure. KMS protects everything: customer lists, pricing models, M&A plans, proprietary algorithms, source code, strategic roadmaps. When KMS is compromised, competitors gain complete access to your competitive secrets. This is industrial espionage at scale. They know everything you know, eliminating all competitive advantage derived from information asymmetry.',
          scenarioContext: 'Competitive loss mechanisms: Competitors decrypt your customer database, target your best accounts with inside knowledge of pricing and pain points ($2M–$5M in lost deals over 2 years). Competitors decrypt source code for proprietary ML models, launch competing features 18 months faster ($3M–$5M in lost first-mover advantage). Competitors decrypt M&A plans, outbid you for acquisition target ($5M–$10M lost strategic opportunity). Competitors decrypt pricing strategies, undercut you systematically ($2M–$5M margin erosion).',
          whyTheseNumbers: 'Competitive of $2M–$10M reflects that KMS exposes ALL proprietary data simultaneously. Unlike insider threat (Competitive=$200K–$5M, employee steals specific data) or APT (Competitive=$100K–$4M, targeted theft), KMS gives competitors everything at once. They don\'t need to guess what\'s valuable — they can decrypt and analyze terabytes of your strategic data. The $10M upper bound is conservative, assuming competitors primarily use data for targeted sales. If they use source code or algorithms, losses could be $50M+ (captured in Reputation as customers leave for "better" competitor products built on your stolen IP).',
          experiment: {
            prompt: 'Increase Competitive loss to $20M–$100M to model competitors using stolen source code to launch superior products, capturing your market share. See how KMS compromise can destroy an entire business.',
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
          narrative: 'You\'ve estimated all factors. Examine the results. The Loss Exceedance Curve shows your risk distribution. The 90th percentile is typically $10M–$150M annually for KMS compromise risk — the highest of any analyzed threat. Notice the defining characteristic: this is catastrophic tail risk. The median (50th percentile) may be near $0 (no incidents most years), but the 90th percentile is $100M+ (rare incidents that threaten company survival). The curve has a long, fat tail representing extinction-level outcomes. The breakdown reveals both Primary ($2.5M–$40M) and Secondary ($4M–$100M) losses are catastrophic. There is no "minor KMS compromise" — it\'s either zero impact (you blocked the attack) or existential damage (all data exposed). This binary outcome is unique to KMS among all threats. Use these results to justify defense-in-depth for encryption key management: implementing customer-managed HSMs (CloudHSM) costs $10K/month ($120K/year) but raises RS from 0.8 to 0.95, cutting LEF by 75%, reducing 90th percentile risk from $100M to $20M — an $80M annual risk reduction for $120K investment. ROI is 667x. The curve also reveals that KMS risk is existential for most organizations: a single max-severity incident ($150M loss) on $200M annual revenue = 75% of annual profit gone. This justifies treating KMS security as mission-critical: zero-trust architecture, continuous monitoring, incident response drills, and considering geographic key separation (different KMS regions for different data classes).',
          scenarioContext: 'Your CEO asked: "Why should we spend $500K migrating from AWS-managed KMS to CloudHSM with our own master keys?" You can now answer: "We face 0.5–5 KMS compromise opportunities per year (via credential theft, insider threat, or AWS breach). Current AWS-managed KMS (RS=0.6–0.8) results in 0.3–5 successful compromises annually. A single KMS incident costs $2.5M–$40M in Primary losses (re-keying infrastructure, forensics, legal) plus $4M–$100M in Secondary losses (GDPR fines up to $60M, customer churn, competitive intelligence loss), with a 10% chance of exceeding $120M annually. This is existential — a $120M loss on $200M revenue threatens company survival. Migrating to CloudHSM (customer-controlled master keys) raises RS from 0.7 to 0.9, cutting our 90th percentile risk from $120M to $25M — a $95M risk reduction for $500K migration plus $120K/year operational cost. First-year ROI is 190x, ongoing ROI is 792x. Additionally, CloudHSM eliminates trust in AWS, our largest single point of failure. This is not a cost — it\'s existential risk insurance."',
          whyTheseNumbers: 'Cloud KMS compromise illustrates the most important concept in FAIR analysis: low-frequency, high-impact risks that traditional risk matrices miss. A 5x5 risk matrix rates "rare, catastrophic" the same as "occasional, major" — both get a high score. But they\'re fundamentally different: occasional major risks are budgetable expenses; rare catastrophic risks threaten survival. KMS compromise is the latter. The FAIR model reveals this through Loss Exceedance Curves showing the tail: 90% of years have $0 loss, but the 10% worst-case years have $100M+ losses. This justifies investing heavily in prevention despite low frequency — because when it happens, you\'re done. This tutorial teaches the hardest lesson in risk management: not all "high risks" are the same. Some are expensive. Some are fatal. KMS compromise is fatal. The only rational response is defense-in-depth: multiple layers of protection, continuous monitoring, and eliminating single points of failure. Because unlike ransomware (where you can pay or restore from backups) or regulatory fines (where you can appeal or settle), KMS compromise has no recovery path. Once all customer data is exposed, the damage is permanent. This is why cloud security is not optional — it\'s existential.'
        }
      ]
    }
  ]
};
