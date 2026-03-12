/**
 * Example FAIR scenarios from test_input.md
 * Each scenario has Stage 1 (branch-level) and Stage 2 (leaf-level) variants
 * All use PERT mode (min, mode, max)
 */

// Helper to convert test_input [min, mode, max] to our PERT state (handle zero min)
const pert = (min, mode, max) => ({
  min: min === 0 ? 0.001 : min,
  mode: mode === 0 ? 0.001 : mode,
  max: max === 0 ? 0.001 : max
});

// Helper for CI mode (90% confidence interval, low/high)
const ci = (low, high) => ({
  low: low === 0 ? 0.001 : low,
  high: high === 0 ? 0.001 : high
});

export const EXAMPLE_SCENARIOS = [
  // Scenario 1: External brute force (high freq, low impact)
  {
    name: 'Example: External brute force (Stage 1)',
    narrative: 'Commodity bots hammer exposed login. High contact frequency, strong controls, moderate LEF. Primary losses are analyst time.',
    _isExample: true,
    inputMode: 'pert',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: { expanded: false, ...pert(50, 100, 200) },
          lm: {
            expanded: true,
            children: {
              primary: { expanded: false, ...pert(10000, 30000, 60000) },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...pert(0.05, 0.1, 0.2) },
                  slm: { expanded: false, ...pert(20000, 40000, 80000) }
                }
              }
            }
          }
        }
      }
    }
  },
  {
    name: 'Example: External brute force (Stage 2)',
    narrative: 'Full decomposition with CF=200-800, PoA=0.7-1.0, TCap=0.4-0.8, RS=0.7-0.9. Primary breakdown into Productivity/Response/Replacement.',
    _isExample: true,
    inputMode: 'pert',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: {
            expanded: true,
            children: {
              tef: {
                expanded: true,
                children: {
                  cf: { expanded: false, ...pert(200, 400, 800) },
                  poa: { expanded: false, ...pert(0.7, 0.9, 1.0) }
                }
              },
              vuln: {
                expanded: true,
                children: {
                  tcap: { expanded: false, ...pert(0.7, 0.85, 0.95) },
                  rs: { expanded: false, ...pert(0.3, 0.5, 0.7) }
                }
              }
            }
          },
          lm: {
            expanded: true,
            children: {
              primary: {
                expanded: true,
                children: {
                  productivity: { expanded: false, ...pert(2000, 8000, 15000) },
                  response: { expanded: false, ...pert(3000, 10000, 25000) },
                  replacement: { expanded: false, ...pert(0, 3000, 8000) }
                }
              },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...pert(0.05, 0.1, 0.2) },
                  slm: {
                    expanded: true,
                    children: {
                      fines: { expanded: false, ...pert(0, 0, 20000) },
                      reputation: { expanded: false, ...pert(0, 5000, 20000) },
                      competitive: { expanded: false, ...pert(0, 5000, 20000) }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  // Scenario 2: Ransomware (low freq, very high impact)
  {
    name: 'Example: Ransomware outbreak (Stage 1)',
    narrative: 'Enterprise-wide ransomware on file servers. Low frequency (0.1-0.6/year), massive impact ($2M-$20M per event).',
    _isExample: true,
    inputMode: 'pert',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: { expanded: false, ...pert(0.1, 0.3, 0.6) },
          lm: {
            expanded: true,
            children: {
              primary: { expanded: false, ...pert(1000000, 3000000, 8000000) },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...pert(0.6, 0.9, 1.0) },
                  slm: { expanded: false, ...pert(1000000, 5000000, 15000000) }
                }
              }
            }
          }
        }
      }
    }
  },
  {
    name: 'Example: Ransomware outbreak (Stage 2)',
    narrative: 'Full decomposition: CF=5-50, PoA=0.9-1.0, TCap=0.6-0.9, RS=0.2-0.4. Primary: Productivity=$500K-$3M, Response=$200K-$2M, Replacement=$200K-$3M.',
    _isExample: true,
    inputMode: 'pert',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: {
            expanded: true,
            children: {
              tef: {
                expanded: true,
                children: {
                  cf: { expanded: false, ...pert(5, 20, 50) },
                  poa: { expanded: false, ...pert(0.9, 1.0, 1.0) }
                }
              },
              vuln: {
                expanded: true,
                children: {
                  tcap: { expanded: false, ...pert(0.6, 0.8, 0.9) },
                  rs: { expanded: false, ...pert(0.2, 0.3, 0.4) }
                }
              }
            }
          },
          lm: {
            expanded: true,
            children: {
              primary: {
                expanded: true,
                children: {
                  productivity: { expanded: false, ...pert(500000, 1500000, 3000000) },
                  response: { expanded: false, ...pert(200000, 800000, 2000000) },
                  replacement: { expanded: false, ...pert(200000, 600000, 3000000) }
                }
              },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...pert(0.6, 0.9, 1.0) },
                  slm: {
                    expanded: true,
                    children: {
                      fines: { expanded: false, ...pert(0, 1000000, 5000000) },
                      reputation: { expanded: false, ...pert(500000, 2000000, 8000000) },
                      competitive: { expanded: false, ...pert(300000, 1500000, 4000000) }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  // Scenario 3: Insider data exfiltration (medium freq, high impact)
  {
    name: 'Example: Insider data exfiltration (Stage 1)',
    narrative: 'Malicious insider exfiltrates customer PII. Medium frequency (5-50 attempts/year), high impact ($800K-$22M per successful event).',
    _isExample: true,
    inputMode: 'pert',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: { expanded: false, ...pert(0.2, 0.5, 1.0) },
          lm: {
            expanded: true,
            children: {
              primary: { expanded: false, ...pert(200000, 700000, 3000000) },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...pert(0.7, 0.95, 1.0) },
                  slm: { expanded: false, ...pert(500000, 4000000, 20000000) }
                }
              }
            }
          }
        }
      }
    }
  },
  {
    name: 'Example: Insider data exfiltration (Stage 2)',
    narrative: 'Full decomposition: CF=5-24, PoA=0.1-0.6, TCap=0.7-0.95, RS=0.4-0.8. Primary breakdown into Productivity=$50K-$1M, Response=$100K-$1.5M, Replacement=$50K-$500K.',
    _isExample: true,
    inputMode: 'pert',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: {
            expanded: true,
            children: {
              tef: {
                expanded: true,
                children: {
                  cf: { expanded: false, ...pert(5, 12, 24) },
                  poa: { expanded: false, ...pert(0.1, 0.3, 0.6) }
                }
              },
              vuln: {
                expanded: true,
                children: {
                  tcap: { expanded: false, ...pert(0.7, 0.85, 0.95) },
                  rs: { expanded: false, ...pert(0.4, 0.6, 0.8) }
                }
              }
            }
          },
          lm: {
            expanded: true,
            children: {
              primary: {
                expanded: true,
                children: {
                  productivity: { expanded: false, ...pert(50000, 300000, 1000000) },
                  response: { expanded: false, ...pert(100000, 300000, 1500000) },
                  replacement: { expanded: false, ...pert(50000, 100000, 500000) }
                }
              },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...pert(0.7, 0.95, 1.0) },
                  slm: {
                    expanded: true,
                    children: {
                      fines: { expanded: false, ...pert(100000, 1000000, 5000000) },
                      reputation: { expanded: false, ...pert(200000, 2000000, 10000000) },
                      competitive: { expanded: false, ...pert(200000, 1000000, 5000000) }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  // Scenario 4: S3 bucket misconfiguration (medium freq, low impact)
  {
    name: 'Example: S3 bucket misconfiguration (Stage 1)',
    narrative: 'Non-sensitive data exposed via misconfigured S3 bucket. Medium frequency (1-6/year), low impact ($12K-$100K per event).',
    _isExample: true,
    inputMode: 'pert',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: { expanded: false, ...pert(1, 3, 6) },
          lm: {
            expanded: true,
            children: {
              primary: { expanded: false, ...pert(10000, 25000, 80000) },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...pert(0.1, 0.2, 0.4) },
                  slm: { expanded: false, ...pert(2000, 5000, 20000) }
                }
              }
            }
          }
        }
      }
    }
  },
  {
    name: 'Example: S3 bucket misconfiguration (Stage 2)',
    narrative: 'Full decomposition: CF=10-50, PoA=0.05-0.3, TCap=0.7-0.99 (adjusted), RS=0.05-0.3 (adjusted). Primary: Productivity=$2K-$20K, Response=$5K-$50K, Replacement=$3K-$10K.',
    _isExample: true,
    inputMode: 'pert',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: {
            expanded: true,
            children: {
              tef: {
                expanded: true,
                children: {
                  cf: { expanded: false, ...pert(10, 20, 50) },
                  poa: { expanded: false, ...pert(0.05, 0.15, 0.3) }
                }
              },
              vuln: {
                expanded: true,
                children: {
                  tcap: { expanded: false, ...pert(0.7, 0.9, 0.99) },
                  rs: { expanded: false, ...pert(0.05, 0.15, 0.3) }
                }
              }
            }
          },
          lm: {
            expanded: true,
            children: {
              primary: {
                expanded: true,
                children: {
                  productivity: { expanded: false, ...pert(2000, 5000, 20000) },
                  response: { expanded: false, ...pert(5000, 15000, 50000) },
                  replacement: { expanded: false, ...pert(3000, 5000, 10000) }
                }
              },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...pert(0.1, 0.2, 0.4) },
                  slm: {
                    expanded: true,
                    children: {
                      fines: { expanded: false, ...pert(0, 1000, 5000) },
                      reputation: { expanded: false, ...pert(1000, 2000, 10000) },
                      competitive: { expanded: false, ...pert(1000, 2000, 5000) }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  // Scenario 5: DDoS on public website (high freq, moderate impact)
  {
    name: 'Example: DDoS on public website (Stage 1)',
    narrative: 'Volumetric DDoS attacks on e-commerce site. High frequency (5-60/year), moderate impact ($60K-$1.8M per event).',
    _isExample: true,
    inputMode: 'pert',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: { expanded: false, ...pert(5, 20, 60) },
          lm: {
            expanded: true,
            children: {
              primary: { expanded: false, ...pert(50000, 200000, 800000) },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...pert(0.05, 0.1, 0.3) },
                  slm: { expanded: false, ...pert(10000, 100000, 1000000) }
                }
              }
            }
          }
        }
      }
    }
  },
  {
    name: 'Example: DDoS on public website (Stage 2)',
    narrative: 'Full decomposition: CF=50-500, PoA=0.8-1.0, TCap=0.5-0.9 (adjusted), RS=0.3-0.7 (adjusted). Primary: Productivity=$10K-$200K, Response=$20K-$400K, Replacement=$20K-$200K.',
    _isExample: true,
    inputMode: 'pert',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: {
            expanded: true,
            children: {
              tef: {
                expanded: true,
                children: {
                  cf: { expanded: false, ...pert(50, 200, 500) },
                  poa: { expanded: false, ...pert(0.8, 0.95, 1.0) }
                }
              },
              vuln: {
                expanded: true,
                children: {
                  tcap: { expanded: false, ...pert(0.5, 0.7, 0.9) },
                  rs: { expanded: false, ...pert(0.3, 0.5, 0.7) }
                }
              }
            }
          },
          lm: {
            expanded: true,
            children: {
              primary: {
                expanded: true,
                children: {
                  productivity: { expanded: false, ...pert(10000, 50000, 200000) },
                  response: { expanded: false, ...pert(20000, 100000, 400000) },
                  replacement: { expanded: false, ...pert(20000, 50000, 200000) }
                }
              },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...pert(0.05, 0.1, 0.3) },
                  slm: {
                    expanded: true,
                    children: {
                      fines: { expanded: false, ...pert(0, 10000, 100000) },
                      reputation: { expanded: false, ...pert(5000, 50000, 500000) },
                      competitive: { expanded: false, ...pert(5000, 40000, 400000) }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  // Scenario 6: Phishing on back-office (very high freq, very low impact)
  {
    name: 'Example: Phishing on back-office (Stage 1)',
    narrative: 'Generic phishing emails to back-office staff. Very high frequency (100-1000/year), very low impact ($1.5K-$25K per event).',
    _isExample: true,
    inputMode: 'pert',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: { expanded: false, ...pert(100, 400, 1000) },
          lm: {
            expanded: true,
            children: {
              primary: { expanded: false, ...pert(1000, 3000, 15000) },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...pert(0.01, 0.05, 0.1) },
                  slm: { expanded: false, ...pert(500, 1000, 10000) }
                }
              }
            }
          }
        }
      }
    }
  },
  {
    name: 'Example: Phishing on back-office (Stage 2)',
    narrative: 'Full decomposition: CF=1000-15000, PoA=0.01-0.1, TCap=0.6-0.95 (adjusted), RS=0.4-0.85 (adjusted). Primary: Productivity=$500-$5K, Response=$500-$10K.',
    _isExample: true,
    inputMode: 'pert',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: {
            expanded: true,
            children: {
              tef: {
                expanded: true,
                children: {
                  cf: { expanded: false, ...pert(1000, 5000, 15000) },
                  poa: { expanded: false, ...pert(0.01, 0.03, 0.1) }
                }
              },
              vuln: {
                expanded: true,
                children: {
                  tcap: { expanded: false, ...pert(0.6, 0.8, 0.95) },
                  rs: { expanded: false, ...pert(0.4, 0.6, 0.85) }
                }
              }
            }
          },
          lm: {
            expanded: true,
            children: {
              primary: {
                expanded: true,
                children: {
                  productivity: { expanded: false, ...pert(500, 1000, 5000) },
                  response: { expanded: false, ...pert(500, 2000, 10000) },
                  replacement: { expanded: false, ...pert(0, 0, 0) }
                }
              },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...pert(0.01, 0.05, 0.1) },
                  slm: {
                    expanded: true,
                    children: {
                      fines: { expanded: false, ...pert(0, 0, 1000) },
                      reputation: { expanded: false, ...pert(0, 500, 5000) },
                      competitive: { expanded: false, ...pert(0, 500, 4000) }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  // Scenario 7: Cloud KMS compromise (very low freq, catastrophic impact)
  {
    name: 'Example: Cloud KMS compromise (Stage 1)',
    narrative: 'Cloud key management system compromise. Very low frequency (0.01-0.1/year), catastrophic impact ($8M-$140M per event).',
    _isExample: true,
    inputMode: 'pert',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: { expanded: false, ...pert(0.01, 0.03, 0.1) },
          lm: {
            expanded: true,
            children: {
              primary: { expanded: false, ...pert(3000000, 15000000, 40000000) },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...pert(0.8, 1.0, 1.0) },
                  slm: { expanded: false, ...pert(5000000, 50000000, 100000000) }
                }
              }
            }
          }
        }
      }
    }
  },
  {
    name: 'Example: Cloud KMS compromise (Stage 2)',
    narrative: 'Full decomposition: CF=0.5-5, PoA=0.6-1.0, TCap=0.8-1.0, RS=0.6-0.95. Primary: Productivity=$500K-$10M, Response=$1M-$20M, Replacement=$1M-$10M.',
    _isExample: true,
    inputMode: 'pert',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: {
            expanded: true,
            children: {
              tef: {
                expanded: true,
                children: {
                  cf: { expanded: false, ...pert(0.5, 2, 5) },
                  poa: { expanded: false, ...pert(0.6, 0.9, 1.0) }
                }
              },
              vuln: {
                expanded: true,
                children: {
                  tcap: { expanded: false, ...pert(0.8, 0.95, 1.0) },
                  rs: { expanded: false, ...pert(0.6, 0.8, 0.95) }
                }
              }
            }
          },
          lm: {
            expanded: true,
            children: {
              primary: {
                expanded: true,
                children: {
                  productivity: { expanded: false, ...pert(500000, 3000000, 10000000) },
                  response: { expanded: false, ...pert(1000000, 7000000, 20000000) },
                  replacement: { expanded: false, ...pert(1000000, 5000000, 10000000) }
                }
              },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...pert(0.8, 1.0, 1.0) },
                  slm: {
                    expanded: true,
                    children: {
                      fines: { expanded: false, ...pert(1000000, 20000000, 60000000) },
                      reputation: { expanded: false, ...pert(2000000, 20000000, 30000000) },
                      competitive: { expanded: false, ...pert(2000000, 10000000, 10000000) }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  // Scenario 8: Physical laptop theft (medium freq, moderate impact)
  {
    name: 'Example: Physical laptop theft (Stage 1)',
    narrative: 'Physical theft of developer laptops. Medium frequency (5-40/year), moderate impact ($17K-$160K per event).',
    _isExample: true,
    inputMode: 'pert',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: { expanded: false, ...pert(5, 15, 40) },
          lm: {
            expanded: true,
            children: {
              primary: { expanded: false, ...pert(15000, 50000, 150000) },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...pert(0.1, 0.2, 0.4) },
                  slm: { expanded: false, ...pert(2000, 5000, 10000) }
                }
              }
            }
          }
        }
      }
    }
  },
  {
    name: 'Example: Physical laptop theft (Stage 2)',
    narrative: 'Full decomposition: CF=20-100, PoA=0.2-0.8, TCap=0.7-0.99 (adjusted), RS=0.3-0.7 (adjusted). Primary: Productivity=$5K-$80K, Replacement=$10K-$80K.',
    _isExample: true,
    inputMode: 'pert',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: {
            expanded: true,
            children: {
              tef: {
                expanded: true,
                children: {
                  cf: { expanded: false, ...pert(20, 50, 100) },
                  poa: { expanded: false, ...pert(0.2, 0.5, 0.8) }
                }
              },
              vuln: {
                expanded: true,
                children: {
                  tcap: { expanded: false, ...pert(0.7, 0.9, 0.99) },
                  rs: { expanded: false, ...pert(0.3, 0.5, 0.7) }
                }
              }
            }
          },
          lm: {
            expanded: true,
            children: {
              primary: {
                expanded: true,
                children: {
                  productivity: { expanded: false, ...pert(5000, 20000, 80000) },
                  response: { expanded: false, ...pert(0, 10000, 50000) },
                  replacement: { expanded: false, ...pert(10000, 20000, 80000) }
                }
              },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...pert(0.1, 0.2, 0.4) },
                  slm: {
                    expanded: true,
                    children: {
                      fines: { expanded: false, ...pert(0, 0, 2000) },
                      reputation: { expanded: false, ...pert(0, 2000, 5000) },
                      competitive: { expanded: false, ...pert(0, 3000, 3000) }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  // Scenario 9: SaaS CRM outage (medium freq, high primary, low secondary)
  {
    name: 'Example: SaaS CRM outage (Stage 1)',
    narrative: 'Critical third-party SaaS CRM outage. Medium frequency (2-20/year), high primary impact ($200K-$5M), low secondary ($5K-$100K).',
    _isExample: true,
    inputMode: 'ci',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: { expanded: false, ...ci(2, 20) },
          lm: {
            expanded: true,
            children: {
              primary: { expanded: false, ...ci(150000, 4000000) },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...ci(0.01, 0.1) },
                  slm: { expanded: false, ...ci(5000, 100000) }
                }
              }
            }
          }
        }
      }
    }
  },
  {
    name: 'Example: SaaS CRM outage (Stage 2)',
    narrative: 'Full decomposition: CF=10-100, PoA=0.5-1.0, TCap=0.5-0.9 (adjusted), RS=0.3-0.7 (adjusted). Primary: Productivity=$150K-$4M (lost sales capacity).',
    _isExample: true,
    inputMode: 'ci',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: {
            expanded: true,
            children: {
              tef: {
                expanded: true,
                children: {
                  cf: { expanded: false, ...ci(10, 100) },
                  poa: { expanded: false, ...ci(0.5, 1.0) }
                }
              },
              vuln: {
                expanded: true,
                children: {
                  tcap: { expanded: false, ...ci(0.5, 0.9) },
                  rs: { expanded: false, ...ci(0.3, 0.7) }
                }
              }
            }
          },
          lm: {
            expanded: true,
            children: {
              primary: {
                expanded: true,
                children: {
                  productivity: { expanded: false, ...ci(150000, 4000000) },
                  response: { expanded: false, ...ci(0, 0) },
                  replacement: { expanded: false, ...ci(0, 0) }
                }
              },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...ci(0.01, 0.1) },
                  slm: {
                    expanded: true,
                    children: {
                      fines: { expanded: false, ...ci(0, 10000) },
                      reputation: { expanded: false, ...ci(5000, 50000) },
                      competitive: { expanded: false, ...ci(0, 40000) }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  // Scenario 10: Legacy system compromise (high freq, low magnitude) — CI mode
  {
    name: 'Example: Legacy system compromise (Stage 1)',
    narrative: 'Low-value legacy system compromise. High frequency (5-80/year), low magnitude ($12K-$200K per event).',
    _isExample: true,
    inputMode: 'ci',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: { expanded: false, ...ci(5, 80) },
          lm: {
            expanded: true,
            children: {
              primary: { expanded: false, ...ci(10000, 150000) },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...ci(0.05, 0.3) },
                  slm: { expanded: false, ...ci(2000, 50000) }
                }
              }
            }
          }
        }
      }
    }
  },
  {
    name: 'Example: Legacy system compromise (Stage 2)',
    narrative: 'Full decomposition: CF=50-500, PoA=0.05-0.3, TCap=0.4-0.8, RS=0.3-0.7. Primary: Productivity=$5K-$100K, Response=$5K-$50K.',
    _isExample: true,
    inputMode: 'ci',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: {
            expanded: true,
            children: {
              tef: {
                expanded: true,
                children: {
                  cf: { expanded: false, ...ci(50, 500) },
                  poa: { expanded: false, ...ci(0.05, 0.3) }
                }
              },
              vuln: {
                expanded: true,
                children: {
                  tcap: { expanded: false, ...ci(0.4, 0.8) },
                  rs: { expanded: false, ...ci(0.3, 0.7) }
                }
              }
            }
          },
          lm: {
            expanded: true,
            children: {
              primary: {
                expanded: true,
                children: {
                  productivity: { expanded: false, ...ci(5000, 100000) },
                  response: { expanded: false, ...ci(5000, 50000) },
                  replacement: { expanded: false, ...ci(0, 0) }
                }
              },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...ci(0.05, 0.3) },
                  slm: {
                    expanded: true,
                    children: {
                      fines: { expanded: false, ...ci(0, 10000) },
                      reputation: { expanded: false, ...ci(1000, 25000) },
                      competitive: { expanded: false, ...ci(1000, 15000) }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  // Scenario 11: Regulatory audit failure (low freq, high secondary)
  {
    name: 'Example: Regulatory audit failure (Stage 1)',
    narrative: 'Regulatory audit failure. Low frequency (0.1-0.8/year), high secondary loss ($600K-$31.5M) vs moderate primary ($200K-$1.5M).',
    _isExample: true,
    inputMode: 'pert',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: { expanded: false, ...pert(0.1, 0.3, 0.8) },
          lm: {
            expanded: true,
            children: {
              primary: { expanded: false, ...pert(100000, 500000, 1500000) },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...pert(0.8, 1.0, 1.0) },
                  slm: { expanded: false, ...pert(500000, 10000000, 30000000) }
                }
              }
            }
          }
        }
      }
    }
  },
  {
    name: 'Example: Regulatory audit failure (Stage 2)',
    narrative: 'Full decomposition: CF=2-20, PoA=0.1-0.5, TCap=0.5-0.9 (adjusted), RS=0.2-0.7 (adjusted). Secondary dominates with fines up to $20M.',
    _isExample: true,
    inputMode: 'pert',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: {
            expanded: true,
            children: {
              tef: {
                expanded: true,
                children: {
                  cf: { expanded: false, ...pert(2, 5, 20) },
                  poa: { expanded: false, ...pert(0.1, 0.3, 0.5) }
                }
              },
              vuln: {
                expanded: true,
                children: {
                  tcap: { expanded: false, ...pert(0.5, 0.7, 0.9) },
                  rs: { expanded: false, ...pert(0.2, 0.4, 0.7) }
                }
              }
            }
          },
          lm: {
            expanded: true,
            children: {
              primary: {
                expanded: true,
                children: {
                  productivity: { expanded: false, ...pert(50000, 200000, 800000) },
                  response: { expanded: false, ...pert(50000, 300000, 700000) },
                  replacement: { expanded: false, ...pert(0, 0, 0) }
                }
              },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...pert(0.8, 1.0, 1.0) },
                  slm: {
                    expanded: true,
                    children: {
                      fines: { expanded: false, ...pert(200000, 5000000, 20000000) },
                      reputation: { expanded: false, ...pert(200000, 3000000, 8000000) },
                      competitive: { expanded: false, ...pert(100000, 2000000, 2000000) }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  // Scenario 12: APT IP theft (very low freq, high competitive loss)
  {
    name: 'Example: APT IP theft (Stage 1)',
    narrative: 'Competitive IP theft via APT. Very low frequency (0.02-0.3/year), high impact with competitive loss dominating ($2M-$70M per event).',
    _isExample: true,
    inputMode: 'pert',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: { expanded: false, ...pert(0.02, 0.1, 0.3) },
          lm: {
            expanded: true,
            children: {
              primary: { expanded: false, ...pert(500000, 2000000, 5000000) },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...pert(0.9, 1.0, 1.0) },
                  slm: { expanded: false, ...pert(1500000, 30000000, 65000000) }
                }
              }
            }
          }
        }
      }
    }
  },
  {
    name: 'Example: APT IP theft (Stage 2)',
    narrative: 'Full decomposition: CF=1-10, PoA=0.5-0.95, TCap=0.7-1.0, RS=0.6-0.95. Secondary loss dominated by competitive advantage ($1.5M-$65M).',
    _isExample: true,
    inputMode: 'pert',
    factors: {
      risk: {
        expanded: true,
        children: {
          lef: {
            expanded: true,
            children: {
              tef: {
                expanded: true,
                children: {
                  cf: { expanded: false, ...pert(1, 3, 10) },
                  poa: { expanded: false, ...pert(0.5, 0.8, 0.95) }
                }
              },
              vuln: {
                expanded: true,
                children: {
                  tcap: { expanded: false, ...pert(0.7, 0.9, 1.0) },
                  rs: { expanded: false, ...pert(0.6, 0.8, 0.95) }
                }
              }
            }
          },
          lm: {
            expanded: true,
            children: {
              primary: {
                expanded: true,
                children: {
                  productivity: { expanded: false, ...pert(200000, 1000000, 3000000) },
                  response: { expanded: false, ...pert(200000, 800000, 1500000) },
                  replacement: { expanded: false, ...pert(100000, 200000, 500000) }
                }
              },
              secondary: {
                expanded: true,
                children: {
                  slef: { expanded: false, ...pert(0.9, 1.0, 1.0) },
                  slm: {
                    expanded: true,
                    children: {
                      fines: { expanded: false, ...pert(0, 0, 0) },
                      reputation: { expanded: false, ...pert(0, 500000, 2000000) },
                      competitive: { expanded: false, ...pert(1500000, 30000000, 65000000) }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
];
