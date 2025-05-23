'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileDown, FileUp, FileSpreadsheet, Table, Upload, 
  File, CheckCircle2, AlertCircle, UploadCloud
} from 'lucide-react';
import { exportToCSV, exportToExcel, exportToGoogleSheets, getExportInstructions } from '@/utils/exportUtils';
import { ICRMRow } from '@/data/crmData';
import { IProductLead } from '@/data/productData';
import * as XLSX from "xlsx";
import Papa from 'papaparse';
import ExportToGoogleSheetsInstructionsModal from './ExportToGoogleSheetsInstructionsModal';

interface ImportExportToolbarProps {
  data: ICRMRow[] | IProductLead[];
  onDataImport: (data: ICRMRow[] | IProductLead[]) => void;
}

export default function ImportExportToolbar({ data, onDataImport }: ImportExportToolbarProps) {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isImportMenuOpen, setIsImportMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');
  const [showGoogleSheetsInstructions, setShowGoogleSheetsInstructions] = useState(false);
  const [exportInstructions, setExportInstructions] = useState<{title: string; steps: string[]}>({
    title: '',
    steps: []
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const importMenuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isExportMenuOpen && 
          exportMenuRef.current && 
          !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
      
      if (isImportMenuOpen && 
          importMenuRef.current && 
          !importMenuRef.current.contains(event.target as Node)) {
        setIsImportMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExportMenuOpen, isImportMenuOpen]);
  
  const menuVariants = {
    hidden: { opacity: 0, y: -20, height: 0 },
    visible: { opacity: 1, y: 0, height: 'auto' }
  };
  
  const buttonVariants = {
    hover: { scale: 1.05, transition: { type: 'spring', stiffness: 400 } },
    tap: { scale: 0.97 }
  };
  
  const iconVariants = {
    hover: { rotate: 15, transition: { duration: 0.2 } }
  };
  
  const handleExport = (type: 'csv' | 'excel' | 'google') => {
    setIsExportMenuOpen(false);
    
    try {
      switch (type) {
        case 'csv':
          exportToCSV(data);
          break;
        case 'excel':
          exportToExcel(data);
          break;
        case 'google':
          handleGoogleSheetsExport();
          break;
      }
    } catch (error) {
      console.error(`Error exporting as ${type}:`, error);
    }
  };
  
  const handleGoogleSheetsExport = async () => {
    const result = await exportToGoogleSheets(data);
    
    if (result.success) {
      setExportInstructions(getExportInstructions());
      setShowGoogleSheetsInstructions(true);
    } else {
      alert(result.message);
    }
  };
  
  const openGoogleSheets = () => {
    const googleSheetsUrl = 'https://docs.google.com/spreadsheets/create';
    window.open(googleSheetsUrl, '_blank');
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    handleFileImport(files[0]);
    
    if (event.target) {
      event.target.value = '';
    }
  };
  
  const handleFileImport = async (file: File) => {
    setImportStatus('processing');
    setImportMessage('Processing your file...');
    
    try {
      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              const importedData = processImportedData(results.data as any);
              finishImport(importedData);
            } else {
              throw new Error('No valid data found in the CSV file');
            }
          },
          error: (error: any) => {
            throw new Error(error.message || 'Failed to parse CSV file');
          }
        });
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);
        
        if (workbook.SheetNames.length === 0) {
          throw new Error('No sheets found in the Excel file');
        }
        
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData && jsonData.length > 0) {
          const importedData = processImportedData(jsonData as any);
          finishImport(importedData);
        } else {
          throw new Error('No valid data found in the Excel file');
        }
      } else {
        throw new Error('Unsupported file format. Please upload a CSV or Excel file.');
      }
    } catch (error) {
      console.error('Error importing file:', error);
      setImportStatus('error');
      setImportMessage(error instanceof Error ? error.message : 'Failed to import file');
      
      setTimeout(() => {
        setImportStatus('idle');
        setImportMessage('');
      }, 3000);
    }
  };
  
  const processImportedData = (rawData: any[]): ICRMRow[] => {
    if (!Array.isArray(rawData) || rawData.length === 0) {
      throw new Error('Invalid data format in the imported file');
    }

    return rawData
      .filter(row => row && typeof row === 'object' && Object.keys(row).length > 0)
      .map(row => {
        const processedRow: Partial<ICRMRow> = {};
        
        if (!row.id) {
          processedRow.id = `imported-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        }
        
        Object.entries(row).forEach(([key, value]) => {
          if (value === null || value === undefined) return;
          
          const normalizedKey = key.trim().replace(/\s+/g, '');
          const camelCaseKey = normalizedKey.charAt(0).toLowerCase() + normalizedKey.slice(1);
          
          if (typeof value === 'string' && (camelCaseKey === 'lastContacted' || camelCaseKey === 'followUpDate')) {
            try {
              processedRow[camelCaseKey as keyof ICRMRow] = new Date(value) as any;
            } catch (e) {
              // If date parsing fails, set to null instead of keeping the string
              processedRow[camelCaseKey as keyof ICRMRow] = null as any;
            }
          } 
          else if (typeof value === 'string' && 
                 (camelCaseKey === 'skills' || 
                  camelCaseKey === 'certifications' || 
                  camelCaseKey === 'blogPosts' ||
                  camelCaseKey === 'languagesSpoken')) {
            processedRow[camelCaseKey as keyof ICRMRow] = value.split(',').map(item => item.trim()) as any;
          }
          else {
            processedRow[camelCaseKey as keyof ICRMRow] = value as any;
          }
        });
        
        if (!processedRow.fullName) processedRow.fullName = 'Unknown Contact';
        if (!processedRow.engagementStatus) processedRow.engagementStatus = 'Pending';
        if (!processedRow.leadScore) processedRow.leadScore = 0;
        
        return processedRow as ICRMRow;
      });
  };
  
  const finishImport = (importedData: ICRMRow[]) => {
    if (importedData.length > 0) {
      onDataImport(importedData);
      setImportStatus('success');
      setImportMessage(`Successfully imported ${importedData.length} records`);
      
      setTimeout(() => {
        setImportStatus('idle');
        setImportMessage('');
        setIsImportMenuOpen(false);
      }, 2000);
    } else {
      throw new Error('No valid data found in the imported file');
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileImport(e.dataTransfer.files[0]);
    }
  };
  
  return (
    <div className="flex items-center gap-3 relative z-10">
      <div className="relative" ref={exportMenuRef}>
        <motion.button
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-[rgb(39,154,170)]/20 text-[rgb(39,154,170)] hover:bg-[rgb(39,154,170)]/30 transition-colors"
          onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <motion.span variants={iconVariants} whileHover="hover">
            <FileDown size={18} />
          </motion.span>
          <span>Export</span>
        </motion.button>
        
        <AnimatePresence>
          {isExportMenuOpen && (
            <motion.div 
              className="absolute mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-xl overflow-hidden"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={menuVariants}
            >
              <motion.button
                className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-700 text-left text-gray-200"
                onClick={() => handleExport('csv')}
                whileHover={{ backgroundColor: 'rgba(39,154,170,0.2)', color: 'rgb(39,154,170)' }}
              >
                <Table size={16} />
                <span>CSV File</span>
              </motion.button>
              
              <motion.button
                className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-700 text-left text-gray-200"
                onClick={() => handleExport('excel')}
                whileHover={{ backgroundColor: 'rgba(39,154,170,0.2)', color: 'rgb(39,154,170)' }}
              >
                <File size={16} />
                <span>Excel File</span>
              </motion.button>
              
              <motion.button
                className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-700 text-left text-gray-200"
                onClick={() => handleExport('google')}
                whileHover={{ backgroundColor: 'rgba(39,154,170,0.2)', color: 'rgb(39,154,170)' }}
              >
                <FileSpreadsheet size={16} />
                <span>Google Sheets</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="relative" ref={importMenuRef}>
        <motion.button
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors"
          onClick={() => setIsImportMenuOpen(!isImportMenuOpen)}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <motion.span variants={iconVariants} whileHover="hover">
            <FileUp size={18} />
          </motion.span>
          <span>Import</span>     
        </motion.button>
        
        <AnimatePresence>
          {isImportMenuOpen && (
            <motion.div 
              className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-md shadow-xl overflow-hidden"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={menuVariants}
            >
              <div className="p-4">
                <h3 className="text-gray-200 font-medium mb-2">Import Data</h3>
                
                {importStatus !== 'idle' && (
                  <motion.div 
                    className={`mb-3 p-2 rounded-md text-sm flex items-center gap-2
                      ${importStatus === 'processing' ? 'bg-gray-700 text-gray-300' : 
                        importStatus === 'success' ? 'bg-green-900/30 text-green-400' :
                        'bg-red-900/30 text-red-400'}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {importStatus === 'processing' ? (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <Upload size={16} />
                      </motion.div>
                    ) : importStatus === 'success' ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <AlertCircle size={16} />
                    )}
                    <span>{importMessage}</span>
                  </motion.div>
                )}
                
                <motion.div
                  className={`border-2 border-dashed rounded-lg p-6 text-center
                    ${isDragging ? 'border-[rgb(39,154,170)] bg-[rgb(39,154,170)]/10' : 'border-gray-600'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  whileHover={{ borderColor: 'rgb(39,154,170)', backgroundColor: 'rgba(39,154,170,0.05)' }}
                  animate={isDragging ? 
                    { borderColor: 'rgb(39,154,170)', backgroundColor: 'rgba(39,154,170,0.1)' } : 
                    { borderColor: 'rgb(75,85,99)' }
                  }
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    disabled={importStatus === 'processing'}
                  />
                  
                  <motion.div 
                    className="mb-2 flex justify-center"
                    whileHover={importStatus !== 'processing' ? { scale: 1.1, y: -3 } : {}}
                    animate={isDragging ? { scale: 1.1, y: -3 } : { scale: 1 }}
                  >
                    <UploadCloud 
                      size={40} 
                      className={isDragging ? 'text-[rgb(39,154,170)]' : 'text-gray-400'} 
                    />
                  </motion.div>
                  
                  <p className="text-sm text-gray-300 mb-2">
                    Drag & drop your CSV or Excel file here
                  </p>
                  
                  <motion.button
                    className="text-sm text-[rgb(39,154,170)] hover:text-[rgb(49,164,180)] focus:outline-none"
                    onClick={() => fileInputRef.current?.click()}
                    whileHover={{ scale: 1.03 }}
                    disabled={importStatus === 'processing'}
                  >
                    or browse to upload
                  </motion.button>
                  
                  <p className="mt-2 text-xs text-gray-500">
                    Supported formats: CSV, Excel (.xlsx, .xls)
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <ExportToGoogleSheetsInstructionsModal 
        isOpen={showGoogleSheetsInstructions}
        onClose={() => setShowGoogleSheetsInstructions(false)}
        title={exportInstructions.title}
        steps={exportInstructions.steps}
        onOpenGoogleSheets={() => {
          openGoogleSheets();
        //   setShowGoogleSheetsInstructions(false);
        }}
      />
    </div>
  );
}
