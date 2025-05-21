'use client';
import React, { useState } from "react";
import { dummyContacts, ICRMRow } from '../data/crmData';
import { FileEdit } from 'lucide-react'; // Removed unused icons
import ImportExportToolbar from "./ImportExportToolbar";
import { motion } from "framer-motion";
import ReactPaginate from 'react-paginate';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  ActionCell,
  LeadScoreCell,
  StatusCell,
  DateCell,
  EmailCell,
  IntentSignalsCell,
} from "./CellRenderers"; // Import cell renderers
import { ColumnOptionsDialog } from "./ColumnOptionsDialog"; // Import dialog component

// Create new GridExample component
export default function GridExample() {
  const [rowData, setRowData] = useState<ICRMRow[]>(dummyContacts);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingNames, setLoadingNames] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<{ name: string; field: string } | null>(null);
  const itemsPerPage = 20;

  // Simulate web search loading for names
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingNames(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Handle imported data
  const handleDataImport = (importedData: ICRMRow[]) => {
    setRowData(importedData);
  };

  // Function to save column metadata to local storage
  const saveColumnMetadata = (columns: { name: string; field: string; systemPrompt: string; autofillType: string }[]) => {
    localStorage.setItem('columnMetadata', JSON.stringify(columns));
  };

  // Function to load column metadata from local storage
  const loadColumnMetadata = (): { name: string; field: string; systemPrompt: string; autofillType: string }[] => {
    const storedData = localStorage.getItem('columnMetadata');
    return storedData ? JSON.parse(storedData) : [];
  };

  // Initialize column metadata
  const columnMetadata: { name: string; field: string; systemPrompt: string; autofillType: string }[] = [
    { name: "Full Name", field: "fullName", systemPrompt: "", autofillType: "ai" },
    { name: "Email", field: "email", systemPrompt: "", autofillType: "ai" },
    { name: "Company", field: "companyName", systemPrompt: "", autofillType: "ai" },
    { name: "Job Title", field: "jobTitle", systemPrompt: "", autofillType: "ai" },
    { name: "Status", field: "engagementStatus", systemPrompt: "", autofillType: "ai" },
    { name: "Last Contacted", field: "lastContacted", systemPrompt: "", autofillType: "ai" },
    { name: "Follow-up", field: "followUpDate", systemPrompt: "", autofillType: "ai" },
    { name: "Lead Score", field: "leadScore", systemPrompt: "", autofillType: "ai" },
    { name: "Intent Signals", field: "buyerIntentSignals", systemPrompt: "", autofillType: "ai" },
    { name: "Location", field: "location", systemPrompt: "", autofillType: "ai" },
  ];

  // Save metadata to local storage on component mount
  React.useEffect(() => {
    saveColumnMetadata(columnMetadata);
  }, []);

  // Calculate pagination values
  const pageCount = Math.ceil(rowData.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = rowData.slice(offset, offset + itemsPerPage);

  // Handle page change
  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header with toolbar */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h2 
          className="text-2xl font-medium text-white"
          whileHover={{ scale: 1.01, x: 2 }}
        >
          Customer Contacts
        </motion.h2>
        
        <ImportExportToolbar data={rowData} onDataImport={handleDataImport} />
      </motion.div>
      
      {/* Data Table */}
      <motion.div 
        className="relative w-full overflow-hidden bg-[#0D0F12] rounded-lg border border-zinc-800/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-zinc-800/50">
                <TableHead className="w-[140px] py-3 text-xs font-medium text-zinc-400">Actions</TableHead>
                <TableHead 
                  onClick={() => {
                    setSelectedColumn({ name: "Full Name", field: "fullName" });
                    setDialogOpen(true);
                  }}
                  className="py-3 text-xs font-medium text-zinc-400 cursor-pointer hover:text-zinc-200"
                >
                  Full Name
                </TableHead>
                <TableHead 
                  onClick={() => {
                    setSelectedColumn({ name: "Email", field: "email" });
                    setDialogOpen(true);
                  }}
                  className="py-3 text-xs font-medium text-zinc-400 cursor-pointer hover:text-zinc-200"
                >
                  Email
                </TableHead>
                <TableHead 
                  onClick={() => {
                    setSelectedColumn({ name: "Company", field: "companyName" });
                    setDialogOpen(true);
                  }}
                  className="py-3 text-xs font-medium text-zinc-400 cursor-pointer hover:text-zinc-200"
                >
                  Company
                </TableHead>
                <TableHead 
                  onClick={() => {
                    setSelectedColumn({ name: "Job Title", field: "jobTitle" });
                    setDialogOpen(true);
                  }}
                  className="py-3 text-xs font-medium text-zinc-400 cursor-pointer hover:text-zinc-200"
                >
                  Job Title
                </TableHead>
                <TableHead 
                  onClick={() => {
                    setSelectedColumn({ name: "Status", field: "engagementStatus" });
                    setDialogOpen(true);
                  }}
                  className="py-3 text-xs font-medium text-zinc-400 cursor-pointer hover:text-zinc-200"
                >
                  Status
                </TableHead>
                <TableHead 
                  onClick={() => {
                    setSelectedColumn({ name: "Last Contacted", field: "lastContacted" });
                    setDialogOpen(true);
                  }}
                  className="py-3 text-xs font-medium text-zinc-400 cursor-pointer hover:text-zinc-200"
                >
                  Last Contacted
                </TableHead>
                <TableHead 
                  onClick={() => {
                    setSelectedColumn({ name: "Follow-up", field: "followUpDate" });
                    setDialogOpen(true);
                  }}
                  className="py-3 text-xs font-medium text-zinc-400 cursor-pointer hover:text-zinc-200"
                >
                  Follow-up
                </TableHead>
                <TableHead 
                  onClick={() => {
                    setSelectedColumn({ name: "Lead Score", field: "leadScore" });
                    setDialogOpen(true);
                  }}
                  className="py-3 text-xs font-medium text-zinc-400 cursor-pointer hover:text-zinc-200"
                >
                  Lead Score
                </TableHead>
                <TableHead 
                  onClick={() => {
                    setSelectedColumn({ name: "Intent Signals", field: "buyerIntentSignals" });
                    setDialogOpen(true);
                  }}
                  className="py-3 text-xs font-medium text-zinc-400 cursor-pointer hover:text-zinc-200"
                >
                  Intent Signals
                </TableHead>
                <TableHead 
                  onClick={() => {
                    setSelectedColumn({ name: "Location", field: "location" });
                    setDialogOpen(true);
                  }}
                  className="py-3 text-xs font-medium text-zinc-400 cursor-pointer hover:text-zinc-200"
                >
                  Location
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageData.map((row, index) => (
                <TableRow key={index} className="border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/20">
                  <TableCell className="py-3"><ActionCell row={row} /></TableCell>
                  <TableCell className="py-3">
                    {loadingNames ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-3 h-3 border-2 border-[#3DD2D3] border-t-transparent rounded-full" />
                        <span className="text-sm text-zinc-400">Searching the web...</span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-zinc-100">{row.fullName}</span>
                    )}
                  </TableCell>
                  {/* <TableCell className="py-3"><EmailCell value={row.email} /></TableCell> */}
                  <TableCell className="py-3 text-sm text-zinc-300">{row.companyName}</TableCell>
                  <TableCell className="py-3 text-sm text-zinc-300">{row.jobTitle}</TableCell>
                  <TableCell className="py-3"><StatusCell value={row.engagementStatus} /></TableCell>
                  <TableCell className="py-3"><DateCell value={row.lastContacted} /></TableCell>
                  <TableCell className="py-3"><DateCell value={row.followUpDate} /></TableCell>
                  <TableCell className="py-3"><LeadScoreCell value={row.leadScore} /></TableCell>
                  <TableCell className="py-3"><IntentSignalsCell value={row.buyerIntentSignals} /></TableCell>
                  <TableCell className="py-3 text-sm text-zinc-300">{row.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center py-4">
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next →"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="← Previous"
            renderOnZeroPageCount={null}
            className="flex items-center gap-2"
            pageClassName="px-3 py-1 rounded text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors cursor-pointer"
            activeClassName="!bg-[#1A4D4F] !text-[#3DD2D3]"
            previousClassName="px-3 py-1 rounded text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors cursor-pointer"
            nextClassName="px-3 py-1 rounded text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors cursor-pointer"
            disabledClassName="opacity-50 cursor-not-allowed hover:bg-transparent hover:!text-zinc-400"
          />
        </div>
      </motion.div>

      {/* Column Options Dialog */}
      <ColumnOptionsDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        selectedColumn={selectedColumn}
        availableColumns={columnMetadata}
      />
    </div>
  );
};