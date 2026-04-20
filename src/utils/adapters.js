import { asArray, asObject } from './normalizers';

export const adaptProject = (project) => {
  if (!project) {
    return null;
  }

  return {
    ...project,
    creatorId: project.creatorId ?? project.creator?.id ?? null,
    creatorEmail: project.creatorEmail ?? project.creator?.email ?? null,
    currentFunding: project.currentFunding ?? project.currentAmount ?? 0,
    equityOffered: project.equityOffered ?? project.totalEquityOffered ?? 0,
    totalEquityOffered: project.totalEquityOffered ?? project.equityOffered ?? 0,
    equitySold: project.equitySold ?? project.equityAllocated ?? 0,
    remainingEquity:
      project.remainingEquity ??
      Math.max(
        Number(project.totalEquityOffered ?? project.equityOffered ?? 0) -
          Number(project.equityAllocated ?? project.equitySold ?? 0),
        0
      ),
    currentAmount: project.currentAmount ?? project.currentFunding ?? 0
  };
};

export const adaptProjects = (response) => asArray(response).map(adaptProject).filter(Boolean);

export const adaptProjectDetail = (response, existingProject = null) => {
  const project = adaptProject(asObject(response));
  return project ? { ...existingProject, ...project } : existingProject;
};

export const adaptInvestmentRequest = (request) => {
  if (!request) {
    return null;
  }

  const normalizedStatus = String(
    typeof request.status === 'string' ? request.status : request.status?.name || 'PENDING'
  )
    .trim()
    .toUpperCase();

  return {
    ...request,
    projectId: request.projectId ?? request.project?.id ?? null,
    projectTitle: request.projectTitle ?? request.project?.title ?? 'Project',
    investorName: request.investorName ?? request.investor?.name ?? request.user?.name ?? 'Investor',
    amount: request.amount ?? 0,
    equityPercentage: request.equityPercentage ?? request.equityTaken ?? 0,
    status: normalizedStatus
  };
};

export const adaptInvestmentRequests = (response) =>
  asArray(response).map(adaptInvestmentRequest).filter(Boolean);

export const adaptPagedAdminData = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  return asArray(response);
};
