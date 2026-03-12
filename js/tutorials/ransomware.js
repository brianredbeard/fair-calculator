/**
 * Ransomware Outbreak Tutorial
 * Intermediate difficulty - Understanding high-impact, low-frequency risks
 */

export default {
  id: 'ransomware',
  title: 'Ransomware Outbreak Tutorial',
  subtitle: 'Understanding high-impact, low-frequency risks',
  difficulty: 'intermediate',
  estimatedMinutes: 15,
  scenarioIndex: 3,

  chapters: [
    {
      title: 'Chapter 1: Understanding Frequency',
      steps: [
        {
          factorId: 'lef',
          action: 'focus',
          narrative: 'Let\'s start by estimating how often ransomware events happen. Loss Event Frequency (LEF) is the number of successful ransomware incidents you\'ll face per year. For our enterprise file servers, we estimate 0.1 to 0.6 events annually — rare, but not impossible.',
          scenarioContext: 'Your organization runs critical file servers accessed by 2,000 employees across 15 departments. Ransomware would encrypt all shared drives, halting operations.',
          whyTheseNumbers: 'LEF of 0.1–0.6/year means one incident every 1.7 to 10 years. This reflects strong email filtering and endpoint protection, but acknowledges that determined attackers occasionally break through.'
        },
        {
          factorId: 'tef',
          action: 'expand',
          narrative: 'LEF breaks down into two parts: how often threats act (TEF), and how often they succeed (Vulnerability). Let\'s expand LEF to see Threat Event Frequency — the rate at which ransomware attempts occur, whether or not they succeed.',
          scenarioContext: 'Your security logs show blocked ransomware delivery attempts weekly. Most are stopped by email filters and endpoint detection.',
          whyTheseNumbers: null
        },
        {
          factorId: 'cf',
          action: 'focus',
          narrative: 'Contact Frequency is how often ransomware operators encounter your infrastructure — phishing emails sent, exploit kits hitting your network, drive-by downloads. For a mid-sized enterprise, we see 5 to 50 malicious contacts per year that specifically target file encryption.',
          scenarioContext: 'Threat intelligence shows your industry sees 20–30 targeted ransomware campaigns annually. Your email gateway blocks most, but some reach users.',
          whyTheseNumbers: 'CF of 5–50/year reflects focused campaigns, not commodity malware. This is lower than generic phishing (thousands/year) but higher than APT reconnaissance (1–2/year).',
          experiment: {
            prompt: 'Try doubling Contact Frequency to 10–100 to simulate increased targeting. Watch the Median and 90th Percentile — they should increase. (Ignore the Mean; it fluctuates with Monte Carlo tail events.)',
            resetAfter: true
          }
        },
        {
          factorId: 'poa',
          action: 'focus',
          narrative: 'Probability of Action captures how likely attackers are to weaponize a contact. For ransomware, once a campaign targets you, they almost always act — PoA is 0.9 to 1.0 (90–100%). Ransomware operators are motivated and persistent.',
          scenarioContext: 'Ransomware-as-a-Service lowers the barrier: attackers rent tools and infrastructure, making follow-through nearly certain once they\'ve identified a target.',
          whyTheseNumbers: 'PoA of 0.9–1.0 reflects high attacker motivation. Unlike opportunistic scans, ransomware campaigns are deliberate. If you\'re in their sights, they will act.'
        },
        {
          factorId: 'vuln',
          action: 'expand',
          narrative: 'Now let\'s estimate Vulnerability — the probability that a ransomware attempt succeeds. This is where your defenses matter. We\'ll decompose this into Threat Capability vs. Resistance Strength.',
          scenarioContext: 'Your defenses include email filtering, endpoint detection, network segmentation, and offline backups. But ransomware evolves fast, and users click on things.',
          whyTheseNumbers: null
        },
        {
          factorId: 'tcap',
          action: 'focus',
          narrative: 'Threat Capability is the skill and resources attackers bring. Modern ransomware groups rate 60–90 on a 0–100 scale. They use stolen credentials, exploit zero-days, and evade detection for weeks.',
          scenarioContext: 'Groups like REvil and Conti operate like businesses: custom malware, 24/7 support, negotiation teams. They probe defenses methodically.',
          whyTheseNumbers: 'TCap of 0.6–0.9 reflects sophisticated adversaries with access to exploit markets, custom tools, and lateral movement techniques. Not script kiddies.'
        },
        {
          factorId: 'rs',
          action: 'focus',
          narrative: 'Resistance Strength is how well your controls hold up. We rate your defenses at 20–40 on the same 0–100 scale. Email filters catch most, but phishing still gets through. Endpoint detection is reactive, not proactive. Backups exist but aren\'t always tested.',
          scenarioContext: 'Your security stack is solid but not world-class. Patching lags by 30 days. Network segmentation is partial. User training is annual, not ongoing.',
          whyTheseNumbers: 'RS of 0.2–0.4 is realistic for mid-market: good hygiene, but gaps remain. TCap exceeds RS in most simulations, meaning vulnerability is often 100% (threat wins). This drives the 0.1–0.6 annual LEF.',
          experiment: {
            prompt: 'Increase Resistance Strength to 0.5–0.7 to model improved segmentation and offline backups. See how vulnerability drops.',
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
          narrative: 'Now that we know how often ransomware hits, let\'s estimate the cost when it does. Loss Magnitude (LM) is the financial damage per incident. For enterprise ransomware, we\'re looking at $1M to $8M per event, driven by downtime, response, and recovery.',
          scenarioContext: 'When ransomware locks your file servers, operations stop. Sales teams can\'t access contracts. Finance can\'t close books. Engineering can\'t ship code. Every hour costs money.',
          whyTheseNumbers: 'LM of $1M–$8M reflects 3–7 days of partial outage affecting 2,000 users, plus forensics, ransom decisions, and rebuild costs. This matches industry data for mid-market ransomware.'
        },
        {
          factorId: 'primary',
          action: 'expand',
          narrative: 'Loss Magnitude splits into Primary (direct costs) and Secondary (ripple effects). Let\'s start with Primary — the immediate, tangible costs: lost productivity, incident response, and asset replacement.',
          scenarioContext: 'Primary costs are what you pay to get back to normal: staff downtime, forensic consultants, ransom negotiation, and rebuilding servers.',
          whyTheseNumbers: null
        },
        {
          factorId: 'productivity',
          action: 'focus',
          narrative: 'Productivity loss is revenue and output lost during downtime. With file servers encrypted for 3–5 days, we estimate $500K to $3M in lost productivity. Sales stop. Projects stall. Customers wait.',
          scenarioContext: 'Your organization generates $150M annual revenue. A 5-day outage affecting 60% of staff translates to roughly $2M in lost output ($150M ÷ 250 workdays × 5 days × 60%).',
          whyTheseNumbers: 'Productivity of $500K–$3M is conservative. This includes direct revenue loss, delayed projects, and overtime to catch up. The wide range reflects uncertainty in outage duration.'
        },
        {
          factorId: 'response',
          action: 'focus',
          narrative: 'Response costs cover investigation, containment, and recovery. You\'ll pay for forensic analysts ($300/hr), ransom negotiators, legal counsel, and internal staff time. We estimate $200K to $2M.',
          scenarioContext: 'A ransomware incident response typically involves: 2–4 forensic consultants for 2 weeks ($200K), legal review ($50K), 10 internal IT staff working overtime ($150K), and potential ransom payment or refusal costs.',
          whyTheseNumbers: 'Response of $200K–$2M includes external consultants, internal labor, and decision-making costs (pay ransom vs. rebuild). The upper bound assumes negotiation with threat actors and extensive forensics.'
        },
        {
          factorId: 'replacement',
          action: 'focus',
          narrative: 'Replacement costs are for rebuilding compromised infrastructure. Even with backups, you\'ll replace servers, re-image endpoints, and restore data. We estimate $200K to $3M.',
          scenarioContext: 'Your file servers run on 20 physical hosts. Full rebuild means: new OS images, restored data from backups (which may be partially compromised), and reconfiguration of access controls.',
          whyTheseNumbers: 'Replacement of $200K–$3M covers hardware refresh ($500K), software re-licensing if keys were compromised ($200K), and 4–6 weeks of system rebuild labor ($1M+). Upper bound assumes backup corruption requiring partial data recreation.',
          experiment: {
            prompt: 'Reduce Replacement to $100K–$500K to model pristine offline backups with fast recovery. The Median and 90th Percentile should drop — this is the ROI of good backup practices.',
            resetAfter: true
          }
        }
      ]
    },
    {
      title: 'Chapter 3: Understanding Ripple Effects',
      steps: [
        {
          factorId: 'secondary',
          action: 'expand',
          narrative: 'Primary costs are visible, but Secondary losses — customer reactions, regulatory penalties, competitive damage — often exceed them. Let\'s decompose Secondary loss into probability (SLEF) and magnitude (SLM).',
          scenarioContext: 'If ransomware leaks to the press or triggers breach notifications, you face regulatory scrutiny, customer churn, and reputational damage that persists for years.',
          whyTheseNumbers: null
        },
        {
          factorId: 'slef',
          action: 'focus',
          narrative: 'Secondary Loss Event Frequency (SLEF) is the probability that a ransomware incident triggers secondary consequences. For enterprise file servers, SLEF is 0.6 to 1.0 (60–100%) — ransomware almost always becomes public knowledge.',
          scenarioContext: 'Modern ransomware groups leak stolen data if ransom isn\'t paid. Customers notice when you\'re offline for 5 days. Breach notification laws require disclosure if PII was accessed.',
          whyTheseNumbers: 'SLEF of 0.6–1.0 reflects high visibility: ransomware operators publicize victims on leak sites, customers demand explanations, and regulators ask questions. Silence is nearly impossible.'
        },
        {
          factorId: 'slm',
          action: 'expand',
          narrative: 'Secondary Loss Magnitude (SLM) quantifies the long-term damage. We estimate $1M to $15M, driven by reputation, competitive position, and regulatory fines. Let\'s break down the components.',
          scenarioContext: 'Secondary losses play out over 12–24 months: customer contracts cancelled, sales cycles elongated due to security concerns, and regulatory investigations.',
          whyTheseNumbers: null
        },
        {
          factorId: 'fines',
          action: 'focus',
          narrative: 'Regulatory fines for ransomware depend on whether PII was exfiltrated. If file servers contained customer data and backups were insufficient (proving inadequate security), fines could reach $0 to $5M under GDPR, HIPAA, or state laws.',
          scenarioContext: 'Your file servers hold HR records (SSNs, salaries) and customer contracts. If ransomware operators exfiltrated data before encryption, you face breach notification laws and potential fines.',
          whyTheseNumbers: 'Fines of $0–$5M reflect regulatory risk. The mode is $1M (mid-range penalty for inadequate controls), but could reach $5M if negligence is proven (e.g., unpatched systems, no encryption).'
        },
        {
          factorId: 'reputation',
          action: 'focus',
          narrative: 'Reputation damage is the hardest to quantify but often the largest cost. Customer churn, elongated sales cycles, and brand erosion cost $500K to $8M over two years.',
          scenarioContext: 'Post-ransomware, 15% of customers delay renewals pending security audits. New customer acquisition costs increase 20% as prospects demand SOC 2 reports. You hire a PR firm to manage fallout.',
          whyTheseNumbers: 'Reputation of $500K–$8M models 10–15% customer churn ($2M annual revenue loss over 2 years) plus increased sales friction ($500K in extended cycles and discounts to close deals).'
        },
        {
          factorId: 'competitive',
          action: 'focus',
          narrative: 'Competitive advantage loss occurs when ransomware exposes strategic data — roadmaps, pricing, M&A plans. If threat actors leak your files, competitors gain intelligence. We estimate $300K to $4M in lost competitive position.',
          scenarioContext: 'File servers contain product roadmaps, pricing strategies, and partnership agreements. If leaked, competitors undercut your bids and poach customers with inside knowledge.',
          whyTheseNumbers: 'Competitive of $300K–$4M reflects 2–3 lost deals ($1M each) due to competitor intelligence, plus defensive price cuts to retain customers who know your margins.',
          experiment: {
            prompt: 'Increase Competitive loss to $1M–$10M to model intellectual property exfiltration (source code, patents). See how secondary losses can dominate.',
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
          narrative: 'You\'ve estimated every factor. Now look at the results. The Loss Exceedance Curve shows the full risk distribution. The 90th percentile is your "bad but plausible" number — the loss you\'ll exceed 10% of the time. For ransomware, this is often $2M–$10M annually. Notice how the tail extends: low-frequency, high-impact risks have wide uncertainty. The breakdown shows Secondary losses often exceed Primary. This is the signature of ransomware: the attack costs less than the aftermath. Use these results to prioritize controls (raise Resistance Strength), plan budgets (the 90th percentile is your reserve), and communicate risk to executives (show them the curve, not just the mean).',
          scenarioContext: 'Your board asked: "What\'s our ransomware exposure?" You can now answer: "We expect 0.1–0.6 incidents per year, costing $1M–$8M each, with a 10% chance of exceeding $5M annually. Secondary losses — reputation, fines, competitive damage — drive 60% of the total. Investing $500K in network segmentation and offline backups could cut our 90th percentile by $2M."',
          whyTheseNumbers: 'This is FAIR in action: decomposing an abstract question ("How bad is ransomware?") into estimable factors (CF, PoA, TCap, RS, Productivity, etc.), then combining them into a defensible risk number. The result isn\'t a false precision — it\'s a structured estimate that makes your assumptions visible and testable.'
        }
      ]
    }
  ]
};
