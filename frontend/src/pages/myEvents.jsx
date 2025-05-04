import React, { useState, useEffect } from "react";
import { CalendarDays, Clock, MapPin, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import CreateEventDialog from "./createEvent";

export default function MyEventsPage() {
  const [activeTab, setActiveTab] = useState("organised");
  const [allEvents, setAllEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch all events once
  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:5000/events", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        setAllEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);


  useEffect(() => {
    if (!user.id) {
      setEvents([]);
      return;
    }
    if (activeTab === "organised") {
      setEvents(allEvents.filter(event =>
        event.organiser && (event.organiser._id === user.id || event.organiser === user.id)
      ));
    } else {
      setEvents(allEvents.filter(event =>
        Array.isArray(event.attendees) &&
        event.attendees.some(attendee =>
          (attendee.user && (attendee.user._id === user.id || attendee.user === user.id))
        )
      ));
    }
  }, [activeTab, allEvents, user.id]);



  const handleCreateEvent = (newEvent) => {
    setAllEvents([...allEvents, newEvent]);
    if (activeTab === "organised" && newEvent.organiser && newEvent.organiser._id === user.id) {
      setEvents([...events, newEvent]);
    }
  };


  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/events/${eventId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        setAllEvents(allEvents.filter(event => event._id !== eventId));
        setEvents(events.filter(event => event._id !== eventId));
      } else {
        console.error("Failed to delete event");
      }
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#121212] text-white">
      <div className="mb-6 ">
        <h1 className="text-5xl font-bold mb-6 mt-[5rem] text-center">My Events</h1>
        <div className="flex space-x-4 mt-4">
          <button
            onClick={() => setActiveTab("organised")}
            className={`py-2 px-4 rounded-full ${
              activeTab === "organised"
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Organised
          </button>
          <button
            onClick={() => setActiveTab("joined")}
            className={`py-2 px-4 rounded-full ${
              activeTab === "joined"
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Joined
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-[#1e1e1e] rounded-xl overflow-hidden flex flex-col shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="h-48 w-full overflow-hidden">
              {event.imageUrl ? (
                <img 
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-neutral-800">
                  <CalendarDays className="h-12 w-12 text-purple-400" />
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="inline-block bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                  Organiser
                </span>
                {activeTab === "organised" && (
                  <button
                    onClick={() => handleDeleteEvent(event._id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-full flex items-center justify-center"
                    title="Delete event"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <h2 className="text-lg font-semibold">{event.title}</h2>

              <div className="mt-3 flex items-center text-sm text-gray-400">
                <CalendarDays className="w-4 h-4 mr-2" />
                {new Date(event.startDate).toLocaleDateString()}
              </div>

              <div className="mt-2 flex items-center text-sm text-gray-400">
                <Clock className="w-4 h-4 mr-2" />
                {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>

              <div className="mt-2 flex items-center text-sm text-gray-400">
                <MapPin className="w-4 h-4 mr-2" />
                {event.location}
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="inline-block bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                  {event.type}
                </span>
                <Link
                  to={`/events/${event._id}`}
                  className="text-purple-400 text-sm hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}

        {activeTab === "organised" && (
          <div
            onClick={() => setIsCreateEventOpen(true)}
            className="cursor-pointer border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center p-8 hover:border-purple-500 transition-all duration-300"
          >
            <div className="bg-gray-800 p-3 rounded-full mb-4">
              <Plus className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Create New</h3>
            <p className="text-sm text-gray-400 mb-4">Organise your next event</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-full">
              Create
            </button>
          </div>
        )}
      </div>

      <CreateEventDialog 
        open={isCreateEventOpen} 
        onOpenChange={setIsCreateEventOpen}
        onSuccess={handleCreateEvent}
      />
    </div>
  );
}
