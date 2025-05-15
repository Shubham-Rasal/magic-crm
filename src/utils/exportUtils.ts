import { ICRMRow } from "../data/crmData";
import * as XLSX from "xlsx";

// Helper to convert data to CSV format
export const convertToCSV = (data: ICRMRow[]): string => {
  if (data.length === 0) return "";
  
  // Get all keys from the data
  const headers = Object.keys(data[0]);
  
  // Create CSV header row
  const headerRow = headers.join(",");
  
  // Create rows for each data item
  const rows = data.map(row => {
    return headers.map(header => {
      const value = row[header as keyof ICRMRow];
      
      // Handle different data types
      if (value === null || value === undefined) return "";
      if (Array.isArray(value)) return `"${value.join(", ")}"`;
      if (value instanceof Date) return value.toISOString();
      
      // Escape strings with quotes if they contain commas
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      
      return String(value);
    }).join(',');
  }).join('\n');
  
  return `${headerRow}\n${rows}`;
};

// Export data to CSV and download
export const exportToCSV = (data: ICRMRow[], filename: string = 'crm-data.csv'): void => {
  const csvData = convertToCSV(data);
  
  // Create a blob and download link
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Set up download
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (data: ICRMRow[], filename: string = 'crm-data.xlsx'): void => {
  // Format data for Excel
  const formattedData = data.map((row) => {
    const formattedRow: { [key: string]: any } = { ...row };

    // Format date fields
    ['lastContacted', 'followUpDate'].forEach((dateField) => {
      const value = formattedRow[dateField];
      if (value) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          formattedRow[dateField] = date.toLocaleDateString();
        }
      }
    });

    // Format array fields
    Object.keys(formattedRow).forEach((key) => {
      const value = formattedRow[key];
      if (Array.isArray(value)) {
        formattedRow[key] = value.join(', ');
      }
    });

    return formattedRow;
  });

  // Create worksheet
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);

  // Create workbook and append worksheet
  const workbook: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'CRM Data');

  // Write workbook to file
  XLSX.writeFile(workbook, filename);
};

// Export data to Google Sheets
export const exportToGoogleSheets = async (data: ICRMRow[]): Promise<{success: boolean, message?: string}> => {
  try {
    if (!data || data.length === 0) {
      throw new Error("No data to export");
    }

    // Convert the data to CSV format
    const csvData = convertToCSV(data);
    
    // Copy CSV data to clipboard
    await copyToClipboard(csvData);
    
    return {
      success: true,
      message: "Data copied to clipboard successfully. You can now paste it in Google Sheets."
    };
  } catch (error) {
    console.error("Error exporting to Google Sheets:", error);
    return {
      success: false,
      message: `Failed to export data: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

const copyToClipboard = async (text: string): Promise<void> => {
  try {
    // Modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    
    // Fallback method for browsers that don't support the Clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (!successful) {
      throw new Error("Failed to copy using execCommand");
    }
  } catch (error) {
    console.error("Copy to clipboard failed:", error);
    throw new Error("Failed to copy data to clipboard");
  }
};

/**
 * Returns instructions to show to the user for completing the export
 */
export const getExportInstructions = (): {title: string; steps: string[]} => {
  return {
    title: "Complete Your Google Sheets Export",
    steps: [
      "Click 'Open Google Sheets' below to open a new sheet",
      "Click on cell A1 in the new Google Sheet",
      "Press Ctrl+V (or Cmd+V on Mac) to paste your data",
      "Then click on Data → Split Text to Column",
      "Your CRM data will now be properly formatted in Google Sheets!"
    ]
  };
};