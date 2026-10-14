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

// TODO: replace these YouTube search links with your preferred playlists/videos.
// Add a `thumbnailVideoId` to show a real thumbnail; without one a placeholder tile is shown.
let playlist: { url: string; title: string; thumbnailVideoId?: string }[] = [
  {
    url: "https://www.youtube.com/watch?v=I0vQ_VLZTWg",
    title: "Get started With Power BI (Video)",
  },
  {
    url: "https://www.youtube.com/watch?v=FwjaHCVNBWA",
    title: "Power BI for Data Analytics  (Video)",
  },
  {
    url: "https://www.youtube.com/watch?v=i5An7XJtKzY",
    title: "Power BI Full Course  (Video Bootcamp)",
  },
];

// ─── Data ────────────────────────────────────────────────────────────────────

const categories: Category[] = [
  // ───────────────────────── 1. INTRODUCTION ─────────────────────────
  {
    id: "introduction",
    title: "Introduction",
    description:
      "Understand what Power BI is, how its parts fit together, and the typical workflow from raw data to shared insight.",
    accent: "from-[#A16207] to-[#F2C811]",
    accentHex: "#A16207",
    lessons: [
      {
        id: "what-is-power-bi",
        title: "What Is Power BI?",
        body: "Microsoft Power BI is a business intelligence and data visualization platform. It lets you connect to data from many sources, clean and shape it, build a model of how the data relates, and turn it into interactive reports and dashboards that people can explore and share.\n\nPower BI is used by analysts, finance teams, managers, and developers alike. Its goal is to move organizations from scattered spreadsheets and static reports to a single, trusted, self-service view of the numbers that matter.",
        takeaway:
          "Power BI turns data from many sources into interactive, shareable insight, with one platform for preparing, modeling, and presenting it.",
        visual: "checklist",
        visualData: [
          "Connect – pull data from files, databases, cloud services, and APIs",
          "Transform – clean and shape data with Power Query",
          "Model – define relationships and calculations with DAX",
          "Visualize – build interactive reports and dashboards",
          "Share – publish to the Power BI service and collaborate",
        ],
      },
      {
        id: "power-bi-components",
        title: "The Power BI Components",
        body: "Power BI is a family of connected tools. Power BI Desktop is the free Windows application where most report authoring happens: you load data, model it, and design report pages. The Power BI service is the cloud (web) portal where reports are published, refreshed, secured, and shared. Power BI mobile apps let people view reports on phones and tablets.\n\nOther pieces include the on-premises data gateway (for refreshing data that lives inside a private network), Power BI Report Server (for organizations that must keep reports on-premises), and Power BI Embedded (for placing reports inside your own applications). Power BI also sits within Microsoft Fabric, Microsoft's wider analytics platform.",
        takeaway:
          "Build in Power BI Desktop, publish to the Power BI service, and consume anywhere, including on mobile.",
        visual: "table",
        visualData: [
          ["Component", "What it is", "Typically used for"],
          [
            "Power BI Desktop",
            "Free Windows authoring application",
            "Connecting, modeling, and designing reports",
          ],
          [
            "Power BI service",
            "Cloud portal in the browser",
            "Publishing, refreshing, securing, and sharing",
          ],
          [
            "Power BI mobile",
            "Apps for iOS and Android",
            "Viewing reports and alerts on the go",
          ],
          [
            "On-premises data gateway",
            "Bridge to private data sources",
            "Scheduled refresh of on-premises data",
          ],
        ],
      },
      {
        id: "power-bi-workflow",
        title: "The Power BI Workflow",
        body: "Most Power BI projects follow the same loop. You start by getting data, then transform it in Power Query, then model it by defining relationships and measures. Next you visualize it on report pages, publish it to the service, and share it with the people who need it. Feedback from users usually sends you back to an earlier step.\n\nTreating this as a repeating cycle rather than a straight line is important. Good reports evolve: new questions appear, data sources change, and users ask for different views.",
        takeaway:
          "Get data, transform, model, visualize, publish, share, and then iterate on feedback.",
        visual: "diagram-cycle",
        visualData: [
          "Get data",
          "Transform (Power Query)",
          "Model (relationships and DAX)",
          "Visualize (report pages)",
          "Publish (Power BI service)",
          "Share and collaborate",
          "Gather feedback and refine",
        ],
      },
      {
        id: "desktop-interface",
        title: "Getting Around Power BI Desktop",
        body: "Power BI Desktop is organized into views, which you switch between on the left-hand side. Report view is the canvas where you build pages and visuals. Table view shows the data loaded into the model. Model view shows tables and the relationships between them. DAX query view lets you write and run DAX queries against your model.\n\nOn the right you will find the Data pane (your tables, columns, and measures), the Visualizations pane (visual types and formatting options), and the Filters pane. Power BI Desktop runs on Windows, so Mac users usually work with the Power BI service in the browser or use a Windows virtual machine.",
        takeaway:
          "Learn the views (Report, Table, Model, DAX query) and the Data, Visualizations, and Filters panes. Desktop is Windows only.",
      },
    ],
  },

  // ───────────────────────── 2. GET AND TRANSFORM DATA ─────────────────────────
  {
    id: "get-transform-data",
    title: "Get and Transform Data",
    description:
      "Connect to your data, choose the right storage mode, and clean it up in Power Query before it reaches your model.",
    accent: "from-[#0F766E] to-[#14B8A6]",
    accentHex: "#0F766E",
    lessons: [
      {
        id: "connecting-data",
        title: "Connecting to Data Sources",
        body: "Power BI can connect to hundreds of data sources: Excel and CSV files, SQL databases, SharePoint, web pages and APIs, cloud services, and other Power BI semantic models. You start from the Get data option, pick a connector, and choose what to load or transform.\n\nBefore connecting, decide what the report really needs. Bringing in only the tables and columns you will use keeps the model smaller, faster, and easier to understand.",
        takeaway:
          "Connect with the right connector and bring in only the tables and columns you actually need.",
      },
      {
        id: "storage-modes",
        title: "Import, DirectQuery and Live Connection",
        body: "The storage mode decides where the data lives and when it is read. In Import mode, data is loaded and compressed into Power BI's in-memory engine, which gives the fastest report performance but needs scheduled refresh to stay current. In DirectQuery mode, data stays in the source and Power BI sends queries at run time, which suits very large or near real-time data but depends on the speed of the source.\n\nA live connection reads from an existing semantic model (such as one in Power BI or Analysis Services) rather than building a new one. Composite models mix storage modes in one model, and Direct Lake, available with Microsoft Fabric, reads data directly from OneLake. Import is the usual default unless there is a clear reason to choose otherwise.",
        takeaway:
          "Import is fast and the common default. Use DirectQuery or Direct Lake when data is very large or must be near real-time.",
        visual: "table",
        visualData: [
          ["Mode", "Where data lives", "Watch out for"],
          [
            "Import",
            "Loaded into Power BI's in-memory model",
            "Data is only as fresh as the last refresh",
          ],
          [
            "DirectQuery",
            "Stays in the source; queried at run time",
            "Report speed depends on the source; some features are limited",
          ],
          [
            "Live connection",
            "Existing semantic model",
            "You cannot change the model's structure",
          ],
          [
            "Composite",
            "Mix of Import and DirectQuery",
            "More design complexity to manage",
          ],
        ],
      },
      {
        id: "power-query",
        title: "Power Query: Shaping Your Data",
        body: "Power Query Editor is where raw data is cleaned and shaped before it is loaded. Every action you take, such as removing a column, changing a data type, or filtering rows, is recorded as an applied step and written in the M language. These steps replay automatically each time the data refreshes.\n\nCommon transformations include removing duplicates and errors, fixing data types, splitting and merging columns, unpivoting columns into rows, grouping and aggregating, and merging or appending queries. Because the steps are recorded, your cleaning logic is repeatable and visible rather than hidden in manual spreadsheet edits.",
        takeaway:
          "Power Query records every cleaning step so your data preparation is repeatable on every refresh.",
        visual: "checklist",
        visualData: [
          "Remove columns and rows you do not need",
          "Set correct data types for every column",
          "Clean text, fix errors, and handle missing values",
          "Split, merge, or unpivot columns to get tidy data",
          "Merge queries (joins) and append queries (stacking)",
          "Rename steps and queries so others can follow them",
        ],
      },
      {
        id: "query-folding-dataflows",
        title: "Query Folding, Parameters and Dataflows",
        body: "Query folding happens when Power Query translates your transformation steps into a single query that runs at the source, such as SQL. This is much faster than pulling all the data into Power BI first and transforming it there. Performing foldable steps early, and checking where folding stops, can dramatically speed up refresh.\n\nParameters make queries reusable, for example by switching between a development and production server. Dataflows let you run Power Query in the Power BI service so that the same cleaned data can be reused across many reports instead of each report repeating the same preparation.",
        takeaway:
          "Let the source do the work with query folding, and reuse prepared data with parameters and dataflows.",
      },
    ],
  },

  // ───────────────────────── 3. DATA MODELING ─────────────────────────
  {
    id: "data-modeling",
    title: "Data Modeling",
    description:
      "Design a clean star schema, define relationships, and set up the model so that your calculations and visuals work correctly.",
    accent: "from-[#2660A4] to-[#3C8DAD]",
    accentHex: "#2660A4",
    lessons: [
      {
        id: "star-schema",
        title: "Star Schema: Facts and Dimensions",
        body: "A star schema is the recommended shape for Power BI models. Fact tables hold the events or transactions you measure, such as sales, orders, or website visits, and are usually long and narrow. Dimension tables hold the descriptive attributes you slice by, such as customers, products, dates, and regions, and are usually shorter and wider.\n\nA single fact table surrounded by dimension tables is easy to understand, filters predictably, and performs well. Flat, wide tables and tangled many-to-many webs of tables are harder to maintain and are a common source of wrong numbers.",
        takeaway:
          "Model with fact tables in the middle and dimension tables around them. It is simpler, faster, and more accurate.",
        visual: "diagram-layered",
        visualData: {
          "Dimension tables (filter and group by)": [
            "Date",
            "Product",
            "Customer",
            "Region",
          ],
          "Fact table (measure and count)": [
            "Sales",
            "Quantity",
            "Revenue",
            "Foreign keys to each dimension",
          ],
        },
      },
      {
        id: "relationships",
        title: "Relationships, Cardinality and Filter Direction",
        body: "Relationships tell Power BI how tables are connected so that filters flow from one to another. Each relationship has a cardinality: one-to-many is the most common and healthiest, with the 'one' side on a dimension table and the 'many' side on the fact table. Many-to-many and one-to-one relationships exist but should be used deliberately.\n\nFilter direction controls how filters propagate. Single direction (from dimension to fact) is the default and is almost always correct. Bidirectional filtering can solve specific problems but can also create ambiguity and slow performance. Only one relationship between two tables can be active at a time; inactive relationships can be switched on in a measure with the USERELATIONSHIP function.",
        takeaway:
          "Prefer one-to-many relationships with single-direction filtering, and use bidirectional or inactive relationships sparingly.",
        visual: "table",
        visualData: [
          ["Setting", "Recommended default", "When to change it"],
          [
            "Cardinality",
            "One-to-many (dimension to fact)",
            "Many-to-many only when the data truly requires it",
          ],
          [
            "Cross-filter direction",
            "Single",
            "Bidirectional for specific cases, with care",
          ],
          [
            "Active relationship",
            "One active path between two tables",
            "Use USERELATIONSHIP for role-playing dates",
          ],
        ],
      },
      {
        id: "date-table",
        title: "The Date Table",
        body: "Time analysis such as year-to-date, previous year, and rolling averages needs a proper date table: a table with one row for every day in the range you need, with no gaps, plus columns for year, quarter, month, and so on. It should be marked as the date table in the model and related to the date columns in your fact tables.\n\nYou can build a date table with DAX functions such as CALENDAR or CALENDARAUTO, or bring it in from Power Query or your data source. Relying only on the auto date/time feature becomes hard to control as models grow, so most professional models use one shared, explicit date table.",
        takeaway:
          "Create one complete date table, mark it as the date table, and relate it to your facts. Time intelligence depends on it.",
      },
      {
        id: "columns-vs-measures",
        title: "Calculated Columns, Measures and Hierarchies",
        body: "A calculated column is computed row by row when the data is refreshed and is stored in the model, which increases its size. A measure is calculated at query time, based on the current filters, and is not stored. As a rule, use measures for numbers you aggregate (totals, ratios, averages) and use columns only when you need a value to slice, filter, or sort by.\n\nHierarchies group columns into drill paths such as Year, Quarter, Month, Day, or Category, Subcategory, Product. Good housekeeping also matters: hide key and technical columns, give friendly names, set data categories and default summarization, and organize measures into a dedicated folder or table so report builders can find them.",
        takeaway:
          "Use measures for aggregations and columns for slicing. Hide technical fields and name everything clearly.",
        visual: "table",
        visualData: [
          ["", "Calculated column", "Measure"],
          [
            "When calculated",
            "At data refresh, row by row",
            "At query time, based on filter context",
          ],
          ["Stored in model", "Yes, increases model size", "No"],
          [
            "Best for",
            "Slicers, axes, filters, sorting",
            "Totals, ratios, KPIs, and aggregations",
          ],
        ],
      },
    ],
  },

  // ───────────────────────── 4. DAX ─────────────────────────
  {
    id: "dax",
    title: "DAX Fundamentals",
    description:
      "Learn the formula language of Power BI: measures, filter context, CALCULATE, and time intelligence.",
    accent: "from-[#7A4DFF] to-[#4F7CFF]",
    accentHex: "#7A4DFF",
    lessons: [
      {
        id: "dax-basics",
        title: "DAX Basics: Measures and Syntax",
        body: "DAX (Data Analysis Expressions) is the formula language used to create measures, calculated columns, and calculated tables in Power BI. A DAX formula refers to tables and columns, such as Sales[Amount], and uses functions to aggregate and calculate them.\n\nThe simplest and most important DAX skill is writing a good measure. Start with basic aggregations like SUM, AVERAGE, COUNT, and DISTINCTCOUNT, then build more complex measures on top of them. Reusing measures inside other measures keeps your logic in one place and your model easier to maintain.",
        takeaway:
          "Write simple base measures first, then build more advanced measures on top of them.",
        visual: "code-block",
        visualData:
          "Total Sales = SUM ( Sales[Amount] )\n\nOrders = DISTINCTCOUNT ( Sales[OrderID] )\n\nAverage Order Value =\nDIVIDE ( [Total Sales], [Orders] )",
      },
      {
        id: "filter-row-context",
        title: "Filter Context and Row Context",
        body: "Understanding context is the key to understanding DAX. Filter context is the set of filters applied to a calculation at that moment: the slicers a user picked, the row and column of a visual, and any filters in the report. The same measure returns different results in each cell of a visual because the filter context is different in each one.\n\nRow context exists when a formula is evaluated one row at a time, such as in a calculated column or inside an iterator function like SUMX. Row context does not automatically filter other tables; that happens through filter context. Most confusing DAX results come from not being sure which context is active.",
        takeaway:
          "Filter context decides which rows a measure sees. Row context evaluates one row at a time. Know which one you are in.",
      },
      {
        id: "calculate",
        title: "CALCULATE and Iterators",
        body: "CALCULATE is the most powerful function in DAX. It evaluates an expression after changing the filter context, letting you add, replace, or remove filters. This is how you build measures such as sales for a specific region, sales ignoring a slicer, or sales for a specific product category.\n\nIterator functions such as SUMX, AVERAGEX, and RANKX go through a table row by row, evaluate an expression for each row, and then aggregate the results. They are needed when the calculation must happen at the row level before aggregation, for example revenue as quantity times price.",
        takeaway:
          "CALCULATE changes the filter context. Iterators like SUMX calculate row by row and then aggregate.",
        visual: "code-block",
        visualData:
          'Nigeria Sales =\nCALCULATE ( [Total Sales], Customer[Country] = "Nigeria" )\n\nSales All Regions =\nCALCULATE ( [Total Sales], REMOVEFILTERS ( Region ) )\n\nRevenue =\nSUMX ( Sales, Sales[Quantity] * Sales[UnitPrice] )',
      },
      {
        id: "time-intelligence",
        title: "Time Intelligence",
        body: "Time intelligence functions make period-based comparisons straightforward: year-to-date, month-to-date, same period last year, and rolling windows. They depend on having a complete, marked date table that is related to your fact table.\n\nA typical pattern is to create a base measure, then a prior-period measure using CALCULATE with a time intelligence function, and finally a comparison such as year-over-year percentage change. Using DIVIDE instead of the division operator safely handles divide-by-zero cases.",
        takeaway:
          "Time intelligence needs a proper date table. Build base, prior-period, and comparison measures in layers.",
        visual: "code-block",
        visualData:
          "Sales YTD =\nTOTALYTD ( [Total Sales], 'Date'[Date] )\n\nSales LY =\nCALCULATE ( [Total Sales], SAMEPERIODLASTYEAR ( 'Date'[Date] ) )\n\nYoY % =\nDIVIDE ( [Total Sales] - [Sales LY], [Sales LY] )",
      },
      {
        id: "dax-best-practices",
        title: "Writing Clean, Reliable DAX",
        body: "Variables, declared with VAR and returned with RETURN, make formulas easier to read, avoid repeating the same calculation, and often improve performance. Format your code, use clear measure names, and add comments where the logic is not obvious.\n\nWhen a result looks wrong, test step by step: check the measure in a simple table visual, check the relationships and filters, and break a complex measure into smaller ones. Prefer measures to calculated columns, and avoid heavy row-by-row logic on very large tables when a simpler aggregation would do.",
        takeaway:
          "Use variables, clear names, and small reusable measures. Debug by testing each piece separately.",
        visual: "checklist",
        visualData: [
          "Use VAR and RETURN to name intermediate results",
          "Use DIVIDE instead of the / operator",
          "Build complex measures from smaller base measures",
          "Use a dedicated measures table or folder",
          "Format and comment your DAX so others can read it",
          "Test measures in a simple table before using them in visuals",
        ],
      },
    ],
  },

  // ───────────────────────── 5. VISUALIZE ─────────────────────────
  {
    id: "visualize",
    title: "Visualize and Design Reports",
    description:
      "Choose the right visuals, design clear and accessible report pages, and add interactivity that helps people find answers.",
    accent: "from-[#F97316] to-[#F59E0B]",
    accentHex: "#F97316",
    lessons: [
      {
        id: "choosing-visuals",
        title: "Choosing the Right Visual",
        body: "Every visual should answer a question. Start with what the viewer needs to know, and then pick the chart that shows it most clearly. Bar and column charts compare categories, line charts show trends over time, and cards highlight single key numbers. Tables and matrices show detail and exact values, while maps show geographic patterns.\n\nAvoid visuals that look impressive but are hard to read. Pie and donut charts work only with a few categories, and 3D effects and heavy decoration distract from the data. When in doubt, choose the simpler chart.",
        takeaway:
          "Match the visual to the question. When in doubt, choose the simpler chart.",
        visual: "table",
        visualData: [
          ["You want to show", "Good choice", "Notes"],
          [
            "Comparison between categories",
            "Bar or column chart",
            "Sort bars so the pattern is obvious",
          ],
          ["Trend over time", "Line or area chart", "Use a proper date axis"],
          [
            "A single key number",
            "Card or KPI visual",
            "Add context such as target or change",
          ],
          [
            "Share of a small whole",
            "Pie or donut chart",
            "Keep to about five categories or fewer",
          ],
          [
            "Exact values and detail",
            "Table or matrix",
            "Use sparingly and format clearly",
          ],
        ],
      },
      {
        id: "report-design",
        title: "Report Layout and Design Principles",
        body: "A good report page has a clear visual hierarchy. Put the most important numbers and insights at the top left, group related visuals together, and leave white space so the page can breathe. Keep the number of visuals per page manageable, and give each page one clear purpose.\n\nUse color deliberately: a consistent theme, one highlight color for what matters, and enough contrast for readability. Use clear titles that say what the visual shows, consistent formatting for numbers and dates, and a theme file so every report in your organization looks consistent.",
        takeaway:
          "Give each page one purpose, put key numbers first, use color deliberately, and keep formatting consistent.",
        visual: "checklist",
        visualData: [
          "One clear purpose per report page",
          "Key numbers and KPIs at the top",
          "Related visuals grouped and aligned on a grid",
          "Consistent theme, fonts, and number formats",
          "Clear titles and labels in plain language",
          "Enough white space and no unnecessary decoration",
        ],
      },
      {
        id: "interactivity",
        title: "Slicers, Drill-Through and Bookmarks",
        body: "Interactivity lets viewers explore the data themselves. Slicers filter the whole page or report, and by default selecting a data point in one visual cross-filters or cross-highlights the others. You can control these interactions on each visual. Drill-down moves through a hierarchy, while drill-through lets a user jump from a summary to a detailed page already filtered to the item they selected.\n\nBookmarks save a particular state of a page, including filters and visibility, and can be linked to buttons to build navigation or toggles. Report page tooltips show a mini report when hovering over a data point, and field parameters let users switch the measure or dimension a visual displays.",
        takeaway:
          "Use slicers, drill-through, bookmarks, and tooltips to let people explore without cluttering the page.",
      },
      {
        id: "formatting-accessibility",
        title: "Conditional Formatting and Accessibility",
        body: "Conditional formatting uses rules or measures to change colors, icons, or data bars based on values, which helps readers spot good and bad results quickly. Use it to highlight exceptions, not to color everything.\n\nAccessible reports work for everyone. Add alt text to visuals, set a logical tab order, make sure there is enough color contrast, and do not rely on color alone to carry meaning. Check how the report looks on the phone layout, since many users will open it on a mobile device.",
        takeaway:
          "Use conditional formatting to highlight what matters, and design for accessibility and mobile from the start.",
      },
    ],
  },

  // ───────────────────────── 6. PUBLISH AND SHARE ─────────────────────────
  {
    id: "publish-share",
    title: "Publish, Share and Secure",
    description:
      "Move from Desktop to the Power BI service: workspaces, refresh, sharing, apps, and row-level security.",
    accent: "from-[#6D2E46] to-[#9B4D57]",
    accentHex: "#6D2E46",
    lessons: [
      {
        id: "power-bi-service",
        title: "The Power BI Service and Workspaces",
        body: "When a report is ready, you publish it from Power BI Desktop to a workspace in the Power BI service. A workspace is a shared space where a team creates, manages, and organizes semantic models, reports, and dashboards.\n\nIt is important to understand the difference between the main content types. A semantic model is the data and model behind your reports. A report is one or more pages of visuals built on a semantic model. A dashboard is a single page of tiles pinned from one or more reports, available in the service, giving an at-a-glance overview.",
        takeaway:
          "Publish to a workspace. Know the difference between semantic models, reports, and dashboards.",
        visual: "table",
        visualData: [
          ["Item", "What it is", "Where you create it"],
          [
            "Semantic model",
            "The data, relationships, and measures",
            "Power BI Desktop or the service",
          ],
          [
            "Report",
            "Multi-page, interactive visuals on a model",
            "Power BI Desktop or the service",
          ],
          ["Dashboard", "Single page of pinned tiles", "Power BI service only"],
        ],
      },
      {
        id: "refresh-gateways",
        title: "Scheduled Refresh and Gateways",
        body: "Reports built with Import mode show data from the last refresh. In the service you can set a scheduled refresh so that your data updates automatically. How often you can refresh depends on your license and capacity.\n\nIf your data lives in a private network or on-premises server, the service cannot reach it directly. An on-premises data gateway is installed inside your network to act as a secure bridge. Credentials, privacy levels, and refresh failures are managed in the semantic model settings, and refresh failures should be monitored so people are not looking at stale numbers.",
        takeaway:
          "Schedule refresh to keep Import data current, and use a gateway for on-premises sources.",
      },
      {
        id: "sharing-roles",
        title: "Sharing, Apps and Workspace Roles",
        body: "There are several ways to share content. You can share a report directly with individuals, give people access through workspace roles, or publish a workspace app: a packaged, read-only collection of reports and dashboards for a wider audience. Apps are usually the best way to distribute finished content to many consumers.\n\nWorkspace roles control what people can do: Admin has full control, Member can manage and publish content, Contributor can create and edit content, and Viewer can only view. Giving people the lowest role that lets them do their job, and keeping developers separate from consumers, keeps content safer and tidier.",
        takeaway:
          "Distribute finished content through apps, and give each person the lowest workspace role they need.",
        visual: "table",
        visualData: [
          ["Role", "Typical ability"],
          [
            "Admin",
            "Full control of the workspace, including access and settings",
          ],
          ["Member", "Add people, publish, and manage content"],
          ["Contributor", "Create, edit, and delete content they work on"],
          ["Viewer", "View content only"],
        ],
      },
      {
        id: "rls-security",
        title: "Row-Level Security and Data Protection",
        body: "Row-level security (RLS) restricts which rows of data a person can see. You define roles in Power BI Desktop with DAX filter expressions, for example letting each regional manager see only their own region, and then assign users or groups to those roles in the service. RLS applies to people with the Viewer role; users who can edit the workspace content are not restricted by it.\n\nOther protection features include sensitivity labels from Microsoft Purview, which classify and protect data, and tenant settings that control who can export or share content. Security should be designed with the model, not added at the end.",
        takeaway:
          "Define RLS with DAX roles in Desktop, assign members in the service, and plan security with the model from the start.",
        visual: "diagram-cycle",
        visualData: [
          "Define roles with DAX filters in Desktop",
          "Publish the model to the service",
          "Assign users or groups to roles",
          "Test with View as role",
          "Monitor and review access",
        ],
      },
    ],
  },

  // ───────────────────────── 7. PERFORMANCE AND GOVERNANCE ─────────────────────────
  {
    id: "performance-governance",
    title: "Performance and Governance",
    description:
      "Keep reports fast, trustworthy, and manageable at scale, and see how all the pieces come together.",
    accent: "from-[#B91C1C] to-[#EF4444]",
    accentHex: "#B91C1C",
    lessons: [
      {
        id: "performance-optimization",
        title: "Performance Optimization",
        body: "Most slow Power BI reports are slow for predictable reasons: oversized models, complex or inefficient DAX, too many visuals on a page, or a slow data source. The most effective fixes are at the model level. Remove unused columns and tables, reduce high-cardinality columns, use a star schema, and prefer measures over calculated columns.\n\nUse Performance Analyzer in Power BI Desktop to see how long each visual takes to load and which part is the bottleneck. External tools such as DAX Studio can help analyse queries in depth. For very large data, techniques such as incremental refresh and aggregations reduce the amount of data processed.",
        takeaway:
          "Fix performance in the model first, and use Performance Analyzer to find the real bottleneck.",
        visual: "checklist",
        visualData: [
          "Remove columns and tables you do not use",
          "Reduce high-cardinality columns and avoid unnecessary precision",
          "Use a star schema with one-to-many relationships",
          "Keep the number of visuals per page reasonable",
          "Use Performance Analyzer to measure visual load times",
          "Use incremental refresh and aggregations for very large data",
        ],
      },
      {
        id: "governance-certification",
        title: "Governance and Trusted Data",
        body: "As Power BI use grows, organizations need governance so people can find and trust the right data. Good governance defines who can create, publish, and share content, how workspaces are organized, and how data sources are approved. Promoted and certified semantic models help users recognize which data is endorsed and reliable.\n\nA healthy pattern is to have a small number of well-maintained shared semantic models that many reports build on, instead of every analyst building their own copy of the same data with slightly different numbers. Naming standards, documentation, and clear ownership of each model prevent confusion.",
        takeaway:
          "Share trusted, endorsed semantic models, and set clear rules for ownership, naming, and publishing.",
      },
      {
        id: "lifecycle-deployment",
        title: "Development Lifecycle and Deployment",
        body: "Professional teams manage reports through a development lifecycle rather than editing live content. Work is done in a development workspace, tested in a test workspace, and released to production. Deployment pipelines in the Power BI service move content between these stages and can adjust settings such as data source parameters for each environment.\n\nVersion control for Power BI projects, using the Power BI Project (PBIP) format and Git integration, makes changes trackable and allows teams to collaborate more safely. Even small teams benefit from keeping development and production content separate.",
        takeaway:
          "Develop, test, and release in separate stages, using deployment pipelines and version control where possible.",
        visual: "diagram-cycle",
        visualData: [
          "Develop in Desktop",
          "Publish to development workspace",
          "Test and review",
          "Promote to production",
          "Monitor usage and refresh",
          "Improve based on feedback",
        ],
      },
      {
        id: "power-bi-success-factors",
        title: "Bringing It Together: Success Factors for Power BI",
        body: "Effective Power BI work relies on a few consistent habits. Data is cleaned in Power Query, modeled as a star schema, and calculated with clear, reusable measures. Reports are designed around the questions viewers need to answer, published through workspaces and apps, and secured with the right roles and RLS.\n\nCommon failure points include loading every column from every table, building huge flat tables, writing complex logic in calculated columns, cramming too many visuals on one page, ignoring refresh failures, and letting every analyst create a separate version of the same numbers. Recognizing these patterns early helps you avoid them.",
        takeaway:
          "Clean data, a star schema, clear measures, purposeful design, and trusted sharing are the pillars of effective Power BI.",
        visual: "checklist",
        visualData: [
          "Data is cleaned and shaped in Power Query",
          "The model is a star schema with clear relationships",
          "Measures are simple, reusable, and well named",
          "Report pages have one clear purpose and consistent design",
          "Content is shared through workspaces and apps with proper roles",
          "Refresh, performance, and security are monitored",
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

// Renders DAX / M snippets for the "code-block" visual
function CodeBlock({ data, accentHex }: { data: string; accentHex: string }) {
  return (
    <div
      className='mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900'
      style={{ borderTop: `3px solid ${accentHex}` }}
    >
      <pre className='overflow-x-auto p-5 text-sm leading-7 text-slate-100'>
        <code>{data}</code>
      </pre>
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
      {lesson.visual === "code-block" && lesson.visualData && (
        <CodeBlock data={lesson.visualData as string} accentHex={accentHex} />
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
              Microsoft Power BI
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
              item.thumbnailVideoId ?? item.url.match(/[?&]v=([^&]+)/)?.[1];

            return (
              <Link
                className='relative mb-4 block overflow-hidden rounded-2xl border border-slate-200 w-80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg'
                href={item.url}
                target='_blank'
                rel='noreferrer'
                key={`${item.title}-${i}`}
              >
                {videoId ? (
                  <Image
                    src={`https://img.youtube.com/vi/${videoId}/0.jpg`}
                    alt={item.title}
                    width={320}
                    height={180}
                    className='h-52 w-full object-cover '
                  />
                ) : (
                  <div className='flex h-52 w-full items-center justify-center bg-gradient-to-br from-[#A16207] to-[#F2C811]'>
                    <span className='flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm'>
                      <MdPlayArrow size={40} />
                    </span>
                  </div>
                )}
                <div className=' flex flex-col items-center justify-center  p-4 text-center text-black'>
                  <p className='text-lg font-bold leading-snug'>{item.title}</p>
                </div>
              </Link>
            );
          })}
          <div className='border-t border-slate-200 pt-10 pb-16 w-full '>
            <p className='text-xs font-bold uppercase tracking-widest text-slate-400 mb-4'>
              Practice With Sample PL-300 Questions
            </p>
            <div className=''>
              {[
                {
                  // TODO: point this at your Power BI practice exam route
                  path: "/page/powerbi-pl-300",
                  label: "Exam Mode",
                  description:
                    "Test yourself with practice questions for the PL-300 Power BI Data Analyst exam.",
                  IconName: MdOutlineQuiz,
                  accent: "from-[#A16207] to-[#E0A800]",
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
                            POWER BI
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
