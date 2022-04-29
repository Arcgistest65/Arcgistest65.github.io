(function() {
let template = document.createElement("template");

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



class Map extends HTMLElement {
  constructor() {
    super();

    // this._shadowRoot = this.attachShadow({mode: "open"});
    this.appendChild(template.content.cloneNode(true));
    this._props = {};
    let that = this;

            require([
            "esri/Map",
            "esri/views/MapView",
            "esri/layers/FeatureLayer",
            "esri/popup/content/CustomContent",
           "esri/WebScene",
          "esri/views/SceneView",
          "esri/widgets/Editor"
        ], (FeatureLayer,CustomContent,WebScene,SceneView,Editor
      ) => {
      var oXHR = new XMLHttpRequest();

      // Initiate request.
      oXHR.onreadystatechange = reportStatus;
      oXHR.open(
          "GET",
          "https://arcgistest65.github.io/Arcgistest65/DeviceLocation.json",
          true);  // get json file.
      oXHR.send();

      function reportStatus() {
        if (oXHR.readyState == 4) {  // Check if request is complete.


          coordinates = this.responseText;
        }
      }

      const data = coordinates;

      /*const map = new Map({
          basemap: "streets-navigation-vector"
      });*/

      const webscene = new WebScene({
        portalItem: {
          id: "c01fd40941a741afb160e65bd234cf03"

        }
      });



      const layer = new FeatureLayer({
        source: data.map(
            (d, i) => ({
              geometry:
                  {type: "point", longitude: d.LATITUDE, latitude: d.LONGITUDE},
              attributes: {ObjectID: i, ...d}
            })),
        fields: [
          {name: "ObjectID", alias: "ObjectID", type: "oid"},
          {
            name: "JOURNEY_LOCATION_ID",
            alias: "JOURNEY_LOCATION_ID",
            type: "integer"
          },
          {name: "LOCATION_GROUP", alias: "LOCATION_GROUP", type: "string"},
          {name: "LATITUDE", alias: "Latitude", type: "double"},
          {name: "LONGITUDE", alias: "Longitude", type: "double"},
        ],
        objectIDField: ["ObjectID"],
        geometryType: "point",
        renderer: {
          type: "simple",
          symbol: {
            type: "text",
            color: "Black",
            text: "\ue61d",
            font: {size: 30, family: "CalciteWebCoreIcons"}
          }
        },
        popupTemplate: {
          title: "{name}",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {fieldName: "LOCATION_GROUP", label: "LOCATION_GROUP"},
                {fieldName: "lat", label: "Latitude", format: {places: 2}},
                {fieldName: "lon", label: "Longitude", format: {places: 2}}
              ]
            },
            new CustomContent({
              outFields: ["*"],
              creator: (event) => {
                const a = document.createElement("a");
                a.href = event.graphic.attributes.url;
                a.target = "_blank";
                a.innerText = event.graphic.attributes.url;
                return a;
              }
            })
          ],
          outFields: ["*"]
        }
      });


      webscence.add(layer);

      const view = new SceneView(
          {container: "viewDiv", qualityProfile: "high", map: webscene});

      view.when(() => {
        view.popup.autoOpenEnabled = false;  // disable popups
        // Create the Editor
        const editor = new Editor({view: view});
        // Add widget to top-right of the view
        view.ui.add(editor, "top-right");
      });
     });
  



  }  // end of constructor()


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
