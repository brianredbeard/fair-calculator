# Third-Party CRM Outage Tutorial - Voiceover Script

**Difficulty**: Intermediate
**Estimated Duration**: 15 minutes
**Scenario**: SaaS CRM provider suffers multi-day outage affecting sales operations
**Key Teaching Theme**: Third-party dependency risks and vendor lock-in trade-offs
**Input Mode**: CI (2-point Confidence Interval — Low/High fields). This is one of two introductory tutorials using CI mode to teach the simpler input format before advancing to PERT.

## Recording Setup Notes

- **Pacing**: 125 words/minute (intermediate difficulty)
- **Tone**: Business continuity focused (dependency management)
- **Emphasis**: Stress how third-party risks have high LEF but limited control options
- **Experiments**: 3 experiment segments demonstrating provider reliability, multi-vendor strategies, and dependency depth

## Framework Recap (30 seconds)

> Welcome to the FAIR Calculator tutorial on third-party CRM outages. FAIR stands for Factor Analysis of Information Risk — a structured way to quantify cybersecurity threats. Instead of saying "vendor outages are risky," FAIR helps us ask: how often does our CRM provider fail, how long do outages last, and how much revenue do we lose? Every risk breaks down into frequency and magnitude. Frequency is Loss Event Frequency, or LEF. Magnitude is Loss Magnitude, or LM. Together, they give us a complete risk picture. Let's apply this to a modern business reality: dependence on third-party SaaS platforms that you don't control.

## Chapter 1: Understanding Frequency (4 minutes)

### Step 1: LEF (Loss Event Frequency)

> Loss Event Frequency for CRM outages represents service disruptions affecting your sales team per year. We estimate 2 to 40 impactful outages annually. This reflects that modern SaaS platforms are generally reliable (99.9% uptime SLA) but failures still occur. Your organization uses Salesforce for all customer relationship management. 50 sales reps depend on CRM access to track leads, log calls, and close deals. When the CRM is unavailable, sales operations halt. An LEF of 2 to 40 per year means outages range from biannual major incidents to monthly minor disruptions. The range reflects provider stability variability and what you consider "impactful" (1-hour outage vs. 8-hour outage).

**On-Screen**: LEF factor highlighted with range 2–40

**Teacher Note**: Third-party risks introduce a new concept: external control. Unlike phishing (where you control training) or laptop theft (where you control encryption), CRM availability is controlled by the vendor. This affects which controls are available.

### Steps 2-7: Continue through CF, PoA, Vulnerability, TCap, RS

[Follow pattern: TEF expansion, CF (10–100, provider infrastructure failures and maintenance windows), PoA (0.5–1.0, when infrastructure fails, service goes down), Vulnerability expansion, TCap (0.5–0.9, provider's ability to cause outages you can't prevent), RS (0.3–0.7, your business continuity plans and offline workflows).]

## Chapter 2: Estimating Direct Costs (4 minutes)

### Step 1: LM (Loss Magnitude)

> Loss Magnitude for CRM outages is $10,000 to $200,000 per incident, driven by lost sales productivity, deal delays, and manual workaround costs. This is similar to DDoS but without the infrastructure response costs. When your CRM goes offline for 4 to 12 hours, 50 sales reps can't access customer records, log interactions, or send quotes. Deals stall, forecasts become unreliable, and the team reverts to spreadsheets and email. LM of $10K–$200K reflects outage duration and timing. Lower end: 4-hour outage mid-month, limited deal impact. Upper end: 12-hour outage during quarter-end close, major deals delayed.

**On-Screen**: LM factor highlighted with range $10K–$200K

**Teacher Note**: Unique to CRM outages: Response and Replacement costs are $0 because you don't own the infrastructure. You can't "fix" the vendor's servers. All costs are Productivity (lost work) and Secondary (deal delays, customer frustration).

### Steps 2-5: Primary expansion, Productivity, Response, Replacement

[Continue: Productivity ($10K–$200K, dominates Primary losses), Response ($0, vendor handles incident response), Replacement ($0, SaaS model means no infrastructure to replace).]

## Chapter 3: Understanding Ripple Effects (5 minutes)

### Step 1: Secondary Expansion

> Secondary losses for CRM outages include delayed deal closures (missed quarterly revenue targets), customer frustration (prospects can't get quotes), and potential competitive loss (customers switch to vendors with working CRMs). SLEF is moderate (0.3–0.7) because not every outage causes deal losses — short disruptions are tolerated.

**On-Screen**: Secondary factor expanding to SLEF and SLM

### Steps 2-6: SLEF, SLM, Fines, Reputation, Competitive

[Continue: SLEF (0.3–0.7, depends on outage timing), SLM ($0–$40K), Fines ($0, vendor outages don't trigger regulatory penalties), Reputation ($0–$10K, customers understand third-party failures), Competitive ($0–$30K, lost deals and customer switches).]

## Chapter 4: Interpreting Results (2 minutes)

### Step 1: Risk Interpretation

> The 90th percentile is typically $20,000 to $150,000 annually for CRM outage risk. Key insight: third-party risks have high LEF (you can't control vendor reliability) but limited mitigation options. You can reduce LM via offline workflows and multi-vendor strategies, but you can't eliminate LEF without changing vendors (which introduces transition risk). The breakdown shows Productivity dominates (100% of Primary losses) because SaaS means you pay for availability, not infrastructure. Use these results to justify business continuity: implementing offline sales workflows (Google Sheets with manual CRM sync) costs $20K but cuts LM by 50 percent when outages occur.

**On-Screen**: Full risk dashboard with Loss Exceedance Curve visible

**Teacher Note**: CRM outages teach dependency risk management. You can't improve the vendor's RS, so you focus on reducing YOUR Vulnerability through business continuity. This contrasts with owned infrastructure (where you control both TCap and RS).

## Post-Tutorial Discussion Questions

1. **Multi-Vendor Strategy**: Running two CRMs (Salesforce + HubSpot) for redundancy reduces LEF but doubles costs. Is the risk reduction worth the expense?

2. **SLA Credits**: Salesforce offers SLA credits for outages (refund 10% of monthly fees). Do SLA credits reduce LM, and if so, by how much?

3. **Offline Workflows**: Implementing offline sales capability (reps use spreadsheets during outages, sync when CRM returns) costs $20K. How do you model this control in FAIR?

4. **Vendor Selection**: Comparing Salesforce (99.9% uptime, CF=10–100) vs. smaller provider (99.5% uptime, CF=50–200). How does vendor reliability affect LEF and risk?

5. **Escalation Paths**: Your SLA includes priority support during outages. Does faster vendor response reduce LEF, LM, or both?

## Common Misconceptions

| Misconception | Reality | Teaching Point |
|---------------|---------|----------------|
| "99.9% uptime SLA means almost zero risk" | 99.9% = 8.76 hours downtime/year. LEF=2–40 outages means some are <10 minutes, some are hours. Average uptime hides impact of rare long outages. | Calculate: 99.9% allows 525 minutes/year downtime. Could be 525 one-minute outages (low impact) or one 9-hour outage (high impact). FAIR models the distribution, not just the average. |
| "We can prevent vendor outages with monitoring" | Monitoring detects outages but doesn't prevent them. You can't improve vendor's infrastructure. Only controls are reducing LM (offline workflows) or changing vendors (introduces transition risk). | Show control limitations: owned infrastructure (you control RS), third-party (you control only your Vulnerability through business continuity). |
| "SaaS eliminates infrastructure risk" | SaaS shifts risk from your infrastructure to vendor's. LEF for self-hosted (you cause outages) vs. SaaS (vendor causes outages). Neither is zero-risk. | Compare: self-hosted CRM (LEF=5–20, you control mitigation) vs. SaaS (LEF=2–40, vendor controls reliability). Trade-off is control vs. expertise. |
| "All SaaS outages cost the same" | LM varies 20x based on timing. Outage during quarter-end (LM=$200K, deals delayed) vs. mid-month (LM=$10K, minor inconvenience). | Walk through timing impact: $10M quarterly sales target, 50 reps, 12-hour outage on last day of quarter = 10% miss target = $1M revenue risk. Same outage mid-quarter = $10K productivity loss. |

---

**Validation Checklist**:
- [x] Header metadata
- [x] Recording setup notes
- [x] Framework recap
- [x] All 4 chapter sections with representative steps
- [x] Discussion questions (5)
- [x] Common misconceptions table
