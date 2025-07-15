'use client';

import React from 'react';
import { SlideType } from '@/types/microlesson/slide';
import InlineTextEditor from './InlineTextEditor';
import { ImageLayout } from '@/types/microlesson/slide';
import TipTapSlideEditor from './TipTapSlideEditor';

interface EditableSlideRendererProps {
  slide: SlideType;
  onSlideChange: (updatedSlide: SlideType) => void;
}

export default function EditableSlideRenderer({ slide, onSlideChange }: EditableSlideRendererProps) {
  const handleTextChange = (field: string, content: string) => {
    const updatedSlide = { ...slide };
    const fieldPath = field.split('.');
    
    if (fieldPath.length === 1) {
      (updatedSlide as any)[fieldPath[0]] = content;
    } else if (fieldPath.length === 2) {
      (updatedSlide as any)[fieldPath[0]][fieldPath[1]] = content;
    }
    
    onSlideChange(updatedSlide);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedSlide = { ...slide };
        (updatedSlide as any).imageUrl = e.target?.result as string;
        onSlideChange(updatedSlide);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderEditableText = (field: string, value: string, className: string = '', placeholder: string = 'Click to edit...') => {
    return (
      <InlineTextEditor
        content={value || ''}
        onChange={(content) => handleTextChange(field, content)}
        className={className}
        placeholder={placeholder}
      />
    );
  };

  const renderImageComponent = (imageUrl?: string, caption?: string) => {
    if (!imageUrl) {
      return (
        <div className="w-full h-48 bg-gray-700 rounded-lg flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-500">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Click to upload image</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      );
    }

    return (
      <div className="relative group">
        <img 
          src={imageUrl} 
          alt={caption || 'Slide image'}
          className="w-full h-auto rounded-lg shadow-md"
        />
        {caption && (
          <div className="mt-2 text-sm text-gray-400 text-center">
            {renderEditableText('imageCaption', caption, 'text-sm text-gray-400', 'Enter caption...')}
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <p className="text-white text-sm">Click to change image</p>
        </div>
      </div>
    );
  };

  const renderContentWithImage = (textContent: React.ReactNode, imageUrl?: string, layout: ImageLayout = 'none') => {
    if (layout === 'none' || !imageUrl) {
      return textContent;
    }

    const imageComponent = renderImageComponent(imageUrl, (slide as any).imageCaption);

    switch (layout) {
      case 'top':
        return (
          <div className="space-y-6">
            <div className="w-full">
              {imageComponent}
            </div>
            <div>
              {textContent}
            </div>
          </div>
        );
      
      case 'left':
        return (
          <div className="flex items-start gap-8">
            <div className="flex-1">
              {imageComponent}
            </div>
            <div className="flex-1">
              {textContent}
            </div>
          </div>
        );
      
      case 'right':
        return (
          <div className="flex items-start gap-8">
            <div className="flex-1">
              {textContent}
            </div>
            <div className="flex-1">
              {imageComponent}
            </div>
          </div>
        );
      
      case 'bottom':
        return (
          <div className="space-y-6">
            <div>
              {textContent}
            </div>
            <div className="w-full">
              {imageComponent}
            </div>
          </div>
        );
      
      case 'background':
        return (
          <div className="relative">
            <div 
              className="absolute inset-0 bg-cover bg-center rounded-lg"
              style={{ 
                backgroundImage: `url(${imageUrl})`,
                filter: 'brightness(0.3)'
              }}
            />
            <div className="relative z-10 p-8">
              {textContent}
            </div>
          </div>
        );
      
      default:
        return textContent;
    }
  };

  const renderSlideContent = () => {
    const currentLayout = (slide as any).imageLayout || 'none';
    const imageUrl = (slide as any).imageUrl;

    switch (slide.type) {
      case 'TitleSlide':
        const titleContent = (
          <div className="text-center">
            {renderEditableText('title', slide.title, 'text-4xl font-bold mb-4 text-white', 'Enter slide title...')}
            {renderEditableText('subtitle', slide.subtitle || '', 'text-xl text-gray-300', 'Enter subtitle...')}
          </div>
        );
        return renderContentWithImage(titleContent, imageUrl, currentLayout);

      case 'TitleWithSubtext':
        const subtextContent = (
          <div>
            {renderEditableText('title', slide.title, 'text-3xl font-bold mb-6 text-white', 'Enter title...')}
            {renderEditableText('subtext', slide.subtext || '', 'text-lg mb-4 text-gray-300', 'Enter subtext...')}
            {renderEditableText('content', slide.content || '', 'text-lg text-gray-200', 'Enter content...')}
            {slide.bullets && slide.bullets.length > 0 && (
              <ul className="list-disc list-inside text-lg text-gray-200 space-y-2 mt-4">
                {slide.bullets.map((bullet, index) => (
                  <li key={index}>
                    {renderEditableText(`bullets.${index}`, bullet, 'inline', `Bullet point ${index + 1}...`)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
        return renderContentWithImage(subtextContent, imageUrl, currentLayout);

      case 'TitleWithImage':
        const titleImageContent = (
          <div>
            {renderEditableText('title', slide.title, 'text-3xl font-bold mb-4 text-white', 'Enter title...')}
            {renderEditableText('subtitle', slide.subtitle || '', 'text-lg text-gray-300', 'Enter subtitle...')}
          </div>
        );
        // Use new layout system but fallback to old imagePosition for backward compatibility
        const imageLayout = (slide as any).imageLayout || (slide.imagePosition === 'left' ? 'left' : 'right');
        return renderContentWithImage(titleImageContent, slide.imageUrl, imageLayout);

      case 'VideoSlide':
        return (
          <div>
            {renderEditableText('title', slide.title, 'text-3xl font-bold mb-6 text-white', 'Enter title...')}
            {renderEditableText('description', slide.description || '', 'text-lg mb-4 text-gray-300', 'Enter description...')}
            {slide.videoUrl ? (
              <div className="aspect-video">
                <video
                  controls
                  className="w-full h-full rounded-lg"
                  src={slide.videoUrl}
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                Video placeholder
              </div>
            )}
          </div>
        );

      case 'QuickCheckSlide':
        return (
          <div>
            {slide.title && renderEditableText('title', slide.title, 'text-3xl font-bold mb-6 text-white', 'Enter title...')}
            {renderEditableText('question', slide.question || '', 'text-2xl font-semibold mb-6 text-white', 'Enter question...')}
            <div className="space-y-4">
              <button className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors">
                True
              </button>
              <button className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors">
                False
              </button>
            </div>
          </div>
        );

      case 'MarkdownSlide':
        const markdownContent = (
          <div>
            {slide.title && renderEditableText('title', slide.title, 'text-3xl font-bold mb-6 text-white', 'Enter title...')}
            {renderEditableText('content', slide.content || '', 'text-lg prose prose-invert max-w-none text-gray-200', 'Enter content...')}
          </div>
        );
        return renderContentWithImage(markdownContent, imageUrl, currentLayout);

      case 'HotspotActivitySlide':
        return (
          <div>
            {renderEditableText('title', slide.title, 'text-3xl font-bold mb-6 text-white', 'Enter title...')}
            {slide.instruction && renderEditableText('instruction', slide.instruction, 'text-lg mb-4 text-gray-300', 'Enter instruction...')}
            <div className="bg-gray-700 rounded-lg p-8 aspect-video flex items-center justify-center">
              <p className="text-gray-400">Interactive hotspot activity</p>
            </div>
          </div>
        );

      case 'AR3DModelSlide':
        return (
          <div>
            {renderEditableText('title', slide.title, 'text-3xl font-bold mb-6 text-white', 'Enter title...')}
            <div className="bg-gray-700 rounded-lg p-8 aspect-video flex items-center justify-center">
              <p className="text-gray-400">3D Model: {slide.modelUrl}</p>
            </div>
          </div>
        );

      case 'CustomHTMLSlide':
        return (
          <div>
            <div 
              className="text-gray-200" 
              dangerouslySetInnerHTML={{ __html: slide.rawHtml || '' }}
            />
          </div>
        );

      default:
        const defaultContent = (
          <div>
            {renderEditableText('title', (slide as any).title || '', 'text-3xl font-bold mb-6 text-white', 'Enter title...')}
            {renderEditableText('content', (slide as any).content || '', 'text-lg text-gray-200', 'Enter content...')}
          </div>
        );
        return renderContentWithImage(defaultContent, imageUrl, currentLayout);
    }
  };

  return (
    <div className="w-full h-full">
      {/* Main slide content */}
      <div 
        className="w-full h-full rounded-lg shadow-lg p-8 flex items-center justify-center"
        style={{
          backgroundColor: slide.backgroundColor || '#0F172A'
        }}
      >
        <div className="w-full max-w-4xl">
          {renderSlideContent()}
        </div>
      </div>
    </div>
  );
} 