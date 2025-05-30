# Bus Telegram WebApp
Приложение для отслеживания автобусов с Telegram-ботом и веб-интерфейсом.

## Функции
- 🚌 Просмотр расписания в реальном времени
- 📱 Адаптивный дизайн
- 🌗 Темная тема

![Demo Preview](./docs/preview.png)

## Функциональность

- Пошаговый мастер бронирования с проверкой данных на каждом этапе
- Мультиоконный интерфейс с возможностью перетаскивания окон
- Интеграция с Telegram WebApp (автозаполнение имени пользователя, передача данных в бота)
- Адаптивный дизайн для мобильных и десктопных устройств
- Темная тема с автоматическим определением системных настроек пользователя
- Поддержка локализации с использованием date-fns

### Секции приложения:

1. **Бронирование** - пошаговый мастер для создания новой брони
2. **Расписание** - просмотр доступных маршрутов и расписания
3. **Цены** - информация о стоимости билетов
4. **Мои билеты** - история бронирования для авторизованных пользователей
5. **Админ-панель** - управление расписанием и бронированиями (для администраторов)

## Технический стек

- **Flask**
- **React 18** с TypeScript
- **Vite** для быстрой разработки
- **Tailwind CSS** для стилизации
- **Framer Motion** для анимаций
- **date-fns** для работы с датами
- **Bun** в качестве JavaScript runtime
- **Docker**
- **GitHub Actions**

## Установка и запуск

### Предварительные требования

- [Bun](https://bun.sh/) (v1.0.0 или выше)
- [Node.js](https://nodejs.org/) (v18 или выше)

### Установка

```bash
# Клонировать репозиторий
git clone https://github.com/your-username/bus-telegram-webapp.git

# Перейти в директорию проекта
cd bus-telegram-webapp

# Установить зависимости
bun install
```

### Запуск для разработки

```bash
bun run dev
```

Приложение будет доступно по адресу: [http://localhost:5173](http://localhost:5173)

### Сборка для продакшн

```bash
bun run build
```

## Интеграция с Telegram WebApp

Приложение разработано для использования в качестве Telegram Web App внутри Telegram-бота. Для интеграции с ботом:

1. В вашем боте для Telegram используйте метод `sendMessage` с параметром `web_app_info`
2. Укажите URL развернутого приложения в качестве значения для `url` в объекте `web_app_info`

Пример код бота (с использованием node-telegram-bot-api):

```javascript
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Заказать билет на автобус", {
    reply_markup: {
      keyboard: [
        [{ text: "Забронировать билет", web_app: { url: "https://your-app-url.com" } }]
      ],
      resize_keyboard: true
    }
  });
});
```

## Структура проекта

```
src/
  ├── components/            # UI компоненты
  │   ├── ui/                # Общие компоненты интерфейса
  │   ├── booking/           # Компоненты для бронирования
  │   ├── schedule/          # Компоненты для расписания
  │   ├── prices/            # Компоненты для цен
  │   ├── myBookings/        # Компоненты для личных бронирований
  │   └── admin/             # Компоненты для админ-панели
  ├── hooks/                 # React хуки
  ├── lib/                   # Утилиты и вспомогательные функции
  ├── types/                 # TypeScript типы и интерфейсы
  ├── App.tsx                # Главный компонент приложения
  └── main.tsx               # Точка входа
```

## Необходимые доработки

1. **API интеграция**: Реализовать настоящее API для работы с данными вместо моковых данных
2. **Пользовательская авторизация**: Сохранение информации о пользователе Telegram и его бронированиях
3. **Интернационализация**: Полная поддержка многоязычности (русский, английский, белорусский)
4. **Улучшение UX мобильной версии**: Оптимизация для использования внутри Telegram на мобильных устройствах
5. **Улучшение календаря**: Доработка календаря для выбора даты для точного соответствия дизайну
6. **Анимации**: Добавление дополнительных анимаций для улучшения пользовательского опыта
7. **Дальнейшая настройка темной темы**: Оптимизация цветовой схемы для темного режима

## Версии

- **v1.0.0**: Базовая функциональность приложения с окнами и пошаговым мастером бронирования
- **v2.0.0**: Обновленный дизайн в соответствии с макетом с использованием coral/orange цветовой схемы

## Лицензия

MIT
