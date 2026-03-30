import React from 'react';

const StatusBadge = ({ status }) => (
  <span className={`badge badge-${status}`}>
    {status?.replace('_', ' ')}
  </span>
);

export default StatusBadge;
