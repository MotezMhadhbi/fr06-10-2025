import { useRef, useState } from "react";
import { assignOrderToForklift, resetAllOrders } from "../api/transportorders";

export default function useAnimation({ initialPositions = [], stations = [], routes = [], orderManagerRef }) {
  const [forkliftPositions, setForkliftPositions] = useState(initialPositions);
  const intervalsRef = useRef({});
  const pausedRef = useRef(false);

  const pause = () => { console.log("Simulation paused"); pausedRef.current = true; };
  const resume = () => { console.log("Simulation resumed"); pausedRef.current = false; };
  const stop = () => {
    Object.values(intervalsRef.current).forEach(cancelAnimationFrame);
    intervalsRef.current = {};
    console.log("Simulation stopped");
  };

  const reset = async (positions = initialPositions) => {
    stop();
    pausedRef.current = false;
    setForkliftPositions(positions);
    if (orderManagerRef?.current) {
      await resetAllOrders();
      orderManagerRef.current.orders.forEach(order => order.VehicleId = null);
      console.log("All orders reset in backend and frontend");
    }
  };

  const getForkliftPos = (vehicleId) => forkliftPositions.find(f => String(f.id) === String(vehicleId)) || null;

  const findStationById = (id) => stations.find(s => Number(s.id) === Number(id)) || null;
  const findStationIdByName = (name) => {
    const st = stations.find(s => s.name?.trim().toLowerCase() === name.trim().toLowerCase());
    return st ? Number(st.id) : null;
  };

  const distance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  const findNearestStationId = (pos) => {
    if (!stations || stations.length === 0) return null;
    let nearest = stations[0], minDist = distance(pos, nearest);
    for (const st of stations) { const d = distance(pos, st); if (d < minDist) { minDist = d; nearest = st; } }
    return nearest.id;
  };

  function generateGridSegmentPoints(from, to, step = 5) {
    const points = [];
    const dx = to.x - from.x, dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.max(1, Math.floor(dist / step));
    for (let i = 1; i <= steps; i++) points.push({ x: from.x + dx * i / steps, y: from.y + dy * i / steps });
    return points;
  }

  function buildRouteCoordinates(pathPoints) {
    const coords = [];
    let lastPos = null;
    pathPoints.forEach(id => {
      const st = findStationById(id);
      if (!st) return console.warn("Station not found:", id);
      if (lastPos) coords.push(...generateGridSegmentPoints(lastPos, st, 10));
      else coords.push(st);
      lastPos = st;
    });
    return coords;
  }

  function buildGraphFromRoutes() {
    const graph = {};
    routes.forEach(r => {
      let points = r.path_points;
      if (typeof points === "string") {
        try { points = JSON.parse(points); }
        catch { points = points.split(",").map(p => Number(p.trim())); }
      }
      points = points.map(p => Number(p));
      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i], b = points[i + 1];
        if (!graph[a]) graph[a] = []; if (!graph[b]) graph[b] = [];
        if (!graph[a].includes(b)) graph[a].push(b); if (!graph[b].includes(a)) graph[b].push(a);
      }
    });
    return graph;
  }

  function buildRouteThroughStations(startId, endId) {
    const graph = buildGraphFromRoutes();
    const queue = [[startId]];
    const visited = new Set();
    while (queue.length) {
      const path = queue.shift(), last = path[path.length - 1];
      if (last === endId) return path;
      if (visited.has(last)) continue;
      visited.add(last);
      (graph[last] || []).forEach(n => queue.push([...path, n]));
    }
    console.warn("No path found", startId, endId);
    return [];
  }

  async function buildChainedRoute(forklift, order) {
    const sourceId = findStationIdByName(order.SourceLocation);
    const targetId = findStationIdByName(order.TargetLocation);
    if (!sourceId || !targetId) {
      console.warn("Invalid order source/target", order);
      return [];
    }

    console.log(`Forklift ${forklift.name} will handle Order ${order.Id} from ${order.SourceLocation} to ${order.TargetLocation}`);

    let route = routes.find(r => Number(r.actual_station_id) === sourceId && Number(r.destination_station_id) === targetId);
    if (!route) {
      console.warn("No route found in DB for order", order.Id);
      return [];
    }

    let pathPoints = typeof route.path_points === "string" ? JSON.parse(route.path_points) : route.path_points.map(p => Number(p));
    const targetRouteCoords = buildRouteCoordinates(pathPoints);

 
    const startPos = { x: forklift.x, y: forklift.y };
    const nearestStationId = findNearestStationId(startPos);
    const pathToSourceIds = buildRouteThroughStations(nearestStationId, sourceId);
    const pathToSourceCoords = pathToSourceIds.map(id => {
      const st = findStationById(id);
      return { x: st.x, y: st.y };
    });

    return [...pathToSourceCoords, ...targetRouteCoords];
  }

  function animateForklift(forkliftId, routePoints, delayMs = 10, pauseMs = 1000, returnRoute = [], onFinish) {
    if (!routePoints.length) { if (onFinish) onFinish(); return; }
    if (intervalsRef.current[forkliftId]) cancelAnimationFrame(intervalsRef.current[forkliftId]);

    let index = 0, pos = { ...routePoints[0] }, currentRoute = routePoints, onReturn = false, segmentSteps = [], stepIndex = 0;

    const prepareSegmentSteps = (start, end) => {
      const dx = end.x - start.x, dy = end.y - start.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(Math.ceil(dist / 0.5), 1);
      const arr = [];
      for (let s = 1; s <= steps; s++) arr.push({ x: start.x + dx * s / steps, y: start.y + dy * s / steps });
      return arr;
    };

    const moveStep = () => {
      if (pausedRef.current) { intervalsRef.current[forkliftId] = requestAnimationFrame(moveStep); return; }
      if (stepIndex >= segmentSteps.length) {
        const nextPoint = currentRoute[index + 1];
        if (!nextPoint) {
          if (!onReturn && returnRoute.length > 0) {
            setTimeout(() => {
              currentRoute = returnRoute; index = 0; pos = { ...returnRoute[0] }; segmentSteps = []; stepIndex = 0; onReturn = true;
              intervalsRef.current[forkliftId] = requestAnimationFrame(moveStep);
            }, pauseMs);
            return;
          } else { if (onFinish) onFinish(); return; }
        }
        segmentSteps = prepareSegmentSteps(pos, nextPoint); stepIndex = 0; index++;
      }

      pos = segmentSteps[stepIndex++];
      setForkliftPositions(prev => prev.map(fp => String(fp.id) === String(forkliftId) ? { ...fp, x: pos.x, y: pos.y } : fp));

      intervalsRef.current[forkliftId] = requestAnimationFrame(moveStep);
    };

    intervalsRef.current[forkliftId] = requestAnimationFrame(moveStep);
  }

  const delayFromSpeed = (speedMultiplier) => Math.max(10, Math.round(100 / Math.max(0.01, speedMultiplier)));


  async function playAllRoutes(speedMultiplier = 0.6) {
    if (!orderManagerRef?.current) return;
    const orders = orderManagerRef.current.orders;

    const assignOrderToFreeForklift = async (forklift) => {
   
      const nextOrder = orders.find(o => !o.VehicleId && o._status === "pending");
      if (!nextOrder) return;

      console.log(`Forklift ${forklift.name} checking for next order...`);

      try {
        await assignOrderToForklift(nextOrder.Id, forklift.id);
        nextOrder.VehicleId = forklift.id;
        forklift.activeOrder = nextOrder.Id;
        console.log(`Forklift ${forklift.name} assigned to Order ${nextOrder.Id}`);

        const fullRoute = await buildChainedRoute(forklift, nextOrder);
        if (!fullRoute.length) {
          console.warn(`Forklift ${forklift.name} could not build route for Order ${nextOrder.Id}`);
          forklift.activeOrder = null;
          return;
        }

        animateForklift(
          forklift.id,
          fullRoute,
          delayFromSpeed(speedMultiplier),
          1000,
          [],
          async () => {
            console.log(`Forklift ${forklift.name} completed Order ${nextOrder.Id}`);
            forklift.activeOrder = null;
            if (orderManagerRef.current.onOrderFinish) orderManagerRef.current.onOrderFinish(nextOrder);
            await assignOrderToFreeForklift(forklift);
          }
        );
      } catch (err) {
        console.error("Error assigning order to forklift:", err);
      }
    };

    
    forkliftPositions.filter(f => !f.activeOrder).forEach(fk => assignOrderToFreeForklift(fk));
  }

  return {
    forkliftPositions,
    setForkliftPositions,
    pause,
    resume,
    stop,
    reset,
    getForkliftPos,
    findStationIdByName,
    findStationById,
    buildChainedRoute,
    animateForklift,
    delayFromSpeed,
    playAllRoutes
  };
}
