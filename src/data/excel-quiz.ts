import img1 from "../../public/images/docker.webp";
import type { StaticImageData } from "next/image";
// ─── Quiz data types ──────────────────────────────────────────────────────
export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correct: number;
  image?: StaticImageData;
  explanation: string;
};

export type QuizCategory = {
  id: string;
  title: string;
  description: string;
  accent: string;
  accentHex: string;
  image?: StaticImageData;
  questions: QuizQuestion[];
};

export const quizCategories: QuizCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description:
      "Test your grasp of the Excel interface, references, and core navigation.",
    accent: "from-[#217346] to-[#33C481]",
    accentHex: "#217346",

    questions: [
      {
        id: "gs-1",
        question: "What is a workbook in Excel?",
        image: img1,
        options: [
          "A single formula",
          "A file containing one or more worksheets",
          "A chart object",
          "A named range",
        ],
        correct: 1,
        explanation:
          "A workbook is the .xlsx file itself, which can hold multiple worksheets.",
      },
      {
        id: "gs-2",
        question: "What does the Formula Bar display for the active cell?",
        options: [
          "Only the calculated result",
          "The raw content, including any formula",
          "The cell's format",
          "The sheet name",
        ],
        correct: 1,
        explanation:
          "The Formula Bar shows exactly what was typed, while the grid shows the calculated result.",
      },
      {
        id: "gs-3",
        question:
          "Which key moves the active cell straight down after typing a value?",
        options: ["Tab", "Enter", "Ctrl+Enter", "Esc"],
        correct: 1,
        explanation:
          "Enter confirms the entry and moves the selection down one row.",
      },
      {
        id: "gs-4",
        question:
          "What does Ctrl+Enter do when a range is selected before typing?",
        options: [
          "Deletes the range",
          "Fills the same value into every selected cell",
          "Opens Format Cells",
          "Inserts a new row",
        ],
        correct: 1,
        explanation:
          "Ctrl+Enter commits the typed value to all selected cells at once.",
      },
      {
        id: "gs-5",
        question:
          "How does a relative reference like A1 behave when copied to another cell?",
        options: [
          "It stays fixed",
          "It shifts to match the new position",
          "It becomes an error",
          "It converts to text",
        ],
        correct: 1,
        explanation:
          "Relative references shift automatically based on the direction and distance copied.",
      },
      {
        id: "gs-6",
        question: "What does the reference $A$1 represent?",
        options: [
          "A relative reference",
          "An absolute reference locked on both row and column",
          "A mixed reference with only the row locked",
          "An external reference",
        ],
        correct: 1,
        explanation:
          "Both dollar signs lock the reference completely so it never shifts when copied.",
      },
      {
        id: "gs-7",
        question: "In the mixed reference $A1, what is locked?",
        options: [
          "Only the row",
          "Only the column",
          "Both row and column",
          "Neither",
        ],
        correct: 1,
        explanation:
          "The $ before the column letter locks the column while the row is still free to shift.",
      },
      {
        id: "gs-8",
        question: "Which shortcut jumps to the last used cell in a worksheet?",
        options: ["Ctrl+Home", "Ctrl+End", "Ctrl+Shift+End", "Alt+End"],
        correct: 1,
        explanation:
          "Ctrl+End moves to the intersection of the last used row and column.",
      },
      {
        id: "gs-9",
        question: "Which shortcut returns the selection to cell A1?",
        options: ["Ctrl+Home", "Ctrl+End", "Ctrl+1", "F2"],
        correct: 0,
        explanation:
          "Ctrl+Home always jumps back to the top-left of the worksheet.",
      },
      {
        id: "gs-10",
        question: "What does Ctrl+Arrow do?",
        options: [
          "Selects the entire sheet",
          "Jumps to the edge of a contiguous data block",
          "Opens the Ribbon",
          "Inserts a column",
        ],
        correct: 1,
        explanation:
          "Ctrl+Arrow jumps in the arrow's direction until it hits the edge of a block of data.",
      },
      {
        id: "gs-11",
        question: "While editing a formula, what does pressing F4 do?",
        options: [
          "Deletes the formula",
          "Cycles the reference type of the selected reference",
          "Saves the workbook",
          "Opens Help",
        ],
        correct: 1,
        explanation:
          "F4 cycles a reference through relative, absolute, and mixed states.",
      },
      {
        id: "gs-12",
        question: "Which key lets you edit a cell's contents in place?",
        options: ["F2", "F4", "F5", "F9"],
        correct: 0,
        explanation:
          "F2 puts the active cell into edit mode without deleting its contents.",
      },
      {
        id: "gs-13",
        question: "What does Alt+= do on a selected range?",
        options: [
          "Opens Format Cells",
          "Inserts an AutoSum formula",
          "Sorts the range",
          "Freezes panes",
        ],
        correct: 1,
        explanation:
          "Alt+= automatically inserts a SUM formula for the adjacent numeric range.",
      },
      {
        id: "gs-14",
        question: "Which shortcut opens the Format Cells dialog?",
        options: ["Ctrl+1", "Ctrl+2", "Ctrl+F", "Ctrl+Shift+1"],
        correct: 0,
        explanation: "Ctrl+1 is the standard shortcut for Format Cells.",
      },
      {
        id: "gs-15",
        question:
          "How can you force Excel to treat an entry as text even if it looks numeric?",
        options: [
          "Add a trailing comma",
          "Precede it with an apostrophe",
          "Use all capital letters",
          "Add a dollar sign",
        ],
        correct: 1,
        explanation:
          "A leading apostrophe forces Excel to store the entry as text, not a number.",
      },
      {
        id: "gs-16",
        question:
          "What is the standard file extension for a modern Excel workbook?",
        options: [".xls", ".xlsx", ".xlt", ".csv"],
        correct: 1,
        explanation:
          ".xlsx is the default Open XML format for modern Excel workbooks.",
      },
      {
        id: "gs-17",
        question: "What does the reference Sheet2!A1 mean inside a formula?",
        options: [
          "Cell A1 on the current sheet",
          "Cell A1 on a worksheet named Sheet2",
          "An absolute reference to A1",
          "An error reference",
        ],
        correct: 1,
        explanation:
          "The sheet name followed by an exclamation mark points a formula to another worksheet.",
      },
      {
        id: "gs-18",
        question: "What is the intersection of a column and a row called?",
        options: ["A range", "A cell", "A field", "A block"],
        correct: 1,
        explanation:
          "A single cell is the basic unit of an Excel grid, identified by column letter and row number.",
      },
      {
        id: "gs-19",
        question:
          "Where can you see the reference or name of the currently selected cell or range?",
        options: [
          "The Status Bar",
          "The Name Box",
          "The Ribbon title",
          "The sheet tab",
        ],
        correct: 1,
        explanation:
          "The Name Box, to the left of the Formula Bar, always shows the active selection's reference or name.",
      },
      {
        id: "gs-20",
        question:
          "What is the fastest way to auto-fill a sequential series (like dates) down a column?",
        options: [
          "Retype every value manually",
          "Drag the fill handle at the bottom-right of the cell",
          "Use Format Painter",
          "Use Ctrl+1",
        ],
        correct: 1,
        explanation:
          "Dragging the fill handle extends a detected pattern automatically down the column.",
      },
    ],
  },
  {
    id: "core-formulas",
    title: "Core Formulas & Functions",
    description:
      "Check your command of SUM, IF, lookup functions, and everyday formula logic.",
    accent: "from-[#2660A4] to-[#3C8DAD]",
    accentHex: "#2660A4",
    questions: [
      {
        id: "cf-1",
        question: "Every Excel formula must begin with which symbol?",
        options: ["#", "=", "@", "$"],
        correct: 1,
        explanation:
          "The equals sign tells Excel to interpret the cell content as a formula.",
      },
      {
        id: "cf-2",
        question: "In order of operations, which is evaluated first?",
        options: ["Addition", "Multiplication", "Parentheses", "Subtraction"],
        correct: 2,
        explanation:
          "Content inside parentheses is always evaluated before other operators.",
      },
      {
        id: "cf-3",
        question: "Which function counts only numeric cells in a range?",
        options: ["COUNTA", "COUNT", "COUNTBLANK", "COUNTIF"],
        correct: 1,
        explanation:
          "COUNT tallies cells containing numbers only, ignoring text and blanks.",
      },
      {
        id: "cf-4",
        question:
          "Which function counts all non-empty cells, regardless of type?",
        options: ["COUNT", "COUNTA", "COUNTBLANK", "SUM"],
        correct: 1,
        explanation:
          "COUNTA counts any non-empty cell, including text entries.",
      },
      {
        id: "cf-5",
        question: "What does SUMIFS allow that SUMIF does not?",
        options: [
          "Summing text values",
          "Multiple criteria across multiple ranges",
          "Summing across workbooks",
          "Rounding results",
        ],
        correct: 1,
        explanation:
          "The 'S' suffix functions support multiple conditions, while the singular versions support only one.",
      },
      {
        id: "cf-6",
        question:
          'What does the formula =IF(A1>10, "High", "Low") return if A1 is 5?',
        options: ["High", "Low", "TRUE", "#VALUE!"],
        correct: 1,
        explanation:
          "Since 5 is not greater than 10, the condition is false and 'Low' is returned.",
      },
      {
        id: "cf-7",
        question: "The AND function returns TRUE only when:",
        options: [
          "At least one condition is true",
          "All conditions are true",
          "No conditions are true",
          "Exactly one condition is true",
        ],
        correct: 1,
        explanation: "AND requires every argument to evaluate to TRUE.",
      },
      {
        id: "cf-8",
        question: "The OR function returns TRUE when:",
        options: [
          "All conditions are true",
          "At least one condition is true",
          "No conditions are true",
          "Only the first condition is true",
        ],
        correct: 1,
        explanation: "OR returns TRUE if any single argument is TRUE.",
      },
      {
        id: "cf-9",
        question:
          "What is a key advantage of IFS over multiple nested IF statements?",
        options: [
          "It calculates faster in all cases",
          "It is more readable when handling multiple outcomes",
          "It can only handle two outcomes",
          "It replaces AND and OR",
        ],
        correct: 1,
        explanation:
          "IFS evaluates conditions in order and is far easier to read than deeply nested IFs.",
      },
      {
        id: "cf-10",
        question:
          "Which function removes leading, trailing, and extra internal spaces from text?",
        options: ["TRIM", "CLEAN", "LEN", "PROPER"],
        correct: 0,
        explanation:
          "TRIM strips extra spaces while preserving single spaces between words.",
      },
      {
        id: "cf-11",
        question:
          "Which function returns the current date and updates every time the sheet recalculates?",
        options: ["DATE()", "TODAY()", "NOW()", "DATEVALUE()"],
        correct: 1,
        explanation:
          "TODAY() returns the current date and refreshes on every recalculation.",
      },
      {
        id: "cf-12",
        question:
          "Why can dates be added and subtracted like numbers in Excel?",
        options: [
          "Excel treats dates as text",
          "Dates are stored internally as serial numbers",
          "Dates are stored as arrays",
          "They can't actually be added or subtracted",
        ],
        correct: 1,
        explanation:
          "Each date is a serial number counting days from a fixed start date, enabling arithmetic.",
      },
      {
        id: "cf-13",
        question:
          "What is the main limitation of VLOOKUP compared to INDEX/MATCH?",
        options: [
          "It cannot use exact match",
          "It can only look to the right of the lookup column",
          "It cannot be used with tables",
          "It only works with numbers",
        ],
        correct: 1,
        explanation:
          "VLOOKUP always searches the first column of its table and returns a value to the right.",
      },
      {
        id: "cf-14",
        question: "In INDEX/MATCH, what is the role of MATCH?",
        options: [
          "It returns the final value",
          "It finds the position of a lookup value",
          "It sorts the range",
          "It formats the result",
        ],
        correct: 1,
        explanation:
          "MATCH locates the position of a value, which INDEX then uses to retrieve the result.",
      },
      {
        id: "cf-15",
        question: "What is a key advantage of XLOOKUP over VLOOKUP?",
        options: [
          "It can only search vertically",
          "It can look up values in any direction and defaults to exact match",
          "It cannot handle missing values",
          "It requires an additional helper column",
        ],
        correct: 1,
        explanation:
          "XLOOKUP searches in any direction, defaults to exact match, and has built-in not-found handling.",
      },
      {
        id: "cf-16",
        question: "Which function joins text from multiple cells together?",
        options: ["CONCAT or the & operator", "TRIM", "LEN", "MID"],
        correct: 0,
        explanation:
          "CONCAT (or the & operator) combines text strings from multiple cells or values.",
      },
      {
        id: "cf-17",
        question: "What does the TEXT function do?",
        options: [
          "Converts text into a number",
          "Formats a number or date as a display string using a specified pattern",
          "Removes text from a cell",
          "Counts characters in a string",
        ],
        correct: 1,
        explanation:
          'TEXT(value, format_text) converts a value into formatted text, e.g. TEXT(A1,"yyyy-mm-dd").',
      },
      {
        id: "cf-18",
        question:
          "Which function extracts characters from the middle of a text string?",
        options: ["LEFT", "RIGHT", "MID", "LEN"],
        correct: 2,
        explanation:
          "MID(text, start_num, num_chars) extracts a substring starting at a given position.",
      },
      {
        id: "cf-19",
        question: "COUNTIFS is best used when you need to:",
        options: [
          "Count cells matching multiple conditions across ranges",
          "Count only blank cells",
          "Sum numeric values",
          "Average a single column",
        ],
        correct: 0,
        explanation:
          "COUNTIFS supports counting based on several criteria applied across multiple ranges.",
      },
      {
        id: "cf-20",
        question: "What does DATEDIF calculate?",
        options: [
          "The current date",
          "The difference between two dates",
          "A date's day of the week",
          "A random future date",
        ],
        correct: 1,
        explanation:
          "DATEDIF returns the interval (in days, months, or years) between a start and end date.",
      },
    ],
  },
  {
    id: "data-management",
    title: "Data Management & Cleaning",
    description:
      "Cover sorting, filtering, validation, cleaning, and Excel Tables.",
    accent: "from-[#1F8A70] to-[#2CB67D]",
    accentHex: "#1F8A70",
    questions: [
      {
        id: "dm-1",
        question: "What is the key difference between sorting and filtering?",
        options: [
          "Sorting hides rows; filtering reorders them",
          "Filtering temporarily hides rows; sorting permanently reorders them",
          "They do the same thing",
          "Filtering deletes data; sorting does not",
        ],
        correct: 1,
        explanation:
          "Sorting changes row order permanently, while filtering only hides non-matching rows temporarily.",
      },
      {
        id: "dm-2",
        question: "What does AutoFilter add to column headers?",
        options: [
          "Bold formatting",
          "Dropdown arrows for quick filtering",
          "Data validation",
          "Conditional formatting",
        ],
        correct: 1,
        explanation:
          "AutoFilter adds dropdown controls that let users filter values ad-hoc.",
      },
      {
        id: "dm-3",
        question:
          "What does a color scale in conditional formatting typically show?",
        options: [
          "Exact duplicate values",
          "Relative magnitude of values across a range",
          "Only errors",
          "Text length",
        ],
        correct: 1,
        explanation:
          "Color scales shade cells based on their value relative to others in the range, showing magnitude at a glance.",
      },
      {
        id: "dm-4",
        question:
          "What is required to highlight an entire row based on a condition in one column?",
        options: [
          "A built-in preset only",
          "A formula-based conditional formatting rule applied to the full row range",
          "Manual formatting of each row",
          "Data validation",
        ],
        correct: 1,
        explanation:
          "A formula-based rule using a relative reference can evaluate one column and apply formatting to the whole row.",
      },
      {
        id: "dm-5",
        question: "What is the primary purpose of Data Validation?",
        options: [
          "To format cells automatically",
          "To restrict what can be entered into a cell before errors happen",
          "To sort data automatically",
          "To merge cells",
        ],
        correct: 1,
        explanation:
          "Data Validation prevents bad data entry at the source, such as restricting values to a dropdown list.",
      },
      {
        id: "dm-6",
        question:
          "Which feature lets a Data Validation dropdown pull its list from a named range?",
        options: [
          "Conditional formatting",
          "List validation sourced from a named range",
          "AutoFilter",
          "Text to Columns",
        ],
        correct: 1,
        explanation:
          "A validation dropdown can reference a named range to keep the list dynamic and centrally managed.",
      },
      {
        id: "dm-7",
        question:
          "Which function converts text that looks like a number into an actual number?",
        options: ["VALUE", "TEXT", "TRIM", "PROPER"],
        correct: 0,
        explanation:
          "VALUE converts a text string representing a number into a true numeric value.",
      },
      {
        id: "dm-8",
        question: "What does Text to Columns primarily do?",
        options: [
          "Merges multiple columns into one",
          "Splits combined data into separate fields based on a delimiter",
          "Deletes duplicate columns",
          "Formats numbers as currency",
        ],
        correct: 1,
        explanation:
          "Text to Columns splits a single column of combined text into multiple fields.",
      },
      {
        id: "dm-9",
        question: "What does Remove Duplicates do?",
        options: [
          "Removes all blank cells",
          "Strips exact-match duplicate rows based on selected columns",
          "Removes formulas",
          "Sorts data alphabetically",
        ],
        correct: 1,
        explanation:
          "Remove Duplicates deletes rows that match exactly across the columns you select.",
      },
      {
        id: "dm-10",
        question: "What is the shortcut for Flash Fill?",
        options: ["Ctrl+E", "Ctrl+F", "Ctrl+D", "Ctrl+T"],
        correct: 0,
        explanation:
          "Ctrl+E triggers Flash Fill, which detects a pattern from example entries and fills the rest.",
      },
      {
        id: "dm-11",
        question: "What makes Flash Fill useful for cleaning data?",
        options: [
          "It requires writing complex formulas",
          "It can infer a formatting pattern from just one or two manual examples",
          "It only works with numbers",
          "It deletes duplicate rows",
        ],
        correct: 1,
        explanation:
          "Flash Fill recognizes a pattern from example input and replicates it, often replacing a formula entirely.",
      },
      {
        id: "dm-12",
        question:
          "What keyboard shortcut converts a range into an Excel Table?",
        options: ["Ctrl+T", "Ctrl+E", "Ctrl+L", "Both Ctrl+T and Ctrl+L"],
        correct: 3,
        explanation:
          "Both Ctrl+T and Ctrl+L convert a selected range into a formatted Excel Table.",
      },
      {
        id: "dm-13",
        question: "What is a structured reference in an Excel Table?",
        options: [
          "A reference using cell addresses like A1",
          "A reference using column names, like Table1[Sales]",
          "A reference to another workbook only",
          "A reference that never updates",
        ],
        correct: 1,
        explanation:
          "Structured references use table and column names instead of raw cell addresses, improving readability.",
      },
      {
        id: "dm-14",
        question:
          "What happens to formulas and charts built on an Excel Table when new rows are added?",
        options: [
          "They break automatically",
          "They must be manually rebuilt",
          "They automatically expand to include the new rows",
          "Nothing changes until the file is reopened",
        ],
        correct: 2,
        explanation:
          "Tables auto-expand, so formulas, PivotTables, and charts referencing them stay current as data grows.",
      },
      {
        id: "dm-15",
        question: "Which function counts empty cells specifically?",
        options: ["COUNT", "COUNTA", "COUNTBLANK", "COUNTIF"],
        correct: 2,
        explanation:
          "COUNTBLANK counts only the empty cells within a specified range.",
      },
      {
        id: "dm-16",
        question:
          "What is a common cause of lookup functions failing on seemingly matching text?",
        options: [
          "Incorrect font size",
          "Hidden trailing spaces or inconsistent casing",
          "Too many columns",
          "Using absolute references",
        ],
        correct: 1,
        explanation:
          "Extra spaces or inconsistent formatting can make otherwise identical-looking text fail to match exactly.",
      },
      {
        id: "dm-17",
        question: "Multi-level sort allows you to:",
        options: [
          "Sort by only one column at a time",
          "Sort by a primary column and break ties with secondary columns",
          "Sort across multiple workbooks simultaneously",
          "Sort only numeric columns",
        ],
        correct: 1,
        explanation:
          "Multi-level sort lets you define a primary sort key plus one or more tie-breaking columns.",
      },
      {
        id: "dm-18",
        question:
          "What is required for sorting and filtering to work reliably?",
        options: [
          "Merged cells throughout the range",
          "Consistent column headers and no blank header rows",
          "At least one formula in the range",
          "A PivotTable built on the range",
        ],
        correct: 1,
        explanation:
          "Reliable sorting and filtering depend on clean, consistent headers across the dataset.",
      },
      {
        id: "dm-19",
        question:
          "Which validation type would you use to only allow whole numbers between 1 and 100?",
        options: [
          "List validation",
          "Whole number validation with a defined range",
          "Text length validation",
          "Custom formula validation only",
        ],
        correct: 1,
        explanation:
          "Excel's built-in Whole Number validation type lets you set a minimum and maximum bound directly.",
      },
      {
        id: "dm-20",
        question:
          "What advantage do icon sets in conditional formatting provide?",
        options: [
          "They replace the need for formulas entirely",
          "They show status (e.g. traffic-light indicators) at a glance",
          "They sort data automatically",
          "They validate data entry",
        ],
        correct: 1,
        explanation:
          "Icon sets visually flag status or thresholds, such as red/yellow/green indicators, without reading raw numbers.",
      },
    ],
  },
  {
    id: "visualization",
    title: "Charts & Visualization",
    description:
      "Test your judgment on chart selection, formatting, and dashboard basics.",
    accent: "from-[#7A4DFF] to-[#4F7CFF]",
    accentHex: "#7A4DFF",
    questions: [
      {
        id: "vz-1",
        question:
          "Which chart type is best for comparing values across categories?",
        options: [
          "Line chart",
          "Bar or column chart",
          "Pie chart",
          "Scatter plot",
        ],
        correct: 1,
        explanation:
          "Bar and column charts are designed for direct category-to-category comparison.",
      },
      {
        id: "vz-2",
        question:
          "Which chart type is best suited to showing a trend over time?",
        options: ["Pie chart", "Column chart", "Line chart", "Doughnut chart"],
        correct: 2,
        explanation:
          "Line charts connect points across a continuous period, making trends easy to read.",
      },
      {
        id: "vz-3",
        question: "Pie charts are best limited to roughly how many slices?",
        options: ["1-2", "5-6", "15-20", "Unlimited"],
        correct: 1,
        explanation:
          "Beyond 5-6 slices, pie charts become cluttered and hard to interpret accurately.",
      },
      {
        id: "vz-4",
        question:
          "Which chart type reveals the relationship between two numeric variables?",
        options: ["Pie chart", "Bar chart", "Scatter plot", "Sparkline"],
        correct: 2,
        explanation:
          "Scatter plots plot two numeric variables against each other to reveal correlation or clustering.",
      },
      {
        id: "vz-5",
        question:
          "What is a common mistake when charting data that changes over time?",
        options: [
          "Using a line chart",
          "Using a pie chart to represent a time series",
          "Adding axis labels",
          "Sorting by value",
        ],
        correct: 1,
        explanation:
          "Pie charts represent a share of a whole at one moment, not change over time, making them a poor fit for trends.",
      },
      {
        id: "vz-6",
        question:
          "What is the fastest way to create a default chart from selected data?",
        options: ["Ctrl+T", "Alt+F1", "Ctrl+E", "F5"],
        correct: 1,
        explanation:
          "Alt+F1 instantly inserts a default chart based on the current selection.",
      },
      {
        id: "vz-7",
        question: "Why should a chart avoid a generic title like 'Chart 1'?",
        options: [
          "Generic titles cause formula errors",
          "A clear, specific title is essential for the chart to communicate on its own",
          "Excel does not allow custom titles",
          "It affects the chart's data source",
        ],
        correct: 1,
        explanation:
          "A specific title helps a viewer understand what the chart shows without additional explanation.",
      },
      {
        id: "vz-8",
        question: "What are Sparklines?",
        options: [
          "Full-size charts inserted into a separate sheet",
          "Tiny, cell-sized charts showing a trend inline within a table",
          "A type of PivotChart",
          "A conditional formatting rule",
        ],
        correct: 1,
        explanation:
          "Sparklines are compact, single-cell charts ideal for showing many trends at a glance, row by row.",
      },
      {
        id: "vz-9",
        question:
          "Which Sparkline type is designed to show binary outcomes like win/loss?",
        options: ["Line", "Column", "Win/Loss", "Area"],
        correct: 2,
        explanation:
          "The Win/Loss Sparkline type shows only positive or negative outcomes, not magnitude.",
      },
      {
        id: "vz-10",
        question: "What is a combo chart used for?",
        options: [
          "Combining two unrelated worksheets",
          "Displaying two different measures that use different scales on one chart",
          "Merging duplicate data points",
          "Creating a pie chart from a bar chart",
        ],
        correct: 1,
        explanation:
          "Combo charts pair chart types (e.g. columns and a line) to show two measures with different scales together.",
      },
      {
        id: "vz-11",
        question:
          "When ranking categories in a bar chart, what should you generally do?",
        options: [
          "Leave categories in arbitrary order",
          "Sort bars by value when ranking matters",
          "Always use 3D effects",
          "Remove all axis labels",
        ],
        correct: 1,
        explanation:
          "Sorting bars by value makes ranking immediately visible rather than requiring the viewer to hunt for it.",
      },
      {
        id: "vz-12",
        question: "What is considered 'chart junk'?",
        options: [
          "Necessary axis labels",
          "Unnecessary gridlines, 3D effects, or decoration that don't aid understanding",
          "The chart title",
          "Data labels",
        ],
        correct: 1,
        explanation:
          "Chart junk refers to visual clutter that distracts from, rather than supports, the data being shown.",
      },
      {
        id: "vz-13",
        question: "Where do you go to insert a chart from selected data?",
        options: [
          "Home tab",
          "Insert tab > Charts",
          "Data tab > Sort",
          "Review tab",
        ],
        correct: 1,
        explanation:
          "The Insert tab's Charts group contains all standard and recommended chart options.",
      },
      {
        id: "vz-14",
        question: "What is the goal of a basic Excel dashboard?",
        options: [
          "To store raw unformatted data",
          "To let a viewer understand the state of the business within seconds",
          "To replace all formulas with static values",
          "To hide all charts behind filters",
        ],
        correct: 1,
        explanation:
          "A well-built dashboard combines KPIs, charts, and interactivity so key information is immediately clear.",
      },
      {
        id: "vz-15",
        question: "What typically anchors a dashboard's summary numbers?",
        options: [
          "Random static text",
          "KPIs built with formulas referencing the underlying data",
          "Only chart titles",
          "Sparklines alone",
        ],
        correct: 1,
        explanation:
          "KPIs are large, prominent summary figures usually driven by formulas connected to live data.",
      },
      {
        id: "vz-16",
        question:
          "Which chart element clarifies the unit of measurement when it isn't obvious?",
        options: ["Chart junk", "Axis labels", "Gridlines", "3D rotation"],
        correct: 1,
        explanation:
          "Axis labels tell the viewer what unit or scale the values represent.",
      },
      {
        id: "vz-17",
        question: "A doughnut chart is most similar to which other chart type?",
        options: ["Line chart", "Pie chart", "Scatter plot", "Bar chart"],
        correct: 1,
        explanation:
          "Doughnut charts show proportion of a whole, just like pie charts, with a hole in the center.",
      },
      {
        id: "vz-18",
        question:
          "What is the danger of using too many colors or effects in a chart?",
        options: [
          "It always causes formula errors",
          "It can obscure the actual data pattern the chart is meant to show",
          "Excel will not allow saving the file",
          "It disables data labels",
        ],
        correct: 1,
        explanation:
          "Excessive styling can distract from the core insight a chart is meant to communicate.",
      },
      {
        id: "vz-19",
        question:
          "Which tabs appear after a chart is created, allowing formatting adjustments?",
        options: [
          "Data and Review",
          "Chart Design and Format",
          "Page Layout only",
          "Insert and View",
        ],
        correct: 1,
        explanation:
          "The Chart Design and Format tabs appear contextually to let you adjust colors, layout, and styling.",
      },
      {
        id: "vz-20",
        question: "What should you check before choosing a chart type?",
        options: [
          "The file size",
          "The question the chart needs to answer and the structure of the data",
          "The number of worksheets in the workbook",
          "The workbook's theme colors only",
        ],
        correct: 1,
        explanation:
          "Chart choice should be driven by the analytical question and data structure, not visual preference alone.",
      },
    ],
  },
  {
    id: "pivot-analysis",
    title: "PivotTables & Data Analysis",
    description:
      "Assess your skills with PivotTables, slicers, PivotCharts, and What-If tools.",
    accent: "from-[#6D2E46] to-[#9B4D57]",
    accentHex: "#6D2E46",
    questions: [
      {
        id: "pa-1",
        question:
          "What are the four areas you drag fields into when building a PivotTable?",
        options: [
          "Rows, Columns, Values, Filters",
          "Headers, Footers, Body, Totals",
          "Input, Output, Process, Review",
          "Names, Formulas, Charts, Tables",
        ],
        correct: 0,
        explanation:
          "PivotTables summarize data using Rows, Columns, Values, and Filters as the four field areas.",
      },
      {
        id: "pa-2",
        question:
          "By default, how does a PivotTable summarize a numeric field placed in Values?",
        options: ["Average", "Sum", "Count", "Max"],
        correct: 1,
        explanation:
          "Numeric fields default to Sum, while text fields default to Count.",
      },
      {
        id: "pa-3",
        question:
          "Why is it recommended to build a PivotTable on an Excel Table rather than a plain range?",
        options: [
          "PivotTables cannot use plain ranges",
          "The Table's source data expands automatically as new rows are added",
          "It changes the default aggregation to Average",
          "It removes the need for Refresh",
        ],
        correct: 1,
        explanation:
          "A Table auto-expands, so the PivotTable's source keeps growing with new data (still needs Refresh to pull it in).",
      },
      {
        id: "pa-4",
        question: "What does the Value Field Settings dialog let you change?",
        options: [
          "The chart type only",
          "The aggregation type, such as sum, average, or count",
          "The workbook theme",
          "The print area",
        ],
        correct: 1,
        explanation:
          "Value Field Settings controls how a field is aggregated, e.g. switching from Sum to Average.",
      },
      {
        id: "pa-5",
        question: "What does 'Show Values As: % of Column Total' do?",
        options: [
          "Removes the field from the pivot",
          "Converts a raw total into a percentage of its column's total",
          "Sorts the column alphabetically",
          "Hides values below zero",
        ],
        correct: 1,
        explanation:
          "This option recalculates each value as a percentage share within its column, aiding comparison.",
      },
      {
        id: "pa-6",
        question: "How can date fields be grouped in a PivotTable?",
        options: [
          "They cannot be grouped",
          "Into months, quarters, or years via right-click",
          "Only into single days",
          "Only through a separate formula",
        ],
        correct: 1,
        explanation:
          "Right-clicking a date field in a PivotTable offers grouping options like months, quarters, and years.",
      },
      {
        id: "pa-7",
        question: "What is a Slicer used for?",
        options: [
          "Formatting numbers",
          "Providing clickable buttons to filter a PivotTable or Table interactively",
          "Creating a chart",
          "Validating data entry",
        ],
        correct: 1,
        explanation:
          "Slicers give a button-based interface for filtering, making dashboards feel interactive.",
      },
      {
        id: "pa-8",
        question: "How can one Slicer filter multiple PivotTables at once?",
        options: [
          "It cannot; each PivotTable needs its own slicer",
          "By connecting it to multiple PivotTables via Report Connections",
          "By duplicating the slicer manually",
          "By merging the PivotTables into one",
        ],
        correct: 1,
        explanation:
          "Report Connections let a single slicer control several PivotTables simultaneously.",
      },
      {
        id: "pa-9",
        question:
          "What is a Timeline in Excel specifically designed to filter?",
        options: [
          "Text fields",
          "Date fields",
          "Numeric ranges",
          "Boolean fields",
        ],
        correct: 1,
        explanation:
          "A Timeline is a specialized slicer built specifically for scrubbing through date fields.",
      },
      {
        id: "pa-10",
        question: "What is a PivotChart?",
        options: [
          "A static image of a PivotTable",
          "A chart built on a PivotTable's field layout that updates as filters or fields change",
          "A chart that cannot be filtered",
          "A chart requiring VBA to create",
        ],
        correct: 1,
        explanation:
          "PivotCharts stay dynamically linked to their PivotTable's structure and filters.",
      },
      {
        id: "pa-11",
        question: "What does Goal Seek do?",
        options: [
          "Shows a grid of outcomes across multiple inputs",
          "Solves for the input needed to reach a specified output",
          "Creates a PivotTable automatically",
          "Formats cells conditionally",
        ],
        correct: 1,
        explanation:
          "Goal Seek works backward from a target output to find the required input value.",
      },
      {
        id: "pa-12",
        question: "What does a Data Table (under What-If Analysis) produce?",
        options: [
          "A single answer like Goal Seek",
          "A full sensitivity grid showing outcomes across a range of one or two inputs",
          "A PivotTable",
          "A chart",
        ],
        correct: 1,
        explanation:
          "Data Tables calculate a formula's result across a full range of input combinations at once.",
      },
      {
        id: "pa-13",
        question:
          "Which layout options are available for displaying a PivotTable?",
        options: [
          "Compact, Outline, Tabular",
          "Portrait, Landscape, Mixed",
          "Grid, List, Card",
          "Ascending, Descending, Custom",
        ],
        correct: 0,
        explanation:
          "PivotTable layout can be switched between Compact, Outline, and Tabular forms.",
      },
      {
        id: "pa-14",
        question:
          "What happens if you change a PivotTable's underlying source data?",
        options: [
          "The PivotTable updates instantly and automatically",
          "You must manually click Refresh to reflect the changes",
          "The PivotTable is deleted",
          "Nothing can be done until the file is reopened",
        ],
        correct: 1,
        explanation:
          "PivotTables do not auto-refresh; you need to click Refresh (or refresh on open) to pull in updated data.",
      },
      {
        id: "pa-15",
        question:
          "What is the purpose of numeric field grouping in a PivotTable?",
        options: [
          "To delete outlier values",
          "To bucket continuous numbers into custom ranges, like age bins",
          "To convert numbers to text",
          "To sort numbers alphabetically",
        ],
        correct: 1,
        explanation:
          "Numeric grouping lets you create bins (e.g. 0-18, 19-35) for clearer categorical analysis.",
      },
      {
        id: "pa-16",
        question: "What is the purpose of a Report Filter in a PivotTable?",
        options: [
          "To narrow the entire pivot view based on a field",
          "To sort rows alphabetically",
          "To format numbers as currency",
          "To rename column headers",
        ],
        correct: 0,
        explanation:
          "A Report Filter restricts the entire PivotTable to a subset defined by the filtered field.",
      },
      {
        id: "pa-17",
        question:
          "Which tool would you use to find what price achieves exactly $50,000 in projected revenue?",
        options: ["Data Table", "Goal Seek", "PivotChart", "Slicer"],
        correct: 1,
        explanation:
          "Goal Seek is designed for exactly this kind of single-variable, backward-solving scenario.",
      },
      {
        id: "pa-18",
        question:
          "Why are PivotCharts considered more dashboard-friendly than static charts built on raw formulas?",
        options: [
          "They require no source data",
          "They update automatically as the PivotTable's fields and filters change",
          "They cannot be filtered at all",
          "They are always faster to build",
        ],
        correct: 1,
        explanation:
          "Because PivotCharts inherit the PivotTable's dynamic filtering, they stay current without manual rework.",
      },
      {
        id: "pa-19",
        question:
          "What is required before you can filter directly from a PivotChart itself?",
        options: [
          "Nothing extra — PivotCharts inherit field buttons and filter controls from their PivotTable",
          "A separate slicer must always be created",
          "The PivotTable must be deleted",
          "VBA code must be written",
        ],
        correct: 0,
        explanation:
          "PivotCharts come with built-in field buttons that let you filter directly on the chart.",
      },
      {
        id: "pa-20",
        question:
          "What is a key advantage of using % of Column Total over a raw sum in a PivotTable?",
        options: [
          "It changes the underlying data",
          "It turns a raw total into a more meaningful relative comparison",
          "It removes the need for a PivotChart",
          "It automatically sorts the table",
        ],
        correct: 1,
        explanation:
          "Percentages often reveal patterns (like relative share) that raw totals alone can obscure.",
      },
    ],
  },
  {
    id: "advanced-excel",
    title: "Advanced Excel & Automation",
    description:
      "Push into dynamic arrays, Power Query, Power Pivot, and VBA fundamentals.",
    accent: "from-[#F97316] to-[#F59E0B]",
    accentHex: "#F97316",
    questions: [
      {
        id: "ae-1",
        question: "What does it mean when a dynamic array function 'spills'?",
        options: [
          "It causes an error",
          "Its results automatically flow into neighboring cells without manual copying",
          "It deletes surrounding data",
          "It only works with VBA",
        ],
        correct: 1,
        explanation:
          "Spilling means the formula's array result populates adjacent cells automatically as data changes.",
      },
      {
        id: "ae-2",
        question:
          "Which function extracts rows from a range that match a condition?",
        options: ["SORT", "FILTER", "UNIQUE", "SEQUENCE"],
        correct: 1,
        explanation:
          "FILTER returns only the rows meeting a specified logical condition.",
      },
      {
        id: "ae-3",
        question:
          "Which function removes duplicate values and returns only distinct entries?",
        options: ["UNIQUE", "SORT", "SEQUENCE", "FILTER"],
        correct: 0,
        explanation:
          "UNIQUE returns the distinct set of values from a given range.",
      },
      {
        id: "ae-4",
        question: "What did dynamic array functions largely replace?",
        options: [
          "PivotTables",
          "Older array formulas requiring Ctrl+Shift+Enter",
          "VLOOKUP entirely",
          "Conditional formatting",
        ],
        correct: 1,
        explanation:
          "Dynamic arrays calculate and spill automatically, removing the need for legacy Ctrl+Shift+Enter array formulas.",
      },
      {
        id: "ae-5",
        question: "What is Power Query primarily used for?",
        options: [
          "Creating charts",
          "Connecting to, transforming, and repeatedly loading data from various sources",
          "Writing VBA macros",
          "Formatting cell borders",
        ],
        correct: 1,
        explanation:
          "Power Query is Excel's ETL tool for extracting, transforming, and loading data in a repeatable pipeline.",
      },
      {
        id: "ae-6",
        question: "Where are Power Query's transformation steps recorded?",
        options: [
          "In the Formula Bar",
          "In the Applied Steps pane",
          "In a hidden worksheet",
          "In the VBA Editor",
        ],
        correct: 1,
        explanation:
          "Each transformation is logged as a step in the Applied Steps pane, forming a repeatable pipeline.",
      },
      {
        id: "ae-7",
        question:
          "What happens when you refresh a Power Query connected to updated source data?",
        options: [
          "Nothing changes automatically",
          "The entire recorded transformation pipeline reruns on the new data",
          "Only formatting updates",
          "The query must be manually rebuilt",
        ],
        correct: 1,
        explanation:
          "Refreshing re-executes every recorded step against the current source data automatically.",
      },
      {
        id: "ae-8",
        question: "What does Power Pivot's Data Model allow you to do?",
        options: [
          "Only work with a single flat table",
          "Load multiple tables and define relationships between them",
          "Replace all formulas with macros",
          "Automatically write VBA code",
        ],
        correct: 1,
        explanation:
          "The Data Model lets you relate multiple tables directly, similar to a relational database.",
      },
      {
        id: "ae-9",
        question: "What is DAX?",
        options: [
          "A charting library",
          "The formula language used within Power Pivot for calculated columns and measures",
          "A file format for Excel",
          "A type of PivotTable",
        ],
        correct: 1,
        explanation:
          "DAX (Data Analysis Expressions) is used to build calculations that operate across Power Pivot's relational model.",
      },
      {
        id: "ae-10",
        question: "What does the Macro Recorder produce?",
        options: [
          "A PDF report",
          "VBA code representing the recorded manual actions",
          "A PivotTable",
          "A Power Query step",
        ],
        correct: 1,
        explanation:
          "The Macro Recorder translates a sequence of manual actions directly into VBA code.",
      },
      {
        id: "ae-11",
        question: "What is a common limitation of recorded macros?",
        options: [
          "They cannot be replayed",
          "The generated code is often inefficient and brittle, requiring manual refinement",
          "They cannot use loops",
          "They always crash Excel",
        ],
        correct: 1,
        explanation:
          "Recorded macros are a starting point; editing in the VBA Editor is usually needed for robustness.",
      },
      {
        id: "ae-12",
        question: "What does Option Explicit enforce in VBA?",
        options: [
          "That all loops must be For loops",
          "That every variable must be declared before use",
          "That macros run automatically on open",
          "That only functions, not subs, can be used",
        ],
        correct: 1,
        explanation:
          "Option Explicit forces variable declarations, catching typo-related bugs before they cause silent errors.",
      },
      {
        id: "ae-13",
        question: "What is the difference between a VBA Sub and a Function?",
        options: [
          "There is no difference",
          "A Function returns a value and can be called like a worksheet formula; a Sub performs an action without returning one",
          "A Sub is faster than a Function",
          "Only Functions can use loops",
        ],
        correct: 1,
        explanation:
          "Functions return values usable elsewhere, including in worksheet formulas; Subs simply execute actions.",
      },
      {
        id: "ae-14",
        question:
          "Which VBA construct is used to iterate over a collection of objects, like all worksheets?",
        options: [
          "If...Then",
          "For Each...Next",
          "Option Explicit",
          "On Error",
        ],
        correct: 1,
        explanation:
          "For Each...Next loops through every item in a collection, such as all sheets in a workbook.",
      },
      {
        id: "ae-15",
        question: "What is the purpose of On Error handling in VBA?",
        options: [
          "To speed up code execution",
          "To prevent a single failure from crashing an entire automated process",
          "To declare variables",
          "To format cells",
        ],
        correct: 1,
        explanation:
          "Error handling lets a macro gracefully manage unexpected failures rather than halting entirely.",
      },
      {
        id: "ae-16",
        question:
          "In good financial model design, why should Inputs, Calculations, and Outputs be separated?",
        options: [
          "It is required by Excel",
          "It makes models auditable and reduces the risk of assumptions being overwritten by formulas",
          "It speeds up recalculation significantly",
          "It is only a stylistic preference with no practical benefit",
        ],
        correct: 1,
        explanation:
          "Separation keeps assumptions visible and protected from being silently altered by formula logic.",
      },
      {
        id: "ae-17",
        question: "What does the Scenario Manager help you do?",
        options: [
          "Record macros",
          "Compare best-case, base-case, and worst-case outcomes",
          "Build PivotTables",
          "Clean duplicate data",
        ],
        correct: 1,
        explanation:
          "Scenario Manager stores different sets of input assumptions so you can switch between and compare outcomes.",
      },
      {
        id: "ae-18",
        question: "What does the LAMBDA function allow you to do?",
        options: [
          "Sort a range",
          "Define custom, reusable functions using Excel's native formula language",
          "Record a macro",
          "Connect to external data",
        ],
        correct: 1,
        explanation:
          "LAMBDA lets you build your own named, reusable functions without writing VBA.",
      },
      {
        id: "ae-19",
        question: "What does the Trace Precedents tool show?",
        options: [
          "Which cells depend on the active formula",
          "Which cells feed into the active formula",
          "The workbook's file size",
          "A chart's data source",
        ],
        correct: 1,
        explanation:
          "Trace Precedents draws arrows back to the cells that supply values into the active formula.",
      },
      {
        id: "ae-20",
        question:
          "What is a key benefit of using named ranges and LET in a complex model?",
        options: [
          "They make formulas harder to audit",
          "They improve formula readability by naming values instead of using raw cell references",
          "They automatically create PivotTables",
          "They are required for Power Query to function",
        ],
        correct: 1,
        explanation:
          "Named ranges and LET let you refer to meaningful names instead of raw addresses, making formulas easier to read and audit.",
      },
    ],
  },
  {
    id: "formatting-presentation",
    title: "Formatting & Presentation",
    description:
      "Custom number formats, cell styles, themes, and print layout essentials.",
    accent: "from-[#0EA5A5] to-[#14B8A6]",
    accentHex: "#0EA5A5",
    questions: [
      {
        id: "fp-1",
        question:
          "Do custom number formats change a cell's underlying stored value?",
        options: [
          "Yes, always",
          "No, they only change how the value displays",
          "Only for dates",
          "Only for negative numbers",
        ],
        correct: 1,
        explanation:
          "Custom formats affect display only; formulas still calculate on the true stored number.",
      },
      {
        id: "fp-2",
        question:
          "How many sections can a custom number format define, separated by semicolons?",
        options: ["Up to two", "Up to three", "Up to four", "Unlimited"],
        correct: 2,
        explanation:
          "A custom format can define positive;negative;zero;text sections, in that order.",
      },
      {
        id: "fp-3",
        question: "What does a Cell Style bundle together?",
        options: [
          "Only font color",
          "Font, fill, border, and number format into one reusable, named style",
          "Only borders",
          "Only number formats",
        ],
        correct: 1,
        explanation:
          "A Cell Style combines multiple formatting attributes so they can be applied and updated as one unit.",
      },
      {
        id: "fp-4",
        question: "What is the benefit of updating a Cell Style's definition?",
        options: [
          "Nothing changes elsewhere",
          "Every cell using that style updates automatically",
          "It only affects new cells",
          "It resets all formatting",
        ],
        correct: 1,
        explanation:
          "Because cells reference the named style, editing the style updates every cell that uses it at once.",
      },
      {
        id: "fp-5",
        question: "What does a Workbook Theme control?",
        options: [
          "Only print margins",
          "The palette of colors, fonts, and effects used across styles, charts, and tables",
          "Only formula calculation order",
          "Only worksheet tab colors",
        ],
        correct: 1,
        explanation:
          "Themes provide a consistent visual palette that cell styles, charts, and tables can draw from.",
      },
      {
        id: "fp-6",
        question: "What does setting a Print Area do?",
        options: [
          "Deletes cells outside the range",
          "Defines exactly which cells will print",
          "Changes the file format",
          "Hides the selected cells on screen",
        ],
        correct: 1,
        explanation:
          "Print Area restricts printing to a specific range, preventing accidental multi-page printouts of unrelated data.",
      },
      {
        id: "fp-7",
        question:
          "What does Print Titles let you repeat on every printed page?",
        options: [
          "The workbook name only",
          "Header rows or columns, useful for multi-page tables",
          "Cell comments",
          "Conditional formatting rules",
        ],
        correct: 1,
        explanation:
          "Print Titles keeps chosen header rows/columns visible on every page of a multi-page printout.",
      },
      {
        id: "fp-8",
        question: "What does the 'Fit to 1 page wide' scaling option do?",
        options: [
          "Deletes extra columns",
          "Shrinks content to fit a page width without manually resizing columns",
          "Increases font size",
          "Merges all pages into one",
        ],
        correct: 1,
        explanation:
          "Scaling automatically shrinks the printed output to fit within a specified page width.",
      },
      {
        id: "fp-9",
        question: "What does Freeze Panes do?",
        options: [
          "Deletes rows permanently",
          "Locks specified rows and/or columns in place while scrolling",
          "Protects the sheet with a password",
          "Splits the window into separate files",
        ],
        correct: 1,
        explanation:
          "Freeze Panes keeps chosen rows or columns visible on screen while you scroll through the rest of the data.",
      },
      {
        id: "fp-10",
        question: "How does Split differ from Freeze Panes?",
        options: [
          "They are identical features",
          "Split divides the window into independently scrollable panes rather than locking rows/columns",
          "Split only works in Print Preview",
          "Split removes gridlines",
        ],
        correct: 1,
        explanation:
          "Split creates separate scrollable regions, useful for comparing distant parts of the same sheet, unlike the lock behavior of Freeze Panes.",
      },
      {
        id: "fp-11",
        question: "What does a Custom View save?",
        options: [
          "Only the print area",
          "A combination of print settings, filters, and hidden rows/columns under a name",
          "Only cell colors",
          "The workbook's file path",
        ],
        correct: 1,
        explanation:
          "Custom Views let you switch between saved combinations of display and print settings without duplicating the sheet.",
      },
      {
        id: "fp-12",
        question: "What is Page Break Preview used for?",
        options: [
          "Changing font themes",
          "Showing and manually adjusting where printed pages will split",
          "Validating data entry",
          "Creating PivotTables",
        ],
        correct: 1,
        explanation:
          "Page Break Preview visually shows page boundaries, which can be dragged to control layout before printing.",
      },
      {
        id: "fp-13",
        question:
          "Which dynamic field can headers/footers include when printing?",
        options: [
          "Only static text",
          "Page numbers, dates, or file paths",
          "Chart images only",
          "PivotTable filters",
        ],
        correct: 1,
        explanation:
          "Headers and footers support dynamic fields like page number, date, and file path that update automatically.",
      },
      {
        id: "fp-14",
        question:
          "What custom format code section controls how negative numbers display?",
        options: [
          "The first section",
          "The second section",
          "The third section",
          "The fourth section",
        ],
        correct: 1,
        explanation:
          "The custom format order is positive;negative;zero;text, so the second section governs negative display.",
      },
      {
        id: "fp-15",
        question: "Which tab contains Print Area and Print Titles settings?",
        options: ["Home", "Insert", "Page Layout", "Review"],
        correct: 2,
        explanation:
          "Print Area, Print Titles, and related layout options live on the Page Layout tab.",
      },
      {
        id: "fp-16",
        question:
          "What is a practical use of the 'zero' section in a custom number format?",
        options: [
          "Hiding zero values by leaving the section blank",
          "Making zeros bold automatically",
          "Converting zero to text",
          "Deleting all zero values",
        ],
        correct: 0,
        explanation:
          "Leaving the zero section empty in a custom format effectively hides zero values from display.",
      },
      {
        id: "fp-17",
        question:
          "Why might a company use Workbook Themes across multiple files?",
        options: [
          "To increase file size",
          "To keep a consistent visual look aligned with brand colors",
          "To disable conditional formatting",
          "To prevent printing",
        ],
        correct: 1,
        explanation:
          "Themes make it easy to apply consistent colors and fonts across many workbooks or sheets.",
      },
      {
        id: "fp-18",
        question:
          "What happens to formatting when you apply a Cell Style versus manually formatting each cell?",
        options: [
          "No difference at all",
          "The style keeps formatting centrally managed and consistent across all cells using it",
          "Manual formatting is always faster to maintain",
          "Cell Styles cannot include number formats",
        ],
        correct: 1,
        explanation:
          "Cell Styles centralize formatting so a single update propagates everywhere the style is applied.",
      },
      {
        id: "fp-19",
        question:
          "Which feature would you use to keep ID and header columns visible while scrolling through thousands of rows?",
        options: [
          "Print Titles",
          "Freeze Panes",
          "Custom Number Format",
          "Text to Columns",
        ],
        correct: 1,
        explanation:
          "Freeze Panes keeps chosen rows/columns pinned on screen regardless of how far you scroll.",
      },
      {
        id: "fp-20",
        question:
          "What is the risk of skipping Print Area and Print Titles before printing a large report?",
        options: [
          "No risk at all",
          "An unusable, poorly organized multi-page printout",
          "The file will fail to save",
          "Formulas will break",
        ],
        correct: 1,
        explanation:
          "Without these settings, large reports often print with missing headers or awkward page splits.",
      },
    ],
  },
  {
    id: "financial-statistical-functions",
    title: "Financial & Statistical Functions",
    description:
      "PMT, NPV, IRR, standard deviation, and forecasting fundamentals.",
    accent: "from-[#B45309] to-[#D97706]",
    accentHex: "#B45309",
    questions: [
      {
        id: "fs-1",
        question: "What does the PMT function calculate?",
        options: [
          "Total number of periods",
          "A fixed periodic payment for a loan or investment",
          "Present value only",
          "The interest rate only",
        ],
        correct: 1,
        explanation:
          "PMT calculates the fixed periodic payment given rate, number of periods, and present value.",
      },
      {
        id: "fs-2",
        question:
          "Which five functions share the same underlying time-value-of-money variables?",
        options: [
          "SUM, AVERAGE, COUNT, MAX, MIN",
          "PMT, FV, PV, NPER, RATE",
          "IF, AND, OR, NOT, IFS",
          "VLOOKUP, INDEX, MATCH, XLOOKUP, FILTER",
        ],
        correct: 1,
        explanation:
          "PMT, FV, PV, NPER, and RATE can each solve for the one unknown given the other four.",
      },
      {
        id: "fs-3",
        question:
          "In these functions, how are cash outflows (payments made) typically entered?",
        options: [
          "As positive numbers",
          "As negative numbers",
          "As text",
          "As percentages",
        ],
        correct: 1,
        explanation:
          "By convention, money paid out is negative and money received is positive.",
      },
      {
        id: "fs-4",
        question: "What does NPV calculate?",
        options: [
          "The future value of a single deposit",
          "The present-day value of a series of future cash flows, discounted at a given rate",
          "The internal rate of return",
          "The monthly payment on a loan",
        ],
        correct: 1,
        explanation:
          "NPV discounts a stream of future cash flows back to today's value using a specified discount rate.",
      },
      {
        id: "fs-5",
        question: "What does IRR solve for?",
        options: [
          "The payment amount",
          "The discount rate at which NPV equals zero",
          "The future value of an investment",
          "The number of periods",
        ],
        correct: 1,
        explanation:
          "IRR is the break-even discount rate for a series of cash flows, where NPV becomes zero.",
      },
      {
        id: "fs-6",
        question: "A positive NPV at a given discount rate generally suggests:",
        options: [
          "A losing investment",
          "A worthwhile investment at that rate",
          "An error in the cash flow signs",
          "The IRR is negative",
        ],
        correct: 1,
        explanation:
          "A positive NPV indicates the investment is expected to generate more value than the discount rate requires.",
      },
      {
        id: "fs-7",
        question: "Which statistic is most resistant to outliers?",
        options: ["AVERAGE", "MEDIAN", "SUM", "STDEV.P"],
        correct: 1,
        explanation:
          "MEDIAN reflects the middle value and is far less affected by extreme outliers than the mean.",
      },
      {
        id: "fs-8",
        question:
          "Which function returns the most frequently occurring value in a dataset?",
        options: ["MEDIAN", "MODE.SNGL", "STDEV.S", "QUARTILE"],
        correct: 1,
        explanation:
          "MODE.SNGL identifies the single most frequent value in a range.",
      },
      {
        id: "fs-9",
        question: "When should you use STDEV.S instead of STDEV.P?",
        options: [
          "When your data represents the entire population",
          "When your data represents only a sample of the population",
          "They are always interchangeable",
          "Only when working with dates",
        ],
        correct: 1,
        explanation:
          "STDEV.S is designed for a sample, while STDEV.P is designed for a full population; using the wrong one skews results.",
      },
      {
        id: "fs-10",
        question: "What do QUARTILE and PERCENTILE functions do?",
        options: [
          "Calculate loan payments",
          "Divide data into ranked segments to identify outliers or top performers",
          "Convert text to numbers",
          "Sum a filtered range",
        ],
        correct: 1,
        explanation:
          "These functions return values at specific ranked positions within a distribution.",
      },
      {
        id: "fs-11",
        question: "What does CORREL measure?",
        options: [
          "Total variance",
          "The strength and direction of a linear relationship between two variables",
          "A loan's monthly payment",
          "The mode of a dataset",
        ],
        correct: 1,
        explanation:
          "CORREL returns a value between -1 and 1 indicating how strongly two variables move together.",
      },
      {
        id: "fs-12",
        question: "What does FORECAST.LINEAR do?",
        options: [
          "Calculates a loan payment",
          "Predicts a future value along a linear trend from historical data",
          "Removes duplicate values",
          "Groups dates into quarters",
        ],
        correct: 1,
        explanation:
          "FORECAST.LINEAR projects a future value assuming a straight-line trend based on known data.",
      },
      {
        id: "fs-13",
        question: "How does TREND differ from FORECAST.LINEAR in typical use?",
        options: [
          "TREND cannot be used for forecasting at all",
          "TREND can return an entire array of predicted values at once",
          "TREND only works with text data",
          "There is no meaningful difference",
        ],
        correct: 1,
        explanation:
          "TREND fits a line through known data and can output multiple predicted values in one array.",
      },
      {
        id: "fs-14",
        question:
          "What must be enabled before using the Analysis ToolPak's Regression tool?",
        options: [
          "Nothing, it's on by default",
          "The Analysis ToolPak add-in via File > Options > Add-ins",
          "Power Query",
          "Data Validation",
        ],
        correct: 1,
        explanation:
          "The Analysis ToolPak is an optional add-in that must be enabled before its Regression tool becomes available.",
      },
      {
        id: "fs-15",
        question:
          "What kind of output does the Regression tool provide beyond a simple forecast?",
        options: [
          "Only a single predicted number",
          "R-squared, coefficients, and p-values for rigorous statistical analysis",
          "A chart with no numeric output",
          "A PivotTable",
        ],
        correct: 1,
        explanation:
          "Regression analysis provides a full statistical summary, going well beyond a single point estimate.",
      },
      {
        id: "fs-16",
        question: "What does FV calculate?",
        options: [
          "Present value",
          "Future value of an investment or loan",
          "The interest rate",
          "The payment amount",
        ],
        correct: 1,
        explanation:
          "FV projects what a series of payments or a lump sum will grow to by a future date.",
      },
      {
        id: "fs-17",
        question: "What does NPER solve for?",
        options: [
          "The payment amount",
          "The number of periods needed to pay off or grow an investment",
          "The interest rate",
          "The present value",
        ],
        correct: 1,
        explanation:
          "NPER calculates how many payment periods are required given the other loan/investment variables.",
      },
      {
        id: "fs-18",
        question:
          "Why must NPV and IRR cash flows be entered with consistent sign conventions?",
        options: [
          "It's just a stylistic preference",
          "Incorrect signs will produce inaccurate or misleading results",
          "Excel ignores the signs entirely",
          "Only IRR requires signs, not NPV",
        ],
        correct: 1,
        explanation:
          "Both functions rely on correctly signed inflows/outflows to compute meaningful results.",
      },
      {
        id: "fs-19",
        question:
          "Which measure describes the spread or dispersion of a dataset?",
        options: ["MEDIAN", "MODE", "Standard deviation", "SUM"],
        correct: 2,
        explanation:
          "Standard deviation quantifies how spread out values are around the mean.",
      },
      {
        id: "fs-20",
        question:
          "If you only have a sample of survey responses rather than the entire population, which function should you use to measure spread?",
        options: ["STDEV.P", "STDEV.S", "VAR.P", "MEDIAN"],
        correct: 1,
        explanation:
          "STDEV.S is the correct choice when working with a sample rather than the full population.",
      },
    ],
  },
  {
    id: "error-handling-auditing",
    title: "Error Handling & Formula Auditing",
    description:
      "Read error values correctly and use auditing tools to debug with confidence.",
    accent: "from-[#DC2626] to-[#F87171]",
    accentHex: "#DC2626",
    questions: [
      {
        id: "eh-1",
        question: "What does the #DIV/0! error typically indicate?",
        options: [
          "A missing function name",
          "Division by zero or an empty denominator cell",
          "A broken cell reference",
          "A wrong data type",
        ],
        correct: 1,
        explanation:
          "#DIV/0! appears when a formula divides by zero or by an empty cell treated as zero.",
      },
      {
        id: "eh-2",
        question: "What does #N/A typically mean?",
        options: [
          "A circular reference",
          "A lookup function found no matching value",
          "A formula name typo",
          "A deleted worksheet",
        ],
        correct: 1,
        explanation:
          "#N/A signals that a lookup (like VLOOKUP or MATCH) could not find the requested value.",
      },
      {
        id: "eh-3",
        question: "What does #REF! usually indicate?",
        options: [
          "An incorrect data type",
          "A formula references a cell, row, column, or sheet that no longer exists",
          "A missing function argument",
          "A rounding error",
        ],
        correct: 1,
        explanation:
          "#REF! commonly appears after deleting a row, column, or sheet that a formula depended on.",
      },
      {
        id: "eh-4",
        question: "What does #VALUE! typically mean?",
        options: [
          "A missing named range",
          "A formula received the wrong data type",
          "A broken hyperlink",
          "A protected sheet",
        ],
        correct: 1,
        explanation:
          "#VALUE! usually appears when text is used where a number is expected, or vice versa.",
      },
      {
        id: "eh-5",
        question: "What does #NAME? usually indicate?",
        options: [
          "A print area error",
          "A typo in a function name or an undefined named range",
          "A chart formatting issue",
          "A locked cell",
        ],
        correct: 1,
        explanation:
          "#NAME? appears when Excel doesn't recognize text in a formula as a valid function or name.",
      },
      {
        id: "eh-6",
        question: "What does IFERROR do?",
        options: [
          "Deletes the formula on error",
          "Catches any error a formula produces and substitutes a fallback value",
          "Only catches #N/A errors",
          "Prevents formulas from being entered",
        ],
        correct: 1,
        explanation:
          "IFERROR wraps a formula and returns a specified value if any error occurs.",
      },
      {
        id: "eh-7",
        question: "How does IFNA differ from IFERROR?",
        options: [
          "They are identical",
          "IFNA only catches #N/A errors, letting other errors surface visibly",
          "IFNA catches every error type",
          "IFNA cannot be used with lookups",
        ],
        correct: 1,
        explanation:
          "IFNA is more targeted, catching only #N/A while allowing genuine bugs like #REF! to remain visible.",
      },
      {
        id: "eh-8",
        question: "Why might blanket use of IFERROR be risky?",
        options: [
          "It slows down calculation significantly",
          "It can silently hide genuine mistakes along with expected 'no result' cases",
          "It only works with text functions",
          "It disables AutoSum",
        ],
        correct: 1,
        explanation:
          "IFERROR suppresses all error types, which can mask real bugs, not just expected missing-match cases.",
      },
      {
        id: "eh-9",
        question: "What does Trace Precedents show?",
        options: [
          "Which cells depend on the active formula",
          "Which cells feed into the active formula",
          "The workbook's saved versions",
          "Print area boundaries",
        ],
        correct: 1,
        explanation:
          "Trace Precedents draws arrows pointing back to the cells that supply the active formula's inputs.",
      },
      {
        id: "eh-10",
        question: "What does Trace Dependents show?",
        options: [
          "Which cells feed into the active formula",
          "Which cells rely on the active formula",
          "Chart data sources",
          "Data validation rules",
        ],
        correct: 1,
        explanation:
          "Trace Dependents shows which downstream cells would be affected by changing the active cell.",
      },
      {
        id: "eh-11",
        question:
          "Why are Trace Precedents/Dependents valuable before editing a cell?",
        options: [
          "They automatically fix errors",
          "They reveal the full impact ('blast radius') of a change before it's made",
          "They speed up recalculation",
          "They replace the need for testing",
        ],
        correct: 1,
        explanation:
          "Seeing dependency arrows helps you understand what else might break before you make a change.",
      },
      {
        id: "eh-12",
        question: "What does Evaluate Formula do?",
        options: [
          "Deletes unnecessary formulas",
          "Steps through a complex nested formula one calculation at a time",
          "Converts formulas to values",
          "Protects a worksheet",
        ],
        correct: 1,
        explanation:
          "Evaluate Formula lets you watch a nested formula resolve step by step, revealing exactly how the result is reached.",
      },
      {
        id: "eh-13",
        question: "When is Evaluate Formula most useful?",
        options: [
          "When a formula returns an outright error only",
          "When a formula returns an unexpected value with no error at all",
          "Only for date functions",
          "Only for VBA macros",
        ],
        correct: 1,
        explanation:
          "It's especially useful for debugging formulas that calculate 'successfully' but produce a wrong-looking result.",
      },
      {
        id: "eh-14",
        question: "What does the Watch Window let you do?",
        options: [
          "Track changes in a shared workbook",
          "Monitor specific cells' values while editing elsewhere in the workbook",
          "Record a macro",
          "Set a print area",
        ],
        correct: 1,
        explanation:
          "The Watch Window keeps chosen cells visible in a floating panel regardless of where you're currently working.",
      },
      {
        id: "eh-15",
        question:
          "Which is a structural way to prevent formula errors before they happen?",
        options: [
          "Wrapping everything in IFERROR",
          "Locking formula cells with sheet protection and using data validation for input cells",
          "Deleting all error-prone formulas",
          "Avoiding named ranges",
        ],
        correct: 1,
        explanation:
          "Preventing bad edits and bad input structurally is more effective than only catching errors after the fact.",
      },
      {
        id: "eh-16",
        question:
          "What is a benefit of using SUMIFS instead of a long chain of nested IFs?",
        options: [
          "It is always slower",
          "It reduces complexity and is generally more defensively designed",
          "It disables error checking",
          "It requires VBA",
        ],
        correct: 1,
        explanation:
          "SUMIFS handles multiple conditions cleanly, reducing the fragility of deeply nested logic.",
      },
      {
        id: "eh-17",
        question: "What is the purpose of a sanity-check cell in a model?",
        options: [
          "To slow down calculation intentionally",
          "To flag when two totals that should match don't, surfacing problems immediately",
          "To replace the need for formulas",
          "To hide errors from view",
        ],
        correct: 1,
        explanation:
          "A sanity-check cell (e.g. comparing two totals) catches inconsistencies before they silently propagate.",
      },
      {
        id: "eh-18",
        question:
          "Referencing named ranges instead of hard-coded cell addresses primarily helps with:",
        options: [
          "Faster file saving",
          "Formula clarity and reduced risk when the layout changes",
          "Automatic error correction",
          "Chart formatting",
        ],
        correct: 1,
        explanation:
          "Named ranges make formulas more readable and less brittle to structural changes in the sheet.",
      },
      {
        id: "eh-19",
        question:
          "If a formula suddenly shows #REF! after editing, what is the most likely cause to check first?",
        options: [
          "A recently changed number format",
          "A recently deleted row, column, or sheet that the formula depended on",
          "A print area change",
          "A theme change",
        ],
        correct: 1,
        explanation:
          "#REF! most often results directly from deleting something the formula was pointing to.",
      },
      {
        id: "eh-20",
        question:
          "What is the general principle behind good error-handling design in spreadsheets?",
        options: [
          "Catch every possible error with IFERROR everywhere",
          "Prevent errors structurally where possible, and handle expected exceptions precisely (e.g. IFNA) rather than broadly",
          "Avoid using any error-checking functions",
          "Rely solely on manual review before sharing",
        ],
        correct: 1,
        explanation:
          "The most robust approach combines structural prevention with precise, targeted error handling rather than blanket suppression.",
      },
    ],
  },
  {
    id: "collaboration-sharing",
    title: "Collaboration & Sharing",
    description:
      "Comments, protection, version history, and permission levels for shared workbooks.",
    accent: "from-[#4F46E5] to-[#818CF8]",
    accentHex: "#4F46E5",
    questions: [
      {
        id: "cs-1",
        question:
          "What is the main difference between Notes and Comments in modern Excel?",
        options: [
          "They are exactly the same feature",
          "Notes are single-cell personal annotations; Comments are threaded and designed for discussion",
          "Notes support @mentions; Comments do not",
          "Comments cannot be resolved",
        ],
        correct: 1,
        explanation:
          "Notes are simple sticky annotations, while Comments support threading, replies, and resolution for collaborative review.",
      },
      {
        id: "cs-2",
        question: "What feature lets a Comment notify a collaborator by email?",
        options: [
          "Freeze Panes",
          "@mentions, when the workbook is stored in OneDrive or SharePoint",
          "Conditional formatting",
          "Data validation",
        ],
        correct: 1,
        explanation:
          "@mentioning someone in a Comment can trigger an email notification when the file is cloud-stored.",
      },
      {
        id: "cs-3",
        question:
          "What must be true of a cell for Protect Sheet to actually restrict editing on it?",
        options: [
          "It must contain a formula",
          "It must be marked as 'Locked' in Format Cells before protection is applied",
          "It must be part of a named range",
          "It must have conditional formatting",
        ],
        correct: 1,
        explanation:
          "Only cells marked Locked are actually protected once Protect Sheet is applied; others must be explicitly unlocked first.",
      },
      {
        id: "cs-4",
        question:
          "What does Protect Workbook prevent, as opposed to Protect Sheet?",
        options: [
          "Cell edits",
          "Structural changes like adding, deleting, or renaming sheets",
          "Chart formatting",
          "Print settings",
        ],
        correct: 1,
        explanation:
          "Protect Workbook guards the structure of the workbook itself, not individual cell contents.",
      },
      {
        id: "cs-5",
        question: "Is Excel's built-in protection considered strong security?",
        options: [
          "Yes, it fully encrypts sensitive data",
          "No, it mainly deters accidental changes rather than providing strong access control",
          "It is equivalent to file-level encryption",
          "It cannot be bypassed under any circumstance",
        ],
        correct: 1,
        explanation:
          "Sheet/workbook protection is best understood as a safeguard against accidental edits, not robust security.",
      },
      {
        id: "cs-6",
        question: "What is required for real-time co-authoring in Excel?",
        options: [
          "Saving the file locally only",
          "Storing the workbook on OneDrive or SharePoint",
          "Disabling AutoSave",
          "Using an older .xls format",
        ],
        correct: 1,
        explanation:
          "Cloud storage via OneDrive or SharePoint enables multiple people to edit simultaneously with visible live cursors.",
      },
      {
        id: "cs-7",
        question: "What does Version History let you do?",
        options: [
          "Delete all prior edits permanently",
          "View or restore earlier snapshots of the file automatically saved over time",
          "Merge two separate workbooks",
          "Lock the file from further edits",
        ],
        correct: 1,
        explanation:
          "Version History provides a built-in safety net of automatic snapshots without needing manual 'Save As' backups.",
      },
      {
        id: "cs-8",
        question:
          "What permission level allows a recipient to make changes to a shared file?",
        options: ["Can view", "Can edit", "Read-only", "Comment only"],
        correct: 1,
        explanation:
          "'Can edit' grants full editing rights to whoever opens the shared link.",
      },
      {
        id: "cs-9",
        question:
          "What is the benefit of restricting a share link to specific people rather than 'anyone with the link'?",
        options: [
          "It disables comments",
          "It limits access to only the intended recipients, improving control over sensitive data",
          "It automatically encrypts the file",
          "It prevents the file from being edited at all",
        ],
        correct: 1,
        explanation:
          "Restricting to specific people (often requiring sign-in) narrows who can actually open the shared file.",
      },
      {
        id: "cs-10",
        question:
          "What does Information Rights Management (IRM) or a sensitivity label add beyond basic share permissions?",
        options: [
          "Nothing extra",
          "Restrictions on actions like copying, printing, or forwarding even after sharing",
          "Automatic version history",
          "Real-time co-authoring",
        ],
        correct: 1,
        explanation:
          "IRM and sensitivity labels can control downstream actions on a file even after it's been shared.",
      },
      {
        id: "cs-11",
        question:
          "Why were emailed file copies a problematic collaboration pattern?",
        options: [
          "Email attachments are always corrupted",
          "They easily create conflicting versions and lose a single source of truth",
          "Email cannot send Excel files",
          "They bypass all formatting",
        ],
        correct: 1,
        explanation:
          "Multiple emailed copies often diverge, creating confusion about which version is current or correct.",
      },
      {
        id: "cs-12",
        question:
          "Which annotation type is generally better suited to a private, single-user reminder?",
        options: ["A Comment", "A Note", "A Slicer", "A Custom View"],
        correct: 1,
        explanation:
          "Notes are the older, non-threaded annotation style best suited to private, non-collaborative use.",
      },
      {
        id: "cs-13",
        question: "Can a Comment thread be marked as resolved once addressed?",
        options: [
          "No, comments are permanent",
          "Yes, resolving keeps discussion organized once an issue is handled",
          "Only Notes can be resolved",
          "Only the file owner can ever see comments",
        ],
        correct: 1,
        explanation:
          "Marking a Comment resolved signals the discussion is complete, keeping the review workflow organized.",
      },
      {
        id: "cs-14",
        question:
          "What should you do before applying Protect Sheet if some cells need to remain editable?",
        options: [
          "Nothing extra is needed",
          "Unlock those specific input cells first via Format Cells",
          "Delete those cells",
          "Convert them to Comments",
        ],
        correct: 1,
        explanation:
          "Cells are locked by default, so input cells meant to stay editable must be explicitly unlocked before protecting the sheet.",
      },
      {
        id: "cs-15",
        question:
          "What advantage does cloud co-authoring have over the older emailed-copies workflow?",
        options: [
          "It requires no internet connection",
          "Edits from multiple people are visible and merged in near real-time",
          "It disables all formulas",
          "It removes the need for permissions",
        ],
        correct: 1,
        explanation:
          "Co-authoring shows live edits and cursors, avoiding the version-conflict problems of emailing separate copies.",
      },
      {
        id: "cs-16",
        question:
          "What is a typical use case for restricting a shared link to 'Can view' only?",
        options: [
          "When the recipient needs to edit formulas",
          "When stakeholders only need visibility into the data, not the ability to change it",
          "When protecting the workbook structurally",
          "When enabling co-authoring",
        ],
        correct: 1,
        explanation:
          "View-only access is appropriate for stakeholders who need information but shouldn't alter the source file.",
      },
      {
        id: "cs-17",
        question:
          "Where do you find Version History for a cloud-stored workbook?",
        options: [
          "Review tab > Comments",
          "File > Info > Version History",
          "Data tab > Get Data",
          "Page Layout tab",
        ],
        correct: 1,
        explanation:
          "Version History is accessed through File > Info in cloud-connected Excel files.",
      },
      {
        id: "cs-18",
        question:
          "Why is enterprise-level IRM or sensitivity labeling considered a layer beyond basic sharing?",
        options: [
          "It replaces the need for any password",
          "It can restrict actions like forwarding or printing even after the file leaves the original owner's control",
          "It disables Version History",
          "It only applies to charts",
        ],
        correct: 1,
        explanation:
          "IRM/sensitivity labels persist restrictions with the file itself, beyond just controlling the initial share link.",
      },
      {
        id: "cs-19",
        question: "What is one risk of granting 'Can edit' access too broadly?",
        options: [
          "The file becomes read-only automatically",
          "Unintended changes to formulas or structure by collaborators who only needed to view the data",
          "It disables co-authoring",
          "It prevents Version History from working",
        ],
        correct: 1,
        explanation:
          "Overly broad edit access increases the risk of accidental changes from people who only needed visibility.",
      },
      {
        id: "cs-20",
        question:
          "What best matches permission level to intent for a stakeholder who only needs to check numbers occasionally?",
        options: [
          "Can edit access with no restrictions",
          "Can view access, or a link restricted to specific people if the data is sensitive",
          "Protect Workbook with no sharing at all",
          "Removing the file from any shared location",
        ],
        correct: 1,
        explanation:
          "View-only (optionally restricted to named people) matches the actual need without exposing edit risk.",
      },
    ],
  },
  {
    id: "modern-excel-automation",
    title: "Modern Excel: 365, Power Platform & Office Scripts",
    description:
      "Excel for the web, mobile capture, Office Scripts, Power Automate, and add-ins.",
    accent: "from-[#0284C7] to-[#38BDF8]",
    accentHex: "#0284C7",
    questions: [
      {
        id: "ma-1",
        question:
          "What is a key trade-off of using Excel for the Web instead of desktop Excel?",
        options: [
          "It requires a paid license only",
          "Some advanced features, like certain add-ins or complex VBA macros, are unavailable or limited",
          "It cannot open .xlsx files",
          "It has no charting capability at all",
        ],
        correct: 1,
        explanation:
          "Excel for the Web supports most core features but limits or omits some advanced desktop-only capabilities.",
      },
      {
        id: "ma-2",
        question:
          "What does 'Insert Data from Picture' do in the Excel mobile app?",
        options: [
          "Inserts a random stock photo",
          "Scans a printed table with the phone camera and converts it into an editable spreadsheet",
          "Converts a chart into an image",
          "Creates a PivotTable automatically",
        ],
        correct: 1,
        explanation:
          "This mobile feature digitizes a printed table by capturing it with the camera and converting it to editable cells.",
      },
      {
        id: "ma-3",
        question:
          "What programming language do Office Scripts generate, as opposed to VBA's language?",
        options: ["Python", "TypeScript", "Java", "C#"],
        correct: 1,
        explanation:
          "Office Scripts record actions as TypeScript code rather than the Visual Basic used by traditional macros.",
      },
      {
        id: "ma-4",
        question:
          "Where do Office Scripts run, compared to traditional VBA macros?",
        options: [
          "Only on the local machine that created them",
          "In the cloud, rather than being tied to a specific local file or machine",
          "Only inside Power BI",
          "They cannot run without a macro-enabled file",
        ],
        correct: 1,
        explanation:
          "Office Scripts run in the cloud, making them accessible across desktop, web, and Mac rather than tied to one machine.",
      },
      {
        id: "ma-5",
        question: "How can Office Scripts be triggered automatically?",
        options: [
          "They can only be run manually",
          "Via Power Automate flows, such as when a new file lands in a OneDrive folder",
          "Only by restarting Excel",
          "Only through the VBA Editor",
        ],
        correct: 1,
        explanation:
          "Power Automate can call an Office Script automatically in response to a defined trigger event.",
      },
      {
        id: "ma-6",
        question: "What is Office Scripts often described as, relative to VBA?",
        options: [
          "A less capable, deprecated feature",
          "The modern, cloud-native, cross-platform successor to VBA for many automation scenarios",
          "A charting tool only",
          "A replacement for Power Query only",
        ],
        correct: 1,
        explanation:
          "Office Scripts extend macro-style automation to the cloud and cross-platform environments where VBA doesn't run.",
      },
      {
        id: "ma-7",
        question: "What does Power Automate primarily let you do with Excel?",
        options: [
          "Only format cells",
          "Connect Excel to other services and automate workflows, like sending alerts or syncing data",
          "Replace all formulas with macros",
          "Print workbooks automatically without configuration",
        ],
        correct: 1,
        explanation:
          "Power Automate links Excel events and data to hundreds of other apps and services through automated flows.",
      },
      {
        id: "ma-8",
        question:
          "In a typical Power Automate flow involving Excel, what usually comes first?",
        options: [
          "An action",
          "A trigger, such as watching a Table for new rows",
          "A chart",
          "A macro",
        ],
        correct: 1,
        explanation:
          "Flows start with a trigger condition, followed by one or more actions that respond to it.",
      },
      {
        id: "ma-9",
        question:
          "What does a flow that watches an Excel Table and sends a Teams alert on new rows illustrate?",
        options: [
          "Excel functioning purely as a static file",
          "Excel acting as a live trigger point within a broader automated business process",
          "A limitation of Power Automate",
          "A feature only available in VBA",
        ],
        correct: 1,
        explanation:
          "This kind of flow turns a spreadsheet from a passive file into an active part of a connected workflow.",
      },
      {
        id: "ma-10",
        question: "Where do you go within Excel to browse and install Add-ins?",
        options: [
          "File > Print",
          "Insert > Get Add-ins",
          "Data > Sort",
          "Review > Protect Sheet",
        ],
        correct: 1,
        explanation:
          "The Insert tab's Get Add-ins option opens the Office Store to browse available add-ins.",
      },
      {
        id: "ma-11",
        question:
          "What kind of functionality do add-ins typically extend Excel with?",
        options: [
          "Only cosmetic theme changes",
          "Data connectors, advanced charting, or domain-specific function packs",
          "Only print layout options",
          "Only keyboard shortcuts",
        ],
        correct: 1,
        explanation:
          "Add-ins commonly bring in specialized tools like external data connections or industry-specific calculations.",
      },
      {
        id: "ma-12",
        question:
          "How can organizations deploy custom, internally-built add-ins to all users?",
        options: [
          "This is not possible in Excel",
          "Centrally, via the Office Add-ins platform, without requiring each user to install manually",
          "Only through VBA macros",
          "Only via emailing the add-in file",
        ],
        correct: 1,
        explanation:
          "Organizations can centrally deploy custom add-ins built on the Office Add-ins platform to their entire user base.",
      },
      {
        id: "ma-13",
        question:
          "What web technology are custom Office Add-ins typically built with?",
        options: [
          "VBA exclusively",
          "JavaScript (and related web technologies)",
          "Assembly language",
          "SQL only",
        ],
        correct: 1,
        explanation:
          "The Office Add-ins platform is built on web technologies like JavaScript, HTML, and CSS.",
      },
      {
        id: "ma-14",
        question: "What is a benefit of custom internal add-ins for a company?",
        options: [
          "They cannot connect to proprietary systems",
          "They can connect Excel directly to internal systems or enforce company-specific calculation standards",
          "They disable all built-in Excel functions",
          "They only work in Excel for the Web",
        ],
        correct: 1,
        explanation:
          "Custom add-ins let organizations tailor Excel to their own internal tools and standards.",
      },
      {
        id: "ma-15",
        question:
          "Why might a small business favor a public Office Store add-in over a custom-built one?",
        options: [
          "Public add-ins are always more secure",
          "It avoids the cost and effort of custom development for common needs",
          "Public add-ins cannot be uninstalled",
          "Custom add-ins are free by default",
        ],
        correct: 1,
        explanation:
          "Store add-ins provide ready-made functionality without the investment required to build something custom.",
      },
      {
        id: "ma-16",
        question:
          "What is one limitation of card-based data entry on the Excel mobile app?",
        options: [
          "It disables all formulas",
          "It is a simplified entry mode, often faster than pinch-zooming a grid but less full-featured than desktop",
          "It cannot save data",
          "It only works with PivotTables",
        ],
        correct: 1,
        explanation:
          "Mobile card-based entry trades some grid-level control for touch-friendly speed on small screens.",
      },
      {
        id: "ma-17",
        question:
          "What is a key reason to prefer Office Scripts over VBA for a cross-platform automation need?",
        options: [
          "VBA runs faster on all platforms",
          "VBA macros are tied to specific files/machines, while Office Scripts run in the cloud across platforms",
          "Office Scripts cannot be triggered externally",
          "VBA is required for Excel for the Web",
        ],
        correct: 1,
        explanation:
          "Office Scripts' cloud-based execution makes them more portable across desktop, web, and Mac environments than VBA.",
      },
      {
        id: "ma-18",
        question:
          "What does the recorder in Office Scripts have in common with the VBA Macro Recorder?",
        options: [
          "Nothing, they are unrelated tools",
          "Both capture manual actions and convert them into code automatically",
          "Both only work with PivotTables",
          "Both require an internet connection to record",
        ],
        correct: 1,
        explanation:
          "Both recorders translate a sequence of manual UI actions into runnable code, just in different languages/environments.",
      },
      {
        id: "ma-19",
        question:
          "Which scenario best demonstrates a real business use of Power Automate with Excel?",
        options: [
          "Manually copying data between two closed files",
          "Automatically appending new online form responses into an Excel Table without manual entry",
          "Printing a workbook once a year",
          "Changing a chart's color scheme",
        ],
        correct: 1,
        explanation:
          "Automatically routing form responses into a Table is a classic Power Automate + Excel integration.",
      },
      {
        id: "ma-20",
        question:
          "What is the overall shift represented by Office Scripts, Power Automate, and cloud-based Excel together?",
        options: [
          "Excel becoming purely offline-only",
          "Excel moving from a standalone desktop file toward a connected, automatable, cloud-integrated tool",
          "The elimination of all formulas in favor of scripts",
          "A requirement to abandon VBA entirely in every scenario",
        ],
        correct: 1,
        explanation:
          "These tools reflect Excel's evolution into a node within larger, connected, automated business workflows.",
      },
    ],
  },
];
