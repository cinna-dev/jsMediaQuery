export default class jsMediaQuery{

  constructor(breakPoints) {

      this.window = window;

      this.defaultBreakPoints = [
      {id:'xs', type:'screen', feature:'max-width', units: 576, active: null},
      {id:'sm', type:'screen', feature:'min-width', units: 576, active: null},
      {id:'md', type:'screen', feature:'min-width', units: 768, active: null},
      {id:'lg', type:'screen', feature:'min-width', units: 992, active: null},
      {id:'xl', type:'screen', feature:'min-width', units: 1200, active: null},
      {id:'xxl', type:'screen', feature:'min-width', units: 1400, active: null},
      ]

      // this.breakPoints = breakPoints ? this._addPrototypes(breakPoints) :this._addPrototypes(this.defaultBreakPoints);

      this.breakPoints = breakPoints ?? this.defaultBreakPoints;

      this.breakPointCallbacks = [];

      this.activeBreakPoint = null;

      this._initialize();

  }

  _addProperty(prop){
      this[prop.id] = prop
  }

  _getBreakPoints() {
      return this.breakPoints;
  }

  _setBreakPoints(newBreakPoints) {
      this.breakPoints = newBreakPoints;
  }

  _getBreakPointCallbacks() {
      return this.breakPointCallbacks;
  }

  _setBreakPointCallbacks(newBreakPointCallbacks) {
      this.breakPointCallbacks = newBreakPointCallbacks;
  }

  getActiveBreakPoint() {
      return this.activeBreakPoint;
  }

  _setActiveBreakPoint(newActiveBreakPoint) {
      this.activeBreakPoint = newActiveBreakPoint;
  }

  _initialize() {
      this._addLoadListener();
  }

  _addResizeListener() {
      window.addEventListener('resize' , this._resizeListener , false);
  }

  _addLoadListener() {
      window.addEventListener('load' , this._loadListener , false);
  }

  _addUnloadListener() {
      window.addEventListener('unload' , this._unloadListener , false);
  }

  _loadListener = () => {
      this._addResizeListener()
      this._reEvaluatingBreakPoints();
      this._executeBreakPointCallbacks(this.getActiveBreakPoint());
  }

  _unloadListener = () => {
      window.removeEventListener('resize' ,this._resizeListener)
  }


  _resizeListener = () => {
      this._reEvaluatingBreakPoints()
      this._executeBreakPointCallbacks(this.getActiveBreakPoint());
  }

  // _createBreakPoints(breakPoints)  {
  //     let newBreakPoints = {}
  //     for (const [key, val] of Object.entries(breakPoints)) {
  //         const newBreakPointEntry = new BreakPointEntry(key,val.width ,val.active)
  //         newBreakPoints = {...newBreakPoints , ...newBreakPointEntry }
  //         console.log(newBreakPointEntry)
  //         console.log(newBreakPoints)
  //     }
  //     return newBreakPoints
  // }
  // _addPrototypes(breakPoints){
  //     console.log(breakPoints)
  //                  for (const [key, val] of Object.entries(breakPoints)) {
  //             this._addPrototype(val);
  //          }
  // }
  //
  // _addPrototype(breakPoint) {
  //     console.log(typeof breakPoint)
  //     breakPoint.prototype.isActive = function (){
  //         return this.active;
  //     }
  // }

  evaluateBreakPoints(breakPoints){
      const newBreakPoints = {};
      let triggered = false
      for (const [key, val] of Object.entries(this.breakPoints)) {
          const isSmaller = () => window.innerWidth < val.width;
          const isBigger = () => window.innerWidth > val.width;
          if(!triggered){
              if(key !== 'xs'){
                  if(isBigger()){
                      // triggered = true
                      val.active = true;
                  }
              }else{
                  if(isSmaller()){
                      // triggered = true
                      val.active = true;
                  }else{
                      val.active = false
                  }
              }
              this._setActiveBreakPoint(key);
          }
          newBreakPoints[key] = val;
      }

      return newBreakPoints;
  }

  _reEvaluatingBreakPoints() {
      const newBreakPoints = this.evaluateBreakPoints(this.breakPoints);
      const activeBreakPoint = this.getActiveBreakPoint();
      this._setActiveBreakPoint(activeBreakPoint);
      this._setBreakPoints(newBreakPoints);
  }


  _executeBreakPointCallbacks(breakPoint) {

      const instance = this;
      this.breakPointCallbacks.forEach((bpCallbacks) =>{
          const [array] = Object.entries(bpCallbacks);
          const [bp, callback] = array;
          if(bp === breakPoint){
              callback(instance);
          }
      })
  }

  query(breakPoint){
      this._checkBreakPointQuery(breakPoint);
      return this.breakPoints[breakPoint];
  }


  _checkBreakPointQuery(breakPoint) {
      if(typeof breakPoint !== 'string'){
          throw new Error('breakpoint is not valid');
      }
      switch (breakPoint){
          case 'xs' : return
          case 'sm' : return
          case 'md' : return
          case 'lg' : return
          case 'xl' : return
          case 'xxl' : return
          default: throw new Error('breakpoint is not valid');
      }
  }

  getActiveBreakPoint() {
      for (const [key, bpObj] of Object.entries(this.breakPoints))
          if(bpObj.active) return  key + '';
  }

  addBreakPointCallback (breakPoint, callback) {
      this._checkBreakPointQuery(breakPoint);
      this._setBreakPointCallbacks([...this.breakPointCallbacks,{[breakPoint]:callback}]);
      return this;
  }
}

class BreakPointEntry {

  constructor(feature, units, callback) {

    this.feature = feature;

    this.units = units;

    this.callback = callback;

    this.active = null;

    this.passiveSupported = this._supportsPassive();

    this.typeList = {
      screen: window
    }

    this.featureList = {
      maxWidth : () =>{

      }
    }

  }


  isActive() {
      return this.active;
  }

  _setActive(state) {
    this.active = state; 
  }

  _initialize() {
    this._addDomContentLoadedListener(this.callback);
    this._addResizeListener(this.callback);
  }

  _addDomContentLoadedListener(callback){
    document.addEventListener('DOMContentLoaded' ,callback , this._addPassiveOption())
  }

  _removeDomContentLoadedListener(callback){
    document.removeEventListener('DOMContentLoaded' ,callback , this._addPassiveOption())
  }

  _addResizeListener(callback){
    window.addEventListener('resize', callback , this._addPassiveOption()) 
  }

  _removeResizeListener(callback){
    window.removeEventListener('resize', callback , this._addPassiveOption()) 
  }

  // utility
  _addPassiveOption(){
    return this.passiveSupported ? {passive: true} : false ;
  }

  _supportsPassive(){
    let passiveSupported = false;
    try {
      const options = {
        get passive() { // This function will be called when the browser
                        //   attempts to access the passive property.
          passiveSupported = true;
          return false;
        }
      };

      window.addEventListener("test", null, options);
      window.removeEventListener("test", null, options);
    } catch(err) {
      passiveSupported = false;
    }
    return passiveSupported;
  }
}

const jsMediaQuery =  new JsMediaQuery;

console.log(jsMediaQuery)
