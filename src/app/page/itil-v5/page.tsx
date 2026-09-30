"use client";

import Footer from "@/app/components/Footer";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { BiBook } from "react-icons/bi";
import { MdOutlineQuiz } from "react-icons/md";
import { useRouter } from "next/navigation";
import NavBar from "@/app/components/NavBar";

// ─── Types ───────────────────────────────────────────────────────────────────

type TopicLesson = {
  id: string;
  title: string;
  body: string;
  takeaway: string;
  visual?:
    | "diagram-layered"
    | "diagram-cycle"
    | "code-block"
    | "checklist"
    | "table";
  visualData?: Record<string, string[]> | string[] | string | string[][];
};

type Category = {
  id: string;
  title: string;
  description: string;
  accent: string;
  accentHex: string;
  lessons: TopicLesson[];
};

// ─── Data ────────────────────────────────────────────────────────────────────

const categories: Category[] = [
  {
    id: "introduction",
    title: "Introduction",
    description:
      "Understand the modern IT service management landscape and the purpose and structure of the ITIL 5 framework.",
    accent: "from-[#2660A4] to-[#3C8DAD]",
    accentHex: "#2660A4",
    lessons: [
      {
        id: "itsm-modern-world",
        title: "IT Service Management in the Modern World",
        body: "Services are the main way that organizations create value for themselves and their customers. As businesses become more digital, the discipline of IT service management has had to evolve accordingly.\n\nITIL 5 brings ITIL up to date by reshaping much of the established ITSM practices in the wider context of customer experience, value streams, and digital transformation. It also embraces new ways of working, such as Lean, Agile, and DevOps, making it relevant to modern engineering and operations teams.",
        takeaway:
          "ITIL 5 modernises ITSM by embedding customer experience, value streams, and Agile/DevOps thinking.",
      },
      {
        id: "itil4-framework",
        title: "Structure and Benefits of the ITIL 5 Framework",
        body: "The key component of the ITIL 5 framework is the ITIL Service Value System (SVS). The SVS represents how the various components and activities of the organization work together to facilitate value creation through IT-enabled services.\n\nThe SVS facilitates the integration and coordination of these components and provides a strong, unified, value-focused direction for the entire organization. It is designed to be flexible — it can operate in a wide variety of environments, from traditional waterfall organisations to fully Agile DevOps shops.",
        takeaway:
          "The ITIL SVS is the central model that integrates all components and activities toward value creation.",
        visual: "checklist",
        visualData: [
          "ITIL guiding principles",
          "Governance",
          "Service value chain",
          "Management practices",
          "Continual improvement",
        ],
      },
      {
        id: "organizational-agility",
        title: "Organizational Agility and Resilience",
        body: "Successful organizations possess both organizational agility and organizational resilience. Agility supports internal changes — the ability to adapt quickly as strategies and priorities shift. Resilience is the ability of an organization to anticipate, prepare for, respond to, and adapt to both incremental changes and sudden disruptions from an external perspective.\n\nThe ITIL SVS provides the means to achieve both. It facilitates the adoption of a strong unified direction focused on value and understood by everyone in the organization, while also enabling continual improvement throughout.",
        takeaway:
          "Agility handles internal change; resilience handles external disruption. ITIL SVS enables both.",
      },
    ],
  },

  {
    id: "key-concepts",
    title: "Key Concepts of Service Management",
    description:
      "Master the foundational definitions and relationships that underpin all of ITIL: value, services, stakeholders, and risk.",
    accent: "from-[#1F8A70] to-[#2CB67D]",
    accentHex: "#1F8A70",
    lessons: [
      {
        id: "service-management-definition",
        title: "Service Management",
        body: "Service management is defined as a set of specialized organizational capabilities for enabling value for customers in the form of services. It is not simply about running IT systems — it requires a deep understanding of the nature of value, the nature and scope of the stakeholders involved, and how value creation is enabled through services.\n\nThis distinction matters: a team that focuses only on keeping systems running, without understanding the value those systems deliver to customers, is practising operations, not service management.",
        takeaway:
          "Service management = specialized capabilities to enable customer value through services.",
      },
      {
        id: "stakeholders",
        title: "Organizations, Providers, Consumers and Stakeholders",
        body: "An organization is a person or group of people that has its own functions with responsibilities, authorities, and relationships to achieve its objectives. When provisioning services, an organization takes on the role of service provider; when receiving services, it becomes a service consumer.\n\nWithin service consumption, three specific roles exist: the customer (defines requirements and takes responsibility for outcomes), the user (actually uses the service), and the sponsor (authorizes the budget). These roles can be held by the same person or separated across different people.",
        takeaway:
          "Customer defines requirements. User uses the service. Sponsor authorizes budget. These roles can overlap.",
        visual: "table",
        visualData: [
          ["Stakeholder", "Value Received"],
          ["Service consumers", "Benefits achieved; costs and risks optimized"],
          [
            "Service provider",
            "Funding from consumer; business development; image improvement",
          ],
          [
            "Provider employees",
            "Financial incentives; career development; sense of purpose",
          ],
          [
            "Society and community",
            "Employment; taxes; community development contributions",
          ],
          [
            "Shareholders",
            "Financial benefits; sense of assurance and stability",
          ],
        ],
      },
      {
        id: "products-services",
        title: "Products, Services, and Service Offerings",
        body: "Organizations own or have access to a variety of resources, including people, information and technology, value streams and processes, and partners and suppliers. Products are configurations of these resources designed to offer value for a consumer.\n\nA service is a means of enabling value co-creation by facilitating outcomes that customers want to achieve, without the customer having to manage specific costs and risks. Services are presented to consumers as service offerings — formal descriptions of one or more services designed to address the needs of a target consumer group. Service offerings may include goods (ownership transferred), access to resources (licensed under agreed terms), and service actions (activities performed to address consumer needs).",
        takeaway:
          "Products = configured resources. Services = value co-creation without transferring costs/risks. Offerings bundle these for consumers.",
      },
      {
        id: "service-relationships",
        title: "Service Relationships",
        body: "Service relationships are established between two or more organizations to co-create value. The two roles — service provider and service consumer — are not mutually exclusive: organizations typically both provide and consume a number of services at any given time.\n\nA service relationship encompasses service provision (activities performed to provide services), service consumption (activities performed to consume services), and service relationship management — the joint activities performed by both parties to ensure continual value co-creation based on agreed and available service offerings.",
        takeaway:
          "Organizations are simultaneously providers and consumers. Service relationship management is a joint responsibility.",
      },
      {
        id: "outcomes-costs-risks",
        title: "Value: Outcomes, Costs, and Risks",
        body: "Achieving desired outcomes requires resources (and therefore costs) and is often associated with risks. Service providers help their consumers achieve outcomes and, in doing so, take on some of the associated risks and costs. On the other hand, service relationships can also introduce new risks and costs.\n\nKey definitions: an output is a tangible or intangible deliverable of an activity. An outcome is a result for a stakeholder enabled by one or more outputs. Utility is the functionality offered (fit for purpose), while warranty is the assurance that requirements will be met (fit for use). Both utility and warranty are required for a service to deliver value.\n\nConsumers contribute to risk reduction by clearly communicating requirements, sharing critical success factors and constraints, and ensuring the provider has access to necessary resources throughout the service relationship.",
        takeaway:
          "Value requires both utility (fit for purpose) and warranty (fit for use). Risk and cost flow both ways in a service relationship.",
      },
    ],
  },

  {
    id: "four-dimensions",
    title: "The 4-Dimensional Model",
    description:
      "Explore the four dimensions ITIL 5 uses to ensure every component of the SVS is considered holistically.",
    accent: "from-[#6D2E46] to-[#9B4D57]",
    accentHex: "#6D2E46",
    lessons: [
      {
        id: "four-dimensions-overview",
        title: "Overview of the Four Dimensions",
        body: "ITIL 5 defines four dimensions of service management that collectively are critical to the effective and efficient facilitation of value for customers and other stakeholders. Every component of the Service Value System should be considered through all four lenses.\n\nThe four dimensions are: organizations and people; information and technology; partners and suppliers; and value streams and processes. These dimensions are also constrained or influenced by several external factors — captured by the PESTLE acronym (political, economic, social, technological, legal, and environmental) — that are often beyond the control of the service provider.",
        takeaway:
          "All four dimensions must be considered together. External PESTLE factors constrain but don't control the SVS.",
        visual: "diagram-layered",
        visualData: {
          "Organizations & People": [
            "roles and responsibilities",
            "culture",
            "staffing",
            "competencies",
          ],
          "Information & Technology": [
            "data management",
            "knowledge",
            "cloud computing",
            "security",
          ],
          "Partners & Suppliers": [
            "outsourcing strategy",
            "SIAM",
            "contracts",
            "cooperation models",
          ],
          "Value Streams & Processes": [
            "value stream mapping",
            "process design",
            "workflow",
            "inputs/outputs",
          ],
        },
      },
      {
        id: "orgs-and-people",
        title: "Organizations and People",
        body: "The complexity of organizations is growing, and it is important to ensure that the way an organization is structured and managed — as well as its roles, responsibilities, and systems of authority and communication — is well defined and supports its overall strategy and operating model.\n\nPeople must understand the interfaces between their specializations and roles and those of others in the organization, to ensure proper levels of collaboration and coordination. Key aspects include: a culture that supports objectives with sufficient capacity and competence; leaders who advocate values that motivate people; and ensuring everyone has a focus on value creation.",
        takeaway:
          "Culture and leadership motivation are the key levers in this dimension — structure alone is not enough.",
      },
      {
        id: "information-and-technology",
        title: "Information and Technology",
        body: "The information and technology dimension includes the information and knowledge necessary for the management of services, as well as the technologies required. It also incorporates the relationships between different components of the SVS, such as the inputs and outputs of activities and practices.\n\nOrganizations should ask: what information is managed by the services? What supporting knowledge is needed to deliver and manage them? How will information assets be protected, managed, archived, and disposed of? Information management is a means of enabling business value, and the information architecture needs to be continually optimised for availability, timeliness, accuracy, and relevance.\n\nCloud computing is a major enabler in this dimension, offering on-demand availability, network access, resource pooling, rapid elasticity, and measured service.",
        takeaway:
          "Information is the key output of most IT services. The architecture must be continually optimised for availability, timeliness, and accuracy.",
      },
      {
        id: "partners-and-suppliers",
        title: "Partners and Suppliers",
        body: "The partners and suppliers dimension encompasses an organization's relationships with other organizations involved in the design, development, deployment, delivery, support, and continual improvement of services. It also incorporates contracts and other agreements.\n\nFactors influencing supplier strategy include strategic focus (core vs. non-core), corporate culture, resource scarcity, cost concerns, subject matter expertise, external constraints, and demand patterns. There are three main forms of cooperation: goods supply (supplier responsible for outputs, customer for outcomes), service delivery (provider delivers a service), and service partnership (value co-created, responsibilities shared).\n\nService Integration and Management (SIAM) is one method to address this dimension — it uses a specially established integrator to ensure service relationships are properly coordinated.",
        takeaway:
          "Choose a cooperation model based on where responsibility for outcomes should sit. SIAM helps when many suppliers are involved.",
      },
      {
        id: "value-streams-processes",
        title: "Value Streams and Processes",
        body: "A value stream is a series of steps an organization undertakes to create and deliver products and services to consumers. A process is a set of interrelated or interacting activities that transform inputs into outputs, defining the sequence of actions and their dependencies.\n\nValue streams and processes define how the various parts of the organization work together to enable value creation. They should be designed with clear inputs, outputs, and stakeholder requirements in mind. When analysing or improving a value stream, the goal is to identify and eliminate steps that do not contribute to value, reducing waste and increasing speed of delivery.",
        takeaway:
          "Map value streams to find and eliminate waste. Processes are the building blocks of value streams.",
      },
    ],
  },

  {
    id: "service-value-system",
    title: "ITIL Service Value System",
    description:
      "Understand how the SVS components — guiding principles, governance, value chain, practices, and continual improvement — work together.",
    accent: "from-[#7A4DFF] to-[#4F7CFF]",
    accentHex: "#7A4DFF",
    lessons: [
      {
        id: "svs-overview",
        title: "The Service Value System (SVS)",
        body: "The ITIL SVS describes how all the components and activities of the organization work together as a system to enable value creation. Each organization's SVS has interfaces with other organizations, forming an ecosystem that can facilitate value for those organizations, their customers, and other stakeholders.\n\nThe SVS is triggered by opportunity and demand. Opportunity represents options to add value for stakeholders, even without existing demand. Demand represents the need or desire for products and services from internal and external customers. The SVS does not automatically accept all opportunities or satisfy all demands — it uses its components to evaluate and prioritize.",
        takeaway:
          "The SVS converts opportunity and demand into value through an integrated set of components.",
        visual: "diagram-cycle",
        visualData: [
          "Opportunity/Demand",
          "Guiding Principles",
          "Governance",
          "Service Value Chain",
          "Practices",
          "Continual Improvement",
          "Value",
        ],
      },
      {
        id: "guiding-principles",
        title: "The ITIL Guiding Principles",
        body: "The guiding principles are recommendations that can guide an organization in all circumstances, regardless of changes in its goals, strategies, type of work, or management structure. They are not prescriptive rules — they are universal principles that should inform every decision.\n\nThe seven principles are: Focus on value (map everything, directly or indirectly, to stakeholder value); Start where you are (leverage what is already available before building new); Progress iteratively with feedback (work in smaller sections and use feedback at each iteration); Collaborate and promote visibility (working across boundaries produces better outcomes); Think and work holistically (consider all aspects of the SVS); Keep it simple and practical (use outcome-based thinking to produce practical solutions); Optimize and automate (eliminate waste and use technology wherever it adds value, reserving human intervention for where it truly contributes).",
        takeaway:
          "All seven principles apply at all times. They are not a checklist — they are a way of thinking.",
        visual: "table",
        visualData: [
          ["Principle", "Core idea"],
          ["Focus on value", "Map everything to stakeholder value"],
          [
            "Start where you are",
            "Leverage existing capabilities before building new",
          ],
          [
            "Progress iteratively with feedback",
            "Work in small sections; use feedback throughout",
          ],
          [
            "Collaborate and promote visibility",
            "Cross-boundary work produces better buy-in and outcomes",
          ],
          [
            "Think and work holistically",
            "Consider all SVS aspects and the 4-dimensional model",
          ],
          [
            "Keep it simple and practical",
            "Outcome-based thinking; avoid unnecessary complexity",
          ],
          [
            "Optimize and automate",
            "Eliminate waste; reserve human effort for where it adds value",
          ],
        ],
      },
      {
        id: "governance",
        title: "Governance",
        body: "Every organization is directed by a governing body — a person or group accountable at the highest level for performance and compliance. The governing body is accountable for the organization's compliance with policies and any external regulations.\n\nOrganizational governance is realized through three activities: Evaluate (the governing body evaluates the organization, its strategy, portfolios, and relationships with other parties), Direct (it assigns responsibility for and directs the preparation and implementation of organizational strategy and policies), and Monitor (it monitors the performance of the organization and its practices, products, and services).",
        takeaway:
          "Governance = Evaluate, Direct, Monitor. The governing body is accountable but not necessarily operational.",
      },
      {
        id: "service-value-chain",
        title: "The Service Value Chain (SVC)",
        body: "The service value chain is a set of interconnected activities that an organization performs to deliver a valuable product or service and to facilitate value realization. The six activities are: Plan, Improve, Engage, Design and Transition, Obtain/Build, and Deliver and Support.\n\nThese activities represent the steps an organization takes in the creation of value. Each activity transforms inputs into outputs. To convert inputs into outputs, the value chain activities use different combinations of ITIL practices, drawing on internal or third-party resources, processes, skills, and competencies as required. All external interactions happen via Engage; all new resources are obtained through Obtain/Build; and all planning happens via Plan.",
        takeaway:
          "The SVC is not a linear process — activities combine flexibly to form value streams suited to each situation.",
        visual: "diagram-layered",
        visualData: {
          Plan: [
            "shared vision",
            "improvement direction",
            "portfolio decisions",
          ],
          Improve: [
            "continual improvement",
            "performance information",
            "improvement initiatives",
          ],
          Engage: [
            "stakeholder needs",
            "transparency",
            "customer relationships",
          ],
          "Design & Transition": [
            "stakeholder expectations",
            "quality",
            "time to market",
          ],
          "Obtain/Build": [
            "service components",
            "availability",
            "agreed specifications",
          ],
          "Deliver & Support": [
            "service delivery",
            "user support",
            "performance reporting",
          ],
        },
      },
      {
        id: "continual-improvement",
        title: "Continual Improvement",
        body: "Continual improvement is a recurring organizational activity performed at all levels to ensure that performance continually meets stakeholders' expectations. It applies to the SVS in its entirety, as well as to all products, services, service components, and relationships.\n\nThe ITIL continual improvement model has seven steps: What is the vision? Where are we now? Where do we want to be? How do we get there? Take action. Did we get there? How do we keep the momentum going? Each step builds on the last, and the model can be applied iteratively using Agile or waterfall approaches as appropriate.",
        takeaway:
          "Continual improvement is not a project — it is an ongoing discipline applied at every level of the SVS.",
        visual: "diagram-cycle",
        visualData: [
          "What is the vision?",
          "Where are we now?",
          "Where do we want to be?",
          "How do we get there?",
          "Take action",
          "Did we get there?",
          "Keep the momentum",
        ],
      },
    ],
  },

  {
    id: "management-practices",
    title: "ITIL Management Practices",
    description:
      "Deep-dive into the key ITIL 5 management practices: their purpose, definitions, and contribution to the service value chain.",
    accent: "from-[#F97316] to-[#F59E0B]",
    accentHex: "#F97316",
    lessons: [
      {
        id: "it-asset-management",
        title: "IT Asset Management",
        body: "The purpose of IT asset management is to plan and manage the full lifecycle of all IT assets in order to help the organization maximize value, control costs, manage risks, support decision-making about purchase, re-use, retirement, and disposal, and meet regulatory and contractual requirements.\n\nIT asset management (ITAM) specifically manages the lifecycles and total costs of IT equipment and infrastructure. Software asset management (SAM) specifically manages the acquisition, development, release, deployment, maintenance, and eventual retirement of software assets. The IT asset register must be combined with the information stored in a configuration management system (CMS). Assets must be labelled, protected from theft and data leakage, and managed in compliance with regulatory requirements such as data privacy and electronic waste directives.",
        takeaway:
          "ITAM controls cost and risk across the full asset lifecycle. The asset register must federate with the CMS.",
        visual: "checklist",
        visualData: [
          "Define, populate, and maintain the asset register",
          "Control the asset lifecycle in collaboration with other practices",
          "Provide current and historical data and reports to other practices",
          "Audit assets and conformity with regulations and licence terms",
          "Manage lost or stolen devices; erase sensitive data as required",
          "Assign cloud-based assets to specific products or groups for cost management",
        ],
      },
      {
        id: "service-desk",
        title: "Service Desk",
        body: "The purpose of the service desk practice is to capture demand for incident resolution and service requests. It should be the entry point and single point of contact for the service provider with all of its users.\n\nService desks provide a clear path for users to report issues, queries, and requests, and have them acknowledged, classified, owned, and actioned. The focus is on support for 'people and business' rather than simply technical issues. Service desk staff require training in empathy, effective communication, business acumen, emotional intelligence, and incident analysis and prioritization.\n\nService desks can be local (close to the user community), centralized (serving multiple locations), or virtual (giving the feel of a single desk regardless of geography). The 'Follow the Sun' model provides 24-hour coverage by handing calls across geographical locations as business hours close.",
        takeaway:
          "The service desk is the human face of IT services. People skills matter as much as technical ones.",
        visual: "diagram-layered",
        visualData: {
          "Access channels": [
            "phone / IVR",
            "service portal",
            "chat / chatbot",
            "email",
            "walk-in",
            "social media",
          ],
          "Structural models": [
            "local",
            "centralized",
            "virtual",
            "Follow the Sun",
          ],
          Tools: [
            "telephony / IVR",
            "workflow systems",
            "knowledge base",
            "remote access",
            "monitoring dashboards",
          ],
        },
      },
      {
        id: "service-request-management",
        title: "Service Request Management",
        body: "The purpose of the service request management practice is to support the agreed quality of a service by handling all pre-defined, user-initiated service requests in an effective and user-friendly manner. A service request is a request from a user or a user's authorized representative that initiates a service action agreed as a normal part of service delivery.\n\nService requests and their fulfilment should be standardized and automated to the greatest degree possible. Policies should be established for requests that can be fulfilled with limited or no additional approvals. User expectations regarding fulfilment times should be clearly set based on what the organization can realistically deliver. Workflows must also exist for redirecting requests that should actually be managed as incidents or changes.",
        takeaway:
          "Standardize and automate service request fulfilment. Set realistic expectations and keep approvals lean.",
      },
      {
        id: "incident-management",
        title: "Incident Management",
        body: "The purpose of the incident management practice is to minimize the negative impact of incidents by restoring normal service operation as quickly as possible. An incident is an unplanned interruption to a service or reduction in the quality of a service.\n\nIncidents are resolved across multiple tiers: self-service by users, service desk resolution, escalation to specialist support teams, escalation to suppliers, or a temporary major incident team for the most complex cases. Every incident should be logged and managed to meet agreed resolution times. Incidents are prioritized based on business impact — high-impact incidents receive more resources and more complex management, while low-impact incidents must be handled efficiently to avoid consuming disproportionate resources.",
        takeaway:
          "Speed of restoration is the primary goal. Prioritize by business impact, not by technical complexity alone.",
        visual: "diagram-cycle",
        visualData: [
          "Incident detected",
          "Logged and classified",
          "Prioritized",
          "Diagnosed",
          "Escalated if needed",
          "Resolved",
          "Closed",
        ],
      },
      {
        id: "monitoring-event-management",
        title: "Monitoring and Event Management",
        body: "The purpose of monitoring and event management is to systematically observe services and service components, and record and report selected changes of state identified as events. An event is any change of state that has significance for the management of a service or other configuration item.\n\nThe practice must address: identifying what services and CIs should be monitored; implementing and maintaining monitoring tools; establishing thresholds for determining which changes of state become events (informational, warning, or exception); establishing policies for handling each event type; and implementing processes and automations to operationalize those policies. Effective monitoring enables proactive identification of conditions that could lead to faults or incidents before they impact users.",
        takeaway:
          "Good monitoring is proactive. Define event types and response policies before incidents happen.",
      },
      {
        id: "problem-management",
        title: "Problem Management",
        body: "The purpose of problem management is to reduce the likelihood and impact of incidents by identifying actual and potential causes of incidents, and managing workarounds and known errors. A problem is a cause or potential cause of one or more incidents. A known error is a problem that has been analysed but not yet resolved.\n\nProblem management operates in three phases: Problem Identification (trend analysis, detecting duplicate incidents, major incident reviews, supplier intelligence), Problem Control (analysing problems, documenting workarounds and known errors, prioritizing based on impact and probability), and Error Control (managing known errors, identifying permanent solutions, and raising change requests when justified by cost, risk, and benefit analysis).\n\nA workaround is a solution that reduces or eliminates the impact of an incident or problem for which a full resolution is not yet available.",
        takeaway:
          "Incident management restores service; problem management prevents recurrence. Both are needed.",
      },
      {
        id: "change-control",
        title: "Change Control / Enablement",
        body: "The purpose of change control is to maximize the number of successful service and product changes by ensuring that risks have been properly assessed, authorizing changes to proceed, and managing the change schedule. A change is the addition, modification, or removal of anything that could have a direct or indirect effect on services.\n\nThere are three types of changes: standard changes (low-risk, pre-authorized, well-understood, often initiated as service requests), normal changes (must be scheduled, assessed, and authorized — risk level determines who acts as change authority), and emergency changes (must be implemented as soon as possible, with expedited assessment and authorization). In high-velocity organizations, peer review is a common predictor of high performance, and CI/CD pipelines often automate most change control steps.",
        takeaway:
          "Match the level of change authority to the risk and velocity of the change type. Automate standard and low-risk normal changes.",
        visual: "table",
        visualData: [
          ["Change Type", "Risk Level", "Authorization", "Trigger"],
          ["Standard", "Low", "Pre-authorized", "Often a service request"],
          [
            "Normal",
            "Variable",
            "Change authority (scaled by risk)",
            "Change request",
          ],
          [
            "Emergency",
            "Urgent",
            "Expedited change authority",
            "Incident / security patch",
          ],
        ],
      },
      {
        id: "information-security-management",
        title: "Information Security Management",
        body: "The purpose of information security management is to protect the information needed by the organization to conduct its business. This includes managing the risks to Confidentiality (limiting access to information), Integrity (assurance that information is trustworthy and accurate), and Availability (guaranteeing reliable access to authorized people) — together known as CIA.\n\nSecurity is also achieved through AAA: Authentication (only approved entities can access protected assets), Authorization (the right privileges are accorded to authorized people), and Accounting (transactions on protected systems are monitored and recorded).\n\nKey security principles include: Least Privilege (users only get access needed for their task), Need to Know (access limited to job-function requirements), Separation of Duties (more than one person required to complete sensitive tasks), Separation of Privileges (no single control component can complete a task alone), and Non-Repudiation (no one can deny the origin or authenticity of a message).",
        takeaway:
          "Security must be built in from the start — across design, transition, build, and ongoing delivery. CIA and AAA are the foundational frameworks.",
        visual: "checklist",
        visualData: [
          "Confidentiality – limit access to information to authorised parties",
          "Integrity – ensure information is trustworthy and accurate",
          "Availability – guarantee reliable access to authorised people",
          "Authentication – verify identity before granting access",
          "Authorization – assign the right privileges to the right people",
          "Accounting – monitor and record all transactions on protected systems",
        ],
      },
      {
        id: "release-management",
        title: "Release Management",
        body: "The purpose of release management is to make new and changed services and features available for use. A release is a version of a service or other configuration item, or a collection of CIs, that is made available for use.\n\nRelease staging techniques include: blue/green releases (two mirrored production environments; users switch via network tools), and feature flags (enabling specific features for individual users or groups in a controlled way). In a DevOps environment, release management is often integrated with a continuous integration and continuous delivery (CI/CD) toolchain, enabling very frequent, automated releases. In traditional waterfall environments, releases are larger, less frequent, and more heavily governed.",
        takeaway:
          "The release approach should match the organization's delivery model. CI/CD enables frequent, small, lower-risk releases.",
      },
      {
        id: "capacity-performance-management",
        title: "Capacity and Performance Management",
        body: "The purpose of capacity and performance management is to ensure that services achieve agreed and expected performance, satisfying current and future demand in a cost-effective way. Performance is a measure of what is achieved or delivered by a system, person, team, practice, or service. Service capacity is the maximum throughput a CI or service can deliver; service performance depends on service capacity.\n\nKey activities include service performance and capacity analysis (monitoring current performance, capacity and performance modelling) and service performance and capacity planning (capacity requirements analysis, demand forecasting, resource planning, and performance improvement planning). Service performance contributes significantly to customer and user satisfaction, making this practice directly tied to SLO achievement.",
        takeaway:
          "Model and forecast before capacity becomes a problem. Performance is a direct driver of customer satisfaction.",
      },
      {
        id: "service-configuration-management",
        title: "Service Configuration Management",
        body: "The purpose of service configuration management is to ensure that accurate and reliable information about the configuration of services, and the configuration items (CIs) that support them, is available when and where needed. A CI is any component that needs to be managed in order to deliver an IT service. The configuration management system (CMS) is the set of tools, data, and information used to support this practice.\n\nConfiguration management activities include: identifying new CIs and adding them to the CMS, updating configuration data when changes are deployed, verifying that configuration records are correct, and auditing to identify any undocumented applications or infrastructure. In modern environments, infrastructure as code takes this further — configuration information is managed in a data repository and used to automatically configure the environment.",
        takeaway:
          "Accurate CI data underpins incident, problem, and change management. Infrastructure as code turns configuration records into the source of truth.",
      },
      {
        id: "service-level-management",
        title: "Service Level Management",
        body: "The purpose of service level management is to set clear business-based targets for service levels, and to ensure that delivery of services is properly assessed, monitored, and managed against these targets. A service level agreement (SLA) is a documented agreement between a service provider and a customer that identifies both services required and the expected level of service.\n\nSLAs must be related to a defined service in the service catalogue, relate to defined outcomes (not just operational metrics), reflect genuine agreement through engagement and discussion, and be simply written. The 'watermelon SLA effect' is a dangerous trap: metrics may appear green (SLA met) while the customer is actually dissatisfied because downtime occurred during critical business moments. Service level management must use metrics that are a truthful reflection of the customer's actual experience.",
        takeaway:
          "Avoid the watermelon effect — measure what customers actually experience, not just what is easy to measure.",
        visual: "checklist",
        visualData: [
          "Related to a defined service in the service catalogue",
          "Based on defined outcomes, not just operational metrics",
          "Agreed through genuine engagement — not imposed unilaterally",
          "Involves all stakeholders: sponsors, users, customers, partners",
          "Simply written and easy to understand by all parties",
          "Supported by regular service reviews and feedback loops",
        ],
      },
      {
        id: "business-analysis",
        title: "Business Analysis",
        body: "The purpose of the business analysis practice is to analyse a business or some element of it, define its associated needs, and recommend solutions to address those needs or solve a business problem, in a way that facilitates value creation for stakeholders.\n\nBusiness analysis must be approached holistically — considering processes, organizational change, technology, information, policies, and strategic planning. Restricting it to software development risks developing incomplete solutions. Key activities include: analysing business systems and architectures in changing contexts, identifying and prioritizing improvement opportunities, evaluating and proposing actions, documenting business requirements, and recommending solutions validated with stakeholders.\n\nTwo key definitions: warranty requirements are typically non-functional requirements captured from key stakeholders. Utility requirements are functional requirements defined by the customer and unique to a specific product.",
        takeaway:
          "Business analysis is a strategic practice — it shapes what gets built and why, not just how it gets built.",
      },
    ],
  },
];

// ─── Visual renderers ─────────────────────────────────────────────────────────

function DiagramLayered({
  data,
  accentHex,
}: {
  data: Record<string, string[]>;
  accentHex: string;
}) {
  return (
    <div className='mt-5 space-y-2'>
      {Object.entries(data).map(([layer, items]) => (
        <div
          key={layer}
          className='rounded-xl border border-slate-200 bg-white p-4'
        >
          <p
            className='text-xs font-bold uppercase tracking-widest mb-2'
            style={{ color: accentHex }}
          >
            {layer}
          </p>
          <div className='flex flex-wrap gap-2'>
            {items.map((item) => (
              <span
                key={item}
                className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700'
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DiagramCycle({
  data,
  accentHex,
}: {
  data: string[];
  accentHex: string;
}) {
  return (
    <div className='mt-5 flex flex-wrap items-center gap-2'>
      {data.map((step, i) => (
        <React.Fragment key={step}>
          <span
            className='rounded-full px-4 py-2 text-xs font-semibold text-white'
            style={{ backgroundColor: accentHex }}
          >
            {step}
          </span>
          {i < data.length - 1 && (
            <span className='text-slate-400 font-bold'>→</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function Checklist({ data }: { data: string[] }) {
  return (
    <ul className='mt-5 space-y-2'>
      {data.map((item) => (
        <li key={item} className='flex items-start gap-3'>
          <span className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500'>
            ✓
          </span>
          <span className='text-sm text-slate-700'>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function DataTable({ data }: { data: string[][] }) {
  const [header, ...rows] = data;
  return (
    <div className='mt-5 overflow-x-auto rounded-2xl border border-slate-200'>
      <table className='min-w-full text-sm'>
        <thead className='bg-slate-50'>
          <tr>
            {header.map((h) => (
              <th
                key={h}
                className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500'
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-slate-100 bg-white'>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className='px-4 py-3 text-slate-700'>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Lesson card component ─────────────────────────────────────────────────────

function LessonCard({
  lesson,
  accentHex,
}: {
  lesson: TopicLesson;
  accentHex: string;
}) {
  return (
    <article id={lesson.id} className='scroll-mt-32 mb-12'>
      <div
        className='mb-1 h-1 w-10 rounded-full'
        style={{ backgroundColor: accentHex }}
      />
      <h3 className='text-xl font-bold text-slate-900 mb-4'>{lesson.title}</h3>
      <div className='space-y-4'>
        {lesson.body.split("\n\n").map((para, i) => (
          <p key={i} className='text-base leading-8 text-slate-600'>
            {para}
          </p>
        ))}
      </div>

      {lesson.visual === "diagram-layered" && lesson.visualData && (
        <DiagramLayered
          data={lesson.visualData as Record<string, string[]>}
          accentHex={accentHex}
        />
      )}
      {lesson.visual === "diagram-cycle" && lesson.visualData && (
        <DiagramCycle
          data={lesson.visualData as string[]}
          accentHex={accentHex}
        />
      )}
      {lesson.visual === "checklist" && lesson.visualData && (
        <Checklist data={lesson.visualData as string[]} />
      )}
      {lesson.visual === "table" && lesson.visualData && (
        <DataTable data={lesson.visualData as string[][]} />
      )}

      <div
        className='mt-6 rounded-2xl px-5 py-4'
        style={{
          backgroundColor: `${accentHex}10`,
          borderLeft: `3px solid ${accentHex}`,
        }}
      >
        <p
          className='text-xs font-bold uppercase tracking-widest mb-1'
          style={{ color: accentHex }}
        >
          Key takeaway
        </p>
        <p className='text-sm font-medium text-slate-800'>{lesson.takeaway}</p>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LearnPage() {
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0].id);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const router = useRouter();

  const activeCategory = categories.find((c) => c.id === activeCategoryId)!;

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLessonId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );
    observerRef.current = observer;
    activeCategory.lessons.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [activeCategoryId]);

  const handleNavigation = (path: string) => {
    localStorage.clear();
    router.push(path);
  };

  const switchCategory = (id: string) => {
    setActiveCategoryId(id);
    setIsMobileTocOpen(false);
    setActiveLessonId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToLesson = (id: string) => {
    setIsMobileTocOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className='min-h-screen bg-white text-slate-900'>
      <NavBar />
      {/* ── Category selector bar ── */}
      <div className='fixed top-20 w-full z-40 border-b border-slate-200 bg-white/95 backdrop-blur'>
        <div className='mx-auto max-w-7xl px-4 md:px-8'>
          <div className='flex items-center gap-1 overflow-x-auto py-3 custom-scrollbar-x'>
            {categories.map((cat) => {
              const isActive = cat.id === activeCategoryId;
              return (
                <button
                  key={cat.id}
                  type='button'
                  onClick={() => switchCategory(cat.id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  style={
                    isActive ? { backgroundColor: cat.accentHex } : undefined
                  }
                >
                  {cat.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className='mx-auto max-w-7xl px-4 md:px-8'>
        {/* ── Hero ── */}
        <div className='relative md:mt-46 mt-40 overflow-hidden rounded-3xl my-8 p-8 md:p-12'>
          <div
            className={`absolute inset-0 bg-gradient-to-br ${activeCategory.accent} opacity-10`}
          />
          <div
            className='absolute right-0 top-0 h-64 w-64 rounded-full blur-3xl opacity-20'
            style={{ backgroundColor: activeCategory.accentHex }}
          />
          <div className='relative'>
            <div
              className='inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white mb-4'
              style={{ backgroundColor: activeCategory.accentHex }}
            >
              ITIL V5 Foundation
            </div>
            <h1 className='text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl'>
              {activeCategory.title}
            </h1>
            <p className='mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg'>
              {activeCategory.description}
            </p>
            <p className='mt-4 text-sm text-slate-500'>
              {activeCategory.lessons.length} topics in this section
            </p>
          </div>
        </div>

        {/* ── Mobile TOC toggle ── */}
        <div className='lg:hidden mb-6'>
          <button
            type='button'
            onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
            className='flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-900 shadow-sm'
          >
            <span>Table of contents</span>
            <span className='text-slate-400 text-lg'>
              {isMobileTocOpen ? "↑" : "↓"}
            </span>
          </button>
          {isMobileTocOpen && (
            <div className='mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg'>
              <nav className='space-y-1'>
                {activeCategory.lessons.map((lesson, i) => (
                  <button
                    key={lesson.id}
                    type='button'
                    onClick={() => scrollToLesson(lesson.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                      activeLessonId === lesson.id
                        ? "font-semibold text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                    style={
                      activeLessonId === lesson.id
                        ? { backgroundColor: activeCategory.accentHex }
                        : undefined
                    }
                  >
                    <span className='text-xs opacity-50'>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {lesson.title}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* ── Two-column layout ── */}
        <div className='flex gap-10 pb-24'>
          <div className='min-w-0 flex-1'>
            {activeCategory.lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                accentHex={activeCategory.accentHex}
              />
            ))}
          </div>

          <aside className='hidden lg:block w-64 xl:w-72 shrink-0'>
            <div className='sticky top-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'>
              <p className='text-xs font-bold uppercase tracking-widest text-slate-400 mb-4'>
                In this section
              </p>
              <nav className='space-y-0.5 max-h-[calc(100vh-10rem)] overflow-y-auto pr-1'>
                {activeCategory.lessons.map((lesson, i) => {
                  const isActive = activeLessonId === lesson.id;
                  return (
                    <button
                      key={lesson.id}
                      type='button'
                      onClick={() => scrollToLesson(lesson.id)}
                      className={`group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-150 ${
                        isActive
                          ? "font-semibold"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                      style={
                        isActive
                          ? { color: activeCategory.accentHex }
                          : undefined
                      }
                    >
                      <span
                        className='mt-0.5 text-xs font-mono shrink-0 opacity-40'
                        style={
                          isActive
                            ? { opacity: 1, color: activeCategory.accentHex }
                            : undefined
                        }
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className='leading-snug'>{lesson.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>
        </div>
      </main>
      {/* <Link
        href='/page/study-materials'
        className='block text-center border-2 border-slate-600 mb-12 text-sm text-slate-600 hover:text-slate-900 transition'
      >
        Read Full Slide →
      </Link> */}

      <div className='grid gap-5 md:grid-cols-2 mx-auto max-w-7xl px-4 md:px-8 mb-12'>
        {[
          {
            path: "/page/itil-exams",
            label: "Exam Mode",
            description: "Jump into the full or partial exam flow.",
            IconName: MdOutlineQuiz,
            accent: "from-[#2660A4] to-[#4F8FCA]",
          },
          {
            path: "/page/study-materials",
            label: "Study Material",
            description: "Browse supporting files and study references.",
            IconName: BiBook,
            accent: "from-[#26a465] to-[#39c682]",
          },
        ].map(({ path, label, description, IconName, accent }) => (
          <button
            type='button'
            key={label}
            onClick={() => handleNavigation(path)}
            className='group rounded-[28px] border border-slate-200 bg-white p-4 text-left shadow-lg shadow-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-2xl'
          >
            <div
              className={`rounded-[22px] bg-gradient-to-br ${accent} p-6 text-white`}
            >
              <div className='flex h-full min-h-[260px] flex-col justify-between gap-8 rounded-[18px] bg-slate-950/10 p-5 backdrop-blur-sm'>
                <div className='flex items-start justify-between gap-4'>
                  <div>
                    <p className='text-xs font-semibold uppercase tracking-[0.3em] text-white/80'>
                      Learning track
                    </p>
                    <h2 className='mt-3 text-3xl font-black leading-tight'>
                      {label}
                    </h2>
                  </div>
                  <span className='rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white'>
                    Open
                  </span>
                </div>

                <div className='space-y-4'>
                  <div className='flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/15'>
                    <IconName size={36} />
                  </div>
                  <p className='max-w-sm text-sm leading-6 text-white/90'>
                    {description}
                  </p>
                </div>

                <div className='flex items-center justify-between gap-3 text-sm font-semibold text-white/85'>
                  <span>Jump in now</span>
                  <span className='rounded-full border border-white/20 bg-white/10 px-4 py-2 transition group-hover:bg-white/20'>
                    Open
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <Footer />
    </div>
  );
}
