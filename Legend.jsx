import React from "react";
import { Box, Typography } from "@mui/material";

const Legend = ({ forklifts, blockedForklifts, setBlockedForklifts }) => {
  const [inputId, setInputId] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleBlock = () => {
    const id = inputId.trim();
    if (!id) {
      setErrorMessage("Please enter a forklift ID");
      return;
    }

    const forkliftExists = forklifts.some((f) => String(f.ForkliftId) === id);
    if (!forkliftExists) {
      setErrorMessage(`Forklift ID "${id}" doesn't exist`);
      return;
    }

    setBlockedForklifts((prev) => new Set(prev).add(id));
    setInputId("");
    setErrorMessage("");
  };

  const handleUnblock = () => {
    if (!inputId.trim()) return;
    setBlockedForklifts((prev) => {
      const updated = new Set(prev);
      updated.delete(inputId.trim());
      return updated;
    });
    setInputId("");
  };

  const isBlocked = (forkliftId) => blockedForklifts.has(forkliftId.toString());

  return (
    <Box sx={{ textAlign: "center", mt: 2 }}>
      {/* 🗺 Legend Section */}
      <div
        style={{
          marginTop: "10px",
          marginBottom: "10px",
          width: "100%",
          maxWidth: "950px",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <span>
            <img src="/parking.png" alt="Parking" width="20" /> Parking
          </span>
          <span>
            <img src="/square.png" alt="Storage" width="20" /> Storage
          </span>
        </div>
      </div>

      {/* 🚫 Block/Unblock Forklift Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        <input
          type="text"
          placeholder="Forklift ID"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          style={{
            padding: "6px",
            borderRadius: 6,
            border: "1px solid #888",
            width: 100,
          }}
        />
        <button
          onClick={handleBlock}
          style={{
            padding: "6px 10px",
            border: "1px solid #444",
            borderRadius: 6,
            background: "#f44336",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          🚫 Block
        </button>
        <button
          onClick={handleUnblock}
          style={{
            padding: "6px 10px",
            border: "1px solid #444",
            borderRadius: 6,
            background: "#4caf50",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          🔓 Unblock
        </button>
      </div>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </Box>
  );
};

export default Legend;
