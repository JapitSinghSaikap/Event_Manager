const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true,
  logger: true
});

exports.sendRegistrationEmail = async (toEmail, eventDetails, organizerEmail) => {
  try {
    console.log(`Sending ticket to: ${toEmail}`);

    // Validate and extract QR code
    let qrImageBase64 = null;
    if (eventDetails.qrCode?.startsWith('data:image/png;base64,')) {
      qrImageBase64 = eventDetails.qrCode.split(',')[1];
    }
    console.log("QR base64 length:", qrImageBase64?.length); // Add this line

    if (eventDetails.qrCode && typeof eventDetails.qrCode === 'string') {
      const parts = eventDetails.qrCode.split(',');
      if (parts.length === 2 && parts[0].includes('image/png')) {
        qrImageBase64 = parts[1];
        console.log("QR code extracted");
      } else {
        console.warn("Invalid QR code format");
      }
    }

    const mailOptions = {
      from: `Event Manager <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `🎟️ Ticket for ${eventDetails.title}`,
      html: `...`, // Keep your existing HTML template
      attachments: qrImageBase64 ? [{
        filename: 'ticket.png',
        content: qrImageBase64,
        encoding: 'base64',
        cid: 'qrcodeticket',
        contentType: 'image/png'
      }] : []
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent! Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Email failed:", error);
    throw error;
  }
};
