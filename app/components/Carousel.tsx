import React, {useRef, useState, useEffect, ReactNode} from 'react';

interface CarouselProps {
  children: ReactNode;
  controls?: boolean;
}

interface CarouselItemProps {
  children: ReactNode;
}

interface CarouselControlsProps {
  onNext: () => void;
  onPrev: () => void;
}

const Carousel: React.FC<CarouselProps> = ({children, controls = true}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsRef = useRef<HTMLUListElement>(null);
  const items = React.Children.toArray(children).filter(
    (child) => (child as React.ReactElement).type === CarouselItem,
  );

  const showImage = (index: number) => {
    if (itemsRef.current) {
      const offset = -index * 100;
      itemsRef.current.style.transform = `translateX(${offset}%)`;
    }
    setCurrentIndex(index);
  };

  const prevImage = () => {
    const newIndex = (currentIndex - 1 + items.length) % items.length;
    showImage(newIndex);
  };

  const nextImage = () => {
    const newIndex = (currentIndex + 1) % items.length;
    showImage(newIndex);
  };

  const updateIndicator = () => {
    return `${currentIndex + 1}/${items.length}`;
  };

  const addTouchListeners = () => {
    let startX = 0;
    let endX = 0;

    const touchStartHandler = (event: TouchEvent) => {
      startX = event.touches[0].clientX;
    };

    const touchMoveHandler = (event: TouchEvent) => {
      endX = event.touches[0].clientX;
    };

    const touchEndHandler = () => {
      const diffX = startX - endX;
      if (diffX > 50) {
        nextImage();
      } else if (diffX < -50) {
        prevImage();
      }
    };

    itemsRef.current?.addEventListener('touchstart', touchStartHandler);
    itemsRef.current?.addEventListener('touchmove', touchMoveHandler);
    itemsRef.current?.addEventListener('touchend', touchEndHandler);

    return () => {
      itemsRef.current?.removeEventListener('touchstart', touchStartHandler);
      itemsRef.current?.removeEventListener('touchmove', touchMoveHandler);
      itemsRef.current?.removeEventListener('touchend', touchEndHandler);
    };
  };

  useEffect(() => {
    addTouchListeners();
  }, [currentIndex]);

  return (
    <div style={{position: 'relative', overflow: 'hidden'}}>
      <ul
        ref={itemsRef}
        style={{
          display: 'flex',
          transition: 'transform 0.5s ease',
          width: '100%',
          margin: 0,
          padding: 0,
        }}
      >
        {items}
      </ul>

      {controls && items.length >= 2 && (
        <div
          className="controls"
          style={{
            position: 'absolute',
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            top: 0,
            bottom: 0,
            zIndex: 1,
          }}
        >
          <CarouselControls onNext={nextImage} onPrev={prevImage} />
        </div>
      )}

      <div
        className="indicators"
        style={{position: 'absolute', left: 0, bottom: 0}}
      >
        <span id="indicator" aria-label={updateIndicator()}>
          {updateIndicator()}
        </span>
      </div>
    </div>
  );
};

const CarouselItem: React.FC<CarouselItemProps> = ({children}) => {
  return <li style={{flex: '0 0 100%', listStyle: 'none'}}>{children}</li>;
};

const CarouselControls: React.FC<CarouselControlsProps> = ({
  onNext,
  onPrev,
}) => {
  return (
    <>
      <button
        onClick={onPrev}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          padding: '1rem',
          cursor: 'pointer',
        }}
      >
        Prev
      </button>
      <button
        onClick={onNext}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          padding: '1rem',
          cursor: 'pointer',
        }}
      >
        Next
      </button>
    </>
  );
};

export {Carousel, CarouselItem, CarouselControls};
