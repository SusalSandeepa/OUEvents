import { Link } from "react-router-dom";

export default function AdminEventPage() {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl text-secondary font-semibold">Event Management</h2>
      <Link
        to="/admin/events/create"
        className="text-white font-medium text-base bg-accent px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
      >
        Create Event
      </Link>
    </div>
  );
}
