# GeoChat - TODO и Инструкции

## Запуск проекта

### Использование скрипта build-and-run.sh

В проекте есть скрипт автоматизации, который собирает и запускает все сервисы. Скрипт находится в директории `geochat-deployment`.

#### Как запустить:

1. Убедитесь, что Docker и Docker Compose установлены
2. Откройте терминал и перейдите в директорию с проектом
3. Выполните следующие команды:

```bash
cd geochat-deployment
chmod +x build-and-run.sh  # Убедитесь, что скрипт имеет права на выполнение
./build-and-run.sh
```

Скрипт выполнит следующие действия:
- Соберет Docker-образы для всех микросервисов (auth-service, user-service, chat-service, gateway-service)
- Запустит необходимую инфраструктуру (Zookeeper, Kafka, PostgreSQL, Redis, MongoDB)
- Дождется готовности баз данных
- Запустит все микросервисы

После успешного запуска, сервисы будут доступны по следующим адресам:
- Gateway API: http://localhost:8080
- Auth Service API: http://localhost:8081
- User Service API: http://localhost:8082
- Chat Service API: http://localhost:8083

### Ручной запуск с Docker Compose

Вы также можете запустить проект вручную с помощью Docker Compose:

```bash
cd geochat-deployment
docker-compose up -d
```

## Установка инструментов для работы с gRPC и Protocol Buffers

Для работы с gRPC и Protocol Buffers требуются следующие инструменты:

### 1. Установка Protocol Buffer Compiler (protoc)

#### macOS (с использованием Homebrew):
```bash
brew install protobuf
```

#### Linux:
```bash
sudo apt update
sudo apt install -y protobuf-compiler
```

#### Windows (с использованием Chocolatey):
```bash
choco install protoc
```

### 2. Установка Go плагинов для protoc

```bash
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```

Убедитесь, что `$GOPATH/bin` добавлен в вашу переменную окружения PATH.

### 3. Проверка установки

Чтобы проверить, что protoc установлен корректно:
```bash
protoc --version
```

## Генерация кода из .proto файлов

В проекте используется Makefile для генерации gRPC кода:

```bash
# Генерация для всех сервисов
make proto

# Очистка сгенерированных файлов
make clean
```

## Что нужно реализовать

- [ ] Добавить тесты для всех сервисов
- [ ] Реализовать кэширование с Redis для всех сервисов
- [ ] Улучшить документацию API (Swagger)
- [ ] Добавить мониторинг и логирование
- [ ] Реализовать функциональность геолокации в чатах
- [ ] Добавить уведомления о новых сообщениях
- [ ] Улучшить безопасность API 