import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import Legend from "./Legend";

export default function CesiumViewer() {
  const viewerRef = useRef(null);
  const server = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!viewerRef.current) return;

    const viewer = new Cesium.Viewer(viewerRef.current, {
      timeline: false,
      animation: false,
      shouldAnimate: false

  });

  
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
              -70.74637827094256,
              7.021573570407648,
              400
            ),
            orientation: {
                heading: Cesium.Math.toRadians(154.75440050996818),
                pitch: Cesium.Math.toRadians(-22.820104690091828),
                roll: 0
            }
        });
      });

      viewer.homeButton.viewModel.command.beforeExecute.addEventListener((e) => {
        e.cancel = true; // cancela el comportamiento por defecto
    
        viewer.zoomTo(dataSource).then(() => {
          viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(
              -70.74637827094256,
              7.021573570407648,
              400
            ),
            orientation: {
              heading: Cesium.Math.toRadians(154.75440050996818),
              pitch: Cesium.Math.toRadians(-22.820104690091828),
              roll: 0
            }
        });
      });
    });

    /*
      viewer.camera.changed.addEventListener(() => {
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

            entity.polygon.extrudedHeight = 0;
    
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
          else if (nombre?.toLowerCase().includes("respel") ) {
            entity.polygon.material = Cesium.Color.RED.withAlpha(0.6);
          }
          else {
              entity.polygon.material = Cesium.Color.WHITE.withAlpha(0.6);
          }
   
    
            // Bordes
            entity.polygon.outline = true;
            entity.polygon.outlineColor = Cesium.Color.BLACK;


            // Calcular centro del polígono
            const hierarchy = entity.polygon.hierarchy.getValue();
            const positions = hierarchy.positions;

            const center = Cesium.BoundingSphere.fromPoints(positions).center;

            // ASIGNAR POSICIÓN (esto es lo que te falta)
            entity.position = center;

            // CREAR LABEL
            entity.label = new Cesium.LabelGraphics({
              text: nombre,
              font: "13px sans-serif",
              fillColor: Cesium.Color.WHITE,
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 2,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              showBackground: true,
              backgroundColor: Cesium.Color.BLACK.withAlpha(0.6),
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new Cesium.Cartesian2(0, -10),
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                0,      // distancia mínima (cerca)
                350    // distancia máxima (lejos)
              )
            });


          }
        });
    
      }).catch(error => {
        console.error("Error cargando GeoJSON:", error);
      });



      const urlSede = `${server}/api/v1/data/sede/data.geojson`;

            Cesium.GeoJsonDataSource.load(urlSede, {
              clampToGround: false
            }).then((dataSource) => {

              viewer.dataSources.add(dataSource);
              dataSource.entities.values.forEach(entity => {
   
                if (entity.polygon) {

                  const nombre =
                    entity.properties?.nombre?.getValue() ||
                    entity.properties?.id?.getValue() ||
                    "Predio";

                  const hierarchy = entity.polygon.hierarchy.getValue();
                  const positions = hierarchy.positions;

             
                  const center = Cesium.BoundingSphere.fromPoints(positions).center;

            
                  entity.polyline = {
                    positions: positions,
                    width: 5,
                    material: Cesium.Color.CYAN,
                    clampToGround: true
                  };

           
                  entity.polygon = undefined;

         
                  entity.position = center;

                  entity.label = new Cesium.LabelGraphics({
                    text: nombre,
                    font: "14px sans-serif",
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    showBackground: true,
                    backgroundColor: Cesium.Color.BLACK.withAlpha(0.6),
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(200, 5000)
                  });
                }

              });

            }).catch(error => {
              console.error("Error cargando GeoJSON:", error);
            });
                

    return () => {
      viewer.destroy();
    };
  }, []);
  

  return (
    <div style={{width: "100%", height: "100vh", position: "relative" }}>
    <div
      ref={viewerRef}
      style={{ width: "100%", height: "100%" }}
    />
    <Legend />
    </div>

    
  );
}