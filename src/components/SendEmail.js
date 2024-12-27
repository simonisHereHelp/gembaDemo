import React, { useState, useContext } from 'react';
import mailIcon from '@site/static/img/ishere-logo.png';
import { GlobalPhotoContext } from '@site/src/theme/Root';
import { findChapterTitle } from './findTimeStamp';


const SendEmail = ({ title }) => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [timestamp, setTimestamp] = useState('');

  const { savedPhotos } = useContext(GlobalPhotoContext);
  const totalPhotosToUpload = savedPhotos.filter((photo) => photo).length;

  const recipients = ["simon@ishere.help", "presenter.simon@gmail.com"];
  const getRecipientName = (email) => email.split('@')[0];

  const handleSendEmail = async () => {
    setLoading(true);
    setStatus('Sending emails...');

    for (const recipient of recipients) {
      const recipientName = getRecipientName(recipient);

      // Generate plain text email body
    const plainBody = `
Hi,

${userName} has uploaded practice photo(s) for ${title}. Please see the attached file(s) for details.

Log File Content:
Practice Photos:

${savedPhotos
  .slice(0, 12)
  .map((photo, index) => {
    const chapterTitle = findChapterTitle(index);
    return `Photo "${chapterTitle}": ${photo ? '[x] included' : '[ ] not included'}`;
  })
  .join('\n')}
`;

      // Generate HTML email body
      const htmlBody = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid grey; border-radius: 5px; padding: 20px; text-align: center;">
    <img src="https://www.ishere.help/img/favicon.ico" alt="logo" style="display: block; margin: 0 auto; width: 50px; height: auto;">
    <h2 style="margin-top: 20px;">Practice Photos Uploaded</h2>
    <div style="text-align: left; margin-top: 20px; line-height: 1.5;">
      <p>Hi,</p>
      <p>${userName} has uploaded practice photo(s) for <strong>${title}</strong>. Please see the attached file(s) for details.</p>
      <h4 style="margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Log File Content:</h4>
      <ul>
        ${savedPhotos
          .slice(0, 12)
          .map((photo, index) => {
            const chapterTitle = findChapterTitle(index);
            return `<li style="margin-bottom: 5px;">Photo "${chapterTitle}": <strong>${photo ? '[x] included' : '[ ] not included'}</strong></li>`;
          })
          .join('')}
      </ul>
    </div>
    <footer style="margin-top: 20px; font-size: 12px; color: #555;">
      <p>Training Kiosk, San Diego, California, USA</p>
    </footer>
  </div>
`;


      // Log file content
      const logContent = savedPhotos
        .slice(0, 12)
        .map((photo, index) => {
          const chapterTitle = findChapterTitle(index);
          return `Photo "${chapterTitle}": ${photo ? '[x] saved' : '[ ] not saved'}`;
        })
        .join('\n');
      const logFile = new Blob([logContent], { type: 'text/plain' });

      // Create form data for submission
      const formData = new FormData();
      formData.append('recipients', recipient);
      formData.append('subject', `${userName} has just submitted practice photo(s)`);
      formData.append('plain_body', plainBody);
      formData.append('html_body', htmlBody);
      formData.append('attachments', new File([logFile], 'PracticePhotos.txt'));

      // Add up to 12 photos as attachments
      savedPhotos.slice(0, 12).forEach((photo, index) => {
        if (photo) {
          const byteString = atob(photo.image.split(',')[1]);
          const mimeString = photo.image.split(',')[0].split(':')[1].split(';')[0];
          const arrayBuffer = new Uint8Array(byteString.length);
          for (let i = 0; i < byteString.length; i++) {
            arrayBuffer[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([arrayBuffer], { type: mimeString });
          const chapterTitle = findChapterTitle(index); // Get chapter title
          const photoName = `${chapterTitle.replace(/\s+/g, '_')}.png`; // Format as a filename
          formData.append('attachments', new File([blob], photoName, { type: mimeString }));
        }
      });

      try {
        const response = await fetch('https://provisio-post0924-mailserver.onrender.com/sendInviteEmail', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          console.log(`Sent successfully to: ${recipient}`);
          setStatus(`Sent successfully to: ${recipient}`);
        } else {
          console.error(`Failed to send email to: ${recipient}`);
          setStatus(`Faied: ${recipient}`);
        }
      } catch (error) {
        console.error(`An error occurred while sending email to: ${recipient}`, error);
        setStatus(`An error occurred while sending email to: ${recipient}`);
      }
    }

    setLoading(false);
    setTimestamp(new Date().toLocaleString());
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <img
        src={mailIcon}
        alt="mail icon"
        style={{ width: '30px', verticalAlign: 'middle', marginRight: '10px' }}
      />
      <label style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#525252' }}>Enter:</label>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="your name here"
        style={{
          padding: '10px',
          margin: '0 10px',
          fontSize: '1.8rem',
          border: '1px solid #ccc',
          borderRadius: '10px',
        }}
      />
      <br /><br />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={handleSendEmail}
          disabled={loading || !userName}
          style={{
            padding: '0px 40px',
            backgroundColor: loading || !userName ? '#ddd' : '#4F647B',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            border: 'none',
            borderRadius: '5px',
            cursor: loading || !userName ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Sending...' : 'Send Photos via Email'}
        </button>
        <p style={{ color: '#525252', marginLeft: '10px', marginTop: '10px' }}>
          total {totalPhotosToUpload} photo(s)...
        </p>
      </div>
      {status && (
        <p style={{ marginTop: '10px', fontSize: '1.2rem', color: status.includes('Failed') ? 'red' : 'green' }}>
          {status} - {timestamp}
        </p>
      )}
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '10px' }}>
        <h4 style={{ marginBottom: '10px', color: '#4F647B' }}>Email Log</h4>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {recipients.map((recipient, index) => (
            <li key={index} style={{ marginBottom: '5px', fontSize: '1rem', color: '#525252' }}>
              <strong>Recipient {index + 1}:</strong> {recipient}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export { SendEmail };
