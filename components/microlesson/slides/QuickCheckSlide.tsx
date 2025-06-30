'use client';

import React, { useState } from 'react';
import { QuickCheckSlide as QuickCheckSlideType } from '@/types/microlesson/slide';
import { motion } from 'framer-motion';
import { Check, X, Lightbulb } from 'lucide-react';
import { SlideContainer } from '../SlideContainer';

interface QuickCheckSlideProps {
  slide: QuickCheckSlideType;
  onNext?: () => void;
  onPrevious?: () => void;
  onQuickCheckAnswered?: (correct: boolean) => void;
}

export const QuickCheckSlide: React.FC<QuickCheckSlideProps> = ({ 
  slide, 
  onNext, 
  onQuickCheckAnswered 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [userInput, setUserInput] = useState('');

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    const answer = slide.questionType === 'fill-in-the-blank' ? userInput : selectedAnswer;
    const correct = Array.isArray(slide.correctAnswer) 
      ? slide.correctAnswer.includes(answer)
      : answer === slide.correctAnswer;
    
    setShowResult(true);
    onQuickCheckAnswered?.(correct);
  };

  const isCorrect = () => {
    const answer = slide.questionType === 'fill-in-the-blank' ? userInput : selectedAnswer;
    return Array.isArray(slide.correctAnswer) 
      ? slide.correctAnswer.includes(answer)
      : answer === slide.correctAnswer;
  };

  const hasAnswer = slide.questionType === 'fill-in-the-blank' 
    ? userInput.trim() !== '' 
    : selectedAnswer !== '';

  return (
    <SlideContainer
      backgroundColor="#0F172A"
      maxWidth="md"
      padding="md"
    >
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Quick Check</h2>
          <div className="w-16 h-1 bg-blue-500 mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-slate-800 rounded-2xl p-8 shadow-2xl"
        >
          <h3 className="text-2xl font-semibold text-white mb-8 text-center">
            {slide.question}
          </h3>

          {slide.questionType === 'multiple-choice' && slide.choices && (
            <div className="space-y-4">
              {slide.choices.map((choice, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  onClick={() => !showResult && handleAnswerSelect(choice)}
                  disabled={showResult}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                    showResult
                      ? choice === slide.correctAnswer
                        ? 'border-green-500 bg-green-500/20 text-green-300'
                        : choice === selectedAnswer
                        ? 'border-red-500 bg-red-500/20 text-red-300'
                        : 'border-slate-600 bg-slate-700 text-slate-400'
                      : selectedAnswer === choice
                      ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                      : 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{choice}</span>
                    {showResult && choice === slide.correctAnswer && (
                      <Check className="w-5 h-5 text-green-400" />
                    )}
                    {showResult && choice === selectedAnswer && choice !== slide.correctAnswer && (
                      <X className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {slide.questionType === 'fill-in-the-blank' && (
            <div className="space-y-4">
              <div className="text-center">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={showResult}
                  placeholder="Type your answer here..."
                  className="w-full max-w-md p-4 bg-slate-700 border-2 border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              {showResult && (
                <div className="text-center">
                  <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    isCorrect() ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {isCorrect() ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    <span>{isCorrect() ? 'Correct!' : 'Incorrect'}</span>
                  </div>
                  {!isCorrect() && (
                    <p className="text-slate-400 mt-2">
                      Correct answer: {Array.isArray(slide.correctAnswer) ? slide.correctAnswer.join(', ') : slide.correctAnswer}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center mt-8">
            {slide.hint && (
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
              </button>
            )}
            
            <div className="ml-auto">
              {!showResult ? (
                <button
                  onClick={handleSubmit}
                  disabled={!hasAnswer}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  Submit
                </button>
              ) : (
                onNext && (
                  <button
                    onClick={onNext}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <span>Continue</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )
              )}
            </div>
          </div>

          {showHint && slide.hint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
            >
              <p className="text-yellow-300 text-sm">💡 {slide.hint}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </SlideContainer>
  );
}; 