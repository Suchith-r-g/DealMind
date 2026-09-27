"""
Deal Intelligence Agent - Mock & Realistic Sales Interaction Dataset
Used for simulating deal lifecycles and testing Hindsight retain/recall.
"""

INITIAL_DEALS = [
    {
        "deal_id": "deal-acme-corp",
        "company": "Acme Cloud Logistics",
        "industry": "Supply Chain & SaaS",
        "deal_size": "$180,000 / yr",
        "stage": "Proposal & Negotiation",
        "health_score": 78,
        "stakeholders": [
            {"name": "Marcus Vance", "role": "VP of Engineering", "sentiment": "Cautious", "concerns": "Latency, Snowflake integration, SOC2 Type II"},
            {"name": "Sarah Lin", "role": "Chief Financial Officer", "sentiment": "Price-sensitive", "concerns": "Budget cap at $150k, payment terms net-60"},
            {"name": "David K.", "role": "Head of Product", "sentiment": "Champion", "concerns": "Time to deploy, wants live telemetry"}
        ],
        "competitors_mentioned": ["DataDog", "Snowflake Native", "Dynatrace"],
        "interactions": [
            {
                "interaction_id": "call-1",
                "date": "2026-02-14",
                "title": "Initial Discovery & Pain Identification",
                "type": "Video Discovery Call",
                "summary": "Marcus Vance and David K joined. Marcus expressed that their current pipeline latency spikes beyond 450ms when querying across multi-cloud clusters. Mentioned they are currently evaluating DataDog but DataDog's custom metrics pricing is skyrocketing out of control.",
                "transcript": (
                    "Marcus Vance: 'We are processing over 80 million events daily. With DataDog, our bill tripled last quarter just on custom tags.'\n"
                    "David K: 'Our product team needs real-time deal telemetry without waiting 20 minutes for batch exports.'\n"
                    "Sales Rep: 'Understood. Our architecture streams zero-copy telemetry and integrates directly with existing warehouse sinks.'\n"
                    "Marcus Vance: 'If you can guarantee sub-100ms response time and SOC2 compliance, I'm open to a proof of concept.'"
                ),
                "tags": ["Discovery", "Pain-Point", "Competitor:DataDog", "Security:SOC2"]
            },
            {
                "interaction_id": "call-2",
                "date": "2026-03-02",
                "title": "Technical Deep Dive & Architecture Review",
                "type": "Technical Review",
                "summary": "Engineering team validated technical throughput. Marcus raised a strict requirement: Acme cannot send raw customer PII outside their AWS US-East-1 VPC. Clarified data masking capabilities and verified SOC2 Type II report.",
                "transcript": (
                    "Marcus Vance: 'We reviewed your benchmark. Sub-85ms latency looks great, but what about PII isolation?'\n"
                    "Sales Rep: 'We deploy an on-premises tokenization proxy. No raw customer emails or phone numbers ever leave your VPC.'\n"
                    "Marcus Vance: 'That solves our compliance objection. Next step is finance review with Sarah Lin.'"
                ),
                "tags": ["Tech-Review", "Security", "PII-Masking", "Objection-Overcome"]
            },
            {
                "interaction_id": "call-3",
                "date": "2026-03-18",
                "title": "Executive Pricing & Contract Alignment",
                "type": "Executive Negotiation",
                "summary": "Sarah Lin joined with Marcus. Sarah pushed back strongly on the $180k proposal, stating Acme's Q1 discretionary software budget is strictly capped at $150k. She also requested Net-60 payment terms instead of our standard Net-30.",
                "transcript": (
                    "Sarah Lin: 'Look, we love the product feedback Marcus gave, but 180k is over our board-approved Q1 ceiling. If you can do 148k upfront or 155k with Net-60 terms and annual prepay, we can sign before quarter-end.'\n"
                    "Sales Rep: 'Let me consult our VP of Sales. If we structure a 2-year agreement with an expansion tier, we might meet your ceiling.'"
                ),
                "tags": ["Negotiation", "Pricing-Objection", "Budget-Cap", "Payment-Terms"]
            }
        ]
    },
    {
        "deal_id": "deal-fintech-nexus",
        "company": "Nexus Financial Systems",
        "industry": "FinTech & Banking API",
        "deal_size": "$320,000 / yr",
        "stage": "Technical Validation",
        "health_score": 62,
        "stakeholders": [
            {"name": "Elena Rostova", "role": "Chief Information Security Officer", "sentiment": "Skeptical", "concerns": "Data residency, ISO 27001, audit trails"},
            {"name": "Jason Miller", "role": "VP Engineering", "sentiment": "Neutral", "concerns": "API rate limits, migration downtime"}
        ],
        "competitors_mentioned": ["Stripe Radar", "Palantir Foundry"],
        "interactions": [
            {
                "interaction_id": "call-nexus-1",
                "date": "2026-03-10",
                "title": "Security & Regulatory Ingestion Scope",
                "type": "Security Audit Call",
                "summary": "Elena questioned audit trail retention. Noted that financial regulators in the EU require 7 years immutable log preservation. Mentioned Palantir offered this natively but was 4x more expensive.",
                "transcript": (
                    "Elena Rostova: 'We cannot compromise on European banking authority guidelines. We need multi-region replication and immutable WORM storage.'\n"
                    "Sales Rep: 'We provide compliant immutable cold-storage buckets configured with AWS Object Lock.'"
                ),
                "tags": ["Security", "Compliance", "Competitor:Palantir", "Retention"]
            }
        ]
    }
]
