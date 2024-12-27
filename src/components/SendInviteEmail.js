import React, { useState } from 'react';

const SendInviteEmail = ({ deviceName1, deviceName2 }) => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const recipients = ["simon@ishere.help", "presenter.simon@gmail.com"];
  const meetingLink = "https://ishere.daily.co/P_20241029_0719";
  const formatDateTime = () => {
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${year}/${month}/${day} ${formattedHours}:${minutes} ${period}`;
  };

  const dateTime = formatDateTime();

  const getRecipientName = (email) => email.substring(0,15);

  const sendEmailToRecipient = async (recipient) => {
    const recipientName = getRecipientName(recipient);
  
    // Generate personalized plain-text body
    const plainBody = `
      You are invited to Watch the livestream of my work, ${recipientName}!
      Click the following link to start now: ${meetingLink}?name=${recipientName}
  
      Streaming info:
      Invitation Sent: ${dateTime}
      Video Stream Sources:
      - ${deviceName1}
      - ${deviceName2}
    `;
  
    // Generate personalized HTML body
    const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid grey; border-radius: 5px; padding: 20px; text-align: center;">
      <img src="https://www.ishere.help/img/favicon.ico" alt="logo" style="display: block; margin: 0 auto; width: 50px; height: auto;">
      <h2 style="margin-top: 20px;">You're Invited to Watch livestream of my work, ${recipientName}!</h2>
      <p>My workstation is on <strong>LIVE VIDEO</strong> now. Click the button below to watch:</p>
      <a href="${meetingLink}?name=${recipientName}" 
         style="display: inline-block; padding: 10px 20px; color: white; background-color: #4F647B; 
         text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px;">Watch Now</a>
      <div style="text-align: left; margin-top: 20px;">
        <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 5px;">Streaming Info:</h3>
        <p><strong>Invitation Sent:</strong> ${dateTime}</p>
        <p><strong>Video Stream Sources:</strong></p>
        <ul>
          <li>${deviceName1}</li>
          <li>${deviceName2}</li>
        </ul>
      </div>
      <footer style="margin-top: 20px; font-size: 12px; color: #555;">
        <p>Training Kiosk, San Diego, California, USA</p>
      </footer>
    </div>
  `;
  
  
    // Prepare the form data
    const formData = new FormData();
    formData.append('recipients', recipient);
    formData.append('subject', 'Invitation to Watch My Work, Live!');
    formData.append('plain_body', plainBody);
    formData.append('html_body', htmlBody);
  
    try {
      const response = await fetch('https://provisio-post0924-mailserver.onrender.com/sendInviteEmail', {
        method: 'POST',
        body: formData,
      });
  
      // **Change 1: Simplified return values**
      if (response.ok) {
        console.log(`Successfully sent to: ${recipient}`);
        return recipient; // Return the recipient's email if successful
      } else {
        console.error(`Failed to send to: ${recipient}`);
        return null; // Return null if the email failed
      }
    } catch (error) {
      console.error(`Error sending to: ${recipient}`, error);
      return null; // Return null on error
    }
  };
  
  const handleSendEmail = async () => {
    setLoading(true);
    setStatus('Sending emails...');
  
    const results = await Promise.all(recipients.map(sendEmailToRecipient));
  
    // Filter out successful sends
    const successfulRecipients = results.filter((result) => result !== null);
  
    // Update the status message
    if (successfulRecipients.length === 0) {
      setStatus('Successfully sent to: none');
    } else {
      setStatus(`Successfully sent to: ${successfulRecipients.join(', ')}`);
    }
  
    setLoading(false);
  };
  

  return (
    <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center' }}>
      <button
        onClick={handleSendEmail}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ddd' : '#4F647B',
          color: 'white',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginRight: '10px',
        }}
      >
        {loading ? 'Sending...' : 'Send Invite'}
      </button>
      {status && <span style={{ color: 'orange' }}>{status}</span>}
    </div>
  );
};

export { SendInviteEmail };
