# 🚀 BCoder Platform Deployment Guide

This guide will help you deploy the BCoder Online Learning Platform to production using Vercel (Frontend) and Railway (Backend).

## 📋 Prerequisites

1. **GitHub Account** - Your code is already on GitHub
2. **Vercel Account** - [Sign up here](https://vercel.com)
3. **Railway Account** - [Sign up here](https://railway.app)
4. **MongoDB Atlas Account** - [Sign up here](https://mongodb.com/atlas)

## 🗄️ Step 1: Set up MongoDB Atlas (Database)

1. **Create MongoDB Atlas Cluster**
   - Go to [MongoDB Atlas](https://mongodb.com/atlas)
   - Create a free cluster
   - Choose your preferred region
   - Create a database user with read/write permissions

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## 🔧 Step 2: Deploy Backend to Railway

1. **Connect Railway to GitHub**
   - Go to [Railway](https://railway.app)
   - Sign in with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `BCoder-Online-Platform-Project` repository

2. **Configure Backend Deployment**
   - Railway will detect it's a Node.js project
   - Set the root directory to `Backend`
   - Railway will automatically install dependencies and start the server

3. **Set Environment Variables**
   - In Railway dashboard, go to your project
   - Click "Variables" tab
   - Add the following environment variables:

   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here
   RAZORPAY_KEY_ID=rzp_test_1DP5mmOlF5G5ag
   RAZORPAY_KEY_SECRET=thisisasamplesecret
   SENDGRID_API_KEY=your_sendgrid_api_key_optional
   NODE_ENV=production
   ```

4. **Deploy**
   - Railway will automatically deploy when you push to GitHub
   - Get your backend URL (e.g., `https://your-app.railway.app`)

## 🌐 Step 3: Deploy Frontend to Vercel

1. **Connect Vercel to GitHub**
   - Go to [Vercel](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your `BCoder-Online-Platform-Project` repository

2. **Configure Frontend Deployment**
   - Set the root directory to `Frontend`
   - Framework preset: `Create React App`
   - Build command: `npm run build`
   - Output directory: `build`

3. **Set Environment Variables**
   - In Vercel dashboard, go to your project settings
   - Click "Environment Variables"
   - Add the following:

   ```env
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```

4. **Deploy**
   - Vercel will automatically deploy when you push to GitHub
   - Get your frontend URL (e.g., `https://your-app.vercel.app`)

## 🔄 Step 4: Update GitHub Repository

1. **Commit and Push Changes**
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. **Automatic Deployment**
   - Railway will automatically deploy the backend
   - Vercel will automatically deploy the frontend

## 🧪 Step 5: Test Your Deployment

1. **Test Backend API**
   - Visit: `https://your-backend-url.railway.app/api/health`
   - Should return: `{"message": "BCoder API is running successfully!"}`

2. **Test Frontend**
   - Visit your Vercel URL
   - Try logging in with demo credentials:
     - Student: `student@bcoder.com` / `student123`
     - Admin: `admin@bcoder.com` / `admin123`

3. **Test Payment Flow**
   - Enroll in a course
   - Complete the demo payment
   - Verify enrollment is created

## 🔧 Step 6: Production Environment Variables

### For Real Production (Optional)

If you want to use real Razorpay credentials:

1. **Get Real Razorpay Keys**
   - Sign up at [Razorpay](https://razorpay.com)
   - Get your live API keys from the dashboard
   - Update the environment variables in Railway

2. **Set up SendGrid (Optional)**
   - Sign up at [SendGrid](https://sendgrid.com)
   - Get your API key
   - Update the environment variables in Railway

## 📊 Monitoring and Maintenance

### Railway (Backend)
- Monitor logs in Railway dashboard
- Set up alerts for downtime
- Scale resources as needed

### Vercel (Frontend)
- Monitor performance in Vercel dashboard
- Set up custom domains if needed
- Enable analytics

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit sensitive data to GitHub
   - Use Railway's secure environment variable storage
   - Rotate JWT secrets regularly

2. **CORS Configuration**
   - Update CORS settings in backend for production domains
   - Only allow your Vercel domain

3. **Database Security**
   - Use MongoDB Atlas network access controls
   - Enable database encryption
   - Regular backups

## 🚨 Troubleshooting

### Common Issues

1. **Backend Not Starting**
   - Check Railway logs
   - Verify environment variables
   - Ensure MongoDB connection string is correct

2. **Frontend Can't Connect to Backend**
   - Verify `REACT_APP_API_URL` is correct
   - Check CORS settings
   - Ensure backend is running

3. **Payment Issues**
   - Verify Razorpay credentials
   - Check payment route logs
   - Test with demo credentials first

### Getting Help

- Check Railway logs for backend issues
- Check Vercel logs for frontend issues
- Review the application logs in the browser console

## 🎉 Success!

Your BCoder platform is now deployed and accessible worldwide! 

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`
- **API Health**: `https://your-backend.railway.app/api/health`

The Razorpay integration is working in demo mode for teaching purposes. For real payments, update the Razorpay credentials in Railway environment variables. 