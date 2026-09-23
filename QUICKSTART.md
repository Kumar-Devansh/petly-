# Petly Platform - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Extract the Files
Unzip the `petly-platform.zip` file to your desired location.

### Step 2: Start the Backend

Open a terminal/command prompt and run:

```bash
cd petly-platform/backend
npm install
npm start
```

You should see:
```
Petly Backend running on http://localhost:5000
```

✅ Backend is ready!

### Step 3: Start the Frontend

Open a new terminal/command prompt and run:

```bash
cd petly-platform/frontend
npm install
npm run dev
```

You should see:
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:3000/
```

### Step 4: Open in Browser

Click the link or go to `http://localhost:3000` in your web browser.

🎉 Petly is now running!

## 📱 Explore the App

### Main Features
1. **Dashboard** - Home page with stats and quick actions
2. **My Pets** - Add and manage your pets
3. **Vaccinations** - Track vaccination schedules
4. **Bookings** - Schedule pet care services
5. **Products** - Browse pet products
6. **Adoption** - Find adoptable pets
7. **Health Tips** - Get pet care advice
8. **AI Assistant** - Chat with pet care AI

## ⚙️ System Requirements

- **Node.js** v14 or higher
- **npm** v6 or higher (comes with Node.js)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## 🐛 Troubleshooting

### Problem: "npm command not found"
**Solution:** Install Node.js from https://nodejs.org

### Problem: Port 5000 already in use
**Solution:** Edit `backend/server.js` and change the PORT variable, or stop the process using port 5000

### Problem: Port 3000 already in use
**Solution:** Edit `frontend/vite.config.js` and change the port number

### Problem: CORS error in browser console
**Solution:** Make sure backend is running on http://localhost:5000

### Problem: Cannot connect to backend
**Solution:** 
1. Check if backend terminal shows "Petly Backend running"
2. Verify no firewall is blocking localhost:5000
3. Restart both frontend and backend

## 📝 Testing Features

### Add a Pet
1. Go to "My Pets"
2. Click "+ Add New Pet"
3. Fill in the form and submit

### Check Vaccinations
1. Go to "Vaccinations"
2. View vaccination records with status indicators

### Browse Products
1. Go to "Products"
2. Filter by category
3. View product details

### Chat with AI
1. Go to "AI Assistant"
2. Type a question about pet care
3. Get instant responses

## 🔧 Development Tips

### View Console Logs
Open browser DevTools:
- Chrome/Edge: `F12` or `Ctrl+Shift+I`
- Firefox: `F12` or `Ctrl+Shift+I`
- Safari: `Cmd+Option+I`

### Hot Reload
The frontend automatically reloads when you save file changes.

### API Testing
Backend API endpoints are available at `http://localhost:5000/api/*`

## 📚 Next Steps

1. **Customize** - Edit mock data in `backend/server.js`
2. **Styling** - Modify CSS files in `frontend/src/`
3. **Add Features** - Create new components and pages
4. **Database** - Connect to PostgreSQL (see README.md)

## 📖 Full Documentation

See `README.md` for:
- Complete API documentation
- Project structure details
- Technology stack information
- Future enhancements
- Customization guide

## 💡 Pro Tips

- Keep backend terminal open while developing
- Use browser DevTools to inspect network requests
- Check backend console for API errors
- Modify mock data in `backend/server.js` for testing

## 🆘 Need Help?

1. Check `README.md` for detailed documentation
2. Review error messages in browser console
3. Check backend terminal output
4. Verify all dependencies are installed

---

**Happy coding! 🐾**

Made with ❤️ for pet lovers
