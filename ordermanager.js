export default class OrderManager {
  constructor(opts = {}) {
    this.queues = {};
    this.animateForklift = opts.animateForklift;
    this.speed = opts.speed || 1;
    this.onOrderStart = opts.onOrderStart;
    this.onOrderFinish = opts.onOrderFinish;
    this.getForkliftPos = opts.getForkliftPos;
    this.stations = opts.stations || [];
    this.generateGridSegmentPoints = opts.generateGridSegmentPoints;
    this.isBlockedForklift = opts.isBlockedForklift || (() => false);
    this.pendingOrders = [];
  }

  
  addPendingOrder(order) {
    console.log(`Order ${order.Id} added to pending list`);
    this.pendingOrders.push(order);
    this.assignNextOrder();
  }

 
  assignNextOrder() {
    this.pendingOrders.forEach(order => {
 
      if (order.VehicleId) return;

     
      const freeFk = Object.keys(this.queues)
        .map(id => ({ id, busy: this.queues[id].length > 0 }))
        .filter(fk => !fk.busy)
        .map(fk => fk.id)[0];

      if (!freeFk) return; 

     
      order.VehicleId = freeFk;
      console.log(`Forklift ${freeFk} assigned to Order ${order.Id}`);

      if (!this.queues[freeFk]) this.queues[freeFk] = [];
      this.queues[freeFk].push(order);

   
      if (this.queues[freeFk].length === 1) this.runNextOrder(freeFk);
    });
  }

  runNextOrder(fkId) {
    const queue = this.queues[fkId];
    if (!queue || queue.length === 0) return;

    if (this.isBlockedForklift(fkId)) {
      setTimeout(() => this.runNextOrder(fkId), 500);
      return;
    }

    const order = queue[0];
    console.log(`Forklift ${fkId} starting Order ${order.Id}`);

    if (this.onOrderStart) {
      try { this.onOrderStart(order); } catch (e) { console.error(e); }
    }

   
    const fkPos = this.getForkliftPos(fkId);
    const sourceStation = this.stations.find(st => st.name === order.SourceLocation);
    const targetStation = this.stations.find(st => st.name === order.TargetLocation);

    if (!fkPos || !sourceStation || !targetStation) {
      console.error(`Invalid route for order ${order.Id}`);
      queue.shift();
      if (queue.length > 0) this.runNextOrder(fkId);
      return;
    }

    const routeToSource = this.generateGridSegmentPoints(fkPos, sourceStation, 2);
    const routeToTarget = this.generateGridSegmentPoints(sourceStation, targetStation, 2);
    const fullRoute = [...routeToSource, ...routeToTarget];

    this.animateForklift(
      fkId,
      fullRoute,
      this.speed,
      () => {
        console.log(`Forklift ${fkId} completed Order ${order.Id}`);
        if (this.onOrderFinish) {
          try { this.onOrderFinish(order); } catch (e) { console.error(e); }
        }

        queue.shift();

     
        this.pendingOrders = this.pendingOrders.filter(o => o.Id !== order.Id);

     
        this.assignNextOrder();

     
        if (queue.length > 0) this.runNextOrder(fkId);
      }
    );
  }

  update({ speed }) {
    if (speed) this.speed = speed;
  }

  clearAll() {
    this.queues = {};
    this.pendingOrders = [];
  }
}
