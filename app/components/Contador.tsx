import React, {useState, useEffect, useRef} from 'react';

const Countdown = () => {
  const calculateInitialTime = () => {
    const targetDate = new Date('2024-08-09T17:00:00'); // 9 de agosto a las 5 p.m.
    const now = new Date();

    const totalSeconds = Math.floor((targetDate - now) / 1000);

    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateInitialTime());
  const isPaused = useRef(false);

  const calculateTimeLeft = () => {
    const {days, hours, minutes, seconds} = timeLeft;
    let totalSeconds =
      days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;

    if (totalSeconds > 0) {
      totalSeconds -= 1;
    }

    const newDays = Math.floor(totalSeconds / (24 * 60 * 60));
    const newHours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const newMinutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const newSeconds = totalSeconds % 60;

    return {
      days: newDays,
      hours: newHours,
      minutes: newMinutes,
      seconds: newSeconds,
    };
  };

  useEffect(() => {
    if (!isPaused.current) {
      const timer = setInterval(() => {
        const newTimeLeft = calculateTimeLeft();
        setTimeLeft(newTimeLeft);
        if (
          newTimeLeft.days === 0 &&
          newTimeLeft.hours === 0 &&
          newTimeLeft.minutes === 0 &&
          newTimeLeft.seconds === 0
        ) {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  return (
    <div className="flex flex-col items-center justify-center text-center font-black w-dvw h-[80dvh] text-white px-6">
      <div className="flex justify-center space-x-4">
        <div className="text-center">
          <span className="block text-6xl">{timeLeft.days}</span>
          <span className="text-gray-300">Días</span>
        </div>
        <div className="text-center">
          <span className="block text-6xl">{timeLeft.hours}</span>
          <span className="text-gray-300">Horas</span>
        </div>
        <div className="text-center">
          <span className="block text-6xl">{timeLeft.minutes}</span>
          <span className="text-gray-300">Minutos</span>
        </div>
        <div className="text-center">
          <span className="block text-6xl">{timeLeft.seconds}</span>
          <span className="text-gray-300">Segundos</span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
