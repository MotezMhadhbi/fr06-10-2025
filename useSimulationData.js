import { useEffect, useState } from "react";
import { getForklifts } from "../api/forklifts";
import { getStations } from "../api/stations";
import { getPaths } from "../api/paths";
import { getRoutes } from "../api/routes";
import { getOrders } from "../api/transportorders";

export default function useSimulationData() {
  const [forklifts, setForklifts] = useState([]);
  const [stations, setStations] = useState([]);
  const [paths, setPaths] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [forkliftPositions, setForkliftPositions] = useState([]);
  const [blockedForklifts, setBlockedForklifts] = useState(new Set());
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
  const fetchAll = async () => {
    try {
      const [forkliftData, stationData, pathData, routeData, orderData] =
        await Promise.all([
          getForklifts(),
          getStations(),
          getPaths(),
          getRoutes(),
          getOrders(),
        ]);

      setForklifts(forkliftData);
      setStations(stationData);
      setPaths(pathData);
      setRoutes(routeData);
      setOrders(orderData);

      const initialPositions = forkliftData.map((f) => ({
        id: f.id,
        position: { x: 0, y: 0 },
      }));
      setForkliftPositions(initialPositions);
    } catch (error) {
      console.error("Error fetching simulation data:", error);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    forklifts,
    stations,
    paths,
    routes,
    orders,
    setOrders,
    forkliftPositions,
    setForkliftPositions,
    blockedForklifts,
    setBlockedForklifts,
    mapSize,
    setMapSize,
    fetchAll,
  };
}
