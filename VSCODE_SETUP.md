# Запуск через VS Code

## Быстрый старт

### Вариант 1: Через панель отладки (рекомендуется)
1. Откройте проект в VS Code
2. Нажмите F5 или перейдите в Run and Debug (Ctrl+Shift+D)
3. Выберите **"Full Stack (Backend + Frontend)"**
4. Нажмите зеленую кнопку запуска ▶️

Это запустит оба сервера одновременно!

### Вариант 2: Через терминал VS Code
1. Откройте терминал в VS Code (Ctrl+`)
2. Разделите терминал на два окна (кнопка Split Terminal)
3. В первом терминале:
   ```bash
   cd pet-help-platform/backend
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   pip install -r requirements.txt
   python main.py
   ```
4. Во втором терминале:
   ```bash
   cd pet-help-platform/frontend
   npm install
   npm run dev
   ```

### Вариант 3: Через Tasks (задачи)
1. Нажмите Ctrl+Shift+P
2. Введите "Tasks: Run Task"
3. Выберите задачи в порядке:
   - **Setup and Run All** (настроит всё автоматически)
   - Затем запустите:
     - **Run Backend**
     - **Run Frontend**

## Полезные команды VS Code

- **F5** - Запуск отладки
- **Ctrl+Shift+D** - Панель отладки
- **Ctrl+`** - Открыть терминал
- **Ctrl+Shift+P** - Командная палитра
- **Ctrl+Shift+B** - Запуск задач сборки

## Структура конфигурации

- `.vscode/launch.json` - Конфигурации запуска и отладки
- `.vscode/tasks.json` - Автоматизированные задачи
- `.vscode/settings.json` - Настройки проекта

## Отладка

### Backend (Python)
1. Поставьте breakpoint в коде Python (клик слева от номера строки)
2. Запустите "Backend (FastAPI)" из панели отладки
3. Отправьте запрос на API - выполнение остановится на breakpoint

### Frontend (JavaScript/TypeScript)
1. Поставьте breakpoint в коде
2. Запустите "Frontend (Next.js)"
3. Откройте браузер - отладка будет работать в VS Code

## Горячие клавиши для отладки
- **F9** - Поставить/убрать breakpoint
- **F5** - Продолжить выполнение
- **F10** - Шаг с обходом (Step Over)
- **F11** - Шаг с заходом (Step Into)
- **Shift+F11** - Выйти (Step Out)
- **Shift+F5** - Остановить отладку