const WORKBOOK_DOWNLOAD_URL = "/Excel_task_beginner.xlsx";
const WORKBOOK_FILENAME = "Excel_task_beginner.xlsx";

interface excel_type {
  title: string;
  description: string;
  link: string;
  status: string;
  bg: string;
  basic_concept: string[];
  download: string;
}
const excel_data: excel_type[] = [
  {
    title: "Task 1",
    description: "Getting Started with the Workbooks and Excels",
    link: WORKBOOK_DOWNLOAD_URL,
    download: WORKBOOK_FILENAME,
    status: "open",
    bg: "#f2f4f3",
    basic_concept: [
      "Basic addition and subtractions",
      "Basic multiplication and division",
      "Using Sum Formula",
    ],
  },
  {
    title: "Task 2",
    description: "Working with Data in Excel",
    link: WORKBOOK_DOWNLOAD_URL,
    bg: "#f2f4f3",
    status: "locked",
    download: WORKBOOK_FILENAME,
    basic_concept: [
      "Sorting data",
      "Table formatting",
      "Conditional formatting",
    ],
  },
  {
    title: "Task 3",
    description: "Charts and Graphs in Excel",
    link: WORKBOOK_DOWNLOAD_URL,
    bg: "#f2f4f3",
    status: "locked",
    download: WORKBOOK_FILENAME,
    basic_concept: [
      "Creating charts",
      "Formatting charts",
      "Adding data labels",
    ],
  },
];

export { excel_data, WORKBOOK_DOWNLOAD_URL, WORKBOOK_FILENAME };
