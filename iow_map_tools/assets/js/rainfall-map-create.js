// All required widgets must be initialised in advance for DOJO.
require(["esri/config",
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer",
      "esri/layers/WMSLayer",
      "esri/widgets/LayerList",
      "esri/widgets/Legend"],
     function(esriConfig, Map, MapView, FeatureLayer, WMSLayer, LayerList, Legend) {

        esriConfig.apiKey = "AAPK8ce41e09f1934140a6dc5d21542f78ecGXAZ8rGo1XP4VTlVW8zQbJIyW6AgjCT3H1KUQ4KUOPJ3LxI_rH46mRFdk-7Oe9ro";

        // Load map and initialise view.
        const map = new Map({
          basemap: "satellite" // Basemap layer service
        });

        const view = new MapView({
          map: map,
          center: [-1.326458, 50.670908], // Longitude, latitude
          zoom: 11, // Zoom level
          container: "map-view", // Div element
          popup: {
              dockEnabled: true,
              dockOptions: {
                buttonEnabled: false, // Disables the dock button from the popup
                breakpoint: false, // Ignore the default sizes that trigger responsive docking
                position: "bottom-right"
              }
            }
        });

        // IoW Rainfall Grids - Define TABLE pop-up
        const popupGrids = {
          "title": "Grid Square {CODE}",
          "content": [{
            "type": "fields",
            "title": "Measured Rainfall Information",
            "fieldInfos": [
              {
                "fieldName": "CODE",
                "label": "Grid Code",
                "isEditable": true,
                "tooltip": "",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
              {
                "fieldName": "RAINFALL",
                "label": "Measured Annual Rainfall (mm)",
                "isEditable": true,
                "tooltip": "",
                "visible": true,
                "format": null,
                "stringFieldOption": "text-box"
              },
            ]
          }]
        }

        // Add IoW Rainfall Grids layer
        const rainGrids = new FeatureLayer({
          url: "https://50cr007.sims.cranfield.ac.uk:6443/arcgis/rest/services/IoW_Maps/IoW_Rain/FeatureServer/1",
          outFields: ["CODE","RAINFALL"],
          popupTemplate: popupGrids,
          opacity: 0.7,
          visible: false,
          title: "Rainfall Measured"
        });

        // IoW Rainfall Kriging - Define pop-up with tables and charts
        const popupKriging = {
          title: "Rainfall Kriging Contour Region ({ContourMin}-{ContourMax}mm)",
          outFields: ["*"],
          fieldInfos: [
            {
              fieldName: "ContourMin",
              visible: false,
              label: "Minimum regional annual rainfall (mm)",
              format: {
                places: 0,
                digitSeparator: true
              }
            },
            {
              fieldName: "ContourMax",
              visible: false,
              label: "Maximum regional annual rainfall (mm)",
              format: {
                places: 0,
                digitSeparator: true
              }
            },
            {
              fieldName: "Contour_mid",
              visible: false,
              label: "Midrange regional rainfall (mm)",
              format: {
                places: 0,
                digitSeparator: true
              }
            },
            {
              fieldName: "Island_Av_Rain",
              label: "Mean island annual rainfall (mm)",
              visible: false,
              format: {
                places: 0,
                digitSeparator: true
              }
            },
            {
              fieldName: "Rain_Vol_Total_m3",
              label: "Total annual island rainfall volume (m\u00B3)", //superscript 3
              visible: false,
              format: {
                places: 0,
                digitSeparator: true
              }
            },
            {
              fieldName: "Area_m2",
              label: "Region area (m\u00B2)", //superscript 2
              visible: false,
              format: {
                places: 0,
                digitSeparator: true
              }
            },
            {
              fieldName: "Rain_Volume_m3",
              label: "Total annual regional rainfall volume (m\u00B3)",
              visible: false,
              format: {
                places: 0,
                digitSeparator: true
              }
            },
            {
              fieldName: "Area_Total_m2",
              label: "Island total area (m\u00B2)",
              visible: false,
              format: {
                places: 0,
                digitSeparator: true
              }
            },
            {
              fieldName: "Percentage_Rain",
              label: "Percentage of total island rain volume accounted for by this region.",
              visible: false,
              format: {
                places: 2,
                digitSeparator: true
              }
            },
            {
              fieldName: "Island_Min_Rain",
              label: "Minimum island annual rainfall (mm)",
              visible: false,
              format: {
                places: 0,
                digitSeparator: true
              }
            },
            {
              fieldName: "Island_Max_Rain",
              label: "Maximum island annual rainfall (mm)",
              visible: false,
              format: {
                places: 0,
                digitSeparator: true
              }
            },
            {
              fieldName: "Rain_Vol_Other_m3",
              label: "Total annual rainfall volume from all other regions (m\u00B3)",
              visible: false,
              format: {
                places: 0,
                digitSeparator: true
              }
            },
          ],
          content: [
            { // Region Information Table
              "type": "fields",
              "title": "Region Information",
              "fieldInfos": [
                {
                  "fieldName": "ContourMin",
                  "label": "Minimum regional annual rainfall (mm)",
                },
                {
                  "fieldName": "Contour_mid",
                  "label": "Midrange regional rainfall (mm)",
                },
                {
                  "fieldName": "ContourMax",
                  "label": "Maximum regional annual rainfall (mm)",
                },
                {
                  "fieldName": "Rain_Volume_m3",
                  "label": "Total annual regional rainfall volume (m\u00B3)",
                  format: {
                    digitSeparator: true
                  }
                },
                {
                  "fieldName": "Area_m2",
                  "label": "Region area (m\u00B2)",
                  format: {
                    digitSeparator: true
                  }
                },
              ]
            }, //End of Region Information Table
            { // Island Information Table
              "type": "fields",
              "title": "Island Information",
              "fieldInfos": [
                {
                  "fieldName": "Island_Min_Rain",
                  "label": "Minimum island annual rainfall (mm)",
                },
                {
                  "fieldName": "Island_Av_Rain",
                  "label": "Mean island annual rainfall (mm)",
                },
                {
                  "fieldName": "Island_Max_Rain",
                  "label": "Maximum island annual rainfall (mm)",
                },
                {
                  "fieldName": "Rain_Vol_Total_m3",
                  "label": "Total annual island rainfall volume (m\u00B3)",
                  format: {
                    digitSeparator: true
                  }
                },
                {
                  "fieldName": "Area_Total_m2",
                  "label": "Island total area (m\u00B2)",
                  format: {
                    digitSeparator: true
                  }
                },
              ]
            }, // End of Island Information Table
            { // Start of Media Carousel
              type: "media",
              title: "Rainfall Statistics",
              mediaInfos: [
                {
                title: "<b>Rainfall Volume Proportion</b>",
                type: "pie-chart",
                caption: "Annual rainfall volume in this region as a proportion of the total annual rainfall volume on the island.",
                value: {
                  fields: [ "Rain_Volume_m3", "Rain_Vol_Other_m3" ],
                  normalizeField: null,
                  tooltipField: [ "Rain_Volume_m3", "Rain_Vol_Other_m3" ]
                }
                }, // End of Pie Chart
                { // Start of Bar Chart
                title: "<b>Rainfall Intensity Comparison</b>",
                type: "column-chart",
                caption: "Comparison of midrange predicted rainfall intensity for this region, compared to the mean, minimum and maximum measured rainfall intensity for the whole island.",
                value: {
                  fields: [ "Contour_mid", "Island_Av_Rain", "Island_Min_Rain", "Island_Max_Rain" ],
                  normalizeField: null,
                  tooltipField: [ "Contour_mid", "Island_Av_Rain", "Island_Min_Rain", "Island_Max_Rain" ]
                }
                } // End of Bar Chart
              ]
            }, // End of Media Carousel
            { // Start of Text Summary
              type: "text",
              text: "The rainfall in this region accounts for <b>{Percentage_Rain}%</b> of the total annual rainfall volume across the island."
            }, // End of Text Summary
          ] // End of Content
        } // End of Kriging Popup

        // Add IoW Rainfall Kriging layer
        const rainKriging = new FeatureLayer({
          url: "https://50cr007.sims.cranfield.ac.uk:6443/arcgis/rest/services/IoW_Maps/IoW_Rain/FeatureServer/3",
          outFields: ["*"],
          popupTemplate: popupKriging,
          opacity: 0.8,
          visible: true,
          title: "Rainfall Predicted (Kriging)"
        });

        // Add IoW Outline Layer
        const islandOutline = new FeatureLayer({
          url: "https://50cr007.sims.cranfield.ac.uk:6443/arcgis/rest/services/IoW_Maps/IoW_Rain/FeatureServer/7",
          outFields: ["*"],
          opacity: 1,
          visible: true,
          title: "Island Outline",
          renderer: {
            type: "simple",
            symbol: {
              color: "black",
              type: "simple-line",
              style: "solid",
              width: "3px"
            }
          }
        });

        // Add LIDAR Elevation (as WMS sublayer)
        const liderElevation = new WMSLayer({
          url: "https://50cr007.sims.cranfield.ac.uk:6443/arcgis/services/IoW_Maps/IoW_Rain/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=1",
          opacity: 1,
          visible: false,
          listMode: "hide-children",
          title: "LIDAR Elevation",
          sublayers: [
              {
                name: "1"
              }
            ]
        });

        // Add the data to the map.
        map.add(liderElevation, 0);
        map.add(rainKriging, 1);
        map.add(rainGrids, 2);
        map.add(islandOutline, 3);

        // Add a legend and layer list tool to the map.
        view.when(() => {

          const layerList = new LayerList({
            view: view
          });
          legend = new Legend({
              view: view,
          });

          view.ui.add(layerList, "top-right");
          view.ui.add(legend, "bottom-left");
        });

      });