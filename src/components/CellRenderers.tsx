
'use client';
import React from 'react';
import { ICRMRow } from '../data/crmData';
import { Edit, Trash2, MoreVertical, Star, Mail, Phone, Calendar, BarChart3 } from 'lucide-react';

// Action cell renderer component with Lucide icons
export const ActionCell = ({ row }: { row: ICRMRow }) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Edit row:', row);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Delete row:', row);
  };

  const handleMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('More options for row:', row);
  };

  return (
    <div className="flex items-center gap-1">
      <button onClick={handleEdit} className="p-1.5 rounded-full hover:bg-[#1A4D4F] transition-colors group" title="Edit">
        <Edit size={16} className="text-[#3DD2D3] opacity-70 group-hover:opacity-100" strokeWidth={1.5} />
      </button>
      <button onClick={handleDelete} className="p-1.5 rounded-full hover:bg-red-500/10 transition-colors group" title="Delete">
        <Trash2 size={16} className="text-red-400 opacity-70 group-hover:opacity-100" strokeWidth={1.5} />
      </button>
      <button onClick={handleMore} className="p-1.5 rounded-full hover:bg-zinc-500/10 transition-colors group" title="More options">
        <MoreVertical size={16} className="text-zinc-400 opacity-70 group-hover:opacity-100" strokeWidth={1.5} />
      </button>
    </div>
  );
};

// Lead score cell renderer with star icon
export const LeadScoreCell = ({ value }: { value: number }) => {
  const score = value || 0;
  return (
    <div className="flex items-center">
      <Star size={16} className="text-[#3DD2D3] mr-1" fill="#3DD2D3" strokeWidth={1.5} />
      <span className="text-sm text-zinc-300">{score}</span>
    </div>
  );
};

// Custom status cell renderer
export const StatusCell = ({ value }: { value: string }) => {
  const status = value || '';
  const getStatusClass = () => {
    switch(status.toString().toLowerCase()) {
      case 'nurturing': return 'bg-[#1A4D4F] text-[#3DD2D3]';
      case 'new lead': return 'bg-[#1A4D4F] text-[#3DD2D3]';
      case 'qualified': return 'bg-[#1A4D4F] text-[#3DD2D3]';
      case 'closed won': return 'bg-[#1A4D4F] text-[#3DD2D3]';
      case 'closed lost': return 'bg-red-950 text-red-400';
      case 'in progress': return 'bg-blue-950 text-blue-400';
      default: return 'bg-[#1A4D4F] text-[#3DD2D3]';
    }
  };
  
  return (
    <div className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${getStatusClass()}`}>
      {status.toString()}
    </div>
  );
};

// Date cell renderer with calendar icon
export const DateCell = ({ value }: { value: Date | string | null }) => {
  if (!value) return null;
  
  try {
    // Format the date based on type
    let formattedDate: string;
    if (value instanceof Date) {
      formattedDate = value.toLocaleDateString();
    } else if (typeof value === 'string' && value.trim() !== '') {
      // Attempt to convert string to date
      formattedDate = new Date(value).toLocaleDateString();
    } else {
      return null;
    }
    
    return (
      <div className="flex items-center">
        <Calendar size={15} className="text-[#3DD2D3] mr-2" strokeWidth={1.5} />
        <span className="text-sm text-zinc-300">{formattedDate}</span>
      </div>
    );
  } catch (e) {
    console.error('Invalid date format:', value);
    return null;
  }
};

// Email cell renderer with mail icon
export const EmailCell = ({ value }: { value: string }) => {
  if (!value) return null;
  return (
    <div className="flex items-center">
      <Mail size={15} className="text-[#3DD2D3] mr-2" strokeWidth={1.5} />
      <span className="text-sm text-zinc-300">{value}</span>
    </div>
  );
};

// Phone cell renderer with phone icon
export const PhoneCell = ({ value }: { value: string }) => {
  if (!value) return null;
  return (
    <div className="flex items-center">
      <Phone size={15} className="text-[rgb(39,154,170)] mr-2" strokeWidth={1.5} />
      <span>{value}</span>
    </div>
  );
};

// Intent signals cell renderer with chart icon
export const IntentSignalsCell = ({ value }: { value: string }) => {
  if (!value) return null;
  return (
    <div className="flex items-center">
      <BarChart3 size={15} className="text-[#3DD2D3] mr-2" strokeWidth={1.5} />
      <span className="text-sm text-zinc-300">{value}</span>
    </div>
  );
};
