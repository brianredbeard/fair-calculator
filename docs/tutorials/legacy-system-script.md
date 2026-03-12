# Unpatched Legacy System Tutorial - Voiceover Script

**Difficulty**: Intermediate
**Estimated Duration**: 15 minutes
**Scenario**: Critical business application running on unsupported Windows Server 2008 with known vulnerabilities
**Key Teaching Theme**: Technical debt as security debt and compensating controls when patching isn't possible
**Input Mode**: CI (2-point Confidence Interval — Low/High fields). This is one of two introductory tutorials using CI mode to teach the simpler input format before advancing to PERT.

## Recording Setup Notes

- **Pacing**: 125 words/minute (intermediate difficulty)
- **Tone**: Pragmatic and risk-focused (legacy systems are business realities)
- **Emphasis**: Stress how compensating controls can reduce risk when primary controls (patching) aren't available
- **Experiments**: 3 experiment segments demonstrating network segmentation, monitoring effectiveness, and replacement timing

## Framework Recap (30 seconds)

> Welcome to the FAIR Calculator tutorial on legacy system vulnerabilities. FAIR stands for Factor Analysis of Information Risk — a structured way to quantify cybersecurity threats. Instead of saying "unpatched systems are dangerous," FAIR helps us ask: how often are they exploited, what damage occurs, and how much would compensating controls reduce risk? Every risk breaks down into frequency and magnitude. Frequency is Loss Event Frequency, or LEF. Magnitude is Loss Magnitude, or LM. Together, they give us a complete risk picture. Let's apply this to a common enterprise reality: business-critical applications running on unsupported platforms you can't immediately replace.

## Chapter 1: Understanding Frequency (4 minutes)

### Step 1: LEF (Loss Event Frequency)

> Loss Event Frequency for legacy system exploitation represents successful attacks per year against unpatched vulnerabilities. We estimate 5 to 200 incidents annually. This wide range reflects that legacy systems are highly vulnerable (known unpatched CVEs) but often not Internet-exposed, reducing attacker access. Your organization runs a critical inventory management system on Windows Server 2008, which reached end-of-life in 2020. The application vendor stopped supporting the software in 2018, so you can't upgrade without replacing the entire system — a $500,000 project requiring 18 months. The server has 50 known critical vulnerabilities with public exploits. An LEF of 5 to 200 per year reflects the tension: the system is extremely vulnerable (any attacker who reaches it can exploit it), but network segmentation limits who can reach it.

**On-Screen**: LEF factor highlighted with range 5–200

**Teacher Note**: Legacy systems demonstrate that Vulnerability alone doesn't determine risk — attackers must also have Contact (reach the system). LEF combines high Vulnerability (known unpatched CVEs) with potentially low CF (if segmented). This is different from phishing (high CF, variable PoA).

### Steps 2-7: Continue through CF, PoA, Vulnerability, TCap, RS

[Follow pattern: TEF expansion, CF (50–500, depends on network exposure), PoA (0.05–0.3, attackers must discover the vulnerable system), Vulnerability expansion (near 1.0, unpatched systems always vulnerable), TCap (0.4–0.8, public exploits available), RS (0.3–0.7, compensating controls like segmentation and monitoring).]

## Chapter 2: Estimating Direct Costs (4 minutes)

### Step 1: LM (Loss Magnitude)

> Loss Magnitude for legacy system compromise is $40,000 to $800,000 per incident, driven by system rebuild, data recovery, business interruption, and potential ransomware if attackers pivot from initial access. This is higher than most digital threats because legacy systems often run critical business processes with limited backup options. When your Windows Server 2008 inventory system is compromised, you face immediate operational halt (warehouse can't fulfill orders), forensic investigation to determine what was accessed, emergency migration to replacement infrastructure, and potential data loss if backups are outdated. LM of $40K–$800K reflects criticality and replacement readiness. Lower end: attack detected early, replacement infrastructure already planned. Upper end: ransomware encrypts inventory database, 2-week outage during peak season, manual workarounds fail.

**On-Screen**: LM factor highlighted with range $40K–$800K

**Teacher Note**: Legacy systems have asymmetric costs: they're cheap to run (sunk cost, no licensing), expensive to compromise (no good recovery options). This creates dangerous incentives to delay replacement.

### Steps 2-5: Primary expansion, Productivity, Response, Replacement

[Continue: Productivity ($10K–$200K, business operations halted), Response ($10K–$100K, forensics and emergency migration), Replacement ($20K–$500K, accelerated replacement project).]

## Chapter 3: Understanding Ripple Effects (5 minutes)

### Step 1: Secondary Expansion

> Secondary losses for legacy system breaches include regulatory scrutiny (running unsupported systems with known vulnerabilities can be seen as negligence), reputation damage (customers question security practices), and competitive loss (operational disruptions let competitors capture market share). SLEF is moderate (0.3–0.7) because not all compromises become public, but regulators increasingly audit patching compliance.

**On-Screen**: Secondary factor expanding to SLEF and SLM

### Steps 2-6: SLEF, SLM, Fines, Reputation, Competitive

[Continue: SLEF (0.3–0.7, depends on data type and regulatory scope), SLM ($5K–$100K), Fines ($0–$50K, negligence findings), Reputation ($2K–$30K, "they ran outdated systems"), Competitive ($3K–$20K, operational disruptions).]

## Chapter 4: Interpreting Results (2 minutes)

### Step 1: Risk Interpretation

> The 90th percentile is typically $60,000 to $600,000 annually for legacy system risk. Key insight: you can't improve RS through patching (patches don't exist), so you reduce Vulnerability through compensating controls. Network segmentation lowers CF (attackers can't reach the system). Monitoring and EDR lower PoA and TCap (detecting and blocking exploit attempts). The curve reveals that delaying replacement creates growing risk: as more CVEs accumulate, TCap increases, driving up Vulnerability. Use these results to justify replacement: the $500K replacement project eliminates $400K annual risk — payback in 15 months, with risk elimination thereafter.

**On-Screen**: Full risk dashboard with Loss Exceedance Curve visible

**Teacher Note**: Legacy systems teach that security isn't binary (patched vs. unpatched). Compensating controls can reduce risk significantly even when primary controls aren't available. But there's a ceiling — eventually replacement becomes necessary.

## Post-Tutorial Discussion Questions

1. **Compensating Controls ROI**: Network segmentation costs $50K and reduces CF by 70%. Replacement costs $500K but eliminates risk entirely. Which has better ROI over 3 years?

2. **Risk Accumulation**: New CVEs are discovered monthly for Windows Server 2008. How does this affect TCap and risk trajectory over time?

3. **Criticality vs. Replaceability**: The inventory system is critical (Productivity=$10K–$200K per outage) but replacement is expensive ($500K). How do you model the "can't live with it, can't afford to replace it" dilemma?

4. **Virtual Patching**: WAF and IPS provide "virtual patching" by blocking known exploits without patching the OS. How does this affect RS compared to actual patching?

5. **Partial Replacement**: Could you replace 50% of legacy functionality with modern systems, reducing exposure while deferring full replacement? How would this affect risk?

## Common Misconceptions

| Misconception | Reality | Teaching Point |
|---------------|---------|----------------|
| "Unpatched systems are always breached immediately" | LEF=5–200, not 100% certainty. Network segmentation and monitoring reduce CF and PoA. Legacy systems CAN be operated safely with compensating controls, though risk is higher than patched systems. | Show control layers: Internet-exposed unpatched system (LEF≈200), segmented + monitored (LEF≈5). Compensating controls work but don't eliminate risk. |
| "We can't be held liable for using unsupported software" | Regulators increasingly view running known-vulnerable systems as negligence. Fines=$0–$50K. Acceptable defense requires documented compensating controls and replacement roadmap. | Walk through regulatory expectation: you CAN run legacy systems if you have (1) business justification, (2) compensating controls, (3) replacement plan. Missing any of these = negligence findings. |
| "Legacy systems don't contain valuable data" | Attackers don't care if the system is old — they care if it provides access. Legacy systems often have elevated privileges, unrestricted network access, or contain business-critical data (inventory, payroll, CRM). | Explain attacker perspective: compromising legacy system is often the easiest path to lateral movement. Attackers exploit the weakest link, then pivot to valuable targets. |
| "Replacement eliminates all risk" | Replacement has transition risk: data migration failures, business interruption during cutover, bugs in new system. Sometimes running legacy (known behavior) is less risky than replacement (unknown behavior). | Compare: legacy system risk ($400K/year, known and managed) vs. replacement risk (one-time $500K project with 20% failure rate = $100K expected cost). Risk-informed decision considers both. |

---

**Validation Checklist**:
- [x] Header metadata
- [x] Recording setup notes
- [x] Framework recap
- [x] All 4 chapter sections with representative steps
- [x] Discussion questions (5)
- [x] Common misconceptions table
