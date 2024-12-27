# Chromebook Setup for Limited Access and Persistent Configuration

This document outlines the steps to configure a Chromebook for guest-like functionality with limited access to specific websites, automatic restoration to default, and remote management without using Google Workspace.

---

## **1. Exclude Google Workspace**
- The setup avoids Google Workspace to eliminate recurring costs and leverages free Google services and local Chromebook configurations.

---

## **2. Set up `user@ishere.help` with Persistent Session and No 2-Step Verification**
This process configures the user account `user@ishere.help` on Google's platform to ensure a seamless sign-in experience on the Chromebook.

### **Steps:**

1. **Create a Google Account:**
   - Go to [Google Account Creation](https://accounts.google.com/signup).
   - Create an account using the following details:
     - **Email:** `user@ishere.help`
     - **Password:** Choose a strong but manageable password that adheres to Google’s security requirements.

2. **Disable 2-Step Verification:**
   - Sign in to `user@ishere.help` at [Google Account](https://myaccount.google.com/).
   - Navigate to **Security > Signing in to Google > 2-Step Verification**.
   - If 2-Step Verification is enabled, turn it **off** to prevent additional verification steps during login.

3. **Simplify Security Checks:**
   - Add a **Recovery Email**:
     - Go to **Personal Info > Contact Info > Email**.
     - Add `simon@ishere.help` as a recovery email to handle potential account security issues.
   - Set up a **Trusted Device**:
     - Use a personal device (e.g., your computer or smartphone) to sign in to `user@ishere.help` and check "Don't ask again on this device" during the verification process.
   - Use a **Consistent Login Location**:
     - Log in to the account from a single, trusted network or location (e.g., your home or office Wi-Fi) to minimize Google's suspicious login checks.

4. **Enable Persistent Session:**
   - Sign in to the Chromebook with `user@ishere.help`.
   - During the login process, ensure you check the box for **"Stay signed in"**.
   - Avoid signing out unless necessary to maintain the persistent session.

5. **Verify Account Settings:**
   - Log in to the Chromebook with `user@ishere.help` to confirm:
     - The account does not trigger multi-step verification.
     - Persistent session settings work as expected.

---

## **3. Restore to Default**
### **Steps to Enable Ephemeral Users:**
1. Open the **Chrome OS Developer Shell (Crosh)** by pressing `Ctrl + Alt + T`.
2. Run the following command to enable ephemeral mode:
   ```shell
   set_policy --ephemeral_users_enabled=true
    ```
This setting ensures:
All user data is erased after logout or reboot.
The Chromebook resets to its default state for each new session.


## **4. Limit Access to Two Websites**
### **Using Chrome Extensions:**
1. Install **BlockSite** or **SiteBlock**:
   - Log in to `user@ishere.help`.
   - Open the Chrome Web Store and install the extension.
   - Configure the extension to:
     - Block all websites using a wildcard (`*`).
     - Allow only:
       - `https://demo.ishere.help`
       - `https://www.ishere.help`.

### **Alternative (chrome://policy):**
1. Open Chrome and navigate to `chrome://policy`.
2. Configure a URL Allowlist:
   - Add `https://demo.ishere.help` and `https://www.ishere.help` to the list of allowed websites.
   - Block all other websites.

### **Grant Camera and Microphone Access:**
- Go to **chrome://settings/content**.
- Set camera and microphone permissions to **Allow** for the allowed websites.

---

## **5. Allow Remote Login via Chrome Remote Desktop**
### **Steps:**
1. **Set Up Chrome Remote Desktop:**
   - Log in as `simon@ishere.help` on the Chromebook.
   - Install Chrome Remote Desktop from [Google’s Website](https://remotedesktop.google.com/).
   - Follow the prompts to set up remote access, including setting a secure PIN.
2. **Verify Remote Access:**
   - From another device, log in to [Chrome Remote Desktop](https://remotedesktop.google.com/) with `simon@ishere.help`.
   - Ensure you can remotely access and manage the Chromebook.

---

## **Workflow**
1. **Initial Setup**:
   - Set up `user@ishere.help` with Persistent Session and no 2-Step Verification.
   - Configure `simon@ishere.help` for admin tasks and enable Chrome Remote Desktop.

2. **User Workflow**:
   - Log in as `user@ishere.help` for general use with access limited to the two allowed websites.
   - Device automatically restores to default state after logout or reboot.

3. **Admin Workflow**:
   - Admin (`simon@ishere.help`) logs in locally or remotely to manage settings or reset the device.

---

## **Conclusion**
This setup ensures a cost-effective, secure, and functional Chromebook environment that:
- Allows two users (`user@ishere.help` and `simon@ishere.help`).
- Limits access to specific websites.
- Automatically restores to default after each session.
- Enables remote management via Chrome Remote Desktop.

