'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, Book, Loader2, BookOpen, Heart } from 'lucide-react';

interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
}

interface DefinitionData {
  word: string;
  phonetic?: string;
  phonetics?: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Definition[];
  }>;
}

interface DefinitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  word: string;
  onSaveToStudyList: (word: string, definition: string) => void;
}

export const DefinitionModal: React.FC<DefinitionModalProps> = ({
  isOpen,
  onClose,
  word,
  onSaveToStudyList
}) => {
  const [definitionData, setDefinitionData] = useState<DefinitionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen && word) {
      fetchDefinition();
    }
  }, [isOpen, word]);

  const fetchDefinition = async () => {
    setLoading(true);
    setError(null);
    setSaved(false);
    
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
      
      if (!response.ok) {
        throw new Error('Definition not found');
      }
      
      const data = await response.json();
      setDefinitionData(data[0]);
    } catch (err) {
      setError('Unable to find definition for this word');
      console.error('Error fetching definition:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToStudyList = () => {
    if (definitionData) {
      // Get the first definition from the first meaning
      const firstMeaning = definitionData.meanings[0];
      const firstDefinition = firstMeaning?.definitions[0]?.definition || 'No definition available';
      const partOfSpeech = firstMeaning?.partOfSpeech || '';
      
      const fullDefinition = `${partOfSpeech ? `(${partOfSpeech}) ` : ''}${firstDefinition}`;
      onSaveToStudyList(word, fullDefinition);
      setSaved(true);
      
      // Reset saved state after 2 seconds
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const playPronunciation = () => {
    if (definitionData?.phonetics) {
      const audioPhonetic = definitionData.phonetics.find(p => p.audio);
      if (audioPhonetic?.audio) {
        const audio = new Audio(audioPhonetic.audio);
        audio.play().catch(err => console.error('Error playing audio:', err));
      } else {
        // Fallback to speech synthesis
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(word);
          utterance.rate = 0.8;
          speechSynthesis.speak(utterance);
        }
      }
    }
  };

  const getAllDefinitions = () => {
    if (!definitionData) return [];
    
    const allDefinitions: Array<{ definition: string; partOfSpeech: string; example?: string }> = [];
    
    definitionData.meanings.forEach(meaning => {
      meaning.definitions.forEach(def => {
        allDefinitions.push({
          definition: def.definition,
          partOfSpeech: meaning.partOfSpeech,
          example: def.example
        });
      });
    });
    
    return allDefinitions;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Word Definition</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
              <p className="text-gray-300 mt-2">Loading definition...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchDefinition}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {definitionData && (
            <div>
              {/* Word and Pronunciation */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2 capitalize">
                  {definitionData.word}
                </h1>
                
                {/* Part of Speech Badge */}
                {definitionData.meanings[0]?.partOfSpeech && (
                  <span className="inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded-md mb-3">
                    {definitionData.meanings[0].partOfSpeech}
                  </span>
                )}
                
                {/* Pronunciation */}
                {(definitionData.phonetic || definitionData.phonetics?.[0]?.text) && (
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-gray-300 italic">
                      {definitionData.phonetic || definitionData.phonetics?.[0]?.text}
                    </span>
                    <button
                      onClick={playPronunciation}
                      className="text-blue-400 hover:text-blue-300 text-sm underline"
                    >
                      🔊 Listen
                    </button>
                  </div>
                )}
              </div>

              {/* Definitions */}
              <div className="space-y-4 mb-6">
                {getAllDefinitions().slice(0, 3).map((def, index) => (
                  <div key={index} className="text-gray-300">
                    <div className="flex items-start space-x-3">
                      <span className="text-white font-semibold text-lg mt-0.5">
                        {index + 1}.
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-200 leading-relaxed">
                          {def.definition}
                        </p>
                        {def.example && (
                          <p className="text-gray-400 italic mt-2 text-sm">
                            Example: "{def.example}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Source Attribution */}
              <div className="border-t border-gray-700 pt-4">
                <p className="text-gray-400 text-sm mb-4">
                  Definition from Free Dictionary API
                </p>
                
                {/* Save to Study List Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveToStudyList}
                    disabled={saved}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                      saved
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                    <span>{saved ? 'Saved to Study List' : 'Save to Study List'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 