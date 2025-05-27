'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  FileText,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit3,
  Trash2,
  Tag,
  Calendar,
  BookOpen,
  Star,
  Copy,
  Share2,
  Download,
  ChevronDown,
  StickyNote,
  Bookmark,
  Clock,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock notes data
const notes = [
  {
    id: 1,
    title: 'React Hooks Best Practices',
    content: 'Key takeaways from the React Hooks lesson:\n\n1. Always use hooks at the top level\n2. Use useCallback for expensive operations\n3. useEffect cleanup is crucial for memory management\n4. Custom hooks promote reusability\n\nExample: const [count, setCount] = useState(0);',
    tags: ['React', 'JavaScript', 'Frontend'],
    category: 'Course Notes',
    source: 'Advanced React Patterns',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
    pinned: true,
    wordCount: 45,
    readTime: '1 min'
  },
  {
    id: 2,
    title: 'Machine Learning Algorithms Overview',
    content: 'Comprehensive notes on ML algorithms:\n\n**Supervised Learning:**\n- Linear Regression\n- Decision Trees\n- Random Forest\n- SVM\n\n**Unsupervised Learning:**\n- K-Means Clustering\n- PCA\n- DBSCAN\n\n**Key Concepts:**\n- Feature engineering is crucial\n- Cross-validation prevents overfitting\n- Bias-variance tradeoff',
    tags: ['Machine Learning', 'AI', 'Algorithms'],
    category: 'Research',
    source: 'ML Fundamentals Course',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-19',
    pinned: false,
    wordCount: 82,
    readTime: '2 min'
  },
  {
    id: 3,
    title: 'TypeScript Advanced Types',
    content: 'Advanced TypeScript concepts:\n\n```typescript\n// Mapped Types\ntype Readonly<T> = {\n  readonly [P in keyof T]: T[P];\n};\n\n// Conditional Types\ntype ApiResponse<T> = T extends string ? string : number;\n\n// Utility Types\nPartial<T>, Required<T>, Pick<T, K>, Omit<T, K>\n```\n\nThese types help with better type safety and code organization.',
    tags: ['TypeScript', 'Types', 'Programming'],
    category: 'Code Snippets',
    source: 'TypeScript Best Practices',
    createdAt: '2024-01-17',
    updatedAt: '2024-01-17',
    pinned: true,
    wordCount: 68,
    readTime: '2 min'
  },
  {
    id: 4,
    title: 'AWS Architecture Patterns',
    content: 'Common AWS architectural patterns:\n\n1. **Three-tier Architecture:**\n   - Web tier (ALB, CloudFront)\n   - Application tier (EC2, Auto Scaling)\n   - Data tier (RDS, DynamoDB)\n\n2. **Microservices:**\n   - API Gateway\n   - Lambda functions\n   - Container services (ECS/EKS)\n\n3. **Event-driven:**\n   - SQS/SNS\n   - EventBridge\n   - Step Functions\n\nRemember: Design for failure and scalability!',
    tags: ['AWS', 'Cloud', 'Architecture'],
    category: 'Architecture',
    source: 'AWS Solutions Architecture',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-16',
    pinned: false,
    wordCount: 95,
    readTime: '3 min'
  },
  {
    id: 5,
    title: 'Interview Preparation Checklist',
    content: '**Technical Interview Prep:**\n\n✅ Data Structures:\n- Arrays, Linked Lists, Trees, Graphs\n- Hash Tables, Stacks, Queues\n\n✅ Algorithms:\n- Sorting, Searching\n- Dynamic Programming\n- Recursion, Backtracking\n\n✅ System Design:\n- Scalability concepts\n- Database design\n- Caching strategies\n\n✅ Behavioral Questions:\n- STAR method preparation\n- Project examples ready',
    tags: ['Interview', 'Career', 'Preparation'],
    category: 'Personal',
    source: 'JavaScript Interview Prep',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-20',
    pinned: true,
    wordCount: 76,
    readTime: '2 min'
  },
  {
    id: 6,
    title: 'Docker Commands Reference',
    content: 'Essential Docker commands:\n\n**Images:**\n```bash\ndocker build -t myapp .\ndocker images\ndocker rmi <image-id>\n```\n\n**Containers:**\n```bash\ndocker run -d -p 8080:80 myapp\ndocker ps\ndocker stop <container-id>\ndocker logs <container-id>\n```\n\n**Cleanup:**\n```bash\ndocker system prune\ndocker volume prune\n```',
    tags: ['Docker', 'DevOps', 'Commands'],
    category: 'Reference',
    source: 'Docker Containerization',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
    pinned: false,
    wordCount: 54,
    readTime: '1 min'
  }
];

const categories = ['All Categories', 'Course Notes', 'Research', 'Code Snippets', 'Architecture', 'Personal', 'Reference'];
const tags = ['React', 'JavaScript', 'Machine Learning', 'TypeScript', 'AWS', 'Interview', 'Docker', 'DevOps'];

export default function MyNotesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedTag, setSelectedTag] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);

  // Calculate stats
  const totalNotes = notes.length;
  const pinnedNotes = notes.filter(note => note.pinned).length;
  const totalWords = notes.reduce((acc, note) => acc + note.wordCount, 0);
  const categoriesUsed = new Set(notes.map(note => note.category)).size;

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All Categories' || note.category === selectedCategory;
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  const openNoteEditor = (note?: any) => {
    setSelectedNote(note || null);
    setShowEditor(true);
  };

  const closeNoteEditor = () => {
    setShowEditor(false);
    setSelectedNote(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 p-1">
              <div className="w-full h-full rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
                <StickyNote className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Notes</h1>
              <p className="text-slate-600 dark:text-slate-300">Organize and manage your study notes and insights</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-slate-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Notes</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{totalNotes}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-slate-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Pinned</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{pinnedNotes}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-slate-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Words</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{totalWords}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-slate-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <Tag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Categories</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{categoriesUsed}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search notes, content, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    {selectedCategory}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.map(category => (
                    <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                onClick={() => openNoteEditor()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </div>
          </div>

          {/* Tag Filter */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant={selectedTag === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag('')}
            >
              All Tags
            </Button>
            {tags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              onClick={() => openNoteEditor(note)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {note.pinned && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  <Badge variant="outline" className="text-xs">
                    {note.category}
                  </Badge>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 line-clamp-2">
                {note.title}
              </h3>

              {/* Content Preview */}
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-4">
                {note.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {note.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {note.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{note.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {note.updatedAt}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {note.readTime}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {note.source}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <StickyNote className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No notes found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {searchQuery || selectedCategory !== 'All Categories' || selectedTag 
                ? 'Try adjusting your search criteria or filters'
                : 'Create your first note to start organizing your learning'
              }
            </p>
            <Button 
              onClick={() => openNoteEditor()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Note
            </Button>
          </div>
        )}

        {/* Note Editor Modal (placeholder) */}
        {showEditor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {selectedNote ? 'Edit Note' : 'New Note'}
                  </h2>
                  <Button variant="ghost" onClick={closeNoteEditor}>
                    ✕
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <Input 
                    placeholder="Note title..."
                    defaultValue={selectedNote?.title || ''}
                    className="text-lg font-semibold"
                  />
                  <Textarea 
                    placeholder="Start writing your note..."
                    defaultValue={selectedNote?.content || ''}
                    rows={15}
                    className="resize-none"
                  />
                  
                  <div className="flex gap-4">
                    <Input placeholder="Add tags (comma separated)" />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          Category <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {categories.slice(1).map(category => (
                          <DropdownMenuItem key={category}>
                            {category}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={closeNoteEditor}>
                      Cancel
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      {selectedNote ? 'Save Changes' : 'Create Note'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 