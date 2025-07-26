# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/ff713890-cb8d-492a-b1f7-3fddcc6ead8e

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ff713890-cb8d-492a-b1f7-3fddcc6ead8e) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Firebase (Firestore, Storage, Analytics)

## Firebase Configuration

This project uses Firebase for:
- **Firestore**: Real-time database for events and results
- **Storage**: Photo uploads for winners
- **Analytics**: Usage tracking
- **Authentication**: Admin login system

The Firebase configuration is set up in `src/lib/firebase.ts` with the following services:
- Project ID: `eventdata-4a298`
- Storage Bucket: `eventdata-4a298.firebasestorage.app`
- Analytics enabled for usage tracking
- Authentication enabled for admin access

### Admin Authentication
- **Email**: `suman@ssd.com`
- **Password**: `qweasd`
- The admin user is automatically created on first app startup
- Secure Firebase Authentication with proper error handling

## Firebase Setup Instructions

### 1. Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `eventdata-4a298`
3. Navigate to **Authentication** → **Sign-in method**
4. Click **"Get started"** or **"Email/Password"**
5. Enable **"Email/Password"** authentication
6. Click **Save**

### 2. Set up Firestore Security Rules
1. Go to **Firestore Database** → **Rules**
2. Replace the default rules with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all users (for development)
    // In production, you should add proper authentication checks
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
3. Click **Publish**

### 3. Set up Storage Rules (for photo uploads)
1. Go to **Storage** → **Rules**
2. Replace the default rules with:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read/write access to all users (for development)
    // In production, you should add proper authentication checks
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```
3. Click **Publish**

### 4. Test the Application
1. Run `npm run dev`
2. Check browser console for setup messages
3. Try logging in with the admin credentials

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ff713890-cb8d-492a-b1f7-3fddcc6ead8e) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
