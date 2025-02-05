import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Layout from '@theme/Layout';
import remoteAccessImg from '@site/static/img/remoteAccess.png';
import RemoteAccessPasteIcon from '@site/static/img/RemoteAccess_paste.png'; // Self-hosted paste icon

const RemoteAccess = () => {
  const [remoteAccessCode, setRemoteAccessCode] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const markdownContent = `
Follow these steps to get live support from our technicians:

| **Step** | **Action**                                |
|----------|------------------------------------------|
| **1**    | Click the "Generate Code".               |
| **2**    | Get the 12-digit Access Code.             |
| **3**    | Click "Invite Now".                      |
`;

const handlePasteCode = async () => {
  try {
    const copiedText = await navigator.clipboard.readText();
    
    // Check if copiedText is exactly 12 digits (numeric only)
    if (/^\d{12}$/.test(copiedText)) {
      setRemoteAccessCode(copiedText);
    } else {
      alert("Invalid Access Code. Please copy a valid 12-digit code.");
    }
  } catch (error) {
    alert("Failed to paste. Please allow clipboard access.");
  }
};


const handleSendEmail = async () => {
  if (!remoteAccessCode) {
    setResponseMessage('| **Status** | **Message** |\n|-----------|--------------------------------|\n| ❌ | Please enter your Access Code. |');
    return;
  }

  const recipient = 'presenter.simon@gmail.com';

  const plainBody = `
Hi,

A user has sent the following Remote Access code: ${remoteAccessCode}.

Best regards,
Your Support Team
  `;

  const htmlBody = `
    <p>Hi,</p>
    <p>A user has sent the following Remote Access code:</p>
    <p>
      <strong>${remoteAccessCode}</strong>
      <a href="#" onclick="navigator.clipboard.writeText('${remoteAccessCode}'); alert('Copied!'); return false;">
        <img src="https://demo.ishere.help/img/RemoteAccess_copy.png"  alt="Copy Code" width="20" height="20" style="cursor: pointer; vertical-align: middle;" />
      </a>
    </p>
    <p></p>
    <p>Access URL: <a href="https://remotedesktop.google.com/support/" target="_blank">https://remotedesktop.google.com/support/</a></p>
    <p>Best regards,<br>Your Support Team</p>
  `;

  try {
    const formData = new FormData();
    formData.append('recipients', recipient);
    formData.append('subject', `A user has sent a Remote Access Code`);
    formData.append('plain_body', plainBody);
    formData.append('html_body', htmlBody);

    const response = await fetch('https://project-marco-mailserver.vercel.app/sendInviteEmail', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      setResponseMessage('| **Status** | **Message** |\n|-----------|--------------------------------|\n| ✅ | Request sent successfully to: ' + recipient + ' |');
    } else {
      const errorText = await response.text();
      setResponseMessage('| **Status** | **Message** |\n|-----------|--------------------------------|\n| ❌ | Failed to send request. Error: ' + errorText + ' |');
    }
  } catch (error) {
    setResponseMessage('| **Status** | **Message** |\n|-----------|--------------------------------|\n| ❌ | An error occurred. Please try again later. |');
  }
};


  return (
    <Layout title="Remote Access" description="Get live support from technicians">
      <div style={{ maxWidth: '80%', margin: '0 auto', padding: '20px' }}>
        <h2>Allow Live Access</h2>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '20px',
          }}
        >
          {/* Table Section */}
          <div style={{ flex: 1 }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
          </div>

          {/* Image Section */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <img
              src={remoteAccessImg}
              alt="How to generate access code"
              style={{ width: '400px', maxWidth: '400px', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Buttons and Input Field Section */}
        <div id="primaryButtonsContainer" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
          {/* Button #1 - Generate Code */}
          <button
            className="primaryButton"
            onClick={() => window.open('https://remotedesktop.google.com/support', '_blank')}
          >
            1-Generate Code
          </button>

          {/* Input Field */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
            <span style={{ fontWeight: 'bold', color: '#000' }}>2.</span>
              <input
                type="text"
                value={remoteAccessCode}
                onChange={(e) => setRemoteAccessCode(e.target.value)}
                placeholder="Paste the 12-digit Access Code."
                className="primaryButton"
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '2px',
                  backgroundColor: '#fff', // White background
                  color: '#000', // Black text
                }}
              />
              <img
                  src={RemoteAccessPasteIcon}
                  alt="Paste Code"
                  onClick={handlePasteCode}
                  style={{ width: '24px', height: '24px', cursor: 'pointer' }}
                  title="Paste Code"
              />
            </div>

          {/* Button #2 - Send Request */}
          <button
            className="primaryButton"
            onClick={handleSendEmail}
          >
            3-Invite Now
          </button>
        </div>

        {/* Response Message Section */}
        {responseMessage && (
          <div style={{ marginTop: '2px' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{responseMessage}</ReactMarkdown>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RemoteAccess;
