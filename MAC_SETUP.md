# Запуск Pet Help Platform на Mac

## Шаг 1: Установка необходимых программ

### Установите Homebrew (если еще нет)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Установите Node.js и Python
```bash
brew install node
brew install python@3.11
```

### Установите Git (если еще нет)
```bash
brew install git
```

## Шаг 2: Клонирование проекта

```bash
# Откройте Terminal (Терминал)
cd ~/Desktop
git clone https://github.com/Monstershox/Pet.git
cd Pet
```

## Шаг 3: Запуск проекта

### Вариант А: Автоматический запуск (самый простой)
```bash
cd pet-help-platform
chmod +x start-mac.sh
./start-mac.sh
```

### Вариант Б: Ручной запуск

#### Терминал 1 - Backend:
```bash
cd pet-help-platform/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python main.py
```

#### Терминал 2 - Frontend:
Откройте новую вкладку в Terminal (Cmd+T) и выполните:
```bash
cd ~/Desktop/Pet/pet-help-platform/frontend
npm install
npm run dev
```

## Шаг 4: Открытие сайта

После запуска откройте Safari или Chrome и перейдите на:
- **http://localhost:3000** - сайт
- **http://localhost:8000/docs** - API документация

## Запуск через VS Code на Mac

### Установка VS Code
```bash
brew install --cask visual-studio-code
```

### Открытие проекта
```bash
cd ~/Desktop/Pet
code .
```

### Запуск в VS Code
1. Откроется VS Code с проектом
2. Нажмите **Fn+F5** (или просто F5 если настроены функциональные клавиши)
3. Выберите **"Full Stack (Backend + Frontend)"**
4. Нажмите зеленую кнопку запуска

## Решение возможных проблем

### Если порт 3000 занят:
```bash
# Найти процесс на порту 3000
lsof -i :3000
# Убить процесс (замените PID на число из предыдущей команды)
kill -9 PID
```

### Если не устанавливаются пакеты Python:
```bash
pip install --upgrade pip
pip install -r requirements.txt --no-cache-dir
```

### Если не работает npm:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Остановка серверов

- В каждом терминале нажмите **Control+C**
- Или закройте окна Terminal

## Быстрые команды для Terminal

- **Cmd+T** - новая вкладка
- **Cmd+W** - закрыть вкладку
- **Cmd+K** - очистить экран
- **Control+C** - остановить процесс