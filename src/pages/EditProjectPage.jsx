import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { useToast } from '../components/feedback/ToastProvider';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/feedback/LoadingState';
import { handleApiError } from '../services/api';
import { currency, percent } from '../utils/formatters';
import { toDatetimeLocalValue } from '../utils/datetime';

export const EditProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { notify } = useToast();
  const { selectedProject, fetchProjectById, updateProject, loading } = useProjectStore();
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: ''
  });

  useEffect(() => {
    fetchProjectById(projectId);
  }, [fetchProjectById, projectId]);

  useEffect(() => {
    if (!selectedProject || String(selectedProject.id) !== String(projectId)) {
      return;
    }

    setForm({
      title: selectedProject.title || '',
      description: selectedProject.description || '',
      deadline: toDatetimeLocalValue(selectedProject.deadline)
    });
  }, [projectId, selectedProject]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await updateProject(projectId, {
        title: form.title.trim(),
        description: form.description.trim(),
        deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined
      });
      notify('Project updated successfully.', 'success');
      navigate(`/creator/projects/${projectId}`);
    } catch (error) {
      notify(handleApiError(error, 'Unable to update project.'), 'error');
    }
  };

  if (loading && !selectedProject) {
    return (
      <div className="page-shell py-16">
        <LoadingState label="Loading project..." />
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="page-shell py-16">
        <p className="text-slate-600">Project not found.</p>
        <Link className="mt-4 inline-block text-accent" to="/creator/dashboard">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="page-shell py-16">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Edit project</p>
        <h1 className="mt-3 section-title">Update your campaign details</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Goal amount and equity cannot be changed after listing. You can update the title,
          description, and listing deadline.
        </p>

        <div className="surface mt-8 grid gap-4 p-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Goal amount (locked)</p>
            <p className="mt-1 font-semibold text-slate-900">{currency(selectedProject.goalAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Total equity offered (locked)</p>
            <p className="mt-1 font-semibold text-slate-900">
              {percent(selectedProject.totalEquityOffered || selectedProject.equityOffered)}
            </p>
          </div>
        </div>

        <form className="surface mt-8 grid gap-6 p-8" onSubmit={handleSubmit}>
          <div>
            <label className="field-label">Project title</label>
            <input
              className="field-input"
              required
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
            />
          </div>
          <div>
            <label className="field-label">Description</label>
            <textarea
              className="field-input min-h-36"
              required
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
            />
          </div>
          <div>
            <label className="field-label">Listing deadline</label>
            <input
              className="field-input"
              min={new Date().toISOString().slice(0, 16)}
              required
              type="datetime-local"
              value={form.deadline}
              onChange={(event) =>
                setForm((current) => ({ ...current, deadline: event.target.value }))
              }
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button disabled={loading} type="submit">
              {loading ? 'Saving...' : 'Save changes'}
            </Button>
            <Link to={`/creator/projects/${projectId}`}>
              <Button tone="slate" type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
