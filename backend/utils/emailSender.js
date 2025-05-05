const nodemailer = require('nodemailer');
require('dotenv').config();

// utils/emailSender.js
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  // Add error handling
  exports.sendRegistrationEmail = async (toEmail, eventDetails, organizerEmail) => {
    try {
      await transporter.sendMail({
        from: `Event Manager <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `Registration Confirmed: ${eventDetails.title}`,
        html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 24px; border-radius: 12px; box-shadow: 0 6px 12px rgba(0,0,0,0.05); max-width: 500px; margin: 20px auto; color: #111827;">
        <h1 style="font-size: 24px; font-weight: 600; color: #10b981; margin-bottom: 16px;">
          🎉 Registration Successful!
        </h1>
        <p style="font-size: 16px; margin: 8px 0;">
          You're registered for 
          <span style="font-weight: 600; color: #111827; background-color: #d1fae5; padding: 4px 10px; border-radius: 6px;">
            ${eventDetails.title}
          </span>
        </p>
        <p style="font-size: 15px; margin: 8px 0;">
          📅 <strong>Date:</strong> ${new Date(eventDetails.startDate).toLocaleDateString()}
        </p>
        <p style="font-size: 15px; margin: 8px 0;">
          📍 <strong>Location:</strong> ${eventDetails.location}
        </p>
        <p style="font-size: 15px; margin: 8px 0;">
          ✉️ <strong>Organizer Contact:</strong> 
          <a href="mailto:${organizerEmail}" style="color: #2563eb; text-decoration: none;">
            ${organizerEmail}
          </a>
        </p>
      </div>
        `
      });
      console.log("Registration email sent to:", toEmail);
    } catch (error) {
      console.error("Error sending registration email:", error);
    }
  };
  // Add this export
exports.sendOrganizerNotification = async (toEmail, eventDetails, userDetails) => {
    try {
      await transporter.sendMail({
        from: `Event Manager <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `New Registration: ${eventDetails.title}`,
        html: `
        <<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 24px; border-radius: 12px; box-shadow: 0 6px 12px rgba(0,0,0,0.05); max-width: 500px; margin: 20px auto; color: #111827;">
        <h1 style="font-size: 24px; font-weight: 600; color: #2563eb; margin-bottom: 16px;">
            📢 New Attendee!
        </h1>
        <p style="font-size: 16px; margin: 8px 0;">
            <span style="font-weight: 500;">${userDetails.name}</span> (<a href="mailto:${userDetails.email}" style="color: #2563eb; text-decoration: none;">${userDetails.email}</a>) registered for:
        </p>
        <p style="font-size: 18px; font-weight: 600; color: #111827; background-color: #e0f2fe; padding: 12px 16px; border-radius: 8px; margin: 16px 0;">
            ${eventDetails.title}
        </p>
        <p style="font-size: 14px; color: #6b7280;">
            🎉 Total Attendees: <strong style="color: #111827;">${eventDetails.attendeesCount}</strong>
        </p>
        </div>
        `
      });
      console.log('Organizer notification sent to:', toEmail);
    } catch (error) {
      console.error('Error sending organizer notification:', error);
    }
  };
  