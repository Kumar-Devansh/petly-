# Petly - Pet Care Platform

A comprehensive web-based pet care platform designed to help pet owners manage and access different pet-related services and information in one centralized location.

## Features

### Core Modules
- **Dashboard**: Overview of your pet care status and quick actions
- **My Pets**: Manage your pets' information and profiles
- **Vaccinations**: Track vaccination records and upcoming requirements
- **Bookings**: Manage pet care service appointments
- **Products**: Browse and explore pet care products
- **Adoption**: View adoptable pets from partner NGOs
- **Health Tips**: Access valuable pet health and care information
- **AI Assistant**: Interactive AI-powered pet care assistant

## Technology Stack

### Frontend
- React.js 18
- React Router DOM 6
- Axios
- Vite (build tool)
- CSS3

### Backend
- Node.js
- Express.js
- CORS support
- Mock data endpoints

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

The Pet Care Assistant uses an OpenAI-compatible chat completions model. Copy `backend/.env.example` to `backend/.env` and set `OPENAI_API_KEY`; `OPENAI_BASE_URL` and `OPENAI_MODEL` can select a compatible provider and model. The assistant returns a clear configuration error when the key is missing rather than substituting canned advice. Keep provider keys on the backend; never put them in frontend environment variables.

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

### Pets
- `GET /api/pets` - Get all pets
- `GET /api/pets/:id` - Get pet by ID
- `POST /api/pets` - Add new pet

### Vaccinations
- `GET /api/vaccinations` - Get all vaccinations
- `GET /api/vaccinations/:petId` - Get vaccinations for specific pet
- `POST /api/vaccinations` - Add vaccination record

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:petId` - Get bookings for specific pet
- `POST /api/bookings` - Create new booking

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Adoption
- `GET /api/adoptions` - Get all adoptable pets
- `GET /api/adoptions/:id` - Get adoption pet by ID

### Health Tips
- `GET /api/health-tips` - Get all health tips
- `GET /api/health-tips/:id` - Get health tip by ID

### AI Assistant
- `POST /api/assistant` - Send message to AI assistant

## Project Structure

```
petly-platform/
├── backend/
│   ├── server.js          # Express server with API endpoints
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MyPets.jsx
│   │   │   ├── Vaccinations.jsx
│   │   │   ├── Bookings.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Adoption.jsx
│   │   │   ├── HealthTips.jsx
│   │   │   └── AIAssistant.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Running Both Servers

### Option 1: Run separately in different terminals

Terminal 1:
```bash
cd backend
npm start
```

Terminal 2:
```bash
cd frontend
npm run dev
```

### Option 2: Build for production

Frontend build:
```bash
cd frontend
npm run build
```

This creates an optimized production build in the `dist` folder.

## Features Explained

### Dashboard
- Quick overview of pet statistics
- Recent activity feed
- Quick action buttons for common tasks

### My Pets
- View all your pets
- Add new pets with details
- Pet information cards with images

### Vaccinations
- Track vaccination history
- Monitor upcoming vaccinations
- See overdue vaccinations at a glance
- Status indicators (Completed, Upcoming, Overdue)

### Bookings
- Schedule pet care services
- Manage appointments
- Track booking status
- View service details and pricing

### Products
- Browse pet care products
- Filter by category
- View product ratings and prices
- Availability status

### Adoption
- Discover adoptable pets
- Partner NGO information
- Pet personality descriptions
- Adoption process integration

### Health Tips
- Organized health information
- Tips categorized by topic
- Veterinarian recommendations
- Preventive care guidance

### AI Assistant
- Interactive chat interface
- Pet care questions and answers
- Suggested questions for quick access
- Real-time responses

## Mock Data

The application comes with pre-populated mock data including:
- 3 sample pets
- 4 vaccination records
- 3 service bookings
- 4 pet products
- 3 adoptable pets
- 4 health tips

You can modify the mock data in `backend/server.js` to add more entries.

## Customization

### Adding New Data
Edit `backend/server.js` to add more mock data to the arrays:
- `mockPets`
- `mockVaccinations`
- `mockBookings`
- `mockProducts`
- `mockAdoptions`
- `mockHealthTips`

### Styling
- Global styles: `frontend/src/index.css`
- App styles: `frontend/src/App.css`
- Component styles: `frontend/src/components/[Component].css`
- Page styles: `frontend/src/pages/Pages.css`

### Colors
The app uses a purple gradient theme:
- Primary: `#667eea` and `#764ba2`
- Success: `#4CAF50`
- Info: `#2196F3`
- Danger: `#f44336`

## Future Enhancements

- Database integration (PostgreSQL with Drizzle ORM)
- User authentication with Clerk
- Real payment processing
- Email notifications
- Advanced AI features with better NLP
- Mobile app version
- Real-time notifications
- Multi-user support
- Pet medical history storage
- Veterinarian integration

## License

This project is open source and available for educational and commercial use.

## Support

For issues, questions, or suggestions, please create an issue in the repository.

## Author

Petly Platform - Pet Care Made Simple

---

Happy pet parenting! 🐾
