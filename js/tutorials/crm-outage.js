/**
 * SaaS CRM Outage Tutorial
 * Intermediate difficulty - Understanding third-party dependency risks
 */

export default {
  id: 'crm-outage',
  title: 'SaaS CRM Outage Tutorial',
  subtitle: 'Understanding third-party dependency risks',
  difficulty: 'intermediate',
  estimatedMinutes: 15,
  scenarioIndex: 17,

  chapters: [
    {
      title: 'Chapter 1: Understanding Frequency',
      steps: [
        {
          factorId: 'lef',
          action: 'focus',
          narrative: 'Loss Event Frequency (LEF) for SaaS CRM outages represents incidents where your sales team cannot access Salesforce or a similar CRM platform, halting sales operations. We estimate 5 to 100 outages per year, ranging from brief (15-minute) glitches to major (8-hour) platform failures. This reflects that SaaS platforms are generally reliable but not perfect.',
          scenarioContext: 'Your organization depends on Salesforce for all sales operations. Sales reps (150 people) use it to track leads, update opportunities, schedule calls, and close deals. When Salesforce is down, sales stop — reps can\'t access customer data, view pipeline, or log activities.',
          whyTheseNumbers: 'LEF of 5–100/year captures the range from minor (monthly brief outages) to major (weekly microoutages + quarterly large failures). Most SaaS platforms advertise 99.9% uptime (8 hours downtime/year), but when you include performance degradation (slowness that prevents work), effective LEF is higher.'
        },
        {
          factorId: 'tef',
          action: 'expand',
          narrative: 'LEF decomposes into Threat Event Frequency (TEF) and Vulnerability. Let\'s expand to see TEF — how often outage-causing events occur at the SaaS provider, whether or not they affect your organization.',
          scenarioContext: 'Salesforce experiences infrastructure issues regularly: database failures, network partitions, deployment bugs, DDoS attacks on their platform. Most are caught by their failover systems before customers notice. You see only the incidents that breach their redundancy.',
          whyTheseNumbers: null
        },
        {
          factorId: 'cf',
          action: 'focus',
          narrative: 'Contact Frequency (CF) represents infrastructure events at the SaaS provider that could cause outages — database crashes, network splits, bad deployments, AWS region failures. We estimate 10 to 100 such events per year across all Salesforce instances. Your organization experiences a subset based on which pod (instance) you\'re on.',
          scenarioContext: 'SaaS platforms run on distributed infrastructure with hundreds of database pods, network zones, and microservices. A database primary failover in your pod causes a 2-minute blip. An AWS region outage affecting your pod\'s zone causes a 4-hour outage. A bad deployment to all pods causes global slowness.',
          whyTheseNumbers: 'CF of 10–100/year reflects enterprise SaaS platform complexity. This is lower than DDoS (CF=50–500) because SaaS providers invest heavily in redundancy. Higher than ransomware (CF=5–50) because infrastructure failures happen more frequently than targeted attacks.',
          experiment: {
            prompt: 'Try reducing Contact Frequency to 5–30 to model a tier-1 SaaS provider with 99.99% uptime (Salesforce, Workday). Watch the Median and 90th Percentile — fewer outages directly reduces annualized loss.',
            resetAfter: true
          }
        },
        {
          factorId: 'poa',
          action: 'focus',
          narrative: 'Probability of Action (PoA) is the likelihood that an infrastructure event actually causes a customer-visible outage (not masked by failover). We estimate 0.5–1.0 (50–100%). This reflects that while SaaS providers have redundancy, many outages still propagate to customers because the event exceeds failover capacity or affects a shared component.',
          scenarioContext: 'PoA scenarios: database replica lag (PoA=0.5, mitigated by failover), database primary crash during heavy load (PoA=0.8, failover is slow), network partition isolating your pod (PoA=1.0, no failover available), global authentication service failure (PoA=1.0, affects all pods).',
          whyTheseNumbers: 'PoA of 0.5–1.0 reflects that SaaS redundancy works but isn\'t perfect. Unlike brute force (where PoA≈1.0 because automation guarantees action), SaaS outage PoA depends on the blast radius: pod-level failures often fail over successfully (PoA=0.5), but region-level or global failures propagate to customers (PoA=1.0).'
        },
        {
          factorId: 'vuln',
          action: 'expand',
          narrative: 'Vulnerability is the probability that an outage actually halts your sales operations (not absorbed by workarounds). This depends on Threat Capability (outage duration and scope) versus Resistance Strength (your fallback processes and data caching). Let\'s decompose it.',
          scenarioContext: 'Your defenses against CRM outages: sales reps can work from cached browser data during brief outages (5 minutes), use offline notes in Google Docs for longer outages (1 hour), and manually track leads in spreadsheets during extended outages (4+ hours). But you can\'t close deals without CRM access (contract templates, approval workflows).',
          whyTheseNumbers: null
        },
        {
          factorId: 'tcap',
          action: 'focus',
          narrative: 'Threat Capability (TCap) for SaaS outages is the outage duration and scope, rated 0.5–0.9 on a 0–100 scale. Brief outages (<15 minutes, TCap=0.5) are absorbed by cached data and user patience. Prolonged outages (4+ hours, TCap=0.9) halt all sales operations because manual workarounds don\'t scale. Partial outages (reports down, data entry works, TCap=0.6) degrade but don\'t stop work.',
          scenarioContext: 'Outage types: 5-minute blip during database failover (TCap=0.5, users refresh and continue), 2-hour API outage (TCap=0.7, can read but not update records), 8-hour full platform outage (TCap=0.9, all sales work stops), multi-day outage like AWS S3 in 2017 (TCap=1.0, existential crisis).',
          whyTheseNumbers: 'TCap of 0.5–0.9 scales with outage duration. SaaS providers publish uptime metrics, but from a business perspective, 5 minutes of downtime during quarter-end is more damaging than 2 hours mid-week in January. TCap captures not just duration but also business context.'
        },
        {
          factorId: 'rs',
          action: 'focus',
          narrative: 'Resistance Strength (RS) is your ability to continue sales operations during CRM outages. We rate your workarounds at 0.3–0.7 on a 0–100 scale. You have offline processes (manual notes, spreadsheets), but they\'re inefficient and don\'t support critical workflows like contract approvals or pipeline reporting. Sales productivity drops 50–80% during outages.',
          scenarioContext: 'Your workarounds: reps can take notes locally and sync later (handles brief outages), maintain a static copy of their pipeline in Google Sheets (updates daily, stale during outage), but can\'t generate contracts (templates in CRM), run forecasts (data in CRM), or get manager approvals (workflow in CRM). For outages >2 hours, sales effectively stop.',
          whyTheseNumbers: 'RS of 0.3–0.7 reflects limited resilience. Unlike owned infrastructure (where you can implement failover, raise RS to 0.9), you can\'t control SaaS platform availability. Your only defense is offline workflows, which are clunky and incomplete. Higher RS requires dual-vendor strategy (Salesforce + HubSpot in parallel, expensive) or robust offline-first architecture.',
          experiment: {
            prompt: 'Increase Resistance Strength to 0.6–0.9 to model implementing offline-first sales processes (local CRM replica, manual workflows for approvals). The Median should drop, but not as dramatically — you still lose productivity during outages even with workarounds.',
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
          narrative: 'Loss Magnitude (LM) for SaaS CRM outages is $150K to $4M per incident, driven almost entirely by lost sales productivity. This is the highest single-incident cost we\'ve seen except ransomware ($1M–$8M). The unique factor: Response and Replacement costs are $0 (you don\'t own the platform, the SaaS provider is responsible for fixing it). All cost is Productivity — lost sales capacity.',
          scenarioContext: 'When Salesforce goes down for 4 hours during quarter-end, your 150 sales reps can\'t close deals, update opportunities, or access customer history. Deals worth $2M–$10M are in closing stages. Every hour of delay risks losing the deal to competitors or missing quarterly targets that trigger executive bonuses.',
          whyTheseNumbers: 'LM of $150K–$4M reflects sales team value. Lower end: 2-hour off-peak outage, minimal deal impact. Upper end: 8-hour outage during last week of quarter, $10M in deals delayed or lost, quarterly targets missed, executive comp affected. Compare to DDoS (LM=$50K–$800K, e-commerce revenue loss) — SaaS outages can be even more costly for sales-dependent businesses.'
        },
        {
          factorId: 'primary',
          action: 'expand',
          narrative: 'Primary losses for SaaS outages are unusual: Productivity is massive ($150K–$4M), but Response and Replacement are $0. You can\'t "fix" a SaaS outage (that\'s the provider\'s job), and you don\'t replace infrastructure (it\'s not yours). All primary loss is lost sales time.',
          scenarioContext: 'Unlike ransomware (where you pay forensics, rebuild servers) or DDoS (where you pay for emergency mitigation), SaaS outages put you in a helpless waiting state. Your only response is to notify your team, set up manual workarounds, and wait for the provider to restore service. All cost is sales team downtime.',
          whyTheseNumbers: null
        },
        {
          factorId: 'productivity',
          action: 'focus',
          narrative: 'Productivity loss for CRM outages is $150K to $4M, the entire Loss Magnitude. This reflects that your 150-person sales team generates $200M annual revenue. When they can\'t access the CRM, they can\'t close deals, update forecasts, or coordinate handoffs. Every hour of CRM downtime is $23K–$100K in lost sales capacity (higher during quarter-end).',
          scenarioContext: 'Productivity calculation: $200M annual sales ÷ 250 workdays ÷ 8 hours = ~$100K/hour in sales capacity. During peak periods (last week of quarter), deal velocity is 3–5x higher, so hourly cost rises to $300K–$500K. A 4-hour outage during quarter-end = $1.2M–$2M in missed quota. Lower-end: 2-hour mid-quarter outage = $200K lost capacity.',
          whyTheseNumbers: 'Productivity of $150K–$4M dominates the loss profile. This is 10x higher than other threats\' productivity losses because the CRM is a single point of failure for all sales operations. Unlike phishing (where one employee is compromised) or laptop theft (one device lost), CRM outage affects all 150 reps simultaneously. This is the power of dependency risk.'
        },
        {
          factorId: 'response',
          action: 'focus',
          narrative: 'Response costs are $0 for SaaS outages. You don\'t investigate (the provider does), you don\'t contain (nothing to contain on your side), and you don\'t recover (the provider restores service). Your only "response" is setting up manual workarounds, which is captured in Productivity loss (reduced efficiency).',
          scenarioContext: 'Your actions during a Salesforce outage: post an internal alert ("CRM is down, use offline notes"), monitor Salesforce status page, update leadership on ETA, prepare to sync offline work when service returns. Total staff time: 2–4 hours across IT and sales leadership. Cost: <$1K, rounds to $0 in FAIR estimation.',
          whyTheseNumbers: 'Response of $0 is unique to SaaS dependency scenarios. You have zero control over the infrastructure, so zero responsibility (and zero cost) for fixing it. This contrasts with owned-infrastructure outages (DDoS Response=$20K–$400K, ransomware Response=$200K–$2M). The trade-off of SaaS: lower operational burden, but total reliance on vendor.'
        },
        {
          factorId: 'replacement',
          action: 'focus',
          narrative: 'Replacement costs are $0 for SaaS outages. There\'s no infrastructure to replace (you don\'t own the servers), no software to rebuild (the provider patches their code), no credentials to rotate (unless there was a breach, which this scenario is not). Replacement only applies to owned assets.',
          scenarioContext: 'After a Salesforce outage, you don\'t replace anything. The service comes back online, reps sync their offline notes, and work resumes. The only post-outage action might be reviewing whether to implement offline-first workflows (captured in future capital expenses, not this incident\'s replacement cost).',
          whyTheseNumbers: 'Replacement of $0 highlights the SaaS value proposition: outsourced infrastructure means outsourced recovery costs. When Salesforce has a database failure, they replace hardware and restore from backups — you pay $0. The flip side: you also have zero control over recovery time. This is a fundamental trade-off in cloud dependencies.'
        }
      ]
    },
    {
      title: 'Chapter 3: Understanding Ripple Effects',
      steps: [
        {
          factorId: 'secondary',
          action: 'expand',
          narrative: 'Secondary losses for SaaS CRM outages are minimal compared to Primary losses. Unlike ransomware (where Secondary often exceeds Primary), CRM outages rarely trigger regulatory consequences, long-term reputation damage, or competitive intelligence loss. Customers don\'t know your CRM is down — they just notice you\'re slow to respond. Let\'s decompose into SLEF and SLM.',
          scenarioContext: 'Secondary consequences appear when CRM outages cause you to miss SLA response times (triggering contractual penalties), lose deals to competitors due to delayed quotes, or damage reputation by failing to deliver on promises made before the outage.',
          whyTheseNumbers: null
        },
        {
          factorId: 'slef',
          action: 'focus',
          narrative: 'Secondary Loss Event Frequency (SLEF) is the probability that a CRM outage triggers lasting external consequences. We estimate 0.01 to 0.1 (1–10%), much lower than ransomware (60–100%) or DDoS (5–30%). Most CRM outages are invisible to customers — you\'re delayed but catch up when service returns. SLEF rises only when outages cause visible service failures.',
          scenarioContext: 'Low SLEF scenarios: 2-hour mid-week outage, reps catch up the next day, customers don\'t notice (SLEF≈1%). High SLEF scenarios: 8-hour outage causes you to miss contractual response SLAs, customers invoke penalty clauses (SLEF≈10%). Or quarter-end outage causes you to miss quota, triggering executive compensation clawbacks and board scrutiny (SLEF≈5%).',
          whyTheseNumbers: 'SLEF of 0.01–0.1 reflects that most outages are absorbed internally. Unlike data breaches (which require public notification), outages are operational hiccups that customers rarely learn about. Secondary losses occur only when the outage causes externally visible failures (missed SLAs, lost deals, public complaints).'
        },
        {
          factorId: 'slm',
          action: 'expand',
          narrative: 'Secondary Loss Magnitude (SLM) when CRM outages do cause external consequences is $15K to $100K, driven by SLA penalties, reputation damage from missed commitments, and competitive losses when deals are lost. This is tiny compared to Primary ($150K–$4M), confirming that CRM outage risk is productivity-driven, not reputation-driven. Let\'s break it down.',
          scenarioContext: 'If a CRM outage causes you to miss response SLAs with enterprise customers, they may invoice you for penalties ($10K–$50K). If deals are lost to competitors because you couldn\'t deliver quotes on time, you lose future revenue. If the outage is severe enough to make news ("Company X blames Salesforce for missing quarterly targets"), brand damage follows.',
          whyTheseNumbers: null
        },
        {
          factorId: 'fines',
          action: 'focus',
          narrative: 'Regulatory fines for CRM outages are minimal ($0–$10K), appearing only when you have contractual SLAs with customers that include response-time penalties. If your support SLA promises 2-hour response and a CRM outage prevents that, customers may claim SLA credits. There are no regulatory fines (no data breach, no PII exposure).',
          scenarioContext: 'Fines = contractual SLA penalties. If your enterprise contracts include "respond to tickets within 2 hours or credit 10% of monthly fee," and a 4-hour CRM outage causes you to miss 50 tickets, customers claim $10K in credits. This is rare because most SLAs include force majeure clauses excusing outages caused by third-party providers.',
          whyTheseNumbers: 'Fines of $0–$10K reflect limited contractual exposure. Most B2B contracts include vendor-outage exceptions. The $10K upper bound represents aggressive enterprise customers who successfully argue that your dependency on a single SaaS provider (without failover) constitutes negligence that doesn\'t qualify for force majeure protection.'
        },
        {
          factorId: 'reputation',
          action: 'focus',
          narrative: 'Reputation damage from CRM outages is modest ($5K–$50K). Customers are understanding when a well-known SaaS platform (Salesforce, HubSpot) goes down — "It\'s not your fault." Reputation loss occurs when outages are frequent enough to suggest you chose an unreliable vendor, or when outages cause you to publicly miss commitments (delayed responses, missed quotes).',
          scenarioContext: 'Reputation scenarios: single 2-hour outage, customers experience slight delay in responses, you explain "Salesforce was down," no lasting damage (Reputation≈$5K). Quarterly outages over a year, customers start questioning your infrastructure choices, some delay renewals pending reliability improvements (Reputation≈$20K–$50K).',
          whyTheseNumbers: 'Reputation of $5K–$50K is minor compared to ransomware (Reputation=$500K–$8M) or DDoS (Reputation=$5K–$500K). CRM outages don\'t breach customer trust because no customer data was compromised. The only reputation hit is "they\'re occasionally unresponsive," which is easily explained and forgiven if infrequent.'
        },
        {
          factorId: 'competitive',
          action: 'focus',
          narrative: 'Competitive advantage loss from CRM outages is minimal ($0–$40K), occurring only when you lose specific deals to competitors because you couldn\'t deliver quotes, proposals, or respond to RFPs on time. Most deals can be delayed without losing the customer. Competitive loss appears when timing is critical (RFP deadlines, competitor also bidding).',
          scenarioContext: 'Competitive loss mechanisms: CRM outage prevents you from submitting a proposal by RFP deadline, competitor wins by default ($20K–$40K lost deal). Or quarter-end outage delays your quote, customer signs with competitor who responded faster ($10K–$30K). But most sales cycles have flexibility — delayed by a day doesn\'t mean lost forever.',
          whyTheseNumbers: 'Competitive of $0–$40K represents rare deal-loss scenarios. Most B2B sales cycles span weeks or months, so a 4-hour delay is absorbed. The $40K upper bound reflects losing 1–2 deals per year due to CRM-outage timing. Compare to DDoS (Competitive=$5K–$400K, where prolonged outages send customers to competitors permanently) — CRM outages rarely cause strategic competitive disadvantage.',
          experiment: {
            prompt: 'Increase Competitive loss to $100K–$1M to model a scenario where quarter-end CRM outage causes you to miss quota, lose sales leadership talent to competitors. See how secondary losses can compound.',
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
          narrative: 'You\'ve estimated all factors. Examine the results. The Loss Exceedance Curve shows your risk distribution. The 90th percentile is typically $600K–$5M annually for SaaS CRM dependency risk. Notice the unique loss profile: 95–98% of loss is Productivity (Primary), only 2–5% is Secondary. Response and Replacement are $0. This reveals CRM outages as pure productivity-destruction events, unlike ransomware (Secondary dominates) or DDoS (Response costs are huge). The breakdown shows your organization is entirely dependent on a single SaaS vendor for revenue-critical operations. This is a different risk category: vendor dependency risk. Compare control strategies: ransomware (backups, segmentation raise RS), DDoS (CDN capacity raises RS), CRM outage (dual-vendor or offline-first architecture raises RS, but at massive complexity cost). Use these results to make build-vs-buy decisions: the 90th percentile CRM outage risk ($3M annually) must be weighed against the cost of operating your own CRM (staff, infrastructure, reliability). For most organizations, SaaS is still cheaper despite outage risk. But for sales-critical enterprises, the math may favor owned infrastructure or dual-vendor strategies. The curve also reveals timing criticality: outages during quarter-end cost 5–10x more than off-peak. This justifies peak-period contingency planning (offline sales processes ready, escalation paths to vendor).',
          scenarioContext: 'Your CFO asked: "Should we implement a dual-vendor CRM strategy (Salesforce + HubSpot in parallel) to eliminate outage risk?" You can now answer: "We face 10–100 CRM outage events per year, costing $150K–$4M each in lost sales productivity, with a 10% chance of exceeding $4M annually during quarter-end. Current reliance on a single vendor (RS=0.3–0.7) means we have no failover. Dual-vendor would raise RS to 0.8–0.95 (both platforms down simultaneously is rare), cutting our 90th percentile risk from $4M to $500K — a $3.5M annual risk reduction. But dual-vendor costs $500K annually (licenses, integration, training). ROI is 7x, and the protection is most valuable during quarter-end when a single outage could cost $2M–$4M. For a sales-dependent business, this is justified insurance."',
          whyTheseNumbers: 'CRM outage illustrates vendor dependency risk where control is surrendered for operational efficiency. Unlike threats you can directly mitigate (phishing via training, ransomware via backups), SaaS outages are entirely outside your control. Your only defenses are vendor selection (choose highly reliable platforms), architectural redundancy (dual-vendor, offline-first), or acceptance (treat outages as cost of doing business). The FAIR model reveals that for revenue-critical SaaS dependencies, the cost of redundancy (dual-vendor strategy) is often justified by the tail risk (rare but catastrophic quarter-end outage). This tutorial teaches that some risks are best addressed through architectural choices (reduce single points of failure) rather than operational controls (which don\'t apply to third-party infrastructure).'
        }
      ]
    }
  ]
};
