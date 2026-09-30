"use client";

import Footer from "@/app/components/Footer";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { BiBook } from "react-icons/bi";
import {
  MdBookOnline,
  MdCheckBox,
  MdOutlineQuiz,
  MdPlayArrow,
} from "react-icons/md";
import { useRouter } from "next/navigation";
import NavBar from "@/app/components/NavBar";
import { IoBook } from "react-icons/io5";
import Image from "next/image";
import thumbnailUrl from "../../../../public/images/thumbnail.avif";

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
  learningPlaylistUrl?: urlObject[];
};
type urlObject = {
  url: string;
  title: string;
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

// ─── Data ────────────────────────────────────────────────────────────────────

const categories: Category[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description:
      "Learn the Excel interface, core navigation, and the building blocks every spreadsheet is made of.",
    accent: "from-[#217346] to-[#33C481]",
    accentHex: "#217346",
    lessons: [
      {
        id: "excel-interface",
        title: "The Excel Interface",
        body: "Excel organizes everything around the Ribbon, the Formula Bar, and the Grid. The Ribbon groups commands into tabs like Home, Insert, Page Layout, Formulas, Data, Review, and View. The Formula Bar shows the raw content of the active cell — including formulas — while the grid shows the calculated result.\n\nA workbook is the file itself (.xlsx), and it can contain multiple worksheets (tabs) at the bottom of the screen. Each worksheet is a grid of cells identified by a column letter and row number, such as B4. Understanding this vocabulary — workbook, worksheet, cell, range — is the foundation for everything that follows.",
        takeaway:
          "Workbook > Worksheet > Cell/Range. The Formula Bar shows what you typed; the grid shows the result.",
      },
      {
        id: "cells-ranges-references",
        title: "Cells, Ranges, and References",
        body: "A cell reference like A1 points to a single cell. A range like A1:A10 refers to a block of cells. References can be relative (A1), absolute ($A$1), or mixed ($A1 or A$1) — this matters enormously once you start copying formulas across rows and columns.\n\nA relative reference shifts when copied to a new cell. An absolute reference stays locked to the same cell no matter where it's copied. Mixed references lock only the row or only the column. Getting this right is one of the most common sources of formula errors for beginners.",
        takeaway:
          "Use $ to lock a reference. Relative references shift when copied; absolute references don't.",
        visual: "table",
        visualData: [
          ["Reference type", "Example", "Behavior when copied"],
          ["Relative", "A1", "Shifts with the new cell position"],
          ["Absolute", "$A$1", "Stays fixed on both row and column"],
          ["Mixed (column locked)", "$A1", "Column fixed, row shifts"],
          ["Mixed (row locked)", "A$1", "Row fixed, column shifts"],
        ],
        learningPlaylistUrl: [
          {
            url: "https://www.youtube.com/playlist?list=PLlKpQrBME6xLDnoK7OovAVVsGNV55MS3K",
            title: "Excel For Beginners Playlist (Video)",
          },
          {
            url: "https://www.youtube.com/watch?v=fhVXfSjLb6I",
            title:
              "Build an Interactive Excel Dashboard Using PivotTables (Video)",
          },
          {
            url: "https://www.youtube.com/watch?v=jwghaZG9qes",
            title:
              "Create Professional Excel Dashboard in Just 10 Minutes (Video)",
          },
          {
            url: "https://www.youtube.com/watch?v=opJgMj1IUrc",
            title: "Full Beginner Project in Excel (Video)",
          },
          {
            url: "https://www.youtube.com/watch?v=v2oNWja7M2E&list=PLmejDGrsgFyBCxF37lewZtX6c1kJXyLt3",
            title: "Beginner to Pro FREE Excel Data Analysis Course (Video)",
          },
        ],
      },
      {
        id: "entering-editing-data",
        title: "Entering and Editing Data",
        body: "Excel automatically detects the type of data you enter — text, number, date, or currency — and formats it accordingly. You can override this with explicit number formatting from the Home tab or Format Cells dialog (Ctrl+1).\n\nUseful basics: Tab moves right, Enter moves down, Ctrl+Enter fills the same value into a selected range, and double-clicking a cell's fill handle auto-fills a series (like dates or sequential numbers) down a column. Undo (Ctrl+Z) and Redo (Ctrl+Y) are essential safety nets while learning.",
        takeaway:
          "Let Excel auto-detect data types, but confirm formatting via Format Cells (Ctrl+1) when it matters.",
      },
      {
        id: "basic-navigation-shortcuts",
        title: "Navigation and Essential Shortcuts",
        body: "Speed in Excel comes from the keyboard, not the mouse. Ctrl+Arrow jumps to the edge of a data block. Ctrl+Shift+Arrow selects to the edge of a data block. Ctrl+Home returns to A1, and Ctrl+End jumps to the last used cell.\n\nOther high-value shortcuts: Ctrl+C/Ctrl+V to copy/paste, Ctrl+1 for Format Cells, F2 to edit a cell in place, F4 to repeat the last action (or toggle reference type while editing a formula), and Alt+= to auto-sum a selected range.",
        takeaway:
          "Ctrl+Arrow and Ctrl+Shift+Arrow are the two shortcuts that will save you the most time as a beginner.",
        visual: "checklist",
        visualData: [
          "Ctrl+Arrow — jump to the edge of a data block",
          "Ctrl+Home / Ctrl+End — jump to A1 / last used cell",
          "Ctrl+1 — open Format Cells",
          "F2 — edit the active cell",
          "F4 — repeat last action / cycle reference type",
          "Alt+= — AutoSum the selected range",
        ],
      },
    ],
  },

  {
    id: "core-formulas",
    title: "Core Formulas & Functions",
    description:
      "Build fluency with the everyday functions that make Excel a calculator, not just a grid.",
    accent: "from-[#2660A4] to-[#3C8DAD]",
    accentHex: "#2660A4",
    lessons: [
      {
        id: "formula-basics",
        title: "Formula Basics and Order of Operations",
        body: "Every formula starts with an equals sign (=). Excel follows standard mathematical order of operations: parentheses first, then exponents, then multiplication/division, then addition/subtraction (PEMDAS). When in doubt, use parentheses to make your intent explicit.\n\nFormulas can reference other cells, other worksheets (Sheet2!A1), or even other workbooks. Excel recalculates automatically whenever a referenced cell changes, which is the core reason spreadsheets are so powerful for modeling and what-if analysis.",
        takeaway:
          "A formula is a live relationship, not a static value. Use parentheses to control calculation order explicitly.",
      },
      {
        id: "math-aggregate-functions",
        title: "SUM, AVERAGE, COUNT, and Friends",
        body: "SUM, AVERAGE, MIN, and MAX are the workhorses of basic analysis. COUNT counts numeric cells, COUNTA counts non-empty cells (including text), and COUNTBLANK counts empty ones — mixing these up is a very common beginner mistake.\n\nConditional versions extend these: SUMIF/SUMIFS and COUNTIF/COUNTIFS apply a condition before summing or counting, while AVERAGEIF/AVERAGEIFS do the same for averages. The 'S' at the end (SUMIFS vs SUMIF) means the function supports multiple criteria across multiple ranges, not just one.",
        takeaway:
          "COUNT ≠ COUNTA ≠ COUNTBLANK. Use the *IFS versions whenever you need more than one condition.",
        visual: "table",
        visualData: [
          ["Function", "Purpose"],
          ["SUM / SUMIFS", "Total values / total values meeting condition(s)"],
          [
            "AVERAGE / AVERAGEIFS",
            "Mean of values / mean meeting condition(s)",
          ],
          ["COUNT", "Count of numeric cells"],
          ["COUNTA", "Count of non-empty cells (any type)"],
          ["COUNTIFS", "Count of cells meeting multiple conditions"],
        ],
      },
      {
        id: "logical-functions",
        title: "Logical Functions: IF, AND, OR, IFS",
        body: "IF(condition, value_if_true, value_if_false) is the single most useful function to master early — it lets a cell make a decision. AND and OR combine multiple conditions: AND requires all to be true, OR requires at least one.\n\nNested IFs (an IF inside another IF) can handle multiple outcomes, but they get hard to read quickly. IFS(condition1, result1, condition2, result2, ...) solves this by evaluating conditions in order and returning the first match, which is far more readable than deeply nested IFs.",
        takeaway:
          "Prefer IFS over deeply nested IF statements once you have more than two outcomes to handle.",
      },
      {
        id: "text-date-functions",
        title: "Text and Date Functions",
        body: 'Text functions clean and reshape data: LEFT/RIGHT/MID extract characters from a string, LEN gives its length, TRIM removes extra spaces, CONCAT or the & operator joins text, and UPPER/LOWER/PROPER fix casing. TEXT() formats a number or date as a display string, e.g. TEXT(A1,"yyyy-mm-dd").\n\nDate functions are essential for reporting: TODAY() and NOW() return the current date/time, DATEDIF calculates the difference between two dates, and YEAR/MONTH/DAY extract components from a date. Remember that Excel stores dates internally as serial numbers, which is why they can be added, subtracted, and compared like numbers.',
        takeaway:
          "Dates are numbers under the hood — that's what makes DATEDIF and date arithmetic possible.",
      },
      {
        id: "lookup-functions",
        title: "VLOOKUP, INDEX/MATCH, and XLOOKUP",
        body: "VLOOKUP(lookup_value, table_array, col_index, [exact_match]) searches down the first column of a range and returns a value from a specified column to the right. It's widely used but has a key limitation: it can only look to the right of the lookup column.\n\nINDEX/MATCH overcomes this by separating the two operations — MATCH finds the position of a value, and INDEX returns the value at that position — allowing lookups in any direction. XLOOKUP, available in modern Excel, replaces both: it looks up in any direction, defaults to exact match, and has a built-in argument for handling not-found results gracefully.",
        takeaway:
          "XLOOKUP is the modern default when available. INDEX/MATCH is the reliable fallback in older files or shared workbooks.",
        visual: "diagram-layered",
        visualData: {
          VLOOKUP: [
            "looks right only",
            "sensitive to column insertions",
            "simple syntax",
          ],
          "INDEX/MATCH": [
            "looks any direction",
            "resilient to column changes",
            "two functions combined",
          ],
          XLOOKUP: [
            "looks any direction",
            "exact match by default",
            "built-in if_not_found handling",
          ],
        },
      },
    ],
  },

  {
    id: "data-management",
    title: "Data Management & Cleaning",
    description:
      "Sort, filter, validate, and clean raw data so it's ready for reliable analysis.",
    accent: "from-[#1F8A70] to-[#2CB67D]",
    accentHex: "#1F8A70",
    lessons: [
      {
        id: "sorting-filtering",
        title: "Sorting and Filtering",
        body: "Sorting reorders rows based on one or more columns, while filtering temporarily hides rows that don't meet a condition without deleting any data. Both operate on a defined table or range and require consistent column headers to work reliably.\n\nMulti-level sort (Data > Sort) lets you sort by a primary column and then break ties with secondary columns. AutoFilter adds dropdown arrows to headers for quick, ad-hoc filtering, while advanced filters allow more complex, multi-condition criteria defined in a separate criteria range.",
        takeaway:
          "Filtering hides rows temporarily; sorting permanently reorders them. Neither deletes your underlying data.",
      },
      {
        id: "conditional-formatting",
        title: "Conditional Formatting",
        body: "Conditional formatting changes a cell's appearance based on its value or a formula, making patterns visible at a glance — color scales for magnitude, data bars for relative size, icon sets for status, and highlight rules for specific conditions (duplicates, above average, dates in the past, etc.).\n\nFor more control, a formula-based rule lets you highlight an entire row based on a condition in one column — for example, highlighting overdue tasks by referencing a due-date column with a relative reference and applying the rule to the full row range.",
        takeaway:
          "Formula-based conditional formatting rules are the most flexible — they can evaluate any logical test, not just built-in presets.",
      },
      {
        id: "data-validation",
        title: "Data Validation",
        body: "Data Validation (Data tab) restricts what can be entered into a cell — a number range, a date range, text length, or a dropdown list built from a named range. This prevents data-entry errors before they happen, which is far more effective than cleaning them up afterward.\n\nCustom validation rules can use formulas for more advanced logic, such as preventing duplicate entries in a column or requiring a value to match a pattern. Input messages and error alerts can also be configured to guide users at the point of entry.",
        takeaway:
          "Validate at the point of entry — it's cheaper to prevent bad data than to clean it up later.",
      },
      {
        id: "cleaning-data",
        title: "Cleaning Messy Data",
        body: "Real-world data is rarely clean: extra spaces, inconsistent casing, text stored as numbers, and duplicate rows are the most common problems. TRIM removes extra spaces, VALUE converts text-numbers into true numbers, and Text to Columns splits combined data (like 'First Last' or CSV-style text) into separate fields.\n\nRemove Duplicates (Data tab) strips exact-match duplicate rows based on selected columns. Flash Fill (Ctrl+E) can intelligently extract or reformat data by recognizing a pattern from just one or two manually entered examples — extremely useful for splitting names or standardizing formats without writing a formula.",
        takeaway:
          "Flash Fill (Ctrl+E) can often replace a formula entirely for pattern-based text cleanup.",
        visual: "checklist",
        visualData: [
          "TRIM extra spaces before analysis",
          "Convert text-numbers to real numbers with VALUE or Text to Columns",
          "Standardize casing with UPPER/LOWER/PROPER",
          "Remove exact-match duplicate rows",
          "Use Flash Fill (Ctrl+E) for pattern-based reformatting",
          "Check for hidden characters or trailing spaces causing lookup failures",
        ],
      },
      {
        id: "excel-tables",
        title: "Excel Tables (Ctrl+T)",
        body: "Converting a range into a Table (Ctrl+T) unlocks structured references, automatic formatting, built-in filter dropdowns, and formulas that auto-fill down new rows. Structured references use column names instead of cell addresses (e.g. Table1[Sales]), which makes formulas far easier to read and maintain.\n\nTables also expand automatically as new rows are added, which means charts, PivotTables, and formulas built on top of a Table stay current without manual range updates — a major advantage over plain ranges for any dataset that grows over time.",
        takeaway:
          "Always convert growing datasets into a Table — it future-proofs formulas, charts, and PivotTables against new rows.",
      },
    ],
  },

  {
    id: "visualization",
    title: "Charts & Visualization",
    description:
      "Turn numbers into charts and dashboards that communicate insight at a glance.",
    accent: "from-[#7A4DFF] to-[#4F7CFF]",
    accentHex: "#7A4DFF",
    lessons: [
      {
        id: "chart-basics",
        title: "Choosing the Right Chart",
        body: "Chart choice should be driven by the question you're answering, not by what looks impressive. Bar and column charts compare categories. Line charts show trends over time. Pie charts show proportion of a whole (best limited to 5–6 slices). Scatter plots reveal relationships between two numeric variables.\n\nA common mistake is using a pie chart for data that changes over time, or a line chart for unrelated categories — both misrepresent the underlying relationship. Matching the chart type to the data structure is the single biggest factor in whether a chart communicates clearly.",
        takeaway:
          "Bar/column = compare categories. Line = trend over time. Scatter = relationship between variables. Pie = share of a whole.",
        visual: "table",
        visualData: [
          ["Chart type", "Best for"],
          ["Column / Bar", "Comparing values across categories"],
          ["Line", "Trends over a continuous period"],
          ["Pie / Doughnut", "Share of a whole (few categories)"],
          ["Scatter", "Relationship or correlation between two variables"],
          ["Combo", "Two different measures on different scales"],
        ],
      },
      {
        id: "building-formatting-charts",
        title: "Building and Formatting Charts",
        body: "Select your data (ideally an Excel Table) and use Insert > Charts, or Alt+F1 for an instant default chart. Once created, the Chart Design and Format tabs let you adjust colors, axis scales, gridlines, data labels, and titles.\n\nGood chart hygiene includes: a clear, specific title (not just 'Chart 1'), axis labels where the unit isn't obvious, removing chart junk like unnecessary gridlines or 3D effects, and sorting bar charts by value rather than leaving them in arbitrary category order when ranking matters.",
        takeaway:
          "A chart is only as good as its title and axis labels — never leave a chart to speak entirely for itself.",
      },
      {
        id: "sparklines-dashboards",
        title: "Sparklines and Simple Dashboards",
        body: "Sparklines are tiny, cell-sized charts (Insert > Sparklines) that show a trend inline within a table — ideal for showing dozens of trends compactly, such as one sparkline per row of a sales table. They come in Line, Column, and Win/Loss variants.\n\nA basic dashboard combines KPIs (large summary numbers, often built with formulas referencing a data table), a few well-chosen charts, and slicers for interactivity — all laid out on a single print-friendly sheet. The goal is that a viewer can understand the state of the business within seconds of opening the sheet.",
        takeaway:
          "Sparklines pack trend information into a single cell — perfect for scannable, row-by-row comparisons.",
      },
    ],
  },

  {
    id: "pivot-analysis",
    title: "PivotTables & Data Analysis",
    description:
      "Summarize, slice, and interrogate large datasets without writing a single formula.",
    accent: "from-[#6D2E46] to-[#9B4D57]",
    accentHex: "#6D2E46",
    lessons: [
      {
        id: "pivottable-basics",
        title: "Creating a PivotTable",
        body: "A PivotTable summarizes a large dataset by letting you drag fields into four areas: Rows, Columns, Values, and Filters. It's the fastest way to answer questions like 'total sales by region and month' without writing a single SUMIFS formula.\n\nBuilding on top of an Excel Table (rather than a plain range) means the PivotTable's source data expands automatically as new rows are added — you just need to click Refresh to pull in the latest data after the table grows.",
        takeaway:
          "Rows and Columns define the groupings; Values defines what gets aggregated; Filters narrows the whole view.",
        visual: "diagram-layered",
        visualData: {
          Rows: ["categories to group down the left side"],
          Columns: ["categories to group across the top"],
          Values: ["the numbers being summed, averaged, or counted"],
          Filters: ["fields used to narrow the entire pivot view"],
        },
      },
      {
        id: "pivottable-customization",
        title: "Customizing Value Fields and Layout",
        body: "By default, PivotTables sum numeric fields and count text fields, but the Value Field Settings dialog lets you switch to average, max, min, count, or % of total. 'Show Values As' options like '% of Column Total' or 'Difference From' turn raw totals into more meaningful comparisons.\n\nGrouping is another core feature: dates can be grouped into months, quarters, or years with a right-click, and numeric fields can be grouped into custom bins (e.g. age ranges). Layout options (Compact, Outline, Tabular) and Report Filters change how the summary is displayed without altering the underlying calculation.",
        takeaway:
          "'Show Values As' turns a raw sum into a percentage, rank, or comparison — often more useful than the raw number itself.",
      },
      {
        id: "slicers-timelines",
        title: "Slicers and Timelines",
        body: "Slicers (Insert > Slicer) provide clickable buttons for filtering a PivotTable or Table interactively, making dashboards feel like an app rather than a static report. Multiple PivotTables can be connected to the same slicer via 'Report Connections' so one click filters everything at once.\n\nA Timeline is a specialized slicer for date fields, letting users scrub through years, quarters, months, or days with a single control. Together, slicers and timelines are what turn a PivotTable-based sheet into a genuinely interactive dashboard.",
        takeaway:
          "Connect one slicer to multiple PivotTables via Report Connections to filter an entire dashboard with a single click.",
      },
      {
        id: "pivotcharts",
        title: "PivotCharts",
        body: "A PivotChart is a chart built directly on top of a PivotTable's field layout — it updates automatically as the PivotTable's fields, filters, or grouping change. This makes it ideal for dashboards where the underlying summary needs to stay fully interactive.\n\nBecause PivotCharts inherit the field buttons and filter controls of their PivotTable, they can be filtered directly from the chart itself, without needing to interact with the table underneath — useful for cleaner, presentation-ready dashboards.",
        takeaway:
          "PivotCharts stay in sync with their PivotTable automatically — no manual range updates required as filters change.",
      },
      {
        id: "what-if-analysis",
        title: "What-If Analysis: Goal Seek and Data Tables",
        body: "Goal Seek (Data > What-If Analysis) works backwards: instead of asking 'what's the output given these inputs,' you specify a desired output and Excel solves for the input needed to reach it — e.g. 'what price gets me to $50,000 in revenue?'\n\nData Tables (also under What-If Analysis) show how a formula's result changes across a range of one or two input variables simultaneously, producing a full sensitivity grid at once — far faster than manually changing inputs and recalculating one at a time.",
        takeaway:
          "Goal Seek solves for a single input. Data Tables show a full grid of outcomes across a range of inputs.",
      },
    ],
  },

  {
    id: "advanced-excel",
    title: "Advanced Excel & Automation",
    description:
      "Move beyond manual formulas into dynamic arrays, Power Query, and macro-driven automation.",
    accent: "from-[#F97316] to-[#F59E0B]",
    accentHex: "#F97316",
    lessons: [
      {
        id: "dynamic-array-functions",
        title: "Dynamic Array Functions",
        body: "Modern Excel introduces dynamic array functions that automatically 'spill' results into neighboring cells without needing to be copied down manually. FILTER extracts rows matching a condition, SORT and SORTBY reorder data, UNIQUE removes duplicates, and SEQUENCE generates a series of numbers.\n\nThese functions can be combined — for example, SORT(FILTER(range, condition)) filters a dataset and sorts the result in a single formula, spilling the output automatically as the source data changes. This largely replaces older array-formula workarounds that required Ctrl+Shift+Enter.",
        takeaway:
          "Dynamic arrays 'spill' automatically and can be nested together (e.g. SORT + FILTER) to replace multi-step manual processes.",
        visual: "table",
        visualData: [
          ["Function", "What it does"],
          ["FILTER", "Returns rows matching a condition"],
          ["SORT / SORTBY", "Reorders a range or array"],
          ["UNIQUE", "Returns distinct values from a range"],
          ["SEQUENCE", "Generates a sequence of numbers"],
          [
            "LET / LAMBDA",
            "Names intermediate values / defines custom functions",
          ],
        ],
      },
      {
        id: "power-query",
        title: "Power Query: Get & Transform",
        body: "Power Query (Data > Get Data) is Excel's ETL (extract, transform, load) tool. It connects to sources like CSVs, folders, databases, and web pages, then lets you build a repeatable sequence of transformation steps — removing columns, splitting fields, changing types, merging queries — recorded in the Applied Steps pane.\n\nBecause every transformation is a recorded step rather than a one-time manual edit, refreshing the query re-runs the entire pipeline against updated source data automatically. This makes Power Query the right tool whenever a dataset needs to be reshaped the same way on a recurring basis, rather than cleaned by hand each time.",
        takeaway:
          "Power Query records transformations as repeatable steps — refresh once and the entire cleaning pipeline reruns on new data.",
      },
      {
        id: "power-pivot-data-model",
        title: "Power Pivot and the Data Model",
        body: "Power Pivot extends PivotTables beyond a single flat table by letting you load multiple tables into an internal Data Model and define relationships between them — similar to a relational database — without needing VLOOKUP to stitch tables together first.\n\nDAX (Data Analysis Expressions) is the formula language used within Power Pivot to build calculated columns and measures, such as year-over-year growth or running totals, that operate correctly across the full relational model rather than a single row.",
        takeaway:
          "Power Pivot's Data Model lets you relate multiple tables directly — no more VLOOKUPs just to combine tables before analysis.",
      },
      {
        id: "macros-vba-intro",
        title: "Introduction to Macros and VBA",
        body: "The Macro Recorder (View > Macros > Record Macro) captures a sequence of manual actions and converts them into VBA (Visual Basic for Applications) code that can be replayed with a single click or keyboard shortcut — ideal for automating repetitive formatting or reporting tasks.\n\nRecorded macros are a starting point, not a finished product: the generated code is often inefficient and brittle. Editing macros directly in the VBA Editor (Alt+F11) — adding loops, conditionals, and error handling — turns a one-off recording into a robust, reusable automation.",
        takeaway:
          "Record a macro to get started, then refine it in the VBA Editor — recorded code is rarely production-ready as-is.",
      },
      {
        id: "vba-fundamentals",
        title: "VBA Fundamentals",
        body: "A VBA Sub is a block of code that performs an action; a Function returns a value and can be called from a worksheet like a native formula. Variables are declared with Dim, and Option Explicit (a best practice) forces every variable to be declared before use, catching typos early.\n\nCore constructs mirror other programming languages: For...Next and For Each...Next loops iterate over ranges or collections, If...Then...Else branches on conditions, and the Range and Cells objects are how VBA reads and writes worksheet data. Error handling with On Error Resume Next or On Error GoTo prevents a single failure from crashing an entire automated process.",
        takeaway:
          "Always turn on Option Explicit — it forces variable declaration and catches typo-driven bugs before they cause silent errors.",
        visual: "checklist",
        visualData: [
          "Option Explicit — force variable declaration",
          "Sub vs Function — action vs. value returned",
          "For...Next / For Each — loop over ranges or collections",
          "If...Then...Else — conditional branching",
          "Range/Cells objects — read and write worksheet data",
          "On Error handling — prevent one failure from halting the macro",
        ],
      },
      {
        id: "advanced-modeling-practices",
        title: "Advanced Modeling Best Practices",
        body: "Robust financial and operational models separate Inputs (assumptions, clearly color-coded), Calculations (formulas, ideally never containing a hard-coded number), and Outputs (summaries and charts) onto distinct areas or sheets. This separation makes models auditable and reduces the risk of an assumption being silently overwritten by a formula.\n\nOther advanced practices include: using named ranges and LET for readability, scenario analysis via the Scenario Manager to compare best/base/worst cases, auditing tools (Formulas > Trace Precedents/Dependents) to visualize dependency chains, and protecting sheets or specific cell ranges to prevent accidental edits to critical formulas.",
        takeaway:
          "Separate Inputs, Calculations, and Outputs clearly — a model where assumptions and formulas are mixed together is an audit risk.",
      },
    ],
  },
  {
    id: "formatting-presentation",
    title: "Formatting & Presentation",
    description:
      "Make spreadsheets readable, printable, and professional — from number formats to page layout.",
    accent: "from-[#0EA5A5] to-[#14B8A6]",
    accentHex: "#0EA5A5",
    lessons: [
      {
        id: "number-formatting",
        title: "Custom Number Formats",
        body: 'Beyond the built-in currency, percentage, and date formats, Excel supports fully custom number formats via Format Cells > Custom, using placeholder codes like 0, #, and 0.00. These codes control how a value displays without changing its underlying stored value — a critical distinction from actually editing the number.\n\nCustom formats can define up to four sections separated by semicolons — positive;negative;zero;text — allowing different display rules for each case, such as showing negative numbers in red parentheses or hiding zeros entirely with a format like #,##0;-#,##0;"".',
        takeaway:
          "Custom number formats change display only, never the stored value — formulas still calculate on the true underlying number.",
      },
      {
        id: "styles-themes",
        title: "Cell Styles and Workbook Themes",
        body: "Cell Styles (Home tab) bundle font, fill, border, and number format into a single reusable, named style — so updating the style definition updates every cell using it at once, rather than reformatting cells one by one. This is the spreadsheet equivalent of a paragraph style in a word processor.\n\nWorkbook Themes (Page Layout tab) control the palette of colors, fonts, and effects available across cell styles, charts, and tables in a workbook, making it easy to keep a consistent look across many sheets or align a workbook with a company's brand colors.",
        takeaway:
          "Define a Cell Style once and reuse it everywhere — it keeps formatting consistent and makes global changes a one-click edit.",
      },
      {
        id: "page-layout-printing",
        title: "Page Layout and Printing",
        body: "Print Area (Page Layout > Print Area) defines exactly which cells print, preventing accidental multi-page printouts of unrelated data. Page Break Preview shows exactly where pages will split, and breaks can be dragged manually to control layout.\n\nPrint Titles let you repeat header rows or columns on every printed page — essential for multi-page tables. Scaling options ('Fit to 1 page wide') shrink content to fit a page width without manually resizing columns, and headers/footers can include dynamic fields like page numbers, dates, or file paths.",
        takeaway:
          "Set a Print Area and Print Titles before printing any multi-page report — it's the difference between a usable printout and a mess.",
      },
      {
        id: "freeze-panes-views",
        title: "Freeze Panes and Custom Views",
        body: "Freeze Panes (View tab) locks specified rows and/or columns in place while scrolling through large datasets, keeping headers or ID columns visible at all times. Split (also under View) divides the window into independently scrollable panes, useful for comparing distant parts of the same sheet.\n\nCustom Views save a specific combination of print settings, filters, and hidden rows/columns under a name, letting you switch between different 'saved states' of the same sheet — for example, a summary view for executives and a detailed view for analysts, without duplicating the sheet.",
        takeaway:
          "Freeze Panes keeps headers visible while scrolling; Custom Views save entire filter/display states you can switch between instantly.",
      },
    ],
  },

  {
    id: "financial-statistical-functions",
    title: "Financial & Statistical Functions",
    description:
      "Apply Excel's built-in functions for time value of money, statistical summaries, and forecasting.",
    accent: "from-[#B45309] to-[#D97706]",
    accentHex: "#B45309",
    lessons: [
      {
        id: "time-value-of-money",
        title: "Time Value of Money: PMT, FV, PV, NPER, RATE",
        body: "PMT calculates a fixed periodic payment for a loan or investment given rate, number of periods, and present value — the function behind every loan calculator. FV and PV calculate future and present value respectively, and NPER solves for the number of payment periods needed.\n\nAll five functions (PMT, FV, PV, NPER, RATE) share the same five underlying variables and can each solve for whichever one is unknown, given the other four. Sign convention matters: cash outflows (payments made) are typically entered as negative numbers, and cash inflows (money received) as positive.",
        takeaway:
          "PMT, FV, PV, NPER, and RATE all revolve around the same five variables — pick the function based on which one is unknown.",
      },
      {
        id: "npv-irr",
        title: "NPV and IRR for Investment Analysis",
        body: "NPV (Net Present Value) discounts a series of future cash flows back to today's value using a specified discount rate, letting you compare an investment's total value in today's dollars. A positive NPV generally indicates a worthwhile investment at that discount rate.\n\nIRR (Internal Rate of Return) instead solves for the discount rate at which NPV equals zero — effectively the 'break-even' rate of return for a series of cash flows. Both functions require cash flows to be entered as a consistent series with correctly signed values (outflows negative, inflows positive).",
        takeaway:
          "NPV tells you the value at a chosen discount rate; IRR tells you what discount rate would make the investment break even.",
      },
      {
        id: "statistical-summary-functions",
        title: "Statistical Summary Functions",
        body: "Beyond AVERAGE, Excel offers MEDIAN (the middle value, resistant to outliers), MODE.SNGL (the most frequent value), and STDEV.P/STDEV.S (population vs. sample standard deviation) for measuring spread. Choosing between the .P and .S variants depends on whether your data represents the entire population or just a sample of it.\n\nQUARTILE and PERCENTILE functions divide data into ranked segments, useful for identifying top performers or outliers. CORREL measures the strength and direction of a linear relationship between two variables, returning a value between -1 and 1.",
        takeaway:
          "Use STDEV.S for a sample and STDEV.P only when your data truly represents the entire population — the wrong choice skews the result.",
        visual: "table",
        visualData: [
          ["Function", "Measures"],
          ["MEDIAN", "Middle value — resistant to outliers"],
          ["STDEV.S / STDEV.P", "Spread — sample vs. full population"],
          ["QUARTILE / PERCENTILE", "Ranked position within a distribution"],
          ["CORREL", "Strength/direction of a linear relationship (-1 to 1)"],
        ],
      },
      {
        id: "forecast-trend",
        title: "FORECAST, TREND, and Regression",
        body: "FORECAST.LINEAR predicts a future value along a linear trend based on existing historical data — useful for simple projections like next month's sales based on prior months. TREND does the same but can return an entire array of predicted values at once, fitting a straight line through the known data.\n\nFor more rigorous analysis, the Analysis ToolPak's Regression tool produces a full statistical output — R-squared, coefficients, p-values — going well beyond a simple point forecast. It must be enabled first via File > Options > Add-ins > Analysis ToolPak.",
        takeaway:
          "FORECAST.LINEAR and TREND give quick linear projections; the Analysis ToolPak's Regression tool gives full statistical rigor.",
      },
    ],
  },

  {
    id: "error-handling-auditing",
    title: "Error Handling & Formula Auditing",
    description:
      "Diagnose formula errors, trace dependencies, and build spreadsheets that fail safely.",
    accent: "from-[#DC2626] to-[#F87171]",
    accentHex: "#DC2626",
    lessons: [
      {
        id: "common-error-values",
        title: "Reading Common Error Values",
        body: "Excel's error values each point to a specific problem: #DIV/0! means dividing by zero or an empty cell, #N/A means a lookup found no match, #REF! means a formula points to a cell that no longer exists (often from deleting a row or column), #VALUE! means a formula received the wrong data type, and #NAME? usually means a typo in a function name or an undefined named range.\n\nRecognizing which error corresponds to which root cause dramatically speeds up debugging — rather than guessing, you can go directly to the likely fix (e.g. #REF! almost always means checking for a recently deleted row, column, or sheet).",
        takeaway:
          "Each error value points to a specific cause — learn the mapping and you'll debug formulas far faster than by trial and error.",
        visual: "table",
        visualData: [
          ["Error", "Typical cause"],
          ["#DIV/0!", "Division by zero or an empty denominator cell"],
          ["#N/A", "Lookup function found no matching value"],
          ["#REF!", "Formula references a deleted cell, row, or sheet"],
          ["#VALUE!", "Wrong data type passed into a formula"],
          ["#NAME?", "Typo in a function name or undefined named range"],
        ],
      },
      {
        id: "iferror-ifna",
        title: "IFERROR and IFNA",
        body: "IFERROR(formula, value_if_error) catches any error a formula might produce and substitutes a fallback value or message, preventing broken-looking output from reaching end users. It's commonly wrapped around lookups: IFERROR(VLOOKUP(...), \"Not found\").\n\nIFNA is more targeted — it only catches #N/A errors specifically, letting other error types (like #REF! or #DIV/0!, which usually indicate a real bug rather than an expected 'no match' case) surface visibly rather than being silently hidden. This distinction matters: silently swallowing every error type with IFERROR can also hide genuine mistakes.",
        takeaway:
          "IFERROR hides every error type; IFNA hides only #N/A. Prefer IFNA when you only want to suppress expected 'no match' cases.",
      },
      {
        id: "formula-auditing-tools",
        title: "Formula Auditing Tools",
        body: "Trace Precedents (Formulas tab) draws arrows showing which cells feed into the active formula; Trace Dependents shows which cells rely on it. This is invaluable before editing or deleting a cell in a large, unfamiliar workbook — you can see the full blast radius of a change before making it.\n\nEvaluate Formula steps through a complex nested formula one calculation at a time, showing exactly how the final result was reached — extremely useful for debugging a formula that returns an unexpected value but no outright error. The Watch Window also lets you monitor specific cells' values while editing elsewhere in the workbook.",
        takeaway:
          "Trace Precedents/Dependents shows a formula's blast radius before you edit it. Evaluate Formula steps through nested logic one calculation at a time.",
      },
      {
        id: "data-validation-error-prevention",
        title: "Designing for Error Prevention",
        body: "Well-designed spreadsheets prevent errors structurally rather than catching them after the fact: locking formula cells with sheet protection, using data validation dropdowns instead of free text, and clearly separating input cells (color-coded) from calculated cells reduce the chance of accidental overwrites.\n\nDefensive formula design also helps — using SUMIFS instead of a chain of nested IFs, referencing named ranges instead of hard-coded cell addresses, and building in sanity-check cells (e.g. a cell that flags if two totals that should match don't) surface problems immediately rather than letting them propagate silently through a model.",
        takeaway:
          "The best error handling is structural — protect formulas, validate inputs, and add sanity-check cells rather than relying solely on IFERROR.",
      },
    ],
  },

  {
    id: "collaboration-sharing",
    title: "Collaboration & Sharing",
    description:
      "Work with others in the same workbook safely — comments, protection, version history, and co-authoring.",
    accent: "from-[#4F46E5] to-[#818CF8]",
    accentHex: "#4F46E5",
    lessons: [
      {
        id: "comments-notes",
        title: "Comments vs. Notes",
        body: "Modern Excel distinguishes between Notes (the older, sticky-note-style annotation attached to a single cell, mainly for personal reminders) and Comments (threaded, reply-able annotations designed for discussion between collaborators, similar to comments in Word or Google Docs).\n\nComments support @mentions that can notify a collaborator via email when a workbook is stored in OneDrive or SharePoint, and can be marked resolved once addressed — making them the right tool for review workflows, while Notes remain better suited to private, non-collaborative annotations.",
        takeaway:
          "Use Comments for collaborative discussion (with @mentions and resolution), and Notes for private, single-user annotations.",
      },
      {
        id: "sheet-workbook-protection",
        title: "Sheet and Workbook Protection",
        body: "Protect Sheet (Review tab) locks cells from editing by default — but only cells explicitly marked as 'Locked' in Format Cells are actually protected once the sheet is protected, so unlocking specific input cells beforehand is a required step, not optional.\n\nProtect Workbook prevents structural changes like adding, deleting, or renaming sheets. A password can be added to either, though Excel's protection is best understood as deterring accidental changes rather than providing strong security — it is not a substitute for proper access control or encryption on sensitive data.",
        takeaway:
          "Unlock input cells before protecting the sheet, or every cell — including ones meant to be editable — gets locked by default.",
      },
      {
        id: "co-authoring-version-history",
        title: "Co-authoring and Version History",
        body: "When a workbook is stored on OneDrive or SharePoint, multiple people can co-author it simultaneously, with each collaborator's cursor and edits visible in near real-time — similar to collaborative editing in Google Sheets, replacing the older, more error-prone practice of emailing file copies back and forth.\n\nVersion History (File > Info > Version History) keeps automatic snapshots of the file over time, allowing you to view or restore an earlier version if a mistake is introduced — a critical safety net that doesn't require any manual 'Save As' backup discipline from collaborators.",
        takeaway:
          "Store shared workbooks on OneDrive/SharePoint to unlock real-time co-authoring and automatic Version History as a built-in safety net.",
      },
      {
        id: "sharing-permissions",
        title: "Sharing and Permission Levels",
        body: "The Share button issues a link with a specific permission level: 'Can edit' allows full changes, 'Can view' allows read-only access, and links can optionally be restricted to specific people or require sign-in, rather than being open to anyone with the link.\n\nFor sensitive workbooks, Information Rights Management (IRM) or sensitivity labels (in enterprise environments) can restrict actions like copying, printing, or forwarding even after a file has been shared — providing a layer of control beyond the basic edit/view distinction.",
        takeaway:
          "Match the permission level to intent — 'Can view' for stakeholders who just need visibility, restricted-to-specific-people links for sensitive data.",
      },
    ],
  },

  {
    id: "modern-excel-automation",
    title: "Modern Excel: 365, Power Platform & Office Scripts",
    description:
      "Extend Excel with Office Scripts, Power Automate flows, add-ins, and Excel for the web.",
    accent: "from-[#0284C7] to-[#38BDF8]",
    accentHex: "#0284C7",
    lessons: [
      {
        id: "excel-for-web-mobile",
        title: "Excel for the Web and Mobile",
        body: "Excel for the Web runs directly in a browser with no installation, supporting most core formulas, PivotTables, and charts, though some advanced features (certain add-ins, complex VBA macros) are unavailable or limited compared to desktop Excel. It's ideal for quick edits and viewing shared files without full software access.\n\nThe Excel mobile app is optimized for touch — it can scan a printed table with a phone camera and convert it into an editable spreadsheet (via 'Insert Data from Picture'), and supports simplified card-based data entry for structured tables, which is often faster than pinch-zooming a full grid on a small screen.",
        takeaway:
          "Excel for the Web trades some advanced features for zero-install access; the mobile app's 'Insert Data from Picture' can digitize a printed table in seconds.",
      },
      {
        id: "office-scripts",
        title: "Office Scripts: TypeScript Automation",
        body: "Office Scripts (available in Excel for the Web and newer desktop versions) let you record actions — similar to the VBA macro recorder — but generate TypeScript code instead of VBA, and run in the cloud rather than being tied to a specific local file or machine.\n\nBecause Office Scripts run in the cloud, they can be triggered automatically by Power Automate flows — for example, running a script every time a new file lands in a OneDrive folder — making them the modern, cross-platform successor to VBA macros for automation that needs to work across desktop, web, and Mac.",
        takeaway:
          "Office Scripts are the cloud-native, cross-platform successor to VBA — and they can be triggered automatically via Power Automate.",
      },
      {
        id: "power-automate-integration",
        title: "Power Automate Integration",
        body: "Power Automate connects Excel to hundreds of other services — sending a Teams or email alert when a cell value crosses a threshold, appending form responses to a table automatically, or syncing rows between Excel and other systems like SharePoint lists or databases, without any custom code.\n\nA typical flow might watch a Table for new rows (trigger), then run conditional logic and send a notification (actions) — turning a spreadsheet from a static file into one node in a broader automated business process.",
        takeaway:
          "Power Automate turns a spreadsheet from a static file into a live trigger point for automated workflows across other apps.",
      },
      {
        id: "add-ins-marketplace",
        title: "Add-ins and the Office Store",
        body: "Add-ins (Insert > Get Add-ins) extend Excel with specialized functionality beyond built-in features — data connectors to external services, advanced charting libraries, or domain-specific tools like statistical or engineering function packs — installed from the Office Store without needing IT deployment in most personal/small business contexts.\n\nOrganizations can also deploy custom, internally-built add-ins (via the Office Add-ins platform, built with web technologies like JavaScript) centrally to all users — useful for connecting Excel directly to proprietary internal systems or enforcing company-specific calculation standards.",
        takeaway:
          "Add-ins extend Excel's native capabilities — from the public Office Store for individuals, or custom-built and centrally deployed for organizations.",
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
    <div className='min-h-screen bg-white text-slate-900 '>
      <NavBar />
      {/* ── Category selector bar ── */}
      <div className='fixed w-full top-20 z-40 border-b border-slate-200 bg-white/95 backdrop-blur'>
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

      <main className='mx-auto max-w-7xl px-4 md:px-8 md:mt-50 mt-40'>
        {/* ── Hero ── */}
        <div className='relative overflow-hidden rounded-3xl my-8 p-8 md:p-12'>
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
              Excel For Beginners{" "}
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
        {/* ── Playlists ── */}
        {(() => {
          const playlistUrls = activeCategory.lessons.flatMap(
            (l) => l.learningPlaylistUrl ?? [],
          );
          if (playlistUrls.length === 0) return null;
          return (
            <div className='border-t border-slate-200 pt-10 pb-16 w-full'>
              <p className='text-xs font-bold uppercase tracking-widest text-slate-400 mb-4'>
                Learn More: Playlists
              </p>
              <div className='flex flex-wrap gap-3 w-full'>
                {playlistUrls.map((url, i) => (
                  <Link
                    className=' relative'
                    href={url.url}
                    target='_blank'
                    key={i}
                  >
                    {" "}
                    <Image
                      src={thumbnailUrl}
                      alt={url.title}
                      width={320}
                      height={180}
                      className='rounded-xl border border-slate-200'
                    />
                    <p className='absolute top-0 text-white font-bold  mt-2 w-full px-2 text-lg text-center flex flex-col items-center justify-center h-full'>
                      <span className='inline-flex items-center justify-center rounded-full bg-white/80 p-1 text-slate-900 shadow-sm mb-6'>
                        <MdPlayArrow size={24} />
                      </span>{" "}
                      {url.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}
      </main>

      <div className='border-t border-slate-200 pt-10 pb-16 w-full mx-auto max-w-7xl px-4 md:px-8 mb-12'>
        <p className='text-xs font-bold uppercase tracking-widest text-slate-400 mb-12'>
          Practise What You've Learnt
        </p>

        <div className='grid gap-5 md:grid-cols-2 grid-cols-1 mx-auto max-w-7xl px-4 md:px-8 mb-12'>
          {[
            {
              path: "/page/excel-test",
              label: "Exam Mode",
              description:
                "Test your knowledge with timed Excel exercises and quizzes, designed to simulate real-world scenarios and reinforce learning.",
              IconName: MdCheckBox,
              accent: "from-[#2660A4] to-[#4F8FCA]",
            },
            {
              path: "/page/practical-excel",
              label: "Assessment Mode",
              description:
                "Evaluate your Excel skills with practical tasks and challenges, providing instructor feedback to help you improve and master the application.",
              IconName: IoBook,
              accent: "from-[#40531B] to-[#3A2D32]",
            },
          ].map(({ path, label, description, IconName, accent }) => (
            <button
              type='button'
              key={label}
              onClick={() => handleNavigation(path)}
              className='group rounded-[28px] border border-slate-200 bg-white text-left shadow-lg shadow-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-2xl'
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
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
