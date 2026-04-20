import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { compactCurrency, percent, progressFromAmounts } from '../../utils/formatters';

export const ProjectCard = ({ project, fillHeight = false }) => {
  const progress = progressFromAmounts(project.currentFunding, project.goalAmount);

  return (
    <Card
      className={`flex flex-col ${fillHeight ? 'h-full min-h-0 justify-between' : ''}`}
    >
      <div>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
              {project.category || 'Startup project'}
            </p>
            <h3 className="mt-2 text-2xl font-bold text-ink">{project.title}</h3>
          </div>
          <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
            {project.equityOffered || 0}% equity
          </div>
        </div>

        <p className="line-clamp-3 text-sm leading-7 text-slate-600">{project.description}</p>

        <div className="mt-6 space-y-3">
          <ProgressBar value={progress} />
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>{compactCurrency(project.currentFunding)} raised</span>
            <span>{compactCurrency(project.goalAmount)} goal</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-slate-500">Progress</p>
            <p className="mt-2 font-semibold text-slate-900">{percent(progress)}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-slate-500">Investors</p>
            <p className="mt-2 font-semibold text-slate-900">{project.investorCount || 0}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-slate-500">Deadline</p>
            <p className="mt-2 font-semibold text-slate-900">{project.deadlineLabel || 'Open'}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link to={`/projects/${project.id}`}>
          <Button className="w-full">View project</Button>
        </Link>
      </div>
    </Card>
  );
};
