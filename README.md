# 🏌️‍♂️ GiveGolf - Premium Charity Subscription Platform

GiveGolf is a comprehensive MERN-stack subscription platform where passionate golfers can log their scores, enter monthly prize draws, and seamlessly donate a portion of their subscription to their favorite verified charities.

## 🚀 Features

*   **User Roles & Dashboards:** Distinct experiences for Public Visitors, Registered Subscribers, and Platform Administrators.
*   **Secure Subscriptions:** Integrated with **Stripe Checkout** for monthly and yearly memberships, checking active status on all secure routes.
*   **Stableford Score Management:** Allows golfers to record their 5 most recent rounds, automatically discarding older scores to maintain eligibility for draws.
*   **Monthly Draw Engine:** Admin-controlled draws (Random or Algorithmic) with a tiered prize pool (5-Match Jackpot, 4-Match, 3-Match).
*   **Winner Verification System:** Users who match numbers must upload proof of their score. Admins can verify the proof and execute exact payouts seamlessly via Stripe.
*   **Advanced Charity Integration:**
    *   Dynamic percentage-based contribution directly from subscriptions.
    *   Secure "Independent Donation" integrations via Stripe for one-off support.
    *   Charity Directory with featured causes and upcoming, date-tracked charity golf events.

## 🛠 Tech Stack

*   **Frontend:** React.js, Vite, React Router, Context API, Lucide React (Icons), Vanilla CSS (Responsive & Modern Design).
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB & Mongoose.
*   **Authentication:** JWT (JSON Web Tokens), bcryptjs.
*   **Payments & Payouts:** Stripe API.
*   **Email System:** Nodemailer (SMTP agnostic for production).

---

## 💻 Local Setup & Development

### 1. Requirements
Ensure you have Node.js and MongoDB installed on your system.

### 2. Installation
Clone the repository and install the dependencies for both the frontend and backend.
```bash
# Clone the repository
git clone https://github.com/pankajkumar9771369/Golf-Charity-Subscription-Platform.git
cd Golf-Charity-Subscription-Platform

# Install Backend
cd backend
npm install

# Install Frontend
cd ../frontend
npm install
```

### 3. Environment Variables (`.env`)
Create a `.env` file in your `backend` folder and populate it with your local development keys.

**`/backend/.env`**
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string
STRIPE_SECRET_KEY=your_stripe_test_or_live_secret_key

# Local Testing Fallback
EMAIL=your.email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

**`/frontend/.env`**
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Running the Application
Open two separate terminal windows:

**Terminal 1: Node Backend**
```bash
cd backend
node seed.js  # Optional: Generates the Admin account
node server.js
```

**Terminal 2: React Frontend**
```bash
cd frontend
npm run dev
```

The application is now accessible at `http://localhost:5173`!

---

## 🌍 Production Deployment

The platform is live and fully optimized for production!

*   **Frontend (Vercel):** [https://golf-charity-subscription-platform-woad.vercel.app/](https://golf-charity-subscription-platform-woad.vercel.app/)
*   **Backend (Render):** [https://golf-charity-subscription-platform-1.onrender.com/api](https://golf-charity-subscription-platform-1.onrender.com/api)

### Production Environment Configuration
Ensure these variables are set in your Render/Vercel dashboards for full functionality:

```env
# Essential Production Keys
FRONTEND_URL=https://golf-charity-subscription-platform-woad.vercel.app
RESEND_API_KEY=your_resend_api_key  # For robust HTTPS-based email delivery
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe Config
STRIPE_SECRET_KEY=your_live_secret_key
```

## 🔐 Default Admin Account
**Email:** `admin@golfcharity.com`
**Password:** `Admin1234!`
*(Ensure you run `node seed.js` once on your production database to create this user).*

---

*Built with ❤️ for Digital Heroes.*
