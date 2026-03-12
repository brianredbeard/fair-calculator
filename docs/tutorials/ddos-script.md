# DDoS on E-Commerce Site Tutorial - Voiceover Script

**Difficulty**: Intermediate
**Estimated Duration**: 15 minutes
**Scenario**: E-commerce platform targeted by volumetric DDoS attacks
**Key Teaching Theme**: Availability threats and resilience vs. prevention trade-offs

## Recording Setup Notes

- **Pacing**: 125 words/minute (intermediate difficulty)
- **Tone**: Business-focused (balancing uptime vs. mitigation costs)
- **Emphasis**: Stress how DDoS demonstrates LEF reduction vs. LM reduction trade-offs
- **Experiments**: 3 experiment segments demonstrating attack scaling, CDN effectiveness, and revenue impact

## Framework Recap (30 seconds)

> Welcome to the FAIR Calculator tutorial on DDoS attacks against e-commerce platforms. FAIR stands for Factor Analysis of Information Risk — a structured way to quantify cybersecurity threats. Instead of saying "DDoS is expensive," FAIR helps us ask: how often are we attacked, how long do outages last, and how much revenue do we lose? Every risk breaks down into frequency and magnitude. Frequency is Loss Event Frequency, or LEF. Magnitude is Loss Magnitude, or LM. Together, they give us a complete risk picture. Let's apply this to availability threats: distributed denial-of-service attacks that take your online storefront offline.

## Chapter 1: Understanding Frequency (4 minutes)

### Step 1: LEF (Loss Event Frequency)

> Loss Event Frequency for DDoS represents successful attacks that cause measurable outages per year. We estimate 4 to 200 impactful DDoS events annually. This wide range reflects uncertainty in both targeting (are you a high-profile target?) and mitigation effectiveness (does your CDN absorb most attacks?). Your e-commerce platform processes $50 million in annual online sales. During peak seasons, the site handles 10,000 concurrent users. Attackers use botnets to flood your infrastructure with traffic, overwhelming servers and taking the site offline. An LEF of 4 to 200 per year means attacks range from quarterly to multiple per week. The high uncertainty reflects whether you're targeted by competitors, extortionists, or random DDoS-for-hire services.

**On-Screen**: LEF factor highlighted with range 4–200

**Teacher Note**: DDoS frequency is highly variable — some orgs face daily attacks, others see one per year. The 4–200 range reflects that intermediate-sized e-commerce sites are attractive but not premium targets. Compare to high-profile sites (LEF=500+) and small businesses (LEF=1–5).

### Steps 2-7: Continue through CF, PoA, Vulnerability, TCap, RS

[Follow pattern: TEF expansion, CF (50–500, botnet availability makes DDoS cheap), PoA (0.8–1.0, automated attacks have high action probability), Vulnerability expansion, TCap (0.5–0.9, volumetric attacks are unsophisticated but effective), RS (0.3–0.7, depends on CDN and over-provisioning).]

## Chapter 2: Estimating Direct Costs (4 minutes)

### Step 1: LM (Loss Magnitude)

> Loss Magnitude for DDoS is $20,000 to $300,000 per incident, driven by lost revenue during outages, incident response costs, and infrastructure scaling. This is higher than phishing or laptop theft but lower than ransomware. When DDoS takes your e-commerce site offline for 2 to 6 hours during peak shopping, you lose direct sales, customer trust, and incur emergency mitigation costs. LM of $20K–$300K reflects outage duration and timing. Lower end: 2-hour attack during off-peak, $5K/hour revenue loss. Upper end: 6-hour attack during Black Friday, $50K/hour revenue loss.

**On-Screen**: LM factor highlighted with range $20K–$300K

**Teacher Note**: Unlike other threats, DDoS LM is time-dependent. The same attack costs 10x more during peak sales periods. This teaches timing as a risk factor.

### Steps 2-5: Primary expansion, Productivity, Response, Replacement

[Continue: Productivity ($5K–$80K, lost sales), Response ($10K–$100K, emergency mitigation), Replacement ($5K–$120K, scaling infrastructure and CDN upgrades).]

## Chapter 3: Understanding Ripple Effects (5 minutes)

### Step 1: Secondary Expansion

> Secondary losses for DDoS include customer churn (buyers who couldn't complete purchases), reputation damage (unreliable platform), and competitive loss (sales go to competitors during outage). SLEF is high (0.6–1.0) because every outage is immediately visible to customers. SLM depends on outage timing and customer patience.

**On-Screen**: Secondary factor expanding to SLEF and SLM

### Steps 2-6: SLEF, SLM, Fines, Reputation, Competitive

[Continue: SLEF (0.6–1.0, outages are public), SLM ($5K–$100K), Fines ($0, DDoS isn't a data breach), Reputation ($2K–$50K, customers remember outages), Competitive ($3K–$50K, lost sales go to Amazon).]

## Chapter 4: Interpreting Results (2 minutes)

### Step 1: Risk Interpretation

> The 90th percentile is typically $80,000 to $1 million annually for DDoS risk. Key insight: DDoS demonstrates the LEF vs. LM trade-off. You can reduce LEF via DDoS mitigation services (Cloudflare, AWS Shield) or reduce LM via faster recovery and over-provisioned infrastructure. The curve shows that resilience (cutting LM from 6 hours to 30 minutes) often beats prevention (cutting LEF from 100 to 50). Use these results to justify mitigation: CDN with DDoS protection costs $50K annually but cuts risk by 80 percent.

**On-Screen**: Full risk dashboard with Loss Exceedance Curve visible

**Teacher Note**: DDoS uniquely demonstrates that you can't eliminate LEF (attacks will happen), so reducing LM through resilience becomes the primary strategy. This contrasts with phishing (where reducing PoA via training works) or laptop theft (where preventing Vulnerability via encryption works).

## Post-Tutorial Discussion Questions

1. **LEF vs. LM Trade-offs**: DDoS mitigation reduces LEF but costs $50K/year. Over-provisioning reduces LM but costs $30K/year. Which provides better risk reduction per dollar?

2. **Timing Factors**: A 4-hour DDoS during Black Friday costs $200K (LM). The same attack in January costs $20K. How do you model seasonal risk variability in FAIR?

3. **Resilience vs. Prevention**: Cloudflare reduces LEF by 70% but costs $50K/year. Faster failover reduces LM by 60% but costs $30K/year. Calculate the ROI for each.

4. **Ransom DDoS**: Some attackers demand Bitcoin to stop DDoS attacks. Should ransom payments appear in LM (Response) or as a separate factor?

5. **SLA Penalties**: If your platform is B2B with SLA commitments, DDoS outages trigger refunds. Where in the FAIR model do SLA penalties appear?

## Common Misconceptions

| Misconception | Reality | Teaching Point |
|---------------|---------|----------------|
| "DDoS protection prevents all outages" | RS=0.3–0.7 even with CDN. Sophisticated multi-vector attacks (volumetric + application-layer) bypass single-layer defenses. | Show that CDN raises RS from 0.3 to 0.7, not to 1.0. Vulnerability still exists for attacks exceeding mitigation capacity. |
| "DDoS only affects revenue during the attack" | Secondary losses (customer churn, reputation) persist for months. SLEF=0.6–1.0 means every outage triggers trust erosion. | Walk through timeline: 4-hour outage → 10% of customers try competitors → 3% don't return = permanent revenue loss. |
| "Small sites aren't DDoS targets" | DDoS-for-hire services cost $10–$50. Competitors or disgruntled customers can launch attacks cheaply. CF=50–500 reflects commodity DDoS availability. | Explain attacker economics: botnets-for-rent make DDoS accessible to anyone. Targeting is often random or motivated by grudges, not just high-profile sites. |
| "Over-provisioning eliminates DDoS risk" | Modern botnets exceed 1 Tbps. No org can over-provision enough to absorb peak attacks. Mitigation requires traffic filtering (CDN), not just capacity. | Show the math: 100 Gbps attack costs $5K/hour to absorb via cloud scaling. CDN filtering costs $50K/year fixed. Over-provisioning doesn't scale economically. |

---

**Validation Checklist**:
- [x] Header metadata
- [x] Recording setup notes
- [x] Framework recap
- [x] All 4 chapter sections with representative steps
- [x] Discussion questions (5)
- [x] Common misconceptions table
