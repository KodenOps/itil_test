const WORKBOOK_DOWNLOAD_URL = "/Excel_task_beginner.xlsx";
const WORKBOOK_DOWNLOAD_URL_2 = "/Task2_Excel_task_intermediate.xlsx";
const WORKBOOK_FILENAME = "Excel_task_beginner.xlsx";
const WORKBOOK_FILENAME_2 = "Task2_Excel_task_intermediate.xlsx";
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
    link: WORKBOOK_DOWNLOAD_URL_2,
    bg: "#f2f4f3",
    status: "open",
    download: WORKBOOK_FILENAME_2,
    basic_concept: [
      "Sorting data",
      "Table formatting",
      "Conditional formatting",
      "Pivot tables and charts",
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
      "Advance Data Analysis",
      "Reporting and Dashboards",
      "Data Visualization",
    ],
  },
];

export { excel_data, WORKBOOK_DOWNLOAD_URL, WORKBOOK_FILENAME };
