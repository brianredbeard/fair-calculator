/**
 * S3 Bucket Misconfiguration Tutorial
 * Beginner difficulty - Understanding configuration vulnerabilities
 */

export default {
  id: 's3-misconfig',
  title: 'S3 Bucket Misconfiguration Tutorial',
  subtitle: 'Understanding configuration vulnerabilities',
  difficulty: 'beginner',
  estimatedMinutes: 12,
  scenarioIndex: 7,

  chapters: [
    {
      title: 'Chapter 1: Understanding Frequency',
      steps: [
        {
          factorId: 'lef',
          action: 'focus',
          narrative: 'Loss Event Frequency (LEF) represents how often misconfigured S3 buckets are discovered and exploited per year. We estimate 0.5 to 15 successful exploitation events annually. This reflects a low-frequency but persistent threat: most misconfigurations go unnoticed, but when discovered, they\'re trivial to exploit.',
          scenarioContext: 'Your organization uses AWS S3 buckets to store application data, backups, and logs. Developers create new buckets regularly. A single permission misconfiguration makes the entire bucket publicly readable.',
          whyTheseNumbers: 'LEF of 0.5–15/year means roughly one exploitation event every month to two years. This reflects that S3 misconfigurations are rare (good DevOps practices), but scanning is automated and relentless. Once found, exploitation is guaranteed.'
        },
        {
          factorId: 'tef',
          action: 'expand',
          narrative: 'LEF decomposes into Threat Event Frequency (TEF) and Vulnerability. Let\'s expand to see TEF — how often attackers probe your S3 buckets for misconfigurations, whether or not they find any.',
          scenarioContext: 'Automated scanners continuously enumerate common S3 bucket naming patterns (company-backups, company-data, company-logs). They test every discovered bucket for public read access.',
          whyTheseNumbers: null
        },
        {
          factorId: 'cf',
          action: 'focus',
          narrative: 'Contact Frequency (CF) is how often attackers discover and test your S3 buckets. We estimate 10 to 50 reconnaissance events per year. This is much lower than phishing (1000–15000) because bucket enumeration requires more sophisticated tooling and domain knowledge.',
          scenarioContext: 'Attackers use tools like bucket_finder and S3Scanner to brute-force common bucket names based on your company\'s domain. They also monitor GitHub for accidentally committed AWS credentials that might reveal bucket names in configuration files.',
          whyTheseNumbers: 'CF of 10–50/year reflects targeted reconnaissance, not spray-and-pray attacks. Attackers need to know or guess your bucket names (company-prod, company-staging, company-backups). This is lower than brute force (200–800) but higher than APT campaigns (1–10).',
          experiment: {
            prompt: 'Try increasing Contact Frequency to 50–200 to simulate your company being added to a public list of S3 targets. Watch the Median and 90th Percentile — they should increase as more scanners find your bucket.',
            resetAfter: true
          }
        },
        {
          factorId: 'poa',
          action: 'focus',
          narrative: 'Probability of Action (PoA) is how often attackers test buckets they\'ve discovered. We estimate 0.05–0.3 (5–30%). This is lower than brute force (70–100%) because bucket scanning requires more effort and many discovered buckets are empty or uninteresting. Attackers prioritize based on naming patterns (prod > test).',
          scenarioContext: 'Once an attacker discovers a bucket name, they must decide whether to test it. Not all buckets are worth the effort — empty buckets, test environments, and public marketing assets yield no value. Attackers focus on likely targets: backup, data, customer, internal.',
          whyTheseNumbers: 'PoA of 0.05–0.3 reflects selective targeting. Attackers automate discovery but manually prioritize which buckets to exploit. A bucket named "company-marketing-images" gets ignored. A bucket named "company-customer-backups" gets tested immediately.'
        },
        {
          factorId: 'vuln',
          action: 'expand',
          narrative: 'Vulnerability is the probability that a tested bucket is actually misconfigured and exploitable. This depends on Threat Capability (attacker skill at enumerating and exploiting S3) versus Resistance Strength (your bucket permission policies). Let\'s decompose it.',
          scenarioContext: 'Your defenses include: IAM policies restricting bucket creation, periodic security scans checking for public read access, and developer training on AWS security. But new buckets are created weekly, and misconfigurations slip through.',
          whyTheseNumbers: null
        },
        {
          factorId: 'tcap',
          action: 'focus',
          narrative: 'Threat Capability (TCap) for S3 exploitation is 0.7–0.99 on a 0–100 scale. Once an attacker identifies a misconfigured bucket, exploitation is trivial: no exploit code needed, just an HTTP GET request. Open-source tools automate the entire process from discovery to data exfiltration.',
          scenarioContext: 'S3 bucket exploitation requires minimal skill. Tools like s3-buckets-bruteforcer enumerate names, test permissions, and download contents automatically. Even script kiddies can exploit public buckets. The only barrier is discovery.',
          whyTheseNumbers: 'TCap of 0.7–0.99 reflects near-perfect exploitation once found. S3 misconfigurations are binary: either the bucket is public (exploitation=100%) or it\'s not (exploitation=0%). There\'s no password to crack, no exploit to develop — just list and download.'
        },
        {
          factorId: 'rs',
          action: 'focus',
          narrative: 'Resistance Strength (RS) is how well your permission policies prevent unauthorized access. We rate your defenses at 0.05–0.3 on a 0–100 scale. This low rating reflects that S3 security depends entirely on correct configuration — there\'s no default-deny. A single checkbox error makes a bucket public.',
          scenarioContext: 'Your organization has policies requiring buckets to be private by default, but enforcement is manual. Developers sometimes enable public read for quick testing and forget to revert. Automated scanning catches some misconfigurations, but only weekly.',
          whyTheseNumbers: 'RS of 0.05–0.3 reflects weak structural defenses. Unlike brute force (where rate limiting and MFA can raise RS to 0.6–0.9), S3 misconfiguration is a binary failure: either the bucket is properly configured (RS=1.0) or it\'s not (RS=0.0). The 0.05–0.3 range represents the probability that your processes catch misconfigurations before attackers do.',
          experiment: {
            prompt: 'Increase Resistance Strength to 0.4–0.7 to model automated S3 bucket policy enforcement (e.g., AWS Config rules that auto-remediate public buckets). See how vulnerability drops.',
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
          narrative: 'Loss Magnitude (LM) is the cost when a misconfigured bucket is exploited. We\'re looking at $10K to $80K per incident, driven by data breach response, regulatory notifications, and infrastructure rebuild. This is higher than phishing ($1K–$15K) but lower than ransomware ($1M–$8M).',
          scenarioContext: 'When a public S3 bucket is discovered, attackers typically download all contents. If the bucket contained customer data, PII, or backup files with credentials, you face incident response, forensics, notification, and potential regulatory fines.',
          whyTheseNumbers: 'LM of $10K–$80K reflects variable data sensitivity. Lower end: logs and non-sensitive data exposed, quick containment. Upper end: customer PII or database backups leaked, full forensic investigation, regulatory reporting, credential rotation across all systems.'
        },
        {
          factorId: 'primary',
          action: 'expand',
          narrative: 'Primary losses are the direct costs: lost productivity during investigation, incident response team time, and infrastructure replacement (rotating credentials, rebuilding buckets with proper permissions).',
          scenarioContext: 'Primary costs include: DevOps team investigating which buckets are affected, security team reviewing what data was exfiltrated, rotating all credentials that may have been exposed, and rebuilding affected buckets with correct permissions.',
          whyTheseNumbers: null
        },
        {
          factorId: 'productivity',
          action: 'focus',
          narrative: 'Productivity loss occurs when teams halt normal work to respond. With S3 misconfiguration potentially exposing credentials, you must assume breach of all systems those credentials access. We estimate $2K to $20K. Teams stop feature work to audit, rotate, and verify.',
          scenarioContext: 'Productivity loss includes: DevOps team spending 1–2 days auditing all S3 buckets, development teams blocked while credentials are rotated, database administrators verifying no unauthorized access occurred, and QA re-testing applications after credential rotation.',
          whyTheseNumbers: 'Productivity of $2K–$20K scales with credential scope. $2K = limited exposure, credentials were dev/test only. $20K = production database credentials in a backup file, full application redeploy required after rotation.'
        },
        {
          factorId: 'response',
          action: 'focus',
          narrative: 'Response costs are the investigation and containment effort. This includes forensic analysis to determine what data was downloaded, how long the bucket was public, and who accessed it. AWS CloudTrail logs help, but analysis is labor-intensive. We estimate $5K to $50K.',
          scenarioContext: 'Response involves: downloading CloudTrail logs (months of access data), correlating IP addresses with known threat actors, determining exact files downloaded, notifying affected customers if PII was accessed, and potentially hiring external forensics if the exposure was long-term.',
          whyTheseNumbers: 'Response of $5K–$50K depends on exposure duration and data type. $5K = bucket was public for days, logs show minimal access, no PII. $50K = bucket public for months, extensive downloads from multiple IPs, customer PII confirmed downloaded, external forensics engaged.'
        },
        {
          factorId: 'replacement',
          action: 'focus',
          narrative: 'Replacement costs include rotating all potentially compromised credentials, rebuilding S3 buckets with correct IAM policies, and re-encrypting data if encryption keys were exposed. We estimate $3K to $10K. Unlike ransomware (where you rebuild infrastructure), here you\'re fixing configurations.',
          scenarioContext: 'Replacement involves: rotating AWS access keys, database passwords, API tokens, and service account credentials that were in backup files. Rebuilding S3 buckets with proper bucket policies, access logging enabled, and encryption at rest. Re-deploying applications with new credentials.',
          whyTheseNumbers: 'Replacement of $3K–$10K reflects configuration labor, not hardware costs. $3K = limited credential rotation, bucket policy fixes. $10K = comprehensive credential rotation across all environments, application redeployment, testing to verify systems still work after rotation.'
        }
      ]
    },
    {
      title: 'Chapter 3: Understanding Ripple Effects',
      steps: [
        {
          factorId: 'secondary',
          action: 'expand',
          narrative: 'Secondary losses occur when S3 exposure triggers regulatory reporting, customer churn, or competitive intelligence loss. Unlike phishing (SLEF=1–10%), S3 misconfigurations have higher secondary loss probability (10–40%) because the data is often sensitive and the exposure duration is unknown. Let\'s decompose into SLEF and SLM.',
          scenarioContext: 'If the misconfigured bucket contained customer PII, payment data, or proprietary algorithms, you face breach notification laws, customer trust loss, and potential competitive disadvantage if source code or business plans were exposed.',
          whyTheseNumbers: null
        },
        {
          factorId: 'slef',
          action: 'focus',
          narrative: 'Secondary Loss Event Frequency (SLEF) is the probability that S3 exposure becomes public or triggers regulatory action. We estimate 0.1 to 0.4 (10–40%). This is higher than phishing (1–10%) because S3 misconfigurations often persist for weeks or months before detection, increasing the chance of data exfiltration.',
          scenarioContext: 'S3 buckets don\'t generate alerts when accessed — they\'re designed to be accessed. Unless you actively monitor CloudTrail logs for unexpected access patterns, you may not discover the misconfiguration until an attacker publicizes the breach or a security researcher alerts you.',
          whyTheseNumbers: 'SLEF of 0.1–0.4 reflects delayed detection. Unlike phishing (where users often report suspicious emails), S3 misconfigurations are silent. By the time you discover the issue, data may already be downloaded and shared on breach forums.'
        },
        {
          factorId: 'slm',
          action: 'expand',
          narrative: 'Secondary Loss Magnitude (SLM) is the cost when S3 exposure becomes public. We estimate $2K to $20K, driven by regulatory fines, customer notifications, reputation damage, and potential competitive loss if proprietary data was exposed. Let\'s break down the components.',
          scenarioContext: 'If customer PII was in the exposed bucket, you must send breach notification letters under state laws. If source code or business plans were exposed, competitors may gain strategic intelligence. If the breach is publicized, customer trust erodes.',
          whyTheseNumbers: null
        },
        {
          factorId: 'fines',
          action: 'focus',
          narrative: 'Regulatory fines for S3 misconfigurations depend on the data type exposed and whether you had reasonable security practices. We estimate $0 to $5K. Small-scale exposures of non-sensitive data result in no fines. Exposures of PII without encryption or access logging can trigger state AG penalties.',
          scenarioContext: 'If the bucket contained customer emails and names (low-sensitivity PII) and you promptly notified, fines are unlikely. If it contained SSNs or payment data (high-sensitivity PII) and was unencrypted with no access logging, regulators may find negligence and impose fines.',
          whyTheseNumbers: 'Fines of $0–$5K reflect moderate enforcement. S3 misconfigurations are generally seen as configuration errors, not willful negligence, so fines are lower than for ignoring known vulnerabilities. The $5K upper bound represents state-level penalties for inadequate data protection practices.'
        },
        {
          factorId: 'reputation',
          action: 'focus',
          narrative: 'Reputation damage from S3 exposure is real but contained ($1K–$10K). Customers understand that cloud misconfigurations happen (they\'re common in the industry), so the trust impact is less severe than for ransomware or insider threats. However, B2B customers may request security audits before renewal.',
          scenarioContext: 'When a bucket exposure becomes public, media coverage focuses on the data type exposed (customer records, source code, credentials). Customer reaction depends on whether they were directly affected. B2B customers often send security questionnaires asking about your remediation steps.',
          whyTheseNumbers: 'Reputation of $1K–$10K models limited customer churn (1–3% of affected customers leave) and increased due diligence burden (security audits, questionnaire responses, delayed sales). This is lower than ransomware ($500K–$8M) because S3 misconfigurations are perceived as fixable mistakes, not systemic security failures.'
        },
        {
          factorId: 'competitive',
          action: 'focus',
          narrative: 'Competitive advantage loss occurs when exposed buckets contain proprietary data — source code, product roadmaps, pricing models, customer lists. We estimate $1K to $5K, reflecting that most S3 buckets contain operational data (logs, backups), not strategic secrets. Competitive loss is significant only if naming revealed sensitive content.',
          scenarioContext: 'If a bucket named "company-customer-backups" contained a database dump with customer emails and purchase history, competitors could use that for targeted marketing. If a bucket contained source code for proprietary algorithms, competitors could reverse-engineer your technology.',
          whyTheseNumbers: 'Competitive of $1K–$5K reflects low strategic impact for most buckets. Logs and backups don\'t provide competitive intelligence. The upper bound accounts for rare cases where buckets contained business-critical data. Compare this to APT IP theft ($100K–$4M) where attackers specifically target high-value proprietary data.',
          experiment: {
            prompt: 'Increase Competitive loss to $10K–$50K to model a scenario where source code for a proprietary ML model was exposed. See how secondary losses shift the risk profile.',
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
          narrative: 'You\'ve estimated all factors. Examine the results. The Loss Exceedance Curve shows your risk distribution. The 90th percentile — your planning number — is typically $10K–$60K annually for S3 misconfiguration risk. Notice the critical insight: Resistance Strength is extremely low (0.05–0.3) because S3 security is purely configuration-driven. There\'s no rate limiting, no behavioral analysis, no second factor — just a binary choice: public or private. This means the most effective control is preventative: infrastructure-as-code with automated policy enforcement. Compare control strategies: S3 (prevent misconfiguration via automation) vs. phishing (train users to avoid clicking) vs. brute force (add MFA to raise resistance). The breakdown shows Primary losses (investigation, credential rotation) often exceed Secondary losses, unlike ransomware (where secondary dominates). This is because S3 exposures are often caught before widespread data exfiltration. Use these results to justify preventative controls: implementing AWS Config rules that auto-remediate public buckets could cut LEF by 90%, reducing annual risk from $50K to $5K. The curve also reveals that S3 risk is tail-dominated: the 50th percentile (median) may be near $0 (no incidents), but the 90th percentile is $50K (rare but costly incidents). This is typical for configuration vulnerabilities: most of the time, nothing happens, but when it does, costs are significant.',
          scenarioContext: 'Your DevOps lead asked: "Should we invest $8K in AWS Config rules to prevent public S3 buckets?" You can now answer: "We face 10–50 bucket reconnaissance events per year. Current manual processes keep Resistance Strength at 0.05–0.3, resulting in 0.5–15 exploitation events annually, costing $10K–$80K each, with a 10% chance of exceeding $60K annually. Automated policy enforcement (AWS Config with auto-remediation) raises RS from 0.15 to 0.7, cutting our 90th percentile risk from $60K to $8K — a $52K annual reduction for an $8K one-time investment. ROI is positive in 2 months."',
          whyTheseNumbers: 'S3 misconfiguration illustrates preventable configuration risks where human processes fail but automation succeeds. Unlike phishing (human behavior) or ransomware (attacker sophistication), S3 risk is driven entirely by configuration discipline. The FAIR model reveals that raising Resistance Strength is more effective than reducing Contact Frequency (which is driven by external scanners you don\'t control). This tutorial teaches beginners that some risks are best addressed through technical controls (automation), not human controls (training).'
        }
      ]
    }
  ]
};
