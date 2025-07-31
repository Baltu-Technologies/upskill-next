'use client';

import { useState, useCallback, useRef } from 'react';
import { SlideType } from '@/types/microlesson/slide';

export interface StreamEvent {
  type: 'start' | 'slide_created' | 'character' | 'complete' | 'error';
  slideIndex?: number;
  slide?: SlideType;
  field?: string;
  content?: string;
  isTyping?: boolean;
  slides?: SlideType[];
  totalSlides?: number;
  message?: string;
}

export interface UseSlideGenerationStreamReturn {
  isStreaming: boolean;
  slides: SlideType[];
  currentStreamingSlide: number | null;
  currentStreamingField: string | null;
  streamingContent: Record<string, Record<string, string>>;
  error: string | null;
  startGeneration: (microlessonContext: any, courseContext: any) => Promise<void>;
  stopGeneration: () => void;
  regenerateSlide: (slideIndex: number) => Promise<void>;
  addSlide: (slide: SlideType, index?: number) => void;
  updateSlide: (index: number, slide: SlideType) => void;
  deleteSlide: (index: number) => void;
  initializeSlides: (slides: SlideType[]) => void;
}

export const useSlideGenerationStream = (): UseSlideGenerationStreamReturn => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [slides, setSlides] = useState<SlideType[]>([]);
  const [currentStreamingSlide, setCurrentStreamingSlide] = useState<number | null>(null);
  const [currentStreamingField, setCurrentStreamingField] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState<Record<string, Record<string, string>>>({});
  const [error, setError] = useState<string | null>(null);
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopGeneration = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setCurrentStreamingSlide(null);
    setCurrentStreamingField(null);
  }, []);

  const handleStreamEvent = useCallback((event: StreamEvent) => {
    switch (event.type) {
      case 'start':
        setError(null);
        setSlides([]);
        setStreamingContent({});
        break;

      case 'slide_created':
        if (event.slide && typeof event.slideIndex === 'number') {
          // Ensure slide has required properties
          const slide = event.slide;
          if (!slide.type) {
            console.warn('Received slide without type property:', slide);
            slide.type = 'TitleSlide'; // Default fallback
          }
          if (!slide.id) {
            slide.id = `slide-${Date.now()}-${event.slideIndex}`;
          }
          
          setSlides(prevSlides => {
            const newSlides = [...prevSlides];
            newSlides[event.slideIndex!] = slide;
            return newSlides;
          });
          setCurrentStreamingSlide(event.slideIndex);
        }
        break;

      case 'character':
        if (typeof event.slideIndex === 'number' && event.field && event.content !== undefined) {
          setCurrentStreamingSlide(event.slideIndex);
          setCurrentStreamingField(event.field);
          
          // Update streaming content for real-time display
          setStreamingContent(prev => ({
            ...prev,
            [event.slideIndex!]: {
              ...prev[event.slideIndex!],
              [event.field!]: event.content!
            }
          }));

          // Update actual slide content
          setSlides(prevSlides => {
            const newSlides = [...prevSlides];
            if (newSlides[event.slideIndex!]) {
              const existingSlide = newSlides[event.slideIndex!];
              // Ensure slide has type property
              if (!existingSlide.type) {
                existingSlide.type = 'TitleSlide'; // Default fallback
              }
              newSlides[event.slideIndex!] = {
                ...existingSlide,
                [event.field!]: event.content!
              };
            }
            return newSlides;
          });
        }
        break;

      case 'complete':
        if (event.slides) {
          setSlides(event.slides);
        }
        setIsStreaming(false);
        setCurrentStreamingSlide(null);
        setCurrentStreamingField(null);
        setStreamingContent({});
        break;

      case 'error':
        setError(event.message || 'An error occurred during generation');
        setIsStreaming(false);
        setCurrentStreamingSlide(null);
        setCurrentStreamingField(null);
        break;
    }
  }, []);

  const startGeneration = useCallback(async (microlessonContext: any, courseContext: any) => {
    try {
      setIsStreaming(true);
      setError(null);
      setSlides([]);
      setStreamingContent({});
      
      abortControllerRef.current = new AbortController();

      // Start the streaming request
      const response = await fetch('/api/ai-slide-generation-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          microlessonContext,
          courseContext,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Create EventSource-like interface from fetch response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          
          // Process complete SSE messages
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const eventData = JSON.parse(line.slice(6));
                handleStreamEvent(eventData);
              } catch (e) {
                console.warn('Failed to parse SSE data:', e);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Generation was cancelled
        return;
      }
      
      console.error('Generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate slides');
      setIsStreaming(false);
      setCurrentStreamingSlide(null);
      setCurrentStreamingField(null);
    }
  }, [handleStreamEvent]);

  const regenerateSlide = useCallback(async (slideIndex: number) => {
    // For now, this would restart the entire generation
    // In a more advanced implementation, we could have a separate endpoint
    // for regenerating individual slides
    console.log('Regenerate slide:', slideIndex);
    // TODO: Implement individual slide regeneration
  }, []);

  const addSlide = useCallback((slide: SlideType, index?: number) => {
    setSlides(prevSlides => {
      const newSlides = [...prevSlides];
      const insertIndex = index !== undefined ? index : newSlides.length;
      newSlides.splice(insertIndex, 0, slide);
      return newSlides;
    });
  }, []);

  const updateSlide = useCallback((index: number, slide: SlideType) => {
    setSlides(prevSlides => {
      const newSlides = [...prevSlides];
      if (index >= 0 && index < newSlides.length) {
        newSlides[index] = slide;
      }
      return newSlides;
    });
  }, []);

  const deleteSlide = useCallback((index: number) => {
    setSlides(prevSlides => {
      const newSlides = [...prevSlides];
      if (index >= 0 && index < newSlides.length) {
        newSlides.splice(index, 1);
      }
      return newSlides;
    });
  }, []);

  const initializeSlides = useCallback((initialSlides: SlideType[]) => {
    setSlides(initialSlides);
    setError(null);
    console.log(`Initialized with ${initialSlides.length} existing slides`);
  }, []);

  return {
    isStreaming,
    slides,
    currentStreamingSlide,
    currentStreamingField,
    streamingContent,
    error,
    startGeneration,
    stopGeneration,
    regenerateSlide,
    addSlide,
    updateSlide,
    deleteSlide,
    initializeSlides,
  };
};