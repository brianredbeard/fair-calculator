/**
 * Legacy System Compromise Tutorial
 * Intermediate difficulty - Understanding technical debt as security risk
 */

export default {
  id: 'legacy-system',
  title: 'Legacy System Compromise Tutorial',
  subtitle: 'Understanding technical debt as security risk',
  difficulty: 'intermediate',
  estimatedMinutes: 15,
  scenarioIndex: 19,

  chapters: [
    {
      title: 'Chapter 1: Understanding Frequency',
      steps: [
        {
          factorId: 'lef',
          action: 'focus',
          narrative: 'Loss Event Frequency (LEF) for legacy system compromises represents successful exploitation of unpatched, end-of-life systems per year. We estimate 2.5 to 150 incidents annually. This wide range reflects that legacy systems attract both opportunistic scanners (high CF) and sophisticated attackers (high TCap), but low PoA (most attackers move on to easier targets) keeps LEF moderate.',
          scenarioContext: 'Your organization runs a Windows Server 2008 database server (end-of-life since 2020) hosting customer records. The server can\'t be patched (application incompatibility) and can\'t be upgraded (vendor no longer supports the software). It\'s network-isolated but remains a known vulnerability.',
          whyTheseNumbers: 'LEF of 2.5–150/year combines high scanner traffic (CF=50–500) with low attacker motivation (PoA=5–30%, most move to easier targets). The result: frequent attempts, but most attackers don\'t invest time in customized exploits for old systems when modern systems are widely vulnerable.'
        },
        {
          factorId: 'tef',
          action: 'expand',
          narrative: 'LEF decomposes into Threat Event Frequency (TEF) and Vulnerability. Let\'s expand to see TEF — how often attackers probe legacy systems for known vulnerabilities, whether or not they succeed in exploiting them.',
          scenarioContext: 'Automated vulnerability scanners (Shodan, Nessus, Qualys) continuously map internet-facing services. When they detect Windows Server 2008 or other end-of-life systems, they flag them as high-value targets. Attackers receive these scan results and decide whether to pursue.',
          whyTheseNumbers: null
        },
        {
          factorId: 'cf',
          action: 'focus',
          narrative: 'Contact Frequency (CF) represents how often vulnerability scanners and attackers discover your legacy systems. We estimate 50 to 500 contact events per year. This is high because legacy systems are easily fingerprinted (distinctive banners, known CVEs), making them attractive scanner targets. Shodan alone indexes millions of devices daily.',
          scenarioContext: 'CF events: automated vulnerability scanners probe your IP ranges and detect Windows Server 2008 via SMB banner (50–100/year), attackers using exploit frameworks (Metasploit, Core Impact) search for known CVEs affecting your legacy OS (20–50/year), nation-state actors conducting reconnaissance identify unpatched systems (5–20/year), ransomware gangs scan for vulnerable RDP endpoints (50–200/year).',
          whyTheseNumbers: 'CF of 50–500/year is higher than targeted attacks (ransomware CF=5–50) because legacy systems are passively discoverable via network scans. It\'s lower than phishing (CF=1000+) because not all attackers focus on infrastructure exploitation. The range reflects whether your legacy system is internet-facing (CF=500) or internal-only (CF=50).',
          experiment: {
            prompt: 'Try reducing Contact Frequency to 20–200 to model network isolation (legacy system only accessible via VPN). Watch the Median and 90th Percentile — network segmentation reduces exposure.',
            resetAfter: true
          }
        },
        {
          factorId: 'poa',
          action: 'focus',
          narrative: 'Probability of Action (PoA) is the likelihood that an attacker who discovers your legacy system actually attempts to exploit it. We estimate 0.05–0.3 (5–30%), much lower than brute force (70–100%) or DDoS (80–100%). This reflects that while legacy systems have known vulnerabilities, attackers often move on because (1) exploits may not work reliably, (2) systems might be honeypots, or (3) easier targets exist.',
          scenarioContext: 'PoA drivers: opportunistic scanner finds Windows Server 2008, runs generic exploit, it fails due to custom hardening, attacker moves on (PoA≈5%). Targeted attacker researching your organization specifically, invests time to customize exploit for your exact patch level (PoA≈30%). Ransomware gang targeting healthcare orgs with legacy systems, willing to invest in exploit development (PoA≈20%).',
          whyTheseNumbers: 'PoA of 0.05–0.3 reflects attack economics. Most attackers use automated tools scanning thousands of targets — they don\'t manually customize exploits for each one. If a generic exploit fails, they move to the next target. Only motivated attackers (APTs, targeted ransomware, industrial espionage) invest time in legacy system exploitation.'
        },
        {
          factorId: 'vuln',
          action: 'expand',
          narrative: 'Vulnerability is the probability that an exploitation attempt succeeds. For legacy systems, this is paradoxical: known CVEs exist (high threat capability) but mitigating controls (network isolation, application firewalls) can reduce exploitation success (raising resistance strength). Let\'s decompose it.',
          scenarioContext: 'Your defenses: legacy server is network-isolated (only accessible from specific VLANs), protected by application firewall with virtual patching rules, monitored 24/7, and has data backups. But the OS itself remains unpatched, so any attacker who bypasses network controls finds trivial exploitation.',
          whyTheseNumbers: null
        },
        {
          factorId: 'tcap',
          action: 'focus',
          narrative: 'Threat Capability (TCap) for legacy system exploitation is 0.4–0.8 on a 0–100 scale. Known CVEs with public exploit code rate 0.7–0.8 (easy to exploit if you can reach the system). But many legacy exploits are unreliable (crash instead of compromise, work only on specific patch levels), lowering effective TCap to 0.4–0.6. Modern attackers sometimes lack expertise in old systems.',
          scenarioContext: 'TCap factors: Metasploit has exploit modules for Windows Server 2008 CVEs (TCap=0.7, reliable exploitation). But some CVEs require specific service packs or configurations, and modern attackers may lack knowledge of 15-year-old operating systems (TCap=0.5). Zero-day exploits for legacy systems are rare (vendors don\'t patch, so no urgency to discover new CVEs).',
          whyTheseNumbers: 'TCap of 0.4–0.8 reflects that "known vulnerability" doesn\'t equal "guaranteed exploitation." Public exploits often fail due to environment differences (patch level, antivirus, ASLR/DEP). Attackers targeting modern systems (Windows Server 2022) may not have tools or knowledge for legacy systems (Windows Server 2008). TCap decreases as systems age further from mainstream attacker focus.'
        },
        {
          factorId: 'rs',
          action: 'focus',
          narrative: 'Resistance Strength (RS) for legacy systems is your compensating controls, rated 0.3–0.7 on a 0–100 scale. Since the OS can\'t be patched (RS=0 at the OS level), all defense comes from network isolation, virtual patching, and monitoring. These controls raise RS significantly but can never reach modern system levels because the underlying platform is fundamentally compromised.',
          scenarioContext: 'Your controls: network segmentation (legacy server in isolated VLAN, firewall restricts access to 5 specific IPs, RS contribution=0.3), virtual patching via application firewall (blocks exploit attempts for known CVEs, RS contribution=0.2), intrusion detection monitoring for anomalous access (RS contribution=0.2). Total RS=0.3–0.7 depending on how many controls the attacker bypasses.',
          whyTheseNumbers: 'RS of 0.3–0.7 reflects compensating controls. Lower end (RS=0.3): attacker bypasses firewall via misconfiguration or insider access, reaches unpatched OS, trivial exploitation. Upper end (RS=0.7): multiple layers (network isolation + virtual patching + monitoring) work together, attacker must defeat all three. But RS can never reach 0.9+ (modern patched system level) because the foundation is vulnerable.',
          experiment: {
            prompt: 'Increase Resistance Strength to 0.6–0.9 to model adding micro-segmentation (each legacy system in its own network zone with zero-trust access). See how layered compensating controls reduce risk.',
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
          narrative: 'Loss Magnitude (LM) for legacy system compromise is $10K to $150K per incident, driven by investigation costs, temporary service disruption, and data recovery. This is lower than ransomware ($1M–$8M) or insider threats ($200K–$3M) because legacy systems are typically isolated, non-critical services. The organization tolerates them precisely because they\'re not mission-critical.',
          scenarioContext: 'When your legacy Windows Server 2008 database is compromised, you must: isolate the server (causing temporary service disruption), investigate what data was accessed, restore from backups (which may be weeks old), and temporarily migrate users to alternative systems while you rebuild or finally upgrade.',
          whyTheseNumbers: 'LM of $10K–$150K reflects that legacy systems are already on life support. Lower end: compromise detected quickly, clean backups available, service restored in hours ($10K–$30K). Upper end: attacker had access for weeks, backups are contaminated, forced emergency migration to modern system ($100K–$150K including migration labor and software licensing).'
        },
        {
          factorId: 'primary',
          action: 'expand',
          narrative: 'Primary losses for legacy system compromise are modest: Productivity (service downtime while investigating and restoring), Response (forensics and incident handling), and Replacement ($0 because you don\'t replace legacy systems — you either restore from backup or finally migrate to modern infrastructure). The compromise often accelerates overdue upgrades.',
          scenarioContext: 'Primary costs: 20 users affected by service outage for 2–3 days while investigating ($5K–$15K productivity), IT team investigating compromise and restoring from backups ($5K–$30K labor), potential external forensics if data exfiltration suspected ($10K–$50K), but Replacement is $0 (legacy system is already end-of-life, not worth replacing with identical system).',
          whyTheseNumbers: null
        },
        {
          factorId: 'productivity',
          action: 'focus',
          narrative: 'Productivity loss during legacy system compromise is $5K to $100K, depending on how many users depend on the system and how long it\'s offline. Since legacy systems are typically non-critical (critical systems get upgraded), most organizations can tolerate 2–5 days of downtime using manual workarounds.',
          scenarioContext: 'Productivity scenarios: legacy database serves 10 back-office users who can work from spreadsheets for 3 days during recovery (Productivity=$5K). Legacy ERP system serves 50 users in manufacturing, downtime halts production line for 2 days (Productivity=$80K–$100K). The upper bound represents the rare case where a "non-critical" legacy system turns out to be more critical than documented.',
          whyTheseNumbers: 'Productivity of $5K–$100K reflects that legacy systems exist because they\'re not mission-critical enough to justify upgrade costs. If downtime were truly catastrophic, the system would have been upgraded years ago. The upper bound accounts for cases where organizational knowledge has eroded and the system is more important than current staff realize.'
        },
        {
          factorId: 'response',
          action: 'focus',
          narrative: 'Response costs for legacy compromise are $5K to $50K, covering investigation, containment, and recovery. This is much lower than ransomware (Response=$200K–$2M) because legacy system forensics are straightforward: the system is unpatched, the compromise method is known CVE exploitation, and recovery is "restore from backup." No mystery, no extensive investigation.',
          scenarioContext: 'Response involves: IT team isolating the compromised server (2 hours), reviewing logs to identify exploitation method and timeline (8–16 hours), checking backups for integrity (4 hours), restoring from clean backup (4–24 hours depending on data volume), and potentially engaging external forensics if customer PII was on the system ($10K–$30K).',
          whyTheseNumbers: 'Response of $5K–$50K reflects known attack vectors. Unlike APT investigations (unknown entry point, months of forensics), legacy system compromises are obvious: "They exploited CVE-2017-XXXX because we couldn\'t patch it." Response is procedural restoration, not mystery-solving. External forensics only needed if regulatory notification might be required (PII accessed).'
        },
        {
          factorId: 'replacement',
          action: 'focus',
          narrative: 'Replacement costs are $0 for legacy system compromise. You don\'t replace an end-of-life Windows Server 2008 with another Windows Server 2008 — that would be absurd. Instead, you either restore from backup (no replacement) or finally execute the long-delayed migration to modern infrastructure (which is a capital project, not an incident response cost).',
          scenarioContext: 'Post-compromise, you have three options: (1) restore from backup and continue running the legacy system (Replacement=$0, accept ongoing risk), (2) accelerate planned migration to modern system (capital project, not incident cost), or (3) decommission the system and migrate users to alternative services (also a project, not incident cost).',
          whyTheseNumbers: 'Replacement of $0 reflects that legacy systems are already zombies — kept alive out of necessity, not investment. No one budgets for "replace compromised legacy system with identical legacy system." The compromise either triggers the overdue migration project (future capital expense) or you restore and accept the risk until migration budget is approved.'
        }
      ]
    },
    {
      title: 'Chapter 3: Understanding Ripple Effects',
      steps: [
        {
          factorId: 'secondary',
          action: 'expand',
          narrative: 'Secondary losses for legacy system compromise are modest ($2K–$50K) compared to other threats because: (1) legacy systems rarely contain sensitive customer data (they\'ve been isolated precisely because of security concerns), (2) stakeholders already know the system is insecure (documented as technical debt), and (3) compromise accelerates overdue upgrades (which stakeholders secretly welcome). Let\'s decompose into SLEF and SLM.',
          scenarioContext: 'If your legacy Windows Server 2008 is compromised, customers aren\'t surprised ("You were still running Server 2008?!"), regulators view it as expected risk for unpatched systems, and internal stakeholders use the incident to finally secure migration budget. Secondary consequences depend on whether sensitive data was on the system.',
          whyTheseNumbers: null
        },
        {
          factorId: 'slef',
          action: 'focus',
          narrative: 'Secondary Loss Event Frequency (SLEF) for legacy system compromise is 0.05–0.3 (5–30%), reflecting that most legacy system compromises stay internal. If no sensitive data was accessed and the system is restored quickly, there\'s no regulatory reporting requirement, no customer notification, and no media coverage. SLEF rises only if PII was on the system or if the incident becomes a case study in technical debt consequences.',
          scenarioContext: 'Low SLEF (5%): legacy system contained only internal operational data, restored from backup, incident documented internally, no external disclosure. High SLEF (30%): legacy system had customer PII (despite policy against it), compromise required breach notification, media coverage ("Company X breached due to running 15-year-old OS"), board demands accountability.',
          whyTheseNumbers: 'SLEF of 0.05–0.3 is lower than ransomware (SLEF=60–100%) or insider threats (SLEF=70–100%) because legacy compromises lack the drama and betrayal elements that drive publicity. "Company compromised via known CVE in unpatched system" is boring news unless it involves massive data theft or critical infrastructure.'
        },
        {
          factorId: 'slm',
          action: 'expand',
          narrative: 'Secondary Loss Magnitude (SLM) when legacy compromise does trigger external consequences is $2K to $50K, driven by modest fines (if PII was involved), limited reputation damage (stakeholders already knew the system was insecure), and minimal competitive loss (legacy systems rarely contain strategic data). Let\'s break it down.',
          scenarioContext: 'If a legacy system compromise requires breach notification, the response is muted: customers expect old systems to be vulnerable, regulators impose light fines for known risks, and competitors already assume you have technical debt. The main consequence is internal: CTO or CISO may face accountability for not migrating sooner.',
          whyTheseNumbers: null
        },
        {
          factorId: 'fines',
          action: 'focus',
          narrative: 'Regulatory fines for legacy system compromise are minimal ($0–$10K) unless the system contained PII despite policies against it. Regulators view legacy systems as documented risks — if you\'ve communicated the risk to leadership and they chose not to fund upgrades, that\'s a business decision, not negligence. Fines occur when legacy systems were off-the-books (undocumented risk).',
          scenarioContext: 'No fines: legacy system documented in risk register, management aware, no PII. Modest fines ($1K–$10K): legacy system had PII despite policy, breach notification required, regulators find inadequate compensating controls (no network isolation or virtual patching). This is much less than "we ignored patching" ($100K+) because legacy can\'t be patched by definition.',
          whyTheseNumbers: 'Fines of $0–$10K reflect regulatory pragmatism. If you documented the risk, implemented compensating controls (network isolation, virtual patching), and planned migration (even if not yet executed), regulators view the compromise as accepted risk, not negligence. Fines appear when legacy systems were hidden from oversight or contained data they shouldn\'t have.'
        },
        {
          factorId: 'reputation',
          action: 'focus',
          narrative: 'Reputation damage from legacy system compromise is modest ($1K–$25K). Customers and partners already assume you have technical debt — all organizations do. Reputation loss occurs primarily when the compromise reveals that management ignored documented risks for years, or when critical systems turn out to be running on legacy platforms (suggesting broader infrastructure neglect).',
          scenarioContext: 'Reputation scenarios: single legacy server compromised, customers aren\'t surprised, minimal churn ($1K–$5K). Compromise reveals that 30% of your infrastructure is end-of-life, customers question your investment in security, some delay renewals ($15K–$25K). The damage is less "you were breached" and more "you\'ve been deferring maintenance."',
          whyTheseNumbers: 'Reputation of $1K–$25K reflects normalized expectations. Unlike ransomware (Reputation=$500K–$8M, suggests systemic failure) or insider threats (Reputation=$200K–$10M, suggests cultural failure), legacy compromise suggests budget priorities and technical debt — relatable problems that don\'t fundamentally undermine trust. Customers understand "we couldn\'t afford to upgrade" more than "we ignored basic security."'
        },
        {
          factorId: 'competitive',
          action: 'focus',
          narrative: 'Competitive advantage loss from legacy system compromise is minimal ($1K–$15K). Legacy systems typically contain historical or operational data, not strategic secrets. If source code or customer lists were on a legacy system (they shouldn\'t be), competitive loss increases. But most organizations isolate legacy systems precisely to limit damage from inevitable compromise.',
          scenarioContext: 'Competitive loss occurs when: legacy system contained product roadmaps (outdated but still relevant), customer contact lists, or pricing models. But data on legacy systems is often stale (years old) because modern workflows don\'t touch those systems. Competitors gaining access to 5-year-old roadmaps or customer data have limited advantage.',
          whyTheseNumbers: 'Competitive of $1K–$15K reflects low strategic value. Organizations running legacy systems have often migrated critical data to modern platforms, leaving only historical archives or non-strategic operations on legacy infrastructure. The $15K upper bound represents rare cases where valuable data ended up on legacy systems against policy (e.g., engineer took shortcut, used old database for prototype that became production).',
          experiment: {
            prompt: 'Increase Competitive loss to $50K–$200K to model a scenario where legacy ERP contains current supplier pricing and contract terms. See how data value drives competitive damage.',
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
          narrative: 'You\'ve estimated all factors. Examine the results. The Loss Exceedance Curve shows your risk distribution. The 90th percentile is typically $40K–$200K annually for legacy system compromise risk. Notice the unique profile: losses are modest across all categories because organizations already treat legacy systems as high-risk and isolate them accordingly. The breakdown reveals legacy systems as managed technical debt, not uncontrolled vulnerabilities. Compare control strategies: modern systems (patch regularly, raise RS via updates) vs. legacy systems (can\'t patch, raise RS via compensating controls: isolation, virtual patching, monitoring). Use these results in migration business cases: the 90th percentile legacy risk ($150K annually) plus ongoing compensating control costs ($50K/year for isolation, monitoring) often exceed migration project costs ($300K–$500K one-time). The curve reveals that legacy systems become more expensive to secure over time: as the OS ages further from mainstream attacker focus, TCap decreases but compensating control costs increase (more CVEs to virtually patch, more obscure exploits to defend against). This creates a crossover point where "migrate now" becomes cheaper than "defer another year."',
          scenarioContext: 'Your CFO asked: "Should we spend $400K migrating our legacy Windows Server 2008 database to modern infrastructure?" You can now answer: "We face 50–500 exploitation attempts per year. Current compensating controls (network isolation, virtual patching, RS=0.3–0.7) result in 2.5–150 successful compromises annually, costing $10K–$150K each, with a 10% chance of exceeding $180K annually. Compensating controls cost $50K/year (firewalls, monitoring, virtual patching licenses). Over 5 years: legacy path = $750K risk + $250K controls = $1M total. Migration path = $400K one-time + eliminated risk. Migration ROI is positive in 2.5 years, and the risk reduction is permanent. Additionally, migration eliminates the risk of catastrophic failure when Server 2008 exploit code becomes widely available or when a compliance audit forces emergency migration at 3x cost."',
          whyTheseNumbers: 'Legacy system compromise illustrates that technical debt is security debt. Unlike threats you can directly mitigate (phishing via training, ransomware via backups), legacy systems are unfixable by definition — the only permanent solution is replacement. The FAIR model reveals that compensating controls (isolation, virtual patching) reduce risk but never eliminate it, and control costs accumulate indefinitely. For most organizations, the business case is clear: migrate when (annual legacy risk + annual compensating control costs) exceeds (amortized migration cost). The only reason to defer is capital budget constraints, not risk-adjusted economics. This tutorial teaches that "we can\'t afford to upgrade" often means "we haven\'t done the math" — when you quantify legacy risk properly, migration is usually the cheaper option within 2–3 years. Security is not just blocking attackers; it\'s also eliminating unfixable vulnerabilities through modernization.'
        }
      ]
    }
  ]
};
