interface MediaQuery  {id:string, type:string, feature: string , units: number, callback: Callback, [key: string]: any}

type Callback = ()=> void;

const defaultBreakPoints: MediaQuery[] = [
  {id:'xs', type:'screen', feature:'max-width', units: 576, callback:  ()=>{
    document.querySelector('body').style.background = 'yellow';
    console.log('xs');
  }},
  {id:'sm', type:'screen', feature:'min-width', units: 576, callback:  ()=>{
    document.querySelector('body').style.background = 'green';
    console.log('sm');
  }},
  {id:'md', type:'screen', feature:'min-width', units: 768, callback: ()=>{
    document.querySelector('body').style.background = 'red';
    console.log('md');
  }},
  {id:'lg', type:'screen', feature:'min-width', units: 992, callback:  ()=>{
    document.querySelector('body').style.background = 'orange';
    console.log('lg');
  }},
  {id:'xl', type:'screen', feature:'min-width', units: 1200, callback:  ()=>{
    document.querySelector('body').style.background = 'blue';
    console.log('xl');
  }},
  {id:'xxl', type:'screen', feature:'min-width', units: 1400, callback:  ()=>{
    document.querySelector('body').style.background = 'violet';
    console.log('xxl');
  }},
];

// Media Features
const ANY_HOVER = "any-hover";  // Does any available input mechanism allow the user to hover over elements?
const ANY_POINTER = "any-pointer";  // Is any available input mechanism a pointing device, and if so, how accurate is it?

const COLOR = "color";  // The number of bits per color component for the output device
const COLOR_GAMUT = "color-gamut";  // The approximate range of colors that are supported by the user agent and output device
const COLOR_INDEX = "color-index";  // The 
const GRID = "grid";  // Whether the device is a grid or bitmap
const HEIGHT = "height";  // The viewport height
const HOVER = "hover";  // Does the primary input mechanism allow the user to hover over elements? 
const INVERTED_COLORS = "inverted-colors";  // Is the browser or underlying OS inverting colors?
const LIGHT_LEVEL = "light-level";  // Current ambient light level 
const MAX_ASPECT_RATIO = "max-aspect-ratio";  // The maximum ratio between the width and the height of the display area
const MAX_COLOR = "max-color";  // The maximum number of bits per color component for the output device
const MAX_COLOR_INDEX = "max-color-index";  // The maximum number of colors the device can display
const MAX_HEIGHT = "max-height";  // 	The maximum height of the display area, such as a browser window
const MAX_MONOCHROME = "max-monochrome";  // The maximum number of bits per "color" on a monochrome (greyscale) device
const MAX_RESOLUTION = "max-resolution";  // The maximum resolution of the device, using dpi or dpcm
const MAX_WIDTH = "max-width";  // The maximum width of the display area, such as a browser window
const MIN_ASPECT_RATIO = "min-aspect-ratio";  // The minimum ratio between the width and the height of the display area
const MIN_COLOR = "min-color";  // The minimum number of bits per color component for the output device
const MIN_COLOR_INDEX = "min-color-index";  // The minimum number of colors the device can display
const MIN_HEIGHT = "min-height";  // The minimum height of the display area, such as a browser window
const MIN_MONOCHROME = "min-monochrome";  // The minimum number of bits per "color" on a monochrome (greyscale) device
const MIN_RESOLUTION = "min-resolution";  // The minimum resolution of the device, using dpi or dpcm
const MIN_WIDTH = "min-width";  // The minimum width of the display area, such as a browser window
const MONOCHROME = "monochrome";  // The number of bits per "color" on a monochrome (greyscale) device
const ORIENTATION = "orientation";  // The orientation of the viewport (landscape or portrait mode)
const OVERFLOW_BLOCK = "overflow-block" ;  // How does the output device handle content that overflows the viewport along the block axis
const OVERFLOW_INLINE = "overflow-inline";  // Can content that overflows the viewport along the inline axis be scrolled 
const POINTER = "pointer";  // Is the primary input mechanism a pointing device, and if so, how accurate is it? 
const RESOLUTION = "resolution";  // The resolution of the output device, using dpi or dpcm
const SCAN = "scan";  // The scanning process of the output device
const UPDATE = "update";  // How quickly can the output device modify the appearance of the content
const WIDTH = "width";  // 	The viewport width


/**
 * @class JsMediaQuery
 */
class JsMediaQuery{

/**
 * @param {MediaQuery} mediaQueries
 * @example {id:'sm', type:'screen', feature:'min-width', units: 576, callback: null},
 */

  private _mainBreakPoint : BreakPoint = null;

  private _breakPoints : Query[] 

  constructor(private _mediaQueries: MediaQuery[] | MediaQuery) {

    this._breakPoints = this._buildBreakPoints(_mediaQueries ?? defaultBreakPoints);

    this._initialize();

  }

  public _buildBreakPoints(mediaQueries: MediaQuery[] | MediaQuery ): Query[]  {
    const mediaQueries2 = this._insuresArray(mediaQueries);
    let featuresArray = this._createFeatureArray(mediaQueries2);
    return featuresArray;
  }


  private _createFeatureArray(mediaQueries: MediaQuery[]): Query[] {
    let featureList: string[] = mediaQueries.map(mediaQuery => mediaQuery.feature);
    return Array.from(new Set(featureList)).map((item: string):Query => {
      const query = new Query(item);
      query.assignQueries(mediaQueries);
      return query;
    });
  }

  private _insuresArray(value: MediaQuery[] | MediaQuery):  MediaQuery[]  {
    if(Array.isArray(value)){
      return value ;
    }else{
      return [value];
    }
  }

  private _mirrorMediaProp(prop): void {
    this[prop.id]= {active: prop.isActive()}; 
  }

  private get breakPoints(): Query[] {
      return this._breakPoints;
  }

  private get mainBreakPoint(): BreakPoint {
      return this._mainBreakPoint;
  }

  private set mainBreakPoint(newMainBreakPoint) {
      this._mainBreakPoint = newMainBreakPoint;
  }

  private set breakPoints(newBreakPoints: Query[] ) {
      this._breakPoints = newBreakPoints;
  }

  private _deleteMediaQueries():void {
    delete this._mediaQueries;
  }

  private _initialize(): void {
    this._deleteMediaQueries();
    this._addLoadListener();
    this._addUnloadListener();
  }

  private _addResizeListener(): void {
    window.addEventListener('resize', ()=> this._breakPointsLoop() ,  this._addPassiveSupport()) 
  }

  private _removeResizeListener(): void {
    window.removeEventListener('resize', ()=> this._breakPointsLoop() ,  this._addPassiveSupport()) 
  }

  private _addLoadListener(): void {
    window.addEventListener('DOMContentLoaded' , ()=> this._loadListener(), this._addPassiveSupport())
  }

  private _removeLoadListener(): void {
    window.removeEventListener('DOMContentLoaded' , ()=> this._loadListener() ,  this._addPassiveSupport())
  }

  private _addUnloadListener(): void {
    window.addEventListener('unload' , ()=> this._unloadListener() , this._addPassiveSupport())
  }

  private _loadListener(): void  {
    this._addResizeListener();
    this._breakPointsLoop();
  };

  private _unloadListener(): void {
    this._removeLoadListener();
    this._removeResizeListener();
  }

  private _breakPointsLoop(): void {
    // reset execute tag when new breakPoint is found

    // set active breakPoint
    // -->> OBJECT DESTRUCTURING IN TYPESCRIPT <<-- 
    this.breakPoints.forEach(({breakPoints}:{breakPoints:BreakPoint[]}): void => {
      breakPoints.forEach((breakPoint: BreakPoint):void =>{
        breakPoint.checkMedia();
        this._mirrorMediaProp(breakPoint);
      })
    });

    // sort active breakPoints 
    this.breakPoints.forEach(({breakPoints}:{breakPoints:BreakPoint[]}): void => {
      const sortedActiveBreakPoints: BreakPoint[] = breakPoints.filter((breakPoint: BreakPoint):boolean => breakPoint.isActive())

      // last breakPoint becomes mainBreakPoint 
      if(sortedActiveBreakPoints.length){
        const mainBreakPoint = sortedActiveBreakPoints[sortedActiveBreakPoints.length-1];

        // make sure mainBreakPoint is already set // else assign mainBreakPoint and execute it
        if(!this.mainBreakPoint){
          this.mainBreakPoint = mainBreakPoint;
          this.mainBreakPoint.executeCallback();
        // compare active breakPoint to last mainBreakPoint // if different replace and execute callback
        }else if(mainBreakPoint.getId() !== this.mainBreakPoint.getId()){
          this.mainBreakPoint = mainBreakPoint;
          this.mainBreakPoint.executeCallback();
        }
      } 
    });
  }

  // utility

  private _addPassiveSupport(): any | boolean {
    return this._supportsPassive() ? {passive:true }: false ;
  }

  private _supportsPassive(): boolean {
    let passiveSupported = false;
    try {
      const options: any = {
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

  // public getActiveBreakPoint() {
  //     for (const [key, bpObj] of Object.entries(this.breakPoints))
  //         if(bpObj.active) return  key + '';
  // }

}


class BreakPoint {

  private _active: boolean = false;

  constructor(
    private readonly _id: string ,
    private readonly _type: string,
    private readonly _feature: string,
    private readonly _units: number, 
    private readonly _callback: Callback
    ) {
  }

  private get id():string {
      return this._id;
  }

  private get callback(): Callback {
      return this._callback;
  }

  private get type(): string {
      return this._type;
  }

  private get units(): number {
      return this._units;
  }

  private get feature(): string {
      return this._feature;
  }

  private get active():boolean {
      return this._active;
  }

  private set active(state) {
    this._active = state;
  }

  public isActive(): boolean{
    return this._active;
  }

  public getUnits(): number{
    return this.units;
  }

  public getId(): string{
    return this.id;
  }

  public activate(): void {
    this._active = true;
    this.executeCallback();
  }

  private _hasCallback() {
    return (!!this._callback);
  }

  public executeCallback(): void {
    if (this._hasCallback())  this.callback();
  }

  public checkMedia (): BreakPoint {
    if (this._checkMediaRule()){
      if (!this.isActive()){ 
        this.active = true;
      }
    }else{
    this.active = false;
    }
      return  this;
  }

  private _checkMediaRule(): boolean {
    switch (this.feature) {
      case MIN_WIDTH : return window.innerWidth >= this.units;
      case MAX_WIDTH : return window.innerWidth < this.units;
      case MIN_HEIGHT : return window.innerHeight >= this.units;
      case MAX_HEIGHT : return window.innerHeight < this.units;
      default: return false
    }
  } 
}


class Query{
  public queries: MediaQuery[] | BreakPoint[];
  public breakPoints: BreakPoint[];
  constructor(
    private readonly _feature: string,
    ) {}
  private get feature() {
    return this._feature;
  }
  public assignQueries (mediaQueries: MediaQuery[]): void  {
    const breakPoints = []
        mediaQueries.forEach(({ id, type, feature, units, callback }) => {
            if (feature === this.feature)
            breakPoints.push( new BreakPoint(id, type, feature, units, callback));
        });
        this.breakPoints = breakPoints;
        this._deleteQueries();
    }
  private _deleteQueries():void {
    delete this.queries;
  }
}

const jsMediaQuery =  new JsMediaQuery(null);

console.log(jsMediaQuery)
