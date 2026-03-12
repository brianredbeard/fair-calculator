/**
 * DDoS on Public Website Tutorial
 * Intermediate difficulty - Understanding availability threats
 */

export default {
  id: 'ddos',
  title: 'DDoS on Public Website Tutorial',
  subtitle: 'Understanding availability threats',
  difficulty: 'intermediate',
  estimatedMinutes: 15,
  scenarioIndex: 9,

  chapters: [
    {
      title: 'Chapter 1: Understanding Frequency',
      steps: [
        {
          factorId: 'lef',
          action: 'focus',
          narrative: 'Loss Event Frequency (LEF) for DDoS attacks represents successful outages that exceed your mitigation capacity per year. We estimate 40 to 500 incidents annually. This reflects that DDoS is extremely common (automated botnets attack constantly) but most attacks are small and easily absorbed. The losses come from the 10–20% of attacks large enough to overwhelm your defenses.',
          scenarioContext: 'Your organization runs a public-facing e-commerce website generating $50M annual revenue. The site is your primary sales channel. DDoS attacks ranging from 1 Gbps (easily handled) to 500 Gbps (overwhelming) hit your infrastructure regularly.',
          whyTheseNumbers: 'LEF of 40–500/year means daily to weekly successful outages. This seems high until you realize most "successful" attacks only cause partial degradation (slower page loads, not full outage). The wide range reflects uncertainty in attacker motivation and your mitigation effectiveness.'
        },
        {
          factorId: 'tef',
          action: 'expand',
          narrative: 'LEF decomposes into Threat Event Frequency (TEF) and Vulnerability. Let\'s expand to see TEF — how often DDoS attacks target your infrastructure, whether or not they exceed your capacity.',
          scenarioContext: 'Your CDN and DDoS mitigation service (Cloudflare, Akamai, AWS Shield) blocks thousands of small attacks weekly. You only notice the attacks that breach your mitigation thresholds.',
          whyTheseNumbers: null
        },
        {
          factorId: 'cf',
          action: 'focus',
          narrative: 'Contact Frequency (CF) is how often DDoS attacks target your website. We estimate 50 to 500 significant attack events per year (1–10 per week). This is much higher than ransomware (CF=5–50) because DDoS-for-hire services make attacks cheap and accessible. Attackers range from script kiddies testing botnets to competitors disrupting your sales, to extortionists demanding payment.',
          scenarioContext: 'DDoS attacks come from multiple sources: competitors during peak sales periods (Black Friday), extortion attempts ("pay us or we keep attacking"), hacktivists protesting your business practices, and random botnet operators testing stolen credentials. Most attacks are small (<10 Gbps), but large attacks (100+ Gbps) happen monthly.',
          whyTheseNumbers: 'CF of 50–500/year reflects commoditized DDoS. Services like "Stresser" or "Booter" rent botnet capacity for $20/hour. Anyone can launch an attack. This is higher than most cyber threats except phishing (CF=1000+), but phishing requires human action while DDoS is fully automated.',
          experiment: {
            prompt: 'Try reducing Contact Frequency to 20–200 to model lower visibility (unlisted domain, no controversies). Watch the Median and 90th Percentile — lower public exposure means fewer attacks.',
            resetAfter: true
          }
        },
        {
          factorId: 'poa',
          action: 'focus',
          narrative: 'Probability of Action (PoA) for DDoS is 0.8–1.0 (80–100%), the highest of all common threats. Once an attacker targets your domain, launching the attack is trivial — often a single command or API call to a botnet. There\'s no reconnaissance required, no social engineering, just point the botnet at your IP and press go.',
          scenarioContext: 'DDoS-for-hire services provide web interfaces where attackers enter your IP address, select attack duration (1 hour, 24 hours), choose attack vector (volumetric, application-layer, protocol), and click "Start Attack." No technical skill required. Payment is in cryptocurrency, often $20–$200 for a 24-hour attack.',
          whyTheseNumbers: 'PoA of 0.8–1.0 reflects zero-friction attacks. Unlike brute force (which requires sustained effort) or phishing (which requires crafting emails), DDoS is fire-and-forget. The only reason PoA isn\'t 1.0 is that some targeted domains turn out to be protected by enterprise DDoS mitigation, discouraging follow-up attacks.'
        },
        {
          factorId: 'vuln',
          action: 'expand',
          narrative: 'Vulnerability is the probability that a DDoS attack exceeds your mitigation capacity, causing customer-visible outages. This depends on Threat Capability (attack size and sophistication) versus Resistance Strength (your bandwidth, CDN capacity, DDoS mitigation). Let\'s decompose it.',
          scenarioContext: 'Your defenses include: CloudFlare CDN with 100 Tbps global capacity, rate limiting (10,000 requests/min per IP), CAPTCHA challenges for suspicious traffic, and auto-scaling behind the CDN. But application-layer attacks targeting expensive database queries can bypass volumetric defenses.',
          whyTheseNumbers: null
        },
        {
          factorId: 'tcap',
          action: 'focus',
          narrative: 'Threat Capability (TCap) for DDoS is 0.5–0.9 on a 0–100 scale, reflecting attack diversity. Small botnets (10 Gbps) rate 0.5 — easily mitigated. Large botnets (500 Gbps) or sophisticated application-layer attacks (HTTP floods targeting search endpoints) rate 0.9 — very difficult to stop without degrading legitimate traffic.',
          scenarioContext: 'Attack types vary: volumetric floods (SYN floods, UDP amplification) overwhelm bandwidth, protocol attacks (TCP state exhaustion) exhaust server resources, and application-layer attacks (HTTP GET floods requesting expensive database operations) bypass network-layer defenses and target application logic.',
          whyTheseNumbers: 'TCap of 0.5–0.9 reflects attack evolution. Basic volumetric attacks are well-understood and mitigated by CDNs. But attackers increasingly use application-layer attacks that mimic legitimate traffic, making filtering hard. A 10 Gbps application-layer attack can cause more damage than a 100 Gbps volumetric flood.'
        },
        {
          factorId: 'rs',
          action: 'focus',
          narrative: 'Resistance Strength (RS) is your DDoS mitigation effectiveness. We rate your defenses at 0.3–0.7 on a 0–100 scale. Your CDN handles most volumetric attacks, but application-layer attacks and attacks exceeding 200 Gbps sometimes break through. Rate limiting and CAPTCHA help, but also degrade user experience, so thresholds are set conservatively.',
          scenarioContext: 'Your mitigation stack: CloudFlare absorbs up to 100 Gbps automatically, application servers auto-scale to 50 instances, rate limiting kicks in at 10,000 req/min per IP. But attackers using millions of botnet IPs (each sending 5 req/min) bypass per-IP limits. Application-layer attacks requesting search for "a*" (wildcard) cause expensive database full-table scans, overwhelming backends despite low request volume.',
          whyTheseNumbers: 'RS of 0.3–0.7 reflects that DDoS defense is a cat-and-mouse game. You block volumetric floods → attackers switch to application-layer. You add rate limiting → attackers use more IPs. You challenge suspicious traffic with CAPTCHA → legitimate users complain. There\'s no perfect defense, only probabilistic mitigation.',
          experiment: {
            prompt: 'Increase Resistance Strength to 0.6–0.9 to model upgrading to enterprise DDoS mitigation (AWS Shield Advanced, 10 Tbps capacity). See how vulnerability decreases but doesn\'t reach zero.',
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
          narrative: 'Loss Magnitude (LM) for DDoS is $50K to $800K per significant incident, driven by lost revenue during outages, incident response (DDoS mitigation service surge pricing), and infrastructure upgrades post-attack. This is higher than phishing ($1K–$15K) and laptop theft ($15K–$210K), approaching ransomware territory ($1M–$8M) for long-duration attacks.',
          scenarioContext: 'When a DDoS attack overwhelms your defenses, your e-commerce site goes offline or becomes unusably slow. Revenue stops flowing. Customers can\'t check out. Support tickets flood in. You must engage emergency DDoS mitigation, scale infrastructure rapidly, and potentially pay extortion demands to stop the attack.',
          whyTheseNumbers: 'LM of $50K–$800K reflects attack duration and business impact. Lower end: 2-hour outage during off-peak, minimal revenue loss, quick mitigation. Upper end: 48-hour attack during Black Friday weekend, millions in lost sales, emergency mitigation contracts ($50K+), infrastructure upgrades to prevent recurrence.'
        },
        {
          factorId: 'primary',
          action: 'expand',
          narrative: 'Primary losses include lost revenue (Productivity), emergency response costs (hiring DDoS mitigation specialists, surge pricing from CDNs), and infrastructure replacement (upgrading bandwidth, adding scrubbing centers). For DDoS, all three components are substantial.',
          scenarioContext: 'Primary costs: lost sales during outage ($10K–$200K depending on duration), emergency DDoS mitigation service engagement ($20K–$100K), infrastructure scaling (additional CDN capacity, dedicated DDoS scrubbing, $20K–$200K).',
          whyTheseNumbers: null
        },
        {
          factorId: 'productivity',
          action: 'focus',
          narrative: 'Productivity loss for DDoS is primarily lost revenue — customers unable to purchase during the outage. We estimate $10K to $200K, depending on outage duration and business seasonality. A 4-hour outage during Black Friday costs 100x more than the same outage on a Tuesday in January.',
          scenarioContext: 'Productivity calculation: your site generates $50M annual revenue = ~$140K/day = ~$6K/hour. A 2-hour outage = ~$12K lost revenue. A 24-hour outage during peak shopping season (5x normal traffic) = ~$700K lost revenue. Plus staff overtime investigating and mitigating = $5K–$20K.',
          whyTheseNumbers: 'Productivity of $10K–$200K captures both lost sales and staff disruption. Lower end: short off-peak outage, minimal revenue impact. Upper end: multi-day attack during peak season, massive lost sales, entire engineering team working overtime to mitigate. Unlike confidentiality breaches (where cost is investigation), availability attacks directly destroy revenue.'
        },
        {
          factorId: 'response',
          action: 'focus',
          narrative: 'Response costs for DDoS are emergency mitigation services, which often charge surge pricing during active attacks. We estimate $20K to $400K. DDoS mitigation providers (Cloudflare, Akamai, Arbor Networks) charge $5K–$50K/month for enterprise plans, but emergency on-demand mitigation during an attack can cost $50K–$100K for 72 hours of protection.',
          scenarioContext: 'Response involves: activating emergency DDoS mitigation (if your standard plan is overwhelmed), engaging incident response team to identify attack vectors, communicating with customers via social media about outage, coordinating with ISP to implement upstream filtering, and potentially negotiating with extortionists (though payment is discouraged).',
          whyTheseNumbers: 'Response of $20K–$400K reflects mitigation service costs. Lower end: attack absorbed by existing CDN, internal team handles mitigation. Upper end: attack exceeds CDN capacity, emergency contract with DDoS specialist ($100K for 1 week of active mitigation), external consultants analyzing attack patterns ($50K), legal counsel if extortion demands are made ($20K).'
        },
        {
          factorId: 'replacement',
          action: 'focus',
          narrative: 'Replacement costs are infrastructure upgrades implemented post-attack to prevent recurrence. We estimate $20K to $200K. This includes upgrading CDN tier (more bandwidth capacity), adding dedicated DDoS scrubbing services, implementing rate limiting at multiple network layers, and potentially re-architecting application to be more resilient to application-layer attacks.',
          scenarioContext: 'Replacement involves: upgrading CDN from standard to enterprise plan ($20K–$50K annual increase), purchasing dedicated DDoS scrubbing hardware for on-prem traffic ($50K–$150K), adding anycast DNS to distribute traffic geographically ($10K setup), and refactoring expensive application endpoints (search, filters) to prevent resource exhaustion ($30K–$100K development).',
          whyTheseNumbers: 'Replacement of $20K–$200K reflects permanent capacity increases. Lower end: upgrade CDN tier, add basic rate limiting. Upper end: comprehensive DDoS defense overhaul including dedicated scrubbing centers, application-layer WAF rules, and caching expensive operations. Unlike laptop theft (replace one device), DDoS mitigation requires architectural changes.'
        }
      ]
    },
    {
      title: 'Chapter 3: Understanding Ripple Effects',
      steps: [
        {
          factorId: 'secondary',
          action: 'expand',
          narrative: 'Secondary losses for DDoS occur when prolonged or repeated outages damage customer trust, create competitive openings, and potentially trigger SLA penalties. Unlike confidentiality breaches (ransomware, data theft), DDoS is an availability attack — no data is stolen, but business continuity is disrupted. Let\'s decompose into SLEF and SLM.',
          scenarioContext: 'If a DDoS attack causes a 24-hour outage during peak season, customers lose trust ("Is this site reliable?"), competitors gain market share (customers shop elsewhere and don\'t return), and B2B customers may invoke SLA clauses for downtime penalties.',
          whyTheseNumbers: null
        },
        {
          factorId: 'slef',
          action: 'focus',
          narrative: 'Secondary Loss Event Frequency (SLEF) is the probability that a DDoS attack triggers lasting consequences beyond immediate revenue loss. We estimate 0.05 to 0.3 (5–30%). Most DDoS attacks are short-lived (hours, not days) and customers return once the site recovers. Secondary losses occur when attacks are prolonged, repeated, or highly publicized.',
          scenarioContext: 'SLEF drivers: single 2-hour outage = customers retry later, minimal churn (SLEF≈5%). Repeated attacks over a week = customers perceive unreliability, seek alternatives (SLEF≈15%). Multi-day outage during Black Friday = massive lost sales, permanent customer migration to competitors, media coverage (SLEF≈30%).',
          whyTheseNumbers: 'SLEF of 0.05–0.3 reflects that most DDoS incidents are forgiven. E-commerce customers are accustomed to occasional site slowness. But repeated or long-duration attacks during critical business periods create lasting damage. Compare this to ransomware (SLEF=60–100%) where secondary consequences are almost guaranteed.'
        },
        {
          factorId: 'slm',
          action: 'expand',
          narrative: 'Secondary Loss Magnitude (SLM) is the long-term cost after DDoS. We estimate $10K to $1M, driven by customer churn, competitive losses, potential SLA fines, and reputation damage. For DDoS, Reputation and Competitive losses dominate because customers shopping during an outage simply go to competitors. Let\'s break it down.',
          scenarioContext: 'If a DDoS attack takes your site offline during Black Friday, customers don\'t wait — they go to Amazon, your competitors, or brick-and-mortar stores. You\'ve lost not just that sale, but potentially their lifetime value as they discover they prefer the competitor. B2B customers may demand SLA credits or terminate contracts.',
          whyTheseNumbers: null
        },
        {
          factorId: 'fines',
          action: 'focus',
          narrative: 'Regulatory fines for DDoS are minimal ($0–$100K) because no data breach occurred — it\'s purely availability. Fines appear only when SLA contracts with enterprise customers include uptime guarantees and penalty clauses. For B2B SaaS companies, a 24-hour outage might trigger $10K–$100K in SLA credits.',
          scenarioContext: 'If your e-commerce site serves only consumers, there are no DDoS-related fines (no regulator penalizes you for being attacked). If you operate a B2B platform with 99.9% uptime SLAs, and a DDoS attack causes 24 hours of downtime (monthly uptime = 96%), customers can invoke SLA clauses demanding service credits or refunds.',
          whyTheseNumbers: 'Fines of $0–$100K reflect contractual SLA penalties, not regulatory fines. Consumer-facing sites: $0. B2B platforms with aggressive SLAs: $10K–$100K in credits for major outages. This is much lower than data breach fines (ransomware Fines=$0–$5M) because no PII was compromised.'
        },
        {
          factorId: 'reputation',
          action: 'focus',
          narrative: 'Reputation damage from DDoS is significant ($5K–$500K). Customers value reliability. Repeated or long-duration outages erode trust, leading to churn. Unlike data breaches (where customers fear identity theft), DDoS damage is immediate and tangible: "I couldn\'t buy what I needed, so I went elsewhere and realized I prefer them."',
          scenarioContext: 'Reputation loss pathways: single outage = minor annoyance, 2–5% customer churn ($5K–$20K). Repeated attacks over a month = reliability concerns spread via reviews, 10–15% churn ($50K–$100K). Major outage during Black Friday with media coverage = lasting brand damage, 20–30% holiday customer churn, future customers hesitant to rely on your site ($200K–$500K).',
          whyTheseNumbers: 'Reputation of $5K–$500K models customer lifetime value loss. Lower end: customers complain but return after outage ends. Upper end: attack during critical period, customers switch to competitors and don\'t return, reviews mention unreliability for months. Compare to ransomware (Reputation=$500K–$8M) where trust is harder to rebuild because it implies systemic security failures, not just bad luck.'
        },
        {
          factorId: 'competitive',
          action: 'focus',
          narrative: 'Competitive advantage loss from DDoS is primarily market share erosion ($5K–$400K). When your site is down, customers shop at competitors. If the outage is during a critical sales period (Black Friday, holiday season), competitors capture market share that may never return. Some customers discover they prefer the competitor and switch permanently.',
          scenarioContext: 'Competitive loss mechanisms: customers shopping during your outage go to Competitor A, complete their purchase, have a good experience, sign up for their loyalty program. You\'ve lost not just one sale but potentially their future lifetime value. During peak seasons, this effect compounds: 1,000 customers lost during Black Friday = $500K in lifetime value.',
          whyTheseNumbers: 'Competitive of $5K–$400K reflects permanent market share loss. Lower end: off-peak outage, customers retry your site later. Upper end: peak season outage, competitors run "Site down? Shop here!" ads capitalizing on your outage, 500–2,000 customers permanently switch. This is comparable to ransomware Competitive ($300K–$4M) where lost time-to-market creates similar strategic disadvantages.',
          experiment: {
            prompt: 'Increase Competitive loss to $100K–$2M to model a DDoS attack during a major product launch event. See how timing amplifies competitive damage.',
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
          narrative: 'You\'ve estimated all factors. Examine the results. The Loss Exceedance Curve shows your risk distribution. The 90th percentile is typically $200K–$1.5M annually for DDoS risk against an e-commerce site. Notice the drivers: unlike confidentiality threats (ransomware, data breaches), DDoS is an availability attack — Primary losses are dominated by Productivity (lost revenue) and Response (emergency mitigation costs), while Secondary losses come from Reputation and Competitive (customer churn, market share loss). The breakdown reveals DDoS as a revenue-destruction threat, not a data-theft threat. Compare control ROI: raising Resistance Strength from 0.5 to 0.7 (upgrading DDoS mitigation from standard to enterprise CDN, $50K annual cost increase) cuts LEF by 40%, reducing annual risk by $400K–$600K. Unlike other threats where prevention is primary, DDoS mitigation is about resilience — you can\'t stop attacks from being launched, only reduce their success rate and blast radius. Use these results to justify layered defenses: CDN with massive capacity (volumetric mitigation), rate limiting and CAPTCHA (application-layer mitigation), auto-scaling (resource exhaustion mitigation). The curve also reveals timing dependency: attack during Black Friday (5x normal traffic) causes 10x normal damage. This justifies surge capacity planning and prioritizing DDoS defenses before peak business periods.',
          scenarioContext: 'Your CTO asked: "Should we upgrade from CloudFlare Pro ($200/month) to Business ($2,000/month) for better DDoS protection?" You can now answer: "We face 50–500 DDoS attacks per year. Current defenses (RS=0.3–0.7) result in 40–500 successful degradations annually, costing $50K–$800K each, with a 10% chance of exceeding $1M annually during peak season. Upgrading raises RS from 0.5 to 0.65, cutting successful attacks by 30%, reducing our 90th percentile risk from $1M to $650K — a $350K annual reduction for $24K annual cost. ROI is 14x. The benefit is highest during Black Friday: a single prevented major outage ($500K–$1M lost revenue) pays for 2–4 years of upgraded service."',
          whyTheseNumbers: 'DDoS illustrates availability threats where revenue loss dominates. Unlike phishing (human-dependent, trainable) or ransomware (data-dependent, backups mitigate), DDoS is capacity-dependent: if attack volume exceeds your mitigation capacity, you lose revenue. The FAIR model reveals that for revenue-critical systems, the cost of DDoS mitigation is almost always justified because a single prevented major outage pays for years of protection. This tutorial teaches that some risks justify spending on resilience (redundancy, excess capacity) rather than prevention (you can\'t prevent DDoS attacks from being launched). The key insight: availability is binary — 99% uptime sounds good until you realize that\'s 7 hours of downtime per month, which during Black Friday week could cost $500K.'
        }
      ]
    }
  ]
};
