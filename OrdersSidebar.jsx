import React from 'react';

export default function OrdersSidebar({ orders, onSelectOrder, selectedOrderId }) {
  return (
    <div
      style={{
        width: 320,
        background: '#f5f5f5',
        padding: 16,
        borderRight: '1px solid #ccc',
        height: 'calc(100vh - 100px)',
        display: 'flex',
        flexDirection: 'column',
      }}
      className="custom-scrollbar"
    >
      <h3>Transport Assignments</h3>

      <ul style={{ listStyle: 'none', padding: 0, flex: 1, overflowY: 'auto' }}>
        {orders.map(order => (
          <li
            key={order.Id}
            style={{
              marginBottom: 10,
              background: order.Id === selectedOrderId ? '#b3e5fc' : '#fff',
              borderRadius: 6,
              cursor: 'pointer',
              padding: 10,
              border: '1px solid #ddd',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
            onClick={() => onSelectOrder(order.Id)}
          >
            <div style={{ fontWeight: 'bold', marginBottom: 6 }}>
              Assignment #{order.Id}
            </div>
            <div style={{ fontSize: 13, marginBottom: 4 }}>
              <b>Request:</b> {order.TransportRequestId}
            </div>
            <div style={{ fontSize: 13, marginBottom: 4 }}>
              <b>Vehicle:</b> {order.VehicleId}
            </div>
            <div style={{ fontSize: 13, marginBottom: 4 }}>
              <b>From:</b> {order.SourceArea} / {order.SourceLocation}
            </div>
            <div style={{ fontSize: 13, marginBottom: 4 }}>
              <b>To:</b> {order.TargetArea} / {order.TargetLocation}
            </div>
            <div style={{ fontSize: 13, marginBottom: 4 }}>
              <b>Site:</b> {order.SiteNo}
            </div>
            <div style={{ fontSize: 12, color: '#555' }}>
              <b>Estimated:</b> {order.EstimatedStartTime} → {order.EstimatedEndTime}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
