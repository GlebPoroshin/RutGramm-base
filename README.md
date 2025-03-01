# GeoChat

GeoChat - это микросервисное приложение для обмена сообщениями с учетом геолокации.

## Структура проекта

```
geochat/
├── geochat-auth-service/     # Сервис аутентификации
│   ├── cmd/                  # Точка входа приложения
│   ├── internal/            
│   │   ├── api/             # API endpoints и роутинг
│   │   ├── config/          # Конфигурация
│   │   ├── models/          # Модели данных
│   │   ├── repository/      # Слой доступа к данным
│   │   └── service/         # Бизнес-логика
│   ├── Dockerfile           # Сборка сервиса
│   └── .env                 # Переменные окружения
│
├── geochat-shared/          # Общие компоненты
│   ├── jwt/                 # JWT утилиты
│   └── kafka/               # Kafka утилиты
│
└── geochat-deployment/      # Конфигурация развертывания
    ├── docker-compose.yml   # Композиция сервисов
    └── .env                 # Переменные окружения

```

## Компоненты системы

1. **Auth Service** (порт 8081)
   - Регистрация и аутентификация пользователей
   - Управление JWT токенами
   - Верификация email

2. **Shared Library**
   - JWT утилиты
   - Kafka утилиты для обмена сообщениями

3. **Инфраструктура**
   - PostgreSQL (порт 5432)
   - Kafka (порт 9092)
   - Zookeeper (порт 2181)

## Запуск проекта

1. Клонируйте репозитории:
   ```bash
   git clone https://github.com/GlebPoroshin/geochat-auth-service.git
   git clone https://github.com/GlebPoroshin/geochat-shared.git
   git clone https://github.com/GlebPoroshin/geochat-deployment.git
   ```

2. Создайте файл `.env` в директории `geochat-deployment` на основе `.env.example`:
   ```bash
   cd geochat-deployment
   cp .env.example .env
   ```

3. Настройте переменные окружения в файле `.env`:
   ```env
   # Server
   SERVER_ADDRESS=:8081
   JWT_SECRET=your_jwt_secret

   # Database
   DB_HOST=postgres
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=geochat_auth
   DB_SSL_MODE=disable

   # SMTP (для отправки email)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   ```

4. Запустите сервисы:
   ```bash
   docker-compose up -d
   ```

5. Проверьте статус сервисов:
   ```bash
   docker-compose ps
   ```

## API Endpoints

### Auth Service (http://localhost:8081)

#### Публичные endpoints:
- `POST /auth/register` - Регистрация нового пользователя
- `POST /auth/verify-registration` - Подтверждение регистрации
- `POST /auth/login` - Вход в систему
- `POST /auth/password-reset` - Запрос сброса пароля
- `POST /auth/verify-reset-code` - Проверка кода сброса пароля
- `POST /auth/reset-password` - Сброс пароля

#### Защищенные endpoints (требуют JWT токен):
- `POST /auth/refresh` - Обновление токена

## Разработка

1. Для локальной разработки auth-service:
   ```bash
   cd geochat-auth-service
   go mod download
   go run cmd/main.go
   ```

2. Для тестирования API:
   ```bash
   # Регистрация пользователя
   curl -X POST http://localhost:8081/auth/register \
     -H "Content-Type: application/json" \
     -d '{"login": "testuser", "email": "test@example.com", "password": "password123"}'
   ```

## Мониторинг

- Логи сервисов:
  ```bash
  docker-compose logs -f auth-service
  docker-compose logs -f kafka
  docker-compose logs -f postgres
  ```

## Устранение неполадок

1. Если база данных недоступна:
   ```bash
   docker-compose exec postgres psql -U postgres -c "CREATE DATABASE geochat_auth;"
   ```

2. Для перезапуска отдельного сервиса:
   ```bash
   docker-compose restart auth-service
   ```

3. Для полной перезагрузки:
   ```bash
   docker-compose down
   docker-compose up -d
   ```