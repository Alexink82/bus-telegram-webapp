import type React from 'react';
import { useState, useEffect } from 'react';
import {Input} from '../ui/Input';
import {Button} from '../ui/Button';


import 'react-day-picker/dist/style.css';

const SchedulePage: React.FC = () => {

  const [busNumber, setBusNumber] = useState('');

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-text dark:text-white mb-6">Автобусное расписание</h1>
      <div className="flex gap-4 mb-6">
        <Input type="text" placeholder="Номер автобуса" className="input input-bordered w-full" value={busNumber} onChange={(e) => setBusNumber(e.target.value)} />
        <Button onClick={() => {}} >Поиск</Button>
      </div>

      <Card className="w-full max-w-md">
        {/* Таблица расписания */}
      </Card>
    </div>
  );
};+

const Card = ({className, children}: {className?: string, children: React.ReactNode}) => {
  return <div className={`card bg-base-200 p-6 rounded-lg ${className}`}>
    {children}
  </div>
};

export default SchedulePage;
