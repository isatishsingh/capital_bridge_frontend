export const asArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (!value || typeof value !== 'object') {
    return [];
  }

  const candidates = [
    value.content,
    value.data,
    value.projects,
    value.items,
    value.results,
    value.records
  ];

  const match = candidates.find(Array.isArray);
  return match || [];
};

export const asObject = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  if (value.data && typeof value.data === 'object' && !Array.isArray(value.data)) {
    return value.data;
  }

  if (value.project && typeof value.project === 'object' && !Array.isArray(value.project)) {
    return value.project;
  }

  return value;
};
