import { memo } from "react";

const StatusBadge = memo(function StatusBadge({ status }) {
  function getBadgeClass(status) {
    switch (status?.toLowerCase()) {
      case "available":
        return "badge-available";
      case "allocated":
        return "badge-allocated";
      case "inservice":
        return "badge-inservice";
      case "pending":
        return "badge-pending";
      case "resolved":
        return "badge-resolved";
      case "verified":
        return "badge-resolved";
      case "rejected":
        return "badge-rejected";
      case "active":
        return "badge-allocated";
      case "returned":
        return "badge-available";
      case "approved":
        return "badge-resolved";
      default:
        return "badge-pending";
    }
  }

  return (
    <span className={getBadgeClass(status)}>
      {status}
    </span>
  );
});

export default StatusBadge;