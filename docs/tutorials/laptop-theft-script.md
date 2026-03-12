# Physical Laptop Theft Tutorial - Voiceover Script

**Difficulty**: Intermediate
**Estimated Duration**: 15 minutes
**Scenario**: Employee laptops stolen through physical theft with variable encryption protection
**Key Teaching Theme**: Physical security threats and encryption as a technical control that outperforms human processes

## Recording Setup Notes

- **Pacing**: 125 words/minute (intermediate difficulty)
- **Tone**: Practical and security-focused (balancing cost vs. risk)
- **Emphasis**: Stress how technical enforcement (TPM-backed encryption) beats policy-based controls
- **Experiments**: 3 experiment segments demonstrating travel exposure, encryption enforcement, and targeted espionage

## Framework Recap (30 seconds)

> Welcome to the FAIR Calculator tutorial on physical laptop theft. FAIR stands for Factor Analysis of Information Risk — a structured way to quantify cybersecurity threats. Instead of saying "laptop theft is risky," FAIR helps us ask: how often are devices stolen and data compromised, and how much does it cost when they are? Every risk breaks down into frequency and magnitude. Frequency is Loss Event Frequency, or LEF. Magnitude is Loss Magnitude, or LM. Together, they give us a complete risk picture. Let's apply this to a physical security threat that every organization faces: employee laptops being stolen from cars, hotels, and public spaces.

## Chapter 1: Understanding Frequency (4 minutes)

### Step 1: LEF (Loss Event Frequency)

> Loss Event Frequency for laptop theft represents successful thefts resulting in data compromise per year. We estimate 4 to 80 incidents annually for an organization with 500 employees. This wide range reflects uncertainty in both theft opportunities — travel frequency and office security — and disk encryption effectiveness. Your organization issues laptops to all employees. Sales teams travel frequently, leaving devices in cars and hotel rooms. Office workers occasionally work from coffee shops. Despite a full-disk encryption policy, compliance is inconsistent. An LEF of 4 to 80 per year combines low theft frequency — laptops are occasionally stolen — with variable encryption compliance. If encryption were 100 percent enforced, LEF would drop to near-zero because the thief gets hardware but not data. The range reflects encryption compliance uncertainty.

**On-Screen**: LEF factor highlighted with range 4–80

**Teacher Note**: The wide range (4–80) reflects encryption compliance gaps. Emphasize that this is NOT uncertainty in theft frequency (which is relatively predictable), but uncertainty in whether stolen devices result in data breaches. With perfect encryption, LEF approaches zero.

### Step 2: Expand LEF → TEF

> LEF decomposes into Threat Event Frequency and Vulnerability. Let's expand to see TEF — how often laptops are stolen or lost, regardless of whether data is compromised. Theft and loss happen through various vectors: stolen from cars (opportunistic), left in taxis or airports (accidental), taken during burglaries (targeted), or grabbed in smash-and-grabs at coffee shops (opportunistic).

**On-Screen**: LEF expands to show TEF and Vulnerability child nodes

### Step 3: CF (Contact Frequency)

> Contact Frequency represents opportunities for laptop theft — situations where devices are vulnerable to being taken. We estimate 20 to 100 events per year organization-wide. This includes unattended devices in public spaces, laptops visible in vehicles, and devices in checked luggage. Contact events occur when employees leave laptops in cars while running errands — 20 to 30 times per year — devices left unattended at airports or coffee shops — 10 to 20 times per year — hotel room burglaries during conferences — 5 to 10 times per year — and smash-and-grabs from vehicles — 5 to 15 times per year. A CF of 20 to 100 per year reflects physical exposure. This is lower than digital threats like phishing with CF of 1000 to 15000, because physical theft requires proximity. It's higher than ransomware with CF of 5 to 50, because opportunistic theft is more common than targeted cyberattacks.

**On-Screen**: CF factor focused with values 20–100

**Experiment Segment**:
> Try doubling Contact Frequency to 40–200 to model increased travel post-pandemic. Notice how physical exposure directly drives risk. [**8-second pause**]

**On-Screen During Pause**: Demonstrate changing CF lambda input from 20-100 to 40-200, show risk curve shift

### Steps 4-7: Continue through PoA, Vulnerability expansion, TCap, RS

[Continue following the same pattern for remaining Chapter 1 steps: PoA (0.2–0.8, visible devices are attractive targets), Vulnerability (expand to TCap/RS), TCap (0.7–0.99, skilled attackers can extract data from unencrypted drives), and RS (0.3–0.7, policy gaps lower effectiveness). Include experiment segment for RS showing TPM-backed encryption enforcement.]

## Chapter 2: Estimating Direct Costs (4 minutes)

### Step 1: LM (Loss Magnitude)

> Loss Magnitude for laptop theft is $15,000 to $210,000 per incident, driven by device replacement, lost productivity, incident response, and potential data breach costs. This is higher than phishing at $1,000 to $15,000 and S3 misconfiguration at $10,000 to $80,000, but lower than ransomware at $1 million to $8 million. When a laptop is stolen, you must replace the hardware at $2,000, rebuild the user environment and restore from backups taking 2 to 5 days productivity, investigate whether data was accessed if the device was unencrypted, rotate credentials the user had access to, and potentially notify customers if PII was on the device. An LM of $15K to $210K reflects variable data sensitivity and user seniority. Lower end: junior employee, encrypted device, quick replacement. Upper end: executive laptop with unencrypted customer database, multi-week investigation, regulatory notification required.

**On-Screen**: LM factor highlighted with range $15K–$210K

**Teacher Note**: Laptop theft LM has a unique characteristic: Replacement costs create a high floor. Even with perfect encryption (no data breach), you still pay $15K–$80K for hardware and productivity loss. This is different from digital threats where good defenses can reduce LM to near-zero.

### Steps 2-5: Primary expansion, Productivity, Response, Replacement

[Continue with all Chapter 2 steps: Primary expansion, Productivity ($5K–$80K, depends on user seniority and replacement speed), Response ($0–$50K, binary: encrypted vs. unencrypted), Replacement ($10K–$80K, hardware plus ecosystem rebuild).]

## Chapter 3: Understanding Ripple Effects (5 minutes)

### Step 1: Secondary Expansion

> Secondary losses occur when stolen laptops contain customer PII or proprietary data, triggering regulatory notifications, customer churn, or competitive intelligence loss. With modern encryption, most laptop thefts result in minimal secondary losses. But unencrypted devices with sensitive data create significant ripple effects. Let's decompose into SLEF and SLM. If the stolen laptop was encrypted with a strong password, secondary losses are near-zero because the thief gets hardware, not data. If unencrypted or weakly protected, and the device contained customer records, source code, or business plans, secondary consequences include breach notifications, customer trust erosion, and competitor intelligence.

**On-Screen**: Secondary factor expanding to SLEF and SLM

### Step 2: SLEF (Secondary Loss Event Frequency)

> Secondary Loss Event Frequency is the probability that laptop theft triggers external consequences. We estimate 0.1 to 0.4 (10–40%). This is higher than phishing at 1 to 10 percent because you can't verify whether a stolen laptop's data was accessed — you must assume compromise if unencrypted. It's lower than ransomware at 60 to 100 percent because most devices are encrypted. SLEF depends entirely on encryption compliance. Encrypted device stolen equals SLEF approximately 0 percent — no data breach. Unencrypted device stolen equals SLEF approximately 100 percent — assume full data compromise, trigger breach response. The 10 to 40 percent range reflects your organization's 70 percent encryption compliance rate.

**On-Screen**: SLEF factor focused with range 0.1–0.4

### Steps 3-6: SLM expansion, Fines, Reputation, Competitive

[Continue with all Chapter 3 steps: SLM expansion ($2K–$10K), Fines ($0–$2K, physical theft is largely uncontrollable so regulators are lenient), Reputation ($0–$5K, customers forgive physical theft more than hacking), Competitive ($0–$3K, opportunistic thieves wipe devices). Include experiment segment for Competitive showing targeted espionage scenario.]

## Chapter 4: Interpreting Results (2 minutes)

### Step 1: Risk Interpretation

> You've estimated all factors. Examine the results. The Loss Exceedance Curve shows your risk distribution. The 90th percentile is typically $60,000 to $250,000 annually for laptop theft risk. Notice the key drivers: Replacement costs — new hardware, software, provisioning — often equal or exceed Productivity loss, unlike digital threats where Productivity dominates. This reveals physical assets as cost centers. The breakdown shows Resistance Strength at 0.3 to 0.7 is the critical control point. Raising RS from 0.5 to 0.9 via enforced encryption cuts LEF by 80 percent, because encrypted devices can't be exploited. Compare control strategies: laptop theft requires encrypt everything via TPM enforcement, phishing requires train users, ransomware requires segment networks and test backups. Physical security teaches that technical controls like encryption outperform human controls like policies asking users to enable encryption. Use these results to justify enforcement: implementing TPM-enforced encryption raises RS from 0.5 to 0.95, cutting annual risk from $150,000 to $30,000. The curve also reveals that Replacement costs create a high floor: even with perfect encryption preventing data breaches, you still pay $15,000 to $80,000 per theft for hardware. This justifies physical theft prevention measures like cable locks and secure storage policies in addition to data protection via encryption.

**On-Screen**: Full risk dashboard with Loss Exceedance Curve visible

**Teacher Note**: End on the technical enforcement insight. Laptop theft demonstrates that some risks are best addressed by removing human choice from the control. Enforce encryption at hardware level (TPM) so users can't disable it, rather than training users to make the right choice.

## Post-Tutorial Discussion Questions

1. **Encryption Compliance**: The tutorial shows RS=0.3–0.7 with 70% encryption compliance. If implementing TPM-backed encryption that users can't disable costs $50K and raises RS to 0.9, what's the ROI compared to phishing training or MFA for brute force?

2. **Productivity vs. Replacement**: For laptop theft, Replacement costs ($10K–$80K) often equal Productivity loss ($5K–$80K). For ransomware, Productivity dominates. Why does the cost structure differ, and how does this affect control prioritization?

3. **SLEF Drivers**: SLEF=10–40% directly reflects 30% non-compliance with encryption policy. If you could measure encryption compliance in real-time via MDM, how would that change your SLEF estimate and secondary loss calculations?

4. **Physical vs. Digital Theft**: Laptop theft has CF=20–100 (physical exposure opportunities) while APT IP theft has CF=1–10 (targeted campaigns). Both target proprietary data. Why is physical theft opportunistic while digital theft is strategic?

5. **Control Layering**: The tutorial shows encryption (raising RS) as the primary control. What role do physical controls (cable locks, secure storage) play? Should you invest in reducing CF (physical security) or raising RS (encryption), and why?

## Common Misconceptions

| Misconception | Reality | Teaching Point |
|---------------|---------|----------------|
| "Laptop theft policies prevent data breaches" | RS=0.3–0.7 with policy, RS=0.9+ with TPM enforcement. Policies fail because 30% of users disable encryption for performance. Technical enforcement eliminates human choice. | Show the compliance gap: policy says "enable encryption," but 30% of users don't. Compare RS before (0.5, policy-based) and after (0.95, TPM-based). Technical controls beat behavioral controls for laptop security. |
| "Most laptop thieves extract and sell data" | TCap=0.7–0.99 models worst-case, but most thieves wipe devices to resell hardware on eBay. Only 10–20% of stolen laptops reach markets where buyers extract data. | Explain conservative modeling: we assume worst-case (skilled attacker gets the device) because you can't predict which laptops will be targeted. Even if 80% of thieves just wipe and resell, you must protect against the 20%. |
| "Encrypted laptops have zero risk" | Even with encryption, LM=$15K–$80K per theft due to Replacement costs (hardware, provisioning, productivity loss). Encryption prevents data breach, not financial loss. | Walk through LM decomposition: Replacement ($10K–$80K) + Productivity ($5K–$80K) + Response ($0 for encrypted) = $15K–$160K. Encryption eliminates Secondary losses but not Primary losses. |
| "Remote wipe solves laptop theft" | Remote wipe requires the device to connect to the network. Thieves who wipe devices to resell never go online. Skilled attackers disable network before booting. Remote wipe is backup, not primary defense. | Show threat scenarios: opportunistic thief wipes immediately (no network connection), skilled attacker boots to USB (bypasses remote wipe). Encryption is passive (protects even when offline). Remote wipe is active (requires attacker cooperation). |

---

**Validation Checklist**:
- [x] Header metadata
- [x] Recording setup notes
- [x] Framework recap
- [x] All 4 chapter sections with representative steps
- [x] Discussion questions (5)
- [x] Common misconceptions table
