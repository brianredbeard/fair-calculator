/**
 * APT Intellectual Property Theft Tutorial
 * Advanced difficulty - Understanding strategic competitive risks
 */

export default {
  id: 'apt-ip-theft',
  title: 'APT Intellectual Property Theft Tutorial',
  subtitle: 'Understanding strategic competitive risks',
  difficulty: 'advanced',
  estimatedMinutes: 18,
  scenarioIndex: 23,

  chapters: [
    {
      title: 'Chapter 1: Understanding Frequency',
      steps: [
        {
          factorId: 'lef',
          action: 'focus',
          narrative: 'Loss Event Frequency (LEF) for Advanced Persistent Threat (APT) intellectual property theft represents successful espionage campaigns targeting your trade secrets per year. We estimate 0.5 to 9.5 incidents annually. This is low-frequency (ransomware LEF=0.1–0.6, insider LEF=0.5–14) but strategically catastrophic: APTs steal source code, product roadmaps, R&D data, and customer intelligence that took years and millions to develop. Unlike ransomware (you can restore), stolen IP can never be un-stolen.',
          scenarioContext: 'Your organization is a technology company with $200M annual revenue, 200 engineers, and proprietary ML algorithms worth $50M in R&D investment. Competitors in China and Eastern Europe would pay millions for your source code and customer data. Nation-state actors target your technology for strategic advantage. APT groups operate multi-year campaigns to infiltrate and exfiltrate your crown jewels.',
          whyTheseNumbers: 'LEF of 0.5–9.5/year reflects that APTs are targeted, not opportunistic. Only organizations with high-value IP (technology, pharmaceuticals, defense, finance) face APT risk. Generic e-commerce or SaaS companies without unique IP are not APT targets. If you have valuable trade secrets, APTs will come for them, but attempts are measured in single digits per year, not hundreds like phishing.'
        },
        {
          factorId: 'tef',
          action: 'expand',
          narrative: 'LEF decomposes into Threat Event Frequency (TEF) and Vulnerability. Let\'s expand to see TEF — how often APT groups begin reconnaissance and initial compromise attempts against your organization, whether or not they achieve persistent access.',
          scenarioContext: 'TEF includes: nation-state APT groups (APT1, APT29, Lazarus Group) conducting reconnaissance (OSINT, LinkedIn, GitHub), spear-phishing your executives and engineers, exploiting zero-day vulnerabilities in your infrastructure, compromising your supply chain (third-party vendors, open-source dependencies), and deploying custom malware for persistence.',
          whyTheseNumbers: null
        },
        {
          factorId: 'cf',
          action: 'focus',
          narrative: 'Contact Frequency (CF) represents how often APT groups target your organization with initial compromise attempts. We estimate 1 to 10 campaigns per year. This is the lowest CF of threats except KMS (CF=0.5–5). APTs are not spray-and-pray attackers — they select specific targets with valuable IP, research the organization for months, and launch highly customized campaigns. You\'re either a target (CF=5–10) or you\'re not (CF=0).',
          scenarioContext: 'CF events: Chinese APT group targets your ML research team with spear-phishing campaign (1/year). Nation-state actor exploits zero-day in your VPN to gain network access (0.5/year). Industrial competitor hires APT-for-hire service to steal source code (0.5–2/year). Supply chain compromise: attackers infiltrate your cloud provider or SaaS vendor to reach your environment (1–3/year). Watering hole attack: compromised industry forum you visit (1–2/year).',
          whyTheseNumbers: 'CF of 1–10/year reflects targeted selection. APTs don\'t randomly scan the internet — they identify targets with specific IP (AI algorithms, drug formulas, defense technology) and mount campaigns. Higher CF (5–10) for industries with nation-state interest (technology, defense, energy, pharma). Lower CF (1–3) for commercial competitors using APT-for-hire. Unlike brute force (CF=200–800, automated) or phishing (CF=1000+, commodity), APTs are bespoke.',
          experiment: {
            prompt: 'Try reducing Contact Frequency to 0.5–3 to model operating in a non-strategic industry or keeping a very low public profile. Watch the Median and 90th Percentile in Summary Statistics — they should drop. (The Mean may jump around due to extreme tail events in the Monte Carlo simulation; Median is the more stable measure.)',
            resetAfter: true
          }
        },
        {
          factorId: 'poa',
          action: 'focus',
          narrative: 'Probability of Action (PoA) is the likelihood that an APT campaign progresses from reconnaissance to active intrusion. We estimate 0.5–0.95 (50–95%). This is much higher than phishing (PoA=1–10%, most users ignore) because APTs are persistent: if the first spear-phishing email fails, they try 10 more variants. If VPN exploits are patched, they pivot to supply chain. They WILL find a way in if you\'re the target.',
          scenarioContext: 'PoA scenarios: APT targets mid-market company with modest defenses, initial spear-phishing succeeds within weeks (PoA≈90%). APT targets Fortune 500 with world-class security, requires 6-month campaign combining zero-day exploits and insider recruitment (PoA≈60%, harder but still likely). Nation-state APT with unlimited budget targeting defense contractor, will eventually succeed (PoA≈95%, failure is not an option for them).',
          whyTheseNumbers: 'PoA of 0.5–0.95 reflects APT persistence. Unlike opportunistic attackers (move to easier target if initial attempt fails), APTs are mission-driven: they have specific IP theft objectives and unlimited time. They will probe for months or years, trying every vector: spear-phishing, zero-days, supply chain, social engineering, insider recruitment. The question is not "will they try" but "will they eventually find a gap in your defenses."'
        },
        {
          factorId: 'vuln',
          action: 'expand',
          narrative: 'Vulnerability is the probability that an APT intrusion results in IP theft. This depends on Threat Capability (APT sophistication, zero-days, custom malware) versus Resistance Strength (your network segmentation, endpoint detection, data loss prevention, insider threat monitoring). Let\'s decompose it.',
          scenarioContext: 'Your defenses: next-gen firewalls with deep packet inspection, EDR on all endpoints, network traffic analysis (NTA) detecting lateral movement, Data Loss Prevention (DLP) monitoring file transfers, zero-trust network architecture (microsegmentation), threat hunting team analyzing anomalies, and security awareness training. But APTs use zero-days, custom malware (undetected by signatures), and slow exfiltration (below DLP thresholds).',
          whyTheseNumbers: null
        },
        {
          factorId: 'tcap',
          action: 'focus',
          narrative: 'Threat Capability (TCap) for APTs is 0.7–1.0 on a 0–100 scale, the highest sustained TCap of any threat. APTs have: zero-day exploits purchased from vulnerability brokers ($100K–$5M per exploit), custom malware undetectable by antivirus (developed in-house), nation-state resources (unlimited budget and time), insider recruitment capabilities (social engineering or financial inducement), and patience to conduct multi-year campaigns.',
          scenarioContext: 'TCap factors: Chinese APT1 operates from military Unit 61398, employs hundreds of developers, has access to zero-days for Cisco, Microsoft, VMware (TCap=0.95). North Korean Lazarus Group conducts multi-year campaigns, uses custom backdoors (TCap=0.9). Commercial APT-for-hire services (like NSO Group before shutdown) rent nation-state-grade capabilities to competitors (TCap=0.8). Even "lower" TCap (0.7) represents sophisticated actors with custom tools, not script kiddies.',
          whyTheseNumbers: 'TCap of 0.7–1.0 reflects that APTs are the most sophisticated adversaries. Unlike ransomware (TCap=0.6–0.9, commodity tools available) or insider threats (TCap=0.7–0.95, limited by insider access level), APTs combine technical sophistication (zero-days, custom malware) with operational patience (multi-year campaigns) and unlimited resources (nation-state backing). They can defeat most commercial security controls.'
        },
        {
          factorId: 'rs',
          action: 'focus',
          narrative: 'Resistance Strength (RS) against APTs is 0.6–0.95 on a 0–100 scale. This is the highest RS we\'ve modeled (tied with KMS) because APT defense requires defense-in-depth: network segmentation, EDR, DLP, threat hunting, insider threat programs, and zero-trust architecture. But RS can never reach 1.0 because zero-day exploits exist, social engineering works, and patient attackers eventually find gaps. Perfect defense is impossible against nation-states.',
          scenarioContext: 'Your RS components: Zero-trust network architecture (microsegmentation, no lateral movement, RS=0.3), EDR with behavioral detection (catches custom malware eventually, RS=0.2), threat hunting team analyzing anomalies (human analysis finds what automation misses, RS=0.2), DLP monitoring exfiltration (slow exfiltration still detected over time, RS=0.15), insider threat program (background checks, anomaly detection, RS=0.1). Total RS=0.6–0.95 depending on APT resources and your defensive depth.',
          whyTheseNumbers: 'RS of 0.6–0.95 reflects that APT defense is possible but not perfect. Lower end (RS=0.6): APT uses zero-day exploit, bypasses most controls, exfiltrates data before detection. Upper end (RS=0.95): defense-in-depth detects and blocks APT before significant IP theft. But RS=1.0 is impossible: zero-days exist, insiders can be recruited, and nation-state APTs will find gaps over multi-year campaigns. Google, Microsoft, and U.S. military all suffer APT breaches despite world-class security (proving RS<1.0 for everyone).',
          experiment: {
            prompt: 'Increase Resistance Strength to 0.8–0.99 to model adding dedicated threat hunting team and moving critical IP to air-gapped network. See how layered defenses reduce but never eliminate APT risk.',
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
          narrative: 'Loss Magnitude (LM) for APT IP theft is $500K to $70M per incident, with losses overwhelmingly concentrated in Secondary (Competitive=$1.5M–$65M). Unlike other threats where Primary costs dominate (ransomware) or are balanced (regulatory), APT theft has modest Primary losses ($500K–$5M) but catastrophic Secondary losses ($1.5M–$67M). This is "competitive-loss-dominated" risk: the cost is not responding to the breach but losing years of R&D advantage to competitors who now have your IP.',
          scenarioContext: 'When an APT steals your proprietary ML training algorithms, source code for your flagship product, and customer intelligence, direct costs are containable: $1M in forensics, $1M in incident response, $500K in system hardening. But the strategic damage unfolds over years: competitors launch competing products 18 months faster ($20M–$40M lost first-mover revenue), undercut your pricing using your stolen cost models ($5M–$10M margin erosion), and poach your customers with inside knowledge ($10M–$15M lost deals). Total competitive loss: $35M–$65M.',
          whyTheseNumbers: 'LM of $500K–$70M reflects that APT theft is about long-term strategic damage, not immediate costs. Lower end: limited IP theft (single algorithm, quick containment), competitors can\'t effectively monetize ($500K response + $1.5M competitive). Upper end: comprehensive IP theft (entire source code repository, roadmaps, customer data), competitors launch superior products using your R&D ($5M response + $65M competitive over 3–5 years). Unlike ransomware (you recover and move on), APT damage compounds annually.'
        },
        {
          factorId: 'primary',
          action: 'expand',
          narrative: 'Primary losses for APT IP theft are modest ($500K–$5M) compared to the strategic damage. This includes lost productivity during incident response, forensics and threat hunting costs, and infrastructure hardening post-breach. Notably, there\'s minimal Replacement cost ($100K–$500K) because you\'re not rebuilding infrastructure, just hardening it. APT response is about forensics ("what did they take") not recovery ("restore from backup").',
          scenarioContext: 'Primary costs: Engineering team investigates compromised systems, rotates credentials, hardens configurations (200 hours × $200/hour = $40K). External forensics firm traces APT lateral movement and exfiltration (3-month engagement = $200K–$800K). Threat hunting team reviews 6 months of logs to identify APT dwell time ($100K–$300K). Legal counsel coordinates IP protection strategy ($50K–$200K). Infrastructure hardening: deploy EDR, implement microsegmentation ($100K–$500K).',
          whyTheseNumbers: null
        },
        {
          factorId: 'productivity',
          action: 'focus',
          narrative: 'Productivity loss during APT investigation is $200K to $3M. Unlike ransomware (productivity loss is downtime) or regulatory (productivity is remediation), APT productivity loss is: engineering time investigating the breach, legal time pursuing IP protection, management time rethinking product strategy now that IP is compromised, and R&D deciding whether to rebuild stolen algorithms or pivot to new approaches.',
          scenarioContext: 'Productivity scenarios: 20 engineers spend 2 weeks investigating compromised systems and rotating credentials ($150K). Legal team spends 3 months documenting stolen IP for potential litigation ($200K). Executive team spends 40 hours reassessing product roadmap given IP theft ($50K). R&D team debates whether to rebuild compromised ML model with new architecture ($500K–$2M in delayed research). Upper end: organization paralyzed by IP theft, 6-month investigation consumes all discretionary capacity ($3M).',
          whyTheseNumbers: 'Productivity of $200K–$3M reflects investigation and strategic reassessment. Lower end: limited breach, fast containment, minimal organizational disruption. Upper end: comprehensive IP theft, 6-month investigation, R&D roadmap completely rethought, management paralyzed by strategic uncertainty. Unlike DDoS (productivity is revenue loss during downtime), APT productivity is opportunity cost of people working on breach response instead of product development.'
        },
        {
          factorId: 'response',
          action: 'focus',
          narrative: 'Response costs for APT IP theft are $200K to $1.5M, covering world-class forensics, threat intelligence, and legal strategy. APT investigations are the most complex incident response: tracing custom malware, analyzing months of network traffic, identifying exactly what IP was exfiltrated, coordinating with law enforcement, and planning legal action against competitors who use stolen IP (if attribution is possible).',
          scenarioContext: 'Response involves: Mandiant or CrowdStrike APT forensics team (6-month engagement, $200K–$800K), threat intelligence firm identifying which APT group and their TTPs ($50K–$200K), legal counsel coordinating with FBI Cyber Division and potentially international law enforcement ($50K–$300K), IP litigation counsel if stolen IP surfaces at competitor ($100K–$500K in initial strategy), crisis communications if breach becomes public ($50K–$200K).',
          whyTheseNumbers: 'Response of $200K–$1.5M reflects APT investigation complexity. Lower end: internal security team handles most investigation, limited external help. Upper end: nation-state APT using custom malware, multi-year dwell time, requires 6-month forensic engagement plus legal strategy for IP protection. Unlike phishing Response ($500–$10K, password reset) or even ransomware Response ($200K–$2M, negotiation and recovery), APT response is detective work: "what did they take, how long were they here, where did data go."'
        },
        {
          factorId: 'replacement',
          action: 'focus',
          narrative: 'Replacement costs for APT breaches are modest ($100K–$500K), covering infrastructure hardening and control improvements. Unlike ransomware (Replacement=$200K–$3M, rebuild infrastructure) or KMS (Replacement=$1M–$10M, re-key everything), APT response is about incremental security improvements: deploy EDR you should have had, implement network segmentation you deferred, add DLP you considered too expensive. The breach accelerates overdue investments.',
          scenarioContext: 'Replacement involves: Deploy EDR to all endpoints ($50K–$150K for enterprise licenses + deployment labor), implement network microsegmentation ($100K–$200K for network architecture redesign), upgrade DLP to monitor source code repositories ($30K–$100K annual license), deploy deception technology (honeypots) to detect future APTs ($20K–$50K). Total: $200K–$500K in security infrastructure upgrades that should have been done proactively.',
          whyTheseNumbers: 'Replacement of $100K–$500K reflects security maturation, not wholesale infrastructure replacement. Lower end: already had most controls, limited additions needed. Upper end: APT revealed significant security gaps, comprehensive control upgrade. The investments are permanent improvements (not incident-specific costs), but APT breach provides the budget justification that was previously denied. Unlike Productivity and Response (pure loss), Replacement creates lasting security value.'
        }
      ]
    },
    {
      title: 'Chapter 3: Understanding Ripple Effects',
      steps: [
        {
          factorId: 'secondary',
          action: 'expand',
          narrative: 'Secondary losses for APT IP theft are $1.5M to $67M, utterly dominating Primary losses ($500K–$5M). SLEF is 90–100% (APT breaches almost always become known: you discover them via forensics and must notify if customer data involved, or competitors launch suspiciously similar products revealing the theft). SLM is overwhelmingly Competitive loss ($1.5M–$65M) with modest Reputation ($0–$2M) and zero Fines (no regulatory penalty for being a victim). This is the most extreme competitive-loss-dominated scenario in FAIR. Let\'s decompose into SLEF and SLM.',
          scenarioContext: 'APT steals your ML algorithm source code, customer database, and 3-year product roadmap. Six months later, a competitor (who never had ML capability before) launches a nearly identical product. Your investors demand answers. Security investigation confirms APT breach. You must disclose to board, investors, potentially customers if PII was taken. The theft becomes known. Meanwhile, competitor captures $40M in revenue using your stolen IP over 3 years. That revenue would have been yours.',
          whyTheseNumbers: null
        },
        {
          factorId: 'slef',
          action: 'focus',
          narrative: 'Secondary Loss Event Frequency (SLEF) for APT IP theft is 0.9–1.0 (90–100%), near-certain disclosure. Unlike some breaches (where you might keep quiet if no PII involved), APT IP theft becomes known through: (1) forensic investigation discovers the breach internally, requiring board notification, (2) stolen IP surfaces at competitors, revealing the theft, (3) customer PII was included, triggering breach notification laws, or (4) media coverage of similar breaches prompts internal audit. Confidentiality is nearly impossible.',
          scenarioContext: 'Why SLEF is near 100%: Modern forensics eventually detects APT presence (threat hunting, behavioral analysis detect anomalies even if real-time monitoring missed intrusion). Once you know you were breached, fiduciary duty requires notifying board and investors (public companies). If customer data was taken, breach notification laws require disclosure. Even if you stay silent, when competitor launches product using your stolen IP, your engineers recognize their own code, investigation follows, breach is confirmed. Silence is only possible if APT stole IP and no one ever uses it (unlikely — why steal if not to use?).',
          whyTheseNumbers: 'SLEF of 0.9–1.0 reflects that APT breaches are detective, not preventive problems. You may not detect APT in real-time, but post-breach forensics or competitor product launches reveal the theft eventually. This matches regulatory violations (SLEF=80–100%) and KMS (SLEF=80–100%) where disclosure is mandatory or inevitable. Unlike phishing (SLEF=1–10%, most stay internal), APT breaches have too much visibility to hide.'
        },
        {
          factorId: 'slm',
          action: 'expand',
          narrative: 'Secondary Loss Magnitude (SLM) for APT IP theft is $1.5M to $67M, with 95–98% being Competitive loss ($1.5M–$65M). This is the most extreme loss concentration in any analyzed threat. Reputation damage is modest ($0–$2M, you\'re a victim not a negligent actor), and Fines are $0 (no regulatory penalty for being hacked). All the damage is strategic: competitors using your stolen IP to out-compete you. Let\'s break it down.',
          scenarioContext: 'When APT steals your proprietary ML algorithm (3 years of R&D, $15M invested), competitor uses it to launch competing product 18 months before they could have developed it independently. They capture $30M revenue over 3 years that would have been yours (you had first-mover advantage). They undercut your pricing using your stolen cost models (you lose $5M in margin). They poach your enterprise customers using stolen intelligence about their pain points (you lose $10M in contracts). Total competitive loss: $45M. This is purely strategic damage, not regulatory or reputational.',
          whyTheseNumbers: null
        },
        {
          factorId: 'fines',
          action: 'focus',
          narrative: 'Regulatory fines for APT IP theft are $0. Unlike ransomware (where you might face fines for inadequate backups) or regulatory violations (where fines are the primary consequence), being a victim of sophisticated nation-state espionage does not trigger regulatory penalties. GDPR/HIPAA may require breach notification if customer PII was stolen, but fines are unlikely when the attacker is APT-level sophisticated (regulators understand that even Google gets breached by nation-states).',
          scenarioContext: 'No fines because: APTs use zero-day exploits and custom malware (you couldn\'t have prevented with "reasonable safeguards"), investigation shows you had appropriate controls (EDR, segmentation, monitoring — they were bypassed via zero-days, not absent), and regulators distinguish between negligence (unpatched systems, no backups) vs. sophisticated adversary defeat (nation-state using $5M zero-day exploit). If customer PII was stolen, you notify under breach laws, but fines are rare for APT victims.',
          whyTheseNumbers: 'Fines of $0 reflect that regulators understand APT sophistication. When Target was breached (negligent security), fines followed. When Google was breached by Chinese APT Aurora (sophisticated attack despite world-class security), no fines. Regulators focus enforcement on preventable breaches (unpatched systems, no encryption), not on victims of nation-state espionage. The $0 is realistic for APT scenarios; fines would only appear if investigation revealed gross negligence (no basic controls), not just APT sophistication defeating good controls.'
        },
        {
          factorId: 'reputation',
          action: 'focus',
          narrative: 'Reputation damage from APT IP theft is minimal ($0–$2M). Unlike ransomware (Reputation=$500K–$8M, "they couldn\'t protect data") or regulatory violations (Reputation=$200K–$8M, "they ignored compliance"), APT victims are viewed sympathetically: "Even Google, RSA, and U.S. government get breached by nation-states. If it can happen to them, it can happen to anyone." Customer churn is minimal because customers understand APT sophistication.',
          scenarioContext: 'Reputation scenarios: APT theft disclosed, media coverage notes "sophisticated nation-state attack," customers ask about remediation but don\'t flee ($0–$500K modest churn). Compare to: Target breach (negligent security, massive customer backlash) vs. Google Aurora breach (sophisticated Chinese APT, customers understanding). Reputation damage occurs primarily when stolen customer data leads to identity theft affecting customers ($1M–$2M churn if PII misused), not from the breach itself.',
          whyTheseNumbers: 'Reputation of $0–$2M reflects victim sympathy. Customers distinguish between "breached by sophisticated nation-state using zero-days" (understandable, happens to everyone) vs. "breached because we didn\'t patch or encrypt" (negligence, unforgivable). The upper bound ($2M) represents scenarios where stolen customer PII is actively misused (identity theft, fraud), creating direct customer harm. But pure IP theft (source code, algorithms) affecting only the company, not customers, generates minimal reputation damage. Customers care about their data, not your trade secrets.'
        },
        {
          factorId: 'competitive',
          action: 'focus',
          narrative: 'Competitive advantage loss from APT IP theft is $1.5M to $65M, representing the entire value of stolen competitive intelligence weaponized against you. This is the largest Competitive loss of any threat and the reason APTs exist: nation-states and competitors specifically target IP that provides strategic advantage. When they steal and use it, your competitive position erodes over years. This is long-term strategic damage, not one-time cost.',
          scenarioContext: 'Competitive loss pathways: APT steals ML algorithm source code, competitor launches competing product 2 years faster than they could have independently developed it, captures $30M–$50M revenue over 3–5 years (first-mover advantage you lost = $30M–$50M). APT steals customer database with pain points and pricing, competitor targets your best accounts with inside knowledge, poaches 20–30% ($10M–$15M in lost contracts). APT steals product roadmap, competitor pre-emptively launches features you were planning, neutralizing your differentiation ($5M–$10M strategic loss). Total: $45M–$75M, but primary component is lost first-mover revenue.',
          whyTheseNumbers: 'Competitive of $1.5M–$65M reflects that APT targets are selected for IP value. Lower end: limited IP theft (single algorithm, competitor partially replicates), modest competitive damage ($1.5M–$5M over 2 years). Upper end: comprehensive IP theft (entire source repository, roadmaps, customer intelligence), competitor uses it to dominate your market, captures $50M–$65M that would have been yours over 5 years. The $65M upper bound is conservative — if APT steals truly revolutionary IP (breakthrough drug formula, foundational AI model), competitive losses could exceed $100M–$500M as competitor captures an entire market you would have created.',
          experiment: {
            prompt: 'Increase Competitive loss to $50M–$200M to model APT theft of breakthrough technology (quantum encryption algorithm, cancer drug formula). See how IP value determines total risk.',
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
          narrative: 'You\'ve estimated all factors. Examine the results. The Loss Exceedance Curve shows your risk distribution. The 90th percentile is typically $5M–$70M annually for APT IP theft risk. Notice the unique loss profile: 95–98% of loss is Competitive ($1.5M–$65M), with minimal Primary ($500K–$5M), zero Fines, and modest Reputation ($0–$2M). This is the most extreme competitive-loss-dominated scenario in FAIR — the entire risk is strategic, not operational or regulatory. The breakdown reveals APT as a different category of risk than all others: it\'s not about confidentiality breach consequences (fines, reputation) but about competitive intelligence warfare. Stolen IP doesn\'t just cost you the response ($1M); it costs you the market advantage that IP provided ($40M–$65M over years). Use these results to justify offensive IP protection: investing $2M annually in threat hunting, deception technology, and IP segmentation raises RS from 0.8 to 0.9, cutting LEF by 50%, reducing 90th percentile risk from $50M to $20M — a $30M risk reduction for $2M investment. ROI is 15x. The curve also reveals that APT risk scales with IP value: if your proprietary algorithms are worth $100M in competitive advantage, APT theft could cost you that entire $100M. This justifies treating crown-jewel IP protection as existential: air-gapped networks for most sensitive data, insider threat programs, and counter-intelligence capabilities. Because unlike ransomware (where you can pay and recover) or regulatory fines (where you can appeal and settle), stolen IP can never be un-stolen. Once competitors have it, your advantage is permanently gone.',
          scenarioContext: 'Your board asked: "Should we invest $3M in a dedicated threat hunting team and air-gapping our most sensitive R&D?" You can now answer: "We face 1–10 APT reconnaissance campaigns per year targeting our $50M proprietary ML algorithms. Current defenses (RS=0.6–0.95) result in 0.5–9.5 successful IP thefts annually. A single comprehensive APT breach costs $500K–$5M in Primary losses (forensics, response, hardening) plus $1.5M–$65M in Secondary losses (competitors launching products using our stolen IP, capturing revenue that should be ours), with a 10% chance of exceeding $60M annually. Our ML algorithms represent 3 years of R&D and $15M investment. If an APT steals them and gives them to a competitor, that competitor can launch 2 years faster, capturing $30M–$50M in first-mover revenue we would have earned. Investing $3M in threat hunting (raises detection capability) and air-gapping crown-jewel IP (raises RS from 0.8 to 0.95) cuts our 90th percentile risk from $60M to $15M — a $45M risk reduction for $3M annual investment. ROI is 15x in year one. Additionally, this investment protects our competitive moat: the ML algorithms are why we win deals. If competitors get them, we have no differentiation, pricing power collapses, and we become a commodity player. The $3M isn\'t a security expense — it\'s competitive moat insurance."',
          whyTheseNumbers: 'APT IP theft illustrates that the highest cybersecurity risks are often strategic, not operational. Ransomware costs you money and time (you recover). Regulatory violations cost you fines and reputation (you remediate and rebuild trust). But APT IP theft costs you competitive advantage (which you can never fully recover once stolen). The FAIR model reveals this through the Competitive loss magnitude ($1.5M–$65M) exceeding all other loss components combined. This justifies treating IP protection as business strategy, not IT security: what IP differentiates you in the market, who would pay to steal it (competitors, nation-states), and what\'s it worth to them if they get it. For technology companies, IP is the business. APT theft doesn\'t just breach confidentiality — it destroys competitive advantage. This tutorial teaches the hardest lesson in enterprise security: some risks are not about compliance, availability, or even confidentiality in the traditional sense. They\'re about competitive intelligence warfare. When nation-states or well-funded competitors target your IP, the question is not "can we prevent all breaches" (no one can against APTs) but "can we make IP theft difficult enough and detect it fast enough to limit damage." The only permanent solution is reducing IP value concentration: don\'t put all competitive advantage in one algorithm or codebase. Diversify your moat across patents, customer relationships, brand, and operational excellence — so APT theft of source code doesn\'t destroy the entire business.'
        }
      ]
    }
  ]
};
