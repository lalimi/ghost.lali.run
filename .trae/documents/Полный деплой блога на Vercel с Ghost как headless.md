## Ограничения и архитектура
- Ghost — stateful приложение с БД и файловым хранилищем; Vercel не подходит для его прямого запуска.
- Решение: фронтенд полностью на Vercel, контент из Ghost (headless) размещён отдельно на `ghost.lali.run` (наш Docker‑продакшен уже готов). Домен `lali.run` указывает на Vercel.

## Итоговая схема
- **Frontend (Vercel)**: Next.js сайт блога на домене `lali.run`.
- **Backend (Ghost)**: `https://ghost.lali.run` (Docker Compose, HTTPS, БД, контент‑тома).
- **API**: `@tryghost/content-api` из фронта → `ghost.lali.run` (только публичный контент‑ключ).
- **Вебхуки**: Ghost вызывает Vercel Deploy Hook для обновления/реалидации страниц.

## Реализация фронтенда
- Создать Next.js приложение `apps/web` (или `apps/lali-blog`).
- Страницы:
  - `/` — список постов с пагинацией.
  - `/[slug]` — пост.
  - `/tag/[slug]` — теги.
  - `/page/[slug]` — статические страницы.
  - `/sitemap.xml` — генерация sitemap.
  - `/rss.xml` — RSS‑лента.
- Данные: `@tryghost/content-api` (`process.env.GHOST_API_URL`, `process.env.GHOST_CONTENT_KEY`).
- Генерация: ISR (Incremental Static Regeneration) `revalidate: 60–300`.
- Изображения: `next.config.js` добавить `images.remotePatterns` для домена `ghost.lali.run`.
- Метаданные: каноникал, OG/Twitter, структурированные данные JSON‑LD.

## Конфиги Vercel
- Node.js: 20.x (исключить `node-gyp`/native build ошибки) — через `package.json: engines.node=20.x` и в настройках проекта.
- Build: `next build`; Output: Next.js default.
- Domain: подключить `lali.run`; настроить редирект `www.lali.run` → `lali.run`.
- Env Vars:
  - `GHOST_API_URL=https://ghost.lali.run`
  - `GHOST_CONTENT_KEY=<контент‑ключ из Ghost Admin>`
- Удалить/заменить текущий `vercel.json`, который переписывает на `/index.html`; для Next.js не требуется.

## Ghost настройки
- `url` у Ghost: `https://ghost.lali.run`.
- Включить CDN/сжатие (делает Caddy); проверить `sitemap.xml`, `robots.txt`.
- Получить `Content API Key` в Admin → Integrations.
- Создать Deploy Hook в Vercel; настроить Ghost Webhook на события публикации/обновления.

## SEO
- Каноникал‑ссылки на Vercel‑сайт (`lali.run`).
- Статичный `sitemap.xml`/`rss.xml` генерируются на Vercel из данных Ghost.
- OG/Twitter Cards, `robots.txt`, `hreflang` при необходимости.

## Аналитика
- Vercel Analytics или Plausible/Umami (легковесно). Подключить на фронтенде.

## Тесты и проверка
- Превью деплой в Vercel (PR) → проверка страниц, метатегов, изображений, скорости.
- Проверить revalidate и срабатывание вебхуков после публикации поста.

## Шаги внедрения
1. Создаю Next.js приложение и базовые страницы, подключаю `@tryghost/content-api`.
2. Добавляю SEO, ISR, `next.config.js` для изображений.
3. Обновляю `package.json` (engines), настраиваю Vercel env vars и домен.
4. Настраиваю Ghost Webhook → Vercel Deploy Hook.
5. Провожу тестовый деплой на Vercel и проверку.

## Результат
- Полный пользовательский сайт на Vercel (`lali.run`) с контентом из Ghost, быстрый, SEO‑корректный, без проблем нативных сборок.

Готов приступить: создам приложение, внесу конфиги и подготовлю деплой. Подтвердите план — начну реализацию и подготовлю первый рабочий деплой на Vercel.