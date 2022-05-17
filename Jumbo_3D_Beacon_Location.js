(function() {
let template = document.createElement("template");
        var locationData;//holds up each beacons data

template.innerHTML = `
        <link rel="stylesheet" href="https://js.arcgis.com/4.23/esri/themes/light/main.css" />
    <script src="https://js.arcgis.com/4.23/"></script>
    <style>
    html,
    body,
    #viewDiv {
      padding: 0;
      margin: 0;
      height: 100%;
      width: 100%;
    }
  </style>
     <body>
  <div id="viewDiv"></div>
</body>
</html>
    `;
        
function processbeacons() {


  let myTemp = JSON.stringify(locationData);

  const geoJSONPointArr = locationData.map(row => {
    return {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": Geometry_coordinates
      },
      "properties": {
        "name":Properties_name_1 ,
        "Add details" : Properties_Add_details
      }
    }
  });

  console.log(geoJSONPointArr);

  // to GeoJSON.FeatureCollection
  const pointArrFeatureCollection = {
    "type": "FeatureCollection",
    "features": geoJSONPointArr
  }

  console.log(pointArrFeatureCollection);
        
  // create a new blob from geojson featurecollection
const blob = new Blob([JSON.stringify(pointArrFeatureCollection)], {
  type: "application/json"
});

// URL reference to the blob
const url = URL.createObjectURL(blob);
        
 const geojsonlayer = new GeoJSONLayer({
                        url,
                        copyright: 'Beacons',
                        popupTemplate: template,
                        renderer: renderer
                    });
                    
                     webscene.add(geojsonlayer);
                const legend = new Legend({view: viewLayer});
                viewLayer.ui.add(legend, 'top-right');


  /*
                    

                    var geojson = {};

                    for (var i = 0; i < table.rows.length; i++) {
                        geojson += {
                            type: 'FeatureCollection',
                            features: [{
                                type: 'Feature',
                                id: table.rows[i].cells[3],
                                geometry: {
                                    type: table.rows[i].cells[1],
                                    coordinates: table.rows[i].cells[2]
                                },
                                properties: {
                                    beaconId: table.rows[i].cells[3],
                                    aisle_name: table.rows[i].cells[4],
                                }
                            }]
                        };
                    }
                    // create a new blob from geojson featurecollection
                    const blob = new Blob(
                        [JSON.stringify(geojson)], {type: 'application/json'});
                    // URL reference to the blob
                    const url = URL.createObjectURL(blob);
                    // create new geojson layer using the blob url



                    const geojsonlayer = new GeoJSONLayer({
                        url,
                        // url:
                        // "https://arcgistest65.github.io/testData.geojson",
                        copyright: 'Beacons',
                        popupTemplate: template,
                        renderer: renderer
                    });
                    
                     webscene.add(geojsonlayer);
                const legend = new Legend({view: viewLayer});
                viewLayer.ui.add(legend, 'top-right');
                    */


} // end of function bracket



class Map extends HTMLElement {
    constructor() {
        super();
        // this._shadowRoot = this.attachShadow({mode: "open"});
        this.appendChild(template.content.cloneNode(true));
        this._props = {};
        let that = this;
            
            
        require(
            [
                'esri/Map', 'esri/views/SceneView', 'esri/WebScene',
                'esri/Basemap', 'esri/layers/FeatureLayer',
                'esri/widgets/LayerList', 'esri/request', 'dojo/domReady!',
                'esri/layers/GraphicsLayer', 'esri/Graphic',
                'esri/widgets/Legend', 'esri/layers/GeoJSONLayer'
            ],
            (Map, SceneView, WebScene, Basemap, TileLayer, FeatureLayer,
             LayerList, request, GraphicsLayer, Graphic, Legend,
             GeoJSONLayer) => {
                const webscene = new WebScene(
                    {portalItem: {id: 'c01fd40941a741afb160e65bd234cf03'}});
                const viewLayer =
                    new SceneView({container: 'viewDiv', map: webscene});
                const graphicsLayer = new GraphicsLayer();
                const template = {
                    title: 'Beacon Detail',
                    content:
                        'Beacon ID:{beaconId} \n Aisle assigned to:{aisle_name}'
                };
                const renderer = {
                    type: 'simple',
                    field: 'name',
                    symbol: {
                        type: 'simple-marker',
                        color: 'orange',
                        outline: {color: 'white'}
                    },
                    visualVariables: [{
                        type: 'size',
                        field: 'name',
                        stops:
                            [{value: 4, size: '8px'}, {value: 8, size: '40px'}]
                    }]
                };
                
                    
                    


                
               
            });
    }  // end of constructor()
    getSelection() {
        return this._currentSelection;
    }
    onCustomWidgetBeforeUpdate(oChangedProperties) {
        this.$servicelevel = oChangedProperties["servicelevel"];
        locationData = this.$servicelevel;
       if (locationData)  {
           processbeacons();
       }   
       
        
    }
    onCustomWidgetAfterUpdate(changedProperties) {
        if ('servicelevel' in changedProperties) {
            this.$servicelevel = changedProperties['servicelevel'];
        }
        locationData = this.$servicelevel;  // place passed in value into global
    }
}  // end of class
let scriptSrc = "https://js.arcgis.com/4.18/"
let onScriptLoaded =
    function() {
  customElements.define("com-sap-custom-jumbo-beacon-location", Map);
}

// SHARED FUNCTION: reuse between widgets
// function(src, callback) {
let customElementScripts =
    window.sessionStorage.getItem("customElementScripts") || [];
let scriptStatus = customElementScripts.find(function(element) {
  return element.src == scriptSrc;
});

if (scriptStatus) {
  if (scriptStatus.status == "ready") {
    onScriptLoaded();
  } else {
    scriptStatus.callbacks.push(onScriptLoaded);
  }
} else {
  let scriptObject = {
    "src": scriptSrc,
    "status": "loading",
    "callbacks": [onScriptLoaded]
  }
  customElementScripts.push(scriptObject);
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = scriptSrc;
  script.onload = function() {
    scriptObject.status = "ready";
    scriptObject.callbacks.forEach((callbackFn) => callbackFn.call());
  };
  document.head.appendChild(script);
}

// END SHARED FUNCTION
})();  // end of class
