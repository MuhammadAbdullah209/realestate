import React, { useEffect, useState } from "react";

const Contact = ({ listing, onClose }) => {
  const [Agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!listing?.userref) return;

    const fetchAgents = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/Api/Auth/${listing.userref}`);
        const data = await res.json();
        setAgent(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, [listing?.userref]);

  const handleSendEmail = () => {
    if (!customerEmail || !message) {
      alert("Please enter your email and message before sending.");
      return;
    }

    const subject = `Regarding ${listing.name}`;
    const body = `From: ${customerEmail}%0D%0A%0D%0A${message}`;
    const mailtoLink = `mailto:${Agent.email}?subject=${encodeURIComponent(
      subject
    )}&body=${body}`;
    window.location.href = mailtoLink;
  };

  return (
    <>
      {Agent && (
        <div className="relative max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-xl font-bold"
            aria-label="Close"
          >
            ×
          </button>

          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{Agent.username}</h1>
          </div>

          {/* Email Input */}
          <div className="px-6 pb-4">
            <label htmlFor="customerEmail" className="block text-gray-700 font-medium mb-2">
              Your Email
            </label>
            <input
              type="email"
              id="customerEmail"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Message Textarea */}
          <div className="px-6 pb-4">
            <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
              Your Message
            </label>
            <textarea
              id="message"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
            ></textarea>
          </div>

          {/* Send Button */}
          <div className="p-4 bg-gray-50 flex justify-end gap-3">
            <button
              onClick={handleSendEmail}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Send Email
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;
