'use client';

import React, { useState } from 'react';
import { ArrowLeft, Table as TableIcon, Grid, Plus, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import TableAsColumns from '@/components/microlesson/TableAsColumnsExtension';
import './table-styles.css';

export default function TableBasedColumnsDemo() {
  const [currentLayout, setCurrentLayout] = useState('none');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'w-full border-separate border-spacing-0 my-4',
        },
        handleWidth: 5,
        cellMinWidth: 25,
      }),
      TableRow,
      TableHeader,
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-slate-300 p-4 align-top bg-slate-50 text-slate-700 first:rounded-l-lg last:rounded-r-lg relative min-w-[100px]',
        },
      }),
    ],
    content: `
      <div style="color: #334155; padding: 20px;">
        <h2 style="color: #1e293b; margin-bottom: 16px;">Table-Based Column System</h2>
        <p style="color: #475569; margin-bottom: 12px;">Click one of the column layouts below to insert a table that behaves like columns.</p>
        <p style="color: #475569; margin-bottom: 0;">This approach uses TipTap v3's native table extension, styled to look like columns.</p>
      </div>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-lg lg:prose-xl mx-auto focus:outline-none p-4 min-h-[400px] prose-slate prose-headings:text-slate-800 prose-p:text-slate-700 prose-strong:text-slate-800',
      },
    },
    immediatelyRender: false, // Fix SSR hydration issue
  });

  const handleLayoutChange = (layout: string) => {
    setCurrentLayout(layout);
    const columnCount = parseInt(layout.split('-')[0]);
    
    if (editor) {
      editor.commands.insertTable({
        rows: 1,
        cols: columnCount,
        withHeaderRow: false,
      });
      
      // Add example content with proper styling
      setTimeout(() => {
        let content = '<table><tr>';
        for (let i = 1; i <= columnCount; i++) {
          content += `<td><h3 style="color: #1e293b; margin-top: 0; margin-bottom: 8px;">Column ${i}</h3><p style="color: #475569; margin-bottom: 0;">This is column ${i} with sample content.</p></td>`;
        }
        content += '</tr></table>';
        
        editor.commands.setTextSelection({ from: 1, to: 1 });
        editor.commands.insertContentAt(editor.state.selection.from, content);
      }, 100);
    }
  };

  const insertExampleContent = () => {
    editor?.commands.insertTable({
      rows: 1,
      cols: 3,
      withHeaderRow: false,
    });
    
    // Add some example content after a brief delay
    setTimeout(() => {
      editor?.commands.setTextSelection({ from: 1, to: 1 });
      editor?.commands.insertContentAt(
        editor.state.selection.from,
        '<table><tr><td><h3 style="color: #1e293b; margin-top: 0; margin-bottom: 8px;">Column 1</h3><p style="color: #475569; margin-bottom: 0;">This is the first column with some sample content.</p></td><td><h3 style="color: #1e293b; margin-top: 0; margin-bottom: 8px;">Column 2</h3><p style="color: #475569; margin-bottom: 0;">This is the second column with different content.</p></td><td><h3 style="color: #1e293b; margin-top: 0; margin-bottom: 8px;">Column 3</h3><p style="color: #475569; margin-bottom: 0;">This is the third column completing our layout.</p></td></tr></table>'
      );
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Demos
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Table-Based Column System</h1>
              <p className="text-slate-600">TipTap v3 native table extension styled as columns</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <TableIcon className="w-3 h-3 mr-1" />
              TipTap v3
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Native Tables
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Section */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Live Editor
              </CardTitle>
              <CardDescription>
                Try the column layouts below and see how tables can be styled as columns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg bg-white">
                <div className="table-container prose prose-slate max-w-none p-4">
                  <EditorContent editor={editor} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Column Layout Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid className="w-5 h-5" />
                Column Layout Controls
              </CardTitle>
              <CardDescription>
                Select a column layout to insert into the editor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TableAsColumns
                onLayoutChange={handleLayoutChange}
                className=""
              />
              
              <div className="mt-4 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={insertExampleContent}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Insert Example 3-Column Layout
                </Button>
                
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Table Resizing Controls</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editor?.commands.addColumnBefore()}
                      className="text-xs"
                    >
                      Add Column Before
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editor?.commands.addColumnAfter()}
                      className="text-xs"
                    >
                      Add Column After
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editor?.commands.deleteColumn()}
                      className="text-xs"
                    >
                      Delete Column
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editor?.commands.deleteTable()}
                      className="text-xs"
                    >
                      Delete Table
                    </Button>
                  </div>
                </div>
                
                <div className="text-xs text-slate-500 space-y-1">
                  <p><strong>Try these table commands:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Click in a cell and type to add content</li>
                    <li><strong>Drag column borders to resize</strong> (resizable: true)</li>
                    <li>Right-click for table options</li>
                    <li>Use Tab to move between columns</li>
                    <li>Use the controls above to add/remove columns</li>
                    <li>Select table and use toolbar for modifications</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features & Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid className="w-5 h-5" />
                Features & Benefits
              </CardTitle>
              <CardDescription>
                Why use table-based columns?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-green-700">✅ Advantages</h4>
                  <ul className="text-sm space-y-1 text-slate-600">
                    <li>• Native TipTap v3 compatibility</li>
                    <li>• Rich editing within each column</li>
                    <li>• Built-in table commands</li>
                    <li>• Resizable columns</li>
                    <li>• Accessible table structure</li>
                    <li>• No version conflicts</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-amber-700">⚠️ Considerations</h4>
                  <ul className="text-sm space-y-1 text-slate-600">
                    <li>• Table semantics (not pure columns)</li>
                    <li>• Requires custom CSS styling</li>
                    <li>• May need accessibility adjustments</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CSS Styling Examples */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>CSS Styling for Column Appearance</CardTitle>
            <CardDescription>
              Here's how to style TipTap tables to look like columns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
              <pre>{`/* Table-based column styling */
.column-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  table-layout: fixed;
}

.column-table td {
  border-left: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  border-top: none;
  border-bottom: none;
  padding: 16px;
  vertical-align: top;
  min-height: 200px;
  background: transparent;
}

.column-table td:first-child {
  border-left: none;
}

.column-table td:last-child {
  border-right: none;
}

.column-table td:focus {
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
}`}</pre>
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  );
} 