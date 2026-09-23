import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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
  { id: 4, title: 'Cat Indoor Safety', category: 'Safety', content: 'Keep cats indoors to prevent injuries and diseases. Provide enrichment activities.' }
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

const petTypePatterns = {
  dog: /\b(dog|puppy|puppies|hound|beagle|labrador|poodle|retriever|german shepherd|bulldog|terrier|golden retriever)\b/i,
  cat: /\b(cat|kitten|feline|tabby|siamese|persian|maine coon|bengal|ragdoll|domestic shorthair)\b/i
};

const urgencyPatterns = [
  /bleeding|blood\s+in\s+vomit|blood\s+in\s+stool|seizure|collapse|unresponsive|cannot\s+breathe|trouble\s+breathe|struggling\s+to\s+breathe|choking|poison|toxic|swollen\s+face|not\s+able\s+to\s+stand|severe\s+pain|straining\s+to\s+urinate|blocked\s+urination|ate.{0,30}(chocolate|grapes?|raisins?|xylitol|medication|pills?|antifreeze)|ingested.{0,30}(chocolate|grapes?|raisins?|xylitol|medication|pills?|antifreeze)/i,
  /emergency|urgent|critical|immediate/i
];

const healthIssuePatterns = {
  vomiting: /vomit|throw\s+up|regurgitat|nausea/i,
  diarrhea: /diarrhea|loose\s+stool|watery\s+stool|runny\s+poo/i,
  itching: /itching|scratch|scratching|itchy|fur\s+loss|redness/i,
  limping: /limp|lameness|paw\s+pain|sore\s+leg|hurt\s+leg/i,
  sneezing: /sneeze|cough|wheezing|nasal\s+discharge|runny\s+nose/i,
  ear: /ear\s+infection|ear\s+itch|head\s+shaking|ear\s+pain|ear\s+clean/i,
  skin: /skin\s+lesion|rash|hot\s+spot|mange|flea|ticks|tick/i,
  urinary: /urinat|accident|housebreak|straining\s+to\s+urinate|blood\s+in\s+urine|not\s+urinating/i
};

function normalizeText(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function detectPetType(text = '') {
  const lower = normalizeText(text).toLowerCase();
  if (petTypePatterns.dog.test(lower)) return 'dog';
  if (petTypePatterns.cat.test(lower)) return 'cat';
  return null;
}

function extractAge(text = '') {
  const match = normalizeText(text).match(/\b(\d+)\s*(week|weeks|month|months|year|years)\b/i);
  if (!match) return null;
  return `${match[1]} ${match[2]}`;
}

function detectIssue(text = '') {
  const lower = normalizeText(text).toLowerCase();
  for (const [key, pattern] of Object.entries(healthIssuePatterns)) {
    if (pattern.test(lower)) return key;
  }
  return null;
}

function buildClarifyingQuestion({ petType, age, issue, prompt }) {
  const details = [];
  if (!petType) details.push('whether this is for a dog or a cat');
  if (!age && /\b(dog|cat|puppy|kitten|adult|senior)\b/i.test(prompt)) details.push('the pet\'s age or life stage');
  if (!issue && /\b(vomit|diarrhea|itch|limp|cough|sneeze|scratch|bath|food|walk|behavior)\b/i.test(prompt)) details.push('the main symptom or concern');

  if (!details.length) {
    return 'I can help with pet care, but I need a little more detail to give you a safe recommendation. What kind of pet is it, and what is the main issue or goal?';
  }

  return `I can help with that, but I need a little more detail about ${details.join(', ')} so I can give advice that fits your pet.`;
}

function detectRequestType(prompt = '') {
  const text = normalizeText(prompt).toLowerCase();

  if (/vaccin|rabies|shot|booster|vaccine/.test(text)) return 'vaccination';
  if (/not eating|won't eat|refus(?:es|ing) food|loss of appetite|no appetite|poor appetite/.test(text)) return 'health';
  if (/food|diet|feed|nutrition|treat|weight|\beat\b|eating|meal|tuna|snack|calorie/.test(text)) return 'nutrition';
  if (/exercise|walk|play|activity|training|train|run|fetch/.test(text)) return 'exercise';
  if (/groom|bath|brush|nail|coat|fur|ear|clean/.test(text)) return 'grooming';
  if (/behavior|bark|bite|scratch|litter|housebreak|accident|aggression|anxious|stress/.test(text)) return 'behavior';
  if (/vomit|diarrhea|itch|limp|cough|sneeze|fever|lethargy|pain|sick|ill|symptom|unwell/.test(text)) return 'health';
  if (/how much time|how long|time.*take|takes.*long|duration/.test(text)) return 'timing';
  return 'general-care';
}

function requestedSuggestionCount(prompt = '') {
  const match = normalizeText(prompt).toLowerCase().match(/\b(\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten)\b/);
  if (!match) return 5;
  const wordCounts = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
  return Math.min(10, Math.max(1, Number(match[1]) || wordCounts[match[1]] || 5));
}

function buildFoodSuggestions(petType, count) {
  const ideas = petType === 'cat'
    ? [
        'A complete-and-balanced wet cat food for your cat’s life stage.',
        'A complete-and-balanced dry cat food, if it suits your cat’s needs and routine.',
        'Plain, fully cooked chicken with no bones, skin, salt, or seasoning as an occasional treat.',
        'Plain, fully cooked turkey with no bones or seasoning as an occasional treat.',
        'A small piece of fully cooked, unseasoned egg as an occasional treat.'
      ]
    : [
        'A complete-and-balanced dry dog food matched to your dog’s life stage.',
        'A complete-and-balanced wet dog food matched to your dog’s life stage.',
        'Plain, fully cooked chicken with no bones, skin, salt, or seasoning as an occasional treat.',
        'Plain, fully cooked egg as an occasional treat.',
        'Plain pumpkin puree with no added sugar or spices as an occasional topper.'
      ];

  return ideas.slice(0, count);
}

function isFoodSuggestionRequest(prompt = '') {
  const text = normalizeText(prompt).toLowerCase();
  return /food|meal|feed|eat|diet|treat|snack|nutrition/.test(text)
    && /suggest|recommend|list|ideas|options|give me|name|top|\b\d+\b|one|two|three|four|five|six|seven|eight|nine|ten/.test(text);
}

function buildFallbackPromptReply({ prompt, petType }) {
  const petLabel = petType === 'dog' ? 'dog' : petType === 'cat' ? 'cat' : 'pet';
  const type = detectRequestType(prompt);

  if (type === 'timing') {
    return formatStructuredReply({
      summary: 'A good rule is to keep care routines short, consistent, and suited to your pet’s age and fitness level.',
      actions: [
        'Exercise: many adult dogs need 30–90 minutes daily; cats usually do best with several short play sessions.',
        'Grooming: brushing often takes 10–30 minutes, while nail trimming or coat care may take longer.',
        'Training: short 5–15 minute sessions repeated several times a day usually work better than a single long session.'
      ],
      warning: 'If your pet looks unusually tired, painful, or less active, reduce activity and check with a vet.'
    });
  }

  if (type === 'nutrition') {
    if (isFoodSuggestionRequest(prompt)) {
      return 'I can make a safe shortlist. What kind of pet is this for (dog, cat, or another animal)? Their age or life stage will help me tailor the ideas.';
    }
    return formatStructuredReply({
      summary: `For a ${petLabel}, a balanced diet starts with a complete food for the correct life stage and a healthy weight range.`,
      actions: [
        'Choose food made for the right species, age, and activity level.',
        'Keep treats limited and measure portions instead of guessing.',
        'Introduce diet changes gradually over several days.'
      ],
      warning: 'Sudden appetite changes, vomiting, diarrhea, weight loss, or poor coat condition should be reviewed by a vet.'
    });
  }

  if (type === 'exercise') {
    return formatStructuredReply({
      summary: `A ${petLabel} usually benefits from regular, age-appropriate movement rather than one long burst of activity.`,
      actions: [
        'Use daily walks, play, or enrichment that matches the pet’s health and stamina.',
        'Puppies and kittens usually need shorter, more frequent sessions.',
        'Older or recovering pets often need gentler routines.'
      ],
      warning: 'Limping, panting hard, sudden fatigue, or reluctance to move should be checked by a vet.'
    });
  }

  if (type === 'grooming') {
    return formatStructuredReply({
      summary: `Regular grooming is one of the easiest ways to keep a ${petLabel} comfortable and healthy.`,
      actions: [
        'Brush according to coat type and look for mats, redness, or skin irritation.',
        'Check ears, paws, and nails during routine care.',
        'Avoid harsh products and any grooming step that causes obvious pain.'
      ],
      warning: 'Persistent redness, ear discharge, sores, or severe scratching should be examined by a vet.'
    });
  }

  if (type === 'behavior') {
    return formatStructuredReply({
      summary: `For a ${petLabel}, behavior usually improves when routines are predictable and rewards are consistent.`,
      actions: [
        'Use positive reinforcement and keep training sessions brief.',
        'Track triggers like visitors, noise, or schedule changes.',
        'Look for stress signs like hiding, pacing, or litter-box changes.'
      ],
      warning: 'Sudden aggression, hiding, or pain-related behavior needs veterinary attention.'
    });
  }

  if (type === 'health') {
    return formatStructuredReply({
      summary: `If a ${petLabel} seems unwell, the most useful next step is to monitor appetite, hydration, energy level, and any symptoms carefully.`,
      actions: [
        'Check if the pet is eating, drinking, and acting normally.',
        'Note the main symptoms, when they started, and whether they are getting worse.',
        'Keep the pet calm and avoid giving human medicines unless a vet advises it.'
      ],
      warning: 'If there is breathing difficulty, collapse, severe pain, repeated vomiting, bloody diarrhea, seizure, or sudden weakness, contact a veterinarian or emergency clinic promptly.'
    });
  }

  return formatStructuredReply({
    summary: `A healthy ${petLabel} routine is built around balanced food, regular exercise, clean living conditions, and routine monitoring of appetite, behavior, and body condition.`,
    actions: [
      'Keep feeding, sleep, and play routines consistent.',
      'Watch for appetite, weight, coat, and bathroom changes.',
      'Schedule regular preventive care with a vet.'
    ],
    warning: 'If your pet seems painful, weak, or suddenly different from normal, a veterinary check is the safest next step.'
  });
}

function formatStructuredReply({ summary, actions = [], warning = '' }) {
  const parts = [summary];

  if (actions.length) {
    parts.push('');
    parts.push('What to do:');
    actions.forEach((step) => parts.push(`• ${step}`));
  }

  if (warning) {
    parts.push('');
    parts.push(`When to call a vet: ${warning}`);
  }

  return parts.join('\n');
}

function buildGeneralPetCareReply({ petType, issue, prompt }) {
  const petLabel = petType === 'dog' ? 'dog' : petType === 'cat' ? 'cat' : 'pet';
  const isDog = petType === 'dog';
  const isCat = petType === 'cat';

  if (isFoodSuggestionRequest(prompt)) {
    if (!isDog && !isCat) {
      return 'I can suggest options. What kind of pet do you have (dog, cat, or another animal), and what is their age or life stage?';
    }
    const count = requestedSuggestionCount(prompt);
    const ideas = buildFoodSuggestions(petType, count);
    const numberedIdeas = ideas.map((idea, index) => `${index + 1}. ${idea}`).join('\n');
    const safetyNote = isCat
      ? 'Use complete cat food as the main diet; the cooked foods above are treats, not balanced meals. Avoid seasoned foods, bones, and making tuna a daily staple.'
      : 'Use complete dog food as the main diet; the cooked foods above are treats or toppers, not balanced meals. Avoid seasoned foods, cooked bones, chocolate, grapes or raisins, onion, garlic, and xylitol.';

    return `${ideas.length} food ideas for your ${petLabel}:\n\n${numberedIdeas}\n\n${safetyNote}\n\nTell me your pet’s age and any allergies or health conditions, and I can narrow this down.`;
  }

  if (/vaccin|rabies|shot|booster|vaccine/.test(prompt)) {
    return formatStructuredReply({
      summary: `${isDog ? 'For dogs' : isCat ? 'For cats' : 'For pets'} vaccines are based on age, lifestyle, local risk, and whether they spend time outdoors or around other animals. A consistent vaccine schedule is important for protection and routine prevention.`,
      actions: [
        'Keep a simple vaccine record and follow the schedule recommended for your pet’s age and lifestyle.',
        'Puppies and kittens usually need a core series followed by boosters.',
        'Call your veterinarian if a vaccine is overdue or if your pet has a reaction after vaccination.'
      ],
      warning: 'Missed doses, unusual lethargy, facial swelling, vomiting, or breathing issues after vaccination should be checked promptly by a vet.'
    });
  }

  if (/diet|food|feed|nutrition|treat|weight|\beat\b|eating|meal|tuna|snack|calorie/.test(prompt)) {
    const foodAdvice = isDog
      ? 'Choose a complete and balanced dog food for their life stage, and keep treats to a small part of their calorie intake.'
      : isCat
        ? 'Choose a complete and balanced cat food suited to their age, weight, and activity level, and make sure fresh water is always available.'
        : 'Choose a complete food designed for the species and life stage, and avoid heavy treats or sudden changes without veterinary guidance.';

    return formatStructuredReply({
      summary: `${foodAdvice} The best food depends on age, body condition, activity level, and any health concerns.`,
      actions: [
        'Measure portions rather than free-feeding unless your vet advises it.',
        'Transition foods gradually over 5–7 days if changing diet.',
        'Watch for vomiting, diarrhea, excessive weight loss, or poor appetite after switching foods.'
      ],
      warning: 'If your pet has chronic GI issues, weight loss, or a sudden appetite change, a vet should review the diet plan.'
    });
  }

  if (/exercise|walk|play|activity|training|train/.test(prompt)) {
    const exerciseAdvice = isDog
      ? 'Most adult dogs do best with daily walks, sniffing time, and play that match their age, breed, fitness, and weather tolerance.'
      : isCat
        ? 'Cats do well with short daily play sessions, climbing space, and toys that encourage stalking, chasing, and pouncing.'
        : 'Exercise should be tailored to the animal’s age, mobility, and body condition, with short, regular activity usually being better than intense sessions.';

    return formatStructuredReply({
      summary: `${exerciseAdvice} It is best to start with short sessions and build up gradually.`,
      actions: [
        'Aim for consistent daily movement rather than a single long session.',
        'Puppies and kittens often need shorter, more frequent activity bursts.',
        'Senior or recovering pets may need gentler routines and more rest.'
      ],
      warning: 'Sudden weakness, limping, panting, or reluctance to move should be assessed by a veterinarian.'
    });
  }

  if (/groom|bath|brush|nail|coat|fur|ear|clean/.test(prompt)) {
    const groomingAdvice = isDog
      ? 'Brush according to coat type, inspect ears and paws regularly, and trim nails before they become too long or painful.'
      : isCat
        ? 'Brush regularly to reduce shedding and hairballs, and check ears, paws, and teeth for signs of irritation.'
        : 'Regular grooming helps skin, coat, and overall comfort, especially in pets with long hair or dense coats.';

    return formatStructuredReply({
      summary: `${groomingAdvice} Regular maintenance prevents matting, skin issues, and discomfort.`,
      actions: [
        'Check for redness, lumps, bad odor, or signs of pain during grooming.',
        'Use pet-safe products and avoid deep ear cleaning unless advised.',
        'Stop and reassess if grooming causes bleeding, obvious pain, or swelling.'
      ],
      warning: 'Persistent redness, ear discharge, skin sores, or severe scratching needs a vet review.'
    });
  }

  if (/behavior|bark|bite|scratch|litter|housebreak|accident|aggression|anxious|stress/.test(prompt)) {
    const behaviorAdvice = isDog
      ? 'Reward the calm, wanted behavior, keep training brief, and use positive reinforcement instead of punishment.'
      : isCat
        ? 'Provide vertical spaces, scratching surfaces, and predictable routines to reduce stress and litter issues.'
        : 'Behavior is often best improved with consistency, enrichment, and a calm routine.';

    return formatStructuredReply({
      summary: `${behaviorAdvice} Sudden behavior shifts can be a sign of stress or discomfort, not just training issues.`,
      actions: [
        'Keep routines consistent for feeding, play, and rest.',
        'Track triggers such as visitors, loud noises, or changes in schedule.',
        'Use calm, reward-based methods for re-training and confidence building.'
      ],
      warning: 'Aggression, hiding, a sudden avoidance of food or litter, or signs of pain should be checked by a vet.'
    });
  }

  if (/how much time|how long|time.*take|takes.*long|duration/.test(prompt)) {
    return formatStructuredReply({
      summary: 'Typical timelines depend on the pet and the task, but a practical rule is to keep sessions short, consistent, and appropriate for age and fitness.',
      actions: [
        'Exercise: many adult dogs need 30–90 minutes daily; cats usually do best with 15–30 minutes of play and enrichment.',
        'Grooming: brushing often takes 10–30 minutes, while coat care or nail trims may take longer depending on coat length and condition.',
        'Training: short 5–15 minute sessions repeated several times a day are usually more effective than one long session.'
      ],
      warning: 'If a pet seems unusually tired, painful, or less active than normal, do not push exercise or grooming and discuss it with a vet.'
    });
  }

  if (issue === 'vomiting') {
    return formatStructuredReply({
      summary: `For a ${petLabel} with vomiting, monitor whether it is a single episode or repeated, and note if there is diarrhea, lethargy, appetite loss, or blood.`,
      actions: [
        'Offer small amounts of water once they are calm and able to drink normally.',
        'Avoid sudden diet changes or rich treats until the stomach settles.',
        'Keep a note of how often vomiting occurs and whether there are other symptoms.'
      ],
      warning: 'If vomiting continues, there is blood, or your pet is weak, lethargic, dehydrated, or refusing food, please contact a veterinarian promptly.'
    });
  }

  if (issue === 'diarrhea') {
    return formatStructuredReply({
      summary: `For a ${petLabel} with diarrhea, keep water available and monitor frequency, consistency, and any changes in appetite or energy.`,
      actions: [
        'Do not give human medications unless your veterinarian specifically advises it.',
        'Watch for vomiting, lethargy, blood in the stool, or signs of dehydration.',
        'A sudden diet change or stress may be contributing, but persistent diarrhea needs attention.'
      ],
      warning: 'Frequent diarrhea, blood in the stool, or a pet that is weak, vomiting, or refusing food should be checked by a vet.'
    });
  }

  if (issue === 'itching') {
    return formatStructuredReply({
      summary: `For a ${petLabel} with itching or scratching, check for fleas, skin redness, hot spots, or a new product that may be irritating the skin.`,
      actions: [
        'Keep the pet from licking or chewing the area.',
        'Look for hair loss, red patches, or sores.',
        'Avoid over-bathing unless your vet or groomer recommends it.'
      ],
      warning: 'If the itching is severe, spreading, or accompanied by sores, hair loss, or widespread redness, a vet should examine the pet.'
    });
  }

  if (issue === 'limping') {
    return formatStructuredReply({
      summary: `For a ${petLabel} that is limping, rest and avoid strenuous activity while you assess for swelling, pain, or a cut.`,
      actions: [
        'Check the paw and leg for a foreign object, swelling, or injury.',
        'Keep activity low and watch whether the limp is improving or worsening.',
        'Use a calm, quiet space while the pet rests.'
      ],
      warning: 'Severe limping, sudden worsening, or limping that lasts more than a day deserves veterinary assessment.'
    });
  }

  if (issue === 'sneezing') {
    return formatStructuredReply({
      summary: `For a ${petLabel} with sneezing or mild coughing, watch for nasal discharge, eye irritation, appetite changes, or fever.`,
      actions: [
        'Avoid smoke, harsh cleaners, and irritants around the pet.',
        'Watch for worsening symptoms or changes in breathing.',
        'Keep the pet hydrated and comfortable.'
      ],
      warning: 'If symptoms worsen, breathing becomes difficult, or the pet seems lethargic, call a veterinarian.'
    });
  }

  if (issue === 'ear') {
    return formatStructuredReply({
      summary: `For a ${petLabel} with ear discomfort, avoid inserting anything deep into the ear canal and monitor for odor, redness, or discharge.`,
      actions: [
        'Keep the ear clean and dry.',
        'Look for head shaking, pain, or repeated scratching.',
        'Do not use home remedies or cotton swabs deep inside the ear.'
      ],
      warning: 'Persistent ear pain, discharge, or odor is a good reason to have a vet examine the ear.'
    });
  }

  return formatStructuredReply({
    summary: `For general ${petLabel} care, focus on nutrition, hydration, routine exercise, preventive care, and close observation of appetite, energy, body condition, and bathroom habits.`,
    actions: [
      'Keep feeding, water, and sleep routines consistent.',
      'Monitor energy, body weight, coat condition, and behavior for changes.',
      'Schedule routine vet visits to catch early concerns before they become bigger problems.'
    ],
    warning: 'If you tell me the pet type, age, and the main concern, I can give more specific guidance for the situation.'
  });
}

function generateAssistantReply(message, history = []) {
  const normalizedMessage = normalizeText(message);
  if (!normalizedMessage) {
    return {
      reply: 'Please share a pet care question so I can help you with practical, species-appropriate advice.',
      needsDetails: false,
      topic: 'general'
    };
  }

  const historyText = history.map((entry) => normalizeText(typeof entry === 'string' ? entry : entry?.content || ''));
  const latestUserContext = [...history]
    .reverse()
    .find((entry) => (typeof entry === 'string' || entry?.role === 'user') && (typeof entry === 'string' ? entry : entry.content));
  const latestUserText = typeof latestUserContext === 'string' ? latestUserContext : latestUserContext?.content || '';
  const currentPetType = detectPetType(normalizedMessage);
  const contextualPetType = detectPetType(latestUserText);
  const contextText = [latestUserText, normalizedMessage].filter(Boolean).join(' ');
  const isFollowUp = /\b(more|another|different|same for|what about|and for|instead|those|that list)\b/i.test(normalizedMessage);
  const intentPrompt = isFollowUp ? `${latestUserText} ${normalizedMessage}` : normalizedMessage;

  // Prefer details from the current question, then the latest user turn. Older turns
  // should not override a correction (for example, switching from a dog to a cat).
  const detectedPetType = currentPetType || contextualPetType;
  const detectedIssue = detectIssue(normalizedMessage) || detectIssue(latestUserText);
  const urgent = urgencyPatterns.some((pattern) => pattern.test(normalizedMessage));

  if (urgent) {
    return {
      reply: 'This could be an emergency. Please contact a veterinarian or the nearest emergency animal hospital promptly. Do not give human medicine, and do not try to diagnose or treat the problem over the phone without veterinary guidance. If your pet is struggling to breathe, collapsed, bleeding heavily, or having a seizure, seek emergency care immediately.',
      needsDetails: false,
      topic: 'urgent-care'
    };
  }

  if (!detectedPetType && !/\b(dog|cat|pet|puppy|kitten)\b/i.test(normalizedMessage) && !historyText.some((entry) => /\b(dog|cat|puppy|kitten)\b/i.test(entry || ''))) {
    const requestType = detectRequestType(intentPrompt);
    const fallbackReply = buildFallbackPromptReply({
      prompt: intentPrompt,
      petType: detectedPetType || 'pet'
    });

    const shouldStillAnswerGenerally = ['timing', 'nutrition', 'exercise', 'grooming', 'behavior', 'general-care'].includes(requestType);

    return {
      reply: shouldStillAnswerGenerally
        ? fallbackReply
        : `${buildClarifyingQuestion({ petType: detectedPetType, age: extractAge(contextText), issue: detectedIssue, prompt: normalizedMessage })}\n\n${fallbackReply}`,
      needsDetails: !shouldStillAnswerGenerally,
      topic: requestType
    };
  }

  const reply = buildGeneralPetCareReply({
    petType: detectedPetType,
    issue: detectedIssue,
    prompt: intentPrompt
  });

  const missingInfo = [];
  if (!detectedPetType) missingInfo.push('pet type');

  return {
    reply: missingInfo.length
      ? `${buildClarifyingQuestion({ petType: detectedPetType, age: extractAge(contextText), issue: detectedIssue, prompt: normalizedMessage })}\n\n${reply}`
      : reply,
    needsDetails: missingInfo.length > 0,
    topic: detectRequestType(intentPrompt)
  };
}

const assistantSystemPrompt = `You are Petly's conversational pet-care assistant. Answer the actual question directly, naturally, and with useful specificity. You support dogs, cats, and common companion animals. Use prior turns to resolve pronouns and follow-ups, remember pet type/age/name and details the user shared, and do not ask for details already given. When the user requests a number of suggestions, honor that count in a numbered list and add a short reason or use note for each. For food recommendations, distinguish complete-and-balanced pet food from occasional treats, avoid unsupported brand endorsements, and ask for species or life stage only when needed. For straightforward questions, be concise; for complex questions, organize practical steps with bullets or short headings. Ask one focused clarifying question when missing information materially changes the guidance, while offering safe general context where possible. Never claim to diagnose, prescribe, or replace a veterinarian; do not recommend human medicines or unsupported home remedies. Be explicit about uncertainty. For breathing difficulty, collapse, seizure, severe bleeding/pain, suspected poisoning, or other rapidly worsening symptoms, advise contacting an emergency veterinarian now. For non-emergency symptoms, explain what to observe and when a veterinary assessment is appropriate. Do not repeat generic introductions or boilerplate disclaimers. Avoid inventing facts, doses, schedules, or precise recommendations that depend on local veterinary guidance.`;

async function generateProviderReply(message, history) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const endpoint = `${(process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '')}/chat/completions`;
  const conversation = history
    .filter((entry) => entry && ['user', 'assistant'].includes(entry.role) && typeof entry.content === 'string')
    .slice(-12)
    .map(({ role, content }) => ({ role, content: content.slice(0, 2500) }));
  conversation.push({ role: 'user', content: message });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.45,
      max_tokens: 700,
      messages: [{ role: 'system', content: assistantSystemPrompt }, ...conversation]
    }),
    signal: AbortSignal.timeout(30000)
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error(`Assistant provider returned ${response.status}: ${detail.slice(0, 500)}`);
    throw new Error('The care assistant is temporarily unavailable. Please try again in a moment.');
  }
  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new Error('The care assistant returned an empty response. Please try again.');
  return { reply, topic: 'pet-care', needsDetails: false };
}

// Uses an OpenAI-compatible chat endpoint when configured; preserves a local care-guidance fallback.
app.post('/api/assistant', async (req, res) => {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  const history = Array.isArray(req.body?.history) ? req.body.history : [];

  if (!message) return res.status(400).json({ message: 'Please enter a pet care question.' });

  try {
    const result = await generateProviderReply(message, history) || generateAssistantReply(message, history);
    res.json(result);
  } catch (error) {
    res.status(503).json({ message: error.message || 'The care assistant is temporarily unavailable. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Petly Backend running on http://localhost:${PORT}`);
});

export { generateAssistantReply, detectPetType, extractAge, detectIssue };
