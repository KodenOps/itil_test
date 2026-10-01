// ITIL 4 Strategist: Direct, Plan and Improve (DPI) question bank
// Source: PeopleCert Sample Paper 2 (question booklet, v4.2).
// NOTE: Sample Paper 2 ships WITHOUT an answer key. Answers below were derived
// from the DPI syllabus and from the rationales in Sample Paper 1. Items marked
// "VERIFY" are the ones with the lowest confidence; check them against an
// official key before publishing.

export const itilDpiQuestions = [
  {
    id: "dpi-sp2-01",
    question: "Which statement about value streams and practices is CORRECT?",
    options: [
      "Each practice may include several value streams",
      "Each value stream may be supported by multiple practices",
      "Each practice contributes to a single value stream",
      "Every value stream contributes to multiple practices",
    ],
    answer: "Each value stream may be supported by multiple practices",
    ShortExplanation:
      "As a value stream is implemented, several practices contribute to it, either through its activities or by providing information for decisions.",
  },
  {
    id: "dpi-sp2-02",
    question:
      "An organization is looking for a way to optimize decision-making in order to increase performance and keep risks under control. Which solution would support these objectives?",
    options: [
      "Ensure that all decisions are made by a small group of high-ranking authorities",
      "Delegate as much management decision-making as possible",
      "Delegate governance decision-making to the operational teams",
      "Ensure a higher level of structure for low-risk decision-making",
    ],
    answer: "Delegate as much management decision-making as possible",
    ShortExplanation:
      "Governance decisions stay at the top, but most decisions should be made closer to the work. Delegate as much authority as possible, weighing risk, so long as required outcomes are consistently produced.",
  },
  {
    id: "dpi-sp2-03",
    question:
      "An organization has a vision to become the manufacturer which sells the most number of cars globally. The organization is considering many improvements and wants to prioritize the improvement outcomes. Which improvement initiative should be given the HIGHEST priority?",
    options: [
      "A low-cost, low-effort investment to upgrade an internal HR system, which will result in improved efficiency in the HR department",
      "A high-cost, medium-effort investment to improve the data structure relating to sales patterns, which will result in a 5% reduction in the cost of sales",
      "A medium-cost, high-effort investment to improve the training available to front-line staff, which will result in a 5% improvement in the number of cars sold",
      "A medium-cost, low-effort investment to improve the user interface in the online sales service, which will result in a 5% improvement in the number of cars sold",
    ],
    answer:
      "A medium-cost, low-effort investment to improve the user interface in the online sales service, which will result in a 5% improvement in the number of cars sold",
    ShortExplanation:
      "Improvement outcomes are prioritized first by how much they move the organization toward its vision (more cars sold), then by cost and effort. Option D delivers the same vision benefit as C with less effort.",
  },
  {
    id: "dpi-sp2-04",
    question:
      "What are the two costs that every service relationship must consider?",
    options: [
      "The cost of providing the service and the cost of improving the service",
      "The cost introduced by the service and the cost removed by the service",
      "The cost of creating the service and the cost charged for the service",
      "The cost of applications and the cost of infrastructure",
    ],
    answer:
      "The cost introduced by the service and the cost removed by the service",
    ShortExplanation:
      "Every service relationship must weigh the costs the service removes from the consumer against the costs it imposes.",
  },
  {
    id: "dpi-sp2-05",
    question:
      "An organization works in a highly regulated industry. A new regulation has been introduced that requires additional information to be recorded about users each time the service desk logs an incident in the service logging tool. They want to put controls in place to ensure that the regulation is followed. Which is the BEST approach?",
    options: [
      "Update the logging tool to ensure that the minimum data required by the regulation is always recorded and report on any deviations",
      "Ensure that the service desk staff are aware of the new regulation and continue to use existing reports of service desk activity",
      "Update the logging tool to ensure that all fields must be completed for every incident record and produce daily reports of all service desk activity",
      "Ensure that the service desk staff are aware of the new regulation and let them decide what data to record and produce reports when requested",
    ],
    answer:
      "Update the logging tool to ensure that the minimum data required by the regulation is always recorded and report on any deviations",
    ShortExplanation:
      "Build the control into the technology, limit it to what the regulation requires, and measure only what is useful. Mandatory-everything controls are excessive and encourage placeholder data.",
  },
  {
    id: "dpi-sp2-06",
    question:
      "An organization's leadership team is working hard to develop a culture of continual improvement. The leaders want to encourage behaviours that support and enable successful and timely improvement initiatives. Which behaviour should NOT be encouraged by the leaders?",
    options: [
      "Risk-taking",
      "Celebrating successes",
      "Fast feedback",
      "Perfectionism",
    ],
    answer: "Perfectionism",
    ShortExplanation:
      "Perfectionism slows improvement and discourages experimentation. Risk-taking, celebrating success, and fast feedback all support a continual improvement culture.",
  },
  {
    id: "dpi-sp2-07",
    question:
      "An organization has received many complaints from users and customers of poor service from the service desk. They are creating a business case for replacing the service desk tool. The new tool will address some of the issues, however there is resistance to the expense of replacing the existing tool. What is MOST important for the business case to focus on?",
    options: [
      "How the tool will improve customer and user outcomes and reasons why these might not be achieved",
      "How the system will be easier to use for service desk staff and therefore improve their morale",
      "How the new system will require additional staff to maintain and therefore reduce the return on investment",
      "How the price of the tool might increase and exceed budget if a decision is not made quickly",
    ],
    answer:
      "How the tool will improve customer and user outcomes and reasons why these might not be achieved",
    ShortExplanation:
      "A business case should identify the benefits and risks from demand to value, so it justifies the investment in terms of stakeholder outcomes and honest risks.",
  },
  {
    // VERIFY: Q8 and Q12 test two different communication principles; B vs D is a judgement call.
    id: "dpi-sp2-08",
    question:
      "An organizational change has resulted in many employees being unhappy with their changed roles. The project team had a party to celebrate the success of the change, and this caused the employees to be even more unhappy. Which communication principle should have been followed to avoid this happening?",
    options: [
      "Timing and frequency matter",
      "We are all communicating all the time",
      "There is no single method of communication that works for everyone",
      "The message is in the medium",
    ],
    answer: "We are all communicating all the time",
    ShortExplanation:
      "Actions communicate as much as words. The party sent an unintended message that management was ignoring how employees felt about the change.",
  },
  {
    // VERIFY: B (work item age) vs A (throughput) is the closest call.
    id: "dpi-sp2-09",
    question:
      "Six months ago a service provider developed and implemented a new value stream to resolve problems that were causing incidents. Initially metrics showed that problems were being resolved quickly. However, recently there have been complaints that problems have taken too long to resolve. The organization wants to evaluate and improve the value stream. Which is the BEST approach to optimize the workflow through the value stream?",
    options: [
      "Use throughput metrics to identify where bottlenecks cause delays in the value stream",
      "Use metrics to measure 'work item age' to identify the steps in the value stream that are causing delays",
      "Gather cycle time metrics to identify the steps in the value stream that use most resource",
      "Redesign the value stream by identifying the relevant steps, value chain activities and practices",
    ],
    answer:
      "Use metrics to measure 'work item age' to identify the steps in the value stream that are causing delays",
    ShortExplanation:
      "Work item age shows how long items have been in progress, so it exposes the stuck steps. Throughput counts completed items and cannot locate a bottleneck, and cycle time is not a resource measure.",
  },
  {
    id: "dpi-sp2-10",
    question:
      "What helps people to understand the value of an initiative, and reduces their resistance?",
    options: [
      "Continual improvement",
      "Organizational change management",
      "Change enablement",
      "Measurement cascades",
    ],
    answer: "Organizational change management",
    ShortExplanation:
      "Organizational change management addresses the human side of change by building understanding, engagement, and acceptance, which reduces resistance.",
  },
  {
    id: "dpi-sp2-11",
    question:
      "A support team handles user queries on a daily basis. One of the metrics agreed for this activity is 'average number of queries processed by a team member per day'. Which type of measurement is this an example of?",
    options: ["Progress", "Effectiveness", "Compliance", "Productivity"],
    answer: "Productivity",
    ShortExplanation:
      "Output per person per unit of time is a productivity measure.",
  },
  {
    // VERIFY: A vs C is a judgement call.
    id: "dpi-sp2-12",
    question:
      "An organization is going through a major crisis. The crisis has created significant challenges for the organization and to cope it has introduced major changes to its operations. Marketing and promotional communications that were scheduled before the crisis are still being sent to internal and external recipients. These communications are now irrelevant because of the crisis. Which communications principle is MOST LIKELY being ignored by the organization?",
    options: [
      "Timing and frequency matter",
      "The message is in the medium",
      "We are all communicating all the time",
      "Communication is a two-way process",
    ],
    answer: "Timing and frequency matter",
    ShortExplanation:
      "Communications must be sent at the right time and adjusted when circumstances change. Messages scheduled before the crisis are now badly timed and irrelevant.",
  },
  {
    id: "dpi-sp2-13",
    question:
      "An organization offers telephone support to users. It has recently introduced a self-service system for user support. At the same time, the organization introduced a policy which states that any incidents logged using the telephone will not be given a high priority. Some groups of users, such as business developers who travel, cannot access the self-service system, and have complained that they are not receiving good service. What is the BEST way to resolve this situation?",
    options: [
      "Ensure that that groups of users such as business developers are given extra training on how to use the new system",
      "Establish a governance, risk and compliance function to align the work of the service desk function with the organization's governing body",
      "Introduce policy exceptions for users who have roles which lead to difficulty in accessing systems",
      "Assign a high priority to all incidents logged by business developers, to ensure that they are not disadvantaged",
    ],
    answer:
      "Introduce policy exceptions for users who have roles which lead to difficulty in accessing systems",
    ShortExplanation:
      "Policies should state exceptions where needed. A targeted exception fixes the unintended disadvantage without abandoning the policy.",
  },
  {
    id: "dpi-sp2-14",
    question:
      "Which concept includes ensuring everyone knows what should be done and why?",
    options: ["Direction", "Methods", "Improvement", "Planning"],
    answer: "Direction",
    ShortExplanation:
      "Direction means leading or guiding, including setting and communicating the vision, purpose, objectives, and guiding principles.",
  },
  {
    id: "dpi-sp2-15",
    question:
      "An organization is creating a policy for logging and managing a wide variety of incidents. The organization operates in a highly regulated environment; it is essential that the policy is adhered to and that deviations are considered unacceptable. Which TWO are the BEST guidance to follow when creating the policy?\n1. Ensure that the policy is as flexible as possible to allow staff to make decisions freely.\n2. Ensure that the policy is as clear and concise as possible stating why it is necessary.\n3. Ensure that the consequences of non-compliance are clearly stated.\n4. Ensure that the process is automated in order to minimize the controls included in the policy.",
    options: ["1 and 2", "2 and 3", "3 and 4", "1 and 4"],
    answer: "2 and 3",
    ShortExplanation:
      "A mandatory policy should be clear, concise, explain why it is needed, and state the consequences of non-compliance. Flexibility is for guidelines, not policies.",
  },
  {
    id: "dpi-sp2-16",
    question:
      "An organization's leadership team is enthusiastic about a series of recent improvements and the many additional improvement initiatives currently underway. The employees are less enthusiastic and the leaders have noticed signs of stress and increased absence. Even workers who are known to be high-performers are being less productive. What is the MOST LIKELY reason for the changes in the employees' behaviour?",
    options: [
      "The lack of a continual improvement culture",
      "Failure to thoroughly plan each improvement",
      "Too many initiatives one after the other",
      "Failing to check progress using metrics",
    ],
    answer: "Too many initiatives one after the other",
    ShortExplanation:
      "A constant stream of initiatives causes change fatigue, shown by stress, absence, and falling productivity.",
  },
  {
    id: "dpi-sp2-17",
    question:
      "An organization is planning to introduce a major change to how incidents are reported and resolved. Users will be encouraged to log incidents on a self-service portal where possible and IT staff will be required to adopt new ways of logging and resolving incidents. Success of the initiative is critical to the organization, but resistance to change is anticipated. Which is the BEST approach to ensure success?",
    options: [
      "Train support staff in the new procedures and use the service desk to inform users of the change so that they can ask questions where necessary",
      "Use a mixture of email, social media, posters and meetings to communicate the changes to ensure as greatest coverage as possible",
      "Create a new social media page to communicate the change and encourage all staff to post comments about the new ways of working",
      "Select communication methods that are familiar to each stakeholder group and provide feedback channels that allow anonymity if preferred",
    ],
    answer:
      "Select communication methods that are familiar to each stakeholder group and provide feedback channels that allow anonymity if preferred",
    ShortExplanation:
      "Tailor communication to each stakeholder group and provide safe two-way feedback channels. Anonymity may be needed for people to be honest when resistance is expected.",
  },
  {
    id: "dpi-sp2-18",
    question:
      "An IT manager is planning improvements. They have identified four stakeholders and how they will be affected by the improvement. Which TWO stakeholder groups have high impact and high involvement?\n1. Customers: will see improved value from the services.\n2. IT director: will provide funding and will see significant efficiency improvements.\n3. Team members: will change how they work and contribute to design of updated processes.\n4. Other IT teams: may need to work with updated processes.",
    options: ["1 and 2", "2 and 3", "3 and 4", "1 and 4"],
    answer: "2 and 3",
    ShortExplanation:
      "The IT director (funding plus major benefit) and team members (changed ways of working plus design input) are both highly impacted and highly involved. Customers are impacted but not involved, and other IT teams have lower impact.",
  },
  {
    // VERIFY: SWOT vs customer satisfaction analysis.
    id: "dpi-sp2-19",
    question:
      "A service provider has a good reputation for delivering services to a fast changing market in which consumers find it easy to switch providers in response to social trends. The service provider wants to perform an assessment to identify how to improve its services and maintain their competitive position in the market. Which is the BEST assessment method for the service provider to use?",
    options: [
      "Customer and user satisfaction analysis",
      "SWOT analysis",
      "Maturity assessment",
      "SLA achievement analysis",
    ],
    answer: "SWOT analysis",
    ShortExplanation:
      "A SWOT analysis looks at internal strengths and weaknesses alongside external opportunities and threats, which suits a fast-changing, competitive market.",
  },
  {
    // VERIFY: D vs A.
    id: "dpi-sp2-20",
    question: "Which BEST describes the primary role of a governing body?",
    options: [
      "To establish and regularly review the goals cascade throughout the organization",
      "To develop and regularly review IT measurements and metrics",
      "To annually review and approve IT projects to maximize business value",
      "To establish and regularly review the effectiveness of risk management and internal controls",
    ],
    answer:
      "To establish and regularly review the effectiveness of risk management and internal controls",
    ShortExplanation:
      "The governing body is accountable at the highest level for performance and compliance, which includes overseeing risk management and internal controls. Cascading goals and defining metrics are management activities.",
  },
  {
    id: "dpi-sp2-21",
    question:
      "An organization has made some changes to its website. The organization has asked users for their opinions of the new design. What is this activity part of?",
    options: [
      "A business case",
      "A gap analysis",
      "An improvement review",
      "A lessons-learned analysis",
    ],
    answer: "An improvement review",
    ShortExplanation:
      "Gathering feedback after an improvement has been delivered checks whether it achieved the expected value, which is an improvement review.",
  },
  {
    id: "dpi-sp2-22",
    question:
      "An organization has a project to replace all of its desktop computers, using several support teams. Which is an example of a progress measurement for this project?",
    options: [
      "Number of desktop computers replaced without following an approved procedure",
      "Percentage of desktop computers replaced within the allocated task time",
      "Number of desktop computers replaced by each support team per month",
      "Percentage of desktop computers replaced and confirmed as being complete",
    ],
    answer:
      "Percentage of desktop computers replaced and confirmed as being complete",
    ShortExplanation:
      "Progress measures how much of the planned work is done against the total. The other options measure compliance, efficiency, or productivity.",
  },
  {
    // VERIFY: gap analysis vs maturity assessment.
    id: "dpi-sp2-23",
    question:
      "A service provider must demonstrate compliance to an international standard before a new service consumer will sign a contract with them. What method would be MOST helpful in this situation?",
    options: [
      "SWOT analysis",
      "SLA achievement analysis",
      "Gap analysis",
      "Maturity assessment",
    ],
    answer: "Gap analysis",
    ShortExplanation:
      "A gap analysis compares current practice with the requirements of the standard, showing what is already met and what still needs to be done.",
  },
  {
    id: "dpi-sp2-24",
    question:
      "An organization wants to improve their 'change enablement' practice. Which improvement activity BEST demonstrates the use of the guiding principle 'optimize and automate'?",
    options: [
      "Ensure that every change is reviewed by a customer representative",
      "Increase the frequency of meetings where changes are assessed",
      "Measure the percentage of changes that deliver the expected value",
      "Increase the number of standard changes that are available for use",
    ],
    answer:
      "Increase the number of standard changes that are available for use",
    ShortExplanation:
      "Standard changes are pre-authorized and can be automated, removing manual assessment effort so people can focus on higher-risk changes.",
  },
  {
    id: "dpi-sp2-25",
    question:
      "Project managers are constantly having to compete for and reallocate specialist staff. As a result, the specialists' priorities are constantly changing and they are frequently required to delay work on one task in order to complete a task that has been given a higher priority. How do these constantly changing priorities affect the organization's performance measures?",
    options: [
      "Increased throughput",
      "Reduced work item age",
      "Increased work in progress",
      "Reduced wait time",
    ],
    answer: "Increased work in progress",
    ShortExplanation:
      "Constantly switching tasks leaves many items started but unfinished, which raises work in progress and also lengthens wait time and work item age.",
  },
  {
    id: "dpi-sp2-26",
    question:
      "An organization has a suggested dress code for its employees. What is this an example of?",
    options: ["A policy", "A control", "A guideline", "A tactic"],
    answer: "A guideline",
    ShortExplanation:
      "Guidelines are recommendations that allow some discretion. Policies are mandatory and breaching them has consequences.",
  },
  {
    id: "dpi-sp2-27",
    question:
      "An organization uses several teams to develop and deploy new services. The new services are always received well by the consumers, but the organization thinks that the overall flow of activities could be improved. Which approach is the BEST to assess this situation?",
    options: [
      "Documenting the associated risks or controls",
      "Replace the current management team",
      "Value stream mapping",
      "Building a business case",
    ],
    answer: "Value stream mapping",
    ShortExplanation:
      "Value stream mapping shows the end-to-end flow of work, so it helps identify waste and opportunities to improve the flow.",
  },
  {
    id: "dpi-sp2-28",
    question:
      "An organization has decided to use the ITIL continual improvement model to help them work more effectively. After six months, the IT director asked managers to show how much improvement they had made. The managers produced reports showing how well things were working, but did not have any data to show that this was better than the original situation. Which step of the continual improvement model was NOT followed effectively?",
    options: [
      "What is the vision?",
      "Where are we now?",
      "Where do we want to be?",
      "Did we get there?",
    ],
    answer: "Where are we now?",
    ShortExplanation:
      "Without a baseline measured in 'Where are we now?', improvement cannot be shown by comparison with the original situation.",
  },
  {
    id: "dpi-sp2-29",
    question: "Which activity is part of governance?",
    options: [
      "Ensuring that organizational policies are established and implemented",
      "Consistently following documented management expectations and intentions",
      "Ensuring effective operational activity to achieve an organization's objectives",
      "Producing evidence to ensure that relevant regulations are followed",
    ],
    answer:
      "Ensuring that organizational policies are established and implemented",
    ShortExplanation:
      "Governance directs and controls the organization, including establishing policies. Following expectations and producing evidence are compliance, and operational activity is management.",
  },
  {
    id: "dpi-sp2-30",
    question:
      "A growing IT department requires all decisions to be made by IT executives. The CIO is aware that it takes too much time to make decisions at that level, and it would be more effective to delegate it to staff closest to the work. Which is the BEST approach for delegating more decisions to staff?",
    options: [
      "Establish financial authorization limits for all staff, so staff are authorized to make decisions within their financial limits",
      "Delegate decisions to the most available person at the time a decision is needed, to avoid delays",
      "Develop a value stream map for making decisions, and use 'continual improvement' to eliminate waste in the process",
      "Delegate low-risk decisions to lower levels in the organization, keep governance and high-risk changes with the IT executive team",
    ],
    answer:
      "Delegate low-risk decisions to lower levels in the organization, keep governance and high-risk changes with the IT executive team",
    ShortExplanation:
      "Decision-making authority should be assigned by weighing risk: delegate low-risk decisions and keep governance and high-risk decisions at the top.",
  },
  {
    id: "dpi-sp2-31",
    question:
      "Which statement BEST describes the role of IT staff in risk management?",
    options: [
      "IT risk management is a specialized skill and should be performed only by specially trained staff",
      "When IT services fail because of unidentified risk, responsible staff must be held accountable",
      "IT staff objectively identify potential risks in their own work",
      "IT staff are responsible for contributing to the effective management of risks",
    ],
    answer:
      "IT staff are responsible for contributing to the effective management of risks",
    ShortExplanation:
      "Risk management is everyone's responsibility. Blame-based or specialist-only approaches discourage people from raising risks.",
  },
  {
    id: "dpi-sp2-32",
    question:
      "A service provider has developed a strategy to increase its revenue by launching a new cloud storage service. This strategy is being cascaded down to the technical teams. Which is a relevant objective that will support the strategy?",
    options: [
      "Average number of storage access failures per month",
      "Increase profit by launching new wi-fi services into new geographic markets",
      "Achieve a 10% increase in service requests fulfilled in the target time",
      "Design and implement new infrastructure by the end of quarter 2",
    ],
    answer: "Design and implement new infrastructure by the end of quarter 2",
    ShortExplanation:
      "Cascaded objectives must support the objective above them. Building the infrastructure by a set date directly enables the cloud storage launch, and it is specific and time-bound.",
  },
  {
    id: "dpi-sp2-33",
    question:
      "What is the relationship between the costs, risks, outcomes, and value of a service?",
    options: [
      "Risks depend on value, outcomes, and costs",
      "Outcomes depend on value, costs, and risks",
      "Costs depend on outcomes, risks, and value",
      "Value depends on outcomes, costs, and risks",
    ],
    answer: "Value depends on outcomes, costs, and risks",
    ShortExplanation:
      "Value (VOCR) is determined by the outcomes achieved, the costs incurred or removed, and the risks introduced or reduced.",
  },
  {
    id: "dpi-sp2-34",
    question:
      "An organization wants to ensure that its releases do not compromise the security of the live environment. What is this an example of?",
    options: [
      "A success factor",
      "A key performance indicator",
      "A metric",
      "A measurement",
    ],
    answer: "A success factor",
    ShortExplanation:
      "A success factor is a condition or characteristic that must be achieved for something to be considered successful. KPIs and metrics would measure whether it is achieved.",
  },
  {
    id: "dpi-sp2-35",
    question:
      "An organization wants to improve the value stream they use to modify critical services. A common complaint about this value stream is the amount of rework that occurs when requirements are not clear. What improvement will help to reduce the rework and improve the flow of work across this value stream?",
    options: [
      "Encourage collaboration to ensure people get the information that they need",
      "Ensure that control points are necessary and automate controls where possible",
      "Establish effective communication channels when onboarding new partners",
      "Empower people with the authority to quickly approve tasks at control points",
    ],
    answer:
      "Encourage collaboration to ensure people get the information that they need",
    ShortExplanation:
      "Rework caused by unclear requirements is an information and collaboration problem. The other options address control points and partner onboarding.",
  },
  {
    id: "dpi-sp2-36",
    question: "Which is the BEST description of 'methods'?",
    options: [
      "Techniques used to achieve a strategy",
      "Activities over which a person has authority",
      "Systematic ways to do work",
      "Visual representations of how an organization co-creates value",
    ],
    answer: "Systematic ways to do work",
    ShortExplanation:
      "Methods are systematic ways of working. Tactics are the specific means of enacting a strategy, and an operating model is the visual representation of value co-creation.",
  },
  {
    id: "dpi-sp2-37",
    question:
      "An organization uses routine procedures for its daily activities. What is this an example of?",
    options: ["Vision", "Strategy", "Tactics", "Operation"],
    answer: "Operation",
    ShortExplanation:
      "Operation is the routine running and management of activities, products, and services.",
  },
  {
    id: "dpi-sp2-38",
    question:
      "Which concept includes the coordination of work to avoid waste and reduce risk?",
    options: ["Planning", "Direction", "Improvement", "Governance"],
    answer: "Planning",
    ShortExplanation:
      "Planning arranges a method of achieving an end and coordinates work to avoid waste and reduce risk.",
  },
  {
    id: "dpi-sp2-39",
    question:
      "An organization has encouraged users to offer feedback about their experience of a service via email, or the user portal. This worked well for a while, but the feedback has slowed down. How could the organization help to encourage more use of these feedback channels?",
    options: [
      "Produce regular management reports showing number of feedback reports received and trends over time",
      "Ensure that all feedback is anonymous so that users feel more confident in sending their comments",
      "Encourage users to send feedback via social media and instant messaging",
      "Provide a response to all feedback and share improvement initiatives with the users",
    ],
    answer:
      "Provide a response to all feedback and share improvement initiatives with the users",
    ShortExplanation:
      "Communication is two-way. People keep giving feedback when they see it is acknowledged and acted on.",
  },
  {
    id: "dpi-sp2-40",
    question:
      "An organization has IT divisions distributed globally. As the organization has grown, it has become difficult to align the activities of the IT divisions with the organization's objectives. How can the organization ensure that all IT activities are aligned with the organization's objectives?",
    options: [
      "Put compliance controls in place to ensure that all centres of expertise are following the same practices",
      "Prioritize risk mitigation strategies in alignment with the organization's risk appetite",
      "Establish increasingly detailed objectives at each level of the organization that align directly with the objectives of the layer above",
      "Collect feedback from both organizational and IT leadership from each region",
    ],
    answer:
      "Establish increasingly detailed objectives at each level of the organization that align directly with the objectives of the layer above",
    ShortExplanation:
      "Cascading objectives from the mission and strategy down through each level keeps strategy, tactics, and operations aligned.",
  },
];
