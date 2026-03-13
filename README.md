# CarKey reStore — Сайт-визитка

Одностраничный сайт автосервиса по ремонту ключей и автоэлектрике с интеграцией Decap CMS (headless CMS на базе Git).

## Структура проекта

```
├── index.html          # Главная страница
├── admin/
│   ├── index.html      # Панель Decap CMS
│   └── config.yml      # Конфигурация CMS
├── data/
│   ├── hero.json       # Заголовок главного экрана
│   ├── company.json    # Контакты и соцсети
│   ├── services.json   # Услуги и цены
│   └── equipment.json  # Оборудование
├── images/
│   └── uploads/        # Загруженные через CMS фото
├── css/
│   └── style.css
├── js/
│   └── main.js
└── favicon.svg
```

## Развёртывание на GitHub Pages

1. Создайте репозиторий на GitHub.
2. Залейте файлы проекта:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/ВАШ_ЛОГИН/ВАШ_РЕПОЗИТОРИЙ.git
   git push -u origin main
   ```

3. В настройках репозитория: **Settings → Pages**
   - Source: **Deploy from a branch**
   - Branch: **main**, папка: **/ (root)**
   - Save

4. Сайт будет доступен по адресу:
   `https://ВАШ_ЛОГИН.github.io/ВАШ_РЕПОЗИТОРИЙ/`

## Настройка Decap CMS

1. Откройте `admin/config.yml` и замените `owner/repository` на ваш GitHub-репозиторий:
   ```yaml
   backend:
     repo: username/repository
   ```

2. Создайте OAuth-приложение на GitHub:
   - GitHub → **Settings** (профиль) → **Developer settings** → **OAuth Apps** → **New OAuth App**
   - **Application name:** CarKey reStore CMS
   - **Homepage URL:** `https://ВАШ_ЛОГИН.github.io/ВАШ_РЕПОЗИТОРИЙ`
   - **Authorization callback URL:** `https://api.decapcms.org/auth/done`
   - **Register application**

3. Подробная инструкция: [Decap CMS — GitHub Backend](https://decapcms.org/docs/github-backend/)

## Где менять контент

После развёртывания перейдите на **ваш_сайт/admin** — откроется панель Decap CMS. Через неё можно редактировать:

- **Главный экран** — заголовок, подзаголовок, текст кнопки
- **Компания** — телефон, адрес, режим работы, соцсети
- **Услуги** — список услуг с ценами и описаниями
- **Оборудование** — список приборов и фото

Изменения сохраняются в JSON-файлы в репозитории и автоматически применяются после деплоя GitHub Pages.

## Локальный просмотр

Можно открыть `index.html` в браузере, но `fetch` к `data/*.json` может блокироваться CORS при `file://`. Используйте локальный сервер:

```bash
npx serve .
```

## Домены

- carkeyrestore.ru (основной)
- keyrestore.ru
- keyrestore.pro
- ключи-м5.рф
