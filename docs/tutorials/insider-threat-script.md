# Malicious Insider Data Theft Tutorial - Voiceover Script

**Difficulty**: Intermediate
**Estimated Duration**: 15 minutes
**Scenario**: Disgruntled employee exfiltrates customer database before termination
**Key Teaching Theme**: High-impact insider risks and data-centric security controls

## Recording Setup Notes

- **Pacing**: 125 words/minute (intermediate difficulty)
- **Tone**: Serious and investigative (insider threats are personal and sensitive)
- **Emphasis**: Stress how insider threats combine authorized access with malicious intent
- **Experiments**: 3 experiment segments demonstrating detection timing, DLP effectiveness, and departure risk

## Framework Recap (30 seconds)

> Welcome to the FAIR Calculator tutorial on malicious insider threats. FAIR stands for Factor Analysis of Information Risk — a structured way to quantify cybersecurity threats. Instead of saying "insider threats are devastating," FAIR helps us ask: how often do employees turn malicious, what data do they steal, and how much does it cost? Every risk breaks down into frequency and magnitude. Frequency is Loss Event Frequency, or LEF. Magnitude is Loss Magnitude, or LM. Together, they give us a complete risk picture. Let's apply this to one of the hardest threats to defend against: employees who abuse legitimate access to steal proprietary data.

## Chapter 1: Understanding Frequency (4 minutes)

### Step 1: LEF (Loss Event Frequency)

> Loss Event Frequency for insider data theft represents malicious exfiltration events per year. We estimate 0.4 to 12 incidents annually for an organization with 200 employees. This low-but-real frequency reflects that most employees are trustworthy, but disgruntled departures, financial pressure, and competitor recruitment create insider risk. Your organization has 200 employees with varying levels of database access. 20 employees in sales, engineering, and finance can export customer records, source code, or financial data. When an employee becomes disgruntled — facing termination, passed over for promotion, recruited by competitors — they may exfiltrate valuable data before leaving. An LEF of 0.4 to 12 per year means one incident every month to every 2.5 years. The uncertainty reflects whether your organization has strong HR relations, offboarding procedures, and data loss prevention tools.

**On-Screen**: LEF factor highlighted with range 0.4–12

**Teacher Note**: Insider threats are uncomfortable to discuss — you're modeling employees as adversaries. Frame this as defensive realism: most employees are good, but controls protect against the few who aren't. LEF=0.4–12 is much lower than phishing (10–1500) because insider threats require motive, not just opportunity.

### Steps 2-7: Continue through CF, PoA, Vulnerability, TCap, RS

[Follow pattern: TEF expansion, CF (5–24, employees with privileged access experiencing triggering events), PoA (0.1–0.6, most disgruntled employees don't steal data, but some do), Vulnerability expansion, TCap (0.7–0.95, insiders know what data is valuable and how to access it), RS (0.4–0.8, DLP and access controls vs. authorized user privileges).]

## Chapter 2: Estimating Direct Costs (4 minutes)

### Step 1: LM (Loss Magnitude)

> Loss Magnitude for insider data theft is $30,000 to $500,000 per incident, driven by forensic investigation, legal response, competitive intelligence loss, and potential regulatory fines. This is higher than most digital threats because insiders target high-value data specifically. When an employee exfiltrates your customer database, engineering designs, or pricing strategies before departing to a competitor, you face immediate investigation costs, potential lawsuits (enforcing non-competes), and long-term competitive disadvantage if the data is used against you. LM of $30K–$500K reflects data value and insider knowledge. Lower end: junior employee takes contact list (limited value). Upper end: senior engineer takes proprietary source code to competitor (major IP loss).

**On-Screen**: LM factor highlighted with range $30K–$500K

**Teacher Note**: Insider theft LM is driven by data value, not volume. An insider stealing 100 customer records they KNOW are high-value prospects costs more than an external attacker stealing 10,000 random records. Insiders have context.

### Steps 2-5: Primary expansion, Productivity, Response, Replacement

[Continue: Productivity ($5K–$50K, investigation disrupts teams), Response ($20K–$200K, forensics and legal action), Replacement ($5K–$250K, rebuilding trade secrets if IP was stolen).]

## Chapter 3: Understanding Ripple Effects (5 minutes)

### Step 1: Secondary Expansion

> Secondary losses for insider data theft include regulatory fines (if PII was stolen), reputation damage (customers question data security), and competitive advantage loss (stolen data used by competitors). SLEF is moderate (0.2–0.6) because not all insider theft becomes public — many cases are settled quietly to avoid reputational harm.

**On-Screen**: Secondary factor expanding to SLEF and SLM

### Steps 2-6: SLEF, SLM, Fines, Reputation, Competitive

[Continue: SLEF (0.2–0.6, many cases handled privately), SLM ($5K–$200K), Fines ($0–$50K, if PII was stolen and security was inadequate), Reputation ($0–$50K, handled discreetly in most cases), Competitive ($5K–$100K, stolen trade secrets used by competitors).]

## Chapter 4: Interpreting Results (2 minutes)

### Step 1: Risk Interpretation

> The 90th percentile is typically $40,000 to $400,000 annually for insider threat risk. Key insight: insider threats are rare (LEF=0.4–12) but high-impact (LM=$30K–$500K). The control strategy must balance access (employees need data to do their jobs) with protection (preventing misuse). Data-centric security — DLP, access logging, anomaly detection — raises RS by detecting exfiltration, but can't prevent it entirely because insiders have legitimate access. Use these results to justify controls: implementing DLP with user behavior analytics costs $100K but cuts LM by 60 percent by detecting exfiltration before data reaches competitors.

**On-Screen**: Full risk dashboard with Loss Exceedance Curve visible

**Teacher Note**: Insider threats teach the access vs. security trade-off. Unlike external threats (where you can block access entirely), insiders NEED access to work. Controls must detect misuse without blocking legitimate work.

## Post-Tutorial Discussion Questions

1. **Access vs. Security**: DLP raises RS but also creates friction (false positives blocking legitimate exports). How do you balance security vs. productivity?

2. **Departure Risk**: PoA spikes during departures (employees leaving to competitors). Should offboarding procedures include temporary access restrictions?

3. **Data Value**: Insider theft of 100 high-value customer records (LM=$100K) vs. external breach of 10,000 random records (LM=$50K). Why does insider context increase value?

4. **Legal Response**: Enforcing non-competes and NDAs (part of Response costs) can be expensive ($50K–$200K in legal fees). When is litigation worth the cost vs. accepting the loss?

5. **Cultural Controls**: Some orgs argue strong HR relations and employee satisfaction reduce PoA more than DLP. How would you model "culture" as a control in FAIR?

## Common Misconceptions

| Misconception | Reality | Teaching Point |
|---------------|---------|----------------|
| "Background checks prevent insider threats" | Background checks detect past criminal behavior, not future disgruntlement. PoA=0.1–0.6 driven by triggering events (termination, financial pressure) that occur AFTER hiring. | Explain temporal mismatch: you hire trustworthy people, but circumstances change. Controls must detect behavior change (UBA, access logging), not just screen at entry. |
| "Insiders steal massive datasets" | Insiders are targeted. They take the 100 customer records they know are valuable, not random dumps. Insider theft volume is lower but value is higher than external breaches. | Compare: insider takes 100 records worth $100K (they know which customers to target) vs. external attacker downloads 10,000 random records worth $50K. Context = value. |
| "We can revoke access instantly upon termination" | Most insider theft occurs BEFORE termination is announced. Employee hears rumors, downloads data, THEN resigns. Offboarding controls are too late. | Walk through timeline: Week 1 (employee hears layoff rumors), Week 2 (employee downloads customer DB), Week 3 (employee resigns). Access revocation at Week 3 doesn't prevent Week 2 exfiltration. |
| "Encryption prevents insider theft" | Encryption protects data at rest (external attackers can't read it). Insiders have decryption keys (they need them to work). Encryption is ineffective against authorized users. | Show control mismatch: encryption raises RS against external attackers (TCap for decryption is low), but insiders bypass encryption (they have keys). Need DLP (detects export), not encryption. |

---

**Validation Checklist**:
- [x] Header metadata
- [x] Recording setup notes
- [x] Framework recap
- [x] All 4 chapter sections with representative steps
- [x] Discussion questions (5)
- [x] Common misconceptions table
