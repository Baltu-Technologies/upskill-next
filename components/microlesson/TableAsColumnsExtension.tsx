'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Columns, Grid, Plus, Trash2, X } from 'lucide-react';

interface TableAsColumnsProps {
  onLayoutChange?: (layout: string) => void;
  className?: string;
}

export default function TableAsColumns({ onLayoutChange, className = '' }: TableAsColumnsProps) {
  const insertColumnTable = (columns: number) => {
    // Signal that we want to use table-based columns
    onLayoutChange?.(`table-${columns}-columns`);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-sm font-medium text-slate-300">Column Layout</h3>
      
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertColumnTable(2)}
          className="h-auto p-3 flex flex-col items-center gap-2 text-slate-300 border-slate-600 hover:bg-slate-700"
        >
          <Grid className="w-4 h-4" />
          <span className="text-xs">2 Columns</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertColumnTable(3)}
          className="h-auto p-3 flex flex-col items-center gap-2 text-slate-300 border-slate-600 hover:bg-slate-700"
        >
          <Grid className="w-4 h-4" />
          <span className="text-xs">3 Columns</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertColumnTable(4)}
          className="h-auto p-3 flex flex-col items-center gap-2 text-slate-300 border-slate-600 hover:bg-slate-700"
        >
          <Grid className="w-4 h-4" />
          <span className="text-xs">4 Columns</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertColumnTable(5)}
          className="h-auto p-3 flex flex-col items-center gap-2 text-slate-300 border-slate-600 hover:bg-slate-700"
        >
          <Grid className="w-4 h-4" />
          <span className="text-xs">5 Columns</span>
        </Button>
      </div>
      
      <div className="mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onLayoutChange?.('none')}
          className="w-full h-auto p-2 text-xs text-slate-400 border-slate-600 hover:bg-slate-700"
        >
          <X className="w-3 h-3 mr-2" />
          Clear Columns
        </Button>
      </div>
      
      <div className="text-xs text-slate-500 bg-slate-800/50 p-2 rounded">
        💡 Click a column layout above to add a table-based column system to your slide. Use the table commands in the editor to add/remove columns or modify the layout.
      </div>
    </div>
  );
} 