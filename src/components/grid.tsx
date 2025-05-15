'use client';
import React, { useState, useEffect } from "react";
import { themeQuartz } from 'ag-grid-community';
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { dummyContacts, ICRMRow } from '../data/crmData';
// Replace react-icons with Lucide icons
import { Edit, Trash2, MoreVertical, Star, Mail, Phone, Calendar, FileEdit, BarChart3 } from 'lucide-react';
import ImportExportToolbar from "./ImportExportToolbar";
import { motion } from "framer-motion";

ModuleRegistry.registerModules([AllCommunityModule]);

// Create new GridExample component
export default function GridExample() {
  const [rowData, setRowData] = useState<ICRMRow[]>(dummyContacts);

  // Handle imported data
  const handleDataImport = (importedData: ICRMRow[]) => {
    // Merge with existing data or replace it
    setRowData(prevData => [...importedData]);
    
    // You might want to show a notification here
  };

  // Action cell renderer component with Lucide icons
  const ActionCellRenderer = (params: ICellRendererParams) => {
    const handleEdit = (e: React.MouseEvent) => {
      e.stopPropagation();
      console.log('Edit row:', params.data);
    };

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      console.log('Delete row:', params.data);
    };

    const handleMore = (e: React.MouseEvent) => {
      e.stopPropagation();
      console.log('More options for row:', params.data);
    };

    return (
      <div className="flex items-center gap-2 opacity-70 hover:opacity-100">
        <button onClick={handleEdit} className="p-1.5 rounded-full hover:bg-[rgb(39,154,170)]/20 transition-colors" title="Edit">
          <Edit size={16} className="text-[rgb(39,154,170)]" strokeWidth={1.5} />
        </button>
        <button onClick={handleDelete} className="p-1.5 rounded-full hover:bg-red-500/20 transition-colors" title="Delete">
          <Trash2 size={16} className="text-red-400" strokeWidth={1.5} />
        </button>
        <button onClick={handleMore} className="p-1.5 rounded-full hover:bg-gray-500/20 transition-colors" title="More options">
          <MoreVertical size={16} className="text-gray-400" strokeWidth={1.5} />
        </button>
      </div>
    );
  };

  // Lead score cell renderer with star icon
  const LeadScoreCellRenderer = (params: ICellRendererParams) => {
    const score = params.value || 0;
    return (
      <div className="flex items-center">
        <Star size={16} className="text-[rgb(39,154,170)] mr-1" fill="rgb(39,154,170)" strokeWidth={1.5} />
        <span>{score}</span>
      </div>
    );
  };

  // Custom status cell renderer
  const StatusCellRenderer = (params: ICellRendererParams) => {
    const status = params.value || '';
    const getStatusClass = () => {
      switch(status.toString().toLowerCase()) {
        case 'active': return 'bg-[rgb(39,154,170)]/20 text-[rgb(39,154,170)] border-[rgb(39,154,170)]/30';
        case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
        case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
        default: return 'bg-[rgb(39,154,170)]/20 text-[rgb(39,154,170)] border-[rgb(39,154,170)]/30';
      }
    };
    
    return (
      <div className={`px-2 py-1 rounded-full text-xs font-medium text-center w-24 border ${getStatusClass()}`}>
        {status.toString()}
      </div>
    );
  };

  // Date cell renderer with calendar icon
  const DateCellRenderer = (params: ICellRendererParams) => {
    if (!params.value) return null;
    
    let date;
    try {
      date = new Date(params.value).toLocaleDateString();
    } catch (e) {
      console.error('Invalid date format:', params.value);
      return null;
    }
    
    return (
      <div className="flex items-center">
        <Calendar size={15} className="text-[rgb(39,154,170)] mr-2" strokeWidth={1.5} />
        <span>{date}</span>
      </div>
    );
  };

  // Email cell renderer with mail icon
  const EmailCellRenderer = (params: ICellRendererParams) => {
    if (!params.value) return null;
    return (
      <div className="flex items-center">
        <Mail size={15} className="text-[rgb(39,154,170)] mr-2" strokeWidth={1.5} />
        <span>{params.value.toString()}</span>
      </div>
    );
  };

  // Phone cell renderer with phone icon
  const PhoneCellRenderer = (params: ICellRendererParams) => {
    if (!params.value) return null;
    return (
      <div className="flex items-center">
        <Phone size={15} className="text-[rgb(39,154,170)] mr-2" strokeWidth={1.5} />
        <span>{params.value.toString()}</span>
      </div>
    );
  };

  // Intent signals cell renderer with chart icon
  const IntentSignalsCellRenderer = (params: ICellRendererParams) => {
    if (!params.value) return null;
    return (
      <div className="flex items-center">
        <BarChart3 size={15} className="text-[rgb(39,154,170)] mr-2" strokeWidth={1.5} />
        <span>{params.value.toString()}</span>
      </div>
    );
  };

  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState<ColDef<ICRMRow>[]>([
    // Actions column (new)
    { 
      headerName: "Actions",
      width: 140,
      cellRenderer: ActionCellRenderer,
      sortable: false,
      filter: false,
      pinned: 'left',
      cellClass: 'flex items-center justify-center'
    },
    
    // Core user data with enhanced styling
    { 
      field: "fullName", 
      headerName: "Full Name", 
      sortable: true, 
      filter: true,
      pinned: 'left',
      cellClass: 'font-medium',
      headerClass: 'ag-header-cell-left-aligned'
    },
    { 
      field: "email", 
      headerName: "Email", 
      sortable: true, 
      filter: true,
      cellRenderer: EmailCellRenderer
    },
    { field: "companyName", headerName: "Company", sortable: true, filter: true },
    { field: "jobTitle", headerName: "Job Title", sortable: true, filter: true },
    
    // Status column with custom renderer
    { 
      field: "engagementStatus", 
      headerName: "Status", 
      sortable: true, 
      filter: true,
      cellRenderer: StatusCellRenderer,
      width: 150
    },

    // Dates with formatted output
    { 
      field: "lastContacted", 
      headerName: "Last Contacted", 
      sortable: true, 
      filter: true,
      cellRenderer: DateCellRenderer,
      width: 170
    },
    { 
      field: "followUpDate", 
      headerName: "Follow-up", 
      sortable: true, 
      filter: true,
      cellRenderer: DateCellRenderer,
      width: 170
    },

    // Important fields
    { 
      field: "leadScore", 
      headerName: "Lead Score", 
      sortable: true, 
      filter: true, 
      width: 140,
      cellRenderer: LeadScoreCellRenderer
    },
    { 
      field: "buyerIntentSignals", 
      headerName: "Intent Signals", 
      sortable: true, 
      filter: true,
      cellRenderer: IntentSignalsCellRenderer
    },
    { 
      field: "location", 
      headerName: "Location", 
      sortable: true, 
      filter: true
    },
    
    // Additional fields (collapsed by default)
    { field: "linkedinUrl", headerName: "LinkedIn URL", sortable: true, filter: true, hide: true },
    { field: "currentCompany", headerName: "Current Company", sortable: true, filter: true, hide: true },
    { field: "workExperience", headerName: "Work Experience", sortable: true, filter: true, hide: true },
    { field: "education", headerName: "Education", sortable: true, filter: true, hide: true },
    { field: "skills", headerName: "Skills", sortable: true, filter: true, hide: true },
    { field: "certifications", headerName: "Certifications", sortable: true, filter: true, hide: true },
    { field: "companyWebsite", headerName: "Company Website", sortable: true, filter: true, hide: true },
    { field: "companyIndustry", headerName: "Industry", sortable: true, filter: true, hide: true },
    { field: "companySize", headerName: "Company Size", sortable: true, filter: true, hide: true },
    { field: "companyHQLocation", headerName: "HQ Location", sortable: true, filter: true, hide: true },
    { field: "fundingStage", headerName: "Funding", sortable: true, filter: true, hide: true },
    { field: "recentNews", headerName: "Recent News", sortable: true, filter: true, hide: true },
    { field: "twitterHandle", headerName: "Twitter", sortable: true, filter: true, hide: true },
    { field: "githubProfile", headerName: "GitHub", sortable: true, filter: true, hide: true },
    { field: "personalWebsite", headerName: "Website", sortable: true, filter: true, hide: true },
    { field: "blogPosts", headerName: "Blog Posts", sortable: true, filter: true, hide: true },
    { field: "recentLinkedInActivity", headerName: "LinkedIn Activity", sortable: true, filter: true, hide: true },
    { field: "profilePictureUrl", headerName: "Profile Pic URL", sortable: true, filter: true, hide: true },
    { field: "contactAvailability", headerName: "Availability", sortable: true, filter: true, hide: true },
    { 
      field: "publicPhoneNumber", 
      headerName: "Phone", 
      sortable: true, 
      filter: true, 
      hide: true,
      cellRenderer: PhoneCellRenderer
    },
    { field: "timeZone", headerName: "Time Zone", sortable: true, filter: true, hide: true },
    { field: "bestTimeToContact", headerName: "Best Contact Time", sortable: true, filter: true, hide: true },
    { field: "languagesSpoken", headerName: "Languages", sortable: true, filter: true, hide: true },
    { field: "relevantProductFit", headerName: "Product Fit", sortable: true, filter: true, hide: true },
    { field: "pastEngagements", headerName: "Past Engagements", sortable: true, filter: true, hide: true },
    { field: "notes", headerName: "Notes", sortable: true, filter: true, hide: true },
    { field: "crmOwner", headerName: "Owner", sortable: true, filter: true, hide: true }
  ]);

  const defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
  };

  // Modern dark theme configuration using the new color scheme
  const modernTheme = themeQuartz.withParams({
    // Base colors - using primary color rgb(27, 29, 33)
    backgroundColor: "rgb(27, 29, 33)",
    browserColorScheme: "dark",
    foregroundColor: "#ffffff",

    // Structural elements
    borderColor: "rgba(255, 255, 255, 0.08)",
    headerBackgroundColor: "rgb(32, 34, 38)",
    subHeaderBackgroundColor: "rgb(29, 31, 35)",
    
    // Text styling
    headerFontSize: 13,
    headerFontWeight: 600,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: 13,
    
    // Row styling
    alternateRowBackgroundColor: {
      ref: "backgroundColor",
      mix: 0.06,
      onto: "foregroundColor"
    },
    rowHoverColor: {
      ref: "foregroundColor", 
      mix: 0.08,
      onto: "backgroundColor"
    },
    selectedRowBackgroundColor: {
      mix: 0.2,
      onto: "backgroundColor",
      color: "rgb(39, 154, 170)"  // Using secondary color
    },

    // Icons and indicators
    iconColor: "rgba(255, 255, 255, 0.7)",
    
    // Input fields
    inputBackgroundColor: "rgb(37, 39, 43)",
    inputBorderColor: "rgba(255, 255, 255, 0.15)",
    
    // Various UI element colors - using secondary color rgb(39, 154, 170)
    primaryColor: "rgb(39, 154, 170)",
    primaryColorInteraction: "rgb(49, 164, 180)",
    accentColor: "rgb(39, 154, 170)",
  });

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
      
      {/* Data Grid */}
      <motion.div 
        className="relative w-full h-[800px] rounded-xl overflow-hidden border border-gray-800 shadow-2xl bg-[rgb(27,29,33)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(39,154,170)]/5 via-transparent to-[rgb(39,154,170)]/5"></div>
        <div className="ag-theme-quartz-dark h-full w-full">
          <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            pagination={true}
            paginationPageSize={20}
            
            defaultColDef={{
              ...defaultColDef,
              sortable: true,
              filter: true,
              resizable: true,
              editable: false,
            }}
            
            theme={modernTheme}
            animateRows={true}
            rowHeight={54}
            headerHeight={48}
            
            suppressDragLeaveHidesColumns={true}
            suppressColumnVirtualisation={true}
            suppressRowVirtualisation={false}
            
            enableCellTextSelection={true}
            tooltipShowDelay={300}
            
            // Group panel and other toolbar features
            rowSelection="multiple"
            rowMultiSelectWithClick={true}
            
            // Style classes
            rowClass="transition-all"
          />
        </div>
      </motion.div>
    </div>
  );
};