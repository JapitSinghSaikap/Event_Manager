import React, { useState, useEffect } from "react";
import { CalendarDays, Clock, MapPin, Plus, Trash2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import CreateEventDialog from "./createEvent";

export default function MyEventsPage() {
  const [activeTab, setActiveTab] = useState("organised");
  const [allEvents, setAllEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch all events once
  const userID = user.id;
  const userName = user.name;
  const userEmail = user.email;
  console.log("User ID : ", userID);
  console.log("User Name : ", userName);
  console.log("User Email : ", userEmail);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`http://localhost:5000/organisers/getOrganiserEvent`,{
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        }); 
        const data = await res.json();
        const filteredData = data.filter(item => item.event !== null);
        setAllEvents(filteredData);
        setEvents(filteredData);
        console.log("All Events: ", data);
        // console.log("Fetched Events: ", allEvents);
        
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  // useEffect(() => {
  //   if (!user.id) {
  //     setEvents([]);
  //     return;
  //   }
  //   if (activeTab === "organised") {
  //     setEvents(allEvents.filter(event =>
  //       event.organiser && (event.organiser._id === user.id || event.organiser === user.id)
  //     ));
  //   } else {
  //     setEvents(allEvents.filter(event =>
  //       Array.isArray(event.attendees) &&
  //       event.attendees.some(attendee =>
  //         (attendee.user && (attendee.user._id === user.id || attendee.user === user.id))
  //       )
  //     ));
  //   }
  // }, [activeTab, allEvents, user.id]);

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

  function getCategoryBadgeColor(type) {
    switch (type) {
      case "conference": return "bg-blue-600 text-white";
      case "hackathon": return "bg-green-500 text-white";
      case "workshop": return "bg-yellow-400 text-black";
      case "meetup": return "bg-purple-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  }

  return (
    <div className="p-6 min-h-screen bg-[#121212] text-white">
      <div className="mb-6">
        <h1 className="text-5xl font-bold mb-6 mt-[5rem] text-center">My Events</h1>
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={() => setActiveTab("organised")}
            className={`py-2 px-4 rounded-full text-sm font-medium ${
              activeTab === "organised"
                ? "bg-white text-black"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            Organised
          </button>
          <button
            onClick={() => setActiveTab("joined")}
            className={`py-2 px-4 rounded-full text-sm font-medium ${
              activeTab === "joined"
                ? "bg-white text-black"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            Joined
          </button>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {events.length > 0 ? (
          events.map((item,index) => (
            <div
              key={index}
              className="rounded-xl bg-neutral-900 border border-neutral-800 shadow-lg flex flex-col overflow-hidden transition hover:shadow-2xl hover:-translate-y-1 group"
            >
              <div className="h-48 w-full overflow-hidden">
                {item.event.imageUrl ? (
                  <img
                    src={item.event.imageUrl}
                    alt={item.event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-neutral-800">
                    <span className="text-5xl text-neutral-700">📅</span>
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-2 p-5">
                <div className="flex justify-between items-center mb-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getCategoryBadgeColor(item.event.type)}`}>
                    {item.event.type}
                  </span>
                  <span className="text-xs text-gray-400">{item.event.format || "in-person"}</span>
                  {activeTab === "organised" && (
                    <button
                      onClick={() => handleDeleteEvent(item.event._id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-full flex items-center justify-center"
                      title="Delete event"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <h3 className="font-bold text-lg text-white">{item.event.title}</h3>
                
                {item.event.description && (
                  <p className="text-gray-300 text-sm line-clamp-2">{item.event.description}</p>
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(item.event.startDate).toLocaleDateString()}
                </div>
                
                {item.event.startDate && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="h-4 w-4" />
                    {new Date(item.event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="h-4 w-4" />
                  {item.event.location}
                </div>
                

                {item.event.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.event.technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className="bg-neutral-800 text-gray-200 px-2 py-1 rounded-full text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                    {item.event.technologies.length > 3 && (
                      <span className="bg-neutral-800 text-gray-200 px-2 py-1 rounded-full text-xs font-medium">
                        +{item.event.technologies.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {item.event.price ? `₹${item.event.price}` : "Free"}
                  </span>
                  <Link
                    to={`/events/${item.event._id}`}
                    className="rounded-full bg-purple-600 text-white text-xs px-4 py-2 font-semibold transition hover:bg-purple-700 shadow"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-3xl text-gray-400 py-10">
            No events found.
          </div>
        )}

        {activeTab === "organised" && (
          <div
            onClick={() => setIsCreateEventOpen(true)}
            className="cursor-pointer rounded-xl bg-neutral-900 border border-dashed border-gray-700 flex flex-col items-center justify-center p-8 hover:border-purple-500 transition-all duration-300 h-full shadow-lg hover:shadow-2xl"
          >
            <div className="bg-neutral-800 p-4 rounded-full mb-4">
              <Plus className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Create New Event</h3>
            <p className="text-sm text-gray-400 mb-4 text-center">Organize your next conference, hackathon, or meetup</p>
            <button className="rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm px-5 py-2 font-semibold shadow">
              Create Event
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




