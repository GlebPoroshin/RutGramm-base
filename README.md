# GeoChat

GeoChat - это микросервисное приложение для обмена сообщениями с учетом геолокации.

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