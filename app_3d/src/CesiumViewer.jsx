import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

export default function CesiumViewer() {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    const viewer = new Cesium.Viewer(viewerRef.current, {
      timeline: false,
      animation: false,
      shouldAnimate: false

  });

  const server = "http://136.113.129.29:8400"
    const url = `${server}/api/v1/data/edificio/data.geojson`;
    console.log(url)
      Cesium.GeoJsonDataSource.load(url, {
        clampToGround: false
      }).then((dataSource) => {
    
        viewer.dataSources.add(dataSource);
    
        // Zoom automático
        viewer.zoomTo(dataSource).then(() => {
          viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(
                -70.746, // longitude
                7.0165,  // latitude
                168  // height
            ),
            orientation: {
                heading: Cesium.Math.toRadians(154.75440079895003),
                pitch: Cesium.Math.toRadians(-22.820103233609647),
                roll: 0
            }
        });
      });

      viewer.homeButton.viewModel.command.beforeExecute.addEventListener((e) => {
        e.cancel = true; // cancela el comportamiento por defecto
    
        viewer.zoomTo(dataSource).then(() => {
          viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(
                -70.746, // longitude
                7.0165,  // latitude
                168  // height
            ),
            orientation: {
                heading: Cesium.Math.toRadians(154.75440079895003),
                pitch: Cesium.Math.toRadians(-22.820103233609647),
                roll: 0
            }
        });
      });
    });

     /* viewer.camera.changed.addEventListener(() => {
        const camera = viewer.camera;
        const carto = Cesium.Cartographic.fromCartesian(camera.position);
    
        console.log({
            heading: Cesium.Math.toDegrees(camera.heading),
            pitch: Cesium.Math.toDegrees(camera.pitch),
            longitude: Cesium.Math.toDegrees(carto.longitude),
            latitude: Cesium.Math.toDegrees(carto.latitude),
            height: carto.height
        });
    });*/
    
        // Aplicar estilo y extrusión
        dataSource.entities.values.forEach(entity => {
          if (entity.polygon) {
            const props = entity.properties;
          
            const alturapsw = props.altura?.getValue();
            const nombre = props.NOMBRE?.getValue();

            const altura = Number(alturapsw)*2;
            // Altura base
            entity.polygon.height = 0;

            entity.polygon.extrudedHeight =altura;
    
            if (nombre?.toLowerCase().includes("laborat")) {
              entity.polygon.material = Cesium.Color.GOLD.withAlpha(0.6);
          }  
          else if (nombre?.toLowerCase().includes("aula")) {
            entity.polygon.material = Cesium.Color.ORANGE.withAlpha(0.6);
          } else if (nombre?.toLowerCase().includes("cafetería")) {
            entity.polygon.material = Cesium.Color.CHOCOLATE.withAlpha(0.6);
          }
          else if (nombre?.toLowerCase().includes("temporal") || nombre?.toLowerCase().includes("carpa")) {
            entity.polygon.material = Cesium.Color.DARKGRAY.withAlpha(0.6);
          }
          else if (nombre?.toLowerCase().includes("gimnasio") || nombre?.toLowerCase().includes("polideportivo")) {
            entity.polygon.material = Cesium.Color.ROSYBROWN.withAlpha(0.6);
          }
          else if (nombre?.toLowerCase().includes("planta") ) {
            entity.polygon.material = Cesium.Color.BLUE.withAlpha(0.6);
          }
          else {
              entity.polygon.material = Cesium.Color.WHITE.withAlpha(0.6);
          }
   
    
            // Bordes
            entity.polygon.outline = true;
            entity.polygon.outlineColor = Cesium.Color.BLACK;
          }
        });
    
      }).catch(error => {
        console.error("Error cargando GeoJSON:", error);
      });
      


      /*
      const urlSede = "http://136.113.129.29:8400/api/v1/data/sede/data.geojson";

      Cesium.GeoJsonDataSource.load(urlSede, {
        clampToGround: true   // 🔥 IMPORTANTE
      }).then((dataSource2) => {
      
        viewer.dataSources.add(dataSource2); // 🔥 faltaba esto
      
        viewer.zoomTo(dataSource2);
      
        dataSource2.entities.values.forEach((entity, i) => {
          try {
            if (!entity.polygon) return;
      
            const hierarchy = entity.polygon.hierarchy?.getValue();
      
            if (!hierarchy || !hierarchy.positions) {
              console.warn("❌ Geometría inválida en entity:", i);
              entity.show = false;
              return;
            }
      
            hierarchy.positions.forEach((pos, idx) => {
              if (!pos || isNaN(pos.x) || isNaN(pos.y) || isNaN(pos.z)) {
                console.warn("❌ Coordenada inválida:", i, idx);
                entity.show = false;
              }
            });
      
          } catch (e) {
            console.error("💥 Error en entidad:", i, e);
            entity.show = false;
          }
        });
      
      }).catch(error => {
        console.error("Error cargando GeoJSON:", error);
      });

*/



    return () => {
      viewer.destroy();
    };
  }, []);
  

  return (
    <div
      ref={viewerRef}
      style={{ width: "100%", height: "100vh" }}
    />
  );
}