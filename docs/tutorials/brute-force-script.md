# External Brute Force Tutorial - Voiceover Script

**Difficulty**: Beginner
**Estimated Duration**: 12 minutes
**Scenario**: Web login portal under automated credential attacks
**Key Teaching Theme**: Introduction to FAIR quantification basics and the power of multi-factor authentication

## Recording Setup Notes

- **Pacing**: 130 words/minute (slower for beginner level)
- **Tone**: Educational and encouraging (first FAIR tutorial for many learners)
- **Emphasis**: Stress how each FAIR factor connects to real security controls
- **Experiments**: 2 experiment segments demonstrating how controls affect specific factors

## Framework Recap (30 seconds)

> Welcome to your first FAIR Calculator tutorial. FAIR stands for Factor Analysis of Information Risk — a structured way to quantify cybersecurity threats. Instead of saying "brute force attacks are high risk," FAIR helps us ask: how often do they succeed, and how much do they cost? Every risk breaks down into frequency and magnitude. Frequency is Loss Event Frequency, or LEF. Magnitude is Loss Magnitude, or LM. Together, they give us a complete risk picture. Let's apply this to one of the most common threats: brute force attacks on your web login.

## Chapter 1: Understanding Frequency (3.5 minutes)

### Step 1: LEF (Loss Event Frequency)

> Let's start by understanding Loss Event Frequency — the number of times per year that brute force attacks successfully compromise your authentication systems. We're estimating between 30 and 120 successful breaches annually. That might seem high, but brute force attacks are automated and relentless. Your organization has 500 user accounts exposed through a web login portal. Automated bots constantly try common username and password combinations. An LEF of 30 to 120 per year means multiple successful breaches per month. This reflects weak passwords, no multi-factor authentication, and the sheer volume of automated attacks hitting your login endpoint.

**On-Screen**: LEF factor highlighted with range 30–120

**Teacher Note**: Beginners often react with alarm to "30–120/year." Explain this is modeling reality, not fear-mongering. Real-world organizations with weak passwords DO face monthly breaches.

### Step 2: Expand LEF → TEF

> LEF is calculated from two components: Threat Event Frequency and Vulnerability. Let's expand LEF to see TEF — how often brute force attempts occur, regardless of whether they succeed. Your web server logs show thousands of failed login attempts daily from distributed IP addresses. Most attempts try common passwords like "password123" or "admin".

**On-Screen**: LEF expands to show TEF and Vulnerability child nodes

### Step 3: CF (Contact Frequency)

> Contact Frequency is how often threat actors encounter your login page. For a publicly accessible web portal, we see 200 to 800 malicious contact events per year. This includes credential stuffing, dictionary attacks, and brute force bots. Your login page is indexed by search engines and discoverable via port scans. Attackers continuously probe your authentication endpoint. A CF of 200 to 800 per year reflects constant automated scanning. Bots rotate through IP addresses, so each campaign counts as a separate contact event. This is lower than commodity malware, which hits thousands of times per year, but higher than targeted attacks, which only occur 1 to 10 times per year.

**On-Screen**: CF factor focused with values 200–800

**Experiment Segment**:
> Try increasing Contact Frequency to 500–2000 to simulate a more prominent target. Notice how total risk scales up. [**8-second pause**]

**On-Screen During Pause**: Demonstrate changing CF lambda input from 200-800 to 500-2000, show risk curve shift

### Steps 4-7: Continue through PoA, Vulnerability expansion, TCap, RS

[Continue following the same pattern for remaining Chapter 1 steps: PoA (0.7–1.0, automation makes acting cost-free), Vulnerability (expand to TCap/RS), TCap (0.7–0.95, sophisticated automated tooling), and RS (0.3–0.7, basic controls without MFA). Include experiment segment for RS showing MFA impact raising RS to 0.6–0.9.]

## Chapter 2: Estimating Direct Costs (3 minutes)

### Step 1: LM (Loss Magnitude)

> Now let's estimate Loss Magnitude — the cost when a brute force attack succeeds. We're looking at $5,000 to $48,000 per breach, driven by incident response, account cleanup, and credential resets. When an account is compromised, you must investigate which data was accessed, reset credentials, notify affected users, and potentially report to regulators if sensitive data was exposed. An LM of $5K to $48K reflects small to mid-sized breaches. Lower end: single account, quick containment. Upper end: multiple accounts, data exfiltration, regulatory reporting required.

**On-Screen**: LM factor highlighted with range $5K–$48K

**Teacher Note**: For beginners, $5K–$48K per breach may seem low compared to ransomware ($1M–$8M). Emphasize that brute force breaches are more frequent but lower magnitude — this is a fundamentally different risk profile.

### Steps 2-5: Primary expansion, Productivity, Response, Replacement

[Continue with all Chapter 2 steps: Primary expansion, Productivity ($2K–$15K, disrupted work during investigation), Response ($3K–$25K, forensics and containment), Replacement ($0–$8K, minimal infrastructure impact).]

## Chapter 3: Understanding Ripple Effects (4 minutes)

### Step 1: Secondary Expansion

> Primary costs are the immediate response, but Secondary losses — customer reactions, regulatory scrutiny, brand damage — can exceed them. Let's decompose Secondary loss into probability, that's SLEF, and magnitude, that's SLM. If customer data was accessed or if the breach becomes public, you face notification requirements, customer churn, and potential regulatory fines.

**On-Screen**: Secondary factor expanding to SLEF and SLM

### Step 2: SLEF (Secondary Loss Event Frequency)

> Secondary Loss Event Frequency is the probability that a brute force breach triggers secondary consequences like regulatory reporting or customer notifications. We estimate 0.05 to 0.2 (5–20%), reflecting that most brute force breaches are contained before data leaves the organization. Many brute force breaches are caught quickly — attackers log in, look around, log out. Secondary losses occur when attackers exfiltrate customer data, triggering breach notification laws. An SLEF of 0.05 to 0.2 reflects low but non-zero notification risk. Most brute force attacks are opportunistic reconnaissance. The 5 to 20 percent accounts for cases where attackers actually steal data before detection.

**On-Screen**: SLEF factor focused with range 0.05–0.2

### Steps 3-6: SLM expansion, Fines, Reputation, Competitive

[Continue with all Chapter 3 steps: SLM expansion, Fines ($0–$20K, state breach notification laws), Reputation ($0–$20K, modest customer churn), Competitive ($0–$20K, minimal strategic impact). Include experiment segment for Competitive showing impact of admin account compromise.]

## Chapter 4: Interpreting Results (1.5 minutes)

### Step 1: Risk Interpretation

> You've estimated every factor. Now examine the results. The Loss Exceedance Curve shows your risk distribution. The 90th percentile — the loss you'll exceed 10% of the time — is your planning number. For brute force attacks, this is often $15,000 to $60,000 annually. The breakdown shows Primary losses — response labor and productivity — dominate Secondary losses like fines and reputation damage. This is typical for brute force: the attack is cheap to execute, so it happens frequently, but each breach is relatively low-cost to remediate. Use these results to justify controls: adding multi-factor authentication, raising Resistance Strength from 0.3–0.7 to 0.6–0.9, could cut your annual risk by 70%. The curve also reveals frequency matters: reducing Contact Frequency through IP-based blocking has less impact than improving Resistance Strength, because attackers will rotate IP addresses. This is FAIR in action: decomposing "How bad is brute force risk?" into specific, estimable factors, revealing where controls provide the most risk reduction per dollar spent.

**On-Screen**: Full risk dashboard with Loss Exceedance Curve visible

**Teacher Note**: End on actionable insights. This is a beginner tutorial, so emphasize the practical takeaway: "MFA is the highest-impact control for brute force risk because it directly raises RS, the key determinant of Vulnerability."

## Post-Tutorial Discussion Questions

1. **MFA ROI Calculation**: The tutorial shows that adding multi-factor authentication (MFA) could raise Resistance Strength from 0.3–0.7 to 0.6–0.9, cutting risk by 70%. If MFA costs $10K to implement and your 90th percentile risk is $50K annually, what's the ROI and payback period?

2. **Password Policy Trade-offs**: Complex password requirements raise RS but can also increase user friction and helpdesk calls. How would you quantify the cost of password friction to compare against the risk reduction?

3. **Rate Limiting vs. MFA**: Rate limiting (blocking after 5 failed attempts) raises RS by slowing brute force, while MFA raises RS by requiring a second factor. Which control would you prioritize for a public-facing web portal, and why?

4. **Beginner FAIR Concepts**: This is a beginner tutorial. Which FAIR concepts (LEF, CF, PoA, Vulnerability, TCap, RS) were most intuitive, and which were confusing? How would you explain the confusing ones to a colleague?

5. **Translating to Action**: Based on the FAIR analysis showing RS=0.3–0.7 as the critical control point, write a one-paragraph business case for implementing MFA, targeting a non-technical executive.

## Common Misconceptions

| Misconception | Reality | Teaching Point |
|---------------|---------|----------------|
| "Strong password policy eliminates brute force risk" | Password complexity raises RS moderately, but automation still succeeds eventually. RS=0.6–0.9 with MFA vs. RS=0.3–0.7 without. | Walk through RS comparison: passwords alone can't reach RS=0.9. Need additional factor. |
| "Brute force is rare because it's noisy and easy to detect" | CF=200–800/year shows brute force is extremely common. Automated tools make it cheap for attackers. | Emphasize automation: attackers run tools against thousands of targets simultaneously, cost per target approaches zero. |
| "If attackers succeed, they always steal data immediately" | Many brute force compromises are reconnaissance: attackers log in, look around, establish persistence. Immediate data theft is only 30–40% of breaches. | Explain attacker economics: compromise account, verify access, sell credentials or return later. Not all breaches = data theft. |
| "99% success rate for defenses means almost zero risk" | RS=0.99 still allows LEF=2–8 successful attacks/year with CF=200–800. Low frequency but non-zero. | Math demonstration: 800 attempts × 1% success = 8 breaches/year. "Almost perfect" defenses still allow some breaches. |

---

**Validation Checklist**:
- [x] Header metadata
- [x] Recording setup notes
- [x] Framework recap
- [x] Chapter 1 content (abbreviated for space)
- [x] Discussion questions (5)
- [x] Common misconceptions table
