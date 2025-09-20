# Инструкция по запуску Pet Help Platform

## Предварительные требования
- Node.js (версия 18 или выше)
- Python 3.8+
- Git

## Установка и запуск

### 1. Клонирование репозитория
```bash
git clone https://github.com/Monstershox/Pet.git
cd Pet
```

### 2. Настройка Backend

```bash
cd pet-help-platform/backend

# Создание виртуального окружения Python
python -m venv venv

# Активация виртуального окружения
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Установка зависимостей
pip install -r requirements.txt

# Создание файла .env из примера
copy .env.example .env
# или на Linux/Mac:
# cp .env.example .env

# Запуск сервера
python main.py
```
Backend запустится на http://localhost:8000

### 3. Настройка Frontend

Откройте новый терминал и выполните:

```bash
cd pet-help-platform/frontend

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev
```
Frontend запустится на http://localhost:3000

## Быстрый запуск

### Windows
```bash
cd pet-help-platform
start-windows.bat
```

### Mac
```bash
cd pet-help-platform
chmod +x start-mac.sh
./start-mac.sh
```

### Linux
```bash
cd pet-help-platform
chmod +x start-linux.sh
./start-linux.sh
```

## Проверка работы

1. Откройте браузер
2. Перейдите на http://localhost:3000
3. Backend API доступен на http://localhost:8000/docs

## Возможные проблемы

### Если порты заняты
- Frontend: измените порт в `package.json` или запустите с `npm run dev -- -p 3001`
- Backend: измените порт в файле `.env`

### Ошибки с Python модулями
```bash
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

### Ошибки с Node модулями
```bash
# Удалите node_modules и package-lock.json
rm -rf node_modules package-lock.json
npm install
```