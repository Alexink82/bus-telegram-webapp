import type React from 'react';

const PricesPage: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Цены на билеты</h2>

      <div className="mb-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            На этой странице отображается информация о ценах на билеты по различным направлениям.
          </p>

          {/* Примерная таблица цен */}
          <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Маршрут
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Стоимость
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    Минск - Вильнюс
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#ff7a5c] dark:text-[#ff9580]">
                    45 BYN
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    Минск - Варшава
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#ff7a5c] dark:text-[#ff9580]">
                    90 BYN
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    Минск - Рига
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#ff7a5c] dark:text-[#ff9580]">
                    70 BYN
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricesPage;
