import React from 'react';

const LABELS = {
  pending:      'Pending',
  under_review: 'Under Review',
  approved:     'Approved',
  rejected:     'Rejected',
  active:       'Active',
  inactive:     'Inactive',
};

const StatusBadge = ({ status }) => (
  <span className={`badge badge-${status}`}>
    {LABELS[status] ?? status}
  </span>
);

export default StatusBadge;
