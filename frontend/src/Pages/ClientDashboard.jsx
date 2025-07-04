import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ClientDashboard = () => {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postForm, setPostForm] = useState({
    title: '',
    description: '',
    requiredSkills: [],
    customSkills: '',
    category: '',
    budget: ''
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:3000/projects');
        // Filter projects posted by this client
        const clientProjects = res.data.filter(
          (proj) => proj.postedBy?.email === user.email
        );
        setProjects(clientProjects);
      } catch (err) {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.email) fetchProjects();
  }, [user]);

  const refreshProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/projects');
      const clientProjects = res.data.filter(
        (proj) => proj.postedBy?.email === user.email
      );
      setProjects(clientProjects);
    } catch (err) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplicants = async (project) => {
    setSelectedProject(project);
    setShowApplicantsModal(true);
    setApplicantsLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/client/applicants/${project._id}`);
      setApplicants(res.data);
    } catch (err) {
      setApplicants([]);
    } finally {
      setApplicantsLoading(false);
    }
  };

  const closeApplicantsModal = () => {
    setShowApplicantsModal(false);
    setApplicants([]);
    setSelectedProject(null);
  };

  const handleAcceptApplicant = async (freelancerId) => {
    try {
      await axios.put(`http://localhost:3000/client/select/${selectedProject._id}/${freelancerId}`, {}, { withCredentials: true });
      toast.success('Freelancer assigned!');
      closeApplicantsModal();
      refreshProjects();
    } catch (err) {
      toast.error('Failed to assign freelancer.');
    }
  };

  const handlePostProject = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      // Merge dropdown and custom skills
      const customSkillsArr = (postForm.customSkills || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const allSkills = [
        ...(Array.isArray(postForm.requiredSkills) ? postForm.requiredSkills : []),
        ...customSkillsArr
      ];
      const payload = {
        title: postForm.title,
        description: postForm.description,
        requiredSkills: allSkills,
        category: postForm.category,
        budget: postForm.budget
      };
      await axios.post('http://localhost:3000/client/project', payload, { withCredentials: true });
      toast.success('Project posted!');
      setShowPostModal(false);
      setPostForm({ title: '', description: '', requiredSkills: [], customSkills: '', category: '', budget: '' });
      refreshProjects();
    } catch (err) {
      toast.error('Failed to post project.');
    } finally {
      setPosting(false);
    }
  };

  const handleEditProject = (project) => {
    setEditForm({
      ...project,
      requiredSkills: project.requiredSkills || [],
      customSkills: '', // for new custom skills
    });
    setShowEditModal(true);
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setEditing(true);
    try {
      // Merge dropdown and custom skills
      const customSkillsArr = (editForm.customSkills || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const allSkills = [
        ...(Array.isArray(editForm.requiredSkills) ? editForm.requiredSkills : []),
        ...customSkillsArr
      ];
      const payload = {
        title: editForm.title,
        description: editForm.description,
        requiredSkills: allSkills,
        category: editForm.category,
        budget: editForm.budget
      };
      await axios.put(`http://localhost:3000/projects/${editForm._id}`, payload, { withCredentials: true });
      toast.success('Project updated!');
      setShowEditModal(false);
      setEditForm(null);
      refreshProjects();
    } catch (err) {
      toast.error('Failed to update project.');
    } finally {
      setEditing(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await axios.delete(`http://localhost:3000/projects/${projectId}`, { withCredentials: true });
      toast.success('Project deleted!');
      refreshProjects();
    } catch (err) {
      toast.error('Failed to delete project.');
    }
  };

  if (!isLoggedIn) {
    return <p className="p-8 text-center">Please login first.</p>;
  }

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  // Group projects by status
  const unassignedProjects = projects.filter(p => !p.assignedTo);
  const inProgressProjects = projects.filter(p => p.assignedTo && p.status === 'in-progress');
  const completedProjects = projects.filter(p => p.assignedTo && p.status === 'completed');

  // Summary counts
  const total = projects.length;
  const active = projects.filter((p) => p.status === 'open').length;
  const inProgress = inProgressProjects.length;
  const completed = completedProjects.length;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Client Info & Post Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome, {user.companyName || user.name}!</h1>
          <p className="text-gray-700">Email: {user.email}</p>
        </div>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          onClick={() => setShowPostModal(true)}
        >
          Post New Project
        </button>
      </div>

      {/* Post Project Modal */}
      {showPostModal && (
        <PostProjectModal
          open={showPostModal}
          onClose={() => setShowPostModal(false)}
          form={postForm}
          setForm={setPostForm}
          onSubmit={handlePostProject}
          posting={posting}
        />
      )}

      {/* Summary Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <SummaryCard label="Total Projects" value={total} color="bg-blue-100 text-blue-700" />
        <SummaryCard label="Active" value={active} color="bg-green-100 text-green-700" />
        <SummaryCard label="In Progress" value={inProgress} color="bg-yellow-100 text-yellow-700" />
        <SummaryCard label="Completed" value={completed} color="bg-gray-200 text-gray-700" />
      </div>

      {/* Unassigned Projects */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Unassigned Projects</h2>
        {unassignedProjects.length === 0 ? (
          <div className="text-gray-500">No unassigned projects.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unassignedProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onViewApplicants={() => handleViewApplicants(project)}
                showApplicantsButton
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        )}
      </div>

      {/* In Progress Projects */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">In Progress Projects</h2>
        {inProgressProjects.length === 0 ? (
          <div className="text-gray-500">No in-progress projects.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                showAssignedFreelancer
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        )}
      </div>

      {/* Completed Projects */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Completed Projects</h2>
        {completedProjects.length === 0 ? (
          <div className="text-gray-500">No completed projects.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                showAssignedFreelancer
              />
            ))}
          </div>
        )}
      </div>

      {/* Applicants Modal */}
      {showApplicantsModal && (
        <ApplicantsModal
          open={showApplicantsModal}
          onClose={closeApplicantsModal}
          applicants={applicants}
          loading={applicantsLoading}
          project={selectedProject}
          onAccept={handleAcceptApplicant}
        />
      )}

      {/* Edit Project Modal */}
      {showEditModal && (
        <EditProjectModal
          open={showEditModal}
          onClose={() => { setShowEditModal(false); setEditForm(null); }}
          form={editForm}
          setForm={setEditForm}
          onSubmit={handleUpdateProject}
          editing={editing}
        />
      )}
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ label, value, color }) => (
  <div className={`rounded-lg p-5 shadow ${color} flex flex-col items-center`}>
    <span className="text-lg font-medium mb-1">{label}</span>
    <span className="text-3xl font-bold">{value}</span>
  </div>
);

// Project Card Component
const ProjectCard = ({ project, onViewApplicants, showApplicantsButton, showAssignedFreelancer, onEdit, onDelete }) => {
  const canEdit = !project.assignedTo || project.status === 'in-progress';
  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex flex-col h-full">
      <h3 className="text-xl font-bold text-blue-700 mb-2">{project.title}</h3>
      <p className="text-gray-700 mb-2 line-clamp-3">{project.description}</p>
      <div className="mb-2">
        <span className="font-semibold">Skills:</span> {project.requiredSkills?.join(', ') || 'N/A'}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Budget:</span> ₹{project.budget}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Status:</span> {project.status}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Applicants:</span> {project.applications?.length || 0}
      </div>
      {showAssignedFreelancer && project.assignedTo && (
        <div className="mb-2">
          <span className="font-semibold">Assigned Freelancer:</span>
          <FreelancerInfo freelancerId={project.assignedTo} />
        </div>
      )}
      <div className="flex gap-2 mt-auto">
        {showApplicantsButton && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={onViewApplicants}
          >
            View Applicants
          </button>
        )}
        {canEdit && onEdit && (
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            onClick={() => onEdit(project)}
          >
            Edit
          </button>
        )}
        {canEdit && onDelete && (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            onClick={() => onDelete(project._id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

// Freelancer Info Component (fetches freelancer details by ID)
const FreelancerInfo = ({ freelancerId }) => {
  const [freelancer, setFreelancer] = useState(null);
  useEffect(() => {
    const fetchFreelancer = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/freelancer/${freelancerId}`);
        setFreelancer(res.data);
      } catch (err) {
        setFreelancer(null);
      }
    };
    if (freelancerId) fetchFreelancer();
  }, [freelancerId]);

  if (!freelancer) return <span className="ml-1 text-gray-500">(loading...)</span>;
  return (
    <span className="ml-1 text-green-700">{freelancer.name} ({freelancer.email})</span>
  );
};

// Applicants Modal Component
const ApplicantsModal = ({ open, onClose, applicants, loading, project, onAccept }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Applicants for: {project?.title}</h2>
        {loading ? (
          <div className="text-center py-8">Loading applicants...</div>
        ) : applicants.length === 0 ? (
          <div className="text-center text-gray-500">No applicants yet.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {applicants.map((applicant) => (
              <li key={applicant._id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="font-semibold text-lg">{applicant.name}</span>
                  <span className="text-gray-600 ml-2">{applicant.email}</span>
                </div>
                {onAccept && (
                  <button
                    className="mt-2 md:mt-0 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    onClick={() => onAccept(applicant._id)}
                  >
                    Accept
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const CATEGORY_OPTIONS = [
  "Writing & Translation",
  "Programming & Development",
  "Administrative & Secretarial",
  "Design & Art",
  "Business & Finance",
  "Sales & Marketing",
  "Others"
];

const SKILL_OPTIONS = [
  "JavaScript", "Python", "Java", "React", "Node.js", "UI/UX", "Copywriting", "Data Entry", "Photoshop", "Accounting", "SEO", "Marketing"
];

// Post Project Modal Component
const PostProjectModal = ({ open, onClose, form, setForm, onSubmit, posting }) => {
  if (!open) return null;
  // For skills, keep as array
  const handleSkillChange = (e) => {
    const { options } = e.target;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setForm({ ...form, requiredSkills: selected });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Post a New Project</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              <span className="font-bold mr-2">1.</span> Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-2 border-blue-400 focus:border-blue-600 outline-none px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              <span className="font-bold mr-2">2.</span> Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-2 border-blue-400 focus:border-blue-600 outline-none px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700 mb-1">
              <span className="font-bold mr-2">3.</span> Required Skills
            </label>
            <select
              id="requiredSkills"
              name="requiredSkills"
              multiple
              value={form.requiredSkills}
              onChange={handleSkillChange}
              className="mt-1 block w-full rounded-md border-2 border-blue-400 focus:border-blue-600 outline-none px-3 py-2"
            >
              {SKILL_OPTIONS.map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Add custom skills, comma separated"
              className="mt-2 block w-full rounded-md border-2 border-blue-200 focus:border-blue-400 outline-none px-3 py-2"
              value={form.customSkills || ''}
              onChange={e => setForm({ ...form, customSkills: e.target.value })}
            />
            <span className="text-xs text-gray-500">Hold Ctrl (Windows) or Cmd (Mac) to select multiple skills.</span>
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              <span className="font-bold mr-2">4.</span> Category
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-2 border-blue-400 focus:border-blue-600 outline-none px-3 py-2"
              required
            >
              <option value="">Select a category</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
              <span className="font-bold mr-2">5.</span> Budget
            </label>
            <input
              type="text"
              id="budget"
              name="budget"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              className="mt-1 block w-full rounded-md border-2 border-blue-400 focus:border-blue-600 outline-none px-3 py-2"
              required
            />
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              disabled={posting}
            >
              {posting ? 'Posting...' : 'Post Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Project Modal Component
const EditProjectModal = ({ open, onClose, form, setForm, onSubmit, editing }) => {
  if (!open) return null;
  // For skills, keep as array
  const handleSkillChange = (e) => {
    const { options } = e.target;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setForm({ ...form, requiredSkills: selected });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Edit Project</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
              <span className="font-bold mr-2">1.</span> Title
            </label>
            <input
              type="text"
              id="edit-title"
              name="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-2 border-blue-400 focus:border-blue-600 outline-none px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
              <span className="font-bold mr-2">2.</span> Description
            </label>
            <textarea
              id="edit-description"
              name="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-2 border-blue-400 focus:border-blue-600 outline-none px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="edit-requiredSkills" className="block text-sm font-medium text-gray-700 mb-1">
              <span className="font-bold mr-2">3.</span> Required Skills
            </label>
            <select
              id="edit-requiredSkills"
              name="requiredSkills"
              multiple
              value={form.requiredSkills}
              onChange={handleSkillChange}
              className="mt-1 block w-full rounded-md border-2 border-blue-400 focus:border-blue-600 outline-none px-3 py-2"
            >
              {SKILL_OPTIONS.map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Add custom skills, comma separated"
              className="mt-2 block w-full rounded-md border-2 border-blue-200 focus:border-blue-400 outline-none px-3 py-2"
              value={form.customSkills || ''}
              onChange={e => setForm({ ...form, customSkills: e.target.value })}
            />
            <span className="text-xs text-gray-500">Hold Ctrl (Windows) or Cmd (Mac) to select multiple skills.</span>
          </div>
          <div className="mb-4">
            <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-1">
              <span className="font-bold mr-2">4.</span> Category
            </label>
            <select
              id="edit-category"
              name="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-2 border-blue-400 focus:border-blue-600 outline-none px-3 py-2"
              required
            >
              <option value="">Select a category</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="edit-budget" className="block text-sm font-medium text-gray-700 mb-1">
              <span className="font-bold mr-2">5.</span> Budget
            </label>
            <input
              type="text"
              id="edit-budget"
              name="budget"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              className="mt-1 block w-full rounded-md border-2 border-blue-400 focus:border-blue-600 outline-none px-3 py-2"
              required
            />
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              disabled={editing}
            >
              {editing ? 'Updating...' : 'Update Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


