const http = require('http');
const url = require('url');

// Original animals data
const originalAnimals = [
  {
    id: 1,
    name: "Барсик",
    type: "cat",
    breed: "Сиамская",
    age: 2,
    size: "medium",
    location: "Ташкент, Яккасарайский район",
    description: "Ласковый кот ищет дом. Приучен к лотку, привит.",
    photos: [{ url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop", is_primary: true }],
    status: "available",
    good_with_kids: true,
    good_with_pets: true
  },
  {
    id: 2,
    name: "Рекс",
    type: "dog",
    breed: "Немецкая овчарка",
    age: 3,
    size: "large",
    location: "Самарканд, центр",
    description: "Преданный друг и охранник. Знает команды, социализирован.",
    photos: [{ url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop", is_primary: true }],
    status: "available",
    good_with_kids: true,
    good_with_pets: false
  },
  {
    id: 3,
    name: "Мурка",
    type: "cat",
    breed: "Персидская",
    age: 1,
    size: "small",
    location: "Бухара, Гиждуванская",
    description: "Пушистая красавица, очень ласковая и игривая.",
    photos: [{ url: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop", is_primary: true }],
    status: "available",
    good_with_kids: true,
    good_with_pets: true
  },
  {
    id: 4,
    name: "Шарик",
    type: "dog",
    breed: "Лабрадор",
    age: 5,
    size: "large",
    location: "Ташкент, Мирабад",
    description: "Добрый и спокойный пес, идеальный компаньон для семьи.",
    photos: [{ url: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop", is_primary: true }],
    status: "available",
    good_with_kids: true,
    good_with_pets: true
  },
  {
    id: 5,
    name: "Василиса",
    type: "cat",
    breed: "Британская короткошерстная",
    age: 4,
    size: "medium",
    location: "Наманган, Афросиаб",
    description: "Спокойная кошка с аристократичными манерами.",
    photos: [{ url: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&h=400&fit=crop", is_primary: true }],
    status: "available",
    good_with_kids: false,
    good_with_pets: false
  },
  {
    id: 6,
    name: "Бобик",
    type: "dog",
    breed: "Алабай",
    age: 2,
    size: "large",
    location: "Ташкент, Чиланзар",
    description: "Умный и верный друг. Отличный охранник для дома.",
    photos: [{ url: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=400&fit=crop", is_primary: true }],
    status: "available",
    good_with_kids: true,
    good_with_pets: true
  }
];

// Simple in-memory database
const database = {
  users: [],
  animals: [...originalAnimals],
  swipes: [],
  tokens: {},
  swipedAnimalsIds: new Set()
};

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle OPTIONS requests
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Router
  if (method === 'GET') {
    if (pathname === '/api/v1/animals/feed' || pathname === '/api/v1/animals') {
      // If all animals have been swiped, reset the list
      if (database.animals.length === 0) {
        database.animals = originalAnimals.filter(animal => !database.swipedAnimalsIds.has(animal.id));

        // If all animals have been swiped at least once, reset completely
        if (database.animals.length === 0) {
          database.animals = [...originalAnimals];
          database.swipedAnimalsIds.clear();
        }
      }
      sendJsonResponse(res, database.animals);
    } else if (pathname.startsWith('/api/v1/animals/')) {
      const id = parseInt(pathname.split('/').pop());
      const animal = database.animals.find(a => a.id === id);
      if (animal) {
        sendJsonResponse(res, animal);
      } else {
        sendError(res, 404, 'Animal not found');
      }
    } else if (pathname === '/api/v1/swipes/matches') {
      const matches = database.swipes.filter(s => s.is_match);
      sendJsonResponse(res, matches);
    } else if (pathname === '/api/v1/auth/me') {
      sendJsonResponse(res, {
        id: 1,
        email: "demo@example.com",
        username: "demo",
        full_name: "Demo User",
        role: "user",
        is_active: true,
        is_verified: true,
        points: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } else if (pathname === '/') {
      sendJsonResponse(res, {
        message: "Pet Help Platform API",
        version: "1.0.0",
        endpoints: [
          "/api/v1/animals",
          "/api/v1/animals/feed",
          "/api/v1/auth/login",
          "/api/v1/swipes"
        ]
      });
    } else if (pathname === '/health') {
      sendJsonResponse(res, { status: "healthy" });
    } else {
      sendError(res, 404, 'Not found');
    }
  } else if (method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (pathname === '/api/v1/auth/register' || pathname === '/api/v1/auth/login') {
        const token = generateToken();
        const user = {
          id: 1,
          email: "demo@example.com",
          username: "demo",
          full_name: "Demo User",
          role: "user",
          is_active: true,
          is_verified: true,
          points: 100,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        database.tokens[token] = user.id;

        sendJsonResponse(res, {
          access_token: token,
          token_type: "bearer",
          user: user
        });
      } else if (pathname === '/api/v1/swipes') {
        try {
          const data = JSON.parse(body);
          const swipe = {
            id: database.swipes.length + 1,
            user_id: 1,
            animal_id: data.animal_id,
            direction: data.direction,
            is_match: data.direction === 'right' || data.direction === 'super_like',
            created_at: new Date().toISOString()
          };
          database.swipes.push(swipe);

          // Remove swiped animal from feed and track it
          const animalIndex = database.animals.findIndex(a => a.id === data.animal_id);
          if (animalIndex !== -1) {
            database.swipedAnimalsIds.add(data.animal_id);
            database.animals.splice(animalIndex, 1);
          }

          sendJsonResponse(res, swipe);
        } catch (e) {
          sendError(res, 400, 'Invalid request');
        }
      } else if (pathname === '/api/v1/animals') {
        try {
          const data = JSON.parse(body);
          const animal = {
            id: database.animals.length + 1,
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            photos: []
          };
          database.animals.push(animal);
          sendJsonResponse(res, animal);
        } catch (e) {
          sendError(res, 400, 'Invalid request');
        }
      } else {
        sendError(res, 404, 'Not found');
      }
    });
  } else {
    sendError(res, 405, 'Method not allowed');
  }
});

function sendJsonResponse(res, data) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function sendError(res, code, message) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: message }));
}

function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Simple API server running on http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  GET  http://localhost:${PORT}/api/v1/animals/feed`);
  console.log(`  POST http://localhost:${PORT}/api/v1/auth/login`);
  console.log(`  POST http://localhost:${PORT}/api/v1/swipes`);
  console.log('\nPress Ctrl+C to stop the server');
});