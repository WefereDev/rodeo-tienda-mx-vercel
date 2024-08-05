import React, {useState, useEffect, useRef} from 'react';

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
  const isPaused = useRef(false);

  useEffect(() => {
    if (!isPaused.current) {
      const timer = setInterval(() => {
        const newTimeLeft = calculateTimeLeft();
        setTimeLeft(newTimeLeft);
        if (Object.keys(newTimeLeft).length === 0) {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, []);

  const pauseCountdown = () => {
    isPaused.current = true;
  };

  pauseCountdown();

  return (
    <div className="flex flex-col items-center justify-center text-center font-black w-dvw h-[80dvh] text-white px-6">
      <div className="flex justify-center space-x-4">
        <div className="text-center">
          <span className="block text-6xl">{timeLeft.days || 0}</span>
          <span className="text-gray-300">Días</span>
        </div>
        <div className="text-center">
          <span className="block text-6xl">{timeLeft.hours || 0}</span>
          <span className="text-gray-300">Horas</span>
        </div>
        <div className="text-center">
          <span className="block text-6xl">{timeLeft.minutes || 0}</span>
          <span className="text-gray-300">Minutos</span>
        </div>
        <div className="text-center">
          <span className="block text-6xl">{timeLeft.seconds || 0}</span>
          <span className="text-gray-300">Segundos</span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
