"use client";

import CourseLessonPage, {
  type CourseCard,
  type LessonCategory,
} from "@/app/components/CourseLessonPage";
import { MdOutlineQuiz, MdOutlinePlaylistAdd } from "react-icons/md";

const categories: LessonCategory[] = [
  {
    id: "cloud-concepts",
    title: "Cloud Concepts",
    description:
      "What the cloud actually is, why organisations move to it, and how AWS frames the journey from on-premises to cloud-native.",
    accentFrom: "#F97316",
    accentTo: "#7C2D12",
    accentHex: "#F97316",
    lessons: [
      {
        id: "what-is-cloud",
        title: "What Cloud Computing Really Means",
        body: "Cloud computing is the on-demand delivery of IT resources — compute, storage, databases, networking and more — over the internet with pay-as-you-go pricing. Instead of buying and racking servers months before you need them, you provision capacity in minutes and release it when you are done.\n\nAWS delivers these resources from regions and availability zones. A region is a geographic area, and each region contains multiple isolated availability zones (data centres with independent power and networking). Designing across availability zones is what lets an application survive the failure of a single facility.",
        takeaway:
          "Cloud means on-demand, pay-as-you-go IT resources. Regions and availability zones are the building blocks of resilience.",
      },
      {
        id: "six-advantages",
        title: "The Six Advantages of Cloud",
        body: "AWS describes six advantages that explain why cloud adoption moves so quickly: trade capital expense for variable expense, benefit from massive economies of scale, stop guessing capacity, increase speed and agility, stop spending money running and maintaining data centres, and go global in minutes.\n\nThe common thread is that you stop paying for idle capacity and start paying for outcomes. Capacity that took a procurement cycle now takes a console click, which changes how teams plan products.",
        takeaway:
          "Every cloud advantage reduces either wasted capital or wasted time. Exam questions often describe one of the six in disguise.",
        bullets: [
          "Trade CapEx for variable OpEx",
          "Benefit from AWS economies of scale",
          "Stop guessing capacity — scale with demand",
          "Increase speed and agility for teams",
          "Stop spending on data centre operations",
          "Go global in minutes with multiple regions",
        ],
      },
      {
        id: "capex-opex",
        title: "Cloud Economics: CapEx vs OpEx",
        body: "Traditional IT is capital intensive: you forecast demand, buy hardware, depreciate it over years, and carry the risk that demand never arrives. Cloud shifts most of that to operating expense, where cost tracks actual consumption and can be turned off.\n\nThis does not make cloud automatically cheaper. A poorly governed account can spend more than a data centre, because cost scales with usage instead of being fixed. The exam expects you to understand both the economic model and the need for cost control through tagging, budgets and right-sizing.",
        takeaway:
          "Cloud converts fixed capital cost into variable operating cost — which is only cheaper when usage is managed.",
      },
      {
        id: "well-architected",
        title: "The Well-Architected Framework and CAF",
        body: "The AWS Well-Architected Framework gives six pillars for evaluating workloads: operational excellence, security, reliability, performance efficiency, cost optimisation and sustainability. Each pillar comes with design principles and questions that expose tradeoffs.\n\nThe AWS Cloud Adoption Framework (CAF) works at the organisational level instead, grouping change into six perspectives: business, people, governance, platform, security and operations. CAF helps an enterprise plan the move to cloud; Well-Architected helps engineers review what they built.",
        takeaway:
          "Well-Architected reviews a workload across six pillars. CAF plans organisation-wide cloud adoption across six perspectives.",
        table: {
          header: ["Pillar", "Core question"],
          rows: [
            ["Operational excellence", "Can we run and improve this reliably?"],
            ["Security", "Are data and access protected?"],
            ["Reliability", "Does it recover from failure?"],
            ["Performance efficiency", "Are resources used well?"],
            ["Cost optimisation", "Are we avoiding wasted spend?"],
            ["Sustainability", "Are we reducing environmental impact?"],
          ],
        },
      },
    ],
  },
  {
    id: "core-services",
    title: "Core AWS Services",
    description:
      "The compute, storage, networking and database services that appear in almost every AWS architecture — and how to choose between them.",
    accentFrom: "#2660A4",
    accentTo: "#4F8FCA",
    accentHex: "#2660A4",
    lessons: [
      {
        id: "compute",
        title: "Compute: EC2, Lambda and Containers",
        body: "Amazon EC2 gives you virtual servers with full control over the operating system. You choose instance families for general purpose, compute, memory or storage-heavy workloads, and you pay per second while the instance runs. EC2 suits lift-and-shift migrations and anything that needs persistent, customised hosts.\n\nAWS Lambda runs code in response to events without servers to manage, scaling automatically and billing per request and duration — a natural fit for short, event-driven tasks. Containers sit between the two: Amazon ECS or EKS orchestrates containerised applications, while AWS Fargate removes the need to manage the underlying hosts.",
        takeaway:
          "EC2 for control and long-running hosts, Lambda for event-driven short tasks, containers for portable services at scale.",
        table: {
          header: ["Service", "Model", "Best for"],
          rows: [
            ["EC2", "Virtual servers", "Lift-and-shift, custom OS, steady load"],
            ["Lambda", "Serverless functions", "Event-driven, spiky, short tasks"],
            ["ECS / EKS", "Container orchestration", "Microservices, portable workloads"],
            ["Fargate", "Serverless containers", "Containers without managing hosts"],
          ],
        },
      },
      {
        id: "storage",
        title: "Storage: S3, EBS and EFS",
        body: "Amazon S3 is object storage for any amount of data, accessed over HTTP with strong durability. Buckets hold objects, storage classes trade retrieval cost against storage cost — Standard for frequent access, Infrequent Access and Glacier tiers for colder data, and Intelligent-Tiering when the pattern is unknown.\n\nAmazon EBS provides block volumes attached to a single EC2 instance, behaving like a disk: databases and boot volumes live here. Amazon EFS is shared file storage that many instances can mount at once. Choosing correctly comes down to access pattern: object over HTTP, block for one server, file for many servers.",
        takeaway:
          "S3 = objects over HTTP, EBS = block disk for one instance, EFS = shared file system for many.",
        bullets: [
          "S3 durability is designed for 11 nines; versioning protects against overwrite and delete",
          "S3 lifecycle rules move objects between storage classes automatically",
          "EBS snapshots are incremental and stored in S3",
          "EFS scales elastically and is mounted by multiple instances at once",
        ],
      },
      {
        id: "networking",
        title: "Networking: VPC, Route 53 and CloudFront",
        body: "A VPC is your isolated network inside AWS. You divide it into subnets, decide which are public or private, and control traffic with security groups (stateful, instance level) and network ACLs (stateless, subnet level). An internet gateway connects public subnets to the internet; a NAT gateway lets private subnets reach out without being reachable from outside.\n\nRoute 53 is the DNS service, with routing policies for failover, latency and geolocation. CloudFront is the content delivery network: it caches content at edge locations close to users, reducing latency and shielding origins from direct traffic. Together they are how most AWS applications are exposed to the world.",
        takeaway:
          "VPC segments the network, security groups filter instance traffic, CloudFront and Route 53 sit in front of it.",
      },
      {
        id: "databases",
        title: "Databases: RDS, Aurora and DynamoDB",
        body: "Amazon RDS runs managed relational engines — PostgreSQL, MySQL, MariaDB, SQL Server and Oracle — handling backups, patching and multi-AZ failover. Aurora is AWS-built and MySQL/PostgreSQL compatible, with higher performance and storage that scales automatically.\n\nDynamoDB is a fully managed NoSQL key-value store designed for single-digit millisecond performance at any scale, with partition keys determining how data is distributed. The exam decision is usually relational integrity versus elastic scale: if joins and transactions dominate, choose RDS or Aurora; if access is by key at massive scale, choose DynamoDB.",
        takeaway:
          "Relational workloads go to RDS or Aurora; high-scale key-value access goes to DynamoDB.",
      },
    ],
  },
  {
    id: "security",
    title: "Security and Identity",
    description:
      "Who is responsible for what, how access is granted, and the services that detect and block threats.",
    accentFrom: "#1F8A70",
    accentTo: "#2CB67D",
    accentHex: "#1F8A70",
    lessons: [
      {
        id: "shared-responsibility",
        title: "The Shared Responsibility Model",
        body: "AWS is responsible for security of the cloud: physical facilities, hardware, the hypervisor and the managed service layer. You are responsible for security in the cloud: your data, identity and access configuration, network settings, patching of guest operating systems and application code.\n\nThe boundary moves with the service. On EC2 you patch the OS; on Lambda or S3, AWS runs the platform and you own only configuration and data. Most real-world cloud incidents happen on the customer side of that line — an open bucket, an over-permissive role, a leaked key.",
        takeaway:
          "AWS secures the infrastructure; you secure configuration, identity and data. The split depends on the service.",
      },
      {
        id: "iam",
        title: "IAM: Users, Roles and Policies",
        body: "AWS Identity and Access Management controls who can do what. A user is a long-lived identity; a role is assumed temporarily by services, applications or federated users and is the recommended choice for workloads. Policies are JSON documents that allow or deny actions on resources, evaluated with an explicit deny winning over any allow.\n\nThe principle of least privilege means granting only the actions needed, scoped to specific resources. MFA on privileged accounts, permission boundaries, and avoiding long-lived access keys are the practical controls the exam expects you to recognise.",
        takeaway:
          "Prefer roles over users. Explicit deny always wins, and least privilege keeps the blast radius small.",
        bullets: [
          "Identity-based policies attach to users, groups or roles",
          "Resource-based policies attach to resources such as S3 buckets",
          "Explicit deny overrides every allow statement",
          "Root account should have MFA and no access keys",
        ],
      },
      {
        id: "security-services",
        title: "Detection and Protection Services",
        body: "AWS offers a set of security services that are easy to separate in an exam question. AWS Shield protects against DDoS, with Shield Advanced adding response support. AWS WAF filters HTTP traffic with rules against common exploits. Amazon GuardDuty continuously analyses account activity for malicious or unusual behaviour.\n\nAround those sit AWS Config for tracking resource configuration and compliance, CloudTrail for recording API calls (the audit trail for who did what), KMS for managing encryption keys, and Macie for discovering sensitive data in S3.",
        takeaway:
          "CloudTrail records API activity, GuardDuty detects threats, Shield/WAF block attacks, KMS manages encryption keys.",
        table: {
          header: ["Service", "What it does"],
          rows: [
            ["CloudTrail", "Logs API calls for audit and investigation"],
            ["GuardDuty", "Detects malicious or anomalous activity"],
            ["AWS Shield", "Protects against DDoS attacks"],
            ["AWS WAF", "Filters malicious HTTP requests"],
            ["KMS", "Creates and manages encryption keys"],
            ["Macie", "Finds sensitive data such as PII in S3"],
          ],
        },
      },
    ],
  },
  {
    id: "billing-support",
    title: "Billing, Pricing and Support",
    description:
      "How AWS charges you, the tools that keep spend under control, and which support plan fits which organisation.",
    accentFrom: "#7A4DFF",
    accentTo: "#4F7CFF",
    accentHex: "#7A4DFF",
    lessons: [
      {
        id: "pricing-models",
        title: "Pricing Models",
        body: "AWS charges for what you use, with several ways to reduce the bill. On-Demand pricing gives flexibility with no commitment. Savings Plans commit to a consistent amount of usage for one or three years in exchange for a lower rate. Reserved Instances discount specific instance types for a term. Spot Instances use spare capacity at a steep discount but can be interrupted with short notice.\n\nCompute, storage, data transfer and requests are billed separately, and data transfer out of AWS is a common surprise cost. Keeping traffic inside a region and using CloudFront reduces transfer charges.",
        takeaway:
          "On-Demand is flexible, Savings Plans and RIs reward commitment, Spot is cheapest but interruptible.",
      },
      {
        id: "cost-tools",
        title: "Cost Visibility and Control",
        body: "AWS Cost Explorer visualises spend over time and forecasts future cost. AWS Budgets alerts you, or triggers actions, when spend or usage crosses a threshold. Cost and Usage Reports give the granular line items needed for detailed analysis, and tagging is what makes any of it meaningful — a resource without tags cannot be attributed to a team or product.\n\nTrusted Advisor inspects your account and recommends savings, such as idle load balancers or underutilised instances, alongside security and fault-tolerance checks.",
        takeaway:
          "Tag resources first, then use Budgets for alerts, Cost Explorer for analysis and Trusted Advisor for recommendations.",
      },
      {
        id: "support-plans",
        title: "Support Plans",
        body: "There are four AWS support tiers. Basic is included and covers documentation, billing questions and the health dashboard. Developer adds technical support by email during business hours. Business adds 24/7 phone and chat access, a faster response for production systems, and access to Trusted Advisor checks.\n\nEnterprise adds a technical account manager, a designated support concierge, training credits and the fastest response times. Exam questions tend to describe the requirement — 24/7 production support, or a named TAM — and expect you to map it to a plan.",
        takeaway:
          "Basic is self-service, Developer adds business-hours email, Business adds 24/7 production support, Enterprise adds a TAM.",
      },
    ],
  },
];

const cards: CourseCard[] = [
  {
    href: "/page/aws-exam",
    label: "Exam simulation",
    description:
      "Sit a timed, full-length AWS Cloud Practitioner style exam and see where you stand.",
    icon: <MdOutlineQuiz size={36} />,
    accentFrom: "#2660A4",
    accentTo: "#4F8FCA",
  },
  {
    href: "/page/aws-practise",
    label: "Practice set",
    description:
      "Work through the question bank at your own pace, with answers explained as you go.",
    icon: <MdOutlinePlaylistAdd size={36} />,
    accentFrom: "#F97316",
    accentTo: "#7C2D12",
  },
];

export default function Page() {
  return (
    <CourseLessonPage
      courseSlug='aws-cloud-practitioner'
      badge='AWS Cloud Practitioner'
      title='The AWS exam, answered the way AWS asks it.'
      intro='Every section of the AWS Certified Cloud Practitioner syllabus, recapped in the order you will meet it: cloud concepts, core services, security and billing. Read the recap, replay the key-concept videos, then practise the same material in exam conditions at the bottom of this page.'
      meta={["CLF-C02 syllabus", "4 sections", "14 lessons", "Exam + practice"]}
      categories={categories}
      practiceNote='Both modes use the same AWS question bank, so a weak exam run tells you exactly which section to reread above.'
      cards={cards}
    />
  );
}
