# Plan Your Trip

A beginner-friendly MERN trip planner. The frontend uses React and Vite; the backend uses Express, Mongoose, and MongoDB. The first version uses sample data and does not require an account.

## Requirements

- Node.js 20.19+ or 22.12+
- A MongoDB connection string from MongoDB Atlas or a local MongoDB server

## Run Locally

1. In `backend/`, copy `.env.example` to `.env` and replace `MONGO_URI` with your own connection string. URL-encode special characters in the database username or password. Keep `.env` private.
2. Install backend packages, seed the sample data, and start the API:

   ```powershell
   cd backend
   npm install
   npm run seed
   npm run dev
   ```

3. In a second terminal, install frontend packages and start Vite:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

4. Open the local URL printed by Vite. Vite forwards `/api` requests to the backend on port `5000`.

The seed script can be run again safely; it updates the included destinations and their sample listings without deleting other records. The app includes Hyderabad, Goa, Bangalore, Delhi, and Mumbai.

Each itinerary activity needs a local destination start and end time in 24-hour format. The end must be later than the start; activities on the same day cannot overlap, but they can be back-to-back. The editor calculates and shows each activity's duration. Sample prices and ratings are illustrative. Photos use a matching category image when an exact venue photo is unavailable; not every image is a verified photo of that venue.

The frontend keeps one current trip plan in React memory only. Saving another replaces it, and refreshing or closing the app clears it. The database trip API exists but the frontend does not call it for saving plans.

## Main Pages

- `/` searches and lists destinations.
- `/destination/:id` shows destination details, tourist spots, hotels, and restaurants.
- `/trip/:id` lets you edit and save a trip itinerary.

`/trip/:id` opens a draft passed by the current app session; after a refresh, start again from a destination if that draft is no longer available.