import React, { useEffect, useState } from "react";

import { Users, X, Plus } from "lucide-react";

// Dummy fetchers: replace with your real API
async function fetchEvents() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/events", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}
async function fetchOrganisers() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/organisers", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export default function AssignOrganisersPage() {
  const [events, setEvents] = useState([]);
  const [organisers, setOrganisers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [selectedOrganiser, setSelectedOrganiser] = useState("");
  const [loading, setLoading] = useState(false);



  // load hone pe jo content rhega wo sab kuch
  useEffect(() => {
    fetchEvents().then(setEvents);
    fetchOrganisers().then(setOrganisers);
  }, []);

  // change pe jo load hoga wo sab kuch
  useEffect(() => {
    if (!selectedEvent) return;
    setLoading(true);
    assignmentService.getByEvent(selectedEvent._id)
      .then(setAssignments)
      .finally(() => setLoading(false));
  }, [selectedEvent]);

  const handleAssign = async () => {
    if (!selectedEvent || !selectedOrganiser) return;
    setLoading(true);
    try {
      await assignmentService.assignEvent(selectedEvent._id, selectedOrganiser);
      const updated = await assignmentService.getByEvent(selectedEvent._id);
      setAssignments(updated);
      setSelectedOrganiser("");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (organiserId) => {
    setLoading(true);
    try {
      await assignmentService.removeAssignment(selectedEvent._id, organiserId);
      setAssignments(assignments.filter(a => a.organiserId._id !== organiserId));
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto bg-[#18181b] border border-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-6">Assign Organisers to Events</h1>
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Select Event</label>
          <select
            className="w-full bg-black text-white border border-gray-700 rounded-lg p-2"
            value={selectedEvent ? selectedEvent._id : ""}
            onChange={e => {
              const event = events.find(ev => ev._id === e.target.value);
              setSelectedEvent(event || null);
            }}
          >
            <option value="">-- Select an event --</option>
            {events.map(event => (
              <option key={event._id} value={event._id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>
        {selectedEvent && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Users className="inline-block" /> Assigned Organisers
            </h2>
            {loading ? (
              <div className="text-gray-400">Loading...</div>
            ) : assignments.length === 0 ? (
              <div className="text-gray-400">No organisers assigned yet.</div>
            ) : (
              <ul className="space-y-2">
                {assignments.map(a => (
                  <li key={a.organiserId._id} className="flex items-center gap-3 bg-neutral-900 rounded-lg px-4 py-2">
                    <span className="font-medium">{a.organiserId.name} <span className="text-xs text-gray-400">({a.organiserId.email})</span></span>
                    <button
                      className="ml-auto text-gray-400 hover:text-red-400"
                      onClick={() => handleRemove(a.organiserId._id)}
                      title="Remove assignment"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {selectedEvent && (
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-gray-300 mb-2">Add Organiser</label>
              <select
                className="w-full bg-black text-white border border-gray-700 rounded-lg p-2"
                value={selectedOrganiser}
                onChange={e => setSelectedOrganiser(e.target.value)}
              >
                <option value="">-- Select organiser --</option>
                {organisers.map(org => (
                  <option key={org._id} value={org._id}>
                    {org.name} ({org.email})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAssign}
              disabled={!selectedOrganiser || loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Assign
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
