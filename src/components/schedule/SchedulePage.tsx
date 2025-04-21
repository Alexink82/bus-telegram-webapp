import type React from 'react';
import { useState, useEffect } from 'react';
import {Input} from '../ui/Input';
import {Button} from '../ui/Button';
import {Card} from '../ui/Card';


import 'react-day-picker/dist/style.css';

const SchedulePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedDestination, setSelectedDestination] = useState('');

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold mb-6 text-text dark:text-white">Расписание автобусов</h2>
      <div className="flex gap-4 mb-6 w-full max-w-md">
        <Input
          type="text"
          placeholder="Номер автобуса"
          className="w-full"
          value={busNumber}
          onChange={(e) => setBusNumber(e.target.value)}
        />
        <Button onClick={() => {}} className="btn-primary">Поиск</Button>
      </div>

      <Card className="w-full max-w-md">
        {/* Таблица расписания */}
      </Card>
    </div>
  );
};

export default SchedulePage;
