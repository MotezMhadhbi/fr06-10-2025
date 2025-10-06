import React from 'react';
import { resetAllOrders } from '../api/transportorders';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

const OrdersTable = ({ orders , fetchOrders }) => (
  <div>
  {/* Left Panel */ }
  < div style = {{
    flex: '0 0 450px',
    minWidth: 100,
    maxWidth: 600,
    backgroundColor: '#F1F1EE ',
    display: 'flex',
    flexDirection: 'column',
  }}>
        <div style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ccc', backgroundColor: '#6f6f6f' }}>
        <h2 style={{ margin: 0, color: '#fff', fontWeight: 'bold' }}>Transport Orders without Optimization</h2>
        <button
          onClick={async () => {
            try {
              await resetAllOrders();
              alert("All assignments reset successfully!");
             
              fetchOrders();
            } catch (err) {
              alert("Failed to reset assignments");
            }
          }}
        >
          Reset Assignments
        </button>

        </div>
        <div style={{ flexGrow: 1, padding: '10px', overflowY: 'auto', color: '#fff' }}>
          {/* TO content */}
          <TableContainer component={Paper} sx={{ maxHeight: "50vh" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>TransportR</TableCell>
                  <TableCell>ForkliftId</TableCell>
                  {/*<TableCell>FName</TableCell>*/}
                  <TableCell>StartAt</TableCell>
                  <TableCell>EndAt</TableCell>
                  <TableCell>OPlan</TableCell>
                  <TableCell>SArea</TableCell>
                  <TableCell>SourceL</TableCell>
                  <TableCell>TArea</TableCell>
                  <TableCell>TargetL</TableCell>
                  <TableCell>SiteNo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order.Id}>
                      <TableCell>{order.Id}</TableCell>
                      <TableCell>{order.TransportRequestId}</TableCell>
                      <TableCell>{order.VehicleId}</TableCell>
                      {/* <TableCell>{f.name}</TableCell>*/}
                      <TableCell>{order.EstimatedStartTime}</TableCell>
                      <TableCell>{order.EstimatedEndTime}</TableCell>
                      <TableCell>{order.OptimizedPlanId}</TableCell>
                      <TableCell>{order.SourceArea}</TableCell>
                      <TableCell>{order.SourceLocation}</TableCell>
                      <TableCell>{order.TargetArea}</TableCell>
                      <TableCell>{order.TargetLocation}</TableCell>
                      <TableCell>{order.SiteNo}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No Transport Order found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
    </div >
 </div>
);

export default OrdersTable;
