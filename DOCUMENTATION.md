# Project Documentation Proposal

## 1. Project Overview

This project is a modern lead capture and booking system for salons and service-based businesses. It gives visitors a polished frontend where they can view services, submit their details, and send a booking or lead request through a secure form.

The system is designed for freelancers, agencies, and small businesses that want a clean way to collect leads without building a custom CRM from scratch. It is especially useful for businesses that want to organize inquiries, track submissions, and automate follow-up actions.

## 2. Features

- Lead capture form with a simple, conversion-friendly user interface.
- Airtable integration for storing leads in a structured database.
- API backend for handling form submission, validation, and secure data processing.
- Automation support for email or webhook workflows as an optional extension.
- Responsive UI that works well on desktop, tablet, and mobile devices.

## 3. Tech Stack

- React for the frontend interface.
- Node.js for server-side logic.
- Express-style API routes for handling lead submission.
- Airtable for storing and managing submitted leads.

## 4. Requirements

Before installing the project, make sure you have the following:

- Node.js installed on your computer.
- An Airtable account.
- A hosting platform such as Vercel or Render.
- A custom domain, if you want to connect your own brand URL. This is optional.

## 5. Installation Guide

### Step 1: Clone or Download the Project

Download the project files or clone the repository to your local machine.

### Step 2: Install Dependencies

Install the root dependencies and the frontend dependencies.

```bash
npm install
npm --prefix frontend install
```

### Step 3: Set Up Environment Variables

Create a `.env` file for your backend secrets and frontend public values. Add the required keys before running the project.

### Step 4: Run the Frontend

Start the frontend development server from the `frontend` folder.

```bash
npm --prefix frontend run dev
```

### Step 5: Run the Backend

This project uses a serverless API route for the backend. In production, the backend runs through Vercel automatically. For local testing, you can use Vercel’s local development workflow if needed.

## 6. Airtable Setup Guide

### How to Create a Base

1. Log in to Airtable.
2. Create a new base for your leads or bookings.
3. Add a table named `Bookings` or use your preferred table name.
4. Create the fields needed to store lead details.

### Required Fields

Set up the following fields in your Airtable table:

- Name
- Email
- Phone
- Source

You can also include optional fields such as Service, Date, Time, Message, and Booking ID for better tracking.

### Where to Get the API Key

Your Airtable API key or personal access token can be created from your Airtable account settings. Copy the token and add it to your environment variables.

## 7. Deployment Guide

### Deploy Frontend to Vercel

1. Push the project to GitHub or connect it directly to Vercel.
2. Set the frontend build output to `frontend/dist`.
3. Add your environment variables in the Vercel dashboard.
4. Deploy the project.

### Deploy Backend to Render

If you want to host the backend separately, you can deploy the API logic to Render or another Node.js-compatible platform. Make sure the environment variables are added to the backend service before deployment.

### Connect a Domain

1. Add your domain in your hosting provider.
2. Update DNS records at your domain registrar.
3. Wait for DNS propagation.
4. Test the site after the domain is connected.

## 8. Environment Variables Example

Below is a sample `.env` file you can use as a starting point:

```env
# Frontend
VITE_BOOKING_API_URL=/api/bookings
VITE_TURNSTILE_SITE_KEY=your_turnstile_site_key

# Backend
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
AIRTABLE_TABLE_NAME=Bookings
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
```

## 9. Customization Guide

### How to Change Text or Content

Update the main frontend content in the React source files. This includes headings, service descriptions, testimonials, call-to-action text, and form copy.

### How to Modify Form Fields

If you want to add or remove fields, update the form state, validation rules, and backend payload mapping so both sides stay in sync. You should also make sure the Airtable columns match the data being submitted.

## 10. Troubleshooting

- If the form does not submit, check that the API URL is correct and the backend is reachable.
- If Airtable does not receive records, confirm that the base ID, table name, and API key are valid.
- If captcha verification fails, make sure the Turnstile site key and secret key are set correctly.
- If validation errors appear unexpectedly, review the form field format for email, phone number, date, and time.
- If the frontend build fails, reinstall dependencies and confirm that Node.js is installed correctly.

## 11. Disclaimer

This is a self-hosted system. You are responsible for configuring your own hosting, Airtable account, domain, and third-party services. Optional automation such as email delivery or webhook handling may require additional setup depending on the provider you choose.

## Optional Email Automation Note

The project can be extended so that every new lead receives an automatic email after submission. This can be done by connecting the lead form to an email service, webhook, or automation platform. In that setup, the lead is first saved to Airtable, then an automated confirmation or follow-up email is sent to the submitted email address.
