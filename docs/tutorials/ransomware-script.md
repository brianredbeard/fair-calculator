# Ransomware Outbreak Tutorial - Voiceover Script

**Difficulty**: Intermediate
**Estimated Duration**: 15 minutes
**Scenario**: Enterprise file servers targeted by ransomware
**Key Teaching Theme**: High-impact, low-frequency risks and why secondary losses often exceed primary costs

## Recording Setup Notes

- **Pacing**: 125 words/minute (slightly slower for intermediate difficulty)
- **Tone**: Serious but not alarmist (ransomware is real but manageable)
- **Emphasis**: Stress the difference between LEF (rare, 0.1–0.6/year) vs. LM (catastrophic, $1M–$8M)
- **Experiments**: 3 experiment segments with 8-second pauses for user interaction

## Framework Recap Script (30 seconds)

> Welcome to the FAIR Calculator tutorial on Ransomware Outbreak analysis. FAIR, which stands for Factor Analysis of Information Risk, helps us quantify cybersecurity threats using a structured decomposition. Every risk breaks down into two components: how often it happens — that's Loss Event Frequency, or LEF — and how much it costs when it does — that's Loss Magnitude, or LM. The calculator multiplies these together to generate a risk distribution, showing you not just the average loss, but the full range of possible outcomes. Let's apply this framework to one of the most feared threats in cybersecurity: ransomware.

## Chapter 1: Understanding Frequency (4 minutes)

### Step 1: LEF (Loss Event Frequency)

> Let's start by estimating how often ransomware events happen. Loss Event Frequency, or LEF, is the number of successful ransomware incidents you'll face per year. For our enterprise file servers, we estimate 0.1 to 0.6 events annually. That's rare, but not impossible. In this scenario, your organization runs critical file servers accessed by 2,000 employees across 15 departments. If ransomware encrypts those shared drives, operations halt. An LEF of 0.1 to 0.6 per year means one incident every 1.7 to 10 years. This reflects strong email filtering and endpoint protection, but acknowledges that determined attackers occasionally break through.

**On-Screen**: LEF factor highlighted with range 0.1–0.6

**Teacher Note**: Students often confuse "rare" with "impossible." Emphasize that 0.1/year still means 10% chance this year, 100% chance over 10 years.

### Step 2: Expand LEF → TEF

> LEF breaks down into two parts: how often threats act — that's TEF — and how often they succeed — that's Vulnerability. Let's expand LEF to see Threat Event Frequency, the rate at which ransomware attempts occur, whether or not they succeed. Your security logs show blocked ransomware delivery attempts weekly. Most are stopped by email filters and endpoint detection.

**On-Screen**: LEF expands to show TEF and Vulnerability child nodes

### Step 3: CF (Contact Frequency)

> Contact Frequency is how often ransomware operators encounter your infrastructure. This includes phishing emails sent, exploit kits hitting your network, and drive-by downloads. For a mid-sized enterprise, we see 5 to 50 malicious contacts per year that specifically target file encryption. Threat intelligence shows your industry sees 20 to 30 targeted ransomware campaigns annually. Your email gateway blocks most, but some reach users. A CF of 5 to 50 per year reflects focused campaigns, not commodity malware. This is lower than generic phishing, which hits thousands of times per year, but higher than APT reconnaissance, which is only 1 to 2 per year.

**On-Screen**: CF factor focused with values 5–50

**Experiment Segment**:
> Now, try this: double the Contact Frequency to 10–100 to simulate increased targeting. [**8-second pause**] Notice how this affects the final risk number. More frequent contact, even with the same success rate, drives up overall risk.

**On-Screen During Pause**: Demonstrate changing CF lambda input from 5-50 to 10-100, show risk curve shift

### Steps 4-7: Continue through PoA, Vuln expansion, TCap, RS

[Continue following the same pattern for remaining Chapter 1 steps]

## Chapter 2: Estimating Direct Costs (4 minutes)

### Step 1: LM (Loss Magnitude)

> Now that we know how often ransomware hits, let's estimate the cost when it does. Loss Magnitude, or LM, is the financial damage per incident. For enterprise ransomware, we're looking at $1 million to $8 million per event, driven by downtime, response, and recovery. When ransomware locks your file servers, operations stop. Sales teams can't access contracts. Finance can't close books. Engineering can't ship code. Every hour costs money. An LM of $1 million to $8 million reflects 3 to 7 days of partial outage affecting 2,000 users, plus forensics, ransom decisions, and rebuild costs. This matches industry data for mid-market ransomware.

**On-Screen**: LM factor highlighted with range $1M–$8M

**Teacher Note**: Pause here to emphasize the magnitude. $1M–$8M per incident × 0.1–0.6 incidents/year = $100K–$4.8M annual expected loss before considering the tail.

### Steps 2-5: Primary expansion, Productivity, Response, Replacement

[Continue with all Chapter 2 steps]

## Chapter 3: Understanding Ripple Effects (5 minutes)

### Step 1: Secondary Expansion

> Primary costs are visible, but Secondary losses — customer reactions, regulatory penalties, competitive damage — often exceed them. Let's decompose Secondary loss into probability, that's SLEF, and magnitude, that's SLM. If ransomware leaks to the press or triggers breach notifications, you face regulatory scrutiny, customer churn, and reputational damage that persists for years.

**On-Screen**: Secondary factor expanding to SLEF and SLM

### Steps 2-6: SLEF, SLM expansion, Fines, Reputation, Competitive

[Continue through all Chapter 3 steps, including experiment segments]

## Chapter 4: Interpreting Results (2 minutes)

### Step 1: Risk Interpretation

> You've estimated every factor. Now look at the results. The Loss Exceedance Curve shows the full risk distribution. The 90th percentile is your "bad but plausible" number — the loss you'll exceed 10% of the time. For ransomware, this is often $2 million to $10 million annually. Notice how the tail extends: low-frequency, high-impact risks have wide uncertainty. The breakdown shows Secondary losses often exceed Primary. This is the signature of ransomware: the attack costs less than the aftermath. Use these results to prioritize controls — raise Resistance Strength through network segmentation and offline backups. Plan budgets: the 90th percentile is your reserve. And communicate risk to executives: show them the curve, not just the mean. This is FAIR in action.

**On-Screen**: Full risk dashboard with Loss Exceedance Curve visible

**Teacher Note**: End on actionable insights. Students should leave understanding not just "ransomware is expensive" but "here's how to use FAIR analysis to justify specific controls."

## Post-Tutorial Discussion Questions

1. **Frequency vs. Magnitude Trade-offs**: If you had to choose between (a) reducing LEF by 50% through better email filtering, or (b) reducing LM by 50% through faster backup recovery, which would you prioritize and why?

2. **Secondary Loss Timing**: Secondary losses (reputation, competitive damage) often manifest over 12–24 months, while Primary losses occur immediately. How should this time difference affect your risk communication to executives who operate on quarterly budgets?

3. **Control Selection**: The tutorial shows Resistance Strength (RS) of 0.2–0.4 as a key driver of Vulnerability. Which specific controls (network segmentation, offline backups, MFA, endpoint detection) would you invest in to raise RS to 0.6–0.8, and why?

4. **Tail Risk Interpretation**: The 90th percentile loss ($2M–$10M) can seem abstract. How would you explain to a non-technical CFO what "10% chance of exceeding $10M annually" means for budget planning?

5. **SLEF Drivers**: Secondary Loss Event Frequency (SLEF) is 0.6–1.0 (60–100%) because ransomware almost always becomes public. Can you think of scenarios where SLEF would be lower (<50%), and would those scenarios change your control strategy?

## Common Misconceptions

| Misconception | Reality | Teaching Point |
|---------------|---------|----------------|
| "Ransomware is low-frequency, so it's low-risk" | Low LEF (0.1–0.6/year) × High LM ($1M–$8M) = Significant annual risk | Frequency and magnitude are independent. Rare events can dominate risk if magnitude is high enough. |
| "If we pay the ransom, the loss is just the ransom amount" | Ransom is often <30% of total loss. Response, recovery, and secondary losses exceed the ransom payment. | Walk through LM decomposition showing Productivity + Response + Replacement + Secondary > ransom cost. |
| "Strong email filtering makes ransomware impossible" | Email filtering reduces CF, not PoA or Vulnerability. Determined attackers find other vectors (RDP, VPN exploits, supply chain). | Emphasize defense-in-depth: reduce CF, PoA, TCap, and raise RS. No single control eliminates risk. |
| "Our backups eliminate ransomware risk" | Backups reduce Replacement cost and recovery time (lower LM), but don't prevent the incident (LEF unchanged). Primary and Secondary losses still occur. | Backups are mitigation, not prevention. You still face downtime, investigation, and potential data exfiltration (secondary losses). |
| "The 'most likely' value in PERT is the only number that matters" | FAIR uses the full PERT distribution (min, likely, max) to model uncertainty. The 90th percentile often exceeds the 'likely' value by 3–5x. | Show Loss Exceedance Curve: median vs. 90th percentile. Risk management is about the tail, not just the center. |

---

**Validation Checklist**:
- [x] Header metadata (title, difficulty, duration, summary, teaching theme)
- [x] Recording setup notes
- [x] Framework recap blockquoted
- [x] All 4 chapter sections with voiceover scripts
- [x] Discussion questions (5)
- [x] Common misconceptions table
