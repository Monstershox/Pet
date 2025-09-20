# Pet Help Platform - MVP

Платформа для помощи бездомным животным с AI-анализом фото, свайп-интерфейсом для подбора питомцев и интеграцией с приютами.

## Функциональность MVP

### Backend (FastAPI)
- ✅ Авторизация и регистрация пользователей (JWT)
- ✅ CRUD операции для животных
- ✅ Загрузка и хранение фото
- ✅ AI анализ фото животных (интеграция с OpenAI Vision API)
- ✅ Система свайпов (Tinder-like)
- ✅ Управление приютами и заявками
- ✅ Система донатов
- ✅ FAQ с AI-ответами

### Frontend (Next.js)
- ✅ Главная страница
- ✅ Свайп-интерфейс для выбора животных
- ✅ Интеграция с API
- ✅ Адаптивный дизайн

## Технологии

### Backend
- Python 3.9+
- FastAPI
- SQLAlchemy
- PostgreSQL
- OpenAI API
- JWT Auth

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Query
- Framer Motion

## Установка и запуск

### 1. Настройка базы данных

Установите PostgreSQL и создайте базу данных:
```sql
CREATE DATABASE pet_help_db;
```

### 2. Backend

```bash
cd pet-help-platform/backend

# Создать виртуальное окружение
python -m venv venv

# Активировать виртуальное окружение
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Установить зависимости
pip install -r requirements.txt

# Создать .env файл на основе .env.example
cp .env.example .env

# Отредактировать .env файл и добавить свои настройки:
# - DATABASE_URL
# - SECRET_KEY (генерируйте с помощью: openssl rand -hex 32)
# - OPENAI_API_KEY (для AI функций)

# Запустить сервер
python main.py
```

Backend запустится на http://localhost:8000

API документация: http://localhost:8000/docs

### 3. Frontend

```bash
cd pet-help-platform/frontend

# Установить зависимости
npm install

# Создать .env.local файл
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local

# Запустить dev сервер
npm run dev
```

Frontend запустится на http://localhost:3000

## Структура проекта

```
pet-help-platform/
├── backend/
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── core/          # Конфигурация, безопасность, БД
│   │   ├── models/        # SQLAlchemy модели
│   │   ├── schemas/       # Pydantic схемы
│   │   └── services/      # Бизнес-логика, AI сервисы
│   ├── uploads/           # Загруженные файлы
│   ├── main.py            # Точка входа
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   ├── components/    # React компоненты
│   │   ├── lib/           # API клиент, утилиты
│   │   └── types/         # TypeScript типы
│   └── package.json
│
└── README.md
```

## Основные API эндпоинты

### Авторизация
- `POST /api/v1/auth/register` - Регистрация
- `POST /api/v1/auth/login` - Вход
- `GET /api/v1/auth/me` - Текущий пользователь

### Животные
- `GET /api/v1/animals` - Список животных
- `GET /api/v1/animals/feed` - Лента для свайпов
- `POST /api/v1/animals` - Добавить животное
- `POST /api/v1/upload/animal/{id}/photo` - Загрузить фото

### Свайпы
- `POST /api/v1/swipes` - Создать свайп
- `GET /api/v1/swipes/matches` - Мои совпадения

### Приюты
- `GET /api/v1/shelters` - Список приютов
- `POST /api/v1/shelters/requests` - Отправить заявку

## Тестовые данные

После запуска backend создайте тестового пользователя:
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "testpassword",
    "full_name": "Test User"
  }'
```

## Дальнейшее развитие

- [ ] Мобильное приложение (React Native)
- [ ] Интеграция с платежными системами
- [ ] Push-уведомления
- [ ] Расширенная AI аналитика
- [ ] Система поощрений и геймификация
- [ ] Интеграция с социальными сетями

## Лицензия

MIT