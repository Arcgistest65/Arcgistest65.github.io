(function () {
    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
      <style>
          fieldset {
              margin-bottom: 10px;
              padding: 4px;
              border: 1px solid #afafaf;
              border-radius: 3px;
          }
          table {
              width: 100%;
              padding : 20px;
          }
          input, textarea, select {
              font-family: "72",Arial,Helvetica,sans-serif;
              width: 100%;
              padding: 5px;
              box-sizing: border-box;
              border: 1px solid #bfbfbf;
          }
          input[type=checkbox] {
              width: inherit;
              margin: 6px 3px 6px 5px;
              vertical-align: middle;
          }
          
      </style>
      <form id="form" autocomplete="off">
        <fieldset> 
          <legend>Modification Panel</legend>
          <table>
            <tr>
              <td><label for="portalId">Webscene ID:</label></td>
              <td><input id="portalId" name="portalId" type="text"></td>
            </tr>
            <tr>
              <td><label for="BColor">Beacon Color:</label></td>
              <td><input id="BColor" name="BColor" type="text"></td>
            </tr> 
            <tr>
              <td><label for="BOColor">Beacon Outline Color:</label></td>
              <td><input id="BOColor" name="BOColor" type="text"></td>
            </tr>
            <tr>
              <td><label for="StartSize">Beacon Start Size:</label></td>
              <td><input id="StartSize" name="StartSize" type="text"></td>
            </tr>
            <tr>
              <td><label for="StopSize">Beacon Stop Size:</label></td>
              <td><input id="StopSize" name="StopSize" type="text"></td>
            </tr>
            <tr>
              <td><label for="legendOption">legend Option</label></td>
              <td><input id="legendOption" name="legendOption" type="text"></td>
            </tr>
            <tr>
              <td><label for="layerOption">Layer Option:</label></td>
              <td><input id="layerOption" name="layerOption" type="text"></td>
            </tr>
            <tr>
              <td><label for="layerOption">Layer Option:</label></td>
              <td><input id="layerOption" name="layerOption" type="text"></td>
            </tr>
          </table>
        </fieldset>
        <button type="submit" hidden>Submit</button>
      </form>
    `;

    class restAPIAps extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

            let form = this._shadowRoot.getElementById("form");
            form.addEventListener("submit", this._submit.bind(this));
            form.addEventListener("change", this._change.bind(this));
        }

        connectedCallback() {
        }

        _submit(e) {
            e.preventDefault();
            let properties = {};
            for (let name of restAPIAps.observedAttributes) {
                properties[name] = this[name];
            }
            console.log(properties);
            this._firePropertiesChanged(properties);
            return false;
        }
        _change(e) {
            this._changeProperty(e.target.name);
        }
        _changeProperty(name) {
            let properties = {};
            properties[name] = this[name];
            this._firePropertiesChanged(properties);
        }

        _firePropertiesChanged(properties) {
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: properties
                }
            }));
        }

        get portalId() {
            return this.getValue("portalId");
        }
        set portalId(value) {
            this.setValue("portalId", value);    
        }
        get BColor() {
            return this.getValue("BColor");
        }
        set BColor(value) {
            this.setValue("BColor", value);    
        }
        get BOColor() {
            return this.getValue("BOColor");
        }
        set BOColor(value) {
            this.setValue("BOColor", value);    
        }
        get StartSize() {
            return this.getValue("StartSize");
        }
        set StartSize(value) {
            this.setValue("StartSize", value);    
        }get StopSize() {
            return this.getValue("StopSize");
        }
        set StopSize(value) {
            this.setValue("StopSize", value);    
        }
        get layerOption() {
            return this.getValue("layerOption");
        }
        set layerOption(value) {
            this.setValue("layerOption", value);    
        }
        get legendOption() {
            return this.getValue("legendOption");
        }
        set legendOption(value) {
            this.setValue("legendOption", value);    
        }
        get layerOption() {
            return this.getValue("layerOption");
        }
      
        }
        
        
        getValue(id) {
            return this._shadowRoot.getElementById(id).value;
        }
        setValue(id, value) {
          console.log(id +":" + value);
            this._shadowRoot.getElementById(id).value = value;
        }

        static get observedAttributes() {
            return [
              "portalId",
                "BColor",
                "BOColor",
                "StartSize",
                "StopSize",
                "legendOption",
                "layerOption"
            ];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue != newValue) {
                this[name] = newValue;
            }
        }
    }
    customElements.define("com-sap-custom-geomap-builder", restAPIAps);
})();
