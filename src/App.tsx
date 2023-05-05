import React, { useState, useEffect, CSSProperties } from 'react';

interface ActivePointProps {
  position: number;
}

const ActivePoint: React.FC<ActivePointProps> = ({ position }) => {
  const [isPulsing, setIsPulsing] = useState<boolean>(false);

  const pointStyle: CSSProperties = {
    width: '10px',
    height: '10px',
    backgroundColor: 'blue',
    borderRadius: '50%',
    position: 'absolute',
    left: `${position}px`,
    boxShadow: isPulsing
      ? '0 0 25px 10px rgba(0, 0, 255, 0.8)'
      : '0 0 7px 3px rgba(0, 0, 255, 0.5)',
    transition: 'box-shadow 2s ease-in-out',
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsPulsing((prevIsPulsing) => !prevIsPulsing);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return <div style={pointStyle}></div>;
};

const App: React.FC = () => {
  const rowHeight = 10;
  const numRows = Math.floor(window.innerHeight / rowHeight);
  const containerWidth = window.innerWidth;

  const [activePoints, setActivePoints] = useState<number[]>(Array(numRows).fill(0));

  useEffect(() => {
    setActivePoints(Array(numRows).fill(0));
  }, [numRows]);

  useEffect(() => {
    const updateActivePoints = () => {
      const time = Date.now() / 1000;
      setActivePoints((prevPoints) =>
        prevPoints.map((_, index) => {
          const frequencyMultiplier = 0.002;
          const frequency = frequencyMultiplier * (index + 1);
          const phaseShift = 2 * Math.PI * frequency * time;
          const position = (Math.sin(phaseShift) + 1) / 2;
          return position * containerWidth;
        }),
      );
    };

    const intervalId = setInterval(updateActivePoints, 10);
    return () => clearInterval(intervalId);
  }, [containerWidth]);

  const containerStyle: CSSProperties = {
    width: `${containerWidth}px`,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  return (
    <div className="App" style={containerStyle}>
      {Array.from({ length: numRows }, (_, rowIndex) => (
        <div key={rowIndex} style={{ height: `${rowHeight}px`, position: 'relative' }}>
          <ActivePoint position={activePoints[rowIndex]} />
        </div>
      ))}
    </div>
  );
};

export default App;
