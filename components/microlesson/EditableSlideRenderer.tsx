'use client';

import React from 'react';
import { SlideType } from '@/types/microlesson/slide';
import EnhancedInlineTextEditor from './EnhancedInlineTextEditor';
import { ImageLayout, ColumnLayout } from '@/types/microlesson/slide';
import TipTapSlideEditor from './TipTapSlideEditor';
import ColumnEditor from './ColumnEditor';
import TableBasedColumnEditor from './TableBasedColumnEditor';

interface EditableSlideRendererProps {
  slide: SlideType;
  onSlideChange: (updatedSlide: SlideType) => void;
}

export default function EditableSlideRenderer({ slide, onSlideChange }: EditableSlideRendererProps) {
  
  const handleColumnsChange = (columns: any[]) => {
    const updatedSlide = { ...slide, columns };
    onSlideChange(updatedSlide);
  };

  const handleTableContentChange = (content: string) => {
    const updatedSlide = { ...slide, tableContent: content };
    onSlideChange(updatedSlide);
  };
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

  const renderEditableText = (field: string, value: string, className: string = '', placeholder: string = 'Click to edit...', blockType: 'title' | 'content' | 'subtitle' | 'other' = 'other') => {
    return (
      <EnhancedInlineTextEditor
        content={value || ''}
        onChange={(content: string) => handleTextChange(field, content)}
        className={className}
        placeholder={placeholder}
        showToolbar={false}
        blockType={blockType}
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
      <div className="relative group w-full h-full">
        <img 
          src={imageUrl} 
          alt={caption || 'Slide image'}
          className="w-full h-full object-cover"
        />
        {caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2">
            {renderEditableText('imageCaption', caption, 'text-sm text-white', 'Enter caption...', 'other')}
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
          <div className="flex flex-col h-full">
            <div className="w-full h-64 flex-shrink-0">
              {imageComponent}
            </div>
            <div className="flex-1 flex flex-col justify-start px-8 pt-8">
              <div className="w-full">
                {textContent}
              </div>
            </div>
          </div>
        );
      
      case 'left':
        return (
          <div className="flex items-stretch h-full">
            <div className="flex-1 h-full">
              {imageComponent}
            </div>
            <div className="flex-1 flex flex-col justify-start px-8 pt-8">
              <div className="w-full">
                {textContent}
              </div>
            </div>
          </div>
        );
      
      case 'right':
        return (
          <div className="flex items-stretch h-full">
            <div className="flex-1 flex flex-col justify-start px-8 pt-8">
              <div className="w-full">
                {textContent}
              </div>
            </div>
            <div className="flex-1 h-full">
              {imageComponent}
            </div>
          </div>
        );
      
      case 'bottom':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col justify-start px-8 pt-8">
              <div className="w-full">
                {textContent}
              </div>
            </div>
            <div className="w-full h-64 flex-shrink-0">
              {imageComponent}
            </div>
          </div>
        );
      
      case 'background':
        return (
          <div className="w-full h-full flex items-center justify-center">
            {textContent}
          </div>
        );
      
      default:
        return textContent;
    }
  };

  const renderSlideContent = () => {
    const currentLayout = slide.imageLayout || 'none';
    const imageUrl = slide.imageUrl;

    switch (slide.type) {
      case 'TitleSlide':
        const titleContent = (
          <div className="text-center">
            {renderEditableText('title', slide.title, 'text-4xl font-bold mb-4 text-white', 'Enter slide title...', 'title')}
            {renderEditableText('subtitle', slide.subtitle || '', 'text-xl text-gray-300', 'Enter subtitle...', 'subtitle')}
          </div>
        );
        return currentLayout === 'none' ? (
          <div className="flex flex-col justify-start h-full px-8 pt-8 w-full">
            <div className="w-full">
              {titleContent}
            </div>
          </div>
        ) : renderContentWithImage(titleContent, imageUrl, currentLayout);

      case 'TitleWithSubtext':
        const subtextContent = (
          <div>
            {renderEditableText('title', slide.title, 'text-3xl font-bold mb-6 text-white', 'Enter title...', 'title')}
            {renderEditableText('subtext', slide.subtext || '', 'text-lg mb-4 text-gray-300', 'Enter subtext...', 'subtitle')}
            {renderEditableText('content', slide.content || '', 'text-lg text-gray-200', 'Enter content...', 'content')}
            {slide.bullets && slide.bullets.length > 0 && (
              <ul className="list-disc list-inside text-lg text-gray-200 space-y-2 mt-4">
                {slide.bullets.map((bullet, index) => (
                  <li key={index}>
                    {renderEditableText(`bullets.${index}`, bullet, 'inline', `Bullet point ${index + 1}...`, 'content')}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
        return currentLayout === 'none' ? (
          <div className="flex flex-col justify-start h-full px-8 pt-8 w-full">
            <div className="w-full">
              {subtextContent}
            </div>
          </div>
        ) : renderContentWithImage(subtextContent, imageUrl, currentLayout);

      case 'TitleWithImage':
        const titleImageContent = (
          <div>
            {renderEditableText('title', slide.title, 'text-3xl font-bold mb-4 text-white', 'Enter title...', 'title')}
            {renderEditableText('subtitle', slide.subtitle || '', 'text-lg text-gray-300', 'Enter subtitle...', 'subtitle')}
          </div>
        );
        // Use new layout system but fallback to old imagePosition for backward compatibility
        const imageLayout = slide.imageLayout || (slide.imagePosition === 'left' ? 'left' : (slide.imagePosition === 'right' ? 'right' : 'none'));
        return imageLayout === 'none' ? (
          <div className="flex flex-col justify-start h-full px-8 pt-8 w-full">
            <div className="w-full">
              {titleImageContent}
            </div>
          </div>
        ) : renderContentWithImage(titleImageContent, slide.imageUrl, imageLayout);

      case 'VideoSlide':
        const videoContent = (
          <div>
            {renderEditableText('title', slide.title, 'text-3xl font-bold mb-6 text-white', 'Enter title...', 'title')}
            {renderEditableText('description', slide.description || '', 'text-lg mb-4 text-gray-300', 'Enter description...', 'content')}
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
        return (
          <div className="flex flex-col justify-start h-full px-8 pt-8 w-full">
            <div className="w-full">
              {videoContent}
            </div>
          </div>
        );

      case 'QuickCheckSlide':
        const quickCheckContent = (
          <div>
            {slide.title && renderEditableText('title', slide.title, 'text-3xl font-bold mb-6 text-white', 'Enter title...', 'title')}
            {renderEditableText('question', slide.question || '', 'text-2xl font-semibold mb-6 text-white', 'Enter question...', 'content')}
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
        return (
          <div className="flex flex-col justify-start h-full px-8 pt-8 w-full">
            <div className="w-full">
              {quickCheckContent}
            </div>
          </div>
        );

      case 'MarkdownSlide':
        const markdownContent = (
          <div>
            {slide.title && renderEditableText('title', slide.title, 'text-3xl font-bold mb-6 text-white', 'Enter title...', 'title')}
            {renderEditableText('content', slide.content || '', 'text-lg prose prose-invert max-w-none text-gray-200', 'Enter content...', 'content')}
          </div>
        );
        return currentLayout === 'none' ? (
          <div className="flex flex-col justify-start h-full px-8 pt-8 w-full">
            <div className="w-full">
              {markdownContent}
            </div>
          </div>
        ) : renderContentWithImage(markdownContent, imageUrl, currentLayout);

      case 'HotspotActivitySlide':
        return (
          <div className="px-8">
            {renderEditableText('title', slide.title, 'text-3xl font-bold mb-6 text-white', 'Enter title...', 'title')}
            {slide.instruction && renderEditableText('instruction', slide.instruction, 'text-lg mb-4 text-gray-300', 'Enter instruction...', 'content')}
            <div className="bg-gray-700 rounded-lg p-8 aspect-video flex items-center justify-center">
              <p className="text-gray-400">Interactive hotspot activity</p>
            </div>
          </div>
        );

      case 'AR3DModelSlide':
        return (
          <div className="px-8">
            {renderEditableText('title', slide.title, 'text-3xl font-bold mb-6 text-white', 'Enter title...', 'title')}
            <div className="bg-gray-700 rounded-lg p-8 aspect-video flex items-center justify-center">
              <p className="text-gray-400">3D Model: {slide.modelUrl}</p>
            </div>
          </div>
        );

      case 'CustomHTMLSlide':
        return (
          <div className="px-8">
            <div 
              className="text-gray-200" 
              dangerouslySetInnerHTML={{ __html: slide.rawHtml || '' }}
            />
          </div>
        );

      default:
        const defaultContent = (
          <div>
            {renderEditableText('title', (slide as any).title || '', 'text-3xl font-bold mb-6 text-white', 'Enter title...', 'title')}
            {renderEditableText('content', (slide as any).content || '', 'text-lg text-gray-200', 'Enter content...', 'content')}
          </div>
        );
        return renderContentWithImage(defaultContent, imageUrl, currentLayout);
    }
  };

  return (
    <div className="w-full h-full">
      {/* Main slide content */}
      <div 
        className="w-full h-full rounded-lg shadow-lg relative overflow-hidden"
        style={{
          background: slide.backgroundColor || '#0F172A'
        }}
      >
        {/* Background image overlay for background layout */}
        {slide.imageUrl && slide.imageLayout === 'background' && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${slide.imageUrl})`,
              opacity: 0.3
            }}
          />
        )}
        
        {/* Conditional container based on layout */}
        {(slide as any).tableContent !== undefined ? (
          // For table-based columns, use table editor
          <div className="w-full h-full max-w-6xl mx-auto p-8 relative z-10">
            <TableBasedColumnEditor
              content={(slide as any).tableContent || ''}
              onContentChange={handleTableContentChange}
            />
          </div>
        ) : (slide as any).columnLayout && (slide as any).columnLayout !== 'none' ? (
          // For column layouts, use column editor
          <div className="w-full h-full max-w-6xl mx-auto p-8 relative z-10">
            <ColumnEditor
              layout={(slide as any).columnLayout}
              columns={(slide as any).columns || []}
              onColumnsChange={handleColumnsChange}
            />
          </div>
        ) : slide.imageLayout && slide.imageLayout !== 'none' && slide.imageLayout !== 'background' ? (
          // For image layouts that need to reach edges, don't use padding container
          <div className="w-full h-full relative z-10">
            {renderSlideContent()}
          </div>
        ) : (
          // For regular layouts or background, use padding container
          <div className="w-full h-full max-w-4xl mx-auto p-8 relative z-10">
            {renderSlideContent()}
          </div>
        )}
      </div>
    </div>
  );
} 