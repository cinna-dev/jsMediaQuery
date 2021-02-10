const defaultBreakPoints = [
    { id: 'xs', type: 'screen', feature: 'max-width', units: 576, callback: () => {
            document.querySelector('body').style.background = 'yellow';
            console.log('xs');
        } },
    { id: 'sm', type: 'screen', feature: 'min-width', units: 576, callback: () => {
            document.querySelector('body').style.background = 'green';
            console.log('sm');
        } },
    { id: 'md', type: 'screen', feature: 'min-width', units: 768, callback: () => {
            document.querySelector('body').style.background = 'red';
            console.log('md');
        } },
    { id: 'lg', type: 'screen', feature: 'min-width', units: 992, callback: () => {
            document.querySelector('body').style.background = 'orange';
            console.log('lg');
        } },
    { id: 'xl', type: 'screen', feature: 'min-width', units: 1200, callback: () => {
            document.querySelector('body').style.background = 'blue';
            console.log('xl');
        } },
    { id: 'xxl', type: 'screen', feature: 'min-width', units: 1400, callback: () => {
            document.querySelector('body').style.background = 'violet';
            console.log('xxl');
        } },
];
// Media Features
const ANY_HOVER = "any-hover"; // Does any available input mechanism allow the user to hover over elements?
const ANY_POINTER = "any-pointer"; // Is any available input mechanism a pointing device, and if so, how accurate is it?
const COLOR = "color"; // The number of bits per color component for the output device
const COLOR_GAMUT = "color-gamut"; // The approximate range of colors that are supported by the user agent and output device
const COLOR_INDEX = "color-index"; // The 
const GRID = "grid"; // Whether the device is a grid or bitmap
const HEIGHT = "height"; // The viewport height
const HOVER = "hover"; // Does the primary input mechanism allow the user to hover over elements? 
const INVERTED_COLORS = "inverted-colors"; // Is the browser or underlying OS inverting colors?
const LIGHT_LEVEL = "light-level"; // Current ambient light level 
const MAX_ASPECT_RATIO = "max-aspect-ratio"; // The maximum ratio between the width and the height of the display area
const MAX_COLOR = "max-color"; // The maximum number of bits per color component for the output device
const MAX_COLOR_INDEX = "max-color-index"; // The maximum number of colors the device can display
const MAX_HEIGHT = "max-height"; // 	The maximum height of the display area, such as a browser window
const MAX_MONOCHROME = "max-monochrome"; // The maximum number of bits per "color" on a monochrome (greyscale) device
const MAX_RESOLUTION = "max-resolution"; // The maximum resolution of the device, using dpi or dpcm
const MAX_WIDTH = "max-width"; // The maximum width of the display area, such as a browser window
const MIN_ASPECT_RATIO = "min-aspect-ratio"; // The minimum ratio between the width and the height of the display area
const MIN_COLOR = "min-color"; // The minimum number of bits per color component for the output device
const MIN_COLOR_INDEX = "min-color-index"; // The minimum number of colors the device can display
const MIN_HEIGHT = "min-height"; // The minimum height of the display area, such as a browser window
const MIN_MONOCHROME = "min-monochrome"; // The minimum number of bits per "color" on a monochrome (greyscale) device
const MIN_RESOLUTION = "min-resolution"; // The minimum resolution of the device, using dpi or dpcm
const MIN_WIDTH = "min-width"; // The minimum width of the display area, such as a browser window
const MONOCHROME = "monochrome"; // The number of bits per "color" on a monochrome (greyscale) device
const ORIENTATION = "orientation"; // The orientation of the viewport (landscape or portrait mode)
const OVERFLOW_BLOCK = "overflow-block"; // How does the output device handle content that overflows the viewport along the block axis
const OVERFLOW_INLINE = "overflow-inline"; // Can content that overflows the viewport along the inline axis be scrolled 
const POINTER = "pointer"; // Is the primary input mechanism a pointing device, and if so, how accurate is it? 
const RESOLUTION = "resolution"; // The resolution of the output device, using dpi or dpcm
const SCAN = "scan"; // The scanning process of the output device
const UPDATE = "update"; // How quickly can the output device modify the appearance of the content
const WIDTH = "width"; // 	The viewport width
/**
 * @class JsMediaQuery
 */
class JsMediaQuery {
    constructor(_mediaQueries) {
        this._mediaQueries = _mediaQueries;
        /**
         * @param {MediaQuery} mediaQueries
         * @example {id:'sm', type:'screen', feature:'min-width', units: 576, callback: null},
         */
        this._mainBreakPoint = null;
        this._breakPoints = this._buildBreakPoints(_mediaQueries ?? defaultBreakPoints);
        this._initialize();
    }
    _buildBreakPoints(mediaQueries) {
        const mediaQueries2 = this._insuresArray(mediaQueries);
        let featuresArray = this._createFeatureArray(mediaQueries2);
        return featuresArray;
    }
    _createFeatureArray(mediaQueries) {
        let featureList = mediaQueries.map(mediaQuery => mediaQuery.feature);
        return Array.from(new Set(featureList)).map((item) => {
            const query = new Query(item);
            query.assignQueries(mediaQueries);
            return query;
        });
    }
    _insuresArray(value) {
        if (Array.isArray(value)) {
            return value;
        }
        else {
            return [value];
        }
    }
    _mirrorMediaProp(prop) {
        this[prop.id] = { active: prop.isActive() };
    }
    get breakPoints() {
        return this._breakPoints;
    }
    get mainBreakPoint() {
        return this._mainBreakPoint;
    }
    set mainBreakPoint(newMainBreakPoint) {
        this._mainBreakPoint = newMainBreakPoint;
    }
    set breakPoints(newBreakPoints) {
        this._breakPoints = newBreakPoints;
    }
    _deleteMediaQueries() {
        delete this._mediaQueries;
    }
    _initialize() {
        this._deleteMediaQueries();
        this._addLoadListener();
        this._addUnloadListener();
    }
    _addResizeListener() {
        window.addEventListener('resize', () => this._breakPointsLoop(), this._addPassiveSupport());
    }
    _removeResizeListener() {
        window.removeEventListener('resize', () => this._breakPointsLoop(), this._addPassiveSupport());
    }
    _addLoadListener() {
        window.addEventListener('DOMContentLoaded', () => this._loadListener(), this._addPassiveSupport());
    }
    _removeLoadListener() {
        window.removeEventListener('DOMContentLoaded', () => this._loadListener(), this._addPassiveSupport());
    }
    _addUnloadListener() {
        window.addEventListener('unload', () => this._unloadListener(), this._addPassiveSupport());
    }
    _loadListener() {
        this._addResizeListener();
        this._breakPointsLoop();
    }
    ;
    _unloadListener() {
        this._removeLoadListener();
        this._removeResizeListener();
    }
    _breakPointsLoop() {
        // reset execute tag when new breakPoint is found
        // set active breakPoint
        // -->> OBJECT DESTRUCTURING IN TYPESCRIPT <<-- 
        this.breakPoints.forEach(({ breakPoints }) => {
            breakPoints.forEach((breakPoint) => {
                breakPoint.checkMedia();
                this._mirrorMediaProp(breakPoint);
            });
        });
        // sort active breakPoints 
        this.breakPoints.forEach(({ breakPoints }) => {
            const sortedActiveBreakPoints = breakPoints.filter((breakPoint) => breakPoint.isActive());
            // last breakPoint becomes mainBreakPoint 
            if (sortedActiveBreakPoints.length) {
                const mainBreakPoint = sortedActiveBreakPoints[sortedActiveBreakPoints.length - 1];
                // make sure mainBreakPoint is already set // else assign mainBreakPoint and execute it
                if (!this.mainBreakPoint) {
                    this.mainBreakPoint = mainBreakPoint;
                    this.mainBreakPoint.executeCallback();
                    // compare active breakPoint to last mainBreakPoint // if different replace and execute callback
                }
                else if (mainBreakPoint.getId() !== this.mainBreakPoint.getId()) {
                    this.mainBreakPoint = mainBreakPoint;
                    this.mainBreakPoint.executeCallback();
                }
            }
        });
    }
    // utility
    _addPassiveSupport() {
        return this._supportsPassive() ? { passive: true } : false;
    }
    _supportsPassive() {
        let passiveSupported = false;
        try {
            const options = {
                get passive() {
                    //   attempts to access the passive property.
                    passiveSupported = true;
                    return false;
                }
            };
            window.addEventListener("test", null, options);
            window.removeEventListener("test", null, options);
        }
        catch (err) {
            passiveSupported = false;
        }
        return passiveSupported;
    }
}
class BreakPoint {
    constructor(_id, _type, _feature, _units, _callback) {
        this._id = _id;
        this._type = _type;
        this._feature = _feature;
        this._units = _units;
        this._callback = _callback;
        this._active = false;
    }
    get id() {
        return this._id;
    }
    get callback() {
        return this._callback;
    }
    get type() {
        return this._type;
    }
    get units() {
        return this._units;
    }
    get feature() {
        return this._feature;
    }
    get active() {
        return this._active;
    }
    set active(state) {
        this._active = state;
    }
    isActive() {
        return this._active;
    }
    getUnits() {
        return this.units;
    }
    getId() {
        return this.id;
    }
    activate() {
        this._active = true;
        this.executeCallback();
    }
    _hasCallback() {
        return (!!this._callback);
    }
    executeCallback() {
        if (this._hasCallback())
            this.callback();
    }
    checkMedia() {
        if (this._checkMediaRule()) {
            if (!this.isActive()) {
                this.active = true;
            }
        }
        else {
            this.active = false;
        }
        return this;
    }
    _checkMediaRule() {
        switch (this.feature) {
            case MIN_WIDTH: return window.innerWidth >= this.units;
            case MAX_WIDTH: return window.innerWidth < this.units;
            case MIN_HEIGHT: return window.innerHeight >= this.units;
            case MAX_HEIGHT: return window.innerHeight < this.units;
            default: return false;
        }
    }
}
class Query {
    constructor(_feature) {
        this._feature = _feature;
    }
    get feature() {
        return this._feature;
    }
    assignQueries(mediaQueries) {
        const breakPoints = [];
        mediaQueries.forEach(({ id, type, feature, units, callback }) => {
            if (feature === this.feature)
                breakPoints.push(new BreakPoint(id, type, feature, units, callback));
        });
        this.breakPoints = breakPoints;
        this._deleteQueries();
    }
    _deleteQueries() {
        delete this.queries;
    }
}
const jsMediaQuery = new JsMediaQuery(null);
console.log(jsMediaQuery);
