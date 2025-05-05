// Simple QR Scanner Component (React)
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

function TicketScanner() {
  const [scanResult, setScanResult] = useState('');
  const [scanStatus, setScanStatus] = useState('');
  const [eventId, setEventId] = useState('');

  const handleScan = async (data) => {
    if (data && eventId) {
      try {
        setScanStatus('Verifying ticket...');
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/events/${eventId}/verify-ticket`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ticketId: data })
        });
        
        const result = await response.json();
        if (response.ok) {
          setScanStatus(`✅ Success: ${result.message}`);
          setScanResult(result.attendee?.name || 'Attendee');
        } else {
          setScanStatus(`❌ Error: ${result.message}`);
        }
      } catch (error) {
        setScanStatus('❌ Verification failed');
        console.error(error);
      }
    }
  };

  return (
    <div className="p-4 bg-black min-h-screen text-white">
      <h1 className="text-xl font-bold mb-4">Ticket Scanner</h1>
      
      <div className="mb-4">
        <label className="block mb-2">Event ID:</label>
        <input 
          type="text" 
          value={eventId} 
          onChange={(e) => setEventId(e.target.value)}
          className="w-full p-2 text-black rounded"
          placeholder="Enter event ID" 
        />
      </div>
      
      {eventId && (
        <div className="mb-4">
          <div className="bg-neutral-800 p-2 rounded overflow-hidden">
            <QrReader
              constraints={{ facingMode: 'environment' }}
              onResult={(result) => {
                if (result) {
                  handleScan(result?.text);
                }
              }}
              className="w-full"
            />
          </div>
        </div>
      )}
      
      {scanStatus && (
        <div className={`p-4 rounded mb-4 ${scanStatus.includes('Success') ? 'bg-green-800' : 'bg-red-800'}`}>
          {scanStatus}
        </div>
      )}
      
      {scanResult && (
        <div className="p-4 bg-neutral-800 rounded">
          <h2 className="font-bold">Attendee:</h2>
          <p>{scanResult}</p>
        </div>
      )}
    </div>
  );
}

export default TicketScanner;
