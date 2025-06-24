'use client';

import React, { useState, useRef } from 'react';
import { 
  Plus,
  ArrowUpDown,
  Star,
  Calendar,
  ExternalLink,
  Github,
  Edit3,
  Trash2,
  ArrowLeft,
  Save,
  X,
  Upload,
  Link2,
  Play,
  Image as ImageIcon,
  Video,
  Code,
  Eye,
  GripVertical,
  Check
} from 'lucide-react';

interface ProjectMedia {
  type: 'image' | 'video' | 'embed';
  url: string;
  caption: string;
}

interface Project {
  id: string;
  title: string;
  subtitle?: string;
  role?: string;
  date: {
    month: string;
    year: string;
  };
  description: string;
  technologies: string[];
  skillsUsed: string[];
  media: ProjectMedia[];
  repoLink?: string;
  liveDemoLink?: string;
  isFeatured: boolean;
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Automated Warehouse Sorting System',
    subtitle: 'Team Lead • 3-member robotics team',
    role: 'Automation Engineer',
    date: { month: '10', year: '2024' },
    description: 'Designed and built an automated sorting system using conveyor belts, pneumatic actuators, and vision sensors. Integrated PLCs for control logic and HMI for operator interface. System processes 500+ packages per hour with 99.2% accuracy. Reduced manual sorting time by 75% and improved workplace safety.',
    technologies: ['PLC Programming', 'Pneumatics', 'Vision Systems', 'HMI Design', 'Industrial Networks'],
    skillsUsed: ['Automation Design', 'Electrical Wiring', 'Mechanical Assembly', 'System Integration'],
    media: [
      { type: 'image', url: '/api/placeholder/600/400', caption: 'Completed sorting system' },
      { type: 'image', url: '/api/placeholder/600/400', caption: 'Control panel and HMI' }
    ],
    repoLink: 'https://github.com/username/warehouse-automation',
    liveDemoLink: 'https://demo.sorting-system.com',
    isFeatured: true
  },
  {
    id: '2',
    title: 'Autonomous Mobile Robot (AMR)',
    subtitle: 'Capstone Project',
    role: 'Robotics Engineer',
    date: { month: '08', year: '2024' },
    description: 'Developed a fully autonomous mobile robot for material transport in manufacturing environments. Features LIDAR navigation, obstacle avoidance, and wireless communication. Built custom chassis with differential drive system and integrated safety sensors. Robot can carry 50kg payload and navigate complex warehouse layouts.',
    technologies: ['ROS', 'LIDAR', 'Arduino', 'Motor Controllers', 'Wireless Communication'],
    skillsUsed: ['Robotics Programming', 'Mechanical Design', 'Sensor Integration', 'Path Planning'],
    media: [
      { type: 'image', url: '/api/placeholder/300/600', caption: 'AMR in operation' },
      { type: 'video', url: 'https://youtube.com/embed/demo', caption: 'Navigation demo' }
    ],
    repoLink: 'https://github.com/username/autonomous-mobile-robot',
    isFeatured: false
  },
  {
    id: '3',
    title: 'Custom CNC Machine Build',
    role: 'Fabrication Specialist',
    date: { month: '06', year: '2024' },
    description: 'Designed and fabricated a 3-axis CNC milling machine from scratch using aluminum extrusions and precision linear guides. Integrated stepper motors with custom driver circuits and G-code interpreter. Machine achieves ±0.05mm repeatability and can mill aluminum, wood, and plastics. Built for prototyping small mechanical parts.',
    technologies: ['CNC Programming', 'Stepper Motors', 'Linear Actuators', 'G-code', 'CAM Software'],
    skillsUsed: ['Mechanical Fabrication', 'Electronics Assembly', 'Precision Machining', 'CAD Design'],
    media: [
      { type: 'image', url: '/api/placeholder/800/500', caption: 'Completed CNC machine' }
    ],
    liveDemoLink: 'https://cnc-build-demo.com',
    isFeatured: false
  },
  {
    id: '4',
    title: 'Industrial IoT Monitoring System',
    subtitle: 'Internship Project',
    role: 'Electronics Technician',
    date: { month: '04', year: '2024' },
    description: 'Developed wireless sensor network for monitoring temperature, vibration, and pressure in manufacturing equipment. Custom PCB design with ESP32 microcontrollers and various industrial sensors. Data transmitted via LoRaWAN to cloud dashboard. System monitors 25+ machines and predicts maintenance needs.',
    technologies: ['ESP32', 'LoRaWAN', 'PCB Design', 'Industrial Sensors', 'Cloud Analytics'],
    skillsUsed: ['Circuit Design', 'Embedded Programming', 'Wireless Networks', 'Data Analysis'],
    media: [
      { type: 'image', url: '/api/placeholder/600/400', caption: 'Custom sensor nodes' },
      { type: 'image', url: '/api/placeholder/600/400', caption: 'PCB layout design' }
    ],
    repoLink: 'https://github.com/username/iot-monitoring',
    liveDemoLink: 'https://monitoring-dashboard.com',
    isFeatured: true
  },
  {
    id: '5',
    title: 'Robotic Welding Cell',
    subtitle: 'Contract Project',
    role: 'Automation Technician',
    date: { month: '02', year: '2024' },
    description: 'Programmed and commissioned a 6-axis robotic welding cell for automotive parts production. Integrated robot with welding power source, part fixtures, and safety systems. Developed welding programs for complex joint geometries and implemented quality control sensors. Cell produces 200+ parts per shift with consistent weld quality.',
    technologies: ['Robot Programming', 'MIG/TIG Welding', 'Safety Systems', 'Fixture Design', 'Quality Control'],
    skillsUsed: ['Industrial Robotics', 'Welding Technology', 'Safety Engineering', 'Process Optimization'],
    media: [
      { type: 'image', url: '/api/placeholder/600/400', caption: 'Robotic welding in action' },
      { type: 'video', url: 'https://youtube.com/embed/welding-demo', caption: 'Welding sequence demo' }
    ],
    isFeatured: false
  }
];

export default function ProfilePortfolioProjects() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const featuredProjects = projects.filter(p => p.isFeatured);
  const regularProjects = projects.filter(p => !p.isFeatured);
  const sortedProjects = [...featuredProjects, ...regularProjects];

  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      subtitle: '',
      role: '',
      date: { month: new Date().getMonth().toString().padStart(2, '0'), year: new Date().getFullYear().toString() },
      description: '',
      technologies: [],
      skillsUsed: [],
      media: [],
      repoLink: '',
      liveDemoLink: '',
      isFeatured: false
    };
    setEditingProject(newProject);
    setSelectedProject(newProject);
    setIsEditing(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject({ ...project });
    setSelectedProject(project);
    setIsEditing(true);
  };

  const handleSaveProject = () => {
    if (!editingProject || !editingProject.title || !editingProject.description) {
      return;
    }

    if (projects.find(p => p.id === editingProject.id)) {
      setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
    } else {
      setProjects([...projects, editingProject]);
    }

    setSelectedProject(editingProject);
    setIsEditing(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    setSelectedProject(null);
    setIsEditing(false);
  };

  const handleToggleFeatured = (projectId: string) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, isFeatured: !p.isFeatured } : p
    ));
  };

  const handleDragStart = (projectId: string) => {
    setDraggedItem(projectId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = projects.findIndex(p => p.id === draggedItem);
    const targetIndex = projects.findIndex(p => p.id === targetId);
    
    const newProjects = [...projects];
    const [draggedProject] = newProjects.splice(draggedIndex, 1);
    newProjects.splice(targetIndex, 0, draggedProject);
    
    setProjects(newProjects);
    setDraggedItem(null);
  };

  const handleAddMedia = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !editingProject) return;

    // In a real app, you'd upload these files and get URLs back
    const newMedia: ProjectMedia[] = Array.from(files).map(file => ({
      type: file.type.startsWith('image/') ? 'image' : 'video',
      url: URL.createObjectURL(file),
      caption: file.name
    }));

    setEditingProject({
      ...editingProject,
      media: [...editingProject.media, ...newMedia]
    });
  };

  const handleAddTechnology = (tech: string) => {
    if (!editingProject || editingProject.technologies.includes(tech)) return;
    setEditingProject({
      ...editingProject,
      technologies: [...editingProject.technologies, tech]
    });
  };

  const handleRemoveTechnology = (tech: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      technologies: editingProject.technologies.filter(t => t !== tech)
    });
  };

  if (selectedProject) {
    return (
      <div className="bg-[#1e1e1e] border border-[#3a8fb7]/30 rounded-lg overflow-hidden">
        {/* Detail Panel Header */}
        <div className="bg-gradient-to-r from-[#3a8fb7]/20 to-[#6c3e9e]/20 border-b border-[#3a8fb7]/30 p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedProject(null);
                setIsEditing(false);
                setEditingProject(null);
              }}
              className="flex items-center gap-2 text-[#3a8fb7] hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Portfolio
            </button>
            
            {!isEditing && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditProject(selectedProject)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#3a8fb7] hover:bg-[#3a8fb7]/80 text-white rounded-lg transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProject(selectedProject.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel Content */}
        <div className="p-6">
          {isEditing && editingProject ? (
            // Edit Form
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#262626] border border-[#3a8fb7]/30 rounded-lg text-white focus:border-[#3a8fb7] focus:outline-none"
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={editingProject.subtitle || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-[#262626] border border-[#3a8fb7]/30 rounded-lg text-white focus:border-[#3a8fb7] focus:outline-none"
                    placeholder="e.g., Team Lead • 4-member agile team"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Role
                  </label>
                  <input
                    type="text"
                    value={editingProject.role || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                    className="w-full px-3 py-2 bg-[#262626] border border-[#3a8fb7]/30 rounded-lg text-white focus:border-[#3a8fb7] focus:outline-none"
                    placeholder="e.g., Full-Stack Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Completion Date
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={editingProject.date.month}
                      onChange={(e) => setEditingProject({ 
                        ...editingProject, 
                        date: { ...editingProject.date, month: e.target.value }
                      })}
                      className="flex-1 px-3 py-2 bg-[#262626] border border-[#3a8fb7]/30 rounded-lg text-white focus:border-[#3a8fb7] focus:outline-none"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={(i + 1).toString().padStart(2, '0')}>
                          {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                    <select
                      value={editingProject.date.year}
                      onChange={(e) => setEditingProject({ 
                        ...editingProject, 
                        date: { ...editingProject.date, year: e.target.value }
                      })}
                      className="flex-1 px-3 py-2 bg-[#262626] border border-[#3a8fb7]/30 rounded-lg text-white focus:border-[#3a8fb7] focus:outline-none"
                    >
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i} value={(new Date().getFullYear() - i).toString()}>
                          {new Date().getFullYear() - i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description * (up to 300 words)
                </label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 bg-[#262626] border border-[#3a8fb7]/30 rounded-lg text-white focus:border-[#3a8fb7] focus:outline-none resize-none"
                  placeholder="Describe your project, your role, and the impact it had..."
                />
                <div className="text-right text-sm text-gray-400 mt-1">
                  {editingProject.description.split(' ').length}/300 words
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Technologies Used
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editingProject.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#3a8fb7]/20 text-[#3a8fb7] rounded-full text-sm"
                    >
                      {tech}
                      <button
                        onClick={() => handleRemoveTechnology(tech)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add technology (press Enter)"
                  className="w-full px-3 py-2 bg-[#262626] border border-[#3a8fb7]/30 rounded-lg text-white focus:border-[#3a8fb7] focus:outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = e.currentTarget.value.trim();
                      if (value) {
                        handleAddTechnology(value);
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Repository Link
                  </label>
                  <input
                    type="url"
                    value={editingProject.repoLink || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, repoLink: e.target.value })}
                    className="w-full px-3 py-2 bg-[#262626] border border-[#3a8fb7]/30 rounded-lg text-white focus:border-[#3a8fb7] focus:outline-none"
                    placeholder="https://github.com/username/project"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Live Demo Link
                  </label>
                  <input
                    type="url"
                    value={editingProject.liveDemoLink || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, liveDemoLink: e.target.value })}
                    className="w-full px-3 py-2 bg-[#262626] border border-[#3a8fb7]/30 rounded-lg text-white focus:border-[#3a8fb7] focus:outline-none"
                    placeholder="https://demo.project.com"
                  />
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditingProject({ ...editingProject, isFeatured: !editingProject.isFeatured })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    editingProject.isFeatured
                      ? 'bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] text-white'
                      : 'bg-[#262626] border border-[#3a8fb7]/30 text-gray-300 hover:border-[#3a8fb7]/50'
                  }`}
                >
                  <Star className={`h-4 w-4 ${editingProject.isFeatured ? 'fill-current' : ''}`} />
                  {editingProject.isFeatured ? 'Featured Project' : 'Mark as Featured'}
                </button>
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Media
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {editingProject.media.map((media, index) => (
                    <div key={index} className="relative bg-[#262626] rounded-lg overflow-hidden">
                      {media.type === 'image' && (
                        <img src={media.url} alt={media.caption} className="w-full h-32 object-cover" />
                      )}
                      {media.type === 'video' && (
                        <div className="w-full h-32 bg-[#262626] flex items-center justify-center">
                          <Video className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <button
                        onClick={() => setEditingProject({
                          ...editingProject,
                          media: editingProject.media.filter((_, i) => i !== index)
                        })}
                        className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddMedia}
                  className="flex items-center gap-2 px-4 py-2 bg-[#262626] border border-[#3a8fb7]/30 text-gray-300 hover:border-[#3a8fb7]/50 hover:text-white rounded-lg transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Add Media
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Save/Cancel Buttons */}
              <div className="flex items-center gap-3 pt-6 border-t border-[#3a8fb7]/30">
                <button
                  onClick={handleSaveProject}
                  disabled={!editingProject.title || !editingProject.description}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  Save Project
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditingProject(null);
                    if (!projects.find(p => p.id === selectedProject.id)) {
                      setSelectedProject(null);
                    }
                  }}
                  className="px-6 py-2 bg-[#262626] border border-[#3a8fb7]/30 text-gray-300 hover:border-[#3a8fb7]/50 hover:text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="space-y-6">
              {/* Project Header */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-2xl font-bold text-white">{selectedProject.title}</h1>
                  <button
                    onClick={() => handleToggleFeatured(selectedProject.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedProject.isFeatured
                        ? 'bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] text-white'
                        : 'bg-[#262626] border border-[#3a8fb7]/30 text-gray-300 hover:border-[#3a8fb7]/50'
                    }`}
                  >
                    <Star className={`h-5 w-5 ${selectedProject.isFeatured ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-400">
                  {selectedProject.role && (
                    <span className="flex items-center gap-1">
                      <Code className="h-4 w-4" />
                      {selectedProject.role}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(parseInt(selectedProject.date.year), parseInt(selectedProject.date.month) - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  {selectedProject.isFeatured && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] text-white rounded-full text-xs">
                      <Star className="h-3 w-3 fill-current" />
                      Featured
                    </span>
                  )}
                </div>
                
                {selectedProject.subtitle && (
                  <p className="text-gray-300 mt-2">{selectedProject.subtitle}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                <p className="text-gray-300 leading-relaxed">{selectedProject.description}</p>
              </div>

              {/* Technologies */}
              {selectedProject.technologies.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#3a8fb7]/20 text-[#3a8fb7] rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Used */}
              {selectedProject.skillsUsed.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Skills Applied</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.skillsUsed.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#6c3e9e]/20 text-[#6c3e9e] rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Media Gallery */}
              {selectedProject.media.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Media</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProject.media.map((media, index) => (
                      <div key={index} className="bg-[#262626] rounded-lg overflow-hidden">
                        {media.type === 'image' && (
                          <img src={media.url} alt={media.caption} className="w-full h-48 object-cover" />
                        )}
                        {media.type === 'video' && (
                          <div className="w-full h-48 bg-[#262626] flex items-center justify-center">
                            <Video className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        {media.caption && (
                          <div className="p-3">
                            <p className="text-sm text-gray-400">{media.caption}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {(selectedProject.repoLink || selectedProject.liveDemoLink) && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Links</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.repoLink && (
                      <a
                        href={selectedProject.repoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#262626] border border-[#3a8fb7]/30 text-gray-300 hover:border-[#3a8fb7]/50 hover:text-white rounded-lg transition-colors"
                      >
                        <Github className="h-4 w-4" />
                        View Code
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {selectedProject.liveDemoLink && (
                      <a
                        href={selectedProject.liveDemoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] text-white rounded-lg hover:shadow-lg transition-all"
                      >
                        <Eye className="h-4 w-4" />
                        Live Demo
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#1e1e1e] border border-[#3a8fb7]/30 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Portfolio & Projects</h2>
            <p className="text-gray-400">
              Showcase your best work: add code repos, write-ups, demos, images or videos. Employers will see this when you connect.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsReorderMode(!isReorderMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isReorderMode
                  ? 'bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] text-white'
                  : 'bg-[#262626] border border-[#3a8fb7]/30 text-gray-300 hover:border-[#3a8fb7]/50 hover:text-white'
              }`}
            >
              {isReorderMode ? <Check className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
              {isReorderMode ? 'Done' : 'Reorder'}
            </button>
            <button
              onClick={handleAddProject}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4" />
              Add New Project
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProjects.map((project) => (
          <div
            key={project.id}
            draggable={isReorderMode}
            onDragStart={() => handleDragStart(project.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, project.id)}
            className={`bg-[#1e1e1e] border border-[#3a8fb7]/30 rounded-lg overflow-hidden hover:border-[#3a8fb7]/50 hover:shadow-lg transition-all group ${
              isReorderMode ? 'cursor-move' : 'cursor-pointer'
            } ${draggedItem === project.id ? 'opacity-50' : ''}`}
            onClick={() => !isReorderMode && setSelectedProject(project)}
          >
            {/* Project Thumbnail */}
            <div className="relative h-48 bg-[#262626] overflow-hidden">
              {project.media.length > 0 ? (
                project.media[0].type === 'image' ? (
                  <img 
                    src={project.media[0].url} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="h-12 w-12 text-gray-400" />
                  </div>
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Code className="h-12 w-12 text-gray-400" />
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {isReorderMode ? (
                  <GripVertical className="h-8 w-8 text-white" />
                ) : (
                  <div className="text-white text-center">
                    <Eye className="h-8 w-8 mx-auto mb-2" />
                    <span className="text-sm">View Details</span>
                  </div>
                )}
              </div>

              {/* Featured Badge */}
              {project.isFeatured && (
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] text-white rounded-full text-xs">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </span>
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">{project.title}</h3>
              {project.subtitle && (
                <p className="text-sm text-gray-400 mb-2 line-clamp-1">{project.subtitle}</p>
              )}
              
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                {project.role && (
                  <>
                    <span>{project.role}</span>
                    <span>•</span>
                  </>
                )}
                <span>
                  {new Date(parseInt(project.date.year), parseInt(project.date.month) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>

              <p className="text-sm text-gray-300 mb-3 line-clamp-2">{project.description}</p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1">
                {project.technologies.slice(0, 3).map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-[#3a8fb7]/20 text-[#3a8fb7] rounded text-xs"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-2 py-1 bg-[#262626] text-gray-400 rounded text-xs">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="col-span-full">
            <div className="bg-[#1e1e1e] border border-[#3a8fb7]/30 rounded-lg p-12 text-center">
              <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
              <p className="text-gray-400 mb-6">Start building your portfolio by adding your first project.</p>
              <button
                onClick={handleAddProject}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3a8fb7] to-[#6c3e9e] text-white rounded-lg hover:shadow-lg transition-all mx-auto"
              >
                <Plus className="h-5 w-5" />
                Add Your First Project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 