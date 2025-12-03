import React, { useState } from 'react';
import { FolderPlus, GitBranch } from 'lucide-react';
import { projectService } from '../../../services/projectService';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import CustomDropdown from '../../../components/ui/CustomDropdown';
import { Project } from './ProjectCard';
import { toast } from 'sonner';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: Project) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onProjectCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [framework, setFramework] = useState('react');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [repository, setRepository] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newProject = await projectService.createProject({
        name,
        description,
        framework: framework as any,
        repoUrl: repository
      });
      toast.success('Project created successfully');
      onProjectCreated(newProject);
      onClose();
      // Reset form
      setName('');
      setDescription('');
      setFramework('react');
      setRepository('');
    } catch (error) {
      console.error('Failed to create project:', error);
      toast.error('Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-sm">
            <FolderPlus className="h-5 w-5 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Create Project</h2>
        </div>
      }
    >
      <div className="p-6 pt-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <Input
              label="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Awesome Project"
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-400">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the project"
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-400">Framework</label>
              <CustomDropdown
                value={framework}
                onChange={(value) => setFramework(value)}
                options={[
                  { value: 'react', label: 'React' },
                  { value: 'node', label: 'Node.js' },
                  { value: 'python', label: 'Python' },
                  { value: 'go', label: 'Go' }
                ]}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-400">Repository URL</label>
              <div className="relative">
                <GitBranch className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="url"
                  value={repository}
                  onChange={(e) => setRepository(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-sm pl-9 pr-3 py-2 text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-600"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={<FolderPlus className="h-4 w-4" />}
            >
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateProjectModal;

