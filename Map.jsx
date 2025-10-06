import React, { useState } from 'react';
const Map = ({ width = 800, height = 800, gridSize = 20, stations = [], paths = [], forkliftPositions = [] }) => {
  const cellWidth = width / gridSize;
  const cellHeight = height / gridSize;

  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });

  const showTooltip = (event, station = null, forkliftPosition = null) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: rect.x + rect.width / 2,
      y: rect.y - 10,
      stations_content: station
        ? `🗄 Name: ${station.name}`
        : null,
      forklifts_content: forkliftPosition
        ? `🚜 Name: ${forkliftPosition.name}`
        : null,
    });
  };
 
  const hideTooltip = () => setTooltip({ ...tooltip, visible: false });

  



  return (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height} style={{ border: '1px solid black', backgroundColor: '#f0f0f0' }}>
        {/* Grid lines */}
        {[...Array(gridSize)].map((_, i) => (
          <React.Fragment key={i}>
            <line x1={i * cellWidth} y1={0} x2={i * cellWidth} y2={height} stroke="#eee" strokeWidth="0" />
            <line x1={0} y1={i * cellHeight} x2={width} y2={i * cellHeight} stroke="#eee" strokeWidth="0" />
          </React.Fragment>
        ))}
        {/* Draw Paths */}
        {paths.map((path, index) => {
          const fromStation = stations.find(s => s.id === path.from_station);
          const toStation = stations.find(s => s.id === path.to_station);

          if (!fromStation || !toStation) return null;

          const fromX = fromStation.x * cellWidth + (cellWidth * (fromStation.size || 0));
          const fromY = fromStation.y * cellHeight + (cellHeight * (fromStation.size || 0.5));
          const toX = toStation.x * cellWidth + (cellWidth * (toStation.size || 0));
          const toY = toStation.y * cellHeight + (cellHeight * (toStation.size || 0.5));

          
          const corners = [];
          if (fromX !== toX && fromY !== toY) {
            corners.push({ x: fromX, y: toY }); 
          }

          const points = [{ x: fromX, y: fromY }, ...corners, { x: toX, y: toY }];

          return (
            <React.Fragment key={index}>
              <polyline
                points={points.map(p => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke="#E1EEF2"
                strokeWidth="10"
              />
            </React.Fragment>
          );
        })}
        {/* Stations */}
        {stations.map((station) => {
          let icons="";

          switch (station.type) {
            case "storage":
             icons = "/square.png";
              break;
            case "target":
              icons ="/square.png"
              break;
            case "source":
              icons = "/parking.png";
              break;

          }

          return (
            <g
              key={station.id}
              onMouseEnter={(e) => showTooltip(e, station, null)}
              onMouseLeave={hideTooltip}
            >
              {/*{station.type === "passing" ? (*/}
              {/*  <circle*/}
              {/*    cx={station.x * cellWidth +20}*/}
              {/*    cy={station.y * cellHeight +5 }*/}
              {/*    r={Math.min(cellWidth, cellHeight) * 1.8}*/}
              {/*    fill="#DEE2E6"*/}
              {/*    opacity={1}*/}
              {/*  />*/}
              { station.type === "source" ? (
                <image
                  x={station.x * cellWidth -20}
                  y={station.y * cellHeight -20}
                  width={40}
                  height={40}
                  href={icons}
                  />
                  ) : station.type === "storage" ? (
                    <image
                      x={station.x * cellWidth -8 }
                      y={station.y * cellHeight -20}
                      width={50}
                      height={50}
                      href={icons}
                    />
                  ) : station.type === "target" ? (
                    <image
                        x={station.x * cellWidth -8}
                        y={station.y * cellHeight-20}
                        width={50}
                        height={50}
                        href={icons}
                    />
                  ) : null}
            </g>
          );
        })}

        {/*forklift*/}
        {forkliftPositions && forkliftPositions.map(fp => {
        //  console.log("Rendering forklift:", fp, "cellWidth:", cellWidth, "cellHeight:", cellHeight);
          
          return (
            <g key={`fp-${fp.id}`} onMouseEnter={(e) => showTooltip(e, null, fp)} onMouseLeave={hideTooltip}>
              <circle
                className="blinking-forklift"
                cx={fp.x * cellWidth}
                cy={fp.y * cellHeight}
                r={Math.min(cellWidth, cellHeight) * 1.45}
                fill={fp.color}
              />
              <text
                x={fp.x * cellWidth}
                y={fp.y * cellHeight}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fill="#fff"
              >
                {fp.name}
              </text>
            </g>
          );
        })}

      </svg>
     
      {/* Tooltip */}
      {tooltip.visible && (
        <div
          style={{
            position: 'fixed',
            top: tooltip.y,
            left: tooltip.x,
            transform: 'translate(-50%, -100%)',
            background: '#2c3e50',
            color: '#ecf0f1',
            padding: '10px 14px',
            borderRadius: '6px',
            fontSize: '12px',
            lineHeight: '1.4',
            fontFamily: 'Arial, sans-serif',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {tooltip.stations_content && <div>{tooltip.stations_content}</div>}
          {tooltip.forklifts_content && <div>{tooltip.forklifts_content}</div>}
        </div>
      )}
    </div>
  );
};

export default Map;
