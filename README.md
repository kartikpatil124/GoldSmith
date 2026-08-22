# 💎 Goldsmiths Jewels — Premium E-Commerce Platform

Welcome to **Goldsmiths Jewels**, a state-of-the-art, dynamic e-commerce platform crafted for fine luxury jewelry retail. Fully responsive, mobile-first, and equipped with a robust administrative Site Manager, this platform is optimized for seamless customer shopping and elite visual merchandising.

---

## ✨ Features & Highlights

### 📱 Premium Mobile-First & Touch-Friendly UI
* **Luxury Branding**: Centered around a premium color palette (Honeydew cream, rich charcoal, and custom gold gradients) with high-end typography (`Cormorant Garamond` and `Inter`).
* **Persistent Bottom Navigation**: Sleek, thumb-optimized bottom navbar with dynamic cart/wishlist badging, automatic route detection, and safe-area adjustments for mobile devices.
* **Responsive Layouts**: Flexible page elements, CSS auto-fit grid systems, and touch-scrollable administrative indices for clean displays across all viewports.
* **YouTube Ambient Loop Galleries**: Product media players support both uploaded MP4 files and embedded YouTube video URLs in high-fidelity custom looped media frames.

### ⚙️ Administrative Site Manager (`/admin/site-manager`)
A multi-tab control center integrated into the admin panel sidebar:
1. **Homepage Builder**: Modify dynamic layouts, visibility triggers, and re-order homepage blocks.
2. **Collection Manager**: Create and schedule custom seasonal Collections (e.g. "Royal Heritage").
3. **Banner Manager**: Schedule and assign desktop/mobile-specific promotional banners based on page keys and placements.
4. **Page Content Editor**: Directly update static page-level paragraphs, diamond quality indices, trust badges, and FAQ cards without code alterations.
5. **Product Placement Matrix**: Instantly assign inventory highlights (featured, best sellers, bridal catalog) and manage top-catalog pins.

---

## 🏗️ Architecture

The application is built using a modern decoupled architecture:
* **Frontend**: React + Vite SPA, managed with Context API and stylized with premium Vanilla CSS.
* **Backend**: Node.js Express REST API using Mongoose ODM, utilizing ES Modules (`import`/`export`) and JSON Web Token (JWT) session authorization.
* **Database**: MongoDB Atlas.

---

## 🌐 Production Deployment & Hosting Guide

Because the project is decoupled, we host the backend API and frontend client separately.

### 🗄️ Step 1: Database Setup (MongoDB Atlas)
1. Sign up for a free account on [MongoDB Atlas](https://www.mongodb.com/).
2. Create an **M0 (Free)** cluster and set up a new database user with password access.
3. In **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere) to permit cloud web services to connect.
4. Copy your Connection String, replacing `<password>` with your database user's password.

### ⚙️ Step 2: Deploy Backend API (Render)
1. Go to [Render](https://render.com/) and create a new **Web Service** connected to your GitHub repository.
2. Configure settings:
   * **Root Directory**: `backend`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
3. Expand **Environment Variables** and add:
   * `MONGO_URI`: *Your MongoDB connection string*
   * `PORT`: `5000`
   * `NODE_ENV`: `production`
   * `JWT_SECRET`: *A secure random string*
   * `CLIENT_URL`: *Your Frontend Vercel URL (Update after Step 3)*
4. Click **Create Web Service**. After deployment, navigate to the **Shell** tab and run the catalog seeder to inject exactly **50 high-end products**:
   ```bash
   node seedProducts.js
   ```

### 🎨 Step 3: Deploy Frontend Client (Vercel)
1. Sign in to [Vercel](https://vercel.com/) and import your GitHub repository.
2. Configure settings:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `./` (Keep as root)
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
3. Under **Environment Variables**, add:
   * `VITE_API_URL`: `https://your-backend-api-name.onrender.com/api` (Copy your Render API url and append `/api`)
4. Click **Deploy**.

### 🔄 Step 4: Final CORS Sync
Copy your newly generated Vercel frontend URL, go back to your **Render Environment Variables**, and set **`CLIENT_URL`** to that value. This enables secure session exchanges.

---

## 🔑 Default Administrator Credentials

To access the backend site builder:
* **Admin Login Route**: `/admin/login`
* **Email**: `admin@goldsmithsjewels.com`
* **Password**: `password123`

---

## 🛠️ Local Development

### 1. Setup Backend
```bash
cd backend
npm install
# Create a .env file based on .env.example
npm run dev
```

### 2. Setup Frontend
```bash
# In the root folder
npm install
# Create a .env file in the root with VITE_API_URL=http://localhost:5000/api
npm run dev
```
