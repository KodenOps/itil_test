"use client";

import Footer from "@/app/components/Footer";
import React, { useEffect, useRef, useState } from "react";
import { BiBook } from "react-icons/bi";
import { MdOutlineQuiz, MdPlayArrow } from "react-icons/md";
import { useRouter } from "next/navigation";
import NavBar from "@/app/components/NavBar";
import Image from "next/image";
import Link from "next/link";
import thumbnailUrl from "../../../../public/images/thumbnail.avif";

// ─── Types ───────────────────────────────────────────────────────────────────

type TopicLesson = {
  id: string;
  title: string;
  body: string;
  takeaway: string;
  learningPlaylistUrl?: urlObject[];

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
  learningPlaylistUrl?: urlObject[];
};
type urlObject = {
  url: string;
  title: string;
};

let playlist = [
  {
    url: "https://www.youtube.com/playlist?list=PLp5yhJ4S9EutvHrkFlV1MQt72DvpT2oh2",
    title: "ITIL Strategist: Direct Plan and Improve  (Video Playlist)",
    thumbnailVideoId: "Jqb1MS97iQc",
  },
  {
    url: "https://www.youtube.com/playlist?list=PLgqNsTMvrR6Z-EQGL1KCTZNv4wsqtP3V3",
    title: "ITIL Strategist: Crash Course  (Video Playlist)",
    thumbnailVideoId: "leoHjnDQ7f0",
  },
  {
    url: "https://www.youtube.com/watch?v=K4YLDzY216U",
    title:
      "ITIL® 4 DPI Exam Prep: Sample Questions and Rationale Explained  (Video)",
    thumbnailVideoId: "K4YLDzY216U",
  },
];

// ─── Data ────────────────────────────────────────────────────────────────────

const categories: Category[] = [
  // ───────────────────────── 1. INTRODUCTION ─────────────────────────
  {
    id: "introduction",
    title: "Introduction to DPI",
    description:
      "Understand why direction, planning, and improvement matter, and where DPI fits in the ITIL Strategist stream and the Service Value System.",
    accent: "from-[#2660A4] to-[#3C8DAD]",
    accentHex: "#2660A4",
    lessons: [
      {
        id: "dpi-purpose",
        learningPlaylistUrl: [
          {
            url: "https://www.youtube.com/playlist?list=PLp5yhJ4S9EutvHrkFlV1MQt72DvpT2oh2",
            title: "ITIL Strategist: Direct Plan and Improve  (Video Playlist)",
          },
          {
            url: "https://www.youtube.com/playlist?list=PLgqNsTMvrR6Z-EQGL1KCTZNv4wsqtP3V3",
            title: "ITIL Strategist: Crash Course  (Video Playlist)",
          },
          {
            url: "https://www.youtube.com/watch?v=K4YLDzY216U",
            title:
              "ITIL® 4 DPI Exam Prep: Sample Questions and Rationale Explained  (Video)",
          },
        ],
        title: "Purpose and Scope of Direct, Plan and Improve",
        body: "Direct, Plan and Improve (DPI) explains how to create a 'learning, improving, and telling' organization that is agile, resilient, and aligned with its strategy. It moves beyond running services to steering the whole organization: setting direction, turning that direction into plans, and improving continually at every level.\n\nDPI is aimed at leaders and managers who need to integrate ITIL with wider business strategy, governance, and ways of working. It shows how IT and digital services are directed and improved as part of the organization as a whole, not as an isolated function.",
        takeaway:
          "DPI is about steering the whole organization: setting direction, turning it into plans, and improving continually.",
        visual: "checklist",
        visualData: [
          "Direct – establish vision, strategy, policies, and governance",
          "Plan – translate direction into strategic, tactical, and operational plans",
          "Improve – embed continual improvement across every level",
          "Align IT and digital work with overall organizational objectives",
          "Build agility and resilience into the way the organization works",
        ],
      },
      {
        id: "dpi-in-svs",
        title: "DPI and the Service Value System",
        body: "Every part of the ITIL Service Value System (SVS) is touched by direction, planning, and improvement. The guiding principles shape decisions, governance sets the direction and oversight, the service value chain provides the Plan and Improve activities, practices supply the capabilities, and continual improvement keeps the whole system evolving.\n\nDPI treats the SVS as something to be directed and tuned deliberately. Leaders decide what opportunities and demand the organization will pursue, how they are governed, and how the results are measured and improved.",
        takeaway:
          "The SVS is the system being directed, planned, and improved. Each of its components plays a role in DPI.",
        visual: "diagram-cycle",
        visualData: [
          "Opportunity / Demand",
          "Direct (governance)",
          "Plan",
          "Deliver value",
          "Measure and report",
          "Improve",
        ],
      },
      {
        id: "learning-improving-telling",
        title: "Agility, Resilience and the Learning Organization",
        body: "Organizations succeed when they can adapt internally (agility) and absorb external disruption (resilience). Direction, planning, and improvement are the mechanisms that make both possible: clear direction avoids confusion, adaptive planning keeps the organization responsive, and continual improvement turns experience into learning.\n\nA 'learning and improving' organization treats feedback, failures, and successes as inputs. It makes information visible, encourages experimentation, and avoids blame, so that knowledge is shared rather than trapped in individuals or silos.",
        takeaway:
          "Direction gives clarity, planning gives adaptability, and improvement gives learning. Together they create agile, resilient organizations.",
      },
    ],
  },

  // ───────────────────────── 2. KEY CONCEPTS ─────────────────────────
  {
    id: "key-concepts",
    title: "Key Concepts of DPI",
    description:
      "Master the foundational terms: direction, governance, management, strategy, vision, mission, and how they connect.",
    accent: "from-[#1F8A70] to-[#2CB67D]",
    accentHex: "#1F8A70",
    lessons: [
      {
        id: "direction-defined",
        learningPlaylistUrl: [
          {
            url: "https://www.youtube.com/playlist?list=PLp5yhJ4S9EutvHrkFlV1MQt72DvpT2oh2",
            title: "ITIL Strategist: Direct Plan and Improve  (Video Playlist)",
          },
          {
            url: "https://www.youtube.com/playlist?list=PLgqNsTMvrR6Z-EQGL1KCTZNv4wsqtP3V3",
            title: "ITIL Strategist: Crash Course  (Video Playlist)",
          },
          {
            url: "https://www.youtube.com/watch?v=K4YLDzY216U",
            title:
              "ITIL® 4 DPI Exam Prep: Sample Questions and Rationale Explained  (Video)",
          },
        ],
        title: "Direction: Vision, Mission and Objectives",
        body: "Direction gives an organization a sense of purpose and a clear line of sight from everyday work to overall goals. It is expressed through the vision (an aspirational description of what the organization wants to become), the mission (its purpose and what it does, and for whom), and objectives (specific, measurable results that show progress toward the vision).\n\nDirection needs to be understood by everyone. If people cannot connect their work to the vision and objectives, they will optimize locally and may work against one another without realizing it.",
        takeaway:
          "Vision says where we are heading, mission says why we exist, objectives say how we will know we are making progress.",
        visual: "table",
        visualData: [
          ["Element", "Answers the question", "Characteristics"],
          [
            "Vision",
            "What do we want to become?",
            "Aspirational, long-term, inspiring",
          ],
          [
            "Mission",
            "Why do we exist and for whom?",
            "Purpose-focused, stable, clear",
          ],
          [
            "Objectives",
            "What results will show progress?",
            "Specific, measurable, time-bound",
          ],
          [
            "Strategy",
            "How will we get there?",
            "Chosen approach, priorities, trade-offs",
          ],
        ],
      },
      {
        id: "governance-vs-management",
        title: "Governance and Management",
        body: "Governance is the means by which an organization is directed and controlled. The governing body is accountable at the highest level and carries out three activities: Evaluate (assess strategy, portfolios, and relationships), Direct (assign responsibility and set policies), and Monitor (check performance and conformance).\n\nManagement is about implementing what governance directs. It operates at three levels: strategic (setting objectives and allocating resources), tactical (coordinating and translating strategy into plans for teams and services), and operational (carrying out day-to-day work). Governance decides what should be done and why; management decides how, and does it.",
        takeaway:
          "Governance evaluates, directs, and monitors. Management implements at strategic, tactical, and operational levels.",
        visual: "diagram-layered",
        visualData: {
          "Governance (governing body)": [
            "evaluate",
            "direct",
            "monitor",
            "accountability",
          ],
          "Strategic management": [
            "objectives",
            "resource allocation",
            "portfolio direction",
          ],
          "Tactical management": [
            "coordination",
            "plans for services and teams",
            "policy application",
          ],
          "Operational management": [
            "day-to-day work",
            "task execution",
            "operational metrics",
          ],
        },
      },
      {
        id: "strategy-concepts",
        title: "Strategy and the Strategic Context",
        body: "A strategy is a description of the organization's chosen approach to achieve its objectives, including what it will and will not do. It is shaped by the organization's context: its markets, customers, competitors, regulators, technologies, and internal capabilities.\n\nStrategy is not a one-off document. It needs to be reviewed and adjusted as the context changes. Analysis techniques such as PESTLE (external factors) and SWOT (strengths, weaknesses, opportunities, threats) help leaders understand the situation before setting direction, and should be revisited regularly.",
        takeaway:
          "A strategy is a chosen approach shaped by context. Analyze the environment before setting direction, and review it regularly.",
      },
      {
        id: "plans-defined",
        title: "Plans and Planning Levels",
        body: "A plan describes how objectives will be achieved: what will be done, by whom, using which resources, and by when. Plans exist at three levels that must be aligned. Strategic plans set the long-term direction and major initiatives; tactical plans coordinate the work of teams, services, and products over a medium horizon; operational plans schedule and allocate day-to-day work.\n\nAligned plans allow the organization to trace activities upward to strategic goals and downward to concrete tasks. Misaligned plans cause duplication, gaps, and conflicting priorities.",
        takeaway:
          "Strategic, tactical, and operational plans must be aligned so every task traces back to a strategic objective.",
      },
      {
        id: "improvement-concept",
        title: "Improvement as an Organizational Discipline",
        body: "Improvement is a recurring activity at all levels of the organization, not a project with an end date. It applies to the SVS as a whole and to every product, service, practice, and relationship.\n\nImprovement requires direction (what outcomes matter), measurement (how we know things are better), and cultural support (people feel safe to suggest changes). Without all three, improvement becomes sporadic, reactive, or disconnected from strategy.",
        takeaway:
          "Improvement needs direction, measurement, and a supportive culture. It is continuous, not a one-off project.",
      },
    ],
  },

  // ───────────────────────── 3. GUIDING PRINCIPLES ─────────────────────────
  {
    id: "guiding-principles",
    title: "Guiding Principles for DPI",
    description:
      "Apply the seven ITIL guiding principles to directing, planning, and improving with confidence.",
    accent: "from-[#7A4DFF] to-[#4F7CFF]",
    accentHex: "#7A4DFF",
    lessons: [
      {
        id: "principles-overview",
        learningPlaylistUrl: [
          {
            url: "https://www.youtube.com/playlist?list=PLp5yhJ4S9EutvHrkFlV1MQt72DvpT2oh2",
            title: "ITIL Strategist: Direct Plan and Improve  (Video Playlist)",
          },
          {
            url: "https://www.youtube.com/playlist?list=PLgqNsTMvrR6Z-EQGL1KCTZNv4wsqtP3V3",
            title: "ITIL Strategist: Crash Course  (Video Playlist)",
          },
          {
            url: "https://www.youtube.com/watch?v=K4YLDzY216U",
            title:
              "ITIL® 4 DPI Exam Prep: Sample Questions and Rationale Explained  (Video)",
          },
        ],
        title: "Applying the Guiding Principles",
        body: "The guiding principles are universal recommendations that guide decisions in all circumstances, whatever the organization's goals, strategy, or structure. In DPI they are the lens through which direction is set, plans are built, and improvements are chosen.\n\nThey work together rather than in isolation. Applying just one of them rigidly usually causes problems. For example, 'keep it simple' applied without 'think and work holistically' may remove something essential, while 'progress iteratively' without 'focus on value' can produce lots of small changes that deliver nothing meaningful.",
        takeaway:
          "The principles support one another. Use them together, and adapt how strongly each is applied to the situation.",
        visual: "table",
        visualData: [
          ["Principle", "Applying it to DPI"],
          [
            "Focus on value",
            "Link vision, plans, and improvements to stakeholder value",
          ],
          [
            "Start where you are",
            "Assess current state and reuse what already works",
          ],
          [
            "Progress iteratively with feedback",
            "Deliver plans and improvements in small, testable steps",
          ],
          [
            "Collaborate and promote visibility",
            "Involve stakeholders and make direction and progress visible",
          ],
          [
            "Think and work holistically",
            "Consider all four dimensions and the whole SVS",
          ],
          [
            "Keep it simple and practical",
            "Use the minimum number of steps, metrics, and rules",
          ],
          [
            "Optimize and automate",
            "Simplify first, then automate where it adds value",
          ],
        ],
      },
      {
        id: "focus-value-start-where",
        title: "Focus on Value and Start Where You Are",
        body: "Focus on value means everything the organization does should link, directly or indirectly, to value for itself, its customers, and other stakeholders. When directing, this means starting from who the stakeholders are and what they value. When planning, it means prioritizing work by the value it enables. When improving, it means asking what difference a change makes to outcomes.\n\nStart where you are means not throwing away existing services, methods, and skills without first understanding them. Use direct observation and measurement to assess the current state objectively. Do not assume; look at what is really happening, and reuse whatever is already effective.",
        takeaway:
          "Anchor decisions in stakeholder value, and base change on an honest, evidence-based view of the current state.",
      },
      {
        id: "iterate-collaborate",
        title: "Progress Iteratively and Collaborate",
        body: "Progress iteratively with feedback means splitting large initiatives into manageable pieces that can be delivered, tested, and adjusted. Each iteration produces feedback that improves the next, reducing the risk of a large plan failing late. Use timeboxing and prioritization to keep initiatives moving.\n\nCollaborate and promote visibility recognizes that improvement and change touch many people. Working across boundaries produces buy-in, better ideas, and fewer surprises. Stakeholders need timely, honest information; hiding problems or progress erodes trust. Decide who should be involved, and at what point, rather than involving everyone in everything.",
        takeaway:
          "Deliver in small feedback-driven steps, and involve the right people with transparent communication.",
      },
      {
        id: "holistic-simple-optimize",
        title: "Think Holistically, Keep It Simple, Optimize and Automate",
        body: "Think and work holistically means no service, practice, or improvement stands alone. Results are delivered through interconnected parts, so leaders should consider all four dimensions (organizations and people, information and technology, partners and suppliers, value streams and processes) and the effects of a change on the wider system.\n\nKeep it simple and practical means using the minimum number of steps needed to achieve an objective, and avoiding rules, metrics, and reports that add cost without adding value. Optimize and automate means improving the current state before automating it: automating a poor process only makes it fail faster. Human intervention should be reserved for where it adds the most value.",
        takeaway:
          "See the whole system, remove unnecessary complexity, and optimize before you automate.",
      },
    ],
  },

  // ───────────────────────── 4. DIRECT ─────────────────────────
  {
    id: "direct",
    title: "Direct",
    description:
      "Learn how to set and communicate direction, establish governance and policy, and integrate direction into everyday work.",
    accent: "from-[#6D2E46] to-[#9B4D57]",
    accentHex: "#6D2E46",
    lessons: [
      {
        id: "setting-direction",
        learningPlaylistUrl: [
          {
            url: "https://www.youtube.com/playlist?list=PLp5yhJ4S9EutvHrkFlV1MQt72DvpT2oh2",
            title: "ITIL Strategist: Direct Plan and Improve  (Video Playlist)",
          },
          {
            url: "https://www.youtube.com/playlist?list=PLgqNsTMvrR6Z-EQGL1KCTZNv4wsqtP3V3",
            title: "ITIL Strategist: Crash Course  (Video Playlist)",
          },
          {
            url: "https://www.youtube.com/watch?v=K4YLDzY216U",
            title:
              "ITIL® 4 DPI Exam Prep: Sample Questions and Rationale Explained  (Video)",
          },
        ],
        title: "Setting Direction and Strategy",
        body: "Setting direction starts with understanding the organization's context and stakeholders, then defining a vision, mission, objectives, and the strategy for achieving them. Good direction is clear enough to guide decisions and flexible enough to adjust as circumstances change.\n\nA useful strategy states priorities and trade-offs. It is broken down into manageable initiatives, with owners, resources, and measures of success. Direction should be tested against reality: do people understand it, can they act on it, and does it match what is actually possible with the organization's capabilities?",
        takeaway:
          "Good direction is clear, actionable, and tested against reality, with explicit priorities and trade-offs.",
        visual: "diagram-cycle",
        visualData: [
          "Understand context",
          "Identify stakeholders",
          "Define vision and mission",
          "Set objectives",
          "Choose strategy",
          "Communicate and cascade",
          "Review and adjust",
        ],
      },
      {
        id: "governance-in-practice",
        title: "Governance in Practice",
        body: "Governance provides accountability, oversight, and assurance. It ensures the organization complies with policies and external regulations, that risks are understood, and that resources are used to deliver value. Governance should be embedded into how the organization works, rather than treated as an external audit layer.\n\nEffective governance is proportionate. Too little oversight leads to unmanaged risk and loss of alignment; too much creates bureaucracy and slows delivery. Governance arrangements should be adapted to the organization's size, risk profile, and ways of working, including Agile and DevOps environments where governance may be automated and continuous.",
        takeaway:
          "Embed proportionate governance into the way work is done. Too little creates risk; too much creates friction.",
      },
      {
        id: "policies-and-controls",
        title: "Policies, Controls and Compliance",
        body: "Policies express the organization's rules and expectations: what must, should, or must not be done. Controls are the means of ensuring that policies are followed and that risks are managed. Compliance is the demonstration that an organization is meeting applicable policies, laws, and standards.\n\nPolicies should be written for the people who need to follow them, in simple language, with a clear owner and review cycle. Controls should be as automated and integrated as possible so that compliance becomes a by-product of working well, not an additional task performed after the fact.",
        takeaway:
          "Write simple, owned policies and build controls into the work so that compliance happens by default.",
      },
      {
        id: "communicating-direction",
        title: "Communicating Direction and Engaging Stakeholders",
        body: "Direction only creates alignment if it is understood. Communication should be planned: who needs to know what, in what form, through which channel, how often, and how feedback will be gathered. Leaders must be visible and consistent in their messages and behaviours, since actions communicate as loudly as words.\n\nStakeholder analysis helps identify who has influence over, and who is affected by, the direction being set. A power/interest grid is a common technique to decide whether to keep stakeholders informed, consulted, closely engaged, or simply monitored. Two-way communication is essential: the people doing the work often hold the information needed to make direction realistic.",
        takeaway:
          "Plan communication and make it two-way. Use stakeholder analysis to decide how closely to engage each group.",
        visual: "table",
        visualData: [
          ["Stakeholder position", "Typical approach"],
          [
            "High power, high interest",
            "Manage closely and involve in decisions",
          ],
          [
            "High power, low interest",
            "Keep satisfied with concise, relevant updates",
          ],
          [
            "Low power, high interest",
            "Keep informed and use as a source of feedback",
          ],
          ["Low power, low interest", "Monitor and communicate lightly"],
        ],
      },
    ],
  },

  // ───────────────────────── 5. PLAN ─────────────────────────
  {
    id: "plan",
    title: "Plan",
    description:
      "Turn direction into achievable strategic, tactical, and operational plans, using the right approach for each context.",
    accent: "from-[#0F766E] to-[#14B8A6]",
    accentHex: "#0F766E",
    lessons: [
      {
        id: "planning-fundamentals",
        learningPlaylistUrl: [
          {
            url: "https://www.youtube.com/playlist?list=PLp5yhJ4S9EutvHrkFlV1MQt72DvpT2oh2",
            title: "ITIL Strategist: Direct Plan and Improve  (Video Playlist)",
          },
          {
            url: "https://www.youtube.com/playlist?list=PLgqNsTMvrR6Z-EQGL1KCTZNv4wsqtP3V3",
            title: "ITIL Strategist: Crash Course  (Video Playlist)",
          },
          {
            url: "https://www.youtube.com/watch?v=K4YLDzY216U",
            title:
              "ITIL® 4 DPI Exam Prep: Sample Questions and Rationale Explained  (Video)",
          },
        ],
        title: "Planning Fundamentals",
        body: "Planning converts direction into a set of actions that can be resourced, scheduled, and measured. Good planning considers objectives, scope, dependencies, constraints, resources, risks, and how progress will be measured. It should involve the people responsible for delivering the plan, since they know what is feasible.\n\nPlans are hypotheses about the future. They should be revisited as new information arrives. The value of planning is as much in the conversation and shared understanding it creates as in the plan document itself.",
        takeaway:
          "Plans are hypotheses to be tested and adjusted. Involve delivery teams and revisit them as conditions change.",
      },
      {
        id: "planning-levels",
        title: "Strategic, Tactical and Operational Planning",
        body: "Strategic planning defines where the organization is going over a longer horizon and identifies the major initiatives, investments, and capabilities needed. Tactical planning translates these into coordinated plans for services, products, teams, and projects. Operational planning schedules the detailed day-to-day work of teams.\n\nThe levels should inform one another. Strategic plans set boundaries and priorities; tactical plans show what is realistic; operational feedback shows what is really happening. In the service value chain, all of this is supported by the Plan activity, which ensures a shared understanding of the vision, current status, and improvement direction across all four dimensions and all products and services.",
        takeaway:
          "Plans at all three levels inform each other. The Plan value chain activity provides the shared understanding.",
        visual: "diagram-layered",
        visualData: {
          "Strategic plans": [
            "long-term horizon",
            "major initiatives",
            "investment and capability decisions",
          ],
          "Tactical plans": [
            "medium-term horizon",
            "services, products, and projects",
            "coordination across teams",
          ],
          "Operational plans": [
            "short-term horizon",
            "task scheduling",
            "day-to-day allocation",
          ],
        },
      },
      {
        id: "planning-approaches",
        title: "Choosing a Planning Approach",
        body: "No single planning approach suits every context. Traditional, sequential planning works well when requirements are stable, risks are well understood, and change is costly. Agile and iterative approaches suit uncertain environments where learning and quick feedback matter. Many organizations use a hybrid, applying different methods to different parts of the work.\n\nThe approach should match the nature of the work, the level of uncertainty, and the organization's culture. What matters is that plans remain aligned with direction, visible to stakeholders, and able to adapt when priorities change.",
        takeaway:
          "Match the planning approach to uncertainty and context. Hybrid approaches are common and valid.",
        visual: "table",
        visualData: [
          ["Approach", "Best suited to", "Watch out for"],
          [
            "Sequential / waterfall",
            "Stable requirements, high cost of change",
            "Slow feedback; late discovery of problems",
          ],
          [
            "Iterative / Agile",
            "Uncertain or evolving needs",
            "Loss of long-term alignment if direction is unclear",
          ],
          [
            "Hybrid",
            "Mixed portfolios of work",
            "Inconsistent practices and reporting across teams",
          ],
        ],
      },
      {
        id: "portfolio-prioritization",
        title: "Prioritization, Portfolios and Resources",
        body: "Organizations always have more ideas than capacity. Prioritization decides what gets done first, based on value, risk, cost, strategic fit, and dependencies. Clear criteria applied transparently reduce politics and help stakeholders accept trade-offs.\n\nManaging work as a portfolio provides a consolidated view of initiatives, products, and services, so leaders can balance investment across them, stop work that no longer fits, and ensure resources are available. Constraints such as budget, skills, and time should be visible and considered when plans are set, not discovered afterwards.",
        takeaway:
          "Use explicit, transparent criteria to prioritize, and manage initiatives as a portfolio against real resource constraints.",
      },
      {
        id: "business-case",
        title: "Business Cases and Justification",
        body: "A business case justifies an investment or change by comparing costs, benefits, risks, and options. It should describe the problem or opportunity, the options considered (including doing nothing), expected costs and benefits, risks and assumptions, and the recommendation.\n\nBenefits may be financial or non-financial (for example, improved customer experience or reduced risk), and both should be stated in terms of outcomes that stakeholders value. A business case is a living document: it should be revisited as circumstances change and used to check that expected benefits are actually being realized.",
        takeaway:
          "A business case compares options, costs, benefits, and risks. Keep it alive and check that benefits are realized.",
        visual: "checklist",
        visualData: [
          "Problem or opportunity and its link to strategy",
          "Options considered, including doing nothing",
          "Costs, benefits, and expected outcomes",
          "Risks, assumptions, and dependencies",
          "Recommendation and next steps",
          "How benefits will be measured and reviewed",
        ],
      },
    ],
  },

  // ───────────────────────── 6. IMPROVE ─────────────────────────
  {
    id: "improve",
    title: "Improve",
    description:
      "Use the continual improvement model and practice to build an improvement culture, prioritize opportunities, and sustain results.",
    accent: "from-[#F97316] to-[#F59E0B]",
    accentHex: "#F97316",
    lessons: [
      {
        id: "ci-model",
        learningPlaylistUrl: [
          {
            url: "https://www.youtube.com/playlist?list=PLp5yhJ4S9EutvHrkFlV1MQt72DvpT2oh2",
            title: "ITIL Strategist: Direct Plan and Improve  (Video Playlist)",
          },
          {
            url: "https://www.youtube.com/playlist?list=PLgqNsTMvrR6Z-EQGL1KCTZNv4wsqtP3V3",
            title: "ITIL Strategist: Crash Course  (Video Playlist)",
          },
          {
            url: "https://www.youtube.com/watch?v=K4YLDzY216U",
            title:
              "ITIL® 4 DPI Exam Prep: Sample Questions and Rationale Explained  (Video)",
          },
        ],
        title: "The Continual Improvement Model",
        body: "The continual improvement model provides a structured approach to improvement initiatives. It begins with the vision, which keeps improvement aligned with organizational direction. Assessing the current state gives a baseline. Defining the target state sets measurable goals. Planning how to get there identifies the steps and resources. Taking action carries out the work. Evaluating results checks whether the target was reached. Finally, sustaining momentum embeds the change and feeds the next round.\n\nThe model is not strictly linear. Steps can be repeated or iterated, and it can be applied using Agile or waterfall approaches. Each step should be adapted to the size and nature of the improvement.",
        takeaway:
          "The model starts with the vision and ends with sustaining momentum. It is iterative, not a one-way sequence.",
        visual: "diagram-cycle",
        visualData: [
          "What is the vision?",
          "Where are we now?",
          "Where do we want to be?",
          "How do we get there?",
          "Take action",
          "Did we get there?",
          "How do we keep the momentum going?",
        ],
      },
      {
        id: "ci-practice",
        title: "The Continual Improvement Practice",
        body: "The purpose of the continual improvement practice is to align the organization's practices and services with changing business needs through the ongoing identification and improvement of services, service components, practices, or any element involved in the management of products and services.\n\nThe practice encourages improvement across the organization, secures time and budget for it, identifies and logs opportunities, assesses and prioritizes them, makes business cases where needed, plans and implements improvements, measures and evaluates outcomes, and coordinates activities across the organization. Improvements can be large or small; both matter.",
        takeaway:
          "The practice makes improvement systematic: it finds, prioritizes, funds, delivers, and measures improvement everywhere.",
        visual: "checklist",
        visualData: [
          "Encourage continual improvement across the organization",
          "Secure time and budget for improvement",
          "Identify and log improvement opportunities",
          "Assess and prioritize improvement opportunities",
          "Make business cases for improvement action",
          "Plan and implement improvements",
          "Measure and evaluate improvement results",
          "Coordinate improvement activities across the organization",
        ],
      },
      {
        id: "improvement-register",
        title: "The Improvement Register and Prioritization",
        body: "A continual improvement register (CIR) is a database or structured document used to track and manage improvement ideas from identification through to completion. It provides visibility of all improvement opportunities, their owners, status, and expected benefits, and helps avoid duplicated effort.\n\nBecause resources are limited, opportunities are prioritized using criteria such as value, effort, risk, urgency, and alignment with strategy. Small quick wins can build momentum and credibility, while larger initiatives may need a business case and formal sponsorship. Everyone in the organization should be able to submit ideas.",
        takeaway:
          "Log every idea in a shared register, prioritize on value, effort, and risk, and mix quick wins with larger initiatives.",
      },
      {
        id: "assessment-maturity",
        title: "Assessments, Maturity and Benchmarking",
        body: "Assessment establishes where the organization is today. A capability or maturity assessment compares current practices against a defined model or standard, showing strengths and gaps. Benchmarking compares performance against other organizations or against internal targets and history, providing context for what 'good' looks like.\n\nAssessments should be used to support improvement, not for judgement or blame. Their results are only useful if they lead to action: gaps must be linked to improvement opportunities and tracked through the improvement register. Audits differ from assessments in that they check conformance against defined requirements, usually by an independent party.",
        takeaway:
          "Assess to find gaps and inform improvement, not to blame. Benchmarks give context; audits check conformance.",
      },
      {
        id: "improvement-culture",
        title: "Building an Improvement Culture",
        body: "Improvement succeeds when people feel it is part of everyone's job. Leaders set the tone by visibly supporting improvement, providing time and resources, recognizing contributions, and treating failure as a source of learning. Improvement should be integrated with normal work rather than treated as an extra task.\n\nLean, Agile, and DevOps ways of working reinforce this culture by emphasizing waste reduction, short feedback loops, collaboration, and experimentation. Continual improvement should be visible in team routines, such as retrospectives and regular reviews, so that lessons are captured and acted on.",
        takeaway:
          "Leaders enable improvement culture by providing time, safety, and recognition, and by building it into everyday routines.",
      },
    ],
  },

  // ───────────────────────── 7. SUPPORTING PRACTICES ─────────────────────────
  {
    id: "supporting-practices",
    title: "Measurement, Risk and Change",
    description:
      "Explore the practices that make direction and improvement reliable: measurement and reporting, risk management, and organizational change management.",
    accent: "from-[#B91C1C] to-[#EF4444]",
    accentHex: "#B91C1C",
    lessons: [
      {
        id: "measurement-reporting",
        learningPlaylistUrl: [
          {
            url: "https://www.youtube.com/playlist?list=PLp5yhJ4S9EutvHrkFlV1MQt72DvpT2oh2",
            title: "ITIL Strategist: Direct Plan and Improve  (Video Playlist)",
          },
          {
            url: "https://www.youtube.com/playlist?list=PLgqNsTMvrR6Z-EQGL1KCTZNv4wsqtP3V3",
            title: "ITIL Strategist: Crash Course  (Video Playlist)",
          },
          {
            url: "https://www.youtube.com/watch?v=K4YLDzY216U",
            title:
              "ITIL® 4 DPI Exam Prep: Sample Questions and Rationale Explained  (Video)",
          },
        ],
        title: "Measurement and Reporting",
        body: "The purpose of measurement and reporting is to support good decision-making and continual improvement by decreasing levels of uncertainty. This is achieved through the collection of relevant data on various managed objects and the valid assessment of this data in an appropriate context.\n\nMeasurements should start from objectives, not from what is easy to measure. Critical success factors (CSFs) describe what must happen for objectives to be achieved; key performance indicators (KPIs) are the metrics used to evaluate progress against CSFs. Metrics and reports should be aligned to strategic, tactical, and operational levels, with the right level of detail for each audience.",
        takeaway:
          "Measure to reduce uncertainty and support decisions. Start from objectives, then define CSFs and KPIs for each level.",
        visual: "table",
        visualData: [
          ["Level", "Focus", "Typical audience"],
          [
            "Strategic",
            "Outcomes and progress toward objectives",
            "Governing body, executives",
          ],
          [
            "Tactical",
            "Service, product, and practice performance",
            "Managers and coordinators",
          ],
          [
            "Operational",
            "Activity and component-level performance",
            "Teams and specialists",
          ],
        ],
      },
      {
        id: "good-metrics",
        title: "Designing Good Metrics",
        body: "Poor metrics drive poor behaviour. Metrics should reflect outcomes that stakeholders value, not just outputs or activity. They should be understandable, reliable, and relevant to a decision. Too many metrics create noise; too few leave blind spots. Where possible, combine measures so that improving one does not silently damage another.\n\nLeading indicators give early warning about future results, while lagging indicators show what has already happened. A balanced set of both, viewed across perspectives such as financial, customer, internal process, and learning and growth (as in the balanced scorecard), gives a fuller picture than any single measure. Reports should tell a story that leads to action, not simply present numbers.",
        takeaway:
          "Use a balanced set of meaningful leading and lagging indicators. Report in a way that leads to decisions.",
        visual: "checklist",
        visualData: [
          "Linked to a clear objective or CSF",
          "Reflects an outcome that stakeholders value",
          "Understandable and trusted by its audience",
          "Owned, with a defined data source and frequency",
          "Balanced with other measures to avoid perverse behaviour",
          "Reviewed regularly and retired when no longer useful",
        ],
      },
      {
        id: "risk-management",
        title: "Risk Management",
        body: "The purpose of risk management is to ensure that the organization understands and effectively handles risks. Risk is a possible event that could cause harm or loss, or make it more difficult to achieve objectives. It can also refer to a possible event that could have a positive effect, an opportunity. Managing risk is essential to creating and protecting value.\n\nRisk management involves identifying risks, analysing and evaluating them (typically by likelihood and impact), deciding how to treat them, and monitoring and reviewing them. Common treatment options are to avoid the risk, mitigate it, share or transfer it, or accept it. Risks are recorded in a risk register with owners and actions. The organization's risk appetite and tolerance guide how much risk it is willing to take.",
        takeaway:
          "Identify, analyse, evaluate, treat, and monitor risks against the organization's appetite. Record them in a risk register with owners.",
        visual: "diagram-cycle",
        visualData: [
          "Identify risks",
          "Analyse likelihood and impact",
          "Evaluate against appetite",
          "Choose treatment",
          "Implement controls",
          "Monitor and review",
        ],
      },
      {
        id: "organizational-change-management",
        title: "Organizational Change Management",
        body: "The purpose of organizational change management is to ensure that changes are smoothly and successfully implemented, and that lasting benefits are achieved by focusing on the human aspects of change. Even excellent plans fail if people do not understand, accept, or adopt the change.\n\nThis differs from change enablement, which controls the technical and operational risks of individual changes to services. Organizational change management addresses how people are affected: it identifies the need for change, builds a case and coalition, communicates a compelling vision, engages and equips people, removes obstacles, celebrates early wins, and embeds the change in culture. Structured approaches such as Kotter's eight-step model can be used to guide this work.",
        takeaway:
          "Organizational change management focuses on people. Change enablement manages the risk of individual changes. Both are needed.",
        visual: "table",
        visualData: [
          ["", "Organizational change management", "Change enablement"],
          [
            "Focus",
            "People, behaviour, and culture",
            "Risk of changes to services and products",
          ],
          [
            "Scope",
            "Transformations and organizational shifts",
            "Individual changes to any service or CI",
          ],
          [
            "Goal",
            "Lasting adoption and benefit",
            "Maximize successful changes",
          ],
        ],
      },
      {
        id: "dpi-success-factors",
        title: "Bringing It Together: Success Factors for DPI",
        body: "Effective DPI relies on a small number of consistent habits. Direction is clear, communicated, and connected to measurable objectives. Plans at every level are aligned, visible, and adjusted as feedback arrives. Improvement is built into everyday work and guided by the continual improvement model. Metrics reflect real outcomes, risks are understood, and people are supported through change.\n\nCommon failure points include unclear direction, plans that are disconnected from strategy, improvement treated as a project rather than a discipline, metrics that reward the wrong behaviour, and ignoring the human side of change. Recognizing these patterns helps leaders diagnose problems early.",
        takeaway:
          "Clear direction, aligned plans, embedded improvement, meaningful metrics, and managed change are the pillars of effective DPI.",
        visual: "checklist",
        visualData: [
          "Vision, objectives, and strategy are understood by everyone",
          "Governance is proportionate and embedded in the work",
          "Strategic, tactical, and operational plans are aligned",
          "Improvement is continuous and logged in a shared register",
          "Metrics reflect outcomes and drive the right behaviour",
          "Risks are managed and people are supported through change",
        ],
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
            {header.map((h, i) => (
              <th
                key={`${h}-${i}`}
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
              ITIL Strategist: DPI
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

      {/* playlist */}
      <div className='border-t border-slate-200 pt-10 pb-16 w-full mx-auto max-w-7xl  md:px-8'>
        <p className='text-xs font-bold uppercase tracking-widest text-slate-400 mb-4'>
          Learn More: Playlists
        </p>
        <div className='flex flex-wrap justify-start gap-3 mx-10'>
          {playlist.map((item, i) => {
            const videoId =
              item.thumbnailVideoId ??
              item.url.match(/[?&]v=([^&]+)/)?.[1] ??
              item.url.match(/\/([A-Za-z0-9_-]{11})(?:[?&]|$)/)?.[1] ??
              "K4YLDzY216U";

            return (
              <Link
                className='relative mb-4 block overflow-hidden rounded-2xl border border-slate-200 w-80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg'
                href={item.url}
                target='_blank'
                rel='noreferrer'
                key={`${item.title}-${i}`}
              >
                <Image
                  src={`https://img.youtube.com/vi/${videoId}/0.jpg`}
                  alt={item.title}
                  width={320}
                  height={180}
                  className='h-52 w-full object-cover '
                />
                <div className=' flex flex-col items-center justify-center  p-4 text-center text-black'>
                  <p className='text-lg font-bold leading-snug'>{item.title}</p>
                </div>
              </Link>
            );
          })}
          <div className='border-t border-slate-200 pt-10 pb-16 w-full '>
            <p className='text-xs font-bold uppercase tracking-widest text-slate-400 mb-4'>
              Practice With Exam Dumps
            </p>
            <div className=''>
              {[
                {
                  path: "/page/exams",
                  label: "Exam Mode",
                  description: "Jump into the full or partial exam flow.",
                  IconName: MdOutlineQuiz,
                  accent: "from-[#2660A4] to-[#4F8FCA]",
                },
                // {
                //   path: "/page/study-materials",
                //   label: "Study Material",
                //   description: "Browse supporting files and study references.",
                //   IconName: BiBook,
                //   accent: "from-[#26a465] to-[#39c682]",
                // },
              ].map(({ path, label, description, IconName, accent }) => (
                <button
                  type='button'
                  key={label}
                  onClick={() => handleNavigation(path)}
                  className='group rounded-[28px] border border-slate-200 bg-white md:p-4 text-left shadow-lg shadow-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-2xl'
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
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
