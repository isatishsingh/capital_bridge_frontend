import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { useToast } from '../components/feedback/ToastProvider';
import { Button } from '../components/ui/Button';

export const CreateProjectPage = () => {
  const navigate = useNavigate();
  const { createProject, loading } = useProjectStore();
  const { notify } = useToast();
  const [form, setForm] = useState({
    title: '',
    description: '',
    goalAmount: '',
    totalEquityOffered: '',
    deadline: ''
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const project = await createProject({
        ...form,
        goalAmount: Number(form.goalAmount),
        totalEquityOffered: Number(form.totalEquityOffered),
        deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined
      });
      notify('Project created successfully.', 'success');
      navigate(`/creator/projects/${project.id}`);
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  return (
    <div className="page-shell py-16">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Create project</p>
        <h1 className="mt-3 section-title">Launch your campaign with investor-ready details.</h1>
        <form className="surface mt-10 grid gap-6 p-8" onSubmit={handleSubmit}>
          <div>
            <label className="field-label">Project title</label>
            <input
              className="field-input"
              required
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
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
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="field-label">Goal amount</label>
              <input
                className="field-input"
                min="1"
                required
                type="number"
                value={form.goalAmount}
                onChange={(event) =>
                  setForm((current) => ({ ...current, goalAmount: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="field-label">Total equity offered</label>
              <input
                className="field-input"
                max="100"
                min="1"
                required
                step="0.1"
                type="number"
                value={form.totalEquityOffered}
                onChange={(event) =>
                  setForm((current) => ({ ...current, totalEquityOffered: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="field-label">Deadline</label>
              <input
                className="field-input"
                min={new Date().toISOString().slice(0, 16)}
                required
                type="datetime-local"
                value={form.deadline}
                onChange={(event) => setForm((current) => ({ ...current, deadline: event.target.value }))}
              />
            </div>
          </div>
          <Button disabled={loading} type="submit">
            {loading ? 'Creating...' : 'Create project'}
          </Button>
        </form>
      </div>
    </div>
  );
};
