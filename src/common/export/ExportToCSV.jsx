import * as XLSX from "xlsx";

export const ExportToCSV = (jsonData, fileName = "data.csv") => {
  const worksheet = XLSX.utils.json_to_sheet(jsonData);

  // Convert sheet to CSV
  const csvData = XLSX.utils.sheet_to_csv(worksheet);

  // Create Blob and download
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
