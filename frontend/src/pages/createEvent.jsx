import React, { useState, useEffect, useRef } from "react";
import { X, Image as ImageIcon } from "lucide-react";


export default function CreateEventDialog({ open, onOpenChange }) {
  const widgetRef = useRef();
  const [technologies, setTechnologies] = useState([]);
  const [newTech, setNewTech] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "conference",
    format: "in-person",
    price: 0,
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
    imageUrl: ""
  });

  // Cloudinary wala image setup hai
  useEffect(() => {
    if (window.cloudinary && !widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: "dlxr0tmaf",
          uploadPreset: "event_images", 
          multiple: false,
          cropping: false,
          resourceType: "image"
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            console.log("Cloudinary URL:", result.info.secure_url);
            setFormData(prev => {
              const updated = { ...prev, imageUrl: result.info.secure_url };
              console.log("formData.imageUrl after upload:", updated.imageUrl);
              return updated;
            });
          }
        }
      );
    }
  }, []);

  const handleAddTechnology = (e) => {
    if (e.key === "Enter" && newTech.trim()) {
      e.preventDefault();
      setTechnologies([...technologies, newTech.trim()]);
      setNewTech("");
    }
  };

  const handleRemoveTechnology = (tech) => {
    setTechnologies(technologies.filter(t => t !== tech));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const userID = JSON.parse(user)?.id;
    if (!token) {
      alert("You must be logged in to create an event.");
      return;
    }

    const eventData = {
      ...formData,
      technologies,
      startDate: new Date(`${formData.startDate}T${formData.startTime}`).toISOString(),
      endDate: new Date(`${formData.endDate}T${formData.endTime}`).toISOString(),
    };

    console.log("Submitting eventData:", eventData);

    try {
      const response = await fetch("http://localhost:5000/events/postEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Event creation failed");
      }
      console.log("Response :: ", response);
      onOpenChange(false);

      const res = await response.json();  
      const eventID = res.event._id; 
      console.log("Event created with ID:", eventID);
      console.log("New Event Data:", res.event);


      const addEventToCreatedUser = await fetch(`http://localhost:5000/events/${userID}/add-event-to-created-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          eventID: eventID,
          userID: userID, 
          eventData: res.event
        })
      });
      if (!addEventToCreatedUser.ok) {
        const errorData = await addEventToCreatedUser.json();
        throw new Error(errorData.message || "Failed to add event to user");
      }
      console.log("Event added to user successfully");

    } catch (err) {
      alert(err.message);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#18181b] shadow-2xl p-8 sm:p-10 border border-gray-800">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 rounded-full p-2 text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Create Tech Event</h2>
          <p className="mt-1 text-sm text-gray-400">Fill in the details to create your tech event</p>
        </div>
        <div className="mb-8">
          <div className="grid grid-cols-2 bg-[#23232b] rounded-lg p-1 gap-2">
            {["basic", "details"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-black shadow text-purple-400"
                    : "text-gray-400 hover:bg-gray-800"
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {activeTab === "basic" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Event Image
                </label>
                <div
                  className="border-2 border-dashed border-gray-700 rounded-lg p-4 cursor-pointer hover:border-purple-500 transition-colors"
                  onClick={() => widgetRef.current && widgetRef.current.open()}
                >
                  {formData.imageUrl ? (
                    <div className="relative">
                      <img
                        src={formData.imageUrl}
                        alt="Event preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setFormData(f => ({ ...f, imageUrl: "" }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 p-1 rounded-full"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-300 text-sm">Click to upload event image</p>
                      <p className="text-gray-500 text-xs mt-1">Recommended size: 1200x800px</p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-1">
                  Event Title
                </label>
                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., React Conference 2024"
                  className="w-full rounded-lg border border-gray-700 bg-black text-white px-4 py-2 text-base shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your tech event"
                  rows={4}
                  className="w-full rounded-lg border border-gray-700 bg-black text-white px-4 py-2 text-base shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-200 mb-1">
                  Event Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-700 bg-black text-white px-4 py-2 text-base shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition"
                >
                  <option value="conference">Conference</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="workshop">Workshop</option>
                  <option value="meetup">Meetup</option>
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-200 mb-1">
                  Ticket Price (INR)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min={0}
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 500"
                  className="w-full rounded-lg border border-gray-700 bg-black text-white px-4 py-2 text-base shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>
                
              
              <div>
                <label htmlFor="format" className="block text-sm font-medium text-gray-200 mb-1">
                  Event Format
                </label>
                <select
                  id="format"
                  name="format"
                  value={formData.format}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-700 bg-black text-white px-4 py-2 text-base shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition"
                >
                  <option value="in-person">In Person</option>
                  <option value="virtual">Virtual</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Technologies & Topics</label>
                <div className="flex flex-wrap gap-2 border border-gray-700 rounded-lg bg-black p-2">
                  {technologies.map((tech) => (
                    <span
                      key={tech}
                      className="flex items-center gap-1 rounded-full bg-purple-900/30 text-purple-300 px-3 py-1 text-sm"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTechnology(tech)}
                        className="ml-1 rounded-full p-1 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    placeholder="Add technology..."
                    className="flex-1 bg-black text-white px-2 py-1 text-sm focus:outline-none"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyDown={handleAddTechnology}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Press Enter to add a new technology</p>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-6">
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-200 mb-1">
                  Start Date
                </label>
                <input
                  id="start-date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-700 bg-black text-white px-4 py-2 text-base shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>
              <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-200 mb-1">
                  End Date
                </label>
                <input
                  id="end-date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-700 bg-black text-white px-4 py-2 text-base shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>
              <div>
                <label htmlFor="start-time" className="block text-sm font-medium text-gray-200 mb-1">
                  Start Time
                </label>
                <input
                  id="start-time"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-700 bg-black text-white px-4 py-2 text-base shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>
              <div>
                <label htmlFor="end-time" className="block text-sm font-medium text-gray-200 mb-1">
                  End Time
                </label>
                <input
                  id="end-time"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-700 bg-black text-white px-4 py-2 text-base shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-200 mb-1">
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Amsterdam, Online"
                  className="w-full rounded-lg border border-gray-700 bg-black text-white px-4 py-2 text-base shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-10">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg bg-gray-800 px-6 py-2 text-sm text-gray-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-purple-600 px-6 py-2 text-sm text-white font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
