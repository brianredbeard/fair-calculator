# Phishing on Back-Office Tutorial - Voiceover Script

**Difficulty**: Beginner
**Estimated Duration**: 12 minutes
**Scenario**: Back-office staff targeted by credential harvesting campaigns
**Key Teaching Theme**: High-contact, low-conversion threats and the power of security awareness training

## Recording Setup Notes

- **Pacing**: 130 words/minute (slower for beginner level)
- **Tone**: Practical and empowering (phishing is common but trainable)
- **Emphasis**: Stress how PoA (user behavior) is the dominant control point
- **Experiments**: 3 experiment segments demonstrating email filtering, advanced detection, and executive targeting scenarios

## Framework Recap (30 seconds)

> Welcome to the FAIR Calculator tutorial on phishing analysis. FAIR stands for Factor Analysis of Information Risk — a structured way to quantify cybersecurity threats. Instead of saying "phishing is dangerous," FAIR helps us ask: how often do employees click malicious links, and how much does it cost when they do? Every risk breaks down into frequency and magnitude. Frequency is Loss Event Frequency, or LEF. Magnitude is Loss Magnitude, or LM. Together, they give us a complete risk picture. Let's apply this to one of the most common threats facing organizations: phishing attacks on back-office staff.

## Chapter 1: Understanding Frequency (3.5 minutes)

### Step 1: LEF (Loss Event Frequency)

> Let's start with Loss Event Frequency — the number of successful phishing attacks per year against your back-office staff. We're estimating 10 to 1500 successful compromises annually. This wide range reflects the uncertainty in user behavior: will employees click malicious links? Your organization has 200 back-office employees in HR, finance, and operations who receive thousands of emails daily. Phishing emails that bypass your email filter eventually reach user inboxes. An LEF of 10 to 1500 per year shows the math: high contact frequency — thousands of phishing emails reach inboxes — multiplied by low probability of action — most users don't click. The uncertainty is driven entirely by user behavior, not attacker capability.

**On-Screen**: LEF factor highlighted with range 10–1500

**Teacher Note**: The wide range (10–1500) often surprises beginners. Explain that this uncertainty is realistic — user behavior is highly variable. The key is identifying which factor drives the uncertainty (here: PoA, not CF or TCap).

### Step 2: Expand LEF → TEF

> LEF breaks down into Threat Event Frequency and Vulnerability. Let's expand LEF to see TEF — how often phishing attempts reach user inboxes, regardless of whether users click. Your email gateway blocks 99% of phishing attempts, but with millions of phishing emails sent globally each day, hundreds still slip through monthly.

**On-Screen**: LEF expands to show TEF and Vulnerability child nodes

### Step 3: CF (Contact Frequency)

> Contact Frequency is how often phishing emails reach employee inboxes. For back-office staff at a mid-sized organization, we see 1000 to 15000 phishing emails per year that bypass automated filters. This includes credential harvesting, fake invoices, and business email compromise. Phishing is a volume game. Attackers send millions of emails daily. Even with a 99% filter success rate, the sheer volume means your employees receive 3 to 40 phishing emails per day organization-wide. A CF of 1000 to 15000 per year reflects modern email threats. This is MUCH higher than brute force — 200 to 800 — or ransomware — 5 to 50 — because phishing is cheap to execute at scale. Attackers send to every discoverable email address.

**On-Screen**: CF factor focused with values 1000–15000

**Experiment Segment**:
> Try reducing Contact Frequency to 500–5000 to model improved email filtering. Notice how LEF drops proportionally — filtering is highly effective here. [**8-second pause**]

**On-Screen During Pause**: Demonstrate changing CF lambda input from 1000-15000 to 500-5000, show risk curve shift

### Steps 4-7: Continue through PoA, Vulnerability expansion, TCap, RS

[Continue following the same pattern for remaining Chapter 1 steps: PoA (0.01–0.1, the critical control point where training matters), Vulnerability (expand to TCap/RS), TCap (0.6–0.95, professionalized phishing-as-a-service), and RS (0.4–0.85, layered defenses with gaps). Include experiment segment for RS showing advanced AI-based filtering.]

## Chapter 2: Estimating Direct Costs (3 minutes)

### Step 1: LM (Loss Magnitude)

> Loss Magnitude is the cost per successful phishing attack. For back-office phishing, we're looking at $1,000 to $15,000 per incident, driven by credential resets, investigation time, and temporary productivity loss. This is much lower than ransomware — $1 million to $8 million — because most phishing attacks are caught quickly before major damage. When an employee clicks a phishing link and enters credentials, you must investigate what accounts were accessed, reset passwords, review audit logs for unauthorized access, and notify the affected employee. Most incidents are contained within hours. An LM of $1K to $15K reflects rapid containment. Lower end: employee self-reports immediately, only one account compromised, no data accessed. Upper end: delay in detection, attacker accessed HR or finance systems, multi-day investigation required.

**On-Screen**: LM factor highlighted with range $1K–$15K

**Teacher Note**: Compare phishing LM ($1K–$15K) to ransomware LM ($1M–$8M) from the previous tutorial. Phishing is high-frequency but low-magnitude — a fundamentally different risk profile requiring different controls.

### Steps 2-5: Primary expansion, Productivity, Response, Replacement

[Continue with all Chapter 2 steps: Primary expansion, Productivity ($500–$5K, employee downtime and IT investigation), Response ($500–$10K, containment and organization-wide alerts), Replacement ($0, credential theft doesn't destroy infrastructure).]

## Chapter 3: Understanding Ripple Effects (4 minutes)

### Step 1: Secondary Expansion

> Secondary losses occur when a phishing incident triggers external consequences: regulatory reporting if PII was accessed, customer notifications, or reputation damage. For most back-office phishing, secondary losses are minimal because incidents are contained before data exfiltration. Let's decompose into SLEF and SLM. Back-office employees access internal systems — HR databases, finance tools — but not typically customer-facing data. Unless the attacker uses stolen credentials to access and exfiltrate customer PII, there's no notification requirement.

**On-Screen**: Secondary factor expanding to SLEF and SLM

### Step 2: SLEF (Secondary Loss Event Frequency)

> Secondary Loss Event Frequency is the probability that a phishing incident becomes public or triggers regulatory reporting. We estimate 0.01 to 0.1 (1–10%), reflecting that most phishing incidents are detected and contained before any data leaves the organization. Most phishing attacks against back-office staff are caught when the employee reports the suspicious email or when automated monitoring detects unusual login patterns. Secondary losses occur only if the attacker actually downloads customer data before detection. An SLEF of 0.01 to 0.1 reflects strong containment. 90 to 99 percent of phishing incidents result in no data breach — just a password reset. The 1 to 10 percent accounts for cases where attackers act fast, accessing and exfiltrating data within hours.

**On-Screen**: SLEF factor focused with range 0.01–0.1

### Steps 3-6: SLM expansion, Fines, Reputation, Competitive

[Continue with all Chapter 3 steps: SLM expansion ($500–$10K), Fines ($0–$1K, minimal for internal-only breaches), Reputation ($0–$5K, low visibility), Competitive ($0–$4K, opportunistic not strategic). Include experiment segment for Competitive showing executive account compromise impact.]

## Chapter 4: Interpreting Results (1.5 minutes)

### Step 1: Risk Interpretation

> You've estimated all factors. Examine the results. The Loss Exceedance Curve shows your risk distribution. The 90th percentile — the loss you'll exceed 10% of the time — is typically $5,000 to $40,000 annually for back-office phishing. Notice the key insight: despite high Contact Frequency — 1000 to 15000 emails per year — the low Probability of Action — only 1 to 10 percent of employees click — keeps Loss Event Frequency manageable. This reveals the most effective control: security awareness training directly reduces PoA. Compare this to ransomware, where PoA is approximately 1.0 due to automation: training is highly effective against phishing, moderately effective against ransomware social engineering, and ineffective against brute force, which bypasses humans entirely. The breakdown shows Primary losses — investigation and password resets — dominate Secondary losses, which are rare. Use these results to prioritize: invest in continuous phishing simulation and training, which reduces PoA by 50 to 80 percent, rather than just better email filters, which reduce CF but attackers adapt. This tutorial demonstrates a critical FAIR lesson: frequency and magnitude are independent. Phishing has high contact but low damage per incident. Ransomware has low contact but high damage. Your control strategy must match the threat profile.

**On-Screen**: Full risk dashboard with Loss Exceedance Curve visible

**Teacher Note**: End on the strategic insight. Phishing teaches beginners that different threats require different controls. Show how FAIR decomposes risk to reveal where controls matter most: for phishing, it's PoA (training); for brute force, it's RS (MFA); for ransomware, it's Vulnerability (network segmentation and backups).

## Post-Tutorial Discussion Questions

1. **Training ROI**: The tutorial shows that security awareness training can reduce PoA from 3% to 1%, cutting LEF by 67%. If quarterly phishing simulations cost $15K annually and your current 90th percentile risk is $30K, what's the ROI if training cuts risk to $10K?

2. **Frequency vs. Magnitude Trade-offs**: Phishing has CF=1000–15000 (very high) but LM=$1K–$15K (low). Ransomware has CF=5–50 (low) but LM=$1M–$8M (high). Which threat would you prioritize for a $50K security budget, and why?

3. **Behavioral Controls**: PoA (0.01–0.1) is the dominant driver of phishing risk. Besides training, what other controls could reduce PoA? Consider technical controls (browser warnings, credential managers) vs. organizational controls (approval workflows for financial transfers).

4. **Email Filtering Limits**: The tutorial shows CF=1000–15000 even with a 99% effective email filter. Why does improving filter accuracy from 99% to 99.5% provide less risk reduction than cutting PoA from 3% to 1%? (Hint: look at the LEF = TEF × Vulnerability formula.)

5. **Executive Targeting**: The experiment shows how compromising an executive account with M&A data changes Competitive loss from $0–$4K to $10K–$100K. How would you design phishing simulations to specifically test executives who have access to strategic data?

## Common Misconceptions

| Misconception | Reality | Teaching Point |
|---------------|---------|----------------|
| "Email filters eliminate phishing risk" | Filters reduce CF (1000–15000 down from much higher), but PoA (1–10%) still drives significant LEF. You can't filter your way to zero risk. | Show the math: even 99.9% filter accuracy leaves hundreds of phishing emails reaching inboxes annually. PoA is the dominant control point. |
| "Phishing training doesn't work because users still click" | PoA of 1–10% means 90–99% of users DON'T click. Without training, PoA could be 20–30%, tripling LEF. Training is highly effective. | Compare trained (PoA=1–10%) vs. untrained (PoA=20–30%) populations. Training cuts clicks by 70–90%, even though some users always click. |
| "All phishing leads to data breaches and regulatory fines" | SLEF=0.01–0.1 shows 90–99% of phishing incidents result in no data exfiltration — just credential resets. Fines are rare ($0–$1K). | Walk through containment timeline: most incidents caught within hours before data leaves. Only 1–10% escalate to reportable breaches. |
| "Phishing is as dangerous as ransomware" | Phishing LM=$1K–$15K vs. ransomware LM=$1M–$8M. Phishing happens 10–1500×/year but each incident costs less. Total annual risk can be similar, but controls differ. | Compare Loss Exceedance Curves: phishing is frequent-but-mild, ransomware is rare-but-catastrophic. Both need attention, but require different control strategies. |

---

**Validation Checklist**:
- [x] Header metadata
- [x] Recording setup notes
- [x] Framework recap
- [x] All 4 chapter sections with representative steps
- [x] Discussion questions (5)
- [x] Common misconceptions table
