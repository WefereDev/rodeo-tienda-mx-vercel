import React, {useState, useEffect} from 'react';

const Countdown = () => {
  const calculateTimeLeft = () => {
    const targetDate = new Date('2024-08-06T00:00:00');
    const now = new Date();
    const difference = targetDate - now;

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center font-sans">
      <h1 className="text-2xl mb-4">Cuenta regresiva hasta el 6 de agosto</h1>
      <div className="flex justify-center space-x-4">
        <div className="text-center">
          <span className="block text-4xl text-red-600">{timeLeft.days}</span>
          <span className="text-gray-600">Días</span>
        </div>
        <div className="text-center">
          <span className="block text-4xl text-red-600">{timeLeft.hours}</span>
          <span className="text-gray-600">Horas</span>
        </div>
        <div className="text-center">
          <span className="block text-4xl text-red-600">
            {timeLeft.minutes}
          </span>
          <span className="text-gray-600">Minutos</span>
        </div>
        <div className="text-center">
          <span className="block text-4xl text-red-600">
            {timeLeft.seconds}
          </span>
          <span className="text-gray-600">Segundos</span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
