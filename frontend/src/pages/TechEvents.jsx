import React, { useState, useEffect } from "react";
import { CalendarDays, MapPin, Search } from "lucide-react";
import { Link } from "react-router-dom";

function TechEventCard({ event }) {
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
    <div className="rounded-xl bg-neutral-900 border border-neutral-800 shadow-lg flex flex-col overflow-hidden transition hover:shadow-2xl hover:-translate-y-1 group">
      <div className="h-48 w-full overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
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
          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getCategoryBadgeColor(event.type)}`}>
            {event.type}
          </span>
          <span className="text-xs text-gray-400">{event.format}</span>
        </div>
        <h3 className="font-bold text-lg text-white">{event.title}</h3>
        <p className="text-gray-300 text-sm line-clamp-2">{event.description}</p>
        <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
          <CalendarDays className="h-4 w-4" />
          {new Date(event.startDate).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <MapPin className="h-4 w-4" />
          {event.location}
        </div>
        {event.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {event.technologies.slice(0, 3).map((tech) => (
              <span key={tech} className="bg-neutral-800 text-gray-200 px-2 py-1 rounded-full text-xs font-medium">
                {tech}
              </span>
            ))}
            {event.technologies.length > 3 && (
              <span className="bg-neutral-800 text-gray-200 px-2 py-1 rounded-full text-xs font-medium">
                +{event.technologies.length - 3}
              </span>
            )}
          </div>
        )}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-gray-400">{event.price ? `₹${event.price}` : ""}</span>
          <Link
            to={`/events/${event._id}`}
            className="rounded-full bg-purple-600 text-white text-xs px-4 py-2 font-semibold transition hover:bg-purple-700 shadow"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TechEventsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://event-manager-5vo3.onrender.com/events", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // https://event-manager-5vo3.onrender.com
        if (!response.ok) throw new Error("Failed to fetch events");
        
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesType = activeTab === "all" || event.type === activeTab;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <main className="flex-1">
        <section className="container px-4 py-6 md:px-6 md:py-12">
          <div>
            <h1 className="text-6xl font-bold tracking-tight text-white">Tech Events</h1>
            <p className="text-4xl text-gray-300">Discover conferences, meetups, and hackathons</p>
          </div>

          <div className="w-full mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-3 mt-6 mr-[50rem]">
                {["all", "conference", "hackathon", "workshop", "meetup"].map((type) => (
                  <button
                    key={type}
                    className={`px-4 py-2 rounded text-xl font-medium capitalize transition ${
                      activeTab === type
                        ? "bg-white text-black"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveTab(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-5 ml-4 mt-4">
                <div className="relative w-[260px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search events..."
                    className="w-full rounded-lg border border-gray-700 pl-8 py-2 bg-gray-900 text-white placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <TechEventCard key={event._id} event={event} />
              ))}
              {filteredEvents.length === 0 && (
                <div className="col-span-full text-center text-3xl text-gray-400 py-10 ml-[30.6rem] mt-[14rem]">
                  No events found.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
