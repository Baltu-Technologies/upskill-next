'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Check, 
  X, 
  Loader2, 
  RefreshCw,
  ChevronDown,
  ChevronUp 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface CourseContext {
  jobDescription?: {
    text: string;
    source: string;
    files: any[];
  };
  courseStructure?: {
    text: string;
    source: string;
    files: any[];
  };
}

interface AiEnhancedInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fieldType: 'courseTitle' | 'courseDescription' | 'learningOutcome' | 'prerequisite' | 'lessonTitle' | 'lessonDescription' | 'lessonObjective';
  context?: any;
  courseContext?: CourseContext;
  multiline?: boolean;
  className?: string;
  label?: string;
}

interface Suggestion {
  text: string;
  id: string;
}

export function AiEnhancedInput({
  value,
  onChange,
  placeholder,
  fieldType,
  context = {},
  courseContext,
  multiline = false,
  className = '',
  label
}: AiEnhancedInputProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');

  const fetchSuggestions = async () => {
    if (!value.trim()) {
      setError('Please enter some text first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fieldType,
          currentValue: value,
          context,
          courseContext
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const formattedSuggestions = data.suggestions.map((text: string, index: number) => ({
        text,
        id: `suggestion-${Date.now()}-${index}`
      }));

      setSuggestions(formattedSuggestions);
      setShowSuggestions(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const acceptSuggestion = (suggestionText: string) => {
    onChange(suggestionText);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const declineSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    if (suggestions.length <= 1) {
      setShowSuggestions(false);
    }
  };

  const dismissAllSuggestions = () => {
    setShowSuggestions(false);
    setSuggestions([]);
    setError('');
  };

  const InputComponent = multiline ? Textarea : Input;

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-sm font-medium text-white">
          {label}
        </label>
      )}
      
      <div className="relative">
        <InputComponent
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${className} pr-12`}
        />
        
        {/* AI Suggestion Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={fetchSuggestions}
          disabled={isLoading || !value.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-blue-500/20 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
          ) : (
            <Sparkles className="w-4 h-4 text-blue-400" />
          )}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2"
        >
          {error}
        </motion.div>
      )}

      {/* Suggestions Panel */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-800/50 border border-slate-600 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white">AI Suggestions</span>
                <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-400">
                  {suggestions.length}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={fetchSuggestions}
                  disabled={isLoading}
                  className="h-6 px-2 text-xs text-slate-400 hover:text-white"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Refresh
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={dismissAllSuggestions}
                  className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-slate-700/30 border border-slate-600/50 rounded-lg p-3 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-slate-200 leading-relaxed">
                        {suggestion.text}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => acceptSuggestion(suggestion.text)}
                        className="h-7 w-7 p-0 hover:bg-green-500/20 text-green-400"
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => declineSuggestion(suggestion.id)}
                        className="h-7 w-7 p-0 hover:bg-red-500/20 text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-600/50">
              <p className="text-xs text-slate-500 text-center">
                Click <Check className="w-3 h-3 inline text-green-400" /> to accept or <X className="w-3 h-3 inline text-red-400" /> to decline suggestions
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 