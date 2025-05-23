'use client';
import React, { useState, useEffect } from "react";
import { dummyContacts, ICRMRow } from '../data/crmData';
import { IProductLead, engagementStatuses } from '@/data/productData';
import { FileEdit, RefreshCw, Loader2 } from 'lucide-react';
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
} from "./CellRenderers";
import { ColumnOptionsDialog } from "./ColumnOptionsDialog";

// Sample dummy leads data for preview
const dummyLeads: IProductLead[] = [
  {
    id: "1",
    fullName: "Sarah Johnson",
    email: "sarah.johnson@techsoft.com",
    companyName: "TechSoft Solutions",
    jobTitle: "CTO",
    phoneNumber: "555-123-4567",
    leadScore: 85,
    engagementStatus: "Qualified",
    lastContacted: "2023-09-15",
    followUpDate: "2023-09-22",
    notes: "Interested in enterprise plan",
    location: "San Francisco, CA",
    buyerIntentSignals: "Viewed pricing page",
    customerFit: "High",
  },
  {
    id: "2",
    fullName: "Michael Chen",
    email: "michael.chen@innovatech.co",
    companyName: "InnovaTech",
    jobTitle: "VP of Operations",
    phoneNumber: "555-987-6543",
    leadScore: 72,
    engagementStatus: "New",
    lastContacted: "",
    followUpDate: "2023-09-20",
    notes: "",
    location: "Boston, MA",
    buyerIntentSignals: "Attended webinar",
    customerFit: "Medium",
  },
  {
    id: "3",
    fullName: "Jennifer Smith",
    email: "j.smith@globalcorp.net",
    companyName: "Global Corp",
    jobTitle: "Procurement Manager",
    phoneNumber: "555-456-7890",
    leadScore: 63,
    engagementStatus: "In Progress",
    lastContacted: "2023-09-10",
    followUpDate: "2023-09-18",
    notes: "Requested product demo",
    location: "Chicago, IL",
    buyerIntentSignals: ["Requested demo", "Viewed case studies"],
    customerFit: "Medium",
  },
  {
    id: "4",
    fullName: "David Williams",
    email: "david.w@nextstep.org",
    companyName: "NextStep Foundation",
    jobTitle: "Executive Director",
    phoneNumber: "555-789-0123",
    leadScore: 91,
    engagementStatus: "Qualified",
    lastContacted: "2023-09-16",
    followUpDate: "2023-09-23",
    notes: "Very interested in our nonprofit pricing",
    location: "Austin, TX",
    buyerIntentSignals: ["Downloaded pricing sheet", "Scheduled demo", "Multiple page visits"],
    customerFit: "High",
  },
  {
    id: "5",
    fullName: "Emily Rodriguez",
    email: "e.rodriguez@marketboost.com",
    companyName: "MarketBoost",
    jobTitle: "Marketing Director",
    phoneNumber: "555-234-5678",
    leadScore: 78,
    engagementStatus: "New",
    lastContacted: "",
    followUpDate: "2023-09-21",
    notes: "",
    location: "Miami, FL",
    buyerIntentSignals: ["Visited blog", "Subscribed to newsletter"],
    customerFit: "Medium",
  }
];

interface GridProps {
  productId: string;
  onGenerateLeads: () => void;
  loading: boolean;
  leads?: IProductLead[];
}

export default function Grid({ productId, onGenerateLeads, loading, leads = [] }: GridProps) {
  // Use provided leads or fallback to dummy leads if none provided
  const [rowData, setRowData] = useState<IProductLead[]>(leads.length > 0 ? leads : dummyLeads);
  const [currentPage, setCurrentPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<{ name: string; field: string } | null>(null);
  const itemsPerPage = 10;

  // Update rowData when leads prop changes
  useEffect(() => {
    if (leads && leads.length > 0) {
      setRowData(leads);
    }
  }, [leads]);

  // Column definitions for leads grid
  const columnMetadata: { name: string; field: string; systemPrompt: string; autofillType: string }[] = [
    { name: "Full Name", field: "fullName", systemPrompt: "", autofillType: "ai" },
    { name: "Email", field: "email", systemPrompt: "", autofillType: "ai" },
    { name: "Company", field: "companyName", systemPrompt: "", autofillType: "ai" },
    { name: "Job Title", field: "jobTitle", systemPrompt: "", autofillType: "ai" },
    { name: "Phone", field: "phoneNumber", systemPrompt: "", autofillType: "ai" },
    { name: "Status", field: "engagementStatus", systemPrompt: "", autofillType: "ai" },
    { name: "Last Contacted", field: "lastContacted", systemPrompt: "", autofillType: "ai" },
    { name: "Follow-up", field: "followUpDate", systemPrompt: "", autofillType: "ai" },
    { name: "Lead Score", field: "leadScore", systemPrompt: "", autofillType: "ai" },
    { name: "Intent Signals", field: "buyerIntentSignals", systemPrompt: "", autofillType: "ai" },
    { name: "Customer Fit", field: "customerFit", systemPrompt: "", autofillType: "ai" },
    { name: "Location", field: "location", systemPrompt: "", autofillType: "ai" },
  ];

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
          Product Leads
        </motion.h2>
        
        <div className="flex items-center gap-3">
          <ImportExportToolbar data={rowData} onDataImport={setRowData} />
          
          <button 
            onClick={onGenerateLeads}
            disabled={loading}
            className={`flex items-center gap-2 px-3 py-2 bg-[#1A4D4F] text-white rounded-md hover:bg-[#235D5F] transition-colors ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                <span>Generate Leads</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
      
      {/* Data Table */}
      <motion.div 
        className="relative w-full overflow-hidden bg-[#0D0F12] rounded-lg border border-zinc-800/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {rowData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <p className="text-zinc-400 mb-4">No leads found for this product yet.</p>
            <button 
              onClick={onGenerateLeads}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 bg-[#1A4D4F] text-white rounded-md hover:bg-[#235D5F] transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Generating Leads...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  <span>Generate Leads</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-zinc-800/50">
                  <TableHead className="w-[80px] py-3 text-xs font-medium text-zinc-400">Actions</TableHead>
                  <TableHead className="py-3 text-xs font-medium text-zinc-400">Full Name</TableHead>
                  <TableHead className="py-3 text-xs font-medium text-zinc-400">Email</TableHead>
                  <TableHead className="py-3 text-xs font-medium text-zinc-400">Company</TableHead>
                  <TableHead className="py-3 text-xs font-medium text-zinc-400">Job Title</TableHead>
                  <TableHead className="py-3 text-xs font-medium text-zinc-400">Status</TableHead>
                  <TableHead className="py-3 text-xs font-medium text-zinc-400">Last Contacted</TableHead>
                  <TableHead className="py-3 text-xs font-medium text-zinc-400">Follow-up</TableHead>
                  <TableHead className="py-3 text-xs font-medium text-zinc-400">Lead Score</TableHead>
                  <TableHead className="py-3 text-xs font-medium text-zinc-400">Customer Fit</TableHead>
                  <TableHead className="py-3 text-xs font-medium text-zinc-400">Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPageData.map((lead, index) => (
                  <TableRow key={lead.id || index} className="border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/20">
                    <TableCell className="py-3">
                      <button className="p-1 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-700/40">
                        <FileEdit size={16} />
                      </button>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="text-sm font-medium text-zinc-100">{lead.fullName}</span>
                    </TableCell>
                    <TableCell className="py-3">
                      <EmailCell value={lead.email} />
                    </TableCell>
                    <TableCell className="py-3 text-sm text-zinc-300">{lead.companyName}</TableCell>
                    <TableCell className="py-3 text-sm text-zinc-300">{lead.jobTitle}</TableCell>
                    <TableCell className="py-3"><StatusCell value={lead.engagementStatus} /></TableCell>
                    <TableCell className="py-3"><DateCell value={lead.lastContacted} /></TableCell>
                    <TableCell className="py-3"><DateCell value={lead.followUpDate} /></TableCell>
                    <TableCell className="py-3"><LeadScoreCell value={lead.leadScore} /></TableCell>
                    <TableCell className="py-3">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        lead.customerFit === "High" ? "bg-emerald-500/20 text-emerald-400" :
                        lead.customerFit === "Medium" ? "bg-amber-500/20 text-amber-400" :
                        "bg-zinc-500/20 text-zinc-400"
                      }`}>
                        {lead.customerFit}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 text-sm text-zinc-300">{lead.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {rowData.length > 0 && (
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
        )}
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