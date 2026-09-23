import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import https from 'node:https';
import http from 'node:http';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock Data
const mockPets = [
  { id: 1, name: 'Buddy', type: 'Dog', breed: 'Golden Retriever', age: 3, image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=85' },
  { id: 2, name: 'Whiskers', type: 'Cat', breed: 'Persian', age: 2, image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=85' },
  { id: 3, name: 'Max', type: 'Dog', breed: 'Labrador', age: 5, image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=800&q=85' }
];

const mockVaccinations = [
  { id: 1, petId: 1, vaccine: 'Rabies', date: '2024-01-15', nextDue: '2025-01-15', status: 'Completed' },
  { id: 2, petId: 1, vaccine: 'DHPP', date: '2024-02-20', nextDue: '2025-02-20', status: 'Completed' },
  { id: 3, petId: 2, vaccine: 'FVRCP', date: '2024-03-10', nextDue: '2025-03-10', status: 'Upcoming' },
  { id: 4, petId: 3, vaccine: 'Rabies', date: '2023-06-15', nextDue: '2025-06-15', status: 'Overdue' }
];

const mockBookings = [
  { id: 1, petId: 1, service: 'Grooming', provider: 'Happy Paws Salon', date: '2024-12-15', time: '10:00 AM', status: 'Confirmed', price: 50 },
  { id: 2, petId: 1, service: 'Veterinary Checkup', provider: 'Pet Care Clinic', date: '2024-12-20', time: '02:00 PM', status: 'Pending', price: 75 },
  { id: 3, petId: 2, service: 'Vaccination', provider: 'Pet Care Clinic', date: '2024-12-25', time: '11:00 AM', status: 'Confirmed', price: 60 }
];

const mockProducts = [
  { id: 1, name: 'Dog Food Premium', category: 'Food', price: 45.99, rating: 4.5, availability: 'In Stock', image: 'https://images.unsplash.com/photo-1589924691995-400DC9ecc119?auto=format&fit=crop&w=800&q=85' },
  { id: 2, name: 'Cat Litter Box', category: 'Accessories', price: 35.00, rating: 4.2, availability: 'In Stock', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=85' },
  { id: 3, name: 'Pet Bed Deluxe', category: 'Bedding', price: 89.99, rating: 4.8, availability: 'In Stock', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=85' },
  { id: 4, name: 'Dog Toy Set', category: 'Toys', price: 25.50, rating: 4.3, availability: 'Low Stock', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=85' }
];

const mockAdoptions = [
  { id: 1, name: 'Bella', type: 'Dog', breed: 'Mix', age: '1 year', description: 'Friendly and playful', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=85', ngo: 'Happy Paws NGO' },
  { id: 2, name: 'Shadow', type: 'Cat', breed: 'Black Cat', age: '6 months', description: 'Calm and affectionate', image: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=800&q=85', ngo: 'Feline Friends' },
  { id: 3, name: 'Rocky', type: 'Dog', breed: 'German Shepherd', age: '2 years', description: 'Energetic and loyal', image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&q=85', ngo: 'Rescue Dogs Foundation' }
];

const mockHealthTips = [
  { id: 1, title: 'Proper Nutrition for Dogs', category: 'Nutrition', content: 'Feed your dog high-quality food appropriate for their age and size. Consult with a vet for dietary recommendations.' },
  { id: 2, title: 'Regular Exercise Routine', category: 'Exercise', content: 'Dogs need at least 30 minutes of exercise daily. Adjust based on breed and age.' },
  { id: 3, title: 'Dental Care Tips', category: 'Health', content: 'Brush your pet\'s teeth regularly and schedule dental checkups annually.' },
  { id: 4, title: 'Cat Indoor Safety', category: 'Safety', content: 'Keep cats indoors to prevent injuries and diseases. Provide enrichment activities.' },
  { id: 5, title: 'Make Mealtime a Little Ritual', category: 'Nutrition', content: 'Use a complete food suited to your pet’s species and life stage. Measure portions consistently, keep fresh water available, and ask your vet before changing food for a health concern.' },
  { id: 6, title: 'Give Indoor Cats More to Explore', category: 'Enrichment', content: 'Rotate a few toys, offer safe places to climb or watch from, and make time for short interactive play sessions that let your cat chase and pounce.' },
  { id: 7, title: 'Make Walks About More Than Steps', category: 'Exercise', content: 'Let your dog pause to sniff and explore at a comfortable pace. Adjust the route and activity to your dog’s age, fitness, weather, and veterinarian’s advice.' },
  { id: 8, title: 'Build a Gentle Dental Routine', category: 'Health', content: 'Introduce tooth brushing gradually with pet-safe supplies. Your veterinary team can show you a comfortable technique and help spot concerns early.' },
  { id: 9, title: 'Keep the Litter Box Predictable', category: 'Hygiene', content: 'Scoop regularly and keep the box in a calm, easy-to-reach spot. A sudden change in litter habits can be a health signal, so check with your vet if it persists.' },
  { id: 10, title: 'Turn Grooming into a Check-In', category: 'Grooming', content: 'Short, calm brushing sessions help your pet get used to handling and give you a chance to notice changes in their coat, skin, ears, paws, or nails.' },
  { id: 11, title: 'Make Warm Days Easier', category: 'Seasonal Care', content: 'Plan outdoor time for cooler parts of the day, offer shade and water, and let your pet set the pace. Ask your vet about extra precautions for your pet’s health or breed.' },
  { id: 12, title: 'Help a New Pet Settle In', category: 'Behavior', content: 'Start with a quiet, comfortable space and a predictable routine. Let your new companion approach at their own pace, and reward calm curiosity with gentle attention.' }
];

// Dashboard Stats
app.get('/api/dashboard', (req, res) => {
  res.json({
    totalPets: mockPets.length,
    upcomingBookings: mockBookings.filter(b => b.status === 'Pending').length,
    overdueVaccinations: mockVaccinations.filter(v => v.status === 'Overdue').length,
    pets: mockPets,
    recentActivity: [
      'Buddy\'s grooming appointment confirmed',
      'Whiskers\' vaccination scheduled',
      'New product available: Premium Dog Food'
    ]
  });
});

// Pets Endpoints
app.get('/api/pets', (req, res) => {
  res.json(mockPets);
});

app.get('/api/pets/:id', (req, res) => {
  const pet = mockPets.find(p => p.id === parseInt(req.params.id));
  if (!pet) return res.status(404).json({ message: 'Pet not found' });
  res.json(pet);
});

app.post('/api/pets', (req, res) => {
  const newPet = { id: mockPets.length + 1, ...req.body };
  mockPets.push(newPet);
  res.status(201).json(newPet);
});

// Vaccinations Endpoints
app.get('/api/vaccinations', (req, res) => {
  res.json(mockVaccinations);
});

app.get('/api/vaccinations/:petId', (req, res) => {
  const vaccinations = mockVaccinations.filter(v => v.petId === parseInt(req.params.petId));
  res.json(vaccinations);
});

app.post('/api/vaccinations', (req, res) => {
  const newVaccination = { id: mockVaccinations.length + 1, ...req.body };
  mockVaccinations.push(newVaccination);
  res.status(201).json(newVaccination);
});

// Bookings Endpoints
app.get('/api/bookings', (req, res) => {
  res.json(mockBookings);
});

app.get('/api/bookings/:petId', (req, res) => {
  const bookings = mockBookings.filter(b => b.petId === parseInt(req.params.petId));
  res.json(bookings);
});

app.post('/api/bookings', (req, res) => {
  const newBooking = { id: mockBookings.length + 1, ...req.body };
  mockBookings.push(newBooking);
  res.status(201).json(newBooking);
});

app.put('/api/bookings/:id', (req, res) => {
  const booking = mockBookings.find(b => b.id === parseInt(req.params.id, 10));
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  for (const field of ['petId', 'service', 'provider', 'date', 'time', 'price', 'status']) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) booking[field] = req.body[field];
  }
  res.json(booking);
});

// Products Endpoints
app.get('/api/products', (req, res) => {
  res.json(mockProducts);
});

app.get('/api/products/:id', (req, res) => {
  const product = mockProducts.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// Adoption Endpoints
app.get('/api/adoptions', (req, res) => {
  res.json(mockAdoptions);
});

app.get('/api/adoptions/:id', (req, res) => {
  const adoption = mockAdoptions.find(a => a.id === parseInt(req.params.id));
  if (!adoption) return res.status(404).json({ message: 'Pet not found' });
  res.json(adoption);
});

// Health Tips Endpoints
app.get('/api/health-tips', (req, res) => {
  res.json(mockHealthTips);
});

app.get('/api/health-tips/:id', (req, res) => {
  const tip = mockHealthTips.find(t => t.id === parseInt(req.params.id));
  if (!tip) return res.status(404).json({ message: 'Tip not found' });
  res.json(tip);
});

const assistantSystemPrompt = `You are Petly's pet-care conversational assistant. Answer the user's actual question first, in a natural, direct voice. You can discuss dogs, cats, and other common companion animals. Treat the supplied conversation history as context: remember names, species, age, breed, weight, diet, symptoms, and preferences; resolve follow-ups from that context; do not repeat the user's details or your previous answer unless a short reference is useful. Match the level of detail to the question. Ask one clear follow-up only when a missing detail materially changes the answer, and give safe general guidance while asking when possible. Use headings, paragraphs, numbered steps, or bullets only when they improve clarity; honor requested list counts. For food guidance, distinguish nutritionally complete diets from treats and avoid presenting treats as meal replacements. Do not invent product facts, nutrient amounts, feeding quantities, vaccine schedules, diagnoses, or medication doses. If a feeding amount depends on calories or product labels, explain what information is needed and how to check it. You are not a veterinarian: do not diagnose or prescribe. For breathing problems, collapse, seizure, severe bleeding or pain, suspected poisoning, inability to urinate, or rapidly worsening symptoms, clearly recommend contacting an emergency veterinarian now. For concerning but non-emergency symptoms, explain what to monitor and when to arrange veterinary care. Never recommend human medication or risky home treatment. Avoid stock greetings, boilerplate closings, and generic wellness lists when the user asked a specific question.`;

const MAX_ASSISTANT_MESSAGE_LENGTH = 8000;
const MAX_HISTORY_MESSAGES = 16;
const MAX_HISTORY_MESSAGE_LENGTH = 3000;
const MAX_PROVIDER_RESPONSE_BYTES = 1024 * 1024;

class AssistantServiceError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

function buildAssistantMessages(history, message) {
  const context = (Array.isArray(history) ? history : [])
    .filter((entry) => entry && ['user', 'assistant'].includes(entry.role) && typeof entry.content === 'string')
    .slice(-MAX_HISTORY_MESSAGES)
    .map(({ role, content }) => ({ role, content: content.trim().slice(0, MAX_HISTORY_MESSAGE_LENGTH) }))
    .filter((entry) => entry.content);

  return [
    { role: 'system', content: assistantSystemPrompt },
    ...context,
    { role: 'user', content: message }
  ];
}

function postProviderJson(endpoint, payload, apiKey) {
  return new Promise((resolve, reject) => {
    const transport = endpoint.protocol === 'https:' ? https : endpoint.protocol === 'http:' ? http : null;
    if (!transport) return reject(new AssistantServiceError(500, 'The configured AI provider URL must use HTTP or HTTPS.'));

    const request = transport.request(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }, (response) => {
      let responseBody = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        responseBody += chunk;
        if (Buffer.byteLength(responseBody, 'utf8') > MAX_PROVIDER_RESPONSE_BYTES) {
          request.destroy(new AssistantServiceError(502, 'The AI provider response was too large.'));
        }
      });
      response.on('end', () => {
        let data;
        try {
          data = JSON.parse(responseBody);
        } catch {
          return reject(new AssistantServiceError(502, 'The AI provider returned an unreadable response.'));
        }

        if (response.statusCode < 200 || response.statusCode >= 300) {
          console.error(`Assistant provider returned HTTP ${response.statusCode}.`);
          return reject(new AssistantServiceError(502, 'The care assistant could not get a response from its AI provider. Please try again shortly.'));
        }
        resolve(data);
      });
    });

    request.setTimeout(30000, () => request.destroy(new AssistantServiceError(504, 'The care assistant took too long to respond. Please try again.')));
    request.on('error', (error) => reject(error instanceof AssistantServiceError
      ? error
      : new AssistantServiceError(502, 'The care assistant could not connect to its AI provider. Please try again shortly.')));
    request.end(JSON.stringify(payload));
  });
}

function extractProviderReply(data) {
  const content = data?.choices?.[0]?.message?.content;
  const reply = typeof content === 'string'
    ? content.trim()
    : Array.isArray(content)
      ? content.filter((part) => part?.type === 'text' && typeof part.text === 'string').map((part) => part.text).join('\n').trim()
      : '';
  if (!reply) throw new AssistantServiceError(502, 'The AI provider returned an empty response. Please try again.');
  return reply;
}

async function generateProviderReply(message, history) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new AssistantServiceError(503, 'The Pet Care Assistant is not configured yet. Set OPENAI_API_KEY in the backend environment, then restart the server.');
  }

  const baseUrl = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  let endpoint;
  try {
    endpoint = new URL(`${baseUrl}/chat/completions`);
  } catch {
    throw new AssistantServiceError(500, 'The configured AI provider URL is invalid.');
  }

  const data = await postProviderJson(endpoint, {
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    temperature: 0.55,
    max_tokens: 900,
    messages: buildAssistantMessages(history, message)
  }, apiKey);

  return { reply: extractProviderReply(data), topic: 'pet-care' };
}

// All substantive answers come from the configured conversational model.
app.post('/api/assistant', async (req, res) => {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  const history = Array.isArray(req.body?.history) ? req.body.history : [];

  if (!message) return res.status(400).json({ message: 'Please enter a pet care question.' });
  if (message.length > MAX_ASSISTANT_MESSAGE_LENGTH) {
    return res.status(413).json({ message: `Please keep each message under ${MAX_ASSISTANT_MESSAGE_LENGTH} characters.` });
  }

  try {
    res.json(await generateProviderReply(message, history));
  } catch (error) {
    const statusCode = error.statusCode || 502;
    if (!error.statusCode) console.error('Pet care assistant request failed:', error.message);
    res.status(statusCode).json({ message: error.message || 'The care assistant is temporarily unavailable. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Petly Backend running on http://localhost:${PORT}`);
});

export { assistantSystemPrompt, buildAssistantMessages, extractProviderReply, generateProviderReply };
