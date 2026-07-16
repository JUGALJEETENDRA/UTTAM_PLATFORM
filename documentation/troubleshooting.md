# Troubleshooting Guide

This document outlines common errors, issues, and edge cases you might encounter while developing, deploying, or managing the Edtech Learning Platform, along with their solutions.

---

## 1. Build and Deployment Errors

### Error: `ERROR: NEXT_PUBLIC_GAS_URL is not defined in environment variables.`
- **Symptom:** Your GitHub Actions pipeline fails during the "Fetch Data from GAS" step.
- **Cause:** The GitHub Action is trying to execute the `scripts/fetch-data.js` file, but it cannot find your Google Apps Script URL.
- **Solution:** 
  1. Go to your GitHub Repository > **Settings** > **Secrets and variables** > **Actions**.
  2. Ensure you have added the `NEXT_PUBLIC_GAS_URL` repository secret and that the value is correct.

### Error: The "Deploy to Production" button does nothing / throws a CORS error.
- **Symptom:** Clicking the deploy button in the Faculty Dashboard fails, or you get a red error toast.
- **Cause:** Your Google Apps Script deployment permissions are likely too restrictive, or you updated the GAS code without creating a *New Deployment*.
- **Solution:**
  1. Go to Google Apps Script.
  2. Click **Deploy > New deployment** (Do NOT use "Manage deployments" unless you are intentionally creating a new version).
  3. Ensure **Execute as** is set to `Me` and **Who has access** is set to `Anyone`.
  4. Update your `.env.local` and GitHub Secrets with the *new* Web App URL if it changed.

---

## 2. Encryption and Authentication Errors

### Error: "You are not authorized for this subject. Please contact faculty."
- **Symptom:** A student logs in with Google on a private subject, but the login fails and they are denied access.
- **Cause:** The student's exact Google email address is not whitelisted for that subject.
- **Solution:** 
  1. Open your Google Sheets database.
  2. Go to the **AuthorizedStudents** sheet.
  3. Add the student's email address and the corresponding `subjectId`.
  4. Have the student refresh the page and try logging in again.

### Error: Students are authorized, but the page stays blank or the login loop continues.
- **Symptom:** A student successfully logs in, but the subject data does not decrypt or display properly.
- **Cause:** The `MASTER_DATA_KEY` in Google Apps Script was changed or regenerated, meaning the decryption keys handed to the students no longer match the encrypted data hosted on GitHub Pages.
- **Solution:**
  1. Simply click **"Deploy to Production"** in your Faculty Dashboard.
  2. The GitHub Action will fetch your data, re-encrypt it using the *new* keys, and publish it. The issue will be resolved as soon as the build finishes.

### Error: Faculty login is failing even with the correct password.
- **Symptom:** You type your password into the Faculty Login screen, but it rejects it.
- **Cause:** The SHA-256 hash in your `.env.local` file does not match the password you are typing.
- **Solution:**
  1. Generate a new hash for your desired password by running this in your terminal:
     `node -e "console.log(require('crypto').createHash('sha256').update('YOUR_NEW_PASSWORD').digest('hex'))"`
  2. Copy the output string and paste it into `.env.local` as `NEXT_PUBLIC_FACULTY_PASSWORD_HASH`.
  3. Restart your local development server (`npm run dev`).

---

## 3. Data Synchronization Issues

### Issue: I updated a module in Google Sheets, but students can't see the changes.
- **Symptom:** You made direct edits to the Google Sheet, but the live website still shows the old content.
- **Cause:** The student portal on GitHub Pages is purely static. It only updates when a new build is triggered.
- **Solution:**
  1. Go to your Faculty Dashboard.
  2. Click **Deploy to Production** to trigger the GitHub Action.
  3. Wait ~1 minute for the build to finish, then have the students refresh their browsers.

---

## 4. Local Development Quirks

### Error: `Module parse failed: Unexpected token... File size for Open Graph image...`
- **Symptom:** When running `npm run build` locally, Next.js crashes with a bizarre error mentioning an 8MB SVG file and an `Unexpected token`.
- **Cause:** If your project directory path contains an unescaped single quote, it breaks a specific internal Next.js compiler for metadata files like `icon.svg` or `icon.png`.
- **Solution:**
  1. Alternatively, remove `src/app/icon.svg` so the buggy Next.js loader is bypassed.
