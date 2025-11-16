## Цель
Запустить продакшен‑инстанс Ghost на домене `lali.run` с HTTPS, устойчивым хранилищем контента, корректным SEO и хорошей производительностью.

## Архитектура
- Образы: `ghost:5-alpine` и `mysql:8`.
- Обратный прокси: `Caddy` с автоматическими сертификатами Let’s Encrypt.
- Сети: внешняя `web` (80/443), внутренняя `internal` между `ghost` и `db`.
- Персистентные тома: `ghost-content`, `mysql-data`, `caddy-data`, `caddy-config`.

## Предусловия
- DNS: `A`/`AAAA` записи домена `lali.run` на IP вашего сервера.
- Открыты порты `80` и `443` на сервере.
- Установлены Docker и Docker Compose.
- SMTP‑учётные данные от вашего почтового провайдера (для писем Ghost).

## Конфигурация Docker Compose (продакшен)
Создать на сервере файл `docker-compose.prod.yml`:

```yaml
services:
  ghost:
    image: ghost:5-alpine
    restart: unless-stopped
    environment:
      url: https://lali.run
      database__client: mysql
      database__connection__host: db
      database__connection__user: ghost
      database__connection__password: change_me_strong
      database__connection__database: ghost
      mail__transport: SMTP
      mail__options__host: smtp.example.com
      mail__options__port: 587
      mail__options__auth__user: no-reply@lali.run
      mail__options__auth__pass: change_me_mail_pass
      mail__from: "Blog <no-reply@lali.run>"
    volumes:
      - ghost-content:/var/lib/ghost/content
    depends_on:
      - db
    networks:
      - web
      - internal

  db:
    image: mysql:8.4
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: change_me_root
      MYSQL_DATABASE: ghost
      MYSQL_USER: ghost
      MYSQL_PASSWORD: change_me_strong
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - internal

  caddy:
    image: caddy:2
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy-data:/data
      - caddy-config:/config
    depends_on:
      - ghost
    networks:
      - web
      - internal

networks:
  web:
  internal:

volumes:
  ghost-content:
  mysql-data:
  caddy-data:
  caddy-config:
```

## Конфигурация Caddy
Создать рядом файл `Caddyfile`:

```
lali.run {
  encode zstd gzip
  header {
    Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    X-Content-Type-Options "nosniff"
    X-Frame-Options "SAMEORIGIN"
    Referrer-Policy "strict-origin-when-cross-origin"
    Content-Security-Policy "upgrade-insecure-requests"
  }
  reverse_proxy ghost:2368
}
```

## Действия на сервере
- Настроить DNS на IP сервера.
- Скопировать `docker-compose.prod.yml` и `Caddyfile` на сервер.
- Заменить плейсхолдеры `change_me_*`, SMTP‑хост/логин/пароль на реальные.
- Запустить контейнеры: `docker compose -f docker-compose.prod.yml up -d`.
- Проверить доступность: `https://lali.run` и админку `https://lali.run/ghost`.

## Пост‑настройка SEO
- В Ghost Admin заполнить название сайта, описание, логотип, соц‑превью.
- Проверить генерацию `sitemap.xml` и `robots.txt`.
- Включить Open Graph/Twitter Cards, задать фавиконки.
- Выбрать лёгкую тему, оптимизировать изображения, добавить микроразметку (`Article`, `Organization`) в шаблоны темы при необходимости.

## Производительность и безопасность
- Caddy выдаёт сертификаты автоматически, добавлены базовые security‑заголовки.
- Убедиться в регулярных обновлениях контейнеров.
- Опционально: включить CDN для медиа, HTTP/3 в Caddy.

## Резервные копии
- Бэкап `ghost-content` (том) и дамп MySQL (ежедневно) на внешнее хранилище.
- Восстановление: вернуть том и импортировать SQL‑дамп; Ghost поднимется в том же состоянии.

## Проверка и мониторинг
- Проверить логи: `docker compose -f docker-compose.prod.yml logs ghost caddy db`.
- Настроить uptime‑мониторинг домена и алерты.

## Альтернативы
- Вместо Caddy можно использовать Nginx; при желании подготовлю эквивалентный конфиг.

## Далее
Готов перейти к созданию продакшен‑конфигов под ваши реальные SMTP и пароли, чтобы вы развернули их на сервере одной командой. Подтвердите план, и я подставлю ваши данные и подготовлю файлы.