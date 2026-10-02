// ITIL 4 Strategist: Direct, Plan and Improve (DPI) question bank
// Source: PeopleCert Sample Paper 2 (question booklet, v4.2).
// NOTE: Sample Paper 2 ships WITHOUT an answer key. Answers below were derived
// from the DPI syllabus and from the rationales in Sample Paper 1. The items
// flagged in earlier review were re-audited against DPI principles and retained
// where the principle match is strongest.
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
    // Reviewed: the party's behavior is a nonverbal communication signal, so the correct principle is "we are all communicating all the time."
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
    // Reviewed: work item age is the better indicator for a stuck value stream step, so the retained answer is still the most appropriate.
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
    // Reviewed: the key issue is timing and frequency; the campaign messages were no longer relevant after the crisis changed priorities.
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
    // Reviewed: in a fast-moving competitive market, a SWOT analysis is the most relevant assessment to guide improvement and positioning.
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
    // Reviewed: the governing body is accountable for oversight of risk and internal controls, which is the strongest fit for the question.
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
    // Reviewed: for proving compliance against a standard, a gap analysis is the most direct and relevant tool.
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

  {
    id: "dpi-practice-01",
    question:
      "A utilities company publishes this statement: 'We provide affordable, reliable energy to rural communities.' What is this an example of?",
    options: ["A vision", "A mission statement", "A strategy", "A tactic"],
    answer: "A mission statement",
    ShortExplanation:
      "A mission statement is a short but complete description of the organization's overall purpose and intentions. It says what is to be achieved, not how.",
  },
  {
    id: "dpi-practice-02",
    question:
      "Every quarter, an organization's board reviews performance reports and compares results with the approved strategy. Which governance activity is this?",
    options: ["Evaluate", "Direct", "Monitor", "Comply"],
    answer: "Monitor",
    ShortExplanation:
      "Governance consists of Evaluate, Direct, and Monitor. Checking performance and conformance against the strategy is the Monitor activity.",
  },
  {
    id: "dpi-practice-03",
    question:
      "A bank's strategy is to shift most customer interactions to digital channels. It decides to launch a mobile app and an online chat assistant as the first steps. What do the app and the chat assistant represent?",
    options: ["Objectives", "Tactics", "Operations", "Policies"],
    answer: "Tactics",
    ShortExplanation:
      "Tactics are the specific methods by which a strategy is enacted. The strategy is the broad approach; launching channels is how it is carried out.",
  },
  {
    id: "dpi-practice-04",
    question:
      "A company document states: 'All laptops must use full-disk encryption. Failure to comply may lead to disciplinary action.' What is this an example of?",
    options: ["A guideline", "A policy", "A success factor", "A method"],
    answer: "A policy",
    ShortExplanation:
      "A policy contains formally documented management expectations used to direct decisions and activities. Following it is mandatory, and breaches have consequences.",
  },
  {
    id: "dpi-practice-05",
    question:
      "A data centre uses an electronic badge system to restrict entry to the server room. What type of control is this?",
    options: [
      "A physical control",
      "A logical (technical) control",
      "An organizational (procedural) control",
      "A detective audit control",
    ],
    answer: "A physical control",
    ShortExplanation:
      "Physical controls restrict physical access, for example badge entry systems. Logical controls are built into software, and organizational controls are policies, roles, and training.",
  },
  {
    id: "dpi-practice-06",
    question:
      "An external auditor confirms that an IT team followed the required data retention standard during the past year. What does this confirmation demonstrate?",
    options: ["Improvement", "Compliance", "Governance", "Direction"],
    answer: "Compliance",
    ShortExplanation:
      "Compliance is the act and result of ensuring that a standard or set of guidelines is followed. Evidence of this is typically provided by audits.",
  },
  {
    id: "dpi-practice-07",
    question: "Which statement BEST describes an operating model?",
    options: [
      "A detailed plan of the tasks assigned to each team this quarter",
      "A formal agreement between a provider and a consumer about service levels",
      "A conceptual or visual representation of how an organization co-creates value and runs itself",
      "A list of policies that every employee must follow",
    ],
    answer:
      "A conceptual or visual representation of how an organization co-creates value and runs itself",
    ShortExplanation:
      "An operating model shows how the organization co-creates value with customers and other stakeholders, and how it runs itself.",
  },
  {
    id: "dpi-practice-08",
    question:
      "An organization wants a function that works with the governing body, management, and auditors to turn strategy and direction into plans, policies, controls, and guidelines, and to monitor compliance. Which function is this?",
    options: [
      "Governance, risk, and compliance (GRC)",
      "Service management office",
      "Project management office",
      "Continual improvement team",
    ],
    answer: "Governance, risk, and compliance (GRC)",
    ShortExplanation:
      "A GRC function translates strategy and direction into plans, policies, controls, and guidelines, and provides methods to monitor and measure compliance.",
  },
  {
    id: "dpi-practice-09",
    question:
      "An organization's strategy is to reduce customer churn. Which objective set for the service desk team BEST supports this strategy?",
    options: [
      "Install a new telephony system this year",
      "Increase first-contact resolution from 60% to 75% by the end of Q3",
      "Reduce the number of staff on the team",
      "Produce weekly reports on call volumes",
    ],
    answer:
      "Increase first-contact resolution from 60% to 75% by the end of Q3",
    ShortExplanation:
      "Objectives cascade from the organization's strategy. This one is specific, measurable, time-bound, and plausibly improves customer experience and retention.",
  },
  {
    id: "dpi-practice-10",
    question:
      "A critical success factor for a support team is 'customers can get help quickly'. Which KPI would BEST provide evidence of achieving it?",
    options: [
      "Total number of tickets logged per year",
      "Percentage of calls answered within 60 seconds",
      "Number of agents on the team",
      "Percentage of knowledge articles reviewed",
    ],
    answer: "Percentage of calls answered within 60 seconds",
    ShortExplanation:
      "A KPI should provide evidence of whether a success factor is being achieved. Speed of answering directly reflects 'getting help quickly'.",
  },
  {
    id: "dpi-practice-11",
    question:
      "An organization measures 'percentage of changes implemented in line with the approved change policy'. Which type of measurement is this?",
    options: ["Productivity", "Progress", "Compliance", "Effectiveness"],
    answer: "Compliance",
    ShortExplanation:
      "Compliance measurements show how well a standard, policy, or set of guidelines is being followed.",
  },
  {
    id: "dpi-practice-12",
    question:
      "A service desk measures 'percentage of users who confirm their issue was resolved to their satisfaction'. Which type of measurement is this?",
    options: ["Effectiveness", "Productivity", "Progress", "Compliance"],
    answer: "Effectiveness",
    ShortExplanation:
      "Effectiveness measures whether the desired result was achieved, here the user's issue actually being resolved.",
  },
  {
    id: "dpi-practice-13",
    question:
      "A customer submits a request on Monday and receives the finished result the following Friday. Which value stream measure does the elapsed time from Monday to Friday represent?",
    options: ["Throughput", "Work in progress", "Lead time", "Work item age"],
    answer: "Lead time",
    ShortExplanation:
      "Lead time is the total elapsed time from a request being made until it is delivered, including all waiting time.",
  },
  {
    id: "dpi-practice-14",
    question:
      "A team completes an average of 12 change requests per week. Which value stream measure is this?",
    options: ["Throughput", "Lead time", "Work in progress", "Wait time"],
    answer: "Throughput",
    ShortExplanation:
      "Throughput is the number of work items completed in a given period of time.",
  },
  {
    id: "dpi-practice-15",
    question:
      "A team has started dozens of tasks but finishes very few, and items sit half done for weeks. Which Kanban-style technique would MOST directly improve the flow of work?",
    options: [
      "Add more tasks to the board to keep people busy",
      "Limit the number of items in progress at any one time",
      "Remove the board and track work informally",
      "Assign all urgent work to a single person",
    ],
    answer: "Limit the number of items in progress at any one time",
    ShortExplanation:
      "Limiting work in progress reduces task switching and queues, so items are finished faster and work flows more smoothly.",
  },
  {
    id: "dpi-practice-16",
    question:
      "A group has just finished mapping the current state of a value stream. What should the group do NEXT?",
    options: [
      "Close the mapping exercise and report the results",
      "Determine the improvements that can be made and map the future state",
      "Automate every step in the current map",
      "Replace the people involved in the value stream",
    ],
    answer:
      "Determine the improvements that can be made and map the future state",
    ShortExplanation:
      "After the current state is defined, the group identifies improvements, typically focused on waste and flow, and maps what the value stream will look like once they are made.",
  },
  {
    id: "dpi-practice-17",
    question:
      "A team shortens its own handover steps, but the change creates extra rework for the team that receives its output. Which guiding principle was MOST likely overlooked?",
    options: [
      "Think and work holistically",
      "Start where you are",
      "Progress iteratively with feedback",
      "Optimize and automate",
    ],
    answer: "Think and work holistically",
    ShortExplanation:
      "Working holistically means considering the effects of a change across the whole system, not just optimizing one part in isolation.",
  },
  {
    id: "dpi-practice-18",
    question:
      "An onboarding form has 45 fields, and many are never used. A team removes every field that does not support a decision or an outcome. Which guiding principle does this demonstrate?",
    options: [
      "Focus on value",
      "Collaborate and promote visibility",
      "Keep it simple and practical",
      "Start where you are",
    ],
    answer: "Keep it simple and practical",
    ShortExplanation:
      "This principle recommends using the minimum number of steps needed and avoiding anything that does not contribute to a useful outcome.",
  },
  {
    id: "dpi-practice-19",
    question:
      "An improvement has delivered the expected value. The team now publicizes the success and reinforces the new ways of working so they last. Which step of the continual improvement model is this?",
    options: [
      "Take action",
      "Did we get there?",
      "How do we keep the momentum going?",
      "Where do we want to be?",
    ],
    answer: "How do we keep the momentum going?",
    ShortExplanation:
      "The final step focuses on marketing successes and embedding the new methods, so the improvement is sustained and feeds the next iteration.",
  },
  {
    id: "dpi-practice-20",
    question:
      "A manager is preparing a business case for funding a new automation tool. Which question should the business case answer for senior management?",
    options: [
      "Which team members will be promoted if the project succeeds?",
      "Why is the proposal needed, and do its benefits justify the investment and risks?",
      "How can the tool be installed in the shortest possible time?",
      "Which vendor offers the lowest list price?",
    ],
    answer:
      "Why is the proposal needed, and do its benefits justify the investment and risks?",
    ShortExplanation:
      "A business case identifies the proposal, its benefits and risks, from demand to value, and justifies the investment.",
  },
  {
    id: "dpi-practice-21",
    question:
      "An organization wants to estimate how mature its incident management capability is by comparing it against a defined process maturity framework. Which method should it use?",
    options: [
      "A maturity assessment",
      "A PESTLE analysis",
      "A change readiness assessment",
      "A metrics cascade",
    ],
    answer: "A maturity assessment",
    ShortExplanation:
      "A maturity assessment estimates the maturity of a process or organization based on a defined framework.",
  },
  {
    id: "dpi-practice-22",
    question:
      "A hospital is planning to replace its patient records system. Before starting, leaders want to learn which factors could prevent staff from adapting successfully. Which activity would help MOST?",
    options: [
      "A change readiness assessment",
      "A benchmarking exercise",
      "An SLA achievement review",
      "A lessons-learned workshop",
    ],
    answer: "A change readiness assessment",
    ShortExplanation:
      "A change readiness assessment estimates an organization's preparedness for a new way of working and highlights factors that may impede success before the change begins.",
  },
  {
    id: "dpi-practice-23",
    question:
      "A service provider wants to compare its incident resolution times with those of similar organizations. Which technique is this?",
    options: [
      "Benchmarking",
      "Gap analysis",
      "SWOT analysis",
      "Value stream mapping",
    ],
    answer: "Benchmarking",
    ShortExplanation:
      "Benchmarking compares performance with that of other organizations, or with standards, to provide context for what good looks like.",
  },
  {
    id: "dpi-practice-24",
    question:
      "A company is considering expanding into a new country and needs to understand the political, legal, and environmental factors that could affect the plan. Which technique is MOST suitable?",
    options: [
      "PESTLE analysis",
      "Maturity assessment",
      "Kanban board",
      "Metrics cascade",
    ],
    answer: "PESTLE analysis",
    ShortExplanation:
      "PESTLE examines external political, economic, social, technological, legal, and environmental factors that influence the organization.",
  },
  {
    id: "dpi-practice-25",
    question:
      "When building a stakeholder communication plan, a project manager asks, 'What will persuade this group to support and engage with the initiative?' Which activity is being performed?",
    options: [
      "Identifying the stakeholders",
      "Identifying the message",
      "Reviewing the budget",
      "Closing the initiative",
    ],
    answer: "Identifying the message",
    ShortExplanation:
      "Identifying the message means working out what will persuade stakeholders to support and engage, and tailoring the content to each group.",
  },
  {
    id: "dpi-practice-26",
    question:
      "A project manager needs to confirm a short, factual detail, a change freeze date, with several teams, and wants a written record. Which communication method is MOST suitable?",
    options: [
      "Email",
      "A long face-to-face workshop",
      "Instant messaging with abbreviations",
      "A social media post",
    ],
    answer: "Email",
    ShortExplanation:
      "Email is particularly useful for short, factual exchanges where written documentation is helpful.",
  },
  {
    id: "dpi-practice-27",
    question:
      "A project publishes all its updates on an intranet page. Staff cannot respond or ask questions, and no one knows how to raise concerns. Which communication principle is being ignored?",
    options: [
      "Communication is a two-way process",
      "Timing and frequency matter",
      "The message is in the medium",
      "There is no single method that works for everyone",
    ],
    answer: "Communication is a two-way process",
    ShortExplanation:
      "Effective communication needs feedback channels, both actively eliciting feedback and providing static channels known to stakeholders.",
  },
  {
    id: "dpi-practice-28",
    question:
      "A company is moving all its teams to an Agile way of working. Leaders want to focus on how people will understand, accept, and adopt the new behaviours. Which practice addresses this?",
    options: [
      "Change enablement",
      "Organizational change management",
      "Release management",
      "Incident management",
    ],
    answer: "Organizational change management",
    ShortExplanation:
      "Organizational change management focuses on the human aspects of change so that benefits are achieved and sustained. Change enablement controls the risk of individual changes.",
  },
  {
    id: "dpi-practice-29",
    question:
      "Leaders want to build a culture of continual improvement. Which behaviour should they encourage?",
    options: [
      "Hiding unsuccessful experiments to protect reputations",
      "Sharing lessons learned openly, including from failed experiments",
      "Rewarding only improvements that succeed first time",
      "Waiting for complete certainty before trying anything new",
    ],
    answer: "Sharing lessons learned openly, including from failed experiments",
    ShortExplanation:
      "A learning culture treats failures as sources of knowledge and makes lessons visible, which encourages people to try and propose improvements.",
  },
  {
    id: "dpi-practice-30",
    question:
      "To limit the financial impact of a possible data centre fire, an organization buys insurance. Which risk treatment is this?",
    options: [
      "Avoiding the risk",
      "Accepting the risk",
      "Sharing or transferring the risk",
      "Ignoring the risk",
    ],
    answer: "Sharing or transferring the risk",
    ShortExplanation:
      "Insurance moves part of the financial impact of a risk to a third party, which is risk sharing or transfer.",
  },
  {
    id: "dpi-practice-31",
    question:
      "An organization knowingly adopts an unproven technology, accepting higher risk because the potential rewards are very large. Which statement explains why this can be reasonable?",
    options: [
      "Risk should always be eliminated before any decision",
      "An organization may accept additional risk, cost, or diminished outcomes if it creates the possibility of increased value as it measures it",
      "Unproven technology never creates value",
      "Governance bodies cannot accept any risk",
    ],
    answer:
      "An organization may accept additional risk, cost, or diminished outcomes if it creates the possibility of increased value as it measures it",
    ShortExplanation:
      "Value depends on balancing outcomes, costs, and risks. The organization decides which balance is acceptable according to its own view of value.",
  },
  {
    id: "dpi-practice-32",
    question:
      "A risk manager wants a single place to record each identified risk with its owner, likelihood, impact, and planned treatment. What should be used?",
    options: [
      "A risk register",
      "An operating model",
      "A mission statement",
      "A change schedule",
    ],
    answer: "A risk register",
    ShortExplanation:
      "A risk register records identified risks together with their assessment, owners, and treatment actions.",
  },
  {
    id: "dpi-practice-33",
    question:
      "To save records quickly, service desk staff regularly type 'N/A' into fields that the tool forces them to complete. What does this MOST likely indicate?",
    options: [
      "The control may be excessive and is encouraging workarounds",
      "The staff need disciplinary action",
      "The tool is working as designed",
      "More mandatory fields should be added",
    ],
    answer: "The control may be excessive and is encouraging workarounds",
    ShortExplanation:
      "Unintended consequences, such as placeholder data, are a sign that a control is excessive and should be reviewed.",
  },
  {
    id: "dpi-practice-34",
    question:
      "A department produces more than 60 weekly reports, and very few are read or used for decisions. What is the BEST way to improve this?",
    options: [
      "Produce the reports less often but make them longer",
      "Limit measurements to those that can be actively used to make informed decisions",
      "Add more metrics to each report",
      "Send all reports to every employee",
    ],
    answer:
      "Limit measurements to those that can be actively used to make informed decisions",
    ShortExplanation:
      "It is impractical to measure everything. Using 'focus on value', measure only what supports decisions.",
  },
  {
    id: "dpi-practice-35",
    question:
      "In one organization, even minor decisions must be escalated to senior managers. What is the MOST likely effect?",
    options: [
      "Decisions are made faster",
      "Work is slowed and decision-makers are overloaded",
      "Risk is eliminated",
      "Staff become more empowered",
    ],
    answer: "Work is slowed and decision-makers are overloaded",
    ShortExplanation:
      "When people's scope of control is too small, decisions are forced upwards, slowing work and overloading the decision-makers.",
  },
  {
    id: "dpi-practice-36",
    question: "Which statement about writing an effective policy is CORRECT?",
    options: [
      "A policy should avoid saying why it exists",
      "Any exceptions to the policy should be stated in the policy document",
      "A policy should be as long and detailed as possible",
      "A policy never needs to be reviewed once approved",
    ],
    answer:
      "Any exceptions to the policy should be stated in the policy document",
    ShortExplanation:
      "Good policies are clear, explain their purpose, state any exceptions, and are reviewed regularly.",
  },
  {
    id: "dpi-practice-37",
    question:
      "A team leader decides who will work on which tasks this week and sets the daily schedule for the team. Which level of plan is this?",
    options: [
      "A strategic plan",
      "A tactical plan",
      "An operational plan",
      "A governance plan",
    ],
    answer: "An operational plan",
    ShortExplanation:
      "Operational plans cover the day-to-day allocation and scheduling of work. Strategic and tactical plans link above them and must stay aligned.",
  },
  {
    id: "dpi-practice-38",
    question:
      "A board reviews several proposed investments and the organization's relationships with partners to decide where to focus next year. Which governance activity is this?",
    options: ["Evaluate", "Monitor", "Audit", "Operate"],
    answer: "Evaluate",
    ShortExplanation:
      "Evaluate is the governance activity of assessing the organization's strategy, portfolios, and relationships with other parties.",
  },
  {
    id: "dpi-practice-39",
    question:
      "Employees across an organization regularly suggest ways to improve products and services. Where should these ideas be tracked from identification to completion?",
    options: [
      "A continual improvement register",
      "A service level agreement",
      "A risk treatment plan",
      "A change schedule",
    ],
    answer: "A continual improvement register",
    ShortExplanation:
      "A continual improvement register records improvement opportunities, their owners, priority, and status, giving visibility and avoiding duplicated effort.",
  },
  {
    id: "dpi-practice-40",
    question:
      "A manufacturing firm wants a way of working that focuses on removing waste from its value streams and maximizing customer value. Which approach does this describe?",
    options: ["Lean", "Waterfall", "Outsourcing", "Benchmarking"],
    answer: "Lean",
    ShortExplanation:
      "Lean is built around eliminating waste and improving flow to maximize the value delivered to customers.",
  },

  {
    id: "dpi-exam2-01",
    question:
      "A governing body wants assurance that improvement initiatives support the organization's strategy, without becoming involved in the day-to-day management of those initiatives. Which approach is BEST?",
    options: [
      "Approve the task plan of every improvement team",
      "Set clear direction and policies, then monitor reported performance against objectives",
      "Delegate governance responsibility to the improvement teams",
      "Review improvement initiatives only after they have finished",
    ],
    answer:
      "Set clear direction and policies, then monitor reported performance against objectives",
    ShortExplanation:
      "Governance works through evaluating, directing, and monitoring. Directing through policy and monitoring through reporting gives assurance while leaving management to managers.",
  },
  {
    id: "dpi-exam2-02",
    question:
      "An organization is cascading its strategy into objectives for each level. Which TWO statements describe well-cascaded objectives?\n1. Each level's objectives support the objectives of the level above.\n2. Objectives are identical at every level.\n3. Objectives become more specific and detailed at lower levels.\n4. Each level sets its objectives independently of higher levels.",
    options: ["1 and 2", "1 and 3", "2 and 4", "3 and 4"],
    answer: "1 and 3",
    ShortExplanation:
      "Objectives cascade from the mission and strategy, and each level supports the one above while becoming more specific. Identical or independent objectives break the alignment.",
  },
  {
    id: "dpi-exam2-03",
    question:
      "An organization's goal is to improve customer retention. A success factor for the support team is 'customers are satisfied with the support they receive'. Which KPI would BEST provide evidence of achieving this success factor?",
    options: [
      "Number of tickets closed per agent per day",
      "Average length of a support call",
      "Percentage of customers rating their support experience 4 or 5 out of 5, against a 90% target",
      "Number of agents who completed product training",
    ],
    answer:
      "Percentage of customers rating their support experience 4 or 5 out of 5, against a 90% target",
    ShortExplanation:
      "A KPI must show evidence of the success factor. Satisfaction ratings with a target measure it directly, while the other options measure activity or inputs.",
  },
  {
    id: "dpi-exam2-04",
    question:
      "A value stream for fulfilling user requests has a total lead time of 15 days, although the hands-on work involved takes only 2 days. What does this MOST LIKELY indicate?",
    options: [
      "Staff are working too slowly on each task",
      "Work spends a large amount of time waiting between steps",
      "The value stream has too few steps",
      "The throughput measure is being calculated incorrectly",
    ],
    answer: "Work spends a large amount of time waiting between steps",
    ShortExplanation:
      "A large gap between lead time and actual work time points to queues, handovers, and waiting, which are common sources of waste.",
  },
  {
    id: "dpi-exam2-05",
    question:
      "In a value stream, requests wait several days for sign-off at a control point, yet 99% of requests are approved without changes. Which improvement is BEST?",
    options: [
      "Add a second approver to the control point",
      "Assess whether the control is necessary and automate or remove it where it adds little value",
      "Move the control point to the end of the value stream",
      "Train approvers to read requests more slowly",
    ],
    answer:
      "Assess whether the control is necessary and automate or remove it where it adds little value",
    ShortExplanation:
      "Controls should be necessary and proportionate. A control that almost never changes the outcome adds delay without much risk reduction, so it should be automated or removed.",
  },
  {
    id: "dpi-exam2-06",
    question:
      "An organization is planning a major reorganization and expects resistance. Which TWO actions are MOST likely to reduce resistance?\n1. Announce the change only on the day it takes effect to avoid speculation.\n2. Explain the reasons for the change and the benefits to those affected.\n3. Restrict feedback on the change to managers only.\n4. Involve affected staff in designing how the change is implemented.",
    options: ["1 and 3", "2 and 4", "1 and 4", "2 and 3"],
    answer: "2 and 4",
    ShortExplanation:
      "Organizational change management builds understanding and ownership. Early explanation and involvement reduce resistance, while late announcements and restricted feedback increase it.",
  },
  {
    id: "dpi-exam2-07",
    question:
      "An improvement team has chosen a new tool and started configuring it, but cannot explain how this relates to the organization's goals. Which step of the continual improvement model should be revisited FIRST?",
    options: [
      "What is the vision?",
      "Where are we now?",
      "Take action",
      "Did we get there?",
    ],
    answer: "What is the vision?",
    ShortExplanation:
      "The first step ensures each improvement is aligned to organizational goals and direction. Without that link, the team may be improving the wrong thing.",
  },
  {
    id: "dpi-exam2-08",
    question:
      "Frontline staff have suggested many improvement ideas, but funding is available for only a few this year. What is the BEST way to handle the ideas that cannot be funded now?",
    options: [
      "Reject them so that staff only submit realistic ideas",
      "Record them in the continual improvement register with a priority and revisit them later",
      "Let teams implement them informally without approval",
      "Ask staff to resubmit them next year",
    ],
    answer:
      "Record them in the continual improvement register with a priority and revisit them later",
    ShortExplanation:
      "A shared improvement register keeps ideas visible, prioritized, and available for later review. It also shows staff that their input is valued.",
  },
  {
    id: "dpi-exam2-09",
    question:
      "A manager is writing a business case for a proposed improvement. Which TWO items should the business case include?\n1. The benefits expected and how they will be measured.\n2. The sponsor's personal preferences.\n3. A list of staff who oppose the proposal.\n4. The costs and risks involved.",
    options: ["1 and 2", "2 and 3", "3 and 4", "1 and 4"],
    answer: "1 and 4",
    ShortExplanation:
      "A business case justifies an investment by setting out benefits, costs, and risks. Personal preferences and lists of opponents are not part of that justification.",
  },
  {
    id: "dpi-exam2-10",
    question:
      "An organization wants to understand why its major incidents take so long to resolve. Which assessment approach is BEST?",
    options: [
      "A broad assessment of all service management practices",
      "A focused assessment of how major incidents are handled, with clear objectives",
      "A customer survey about overall brand perception",
      "An assessment of the finance department's processes",
    ],
    answer:
      "A focused assessment of how major incidents are handled, with clear objectives",
    ShortExplanation:
      "Assessment objectives must be clear. Too broad a scope is expensive and slow, while a scope that matches the concern produces useful findings.",
  },
  {
    id: "dpi-exam2-11",
    question:
      "A company benchmarks its incident resolution times against an industry survey and finds that it is slower than the average. What should it do FIRST?",
    options: [
      "Adopt the survey figures as targets immediately",
      "Check whether the surveyed organizations are comparable and what its own customers need, before setting targets",
      "Ignore the results because every organization is different",
      "Replace the service desk team",
    ],
    answer:
      "Check whether the surveyed organizations are comparable and what its own customers need, before setting targets",
    ShortExplanation:
      "Benchmarks give context, but only if the comparison is meaningful. Targets should reflect the organization's own vision and the needs of its customers.",
  },
  {
    id: "dpi-exam2-12",
    question:
      "An organization is redesigning its measurement approach. Which TWO statements about metrics are CORRECT?\n1. More metrics always lead to better decisions.\n2. Measurements should be limited to those that can be used to make informed decisions.\n3. Metrics should be connected to the organization's objectives.\n4. Metrics should be designed independently of objectives to remain objective.",
    options: ["1 and 4", "1 and 2", "2 and 3", "3 and 4"],
    answer: "2 and 3",
    ShortExplanation:
      "It is impractical to measure everything. Useful measures are tied to desired outcomes and used for decisions.",
  },
  {
    id: "dpi-exam2-13",
    question:
      "A service report shows 99.9% availability, so the agreement is met, yet users are complaining that the service is unusable at critical business times. Which action is BEST?",
    options: [
      "Raise the availability target to 99.99%",
      "Add outcome-based measures that reflect user experience, such as availability during critical business periods",
      "Stop reporting availability",
      "Tell users that the agreed target is being met",
    ],
    answer:
      "Add outcome-based measures that reflect user experience, such as availability during critical business periods",
    ShortExplanation:
      "Metrics that look good but hide a poor experience mislead decisions. Measures should truthfully reflect the outcomes that matter to customers.",
  },
  {
    id: "dpi-exam2-14",
    question:
      "A team's lead time is increasing, its throughput is unchanged, and the number of items in progress keeps growing. What is the MOST LIKELY cause?",
    options: [
      "New work is being accepted faster than existing work is being completed",
      "Staff are taking more annual leave",
      "The throughput measure is wrong",
      "Work items are being completed too quickly",
    ],
    answer:
      "New work is being accepted faster than existing work is being completed",
    ShortExplanation:
      "When work enters faster than it leaves, queues and work in progress build up and lead time grows even though completion rate stays the same.",
  },
  {
    id: "dpi-exam2-15",
    question:
      "A newly appointed manager proposes replacing the entire incident handling process with a new design. Which action BEST reflects the guiding principle 'start where you are'?",
    options: [
      "Design the new process from scratch as quickly as possible",
      "Observe and measure the current process directly, then decide what can be reused",
      "Copy the process used by a competitor",
      "Ask only senior managers what they believe is wrong",
    ],
    answer:
      "Observe and measure the current process directly, then decide what can be reused",
    ShortExplanation:
      "This principle recommends assessing the current state with direct observation and data, and reusing what already works, rather than assuming or starting over.",
  },
  {
    id: "dpi-exam2-16",
    question:
      "An organization with a low risk appetite is considering a project that depends on a new supplier whose reliability is unproven. What should the organization do BEST?",
    options: [
      "Proceed and review the risk after the first incident",
      "Assess the likelihood and impact against its risk appetite and agree a treatment before proceeding",
      "Reject all new suppliers permanently",
      "Leave the risk entirely to the supplier",
    ],
    answer:
      "Assess the likelihood and impact against its risk appetite and agree a treatment before proceeding",
    ShortExplanation:
      "Risk management means identifying and analysing a risk, comparing it with appetite, and agreeing a treatment such as mitigation, avoidance, or sharing before commitment.",
  },
  {
    id: "dpi-exam2-17",
    question:
      "Which TWO activities are part of effective risk management?\n1. Guaranteeing that no risk event ever occurs.\n2. Assigning blame to individuals after a risk event.\n3. Identifying risks and assessing their likelihood and impact.\n4. Deciding how to treat risks and monitoring them over time.",
    options: ["1 and 2", "1 and 3", "2 and 4", "3 and 4"],
    answer: "3 and 4",
    ShortExplanation:
      "Risk management identifies, analyses, treats, and monitors risks. It does not promise zero risk, and blame discourages people from reporting risks.",
  },
  {
    id: "dpi-exam2-18",
    question:
      "An organization wants to reduce the effort spent on manual compliance checks without weakening its controls. Which approach is BEST?",
    options: [
      "Remove the checks and rely on trust",
      "Build the controls into technology so they run automatically and stay aligned with objectives",
      "Add a further layer of manual approval",
      "Check only a random sample once a year",
    ],
    answer:
      "Build the controls into technology so they run automatically and stay aligned with objectives",
    ShortExplanation:
      "Automating controls relieves people of the effort of making them work. Controls managed this way should still align with and support high-level objectives.",
  },
  {
    id: "dpi-exam2-19",
    question:
      "Management wants to help staff choose between communication channels in different situations, without dictating a single approach. Which type of document is BEST?",
    options: ["A policy", "A guideline", "A control", "An audit requirement"],
    answer: "A guideline",
    ShortExplanation:
      "Guidelines give general recommendations and allow discretion. Policies are mandatory and are used when behaviour must be directed.",
  },
  {
    id: "dpi-exam2-20",
    question:
      "A manager must tell a team that their roles will change significantly. Which communication approach is BEST?",
    options: [
      "A short all-staff email sent on Friday evening",
      "A notice on the staff intranet",
      "Face-to-face conversations with an opportunity for questions, followed by written details",
      "A post on the company's social media account",
    ],
    answer:
      "Face-to-face conversations with an opportunity for questions, followed by written details",
    ShortExplanation:
      "Sensitive news affecting individuals is best handled personally with two-way discussion, supported by written follow-up so details are recorded.",
  },
  {
    id: "dpi-exam2-21",
    question:
      "An organization is planning improvements to its payroll system. Which TWO stakeholder groups should be engaged MOST closely?\n1. The payroll team, who use the system daily and will help redesign the process.\n2. The finance director, who is funding the work and accountable for the results.\n3. A supplier that is not involved in the change.\n4. Staff in unrelated departments who never use the system.",
    options: ["1 and 2", "2 and 3", "3 and 4", "1 and 4"],
    answer: "1 and 2",
    ShortExplanation:
      "The payroll team and the finance director are both highly affected by and involved in the change, so they need the closest engagement.",
  },
  {
    id: "dpi-exam2-22",
    question:
      "An organization's strategic plan states that it will enter two new markets within three years. Which is an example of a TACTICAL plan that supports this?",
    options: [
      "The schedule of tasks assigned to staff for next Monday",
      "A plan to coordinate the product, support, and marketing teams to prepare for the first market launch within 12 months",
      "The organization's vision statement",
      "A daily list of customer calls to return",
    ],
    answer:
      "A plan to coordinate the product, support, and marketing teams to prepare for the first market launch within 12 months",
    ShortExplanation:
      "Tactical plans translate strategic plans into coordinated plans across teams over a medium time horizon. Task schedules are operational.",
  },
  {
    id: "dpi-exam2-23",
    question:
      "A team is building a new service for which requirements are uncertain and likely to change. Which planning approach is BEST?",
    options: [
      "A detailed sequential plan fixed for the next 18 months",
      "Iterative planning with short cycles and frequent feedback",
      "No planning, so that the team can react freely",
      "Reusing the plan from the previous project unchanged",
    ],
    answer: "Iterative planning with short cycles and frequent feedback",
    ShortExplanation:
      "Where uncertainty is high, working in small iterations with feedback lets plans adapt as learning occurs. Fixed long plans suit stable requirements.",
  },
  {
    id: "dpi-exam2-24",
    question:
      "Which of the following is the BEST indicator of a healthy culture of continual improvement?",
    options: [
      "A high number of reports produced each month",
      "Staff regularly propose improvements and see them acted on",
      "Strict adherence to existing procedures at all times",
      "A low number of incidents in the last quarter",
    ],
    answer: "Staff regularly propose improvements and see them acted on",
    ShortExplanation:
      "Improvement culture shows when everyone contributes ideas and sees action taken. Report volumes, procedure rigidity, or incident counts do not show that.",
  },
  {
    id: "dpi-exam2-25",
    question:
      "Leaders plan to start twelve improvement initiatives at once. Staff are already stretched. Which action is BEST?",
    options: [
      "Start them all and expect staff to adapt",
      "Prioritize by contribution to the vision and available capacity, and stage the initiatives",
      "Cancel all initiatives for the year",
      "Start the cheapest initiatives first only",
    ],
    answer:
      "Prioritize by contribution to the vision and available capacity, and stage the initiatives",
    ShortExplanation:
      "Too many concurrent initiatives cause change fatigue. Prioritizing by value and capacity, and sequencing the work, sustains momentum.",
  },
  {
    id: "dpi-exam2-26",
    question:
      "A new data protection regulation applies to an organization. Which approach BEST ensures compliance?",
    options: [
      "Leave each team to interpret the regulation itself",
      "Translate the regulation into policies, controls, and guidelines, and monitor compliance with evidence",
      "Send one email to staff announcing the regulation",
      "Wait for an external audit to identify gaps",
    ],
    answer:
      "Translate the regulation into policies, controls, and guidelines, and monitor compliance with evidence",
    ShortExplanation:
      "External regulations are mandatory. They should be translated into internal direction and controls, with methods to monitor and demonstrate compliance.",
  },
  {
    id: "dpi-exam2-27",
    question:
      "A team starts using a Kanban board to manage its work. Which TWO benefits can it expect?\n1. It removes the need to prioritize work.\n2. It shows the full workflow so that bottlenecks become visible.\n3. It guarantees that all work will be completed on time.\n4. It helps the team manage and measure the flow of work.",
    options: ["1 and 3", "1 and 2", "3 and 4", "2 and 4"],
    answer: "2 and 4",
    ShortExplanation:
      "A Kanban board makes the workflow visible and supports measurement of flow. It does not remove prioritization or guarantee delivery dates.",
  },
  {
    id: "dpi-exam2-28",
    question:
      "While mapping a value stream, a group finds a step that exists only to produce a report that nobody uses. What should the group do BEST?",
    options: [
      "Keep the step to be safe",
      "Confirm that the step adds no value for stakeholders and remove it in the future-state map",
      "Automate the step",
      "Move the step to the end of the value stream",
    ],
    answer:
      "Confirm that the step adds no value for stakeholders and remove it in the future-state map",
    ShortExplanation:
      "Value stream mapping aims to identify and eliminate waste. Steps that do not contribute to value should be removed rather than preserved or automated.",
  },
  {
    id: "dpi-exam2-29",
    question:
      "A team wants to automate a 12-step approval process in which most steps involve rework and duplicate checks. Which approach is BEST?",
    options: [
      "Automate all 12 steps exactly as they are",
      "Simplify and optimize the process first, then automate what remains",
      "Leave the process manual permanently",
      "Add three more steps to improve quality",
    ],
    answer:
      "Simplify and optimize the process first, then automate what remains",
    ShortExplanation:
      "'Optimize and automate' means improving the process before automating it. Automating a wasteful process only makes the waste happen faster.",
  },
  {
    id: "dpi-exam2-30",
    question:
      "Before introducing an AI chatbot for the service desk, the planning team considers staff training needs, data quality, the supplier contract, and the revised support workflow. Which approach is the team following?",
    options: [
      "Focusing on the technology only",
      "Considering all four dimensions of service management and thinking holistically",
      "Considering only the partners and suppliers dimension",
      "Considering only the value streams and processes dimension",
    ],
    answer:
      "Considering all four dimensions of service management and thinking holistically",
    ShortExplanation:
      "People, information and technology, partners and suppliers, and value streams and processes are all covered, which is the holistic approach the guiding principle recommends.",
  },
  {
    id: "dpi-exam2-31",
    question:
      "Which TWO statements about governance and management are CORRECT?\n1. Governance directs and controls the organization, while management coordinates activities to achieve the direction.\n2. Governance is the day-to-day operation of services.\n3. Management is accountable at the highest level for the organization's performance.\n4. The governing body is accountable for the organization's compliance with policies and external regulations.",
    options: ["1 and 2", "2 and 3", "3 and 4", "1 and 4"],
    answer: "1 and 4",
    ShortExplanation:
      "Governance is the highest-level direction and control, with the governing body accountable for compliance. Management carries out the direction, and operations are carried out by management and teams.",
  },
  {
    id: "dpi-exam2-32",
    question:
      "A department's objective is to reduce the cost of IT operations by 10%. Which team objective BEST supports it?",
    options: [
      "Reduce manual hours spent on provisioning by 20% through automation by the end of Q4",
      "Increase headcount in the provisioning team by 15%",
      "Update the corporate colour scheme on all dashboards",
      "Document every server in the data centre by December",
    ],
    answer:
      "Reduce manual hours spent on provisioning by 20% through automation by the end of Q4",
    ShortExplanation:
      "Team objectives must support those of the level above. Cutting manual effort through automation is specific, measurable, time-bound, and directly lowers operating cost.",
  },
  {
    id: "dpi-exam2-33",
    question:
      "A risk assessment shows that a particular event is very unlikely and its impact would be minor, while the cost of mitigating it is higher than the possible loss. Which treatment is BEST?",
    options: [
      "Avoid the risk by cancelling the service",
      "Accept the risk and monitor it",
      "Fully mitigate the risk regardless of cost",
      "Ignore the risk and remove it from the register",
    ],
    answer: "Accept the risk and monitor it",
    ShortExplanation:
      "When treatment costs more than the potential loss, accepting the risk is reasonable, provided it stays recorded and monitored in case circumstances change.",
  },
  {
    id: "dpi-exam2-34",
    question:
      "Six months after launching a self-service portal, how can an organization BEST determine whether it delivered the benefits promised in its business case?",
    options: [
      "Ask the project team whether they think it went well",
      "Compare actual results with the benefits and measures defined in the business case, and review with stakeholders",
      "Count the number of users who registered",
      "Wait one more year before reviewing",
    ],
    answer:
      "Compare actual results with the benefits and measures defined in the business case, and review with stakeholders",
    ShortExplanation:
      "Business cases should be revisited to check realization of expected value. Comparing real results with the agreed measures shows whether the improvement worked.",
  },
  {
    id: "dpi-exam2-35",
    question:
      "Employees at different levels give very different answers when asked about the organization's purpose and goals. What is the BEST action?",
    options: [
      "Replace the staff who gave inconsistent answers",
      "Communicate the vision, mission, and objectives consistently, and cascade objectives so each team can link its work to them",
      "Publish a longer strategy document",
      "Remove the mission statement",
    ],
    answer:
      "Communicate the vision, mission, and objectives consistently, and cascade objectives so each team can link its work to them",
    ShortExplanation:
      "Direction only creates alignment if everyone understands it. Consistent communication and cascaded objectives connect daily work to the organization's purpose.",
  },
  {
    id: "dpi-exam2-36",
    question:
      "Which TWO observations suggest that a control is excessive?\n1. Staff create workarounds to bypass the control.\n2. The control prevents the outcomes it was designed to prevent.\n3. The control causes delays but reduces risk very little.\n4. The control is automated and invisible to users.",
    options: ["1 and 3", "1 and 2", "2 and 4", "3 and 4"],
    answer: "1 and 3",
    ShortExplanation:
      "Workarounds and delays with little risk reduction are signs of an excessive control. A control that works as intended or runs invisibly is not a problem.",
  },
  {
    id: "dpi-exam2-37",
    question:
      "An organization wants to release changes frequently while still meeting compliance requirements. Which approach to change control is BEST?",
    options: [
      "Require a change board to approve every deployment",
      "Build automated checks and peer review into the delivery pipeline, keeping manual authorization for high-risk changes",
      "Remove all change controls",
      "Limit releases to once a year",
    ],
    answer:
      "Build automated checks and peer review into the delivery pipeline, keeping manual authorization for high-risk changes",
    ShortExplanation:
      "In high-velocity environments, automated controls and peer review keep changes safe without delay. Manual authorization is reserved for changes with higher risk.",
  },
  {
    id: "dpi-exam2-38",
    question:
      "A project team plans to involve organizational change management only after the technical build is complete. What is the MAIN risk of this approach?",
    options: [
      "The build will cost more",
      "People may not understand or accept the change, reducing adoption and the benefits achieved",
      "The project will finish too early",
      "The technology will stop working",
    ],
    answer:
      "People may not understand or accept the change, reducing adoption and the benefits achieved",
    ShortExplanation:
      "Organizational change management should begin when planning begins and run alongside the work. Leaving it until the end risks resistance and low adoption.",
  },
  {
    id: "dpi-exam2-39",
    question:
      "A managed services firm is performing a SWOT analysis. Which finding is an OPPORTUNITY?",
    options: [
      "Its staff have deep security expertise",
      "Its billing tool is outdated",
      "Competitors have cut their prices",
      "A new regulation requires many local firms to outsource IT security",
    ],
    answer:
      "A new regulation requires many local firms to outsource IT security",
    ShortExplanation:
      "Opportunities are favourable external factors. Staff expertise is a strength, the billing tool a weakness, and competitor price cuts a threat.",
  },
  {
    id: "dpi-exam2-40",
    question:
      "Leaders are considering outsourcing a function. It will reduce cost, but it will also create dependency on the supplier and reduce direct control. Which concept BEST explains how they should evaluate the decision?",
    options: [
      "Only the cost reduction matters",
      "Value depends on the outcomes, costs, and risks, as the organization chooses to measure them",
      "Only the risk of dependency matters",
      "Benchmarking against competitors decides the answer",
    ],
    answer:
      "Value depends on the outcomes, costs, and risks, as the organization chooses to measure them",
    ShortExplanation:
      "Outcomes, costs, and risks must be balanced against the organization's own definition of value. An organization may accept extra risk if it expects greater value.",
  },
  {
    id: "dpi-practice-41",
    question:
      "Which statement best describes the relationship between direction, planning, and improvement?",
    options: [
      "Direction establishes objectives, planning determines how to achieve them, and improvement enhances performance",
      "Planning establishes organizational vision, direction allocates resources, and improvement monitors compliance",
      "Improvement establishes strategy, direction manages daily operations, and planning audits performance",
      "Direction and planning are identical, while improvement is performed only when problems occur",
    ],
    answer:
      "Direction establishes objectives, planning determines how to achieve them, and improvement enhances performance",
    ShortExplanation:
      "Direction establishes the organization's desired outcomes, planning translates them into actionable activities, and improvement continually enhances how the organization operates.",
  },
  {
    id: "dpi-practice-42",
    question:
      "An organization has established a vision to become the most trusted digital banking provider in its market. Which statement best describes the role of its mission?",
    options: [
      "It describes the organization's current purpose and why it exists",
      "It defines the exact steps required to achieve the vision",
      "It establishes the organization's annual performance targets",
      "It describes the organization's desired future state",
    ],
    answer: "It describes the organization's current purpose and why it exists",
    ShortExplanation:
      "A mission describes the organization's purpose and reason for existence, while a vision describes the desired future state.",
  },
  {
    id: "dpi-practice-43",
    question:
      "A company has a strategic objective to improve customer satisfaction by 30% within two years. The customer support department introduces a six-month initiative to reduce response times. What does this initiative demonstrate?",
    options: [
      "A tactical or operational plan supporting strategic direction",
      "A governance activity replacing organizational strategy",
      "A vision statement for the entire organization",
      "An independent strategy unrelated to organizational objectives",
    ],
    answer: "A tactical or operational plan supporting strategic direction",
    ShortExplanation:
      "Operational and tactical plans translate strategic objectives into practical activities that departments and teams can execute.",
  },
  {
    id: "dpi-practice-44",
    question:
      "A department manager is authorized to approve changes to team procedures but cannot approve changes to the organization's enterprise security policy. Which concept does this illustrate?",
    options: [
      "Scope of control",
      "Continual improvement",
      "Value stream mapping",
      "Organizational change management",
    ],
    answer: "Scope of control",
    ShortExplanation:
      "Scope of control defines the areas, activities, resources, and decisions over which an individual or group has authority.",
  },
  {
    id: "dpi-practice-45",
    question:
      "An organization wants to implement a new strategy. However, its departments have conflicting priorities, and employees are unsure how their work contributes to the strategy. What should management do first?",
    options: [
      "Cascade organizational goals into clear objectives for departments and teams",
      "Allow every department to develop an independent strategy",
      "Immediately introduce performance penalties for missed targets",
      "Delegate the entire strategy implementation to the IT department",
    ],
    answer:
      "Cascade organizational goals into clear objectives for departments and teams",
    ShortExplanation:
      "Goal cascading connects high-level organizational objectives to departmental and individual objectives, helping align activities with strategic direction.",
  },
  {
    id: "dpi-practice-46",
    question:
      "A financial institution introduces a new policy requiring every production deployment to receive approval from the change authority. What is the primary purpose of this policy?",
    options: [
      "To establish a mandatory rule governing organizational activities",
      "To provide optional recommendations to development teams",
      "To describe the organization's long-term vision",
      "To replace all operational procedures",
    ],
    answer: "To establish a mandatory rule governing organizational activities",
    ShortExplanation:
      "Policies establish organizational rules and expectations. They provide direction and help ensure that activities comply with organizational requirements.",
  },
  {
    id: "dpi-practice-47",
    question:
      "A company wants to introduce a new customer service strategy. Senior management establishes the desired outcomes but allows individual departments to determine how to achieve them within agreed boundaries. Which approach is being used?",
    options: [
      "Centralized operational control",
      "Delegated decision-making within defined boundaries",
      "Complete elimination of organizational governance",
      "Unrestricted departmental autonomy",
    ],
    answer: "Delegated decision-making within defined boundaries",
    ShortExplanation:
      "Effective direction establishes clear objectives and boundaries while allowing appropriate decision-making authority to be delegated to lower organizational levels.",
  },
  {
    id: "dpi-practice-48",
    question:
      "An organization has a vision, but employees cannot explain how their daily activities contribute to it. Which action would most directly address this problem?",
    options: [
      "Translate the vision into measurable objectives and communicate their relevance to teams",
      "Replace the vision with a detailed technical architecture",
      "Increase the number of operational procedures",
      "Restrict strategic information to senior management",
    ],
    answer:
      "Translate the vision into measurable objectives and communicate their relevance to teams",
    ShortExplanation:
      "A vision must be translated into actionable objectives and communicated effectively so employees understand how their activities contribute to organizational goals.",
  },
  {
    id: "dpi-practice-49",
    question:
      "A technology company is considering expanding into a new market. Before approving the investment, management assesses expected benefits, implementation costs, and potential risks. Which concept is being applied?",
    options: [
      "Value assessment",
      "Incident management",
      "Operational monitoring",
      "Configuration management",
    ],
    answer: "Value assessment",
    ShortExplanation:
      "Value assessment considers the benefits, costs, and risks associated with an initiative to determine whether it is worthwhile for stakeholders.",
  },
  {
    id: "dpi-practice-50",
    question:
      "A department has authority to modify its internal processes but must obtain executive approval before changing the organization's risk appetite. What is the primary reason for this restriction?",
    options: [
      "Decisions should be made at an appropriate level of authority",
      "All operational decisions must be centralized",
      "Departments should never modify their own processes",
      "Risk management should be excluded from planning",
    ],
    answer: "Decisions should be made at an appropriate level of authority",
    ShortExplanation:
      "Decision-making authority should be assigned to the appropriate organizational level, considering the scope, impact, and risk of each decision.",
  },
  {
    id: "dpi-practice-51",
    question:
      "A company is introducing a new digital service. Management first evaluates its business objectives, available resources, organizational capabilities, and external constraints. Which planning activity is this?",
    options: [
      "Assessing the current state and planning requirements",
      "Executing the service without prior assessment",
      "Auditing the completed service",
      "Measuring customer satisfaction after deployment",
    ],
    answer: "Assessing the current state and planning requirements",
    ShortExplanation:
      "Effective planning begins with understanding the current state, desired outcomes, requirements, resources, and constraints.",
  },
  {
    id: "dpi-practice-52",
    question:
      "A bank plans to replace its legacy payment platform. The project team identifies dependencies on network infrastructure, security controls, application integrations, and staff training. What is the primary benefit of identifying these dependencies during planning?",
    options: [
      "It helps coordinate activities and reduce implementation risks",
      "It eliminates the need for project monitoring",
      "It guarantees that the project will be completed on time",
      "It allows the project team to avoid stakeholder engagement",
    ],
    answer: "It helps coordinate activities and reduce implementation risks",
    ShortExplanation:
      "Identifying dependencies helps teams coordinate activities, anticipate constraints, and manage risks before implementation.",
  },
  {
    id: "dpi-practice-53",
    question:
      "A project team has completed its initial plan. During implementation, new regulatory requirements emerge. What should the team do?",
    options: [
      "Review and adapt the plan to accommodate the new requirements",
      "Continue with the original plan regardless of the changes",
      "Abandon the project immediately",
      "Ignore the requirements until the project is completed",
    ],
    answer: "Review and adapt the plan to accommodate the new requirements",
    ShortExplanation:
      "Planning is iterative. Plans should be reviewed and adapted when circumstances, requirements, or organizational priorities change.",
  },
  {
    id: "dpi-practice-54",
    question:
      "An organization is planning a major infrastructure upgrade. The project manager identifies limited engineering capacity and schedules the work in phases to avoid disrupting critical services. Which planning consideration is being addressed?",
    options: [
      "Resource availability and operational constraints",
      "Organizational vision",
      "Governance independence",
      "Customer segmentation",
    ],
    answer: "Resource availability and operational constraints",
    ShortExplanation:
      "Planning must account for available resources, capacity, dependencies, and operational constraints to ensure that work can be delivered effectively.",
  },
  {
    id: "dpi-practice-55",
    question:
      "A company has several competing initiatives but limited funding. Management evaluates each initiative against organizational objectives, expected value, and available resources before selecting which to fund. Which activity is this?",
    options: [
      "Portfolio prioritization",
      "Incident categorization",
      "Service validation",
      "Operational monitoring",
    ],
    answer: "Portfolio prioritization",
    ShortExplanation:
      "Portfolio prioritization helps organizations allocate limited resources to initiatives that support their objectives and provide expected value.",
  },
  {
    id: "dpi-practice-56",
    question:
      "An organization has introduced a new process but has not defined who is responsible for approving exceptions. What should be addressed during planning?",
    options: [
      "Decision rights and accountability",
      "The organization's marketing strategy",
      "The color scheme of operational dashboards",
      "The replacement of all existing policies",
    ],
    answer: "Decision rights and accountability",
    ShortExplanation:
      "Effective planning establishes responsibilities, accountability, and decision-making authority so that processes can be implemented and controlled appropriately.",
  },
  {
    id: "dpi-practice-57",
    question:
      "A board reviews several proposed investments and the organization's relationships with partners to decide where to focus next year. Which governance activity is this?",
    options: ["Evaluate", "Monitor", "Audit", "Operate"],
    answer: "Evaluate",
    ShortExplanation:
      "Evaluate is the governance activity of assessing the organization's strategy, portfolios, and relationships with other parties.",
  },
  {
    id: "dpi-practice-58",
    question:
      "An organization has established policies for information security. Management regularly reviews performance reports to determine whether these policies are being followed and whether objectives are being achieved. Which governance activity is being performed?",
    options: ["Evaluate", "Direct", "Monitor", "Plan"],
    answer: "Monitor",
    ShortExplanation:
      "Monitor is the governance activity of overseeing organizational performance and compliance with policies, directions, and objectives.",
  },
  {
    id: "dpi-practice-59",
    question:
      "A financial institution identifies a risk that a critical supplier may fail to meet its contractual obligations. The organization assesses the likelihood and impact of the risk and develops contingency plans. Which activity is being performed?",
    options: [
      "Risk management",
      "Value stream mapping",
      "Organizational change management",
      "Performance reporting",
    ],
    answer: "Risk management",
    ShortExplanation:
      "Risk management involves identifying, assessing, and treating risks that could affect the achievement of organizational objectives.",
  },
  {
    id: "dpi-practice-60",
    question:
      "A company introduces strict approval requirements for every minor operational activity. Employees spend more time obtaining approvals than delivering services. What should management do?",
    options: [
      "Review the controls to ensure they are sufficient but not excessive",
      "Introduce additional approval levels",
      "Remove every organizational control",
      "Require executive approval for all operational activities",
    ],
    answer:
      "Review the controls to ensure they are sufficient but not excessive",
    ShortExplanation:
      "Governance and compliance controls should provide appropriate assurance without introducing unnecessary bureaucracy or obstructing value creation.",
  },
  {
    id: "dpi-practice-61",
    question:
      "An organization wants to improve a service that frequently experiences delays. The management team begins by identifying the problem, understanding its causes, and determining what improvement is needed. Which model should guide this work?",
    options: [
      "Continual improvement model",
      "Incident management model",
      "Service request model",
      "Governance model",
    ],
    answer: "Continual improvement model",
    ShortExplanation:
      "The continual improvement model provides a structured approach to identifying improvement opportunities, understanding the current state, defining the desired state, and taking action.",
  },
  {
    id: "dpi-practice-62",
    question:
      "A company has identified that its incident resolution process is inefficient. Before implementing any changes, the improvement team documents the existing process and measures its current performance. What is the primary purpose of this activity?",
    options: [
      "To establish a baseline for evaluating improvement",
      "To prove that the current process cannot be changed",
      "To eliminate the need for future measurements",
      "To ensure that all improvement activities are completed immediately",
    ],
    answer: "To establish a baseline for evaluating improvement",
    ShortExplanation:
      "A baseline records the current state and provides a reference point against which the results of an improvement initiative can be measured.",
  },
  {
    id: "dpi-practice-63",
    question:
      "An IT department introduces automation to reduce manual deployment activities. After implementation, the team discovers that deployment time has decreased but deployment failures have increased. What should the team do next?",
    options: [
      "Evaluate the results and identify further improvements",
      "Declare the improvement successful because deployment time decreased",
      "Stop measuring deployment performance",
      "Ignore the increased failure rate",
    ],
    answer: "Evaluate the results and identify further improvements",
    ShortExplanation:
      "Improvement must be evaluated against the intended outcomes and relevant measures. Unintended consequences should be investigated and addressed.",
  },
  {
    id: "dpi-practice-64",
    question:
      "An organization has completed a major improvement initiative. The project team documents what worked, what failed, and what should be done differently in future initiatives. Which activity is this?",
    options: [
      "Lessons learned analysis",
      "Risk acceptance",
      "Governance evaluation",
      "Service catalog management",
    ],
    answer: "Lessons learned analysis",
    ShortExplanation:
      "Lessons learned analysis captures experience from completed work and identifies knowledge that can be applied to future improvement initiatives.",
  },
  {
    id: "dpi-practice-65",
    question:
      "A company wants to encourage continual improvement across all departments. However, employees believe that improvement is solely the responsibility of the quality assurance team. What should management do?",
    options: [
      "Embed continual improvement into everyday work at all organizational levels",
      "Assign all improvement activities to the quality assurance team",
      "Limit improvement initiatives to annual management reviews",
      "Allow only senior executives to suggest improvements",
    ],
    answer:
      "Embed continual improvement into everyday work at all organizational levels",
    ShortExplanation:
      "Continual improvement should become part of the organization's culture and daily activities, rather than being restricted to a specific team or periodic project.",
  },
  {
    id: "dpi-practice-66",
    question:
      "A service desk team identifies that many incidents are caused by unclear user instructions. The team updates its knowledge articles and measures whether repeat incidents decrease. Which improvement principle is demonstrated?",
    options: [
      "Use feedback and measurement to evaluate improvement",
      "Avoid making changes to established procedures",
      "Focus exclusively on financial performance",
      "Implement improvements without evaluating their results",
    ],
    answer: "Use feedback and measurement to evaluate improvement",
    ShortExplanation:
      "Improvement should be informed by feedback and evaluated through relevant measurements to determine whether the intended results have been achieved.",
  },
  {
    id: "dpi-practice-67",
    question:
      "A company has several improvement initiatives running simultaneously. Employees are overwhelmed, and the initiatives compete for the same resources. What should management do?",
    options: [
      "Prioritize improvement initiatives based on value, urgency, and available capacity",
      "Continue all initiatives without changing their schedules",
      "Allow employees to select initiatives without considering organizational priorities",
      "Stop collecting information about improvement initiatives",
    ],
    answer:
      "Prioritize improvement initiatives based on value, urgency, and available capacity",
    ShortExplanation:
      "Improvement initiatives should be prioritized according to organizational value, urgency, resource availability, and their contribution to strategic objectives.",
  },
  {
    id: "dpi-practice-68",
    question:
      "A company repeatedly fixes the same operational problems because different teams do not share improvement findings. Which action would help address this issue?",
    options: [
      "Share lessons learned and establish mechanisms for organizational knowledge reuse",
      "Allow each team to maintain isolated improvement records",
      "Stop documenting improvement activities",
      "Restrict improvement information to senior management",
    ],
    answer:
      "Share lessons learned and establish mechanisms for organizational knowledge reuse",
    ShortExplanation:
      "Sharing lessons learned enables teams to reuse knowledge, avoid repeating mistakes, and embed successful improvements throughout the organization.",
  },
  {
    id: "dpi-practice-69",
    question:
      "A bank plans to introduce a new mobile banking application. Although the technology is ready, employees are concerned that the new application will make their roles redundant. What should management do?",
    options: [
      "Identify employee concerns and develop appropriate communication and change support",
      "Deploy the application immediately without informing employees",
      "Ignore employee concerns because the technology is ready",
      "Cancel the project without assessing the concerns",
    ],
    answer:
      "Identify employee concerns and develop appropriate communication and change support",
    ShortExplanation:
      "Organizational change management addresses the people side of change. Understanding stakeholder concerns and providing appropriate support can reduce resistance and improve adoption.",
  },
  {
    id: "dpi-practice-70",
    question:
      "A company is introducing a new incident management process. Senior management, technical teams, and service desk employees have different interests and levels of influence. What should the change manager do first?",
    options: [
      "Identify and analyze the stakeholders",
      "Send the same technical email to every employee",
      "Begin enforcing the new process immediately",
      "Exclude employees who disagree with the change",
    ],
    answer: "Identify and analyze the stakeholders",
    ShortExplanation:
      "Stakeholder identification and analysis help determine who is affected by a change, their interests, their influence, and how they should be engaged.",
  },
  {
    id: "dpi-practice-71",
    question:
      "A company introduces a new security policy. Employees understand the policy but lack the technical skills to comply with it. What is the most appropriate management response?",
    options: [
      "Provide training and practical support to build the required capabilities",
      "Assume that understanding the policy guarantees compliance",
      "Increase the number of policy documents",
      "Punish all employees who make mistakes during implementation",
    ],
    answer:
      "Provide training and practical support to build the required capabilities",
    ShortExplanation:
      "Effective organizational change management includes developing the knowledge, skills, and capabilities that stakeholders need to adopt a change.",
  },
  {
    id: "dpi-practice-72",
    question:
      "A project manager sends weekly emails about an upcoming system migration. However, employees continue to misunderstand how the migration will affect their daily work. What should the project manager do?",
    options: [
      "Use appropriate communication channels and provide opportunities for questions and feedback",
      "Increase the frequency of identical emails",
      "Stop communicating until the migration is completed",
      "Communicate only with department managers",
    ],
    answer:
      "Use appropriate communication channels and provide opportunities for questions and feedback",
    ShortExplanation:
      "Effective communication requires suitable channels, relevant messages, audience awareness, and feedback mechanisms. Sending more of the same message may not resolve misunderstandings.",
  },
  {
    id: "dpi-practice-73",
    question:
      "An organization introduces a new service management tool. Employees initially adopt it, but usage declines after a few weeks because they encounter difficulties and receive little support. Which action would most directly improve adoption?",
    options: [
      "Establish ongoing support and feedback channels",
      "Stop collecting feedback after deployment",
      "Assume that initial adoption guarantees long-term success",
      "Replace the tool immediately without investigating the problems",
    ],
    answer: "Establish ongoing support and feedback channels",
    ShortExplanation:
      "Feedback channels and ongoing support help identify adoption problems, address stakeholder concerns, and sustain organizational change.",
  },
  {
    id: "dpi-practice-74",
    question:
      "An IT manager reports that the service desk resolved 95% of incidents within the agreed SLA. However, customer satisfaction has declined significantly. What should management conclude?",
    options: [
      "SLA compliance alone may not provide a complete picture of service performance",
      "The service desk is necessarily delivering excellent customer value",
      "Customer satisfaction should be excluded from service measurements",
      "The SLA should be removed because it is no longer useful",
    ],
    answer:
      "SLA compliance alone may not provide a complete picture of service performance",
    ShortExplanation:
      "Measurements should reflect stakeholder needs and intended outcomes. Meeting an SLA does not necessarily mean that customers are receiving the value they expect.",
  },
  {
    id: "dpi-practice-75",
    question:
      "A company measures the number of incidents resolved each day but does not measure whether the incidents recur. Management wants to understand whether the service desk is reducing underlying problems. Which additional metric would be most useful?",
    options: [
      "Incident recurrence rate",
      "Number of employees in the service desk",
      "Number of emails sent to customers",
      "Total number of servers in the organization",
    ],
    answer: "Incident recurrence rate",
    ShortExplanation:
      "The incident recurrence rate helps indicate whether underlying issues are being addressed or whether similar incidents continue to occur.",
  },
  {
    id: "dpi-practice-76",
    question:
      "An organization presents a dashboard containing hundreds of technical metrics to executives. The executives struggle to identify which issues require attention. What should the reporting team do?",
    options: [
      "Tailor reports to stakeholder needs and highlight relevant performance information",
      "Add more technical metrics to the dashboard",
      "Remove all performance measurements",
      "Present only raw operational logs",
    ],
    answer:
      "Tailor reports to stakeholder needs and highlight relevant performance information",
    ShortExplanation:
      "Reporting should provide the right information to the right audience in a form that supports understanding, decision-making, and action.",
  },
  {
    id: "dpi-practice-77",
    question:
      "A company wants to improve its employee onboarding process. The process involves HR, IT, facilities, and the hiring department. What should the improvement team use to visualize the activities and identify delays?",
    options: [
      "Value stream mapping",
      "Risk register",
      "Organizational chart",
      "Configuration management database",
    ],
    answer: "Value stream mapping",
    ShortExplanation:
      "Value stream mapping visualizes the activities, information flows, delays, and dependencies involved in delivering a product or service. It helps identify waste and improvement opportunities.",
  },
  {
    id: "dpi-practice-78",
    question:
      "A bank wants to reduce the time required to resolve customer payment complaints. The improvement team discovers that complaints pass through several departments, with long waiting periods between each handoff. What should the team investigate first?",
    options: [
      "The end-to-end value stream and its sources of delay",
      "The number of employees in the finance department alone",
      "The organization's entire IT infrastructure",
      "The technical performance of unrelated applications",
    ],
    answer: "The end-to-end value stream and its sources of delay",
    ShortExplanation:
      "Examining the end-to-end value stream helps identify delays and inefficiencies across departmental boundaries rather than focusing on isolated activities.",
  },
  {
    id: "dpi-practice-79",
    question:
      "A company is redesigning its software deployment value stream. The team identifies that security testing is performed only after deployment, causing expensive rework when defects are discovered. Which improvement would best address this issue?",
    options: [
      "Integrate appropriate security testing earlier in the value stream",
      "Remove security testing from the deployment process",
      "Increase the number of post-deployment approvals",
      "Allow developers to bypass all security requirements",
    ],
    answer:
      "Integrate appropriate security testing earlier in the value stream",
    ShortExplanation:
      "Improving the flow of value may involve moving appropriate checks earlier in the process. Earlier security testing can identify defects before deployment and reduce rework.",
  },
  {
    id: "dpi-practice-80",
    question:
      "An organization wants to improve the value delivered by its incident management practice. The team reviews the practice's activities, inputs, outputs, resources, and interactions with other practices. What is the primary purpose of this assessment?",
    options: [
      "To identify opportunities to improve the practice and its contribution to value",
      "To ensure that the practice operates independently of the service value system",
      "To eliminate all interactions between practices",
      "To focus exclusively on reducing the number of employees",
    ],
    answer:
      "To identify opportunities to improve the practice and its contribution to value",
    ShortExplanation:
      "Assessing a practice involves examining its capabilities, resources, activities, and interactions to identify opportunities for improvement and better value delivery.",
  },

  {
    id: "dpi-hard3-01",
    question:
      "Following a merger, an organization's objectives have changed significantly. Its existing automated controls were designed for the old objectives. Which action is BEST?",
    options: [
      "Review whether each control still supports the new objectives, then adjust or retire those that do not",
      "Automate the remaining manual controls to reduce the effort of operating them",
      "Add further controls for the new objectives and leave the existing ones unchanged",
      "Keep the existing controls until the next annual audit identifies problems",
    ],
    answer:
      "Review whether each control still supports the new objectives, then adjust or retire those that do not",
    ShortExplanation:
      "Controls should align with and support the organization's objectives. Automating or adding controls before checking alignment would entrench controls that no longer serve a purpose.",
  },
  {
    id: "dpi-hard3-02",
    question:
      "A service desk is measured mainly on average handling time. After the target is tightened, handling time falls sharply, but repeat contacts and complaints increase. What is the MOST LIKELY cause?",
    options: [
      "Agents lack sufficient product training",
      "The measure rewards speed without a balancing measure of whether issues are actually resolved",
      "The handling time target was not ambitious enough",
      "The telephony system is too slow",
    ],
    answer:
      "The measure rewards speed without a balancing measure of whether issues are actually resolved",
    ShortExplanation:
      "A single measure can drive behaviour that harms outcomes. Balanced measures, such as resolution and satisfaction, show whether quicker handling is really delivering value.",
  },
  {
    id: "dpi-hard3-03",
    question:
      "A team lead wants to find out where work is getting stuck in a value stream. Which TWO measures would be MOST useful?\n1. Work item age\n2. Number of staff in the team\n3. Total number of requests received last year\n4. Wait time at each step",
    options: ["1 and 2", "2 and 3", "1 and 4", "3 and 4"],
    answer: "1 and 4",
    ShortExplanation:
      "Work item age shows which items have been in progress too long, and wait time per step shows where work queues. Headcount and annual volume do not locate delays.",
  },
  {
    id: "dpi-hard3-04",
    question:
      "An organization identifies the risk that a flood could take its primary data centre offline. It decides to replicate all data and services to a second site in another region. Which risk treatment does this represent?",
    options: [
      "Avoiding the risk",
      "Transferring the risk",
      "Mitigating the risk",
      "Accepting the risk",
    ],
    answer: "Mitigating the risk",
    ShortExplanation:
      "Replication does not remove the possibility of a flood, but it reduces the impact if one occurs, which is mitigation.",
  },
  {
    id: "dpi-hard3-05",
    question:
      "A new CRM system passed every change authorization check and training was delivered. Yet 80% of sales staff still use spreadsheets, even after several leadership announcements. What is the MOST LIKELY gap?",
    options: [
      "Insufficient technical testing before release",
      "A lack of two-way engagement to understand and address staff concerns",
      "Too many change authority approvals",
      "The CRM system has too few features",
    ],
    answer:
      "A lack of two-way engagement to understand and address staff concerns",
    ShortExplanation:
      "Authorizing the change safely is not the same as getting people to adopt it. Organizational change management needs listening and engagement, not only one-way announcements.",
  },
  {
    id: "dpi-hard3-06",
    question:
      "An improvement was approved and its target agreed. Weeks later nothing has happened because no owner, schedule, or resources have been assigned. Which step of the continual improvement model was NOT performed effectively?",
    options: [
      "What is the vision?",
      "Where are we now?",
      "How do we get there?",
      "Did we get there?",
    ],
    answer: "How do we get there?",
    ShortExplanation:
      "This step turns the target into a plan: the actions, owners, timeline, and resources needed to reach it.",
  },
  {
    id: "dpi-hard3-07",
    question:
      "A customer requires independent confirmation that a provider's practices conform to defined requirements before signing a contract. Which method is BEST?",
    options: [
      "A maturity assessment carried out by the provider's own team",
      "An audit by an independent party",
      "A SWOT analysis",
      "A benchmarking exercise against similar providers",
    ],
    answer: "An audit by an independent party",
    ShortExplanation:
      "Audits check conformance against defined requirements, and independence gives the evidence credibility. Maturity assessments and benchmarks estimate capability rather than confirm conformance.",
  },
  {
    id: "dpi-hard3-08",
    question:
      "A proposal to improve employee wellbeing was rejected because its business case listed only small financial savings. Leaders agree wellbeing is strategically important. What should the business case have done?",
    options: [
      "Exaggerated the financial savings to pass the threshold",
      "Expressed the non-financial benefits as outcomes stakeholders value, together with costs and risks",
      "Left out costs to make the case look stronger",
      "Been submitted without benefits, since wellbeing cannot be measured",
    ],
    answer:
      "Expressed the non-financial benefits as outcomes stakeholders value, together with costs and risks",
    ShortExplanation:
      "Business cases can include non-financial benefits, such as retention or reduced absence, so long as they are stated as outcomes of value and balanced with honest costs and risks.",
  },
  {
    id: "dpi-hard3-09",
    question:
      "To cut costs, an organization switches to a cheaper supplier. Costs fall, but outages increase and customers complain. Which statement BEST explains the situation?",
    options: [
      "Value is determined by cost alone, so the change was successful",
      "The cost saving was achieved at the expense of outcomes and increased risk, so overall value may have fallen",
      "Cheaper suppliers always deliver lower quality",
      "The outages were caused by customers, not the supplier",
    ],
    answer:
      "The cost saving was achieved at the expense of outcomes and increased risk, so overall value may have fallen",
    ShortExplanation:
      "Value depends on outcomes, costs, and risks together. Reducing cost while worsening outcomes and risk does not necessarily increase value.",
  },
  {
    id: "dpi-hard3-10",
    question:
      "A manager is planning a workshop to map the current state of a value stream. Who should take part to produce the most accurate map?",
    options: [
      "Senior management only",
      "Stakeholders from across the value stream, including the people who perform the work",
      "The process owner alone",
      "An external consultant working independently",
    ],
    answer:
      "Stakeholders from across the value stream, including the people who perform the work",
    ShortExplanation:
      "Mapping works best as a group exercise with everyone involved in the value stream, because the people doing the work know where delays and waste occur.",
  },
  {
    id: "dpi-hard3-11",
    question:
      "After a major outage, leadership wants the organization to learn rather than to assign blame. Which approach is BEST?",
    options: [
      "Identify and discipline the individual who made the change",
      "Hold a review that focuses on systemic causes and improvements, and share the findings openly",
      "Keep the findings confidential within senior management",
      "Skip the review so that teams can focus on normal work",
    ],
    answer:
      "Hold a review that focuses on systemic causes and improvements, and share the findings openly",
    ShortExplanation:
      "Learning cultures treat failures as sources of knowledge. A blame-free review of causes encourages people to report problems and propose improvements.",
  },
  {
    id: "dpi-hard3-12",
    question:
      "A team's objective is to cut costs by reducing testing time. Its department's objective is to improve service quality. Which action is BEST?",
    options: [
      "Let the team continue, since cost reduction is also valuable",
      "Resolve the conflict by realigning the team's objective so that it supports the department's objective",
      "Remove the department's objective",
      "Increase the team's budget",
    ],
    answer:
      "Resolve the conflict by realigning the team's objective so that it supports the department's objective",
    ShortExplanation:
      "Objectives at each level must support those of the level above. A conflicting objective undermines alignment and must be corrected.",
  },
  {
    id: "dpi-hard3-13",
    question:
      "A change readiness assessment shows that two departments have low readiness, citing previous failed changes and heavy workloads. What should the organization do BEST?",
    options: [
      "Proceed as planned, since the strategy has been approved",
      "Address the identified factors, for example through engagement, communication, and adjusted timing, before and during the change",
      "Cancel the change permanently",
      "Exclude the two departments from the change",
    ],
    answer:
      "Address the identified factors, for example through engagement, communication, and adjusted timing, before and during the change",
    ShortExplanation:
      "The purpose of a readiness assessment is to highlight what might impede success so it can be addressed early, rather than ignoring or avoiding it.",
  },
  {
    id: "dpi-hard3-14",
    question:
      "A risk register contains 120 identified risks, but none has an owner. What is the MOST LIKELY consequence?",
    options: [
      "Risks will be treated more quickly",
      "No one is accountable for monitoring and treating risks, so they may not be managed",
      "The register will become shorter over time",
      "Regulators will accept the register as complete",
    ],
    answer:
      "No one is accountable for monitoring and treating risks, so they may not be managed",
    ShortExplanation:
      "A risk needs an owner who is responsible for monitoring it and carrying out its treatment. Without owners, risks are recorded but not managed.",
  },
  {
    id: "dpi-hard3-15",
    question:
      "Which is an example of a SUCCESS FACTOR (rather than a KPI or a metric)?",
    options: [
      "Customers can access the portal during business hours",
      "Portal uptime of 99.5% each month",
      "Number of failed logins per day",
      "Average page load time in seconds",
    ],
    answer: "Customers can access the portal during business hours",
    ShortExplanation:
      "A success factor describes a condition that must be achieved for something to be considered successful. The other options are measurements or indicators used to provide evidence.",
  },
  {
    id: "dpi-hard3-16",
    question: "Which is the BEST-formed objective for a service desk team?",
    options: [
      "Improve incident handling",
      "Be better than competitors",
      "Reduce average resolution time for priority 1 incidents from 6 hours to 4 hours by 31 March",
      "Work harder on major incidents",
    ],
    answer:
      "Reduce average resolution time for priority 1 incidents from 6 hours to 4 hours by 31 March",
    ShortExplanation:
      "A good objective is specific, measurable, and time-bound. The other options are vague and cannot be checked.",
  },
  {
    id: "dpi-hard3-17",
    question:
      "An organization adopts DevOps with several deployments each day. Its governance board still reviews changes quarterly. Which adaptation is BEST?",
    options: [
      "Keep the quarterly review and ask teams to batch their changes",
      "Embed governance into delivery through clear policies, automated controls, and frequent outcome-based reporting",
      "Remove governance because DevOps teams are self-managing",
      "Require in-person board approval for every deployment",
    ],
    answer:
      "Embed governance into delivery through clear policies, automated controls, and frequent outcome-based reporting",
    ShortExplanation:
      "Governance should fit the way the organization works. In fast-moving environments it can be continuous and automated, retaining accountability without blocking delivery.",
  },
  {
    id: "dpi-hard3-18",
    question:
      "Several project managers compete for the same specialist staff, so priorities keep changing. What is the BEST way to resolve this?",
    options: [
      "Let the project managers negotiate between themselves",
      "Manage the initiatives as a portfolio and prioritize and sequence them against strategic value and available capacity",
      "Always give priority to the most senior project manager",
      "Hire contractors for every project",
    ],
    answer:
      "Manage the initiatives as a portfolio and prioritize and sequence them against strategic value and available capacity",
    ShortExplanation:
      "Competing for shared resources is a prioritization problem. A portfolio view lets leaders choose by value and capacity and avoid constant task switching.",
  },
  {
    id: "dpi-hard3-19",
    question:
      "A team halves the cycle time of its build step, yet customers see no improvement in delivery time. What is the MOST LIKELY explanation?",
    options: [
      "The throughput measure is being calculated incorrectly",
      "The build step is not where most of the lead time is spent; time is being lost waiting elsewhere",
      "Customers' expectations are too high",
      "The build step was already fully optimized",
    ],
    answer:
      "The build step is not where most of the lead time is spent; time is being lost waiting elsewhere",
    ShortExplanation:
      "Improving a step that is not the constraint does not shorten end-to-end lead time. Queues and waiting elsewhere in the value stream dominate.",
  },
  {
    id: "dpi-hard3-20",
    question:
      "An organization operates in a rapidly changing market and has a three-year strategy. Which approach is BEST to keep its direction relevant?",
    options: [
      "Keep the strategy unchanged for three years to ensure consistency",
      "Review the strategy regularly using feedback and adjust direction and plans as the context changes",
      "Replace the strategy completely every quarter",
      "Let operational teams decide strategy independently",
    ],
    answer:
      "Review the strategy regularly using feedback and adjust direction and plans as the context changes",
    ShortExplanation:
      "Strategy is not a one-off document. Iterating with feedback keeps it aligned with a changing environment without destabilizing the organization.",
  },
  {
    id: "dpi-hard3-21",
    question:
      "Which TWO statements describe an effective culture of continual improvement?\n1. Improvement ideas are accepted only from managers.\n2. Improvement is carried out only through one annual project.\n3. Failures are treated as opportunities to learn.\n4. Improvement is built into everyday work.",
    options: ["1 and 2", "2 and 3", "1 and 4", "3 and 4"],
    answer: "3 and 4",
    ShortExplanation:
      "Improvement culture means everyone contributes, learning is safe, and improvement is part of normal work, not a once-a-year or managers-only activity.",
  },
  {
    id: "dpi-hard3-22",
    question:
      "Which TWO actions are examples of MITIGATING a risk?\n1. Cross-training staff to remove dependency on a single person\n2. Buying insurance against financial loss\n3. Stopping a service altogether\n4. Installing redundant power for a server room",
    options: ["1 and 2", "1 and 4", "2 and 3", "3 and 4"],
    answer: "1 and 4",
    ShortExplanation:
      "Mitigation reduces the likelihood or impact of a risk. Insurance transfers risk, and stopping the service avoids it.",
  },
  {
    id: "dpi-hard3-23",
    question:
      "Which TWO statements about success factors and KPIs are CORRECT?\n1. KPIs replace the need to set objectives.\n2. A success factor describes a condition that must be achieved for success.\n3. Success factors must always be expressed as numbers.\n4. KPIs provide evidence of whether success factors are being achieved.",
    options: ["1 and 2", "2 and 3", "2 and 4", "3 and 4"],
    answer: "2 and 4",
    ShortExplanation:
      "Success factors describe what must be true for success, and KPIs provide evidence of whether that is happening. KPIs support objectives rather than replacing them.",
  },
  {
    id: "dpi-hard3-24",
    question:
      "Which TWO activities are MOST likely to be waste in a value stream?\n1. Waiting for an approval that is almost always granted\n2. Peer review of a high-risk change\n3. Rework caused by unclear requirements\n4. Recording a decision that a regulation requires to be recorded",
    options: ["1 and 2", "1 and 3", "2 and 4", "3 and 4"],
    answer: "1 and 3",
    ShortExplanation:
      "Waiting with little value and rework are classic waste. Peer review of high-risk changes and legally required records contribute to managing risk and compliance.",
  },
  {
    id: "dpi-hard3-25",
    question:
      "Which TWO examples show a governing body performing the 'Direct' governance activity?\n1. Reviewing a dashboard of organizational performance\n2. Assigning responsibility for implementing a new strategy\n3. Issuing a policy on data handling\n4. Assessing options for a possible merger",
    options: ["1 and 2", "2 and 3", "3 and 4", "1 and 4"],
    answer: "2 and 3",
    ShortExplanation:
      "Direct covers assigning responsibility and setting policy. Reviewing dashboards is Monitor, and assessing a merger is Evaluate.",
  },
  {
    id: "dpi-hard3-26",
    question:
      "A ten-year-old policy requires approval for every software configuration change and now blocks the organization's Agile teams. Which action is BEST?",
    options: [
      "Enforce the policy more strictly",
      "Review the policy against current objectives and update it, using guidelines where discretion is appropriate",
      "Remove all policies",
      "Tell teams to ignore the policy when it slows them down",
    ],
    answer:
      "Review the policy against current objectives and update it, using guidelines where discretion is appropriate",
    ShortExplanation:
      "Policies should serve current objectives and be reviewed regularly. Where flexibility is wanted, guidelines allow discretion, while policies stay mandatory.",
  },
  {
    id: "dpi-hard3-27",
    question:
      "Every team's dashboard shows green, yet the organization is missing its main strategic objective. What is the MOST LIKELY cause?",
    options: [
      "Team metrics are not connected to the organization's objectives",
      "The dashboards are updated too frequently",
      "Staff are deliberately falsifying results",
      "The strategic objective is impossible to achieve",
    ],
    answer: "Team metrics are not connected to the organization's objectives",
    ShortExplanation:
      "Without a cascade linking team measures to organizational outcomes, teams can succeed locally while the organization fails to progress.",
  },
  {
    id: "dpi-hard3-28",
    question:
      "Midway through a project, costs have risen by 30% and some of the expected benefits have changed. What should the organization do BEST?",
    options: [
      "Continue, because money has already been spent",
      "Revisit the business case with updated costs, benefits, and risks, and decide whether to continue, change, or stop",
      "Hide the overrun until the project is complete",
      "Cancel the project immediately",
    ],
    answer:
      "Revisit the business case with updated costs, benefits, and risks, and decide whether to continue, change, or stop",
    ShortExplanation:
      "A business case is a living document. Reviewing it against new facts supports an informed decision rather than a reflex to continue or cancel.",
  },
  {
    id: "dpi-hard3-29",
    question:
      "Several enthusiastically launched improvement initiatives have stalled because no time, budget, or leadership support was provided. Which underlying weakness is MOST LIKELY?",
    options: [
      "Weak governance capability to allocate resources and provide leadership",
      "Staff dislike improvement work",
      "Too few metrics are being collected",
      "The organization lacks improvement tools",
    ],
    answer:
      "Weak governance capability to allocate resources and provide leadership",
    ShortExplanation:
      "Sustained improvement relies on governance that allocates resources and provides management and leadership. Enthusiasm alone does not supply these.",
  },
  {
    id: "dpi-hard3-30",
    question:
      "Two teams each meet their own targets, yet customers wait a long time for end-to-end fulfilment of their requests. Which action is BEST?",
    options: [
      "Tighten each team's individual target",
      "Measure and manage the end-to-end value stream with shared objectives",
      "Merge the two teams' reports into one document",
      "Replace the two team leaders",
    ],
    answer:
      "Measure and manage the end-to-end value stream with shared objectives",
    ShortExplanation:
      "Local targets can hide delays at handovers. Thinking holistically means measuring and managing the whole value stream that the customer experiences.",
  },
  {
    id: "dpi-hard3-31",
    question:
      "A regulated organization must be able to show auditors that required checks were performed on every change. Which approach is BEST?",
    options: [
      "Ask staff to keep personal notes of the checks",
      "Build evidence capture into the workflow so that records are produced automatically",
      "Sample a few changes manually just before each audit",
      "Ask managers to sign a statement at the end of the year",
    ],
    answer:
      "Build evidence capture into the workflow so that records are produced automatically",
    ShortExplanation:
      "Compliance is demonstrated by evidence. Capturing it automatically as part of the work is reliable and avoids extra effort.",
  },
  {
    id: "dpi-hard3-32",
    question:
      "A monthly change newsletter has been sent for a year, but a survey shows most staff no longer read it and are often surprised by changes. Which action is BEST?",
    options: [
      "Make the newsletter longer and more detailed",
      "Review audience needs and feedback, then adapt the channels, content, and timing",
      "Send the newsletter weekly",
      "Stop sending change communications",
    ],
    answer:
      "Review audience needs and feedback, then adapt the channels, content, and timing",
    ShortExplanation:
      "No single method works for everyone. Communication should be tailored using feedback, rather than simply increasing volume or frequency.",
  },
  {
    id: "dpi-hard3-33",
    question:
      "Which action by senior leaders BEST supports organizational change management?",
    options: [
      "Delegate the change entirely to the project team",
      "Visibly sponsor the change and behave consistently with its message",
      "Announce the change once and leave the details to managers",
      "Talk only about the benefits and avoid discussing concerns",
    ],
    answer:
      "Visibly sponsor the change and behave consistently with its message",
    ShortExplanation:
      "People watch what leaders do. Visible sponsorship and consistent behaviour build trust and show the change is a genuine priority.",
  },
  {
    id: "dpi-hard3-34",
    question:
      "A department's KPI is 'number of improvement initiatives completed per quarter'. What is the MOST LIKELY unintended result?",
    options: [
      "A stronger focus on the value of each improvement",
      "Many small or low-value initiatives completed just to meet the number",
      "Increased collaboration between teams",
      "A reduction in the number of improvement ideas",
    ],
    answer:
      "Many small or low-value initiatives completed just to meet the number",
    ShortExplanation:
      "Measuring activity rather than outcomes encourages quantity over value. Improvement measures should reflect the benefits delivered.",
  },
  {
    id: "dpi-hard3-35",
    question:
      "A maturity assessment shows most practices at level 2. Leadership demands level 5 in every practice by year-end. Which response is BEST?",
    options: [
      "Accept the demand and start work on all practices at once",
      "Prioritize the practices that most support the vision and set achievable, staged targets",
      "Replace the practice owners",
      "Abandon the assessment because the results are unfavourable",
    ],
    answer:
      "Prioritize the practices that most support the vision and set achievable, staged targets",
    ShortExplanation:
      "Maturity targets should be chosen for their contribution to organizational goals and set at realistic levels, not applied blindly everywhere.",
  },
  {
    id: "dpi-hard3-36",
    question:
      "Two companies merge. Leaders need a shared understanding of how the combined organization will create value for customers and run itself. What should they develop?",
    options: [
      "A single service level agreement",
      "An operating model",
      "A risk register",
      "A benchmarking report",
    ],
    answer: "An operating model",
    ShortExplanation:
      "An operating model represents how an organization co-creates value with customers and other stakeholders and how it runs itself, which is what the merged company needs.",
  },
  {
    id: "dpi-hard3-37",
    question:
      "Which of the following is NOT a characteristic of an effective policy?",
    options: [
      "It explains why it is necessary",
      "It states any exceptions",
      "It is very long and detailed, to cover every possible case",
      "It has an owner and is reviewed regularly",
    ],
    answer: "It is very long and detailed, to cover every possible case",
    ShortExplanation:
      "Effective policies are clear and concise. Trying to cover every case creates complexity and makes the policy hard to follow.",
  },
  {
    id: "dpi-hard3-38",
    question:
      "Which TWO conditions support effective delegation of decision-making?\n1. Staff have defined roles and know their scope of control.\n2. Authority is assigned according to the risk of the decision.\n3. All decisions are escalated to senior managers for consistency.\n4. Authority is delegated without defining any limits.",
    options: ["1 and 2", "2 and 3", "3 and 4", "1 and 4"],
    answer: "1 and 2",
    ShortExplanation:
      "People can decide well within a clear scope, and weighing risk is one way to assign authority. Escalating everything slows work, and unlimited delegation removes control.",
  },
  {
    id: "dpi-hard3-39",
    question:
      "A team reports 30% higher throughput, yet customers with complex requests complain about long waits. Which measure would BEST reveal the problem?",
    options: [
      "Work item age",
      "Team headcount",
      "Average call length",
      "Number of tools in use",
    ],
    answer: "Work item age",
    ShortExplanation:
      "The team may be finishing quick, simple items while complex ones sit unfinished. Work item age exposes items that have been in progress for too long.",
  },
  {
    id: "dpi-hard3-40",
    question:
      "An improvement cut onboarding time successfully, but six months later times have returned to their previous levels. Which action would BEST have prevented this?",
    options: [
      "Delivering more training only",
      "Reinforcing the new methods through policies, training, monitoring, and ongoing ownership",
      "Setting a more ambitious target",
      "Reverting to the old process",
    ],
    answer:
      "Reinforcing the new methods through policies, training, monitoring, and ongoing ownership",
    ShortExplanation:
      "The final step of the continual improvement model is keeping the momentum going. Without reinforcement and ownership, people drift back to old habits.",
  },
];
