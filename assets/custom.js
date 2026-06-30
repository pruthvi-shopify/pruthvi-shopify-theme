
 ( () => {
    if (typeof window.Shopify == "undefined") {
        window.Shopify = {}
    }
    Shopify.bind = function(fn, scope) {
        return function() {
            return fn.apply(scope, arguments)
        }
    }
    ;
    Shopify.setSelectorByValue = function(selector, value) {
        for (var i = 0, count = selector.options.length; i < count; i++) {
            var option = selector.options[i];
            if (value == option.value || value == option.innerHTML) {
                selector.selectedIndex = i;
                return i
            }
        }
    }
    ;
    Shopify.addListener = function(target, eventName, callback) {
        target.addEventListener ? target.addEventListener(eventName, callback, false) : target.attachEvent("on" + eventName, callback)
    }
    ;
    Shopify.postLink = function(path, options) {
        options = options || {};
        var method = options["method"] || "post";
        var params = options["parameters"] || {};
        var form = document.createElement("form");
        form.setAttribute("method", method);
        form.setAttribute("action", path);
        for (var key in params) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);
            form.appendChild(hiddenField)
        }
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form)
    }
    ;
 // Fully Override Shopify.CountryProvinceSelector
Shopify.CountryProvinceSelector = function(country_domid, province_domid, options) {
    this.countryEl = document.getElementById(country_domid);
    console.log("Country DOM :" , this.countryEl);
    
    this.provinceEl = document.getElementById(province_domid);
    console.log("Province DOM:" , this.provinceEl);
    this.provinceContainer = document.getElementById(options["hideElement"] || province_domid);
    console.log(this.provinceContainer);

    Shopify.addListener(this.countryEl, "change", Shopify.bind(this.countryHandler, this));

    console.log("Initializing country.....")
    this.initCountry();
    console.log("Initializing province.....")  
    this.initProvince();
};

// Override PROTOTYPE
document.addEventListener("DOMContentLoaded", function() {


Shopify.CountryProvinceSelector.prototype = {
    initCountry: function() {
        var value = this.countryEl.getAttribute("data-default");
        console.log("Default country:" , value);
        Shopify.setSelectorByValue(this.countryEl, value);
        this.countryHandler();
    },

    initProvince: function() {
        var value = this.provinceEl.getAttribute("data-default");
        if (value && this.provinceEl.options.length > 0) {
            Shopify.setSelectorByValue(this.provinceEl, value);
        }
    },

    countryHandler: function(e) {
        var opt = this.countryEl.options[this.countryEl.selectedIndex];
        var raw = opt.getAttribute("data-provinces");
        var provinces = JSON.parse(raw);

        this.clearOptions(this.provinceEl);
        
        if (this.countryEl.value === "United States") {
            this.provinceContainer.style.display = "none";
            return;
        }
        

        if (!provinces || provinces.length === 0) {
            this.provinceContainer.style.display = "none";
        } else {
            for (var i = 0; i < provinces.length; i++) {
                var opt = document.createElement("option");
                opt.value = provinces[i][0];
                opt.innerHTML = provinces[i][1];
                this.provinceEl.appendChild(opt);
            }
            this.provinceContainer.style.display = "";
        }
    },

    clearOptions: function(selector) {
        while (selector.firstChild) {
            selector.removeChild(selector.firstChild);
        }
    },

    setOptions: function(selector, values) {
        for (var i = 0; i < values.length; i++) {
            var opt = document.createElement("option");
            opt.value = values[i];
            opt.innerHTML = values[i];
            selector.appendChild(opt);
        }
    }
};

});
}
)();





