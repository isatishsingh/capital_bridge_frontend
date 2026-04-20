export const ROLES = {
  INVESTOR: 'INVESTOR',
  CREATOR: 'CREATOR',
  ADMIN: 'ADMIN'
};

export const INVESTMENT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED'
};

export const REPORT_REASONS = [
  'Customer not replying',
  'Abuse',
  'Violation',
  'Other'
];

export const NAV_LINKS = {
  public: [
    { label: 'About', to: '/about' },
    { label: 'Testimonials', to: '/testimonials' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Projects', to: '/projects' }
  ],
  INVESTOR: [
    { label: 'Explore', to: '/projects' },
    { label: 'Dashboard', to: '/investor/dashboard' }
  ],
  CREATOR: [
    { label: 'Dashboard', to: '/creator/dashboard' },
    { label: 'Create Project', to: '/creator/projects/create' },
    { label: 'Verification', to: '/creator/verification' }
  ],
  ADMIN: [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Projects', to: '/admin/projects' },
    { label: 'Users', to: '/admin/users' },
    { label: 'Reports', to: '/admin/reports' }
  ]
};
