'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Sparkles, Rows3, ChevronDown, CornerDownLeft } from 'lucide-react';

interface ColumnOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedColumn: { name: string; field: string } | null;
  availableColumns: { name: string; field: string; systemPrompt: string; autofillType: string }[];
}

export const ColumnOptionsDialog: React.FC<ColumnOptionsDialogProps> = ({ 
  open, 
  onOpenChange, 
  selectedColumn,
  availableColumns 
}) => {
  const [systemPrompt, setSystemPrompt] = React.useState("");
  const [autofillType, setAutofillType] = React.useState("ai");
  const [showColumnSuggestions, setShowColumnSuggestions] = React.useState(false);
  const [cursorPosition, setCursorPosition] = React.useState(0);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  // Load config from localStorage when dialog opens or selectedColumn changes
  React.useEffect(() => {
    if (open && selectedColumn) {
      const key = `columnConfig_${selectedColumn.field}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSystemPrompt(parsed.systemPrompt || "");
          setAutofillType(parsed.autofillType || "ai");
        } catch {
          setSystemPrompt("");
          setAutofillType("ai");
        }
      } else {
        setSystemPrompt("");
        setAutofillType("ai");
      }
    }
  }, [open, selectedColumn]);

  // Handle text area input to detect @ symbol
  const handleTextAreaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const position = e.target.selectionStart;
    setSystemPrompt(newValue);
    setCursorPosition(position);

    // Check if we should show column suggestions
    const textBeforeCursor = newValue.slice(0, position);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    setShowColumnSuggestions(
      lastAtSymbol !== -1 && 
      !textBeforeCursor.slice(lastAtSymbol + 1).includes(' ')
    );
  };

  // Insert column reference at cursor position
  const insertColumnReference = (columnName: string) => {
    if (!textAreaRef.current) return;

    const text = systemPrompt;
    const textBeforeCursor = text.slice(0, cursorPosition);
    const textAfterCursor = text.slice(cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtSymbol === -1) return;

    const newText = 
      textBeforeCursor.slice(0, lastAtSymbol) + 
      '@' + columnName + 
      textAfterCursor;

    setSystemPrompt(newText);
    setShowColumnSuggestions(false);
  };

  // Filter available columns for suggestions
  const getFilteredColumns = () => {
    if (!showColumnSuggestions) return [];
    
    const textBeforeCursor = systemPrompt.slice(0, cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    const searchText = textBeforeCursor.slice(lastAtSymbol + 1).toLowerCase();
    
    return availableColumns
      .filter(col => col.name.toLowerCase().includes(searchText))
      .filter(col => col.name !== selectedColumn?.name);
  };

  // Save config to localStorage
  const handleSave = () => {
    if (selectedColumn) {
      const key = `columnConfig_${selectedColumn.field}`;
      const config = {
        name: selectedColumn.name,
        systemPrompt,
        autofillType,
      };
      localStorage.setItem(key, JSON.stringify(config));
      onOpenChange(false);
    }
  };

  if (!selectedColumn) return null;

  const filteredColumns = getFilteredColumns();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1C1F23] border-zinc-800/50">
        <DialogHeader>
          <DialogTitle className="text-lg text-zinc-100">{selectedColumn?.name}</DialogTitle>
          <DialogDescription className="text-sm text-zinc-400">
            System prompt for this column. Use @ to reference other columns.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-zinc-400">Autofill type</label>
            <select
              className="flex items-center justify-between gap-2 px-3 py-2 bg-zinc-900 rounded-lg border border-zinc-800/50 cursor-pointer text-sm text-zinc-300 w-full"
              value={autofillType}
              onChange={e => setAutofillType(e.target.value)}
            >
              <option value="ai">AI</option>
              <option value="websearch">Web Search</option>
            </select>
          </div>
          <div className="space-y-2 relative">
            <label className="text-xs text-zinc-400">System Prompt</label>
            <textarea
              ref={textAreaRef}
              className="w-full bg-zinc-900 rounded-lg border border-zinc-800/50 p-3 text-sm text-zinc-300 placeholder:text-zinc-500"
              placeholder="Enter a system prompt for this column. Use @ to reference other columns"
              rows={3}
              value={systemPrompt}
              onChange={handleTextAreaInput}
            />
            {showColumnSuggestions && filteredColumns.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-zinc-900 border border-zinc-800/50 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredColumns.map((col) => (
                  <button
                    key={col.field}
                    className="w-full px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800/50"
                    onClick={() => insertColumnReference(col.name)}
                  >
                    {col.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-zinc-500">AI will have access to all record attributes</p>
        </div>
        <DialogFooter className="mt-6">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100">Cancel</Button>
          <Button className="bg-[#3DD2D3] text-black hover:bg-[#3DD2D3]/80" onClick={handleSave}>
            Save changes
            <CornerDownLeft size={16} className="ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
