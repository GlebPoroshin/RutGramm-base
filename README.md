# GeoChatApp

GeoChatApp - чат-приложение с функцией геолокации, позволяющее создавать чаты, связанные с определенными местами на карте.

## Компоненты

- `geochat-gateway-service` - API Gateway для маршрутизации запросов к микросервисам
- `geochat-auth-service` - Сервис авторизации пользователей
- `geochat-user-service` - Сервис управления профилями пользователей
- `geochat-chat-service` - Сервис управления чатами и сообщениями
- `geochat-event-service` - Сервис для управления событиями (планируется)
- `geochat-notification-service` - Сервис для отправки уведомлений (планируется)
- `geochat-presence-service` - Сервис для отслеживания онлайн-статуса пользователей (планируется)
- `geochat-shared` - Общие библиотеки и утилиты
- `test-frontend` - Тестовый фронтенд на React

## Миграция на gRPC

В проекте внедряется gRPC для взаимодействия между микросервисами.

### Необходимые инструменты

1. **Protocol Buffers Compiler (protoc)**:
   - Для macOS: `brew install protobuf`
   - Для Ubuntu/Debian: `apt-get install protobuf-compiler`
   - Для Windows: Скачайте с https://github.com/protocolbuffers/protobuf/releases

2. **Go плагины для protoc**:
   ```bash
   go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
   go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
   # Убедитесь, что $GOPATH/bin в PATH
   export PATH="$PATH:$(go env GOPATH)/bin"
   ```

### Генерация gRPC кода

Файлы proto находятся в директории `proto/`:
- `proto/auth/auth.proto` - Определение API сервиса авторизации
- `proto/user/user.proto` - Определение API сервиса пользователей
- `proto/chat/chat.proto` - Определение API сервиса чатов

Для генерации кода запустите:
```bash
make proto-gen
```

Сгенерированный код будет помещен в `proto/gen/`.

## Разработка

1. Клонируйте репозиторий и все подмодули:
```bash
git clone --recurse-submodules https://github.com/yourusername/geochat.git
```

2. Настройте переменные окружения для каждого сервиса (см. файлы .env.example).

3. Запустите инфраструктуру (PostgreSQL, MongoDB, Redis, Kafka):
```bash
cd geochat-deployment
docker-compose up -d
```

4. Запустите каждый сервис:
```bash
cd geochat-auth-service
go run cmd/main.go

cd geochat-user-service
go run cmd/app/main.go

cd geochat-chat-service
go run cmd/main.go

cd geochat-gateway-service
go run cmd/gateway-service/main.go
```

## Swagger Documentation

После запуска сервисов Swagger доступен по URL:
- Gateway: http://localhost:8080/swagger/
- Auth Service: http://localhost:8080/auth/swagger/
- User Service: http://localhost:8080/users/swagger/
- Chat Service: http://localhost:8080/chats/swagger/

## Запуск проекта

1. Чтобы склонировать все разом в общую папку можно сделать так:
   ```bash
   git clone --recurse-submodules git@github.com:GlebPoroshin/geochat-base.git
   ```

2. Создай файл `.env` во всех микросервисах, которые собираешься запускать (в deployment модуле тоже) по примеру в каждом из них:
   
3. Чтобы собрать и поднять сервис, если окружение уже запущено (из деплой модуля)
   ```bash
   docker-compose build auth-service && docker-compose up -d auth-service
   ```

4. Поднять все:
   ```bash
   docker-compose up -d
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