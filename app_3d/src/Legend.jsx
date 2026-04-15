import React, { useState } from "react";

const legendItems = [
  { key: "laboratorio", label: "Laboratorios", color: "gold" },
  { key: "aula", label: "Aulas", color: "orange" },
  { key: "cafeteria", label: "Cafetería", color: "chocolate" },
  { key: "temporal", label: "Instalaciones temporales", color: "darkgray" },
  { key: "gimnasio", label: "Instalaciones deportivas", color: "rosybrown" },
  { key: "planta", label: "Plantas de tratamiento de agua", color: "blue" },
  { key: "respel", label: "Residuos peligrosos", color: "red" },
  { key: "otros", label: "Instalaciones Dotacionales", color: "white", border: "1px solid black" },
];

const Legend = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div style={styles.container}>
      
      {/* Header clickeable */}
      <div style={styles.header} onClick={() => setCollapsed(!collapsed)}>
        <span>Leyenda</span>
        <span style={styles.toggle}>{collapsed ? "➕" : "➖"}</span>
      </div>

      {/* Contenido */}
      {!collapsed && (
        <div>
          {legendItems.map((item) => (
            <div key={item.key} style={styles.row}>
              <span
                style={{
                  ...styles.box,
                  background: item.color,
                  border: item.border || "none",
                }}
              />
              <span>{item.label}</span>
            </div>
          ))}

          <hr style={styles.divider} />

          <div style={styles.row}>
            <span style={styles.line} />
            <span>Límite sede</span>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: "absolute",
    top: "20px",
    left: "20px",
    background: "rgba(30,30,30,0.9)",
    padding: "10px",
    borderRadius: "10px",
    color: "white",
    fontSize: "12px",
    zIndex: 1000,
    minWidth: "180px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  toggle: {
    fontSize: "14px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    marginBottom: "6px",
  },
  box: {
    width: "16px",
    height: "16px",
    marginRight: "8px",
  },
  line: {
    width: "16px",
    height: "3px",
    background: "cyan",
    marginRight: "8px",
  },
  divider: {
    border: "0.5px solid rgba(255,255,255,0.3)",
    margin: "8px 0",
  },
};

export default Legend;