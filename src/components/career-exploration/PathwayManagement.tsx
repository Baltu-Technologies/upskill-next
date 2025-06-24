'use client';

import React, { useState } from 'react';
import { 
  Settings,
  Trash2,
  Star,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Edit3,
  Archive,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Target,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  X,
  Save
} from 'lucide-react';
import { CareerPathway } from '../../data/mockCareerData';

interface PathwayManagementProps {
  pathways: CareerPathway[];
  onUpdatePathway: (pathwayId: string, updates: Partial<CareerPathway>) => Promise<void>;
  onRemovePathway: (pathwayId: string) => Promise<void>;
  onReorderPathways: (reorderedIds: string[]) => Promise<void>;
  className?: string;
}

// Priority Management Modal
const PriorityManagementModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  pathways: CareerPathway[];
  onReorder: (reorderedIds: string[]) => Promise<void>;
}> = ({ isOpen, onClose, pathways, onReorder }) => {
  const [reorderedPathways, setReorderedPathways] = useState(pathways);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const movePathway = (fromIndex: number, toIndex: number) => {
    const newOrder = [...reorderedPathways];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    setReorderedPathways(newOrder);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onReorder(reorderedPathways.map(p => p.id));
      onClose();
    } catch (error) {
      console.error('Failed to reorder pathways:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] border border-[#3a8fb7] rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Manage Pathway Priority</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {reorderedPathways.map((pathway, index) => (
            <div key={pathway.id} className="flex items-center space-x-3 p-3 bg-[#262626] border border-[#3a8fb7]/30 rounded-lg">
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => movePathway(index, Math.max(0, index - 1))}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-white hover:bg-[#3a8fb7]/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => movePathway(index, Math.min(reorderedPathways.length - 1, index + 1))}
                  disabled={index === reorderedPathways.length - 1}
                  className="p-1 text-gray-400 hover:text-white hover:bg-[#3a8fb7]/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-white">{pathway.title}</h4>
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <span className={`px-2 py-1 rounded-full text-xs border ${
                    pathway.priority === 'high' ? 'bg-red-900/50 text-red-300 border-red-500/30' :
                    pathway.priority === 'medium' ? 'bg-yellow-900/50 text-yellow-300 border-yellow-500/30' :
                    'bg-gray-900/50 text-gray-300 border-gray-500/30'
                  }`}>
                    {pathway.priority} priority
                  </span>
                  <span>{Math.round(pathway.overallProgress)}% complete</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-400">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] text-white rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center transition-all"
          >
            {saving ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Priority Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Individual Pathway Management Card
const ManagementPathwayCard: React.FC<{
  pathway: CareerPathway;
  onUpdatePathway: (pathwayId: string, updates: Partial<CareerPathway>) => Promise<void>;
  onRemovePathway: (pathwayId: string) => Promise<void>;
}> = ({ pathway, onUpdatePathway, onRemovePathway }) => {
  const [showActions, setShowActions] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus: CareerPathway['status']) => {
    setUpdating(true);
    try {
      await onUpdatePathway(pathway.id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handlePriorityChange = async (newPriority: CareerPathway['priority']) => {
    setUpdating(true);
    try {
      await onUpdatePathway(pathway.id, { priority: newPriority });
    } catch (error) {
      console.error('Failed to update priority:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setUpdating(true);
    try {
      await onRemovePathway(pathway.id);
    } catch (error) {
      console.error('Failed to remove pathway:', error);
      setUpdating(false);
    }
  };

  const getStatusIcon = (status: CareerPathway['status']) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4 text-green-400" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-400" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: CareerPathway['status']) => {
    switch (status) {
      case 'active':
        return 'border-green-500/30 bg-green-900/10';
      case 'paused':
        return 'border-yellow-500/30 bg-yellow-900/10';
      case 'completed':
        return 'border-blue-500/30 bg-blue-900/10';
      default:
        return 'border-[#3a8fb7]/30 bg-[#262626]';
    }
  };

  return (
    <div className={`bg-[#262626] rounded-lg border-2 p-4 transition-all hover:border-[#3a8fb7]/50 hover:shadow-lg ${getStatusColor(pathway.status)}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            {getStatusIcon(pathway.status)}
            <h3 className="font-semibold text-white">{pathway.title}</h3>
          </div>
          <p className="text-sm text-gray-400 mb-2">{pathway.description}</p>
          
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <span className="flex items-center">
              <Target className="w-3 h-3 mr-1" />
              {Math.round(pathway.overallProgress)}% complete
            </span>
            <span className="flex items-center">
              <Award className="w-3 h-3 mr-1" />
              {pathway.completedCourses}/{pathway.totalCourses} courses
            </span>
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {pathway.estimatedDuration}
            </span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#3a8fb7]/20 rounded-lg transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showActions && (
            <div className="absolute right-0 top-10 bg-[#1e1e1e] border border-[#3a8fb7]/30 rounded-lg shadow-lg z-10 min-w-48">
              <div className="py-1">
                {/* Priority Management */}
                <div className="px-3 py-2 border-b border-[#3a8fb7]/30">
                  <span className="text-sm font-medium text-white block mb-2">Priority</span>
                  <div className="space-y-1">
                    {['high', 'medium', 'low'].map((priority) => (
                      <button
                        key={priority}
                        onClick={() => handlePriorityChange(priority as CareerPathway['priority'])}
                        disabled={updating || pathway.priority === priority}
                        className={`w-full text-left px-2 py-1 text-xs rounded flex items-center transition-colors ${
                          pathway.priority === priority 
                            ? 'bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] text-white' 
                            : 'text-gray-300 hover:bg-[#3a8fb7]/20 hover:text-white'
                        } disabled:opacity-50`}
                      >
                        <Star className={`w-3 h-3 mr-2 ${
                          priority === 'high' ? 'text-red-400' :
                          priority === 'medium' ? 'text-yellow-400' :
                          'text-gray-400'
                        }`} />
                        <span className="capitalize">{priority} Priority</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Management */}
                <div className="px-3 py-2 border-b border-[#3a8fb7]/30">
                  <span className="text-sm font-medium text-white block mb-2">Status</span>
                  <div className="space-y-1">
                    {['active', 'paused', 'completed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status as CareerPathway['status'])}
                        disabled={updating || pathway.status === status}
                        className={`w-full text-left px-2 py-1 text-xs rounded flex items-center transition-colors ${
                          pathway.status === status 
                            ? 'bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] text-white' 
                            : 'text-gray-300 hover:bg-[#3a8fb7]/20 hover:text-white'
                        } disabled:opacity-50`}
                      >
                        {getStatusIcon(status as CareerPathway['status'])}
                        <span className="ml-2 capitalize">{status}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="px-3 py-2">
                  <button
                    onClick={() => {
                      setConfirmDelete(true);
                      setShowActions(false);
                    }}
                    className="w-full text-left px-2 py-1 text-xs text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded flex items-center transition-colors"
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Remove Pathway
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
        <div 
          className="bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] h-2 rounded-full transition-all duration-300"
          style={{ width: `${pathway.overallProgress}%` }}
        />
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] border border-[#3a8fb7] rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Remove Pathway</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Are you sure you want to remove "{pathway.title}" from your saved pathways? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={updating}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 transition-all"
              >
                {updating ? 'Removing...' : 'Remove Pathway'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Pathway Management Component
export const PathwayManagement: React.FC<PathwayManagementProps> = ({
  pathways,
  onUpdatePathway,
  onRemovePathway,
  onReorderPathways,
  className = ''
}) => {
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | CareerPathway['status']>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'progress' | 'name' | 'dateAdded'>('priority');

  const filteredPathways = pathways.filter(pathway => 
    filterStatus === 'all' || pathway.status === filterStatus
  );

  const sortedPathways = [...filteredPathways].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'progress':
        return b.overallProgress - a.overallProgress;
      case 'name':
        return a.title.localeCompare(b.title);
      case 'dateAdded':
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      default:
        return 0;
    }
  });

  const stats = {
    total: pathways.length,
    active: pathways.filter(p => p.status === 'active').length,
    paused: pathways.filter(p => p.status === 'paused').length,
    completed: pathways.filter(p => p.status === 'completed').length,
    avgProgress: pathways.length > 0 ? Math.round(pathways.reduce((sum, p) => sum + p.overallProgress, 0) / pathways.length) : 0
  };

  if (pathways.length === 0) {
    return (
      <div className={`bg-[#262626] rounded-lg border border-[#3a8fb7]/30 p-8 text-center ${className}`}>
        <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No Saved Pathways</h3>
        <p className="text-gray-400">
          Save some career pathways to start managing your learning journey.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Stats */}
      <div className="bg-[#262626] rounded-lg border border-[#3a8fb7]/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Settings className="w-5 h-5 mr-2 text-[#3a8fb7]" />
            Manage Pathways
          </h2>
          
          <button
            onClick={() => setShowPriorityModal(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] text-white rounded-lg hover:opacity-90 transition-all"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Manage Priority Order
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="text-center p-3 bg-[#1e1e1e] border border-[#3a8fb7]/30 rounded-lg">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
          <div className="text-center p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{stats.active}</div>
            <div className="text-xs text-green-400">Active</div>
          </div>
          <div className="text-center p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">{stats.paused}</div>
            <div className="text-xs text-yellow-400">Paused</div>
          </div>
          <div className="text-center p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{stats.completed}</div>
            <div className="text-xs text-blue-400">Completed</div>
          </div>
          <div className="text-center p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{stats.avgProgress}%</div>
            <div className="text-xs text-purple-400">Avg Progress</div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-300">Filter:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="text-sm bg-[#1e1e1e] border border-[#3a8fb7]/30 text-white rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#3a8fb7] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-300">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm bg-[#1e1e1e] border border-[#3a8fb7]/30 text-white rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#3a8fb7] focus:border-transparent"
            >
              <option value="priority">Priority</option>
              <option value="progress">Progress</option>
              <option value="name">Name</option>
              <option value="dateAdded">Date Added</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pathway Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sortedPathways.map((pathway) => (
          <ManagementPathwayCard
            key={pathway.id}
            pathway={pathway}
            onUpdatePathway={onUpdatePathway}
            onRemovePathway={onRemovePathway}
          />
        ))}
      </div>

      {/* Priority Management Modal */}
      <PriorityManagementModal
        isOpen={showPriorityModal}
        onClose={() => setShowPriorityModal(false)}
        pathways={pathways}
        onReorder={onReorderPathways}
      />
    </div>
  );
};

export default PathwayManagement; 