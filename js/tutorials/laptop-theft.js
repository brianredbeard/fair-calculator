/**
 * Physical Laptop Theft Tutorial
 * Intermediate difficulty - Understanding physical security threats
 */

export default {
  id: 'laptop-theft',
  title: 'Physical Laptop Theft Tutorial',
  subtitle: 'Understanding physical security threats',
  difficulty: 'intermediate',
  estimatedMinutes: 15,
  scenarioIndex: 15,

  chapters: [
    {
      title: 'Chapter 1: Understanding Frequency',
      steps: [
        {
          factorId: 'lef',
          action: 'focus',
          narrative: 'Loss Event Frequency (LEF) for laptop theft represents successful thefts resulting in data compromise per year. We estimate 4 to 80 incidents annually for an organization with 500 employees. This wide range reflects uncertainty in both theft opportunities (travel frequency, office security) and disk encryption effectiveness.',
          scenarioContext: 'Your organization issues laptops to all employees. Sales teams travel frequently, leaving devices in cars and hotel rooms. Office workers occasionally work from coffee shops. Despite full-disk encryption policy, compliance is inconsistent.',
          whyTheseNumbers: 'LEF of 4–80/year combines low theft frequency (laptops are occasionally stolen) with variable encryption compliance. If encryption is 100% enforced, LEF drops to near-zero (thief gets hardware, not data). The range reflects encryption compliance uncertainty.'
        },
        {
          factorId: 'tef',
          action: 'expand',
          narrative: 'LEF decomposes into Threat Event Frequency (TEF) and Vulnerability. Let\'s expand to see TEF — how often laptops are stolen or lost, regardless of whether data is compromised.',
          scenarioContext: 'Theft and loss happen through various vectors: stolen from cars (opportunistic), left in taxis or airports (accidental), taken during burglaries (targeted), or grabbed in smash-and-grabs at coffee shops (opportunistic).',
          whyTheseNumbers: null
        },
        {
          factorId: 'cf',
          action: 'focus',
          narrative: 'Contact Frequency (CF) represents opportunities for laptop theft — situations where devices are vulnerable to being taken. We estimate 20 to 100 events per year organization-wide. This includes unattended devices in public spaces, laptops visible in vehicles, and devices in checked luggage.',
          scenarioContext: 'Contact events: employee leaves laptop in car while running errands (20–30 times/year), device left unattended at airport or coffee shop (10–20 times/year), hotel room burglaries during conferences (5–10 times/year), smash-and-grab from vehicles (5–15 times/year).',
          whyTheseNumbers: 'CF of 20–100/year reflects physical exposure. This is lower than digital threats (phishing CF=1000–15000) because physical theft requires proximity. Higher than ransomware (CF=5–50) because opportunistic theft is more common than targeted cyberattacks.',
          experiment: {
            prompt: 'Try doubling Contact Frequency to 40–200 to model increased travel post-pandemic. Watch the Median and 90th Percentile — physical exposure directly drives loss frequency.',
            resetAfter: true
          }
        },
        {
          factorId: 'poa',
          action: 'focus',
          narrative: 'Probability of Action (PoA) is the likelihood that a theft opportunity is acted upon. We estimate 0.2–0.8 (20–80%), much higher than phishing (1–10%) but lower than brute force (70–100%). This reflects that most theft opportunities aren\'t noticed by thieves, but visible devices in cars or unattended in public are high-value targets.',
          scenarioContext: 'PoA varies by scenario: laptop visible in car at night (PoA≈80%, very attractive target), unattended device at Starbucks for 2 minutes (PoA≈30%, depends on thief being present), laptop in locked hotel room (PoA≈5%, requires targeted burglary).',
          whyTheseNumbers: 'PoA of 0.2–0.8 reflects mixed scenarios. Opportunistic thieves actively scan for laptops in cars (high PoA). Random loss (leaving device in taxi) doesn\'t involve a deliberate actor (PoA=100% for loss, but not theft). The average captures both targeted and opportunistic theft.'
        },
        {
          factorId: 'vuln',
          action: 'expand',
          narrative: 'Vulnerability is the probability that a stolen laptop results in data compromise. This depends on Threat Capability (thief\'s ability to bypass encryption) versus Resistance Strength (your disk encryption, password policies, remote wipe). Let\'s decompose it.',
          scenarioContext: 'Your defenses: corporate full-disk encryption policy (BitLocker on Windows, FileVault on Mac), complex password requirements, and mobile device management (MDM) with remote wipe capability. But encryption compliance is only 70% — some users disable it for performance.',
          whyTheseNumbers: null
        },
        {
          factorId: 'tcap',
          action: 'focus',
          narrative: 'Threat Capability (TCap) for laptop theft is 0.7–0.99 on a 0–100 scale. Most thieves want to resell hardware, not steal data — they wipe and reinstall the OS (TCap for data theft≈0). But if the device reaches a skilled attacker (sold on dark markets, targeted espionage), they can extract data from unencrypted or poorly encrypted drives.',
          scenarioContext: 'Opportunistic thieves (parking lot smash-and-grabs) wipe devices to resell on eBay. But 10–20% of stolen laptops end up in markets where buyers specifically look for corporate devices to extract data. Tools to bypass weak passwords or attack unpatched encryption vulnerabilities are widely available.',
          whyTheseNumbers: 'TCap of 0.7–0.99 reflects worst-case assumption: laptop reaches someone motivated to extract data. Modern full-disk encryption (AES-256) is strong, but weak user passwords (allowing brute force of the encryption key) or users disabling encryption entirely raise TCap. We model the skilled-attacker scenario, not the average thief.'
        },
        {
          factorId: 'rs',
          action: 'focus',
          narrative: 'Resistance Strength (RS) is how well encryption and access controls protect data. We rate your defenses at 0.3–0.7 on a 0–100 scale. With full-disk encryption and strong passwords, RS would be 0.9+. But incomplete compliance (30% of devices unencrypted) and weak user passwords (allowing brute force) lower RS significantly.',
          scenarioContext: 'Your encryption policy requires 12-character passwords and full-disk encryption, but enforcement gaps exist: 30% of devices lack encryption (performance complaints, user bypasses), 20% of users use weak passwords despite policy, remote wipe requires the device to connect to the network (stolen device never goes online).',
          whyTheseNumbers: 'RS of 0.3–0.7 reflects policy vs. reality. If 30% of devices are unencrypted, then 30% of thefts automatically succeed (RS=0 for those devices). For encrypted devices with weak passwords, brute force tools can crack in hours to days. Only devices with strong encryption + strong passwords achieve RS≈0.9.',
          experiment: {
            prompt: 'Increase Resistance Strength to 0.7–0.95 to model enforced full-disk encryption with hardware-backed keys (TPM). The Median and 90th Percentile should drop sharply — strong encryption makes stolen laptops near-worthless to attackers.',
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
          narrative: 'Loss Magnitude (LM) for laptop theft is $15K to $210K per incident, driven by device replacement, lost productivity, incident response, and potential data breach costs. This is higher than phishing ($1K–$15K) and S3 misconfiguration ($10K–$80K) but lower than ransomware ($1M–$8M).',
          scenarioContext: 'When a laptop is stolen, you must: replace the hardware ($2K), rebuild user environment and restore from backups (2–5 days productivity), investigate whether data was accessed (if unencrypted), rotate credentials the user had access to, and potentially notify customers if PII was on the device.',
          whyTheseNumbers: 'LM of $15K–$210K reflects variable data sensitivity and user seniority. Lower end: junior employee, encrypted device, quick replacement. Upper end: executive laptop with unencrypted customer database, multi-week investigation, regulatory notification required.'
        },
        {
          factorId: 'primary',
          action: 'expand',
          narrative: 'Primary losses include productivity loss while the employee waits for a replacement, response costs (investigation and credential rotation), and replacement costs (new hardware and software licensing). For laptop theft, Replacement is often the largest primary cost component.',
          scenarioContext: 'Primary costs: purchasing new laptop and peripherals ($2K–$4K), IT time provisioning and configuring new device (4–8 hours), employee downtime waiting for replacement (1–7 days), and security investigation if device was unencrypted (8–40 hours).',
          whyTheseNumbers: null
        },
        {
          factorId: 'productivity',
          action: 'focus',
          narrative: 'Productivity loss occurs when the employee can\'t work while waiting for a replacement device. We estimate $5K to $80K, depending on employee seniority and replacement speed. A sales executive offline during quarter-end costs far more than a junior analyst offline for two days.',
          scenarioContext: 'Productivity loss: junior employee (salary $50K/year) offline for 3 days = ~$600. Senior sales executive (salary $200K/year) offline for 7 days during critical deal closure = ~$40K in missed revenue. Technical staff offline = delayed project timelines.',
          whyTheseNumbers: 'Productivity of $5K–$80K reflects user seniority and urgency. Most organizations can ship a replacement laptop in 1–3 days (lower end). But executives traveling internationally or employees in remote locations may wait a week (upper end). Lost deals and missed deadlines amplify costs.'
        },
        {
          factorId: 'response',
          action: 'focus',
          narrative: 'Response costs include investigating whether data was compromised, rotating credentials, notifying stakeholders, and coordinating replacement. For encrypted devices, response is minimal ($0–$10K). For unencrypted devices, response includes full forensic analysis and potential breach notification ($10K–$50K).',
          scenarioContext: 'Encrypted device response: verify encryption was enabled, remotely wipe if device goes online, rotate user\'s passwords as precaution (4–8 hours). Unencrypted device response: assume full compromise, audit what data was on the device, rotate all accessed credentials, notify customers if PII was present, potential external forensics.',
          whyTheseNumbers: 'Response of $0–$50K is binary: encrypted device (minimal cost) vs. unencrypted device (expensive investigation). The upper bound reflects worst-case: unencrypted executive laptop with customer PII, requiring external forensics, legal review, and customer notifications.'
        },
        {
          factorId: 'replacement',
          action: 'focus',
          narrative: 'Replacement costs are the hardware, software licenses, and provisioning labor. We estimate $10K to $80K. Most laptop replacements cost $2K–$4K for hardware, but if the stolen device had specialized software licenses or custom configurations, costs increase. For executives with multiple devices (phone, tablet, laptop), replacement costs multiply.',
          scenarioContext: 'Replacement involves: new laptop hardware ($2K–$4K), software re-licensing if keys were on the device ($500–$2K), IT labor provisioning and configuring ($500–$1K), and restoring user environment from backups ($1K–$5K if customization was heavy). For executives: replace phone, tablet, and laptop simultaneously.',
          whyTheseNumbers: 'Replacement of $10K–$80K includes not just hardware but ecosystem rebuild. Lower end: standard laptop with standard software. Upper end: executive with specialized CAD software ($5K/license), custom developer environments, and multiple devices stolen simultaneously.'
        }
      ]
    },
    {
      title: 'Chapter 3: Understanding Ripple Effects',
      steps: [
        {
          factorId: 'secondary',
          action: 'expand',
          narrative: 'Secondary losses occur when stolen laptops contain customer PII or proprietary data, triggering regulatory notifications, customer churn, or competitive intelligence loss. With modern encryption, most laptop thefts result in minimal secondary losses. But unencrypted devices with sensitive data create significant ripple effects. Let\'s decompose into SLEF and SLM.',
          scenarioContext: 'If the stolen laptop was encrypted with a strong password, secondary losses are near-zero (thief gets hardware, not data). If unencrypted or weakly protected, and the device contained customer records, source code, or business plans, secondary consequences include breach notifications, customer trust erosion, and competitor intelligence.',
          whyTheseNumbers: null
        },
        {
          factorId: 'slef',
          action: 'focus',
          narrative: 'Secondary Loss Event Frequency (SLEF) is the probability that laptop theft triggers external consequences. We estimate 0.1 to 0.4 (10–40%). This is higher than phishing (1–10%) because you can\'t verify whether a stolen laptop\'s data was accessed — you must assume compromise if unencrypted. It\'s lower than ransomware (60–100%) because most devices are encrypted.',
          scenarioContext: 'SLEF depends entirely on encryption compliance. Encrypted device stolen = SLEF≈0% (no data breach). Unencrypted device stolen = SLEF≈100% (assume full data compromise, trigger breach response). The 10–40% range reflects your organization\'s 70% encryption compliance rate.',
          whyTheseNumbers: 'SLEF of 0.1–0.4 reflects mixed fleet security. With 30% of devices unencrypted, roughly 30% of laptop thefts result in data breach assumptions. The range accounts for variability in which users\' devices are stolen (sales with customer data vs. HR with employee data).'
        },
        {
          factorId: 'slm',
          action: 'expand',
          narrative: 'Secondary Loss Magnitude (SLM) is the cost when laptop theft becomes a data breach. We estimate $2K to $10K, driven by modest customer notifications, limited reputation damage (physical theft is understood and forgiven more than cyberattacks), and minimal competitive loss (thieves rarely target proprietary data). Let\'s break it down.',
          scenarioContext: 'If an unencrypted laptop with customer PII is stolen, you must send breach notification letters. Customers understand physical theft (unlike hacking, which implies weak security). Competitive loss is minimal because opportunistic thieves wipe devices; they don\'t extract and sell source code.',
          whyTheseNumbers: null
        },
        {
          factorId: 'fines',
          action: 'focus',
          narrative: 'Regulatory fines for laptop theft are rare ($0–$2K) unless the organization had no encryption policy or ignored known compliance gaps. Most regulators view laptop theft as an acceptable risk if encryption was enabled. Fines appear when devices containing PII were knowingly deployed without encryption.',
          scenarioContext: 'If your encryption policy was documented and enforced, and a user bypassed it without IT knowing, regulators typically don\'t penalize. Fines occur when audits reveal systematic non-compliance: encryption available but not enforced, or management knew 30% of devices were unencrypted but took no action.',
          whyTheseNumbers: 'Fines of $0–$2K reflect that physical theft is largely uncontrollable (unlike digital threats where controls are expected). Regulators focus on whether you had reasonable safeguards (encryption policy). The $2K upper bound represents state-level penalties for egregious negligence (executive laptop with 10,000 SSNs, no encryption, no MDM).'
        },
        {
          factorId: 'reputation',
          action: 'focus',
          narrative: 'Reputation damage from laptop theft is modest ($0–$5K). Customers are generally forgiving of physical theft (it\'s relatable — everyone knows someone who\'s had a phone or laptop stolen). Reputation loss occurs primarily when the stolen device contained large amounts of customer PII and was unencrypted, suggesting negligent security practices.',
          scenarioContext: 'Media coverage of laptop theft is typically sympathetic ("employee\'s car was broken into") unless the breach is large-scale or involves gross negligence ("company deployed 1,000 unencrypted laptops with customer data"). Customer churn is minimal because physical theft is perceived as bad luck, not bad security.',
          whyTheseNumbers: 'Reputation of $0–$5K reflects limited customer reaction. Unlike ransomware (Reputation=$500K–$8M) where customers question your security competence, laptop theft is seen as an unfortunate but understandable incident. The $5K upper bound represents modest customer churn (1–2%) if the breach was publicized and involved sensitive data.'
        },
        {
          factorId: 'competitive',
          action: 'focus',
          narrative: 'Competitive advantage loss from laptop theft is minimal ($0–$3K). Opportunistic thieves wipe devices to resell; they don\'t extract source code or business plans. Competitive loss appears only in rare targeted theft scenarios (espionage, industrial competitors hiring thieves), and even then, the thief must know which laptop to target.',
          scenarioContext: 'For competitive intelligence to be lost, three things must align: (1) the stolen laptop contained proprietary data (source code, M&A plans), (2) the thief was motivated to extract data (not just resell hardware), and (3) the device was unencrypted. This is rare. Most competitive theft is digital (APT, insider threats), not physical.',
          whyTheseNumbers: 'Competitive of $0–$3K reflects low strategic targeting. The $3K likely/max bound represents rare cases where a competitor hired a thief to steal a specific executive\'s laptop containing pricing strategies or customer lists. Compare this to APT IP theft (Competitive=$100K–$4M) where attackers specifically target high-value proprietary data.',
          experiment: {
            prompt: 'Increase Competitive loss to $50K–$500K to model targeted espionage (nation-state actor stealing R&D laptop). See how secondary losses dominate in targeted physical theft scenarios.',
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
          narrative: 'You\'ve estimated all factors. Examine the results. The Loss Exceedance Curve shows your risk distribution. The 90th percentile is typically $60K–$250K annually for laptop theft risk. Notice the key drivers: Replacement costs (new hardware, software, provisioning) often equal or exceed Productivity loss, unlike digital threats where Productivity dominates. This reveals physical assets as cost centers. The breakdown shows Resistance Strength (0.3–0.7) is the critical control point. Raising RS from 0.5 to 0.9 via enforced encryption cuts LEF by 80%, because encrypted devices can\'t be exploited. Compare control strategies: laptop theft (encrypt everything via TPM enforcement) vs. phishing (train users) vs. ransomware (segment networks, test backups). Physical security teaches that technical controls (encryption) outperform human controls (policies asking users to enable encryption). Use these results to justify enforcement: implementing TPM-enforced encryption raises RS from 0.5 to 0.95, cutting annual risk from $150K to $30K. The curve also reveals that Replacement costs create a high floor: even with perfect encryption (no data breach), you still pay $15K–$80K per theft for hardware. This justifies physical theft prevention (cable locks, secure storage policies) in addition to data protection (encryption).',
          scenarioContext: 'Your CFO asked: "Should we spend $50K to enforce TPM-backed encryption on all laptops?" You can now answer: "We face 20–100 laptop theft opportunities per year. Current 70% encryption compliance keeps Resistance Strength at 0.3–0.7, resulting in 4–80 data breach incidents annually, costing $15K–$210K each, with a 10% chance of exceeding $200K annually. TPM enforcement raises encryption to 100%, boosting RS to 0.9+, cutting our 90th percentile risk from $200K to $50K — a $150K annual reduction for a $50K one-time investment plus $10K annual management. ROI is positive in 5 months, and the risk reduction is permanent."',
          whyTheseNumbers: 'Laptop theft demonstrates physical security risks where technical controls (encryption) are highly effective but human-dependent controls (policies) fail. Unlike digital threats where attackers adapt to defenses, physical theft threat capability is constant (thieves can\'t defeat AES-256). The FAIR model reveals that raising Resistance Strength through technical enforcement (TPM-backed encryption that users can\'t disable) is more effective than raising it through policy (asking users to enable encryption). This tutorial teaches that some risks are best addressed through removing human choice from the control (enforce encryption at hardware level), not training humans to make the right choice.'
        }
      ]
    }
  ]
};
