export default function StatusBadge({ status }) {

  const getStatusColor = () => {
    switch (status) {
      case "Approved":
        return "text-green-600";

      case "Rejected":
        return "text-red-600";

      default:
        return "text-orange-500";
    }
  };

  return (
    <span className={`font-semibold ${getStatusColor()}`}>
      {status}
    </span>
  );
}