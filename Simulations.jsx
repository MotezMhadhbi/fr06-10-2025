import React, { useEffect, useRef, useState } from "react";
import Map from "../pages/Map";
import SimulationControle from "../components/SimulationControle";
import OrdersTable from "../components/ordersTable";
import { getForklifts } from "../api/forklifts";
import { getOrders } from "../api/transportorders";
import { getPaths } from "../api/paths";
import { getStations } from "../api/stations";
import { getRoutes } from "../api/routes";
import useAnimation from "../hooks/useAnimation";

const forkliftColors = [
  "#f44336", "#4caf50", "#2196f3", "#ff9800",
  "#9c27b0", "#00bcd4", "#e91e63", "#8bc34a",
  "#ffc107", "#607d8b"
];

const Simulations = () => {
  const [forklifts, setForklifts] = useState([]);
  const [stations, setStations] = useState([]);
  const [paths, setPaths] = useState([]);
  const [orders, setOrders] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [mapSize, setMapSize] = useState({ width: 100, height: 100 });

  const mapContainerRef = useRef(null);
  const orderManagerRef = useRef({ orders: [], onOrderFinish: null });

  useEffect(() => {
    orderManagerRef.current.orders = orders;
    orderManagerRef.current.onOrderFinish = (order) => {
      setOrders(prev =>
        prev.map(o => o.Id === order.Id ? { ...o, _status: "completed" } : o)
      );
      console.log(`Order ${order.Id} completed`);
    };
  }, [orders]);

  const {
    forkliftPositions,
    setForkliftPositions,
    animateForklift,
    pause,
    resume,
    stop,
    reset,
    buildChainedRoute,
    delayFromSpeed,
    playAllRoutes
  } = useAnimation({
    initialPositions: [],
    stations,
    routes,
    orderManagerRef
  });

  // --- Fetch data ---
  const fetchAll = async () => {
    try {
      const [forkliftsData, stationsData, pathsData] = await Promise.all([
        getForklifts(),
        getStations(),
        getPaths(),
      ]);

      setForklifts(forkliftsData);
      setStations(stationsData);
      setPaths(pathsData);

      setForkliftPositions(forkliftsData.map((f, index) => ({
        id: f.ForkliftId,
        x: f.displayX ?? 0,
        y: f.displayY ?? 0,
        name: f.name,
        status: f.status,
        color: forkliftColors[index % forkliftColors.length]
      })));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data.map(o => ({ ...o, _status: "pending" })));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRoutesData = async () => {
    try {
      const data = await getRoutes();
      const parsedRoutes = data.map(route => {
        let points = [];
        try {
          points = JSON.parse(route.path_points);
        } catch {
          points = route.path_points.split(",").map(p => Number(p.trim()));
        }
        return { ...route, path_points: points };
      });
      setRoutes(parsedRoutes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAll();
    fetchOrders();
    fetchRoutesData();
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (mapContainerRef.current) {
        const { width, height } = mapContainerRef.current.getBoundingClientRect();
        setMapSize({ width: width - 20, height: height - 20 });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // --- Render ---
  return (
    <div style={{ display: "flex", width: "110vw", height: "110vh", overflow: "scroll" }}>
      <OrdersTable orders={orders} />

      <div
        ref={mapContainerRef}
        style={{
          flex: "0 800px 0",
          minWidth: 800,
          maxWidth: 800,
          minHeight: 600,
          maxHeight: 600,
          display: "flex",
          flexDirection: "column",
          alignItems: "right",
          padding: "10px",
        }}
      >
        <SimulationControle
          onPlay={(action) => {
            switch (action.type) {
              case "start":
                console.log("Simulation started");
                resume();
                playAllRoutes();
                break;
              case "pause":
                console.log("Simulation paused");
                pause();
                break;
              case "resume":
                console.log("Simulation resumed");
                resume();
                break;
              case "stop":
                console.log("Simulation stopped");
                stop();
                break;
              case "reset":
                console.log("Simulation reset");
                reset(forklifts.map((f, index) => ({
                  id: f.ForkliftId,
                  x: f.displayX ?? 0,
                  y: f.displayY ?? 0,
                  name: f.name,
                  status: f.status,
                  color: forkliftColors[index % forkliftColors.length]
                })));
                break;
              default:
                break;
            }
          }}
        />

        <div style={{ flex: 1, width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Map
            width={mapSize.width}
            height={mapSize.height}
            gridSize={70}
            stations={stations}
            locations={forkliftPositions.map(f => ({ id: f.id, name: f.name, x: f.x, y: f.y }))}
            paths={paths}
            forkliftPositions={forkliftPositions}
            routes={routes}
          />
        </div>
      </div>
    </div>
  );
};

export default Simulations;
