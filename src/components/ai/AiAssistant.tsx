/* biome-ignore lint/correctness/useExhaustiveDependencies: Игнорируем правило для этого файла */
import type React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { routesApi } from '../../lib/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Здравствуйте! Я ваш помощник по расписанию и маршрутам. Чем могу помочь?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Функция для скролла к последнему сообщению
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Эффект для автоматического скролла при изменении сообщений
  // Нам нужна зависимость от messages, чтобы скроллить при добавлении новых сообщений
  useEffect(() => {
    scrollToBottom();
  }, [messages]); // биома жалуется, но нам нужен именно такой список зависимостей

  // Обработчик отправки сообщения
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim()) return;

    // Добавляем сообщение пользователя
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Получаем ответ от "ИИ"
    try {
      const response = await generateAnswer(inputText);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Ошибка при генерации ответа:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.',
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Функция для генерации ответа от "ИИ"
  const generateAnswer = async (question: string): Promise<string> => {
    // Имитация задержки для реалистичности
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Приводим вопрос к нижнему регистру для удобства сравнения
    const lowerQuestion = question.toLowerCase();

    // Проверяем ключевые слова в вопросе
    if (lowerQuestion.includes('расписание') || lowerQuestion.includes('когда') || lowerQuestion.includes('время')) {
      // Получаем все маршруты для формирования ответа
      const routes = await routesApi.getAll();

      if (routes.length === 0) {
        return 'К сожалению, у меня нет информации о расписании. Пожалуйста, уточните у оператора.';
      }

      // Проверяем, упоминается ли конкретный город в вопросе
      const cities = [...new Set([
        ...routes.map(r => r.origin.toLowerCase()),
        ...routes.map(r => r.destination.toLowerCase())
      ])];

      const mentionedCity = cities.find(city => lowerQuestion.includes(city));

      if (mentionedCity) {
        const relevantRoutes = routes.filter(
          r => r.origin.toLowerCase() === mentionedCity || r.destination.toLowerCase() === mentionedCity
        );

        if (relevantRoutes.length > 0) {
          let response = `Нашёл информацию о маршрутах через ${capitalize(mentionedCity)}:\n\n`;

          for (const route of relevantRoutes) {
            response += `• ${route.name}: время в пути ${route.duration}, стоимость ${route.price} ${route.currency}\n`;
          }

          return response;
        }
      }

      // Общая информация о расписании
      return `У нас есть ${routes.length} маршрутов. Вы можете уточнить конкретный город, например: "Когда автобус в Варшаву?" или перейти на вкладку "Расписание" для подробной информации.`;
    }

    if (lowerQuestion.includes('цена') || lowerQuestion.includes('стоимость') || lowerQuestion.includes('сколько стоит')) {
      // Если спрашивают о цене
      const routes = await routesApi.getAll();

      // Проверяем, упоминается ли конкретный город в вопросе
      const cities = [...new Set([
        ...routes.map(r => r.origin.toLowerCase()),
        ...routes.map(r => r.destination.toLowerCase())
      ])];

      const mentionedCity = cities.find(city => lowerQuestion.includes(city));

      if (mentionedCity) {
        const relevantRoutes = routes.filter(
          r => r.origin.toLowerCase() === mentionedCity || r.destination.toLowerCase() === mentionedCity
        );

        if (relevantRoutes.length > 0) {
          let response = `Вот информация о ценах на маршруты через ${capitalize(mentionedCity)}:\n\n`;

          for (const route of relevantRoutes) {
            response += `• ${route.name}: ${route.price} ${route.currency}\n`;
          }

          return response;
        }
      }

      // Общая информация о ценах
      return 'Цены на билеты зависят от направления. Вы можете посмотреть актуальную стоимость на вкладке "Цены" или спросить о конкретном маршруте.';
    }

    if (lowerQuestion.includes('привет') || lowerQuestion.includes('здравствуй')) {
      return 'Здравствуйте! Чем я могу вам помочь? Вы можете спросить меня о расписании, ценах или маршрутах.';
    }

    if (lowerQuestion.includes('спасибо')) {
      return 'Всегда рад помочь! Если у вас возникнут еще вопросы, обращайтесь.';
    }

    // Ответ по умолчанию
    return 'Я могу отвечать на вопросы о расписании, маршрутах и ценах на билеты. Пожалуйста, уточните ваш запрос.';
  };

  // Вспомогательная функция для капитализации строки
  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Заголовок */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-800 dark:text-white">ИИ-помощник</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Задайте вопрос о расписании, маршрутах или ценах
        </p>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`${
              message.sender === 'user'
                ? 'ml-auto bg-blue-600 text-white'
                : 'mr-auto bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
            } rounded-lg p-3 max-w-[80%] whitespace-pre-wrap`}
          >
            {message.text}
          </div>
        ))}

        {isTyping && (
          <div className="mr-auto bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[80%]">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce delay-75" />
              <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce delay-150" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Введите сообщение..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className={`px-4 py-2 rounded-lg font-medium ${
              !inputText.trim() || isTyping
                ? 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Отправить
          </button>
        </div>
      </form>
    </div>
  );
};

export default AiAssistant;
