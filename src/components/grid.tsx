'use client';
import React, { useState, useEffect } from "react";
import { themeQuartz } from 'ag-grid-community';
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { dummyContacts, ICRMRow } from '../data/crmData';

ModuleRegistry.registerModules([AllCommunityModule]);

// Create new GridExample component
export default function GridExample() {
  const [rowData, setRowData] = useState<ICRMRow[]>(dummyContacts);

  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState<ColDef<ICRMRow>[]>([
    // User Input / Minimal Manual Data
    { field: "fullName", headerName: "Full Name", sortable: true, filter: true },
    { field: "email", headerName: "Email", sortable: true, filter: true },
    { field: "linkedinUrl", headerName: "LinkedIn URL", sortable: true, filter: true },
    { field: "companyName", headerName: "Company Name", sortable: true, filter: true },

    // Personal & Professional Identity
    { field: "jobTitle", headerName: "Job Title", sortable: true, filter: true },
    { field: "currentCompany", headerName: "Current Company", sortable: true, filter: true },
    { field: "workExperience", headerName: "Work Experience (Years)", sortable: true, filter: true },
    { field: "location", headerName: "Location", sortable: true, filter: true },
    { field: "education", headerName: "Education", sortable: true, filter: true },
    { field: "skills", headerName: "Skills", sortable: true, filter: true },
    { field: "certifications", headerName: "Certifications", sortable: true, filter: true },

    // Company Details
    { field: "companyWebsite", headerName: "Company Website", sortable: true, filter: true },
    { field: "companyIndustry", headerName: "Company Industry", sortable: true, filter: true },
    { field: "companySize", headerName: "Company Size", sortable: true, filter: true },
    { field: "companyHQLocation", headerName: "Company HQ Location", sortable: true, filter: true },
    { field: "fundingStage", headerName: "Funding Stage", sortable: true, filter: true },
    { field: "recentNews", headerName: "Recent News", sortable: true, filter: true },

    // Social & Web Presence
    { field: "twitterHandle", headerName: "Twitter Handle", sortable: true, filter: true },
    { field: "githubProfile", headerName: "GitHub Profile", sortable: true, filter: true },
    { field: "personalWebsite", headerName: "Personal Website", sortable: true, filter: true },
    { field: "blogPosts", headerName: "Blog Posts", sortable: true, filter: true },
    { field: "recentLinkedInActivity", headerName: "Recent LinkedIn Activity", sortable: true, filter: true },
    { field: "profilePictureUrl", headerName: "Profile Picture URL", sortable: true, filter: true },

    // Communication Signals
    { field: "contactAvailability", headerName: "Contact Availability", sortable: true, filter: true },
    { field: "publicPhoneNumber", headerName: "Public Phone Number", sortable: true, filter: true },
    { field: "timeZone", headerName: "Time Zone", sortable: true, filter: true },
    { field: "bestTimeToContact", headerName: "Best Time to Contact", sortable: true, filter: true },
    { field: "languagesSpoken", headerName: "Language(s) Spoken", sortable: true, filter: true },

    // Strategic CRM Fields
    { field: "leadScore", headerName: "Lead Score", sortable: true, filter: true },
    { field: "buyerIntentSignals", headerName: "Buyer Intent Signals", sortable: true, filter: true },
    { field: "relevantProductFit", headerName: "Relevant Product Fit", sortable: true, filter: true },
    { field: "pastEngagements", headerName: "Past Engagements", sortable: true, filter: true },
    { field: "notes", headerName: "Notes / Observations", sortable: true, filter: true },

    // Actions & Tracking
    { 
      field: "lastContacted", 
      headerName: "Last Contacted", 
      sortable: true, 
      filter: true,
      cellRenderer: (params: any) => params.value ? new Date(params.value).toLocaleDateString() : ''
    },
    { 
      field: "followUpDate", 
      headerName: "Follow-up Date", 
      sortable: true, 
      filter: true,
      cellRenderer: (params: any) => params.value ? new Date(params.value).toLocaleDateString() : ''
    },
    { field: "engagementStatus", headerName: "Engagement Status", sortable: true, filter: true },
    { field: "crmOwner", headerName: "CRM Owner", sortable: true, filter: true }
  ]);

  const defaultColDef: ColDef = {
    flex: 1,
  };



// to use myTheme in an application, pass it to the theme grid option
const myTheme = themeQuartz
	.withParams({
        backgroundColor: "#1f2836",
        browserColorScheme: "dark",
        chromeBackgroundColor: {
            ref: "foregroundColor",
            mix: 0.07,
            onto: "backgroundColor"
        },
        foregroundColor: "#FFF",
        headerFontSize: 14

    });


  // Container: Defines the grid's theme & dimensions.
  return (
    <div className="w-full h-[800px]">
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        pagination={true}
      
        defaultColDef={{
          ...defaultColDef,
          sortable: true,
          filter: true,
          resizable: true,
          editable: true,
          minWidth: 150
        }}
        theme={myTheme}
        suppressDragLeaveHidesColumns={true}
        suppressColumnVirtualisation={true}
        suppressRowVirtualisation={false}
      />
    </div>
  );
};

