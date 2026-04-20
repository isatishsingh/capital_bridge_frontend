import { useEffect, useMemo, useState } from 'react';
import { ProjectCard } from '../components/projects/ProjectCard';
import { EmptyState } from '../components/feedback/EmptyState';
import { LoadingState } from '../components/feedback/LoadingState';
import { useProjectStore } from '../store/projectStore';
import { progressFromAmounts } from '../utils/formatters';
import { Button } from '../components/ui/Button';

export const ProjectsPage = () => {
  const { projects, fetchProjects, loading } = useProjectStore();
  const [filters, setFilters] = useState({
    query: '',
    sort: 'latest',
    status: 'ALL'
  });

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) =>
        `${project.title} ${project.description}`.toLowerCase().includes(filters.query.toLowerCase())
      )
      .filter((project) => {
        if (filters.status === 'ALL') {
          return true;
        }
        if (filters.status === 'ACTIVE') {
          return (project.status || 'ACTIVE') === 'ACTIVE';
        }
        if (filters.status === 'FUNDED') {
          const pct = progressFromAmounts(project.currentFunding, project.goalAmount);
          return pct >= 99.5;
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sort === 'funding') {
          return (b.currentFunding || 0) - (a.currentFunding || 0);
        }

        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [filters.query, filters.sort, filters.status, projects]);

  return (
    <div className="page-shell py-16">
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Browse projects</p>
          <h1 className="mt-3 section-title">Find businesses worth backing.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Review funding progress, equity offered, and live engagement before sending an investment request.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            className="field-input"
            placeholder="Search by title or description"
            value={filters.query}
            onChange={(event) =>
              setFilters((current) => ({ ...current, query: event.target.value }))
            }
          />
          <select
            className="field-input"
            value={filters.status}
            onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
          >
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="FUNDED">Nearly funded</option>
          </select>
          <select
            className="field-input"
            value={filters.sort}
            onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}
          >
            <option value="latest">Latest first</option>
            <option value="funding">Highest funding</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading projects..." />
      ) : filteredProjects.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} fillHeight project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          description="There are no projects matching the current filters yet."
          title="No active projects found"
          action={<Button onClick={() => setFilters({ query: '', sort: 'latest', status: 'ALL' })}>Reset filters</Button>}
        />
      )}
    </div>
  );
};
