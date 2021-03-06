(function() {
let template = document.createElement("template");
var locationData;//holds up each beacons data
var webscene;
var geojsonlayer;
var viewLayer;
var url;
var blob;
var templates;
var renderer;
var legend;
var iniValue=0;
var pointArrFeatureCollection;
	
	

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
	


//Convert string coordinate from geojson file to array of cooor
function removeString(stringCoor){
var LatLng = stringCoor.replace("[", "").replace("]", "").split(",")
var Lat = parseFloat(LatLng[0]);
var Lng = parseFloat(LatLng[1]);
var x=parseFloat(LatLng[2]);
return [Lng, Lat,x]
}

//function to convert array to geojson format
function j2gConvert(jsonObject) {
    const geoJSONPointArr = jsonObject.map((row) => {
        return {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: removeString(row.Geometry_coordinates)
            },
            properties: {
                beaconId: row.Properties_name_1,
                aisle_name: row.Properties_Add_details,
            },
	    id:parseFloat(row.Properties_name_1)
	    ,
        };
    });

    return geoJSONPointArr;
}

 //function inside class to create geojson beacons
 function processbeacons() {
    require([
        "esri/Map",
        "esri/views/SceneView",
        "esri/WebScene",
        "esri/Basemap",
        "esri/layers/FeatureLayer",
        "esri/widgets/LayerList",
        "esri/request",
        "dojo/domReady!",
        "esri/layers/GraphicsLayer",
        "esri/Graphic",
        "esri/widgets/Legend",
        "esri/layers/GeoJSONLayer",
    ], (Map, SceneView, WebScene, Basemap, TileLayer, FeatureLayer, LayerList, request, GraphicsLayer, Graphic, Legend, GeoJSONLayer) => {
	    
	pointArrFeatureCollection={};
        pointArrFeatureCollection = {
            type: "FeatureCollection",
            features: j2gConvert(locationData),
	    bbox: [
        -179.9997,
        -61.6995,
        -3.5699999332428,
        179.9142,
        82.9995,
        629.17
    ],
        };
	    
        // create a new blob from geojson featurecollection
        blob = new Blob([JSON.stringify(pointArrFeatureCollection)], {
            type: "application/json",
        });
	    

        // URL reference to the blob
        url = URL.createObjectURL(blob);
        
        if(iniValue !== 0 ){
            
      //remove previous geojsonlayer from webscene
        
	  //create a layer to hold the beacon coordinates
        geojsonlayer = new GeoJSONLayer({
            url,
            popupTemplate: templates,
            renderer: renderer
        });
 

        //add the beacons to the webscene
        webscene.add(geojsonlayer);
    
        }else{
            //create a layer to hold the beacon coordinates
        geojsonlayer = new GeoJSONLayer({
            url,
            popupTemplate: templates,
            renderer: renderer
        });
 

        //add the beacons to the webscene
        webscene.add(geojsonlayer);
            
        }//end of if
    });
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
            // template to display additional details for the beacon when selected
            templates = {
            title: "Beacon Detail",
            content: "Beacon ID:{beaconId} \n Aisle assigned to:{aisle_name}",
        };
        
        //information on how to display the beacons(point format)
        renderer = {
            type: "simple",
            field: "name",
            symbol: {
                type: "simple-marker",
                color: "orange",
                outline: {
                    color: "white",
                },
            },
            visualVariables: [
                {
                    type: "size",
                    field: "name",
                    stops: [
                        {
                            value: 4,
                            size: "16px",
                        },
                        {
                            value: 8,
                            size: "80px",
                        },
                    ],
                },
            ],
        };
    
        //create the main map of type webscene
        webscene = new WebScene({
            portalItem: {
                id: "c01fd40941a741afb160e65bd234cf03",
            },
        });
        
        
        //add the WebScene to the SceneView layer(Layer displayed)
        viewLayer = new SceneView({
            container: "viewDiv",
            map: webscene,
        });
	      
	     
	     
	     //display a key on the screen containing all shapes in map
        legend = new Legend({
            view: viewLayer,
        });
        
        //add the key to the main screen
        viewLayer.ui.add(legend, "top-right");
      

      });
  } // end of constructor()

  getSelection() {
    return this._currentSelection;
  }
  
  //function executed on initialisation
  //function executed 2 times. first returns default value of variable & initialisation variables data
  onCustomWidgetBeforeUpdate(oChangedProperties) {
    this.$servicelevel = oChangedProperties["servicelevel"];
    locationData = this.$servicelevel;
    if (locationData && iniValue==0) {
      iniValue=1;
      processbeacons();
    }
    
  }
  
  ////function executed on variable updates
  onCustomWidgetAfterUpdate(oChangedProperties) {
    if ('servicelevel' in oChangedProperties) {
      this.$servicelevel = oChangedProperties['servicelevel'];
	    locationData = this.$servicelevel; // place passed in value into global
    if (locationData && iniValue==1) {
      webscene.remove(geojsonlayer);
      processbeacons();
    }
    }
  }

  
    } // end of class
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
