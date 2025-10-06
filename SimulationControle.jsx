import React, { useState, useEffect, useRef } from 'react';

export default function SimulationControle({ onPlay, speed, setSpeed }) {
  const [simTime, setSimTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [resetFlag, setResetFlag] = useState(false);
  const intervalRef = useRef();
	const [paused, setPause] = useState(false);


  useEffect(() => {
    if (playing && !paused) {
      intervalRef.current = setInterval(() => setSimTime(t => t + speed), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, speed,paused]);

  // Reset
  useEffect(() => {
    if (resetFlag) {
      setSimTime(0);
      setPlaying(false);
			setPause(false);
      setTimeout(() => setResetFlag(false), 100);
    }
  }, [resetFlag]);


  const handlePlayToggle = () => {
    setPlaying(prev => {
      const newState = !prev;
      if (onPlay) {
        onPlay({type: newState ? "start" : "start" });
      }
      return newState;
    });
  };
  const handlepauseToggle = () => {
    if (!playing) return; 
    setPause(prev => {
      const newState = !prev;
      if (onPlay) {
        onPlay({ type: newState ? "pause" : "resume" });
      }
      return newState;
    });

  };

  const handleSpeedSelect = (val) => setSpeed(val);

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        backgroundColor: '#6f6f6f',
        borderBottom: '1px solid #ccc',
				maxWidth: '950px'
      }}>

        <div style={{ display: 'flex', gap: 5, margin: 10 }}>
          <button
            onClick={handlePlayToggle}
            style={{
              padding: "6px 14px",
              border: "1px solid #444",
              borderRadius: 6,
              background: playing ? "#f44336" : "#4caf50",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {playing ? 'Play' : 'Play'}
          </button>

          <button
            onClick={handlepauseToggle}
            disabled={!playing}
            style={{
              padding: "6px 14px",
              border: "1px solid #444",
              borderRadius: 6,
              background: paused ? "#4caf50" : "#f44336",
              color: "#fff",
              cursor: playing ? "pointer" : "allowed",
            }}
          >
            {paused ? 'Resume' : 'Pause'}
          </button>

          <button
            onClick={() => setResetFlag(true)}
            style={{
              padding: "6px 14px",
              border: "1px solid #444",
              borderRadius: 6,
              background: "#eee",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>



        {/*  title */}
        <h2 style={{
          margin: 10,
					gap: 15,
          color: '#fff',
          fontWeight: 'bold',
          textAlign: 'center',
          flex: 1,
        }}>
          Simulations
        </h2>

        {/* Speed */}
        <div style={{ display: 'flex', gap: 15, margin:15 }}>
          {[
            { label: "Slow", value: 0.7 },
            { label: "Medium", value: 3 },
            { label: "Fast", value: 6 },
          ].map(btn => (
            <button
              key={btn.value}
              onClick={() => handleSpeedSelect(btn.value)}
              style={{
                padding: "6px 12px",
                border: "1px solid #888",
                borderRadius: 6,
                background: speed === btn.value ? "#4caf50" : "#fafafa",
                color: speed === btn.value ? "#fff" : "#000",
                cursor: "pointer",
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );



}
