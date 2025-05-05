import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, MapPin } from "lucide-react";
import { toast } from 'sonner';

export default function EventView() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const API_BASE = "http://localhost:5000";
  
  const fetchEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Failed to fetch event");

      return await response.json();
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error("Failed to load event details.");
      return null;
    }
  };

  useEffect(() => {
    const loadEvent = async () => {
      console.log("Fetching event for ID:", id);
      const data = await fetchEvent();
      if (data) {
        setEvent(data);
        const userId = JSON.parse(localStorage.getItem("user"))?.id;
        setIsRegistered(
          data.attendees.some(attendee =>
            (attendee.user?._id === userId) ||
            (attendee.user?.toString() === userId)
          )
        );
      }
      setLoading(false);
    };

    loadEvent();
  }, [id]);

  const handleRegistration = async () => {
    setIsRegistering(true);
    try {
      const user = localStorage.getItem("user");
      const userID = JSON.parse(user)?.id;

      if (!userID) {
        toast.error("User not found. Please log in.");
        return ;
      }
      const eventID = id;
      const eventData = await fetch(`http://localhost:5000/events/${eventID}`);

      const response = await fetch(`http://localhost:5000/events/${userID}/add-event-to-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          eventId: eventID,
          userId: userID,
          eventData: await eventData.json()
        })
      })
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to register for the event.");
        return;
      }
      const updatedUser = await response.json();
      const updatedEvent = updatedUser.eventRegistrations.find(event => event._id === eventID);
      setEvent(updatedEvent);
      setIsRegistered(true);
      toast.success("Registration successful!");
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading event details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-8 px-2">
      <div className="w-full max-w-5xl bg-black rounded-2xl border border-neutral-800 shadow-xl p-6 md:p-10 flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_288px] gap-8">
          <div className="w-full h-full">
            <div className="relative w-full aspect-[3/2] bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
              {event.imageUrl ? (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-neutral-800">
                  <span className="text-5xl text-gray-700">📅</span>
                </div>
              )}
            </div>
          </div>
          <div className="w-full md:w-72">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow p-5 flex flex-col gap-6">
              <div>
                <div className="text-gray-400 uppercase text-xs font-semibold mb-1">
                  Registration
                </div>
                <div className="text-2xl font-bold text-white mb-2 mt-2">
                  {event.price ? `₹${event.price}` : "Free"}
                  <span className="text-base font-normal text-gray-400"> per person</span>
                </div>
                <button
                  onClick={handleRegistration}
                  disabled={isRegistered || isRegistering}
                  className={`w-full py-2 rounded-lg font-semibold text-base transition ${
                    isRegistered
                      ? "bg-green-600 cursor-not-allowed"
                      : "bg-purple-500 hover:bg-purple-600"
                  } text-white`}
                >
                  {isRegistering ? "Processing..." :
                    isRegistered ? "Registered ✓" : "Register Now"}
                </button>
              </div>
              <div>
                <div className="text-gray-400 text-xs font-semibold mb-2">
                  Event Details
                </div>
                <div className="text-white text-sm flex flex-col gap-1">
                  <div>
                    <CalendarDays className="inline w-4 h-4 mr-2" />
                    {new Date(event.startDate).toLocaleDateString()}
                  </div>
                  <div>
                    <MapPin className="inline w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                  <div>
                    <span className="font-medium">👥</span>{" "}
                    {event.attendees?.length || 0} attendees
                    {isRegistering && <span className="ml-2 text-purple-400">(updating...)</span>}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs font-semibold mb-2">
                  Organizer
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-neutral-800 w-8 h-8 flex items-center justify-center text-white font-bold">
                    {event.organiser?.name?.[0] || "?"}
                  </div>
                  <span className="text-white">{event.organiser?.name || "Unknown"}</span>
                </div>
              </div>
              {event.technologies?.length > 0 && (
                <div>
                  <div className="text-gray-400 text-xs font-semibold mb-2">
                    Technologies
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {event.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-black border border-neutral-700 text-white px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="bg-neutral-800 text-gray-200 px-3 py-1 rounded-full text-xs font-semibold">
              {event.type}
            </span>
            <span className="bg-neutral-800 text-gray-200 px-3 py-1 rounded-full text-xs font-semibold">
              {event.format}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            {event.title}
          </h1>
          <div className="text-gray-200 mb-4 whitespace-pre-line">
            {event.description}
          </div>
        </div>
      </div>
    </div>
  );
}
