/**
 * Phishing on Back-Office Tutorial
 * Beginner difficulty - Understanding high-contact, low-conversion threats
 */

export default {
  id: 'phishing',
  title: 'Phishing on Back-Office Tutorial',
  subtitle: 'Understanding high-contact, low-conversion threats',
  difficulty: 'beginner',
  estimatedMinutes: 12,
  scenarioIndex: 11,

  chapters: [
    {
      title: 'Chapter 1: Understanding Frequency',
      steps: [
        {
          factorId: 'lef',
          action: 'focus',
          narrative: 'Let\'s start with Loss Event Frequency (LEF) — the number of successful phishing attacks per year against your back-office staff. We\'re estimating 10 to 1500 successful compromises annually. This wide range reflects the uncertainty in user behavior: will employees click malicious links?',
          scenarioContext: 'Your organization has 200 back-office employees (HR, finance, operations) who receive thousands of emails daily. Phishing emails that bypass your email filter eventually reach user inboxes.',
          whyTheseNumbers: 'LEF of 10–1500/year shows the math: high contact frequency (thousands of phishing emails reach inboxes) multiplied by low probability of action (most users don\'t click). The uncertainty is driven entirely by user behavior, not attacker capability.'
        },
        {
          factorId: 'tef',
          action: 'expand',
          narrative: 'LEF breaks down into Threat Event Frequency (TEF) and Vulnerability. Let\'s expand LEF to see TEF — how often phishing attempts reach user inboxes, regardless of whether users click.',
          scenarioContext: 'Your email gateway blocks 99% of phishing attempts, but with millions of phishing emails sent globally each day, hundreds still slip through monthly.',
          whyTheseNumbers: null
        },
        {
          factorId: 'cf',
          action: 'focus',
          narrative: 'Contact Frequency (CF) is how often phishing emails reach employee inboxes. For back-office staff at a mid-sized organization, we see 1000 to 15000 phishing emails per year that bypass automated filters. This includes credential harvesting, fake invoices, and business email compromise (BEC).',
          scenarioContext: 'Phishing is a volume game. Attackers send millions of emails daily. Even with a 99% filter success rate, the sheer volume means your employees receive 3–40 phishing emails per day organization-wide.',
          whyTheseNumbers: 'CF of 1000–15000/year reflects modern email threats. This is MUCH higher than brute force (200–800) or ransomware (5–50) because phishing is cheap to execute at scale. Attackers send to every discoverable email address.',
          experiment: {
            prompt: 'Try reducing Contact Frequency to 500–5000 to model improved email filtering. Watch the Median and 90th Percentile — they should drop proportionally. Filtering is highly effective because phishing is a volume game.',
            resetAfter: true
          }
        },
        {
          factorId: 'poa',
          action: 'focus',
          narrative: 'Probability of Action (PoA) measures how often employees click phishing links or open malicious attachments. This is where phishing differs dramatically from brute force. PoA is only 0.01–0.1 (1–10%) because most users recognize and ignore phishing attempts.',
          scenarioContext: 'Security awareness training has improved over the years. Most employees know to check sender addresses, hover over links, and question unexpected attachments. But fatigue, urgency, and clever social engineering mean a small percentage still click.',
          whyTheseNumbers: 'PoA of 0.01–0.1 is the conversion rate. Out of 1000 phishing emails, only 10–100 result in clicks. This is the critical control point: training and simulated phishing exercises directly reduce PoA. Compare this to brute force (PoA=0.7–1.0) where automation guarantees action.'
        },
        {
          factorId: 'vuln',
          action: 'expand',
          narrative: 'Vulnerability is the probability that a clicked phishing link leads to compromise. This depends on Threat Capability (how convincing and weaponized the phishing attack is) versus Resistance Strength (your email filters, endpoint detection, browser protections). Let\'s decompose it.',
          scenarioContext: 'Your defenses include: email filtering (SPF/DKIM/DMARC checks), endpoint antivirus, browser warnings on known phishing sites, and mandatory security awareness training. But determined attackers craft emails that pass all filters.',
          whyTheseNumbers: null
        },
        {
          factorId: 'tcap',
          action: 'focus',
          narrative: 'Threat Capability (TCap) for phishing is 0.6–0.95 on a 0–100 scale. Modern phishing campaigns use spoofed sender addresses, legitimate-looking branding, urgency ("Your account will be locked!"), and links to credential harvesting sites hosted on compromised servers. Some attackers perform reconnaissance to personalize messages.',
          scenarioContext: 'Phishing-as-a-Service platforms let attackers with minimal skill create convincing campaigns. They provide email templates, hosting, and credential harvesting infrastructure for a subscription fee.',
          whyTheseNumbers: 'TCap of 0.6–0.95 reflects professionalized phishing. Attackers clone your company\'s login pages, use look-alike domains (rn vs m), and craft messages that mimic legitimate internal communications. This isn\'t "Nigerian prince" emails anymore.'
        },
        {
          factorId: 'rs',
          action: 'focus',
          narrative: 'Resistance Strength (RS) is how well your defenses detect and block phishing. We rate your controls at 0.4–0.85 on a 0–100 scale. Email authentication (SPF/DKIM) catches spoofing, link scanning blocks known phishing sites, and training teaches users to recognize red flags. But new phishing domains evade detection.',
          scenarioContext: 'Your email filter checks sender reputation, scans links against threat feeds, and quarantines suspicious attachments. Security training runs quarterly. Endpoint detection blocks known malware payloads. But zero-day phishing sites (registered hours ago) bypass URL filters.',
          whyTheseNumbers: 'RS of 0.4–0.85 reflects layered defenses with gaps. You\'re stopping most phishing, but sophisticated campaigns using fresh domains and clever social engineering still get through. The wide range reflects uncertainty in filter effectiveness against novel attacks.',
          experiment: {
            prompt: 'Increase Resistance Strength to 0.7–0.95 to model adding advanced email filtering with AI-based content analysis. See how vulnerability drops.',
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
          narrative: 'Loss Magnitude (LM) is the cost per successful phishing attack. For back-office phishing, we\'re looking at $1K to $15K per incident, driven by credential resets, investigation time, and temporary productivity loss. This is much lower than ransomware ($1M–$8M) because most phishing attacks are caught quickly before major damage.',
          scenarioContext: 'When an employee clicks a phishing link and enters credentials, you must: investigate what accounts were accessed, reset passwords, review audit logs for unauthorized access, and notify the affected employee. Most incidents are contained within hours.',
          whyTheseNumbers: 'LM of $1K–$15K reflects rapid containment. Lower end: employee self-reports immediately, only one account compromised, no data accessed. Upper end: delay in detection, attacker accessed HR or finance systems, multi-day investigation required.'
        },
        {
          factorId: 'primary',
          action: 'expand',
          narrative: 'Primary losses are the immediate costs: lost productivity while investigating, staff time responding to the incident, and minimal replacement costs (typically zero for phishing — you\'re resetting credentials, not replacing hardware).',
          scenarioContext: 'Primary costs include: IT security team investigating which accounts were compromised, forcing password resets, reviewing access logs, and communicating with the affected employee.',
          whyTheseNumbers: null
        },
        {
          factorId: 'productivity',
          action: 'focus',
          narrative: 'Productivity loss occurs when the compromised employee can\'t work while their account is locked for investigation, and when IT staff drop other tasks to respond. We estimate $500 to $5K. A typical incident requires 4–8 hours of IT time plus the employee\'s downtime.',
          scenarioContext: 'Productivity loss: the phished employee is locked out for 2–4 hours while IT investigates and resets credentials. IT staff spend a half-day reviewing logs and ensuring no lateral movement occurred. Managers spend time reassuring other team members.',
          whyTheseNumbers: 'Productivity of $500–$5K scales with seniority. $500 = junior employee, quick investigation. $5K = executive account compromised, full forensic review, customer communications required if client data was viewed.'
        },
        {
          factorId: 'response',
          action: 'focus',
          narrative: 'Response costs cover investigation, containment, and recovery. This includes reviewing email logs to identify the phishing message, checking which other employees received it, forcing password resets, and sending organization-wide phishing alerts. We estimate $500 to $10K.',
          scenarioContext: 'Response involves: IT security analyzing the phishing email, identifying all recipients, checking for other compromised accounts, forcing resets on potentially affected credentials, and sending a security bulletin reminding staff not to click suspicious links.',
          whyTheseNumbers: 'Response of $500–$10K includes internal labor. Lower end: single employee, quick containment, no external help. Upper end: organization-wide phishing campaign affecting multiple employees, external forensics engaged to trace attacker actions.'
        },
        {
          factorId: 'replacement',
          action: 'focus',
          narrative: 'Replacement costs for phishing are typically $0. You\'re resetting passwords and rotating API keys, not replacing physical assets. Replacement only appears if the attacker used the phished credentials to install persistent malware, requiring workstation re-imaging.',
          scenarioContext: 'Most phishing incidents involve credential harvesting only. The attacker logs in, looks around, and logs out (or you detect and lock them out). No files are encrypted, no malware is installed, so there\'s nothing to replace.',
          whyTheseNumbers: 'Replacement of $0 reflects the nature of phishing: it\'s a credential theft vector, not a destructive attack. This contrasts with ransomware (Replacement=$200K–$3M) where you\'re rebuilding infrastructure.'
        }
      ]
    },
    {
      title: 'Chapter 3: Understanding Ripple Effects',
      steps: [
        {
          factorId: 'secondary',
          action: 'expand',
          narrative: 'Secondary losses occur when a phishing incident triggers external consequences: regulatory reporting (if PII was accessed), customer notifications, or reputation damage. For most back-office phishing, secondary losses are minimal because incidents are contained before data exfiltration. Let\'s decompose into SLEF and SLM.',
          scenarioContext: 'Back-office employees access internal systems (HR databases, finance tools) but not typically customer-facing data. Unless the attacker uses stolen credentials to access and exfiltrate customer PII, there\'s no notification requirement.',
          whyTheseNumbers: null
        },
        {
          factorId: 'slef',
          action: 'focus',
          narrative: 'Secondary Loss Event Frequency (SLEF) is the probability that a phishing incident becomes public or triggers regulatory reporting. We estimate 0.01 to 0.1 (1–10%), reflecting that most phishing incidents are detected and contained before any data leaves the organization.',
          scenarioContext: 'Most phishing attacks against back-office staff are caught when the employee reports the suspicious email or when automated monitoring detects unusual login patterns. Secondary losses occur only if the attacker actually downloads customer data before detection.',
          whyTheseNumbers: 'SLEF of 0.01–0.1 reflects strong containment. 90–99% of phishing incidents result in no data breach — just a password reset. The 1–10% accounts for cases where attackers act fast, accessing and exfiltrating data within hours.'
        },
        {
          factorId: 'slm',
          action: 'expand',
          narrative: 'Secondary Loss Magnitude (SLM) is the cost when phishing does trigger external consequences. We estimate $500 to $10K, much lower than ransomware ($1M–$15M) because back-office phishing rarely involves large-scale customer data breaches. Let\'s break it down.',
          scenarioContext: 'If an attacker uses stolen back-office credentials to access customer records and downloads PII, you must notify affected customers and potentially report to regulators. But the scale is typically small (hundreds of records, not millions).',
          whyTheseNumbers: null
        },
        {
          factorId: 'fines',
          action: 'focus',
          narrative: 'Regulatory fines for back-office phishing are minimal ($0–$1K) unless the breach exposes significant customer PII and you failed to implement basic controls. Most phishing incidents involve internal-only data (employee directories, expense reports) with no notification requirement.',
          scenarioContext: 'If phishing leads to accessing employee SSNs in HR systems, you may need to notify affected employees under state breach laws. For small-scale breaches with prompt notification, fines are rare. Fines appear only if regulators find negligent security practices.',
          whyTheseNumbers: 'Fines of $0–$1K reflect the low scale and rapid response typical of back-office phishing. Compare this to ransomware (Fines=$0–$5M) or regulatory breaches (Fines=$0–$20M) where the scope and negligence are much greater.'
        },
        {
          factorId: 'reputation',
          action: 'focus',
          narrative: 'Reputation damage for back-office phishing is modest ($0–$5K). Most incidents never become public because they involve internal-only systems. Reputation loss occurs when customers hear about the breach through notification letters or news coverage.',
          scenarioContext: 'If the phishing attack leads to accessing customer data, you send breach notification letters. Some customers may lose trust and cancel accounts. But back-office phishing is rarely publicized beyond required notifications.',
          whyTheseNumbers: 'Reputation of $0–$5K reflects low visibility. Unlike ransomware (Reputation=$500K–$8M) which often makes headlines, phishing incidents are common and rarely newsworthy unless they\'re part of a large-scale campaign affecting thousands of customers.'
        },
        {
          factorId: 'competitive',
          action: 'focus',
          narrative: 'Competitive advantage loss for back-office phishing is minimal ($0–$4K). Attackers typically harvest credentials for financial fraud or lateral movement, not industrial espionage. Unless an executive account with access to strategic data is compromised, there\'s no competitive intelligence lost.',
          scenarioContext: 'Back-office staff access HR records, expense reports, and operational tools — not product roadmaps, pricing strategies, or M&A plans. Competitive loss requires phishing an executive or stealing source code, which is rare for commodity phishing campaigns.',
          whyTheseNumbers: 'Competitive of $0–$4K reflects opportunistic targeting. Phishing campaigns cast wide nets, hoping for any credential. They\'re not tailored to steal specific competitive secrets. Compare this to APT IP theft (Competitive=$100K–$4M) where attackers specifically target strategic data.',
          experiment: {
            prompt: 'Increase Competitive loss to $10K–$100K to model a scenario where an executive account with M&A data was phished. See how secondary losses can shift the risk profile.',
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
          narrative: 'You\'ve estimated all factors. Examine the results. The Loss Exceedance Curve shows your risk distribution. The 90th percentile — the loss you\'ll exceed 10% of the time — is typically $5K–$40K annually for back-office phishing. Notice the key insight: despite high Contact Frequency (1000–15000 emails/year), the low Probability of Action (0.01–0.1, only 1–10% of employees click) keeps Loss Event Frequency manageable. This reveals the most effective control: security awareness training directly reduces PoA. Compare this to ransomware (where PoA≈1.0 due to automation): training is highly effective against phishing, moderately effective against ransomware social engineering, and ineffective against brute force (which bypasses humans entirely). The breakdown shows Primary losses (investigation, password resets) dominate Secondary losses (which are rare). Use these results to prioritize: invest in continuous phishing simulation and training (reduces PoA by 50–80%) rather than just better email filters (reduces CF but attackers adapt). This tutorial demonstrates a critical FAIR lesson: frequency and magnitude are independent. Phishing has high contact but low damage per incident. Ransomware has low contact but high damage. Your control strategy must match the threat profile.',
          scenarioContext: 'Your CISO asked: "Should we spend $15K on quarterly phishing simulation training?" You can now answer: "We face 1000–15000 phishing contacts per year. Current training keeps PoA at 1–10%, resulting in 10–1500 incidents annually, costing $1K–$15K each, with a 10% chance of exceeding $30K annually. Doubling training frequency could cut PoA from 3% to 1%, reducing our 90th percentile risk from $30K to $10K — a $20K annual reduction for $15K investment. ROI is positive immediately and recurring."',
          whyTheseNumbers: 'Phishing illustrates high-frequency, low-impact risks where user behavior is the dominant variable. Unlike brute force (automation-driven) or ransomware (capability-driven), phishing risk is controlled primarily through PoA reduction via training. This tutorial teaches beginners that different threat types require different control strategies — there is no one-size-fits-all security control.'
        }
      ]
    }
  ]
};
