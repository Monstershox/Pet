#!/usr/bin/env python3
"""
Упрощенный сервер для демонстрации без внешних зависимостей
Запустите: python simple_server.py
"""

import json
import uuid
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from datetime import datetime
import hashlib

# Простое хранилище данных в памяти
database = {
    "users": [],
    "animals": [
        {
            "id": 1,
            "name": "Барсик",
            "type": "cat",
            "breed": "Сиамская",
            "age": 2,
            "size": "medium",
            "location": "Москва",
            "description": "Ласковый кот ищет дом",
            "photos": [{"url": "/placeholder.jpg", "is_primary": True}]
        },
        {
            "id": 2,
            "name": "Рекс",
            "type": "dog",
            "breed": "Овчарка",
            "age": 3,
            "size": "large",
            "location": "Санкт-Петербург",
            "description": "Преданный друг и охранник",
            "photos": [{"url": "/placeholder.jpg", "is_primary": True}]
        },
        {
            "id": 3,
            "name": "Мурка",
            "type": "cat",
            "breed": "Персидская",
            "age": 1,
            "size": "small",
            "location": "Новосибирск",
            "description": "Пушистая красавица",
            "photos": [{"url": "/placeholder.jpg", "is_primary": True}]
        }
    ],
    "tokens": {}
}

class SimpleAPIHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        parsed_path = urlparse(self.path)

        # API endpoints
        if parsed_path.path == '/api/v1/animals/feed':
            self.send_json_response(database["animals"])
        elif parsed_path.path == '/api/v1/animals':
            self.send_json_response(database["animals"])
        elif parsed_path.path.startswith('/api/v1/animals/'):
            animal_id = int(parsed_path.path.split('/')[-1])
            animal = next((a for a in database["animals"] if a["id"] == animal_id), None)
            if animal:
                self.send_json_response(animal)
            else:
                self.send_error(404, "Animal not found")
        elif parsed_path.path == '/api/v1/auth/me':
            self.send_json_response({
                "id": 1,
                "email": "demo@example.com",
                "username": "demo",
                "full_name": "Demo User",
                "role": "user",
                "is_active": True,
                "is_verified": True,
                "points": 100,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            })
        elif parsed_path.path == '/':
            self.send_json_response({"message": "Pet Help Platform API", "version": "1.0.0"})
        elif parsed_path.path == '/health':
            self.send_json_response({"status": "healthy"})
        else:
            self.send_error(404, "Not found")

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        parsed_path = urlparse(self.path)

        if parsed_path.path == '/api/v1/auth/register':
            data = json.loads(post_data)
            user = {
                "id": len(database["users"]) + 1,
                "email": data["email"],
                "username": data["username"],
                "full_name": data.get("full_name", ""),
                "role": "user",
                "is_active": True,
                "is_verified": False,
                "points": 0,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            database["users"].append(user)
            token = str(uuid.uuid4())
            database["tokens"][token] = user["id"]

            self.send_json_response({
                "access_token": token,
                "token_type": "bearer",
                "user": user
            })

        elif parsed_path.path == '/api/v1/auth/login':
            # Простая имитация логина
            token = str(uuid.uuid4())
            user = {
                "id": 1,
                "email": "demo@example.com",
                "username": "demo",
                "full_name": "Demo User",
                "role": "user",
                "is_active": True,
                "is_verified": True,
                "points": 100,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            database["tokens"][token] = user["id"]

            self.send_json_response({
                "access_token": token,
                "token_type": "bearer",
                "user": user
            })

        elif parsed_path.path == '/api/v1/swipes':
            data = json.loads(post_data)
            self.send_json_response({
                "id": len(database.get("swipes", [])) + 1,
                "user_id": 1,
                "animal_id": data["animal_id"],
                "direction": data["direction"],
                "is_match": data["direction"] == "right",
                "created_at": datetime.now().isoformat()
            })

        elif parsed_path.path == '/api/v1/animals':
            data = json.loads(post_data)
            animal = {
                "id": len(database["animals"]) + 1,
                **data,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
                "photos": []
            }
            database["animals"].append(animal)
            self.send_json_response(animal)

        else:
            self.send_error(404, "Not found")

    def send_json_response(self, data):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def log_message(self, format, *args):
        # Минимизировать логи
        pass

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, SimpleAPIHandler)
    print(f'Starting simple API server on port {port}...')
    print(f'API available at http://localhost:{port}')
    print(f'API documentation: http://localhost:{port}/api/v1')
    print('\nPress Ctrl+C to stop the server')

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\nShutting down server...')
        httpd.shutdown()

if __name__ == '__main__':
    run_server()