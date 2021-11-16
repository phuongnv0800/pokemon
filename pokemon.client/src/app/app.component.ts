import { Component } from '@angular/core';
import { ApiService } from './shared/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title= "pokemon"
  //show toast
  content!: string;
  isShowToast = false;
  //default heigth width
  _mapHeightPx = 600;
  _mapWidthPx = 990;
  //default cell
  _height = 20;
  _width = 20;
  //default id map
  _idMap: number = 2030;
  rowsCreate!: number;
  colsCreate!: number;
  _mapPokemon!: Result;

  listRoute: Array<Point> = [];
  listFoodEat: Point[] = [];

  currentPos: Point = {x: 1, y:0, walkable:true};
  currentIndex = 0;
  isStop = true;
  //change map
  isModify = false;

  // save point across
  listPointWent: Array<Point>=[];
  constructor(private api: ApiService) {}
  //
  isBtnStop = true;
  isBtnStart = true;
  ngOnInit(): void {
    this.getMapPokemon();
  }

  createMapPokemon(){
    let response: Response;
    if(this.rowsCreate != null && this.rowsCreate > 0 && this.colsCreate != null && this.colsCreate > 0){
      this.api.postMap({ rows : this.rowsCreate, cols : this.colsCreate}).subscribe({
        next: res=>{
          response = res;
          this._idMap = response.data;
          console.info('success create map', res)
        }, 
        error:(e)=>{}, 
        complete: async ()=>{
          this.getMapPokemon();
          this.isShowToast = true;
          this.content = response.message;
          await this.delay(4000);
          this.isShowToast = false;
        }
      });
    }
  }

  updateMap(){
    //cho phep update
    this.isModify = false;
    //update map
    let response: Response;
    this.api.updateMap({
      id: this._idMap,
      points: this._mapPokemon.points
    }).subscribe({
      next: (res)=> {
        response = res;
        this._idMap = response.data;
      },
      error: async (e) => {
        this.isShowToast = true;
        this.content = "Không thể update map !!!";
        await this.delay(4000);
        this.isShowToast = false;
        // console.log(e);
      },
      complete:async () => {
        this.isShowToast = true;
        this.content = response.message;
        await this.delay(2000);
        this.isShowToast = false;
      }
    });


  }

  getMapPokemon(){
    let response: Response;
    this.api.getMap(this._idMap).subscribe({
      next: (res)=> {
        response = res
        this.updateHeightWidthMap(response.data);
      },
      error: (e) => {
        this._idMap = 8
        this.isShowToast = true;
        this.content = "Không tìm thấy map trong dữ liệu !!!";
        this.delay(4000);
        this.isShowToast = false;
        // console.log(e);
      },
      complete: () => console.info('success get map', this._mapPokemon)
    });
  }

  updateHeightWidthMap(data: any){
    this._mapPokemon = data;
    this._height = Math.floor(this._mapHeightPx/this._mapPokemon.rows);
    this._width = Math.floor(this._mapWidthPx/this._mapPokemon.cols);
    this._idMap = this._mapPokemon.id;
  }

  modifyMap(){
    // this.resetSearch();
    this.isModify = true;
  }

  stopSearchRoute(){
    if(!this.isStop){
      //stop search
      this.isStop = true;
      let num = this.listPointWent.length;
      if(this.listFoodEat.length - num > 2){
        while(num > 0){
          this.listFoodEat.shift();
          num--;
        };
        let i = 0;
        while(this.currentPos.x !== this.listRoute[i]?.x && this.currentPos.y !== this.listRoute[i]?.y){
          this.listRoute.pop();
          i++;
        }
        console.info("list food last",this.listFoodEat);
        console.info("list route last",this.listRoute);
      }
    }
  }
  continueSearchRoute(){
    this.isStop = false;
    this.getCurrentPos();
    let res: Response;
    let result: Array<Point>;
    let params = {
      id: this._idMap,
      points: this.listFoodEat
    }
    this.api.getListRoute(params).subscribe({
      next: (v)=> {
        res = v;
        result = res.data
        result.forEach(e=>{
          this.listRoute.push(e);
        });
      },
      error: (e) => console.info("loi",e),
      complete: () => {
        // console.log(this.listRoute);
        this.getCurrentPos();
      }
    });
  }
  addPos(point: Point){
    if(this.isModify){
      this._mapPokemon?.points.forEach(e=>{
        if(e.x === point.x && e.y === point.y){
          e.walkable = !e.walkable;
        }
      })
    }
    else{
      if(point.walkable && !this.listFoodEat.includes(point)){
        this.listFoodEat.push(point);
      }
    }
  }

  async getListRoutePokemon(){
    if(this.listFoodEat.length > 1){
      this.currentPos = this.listFoodEat[0];
      this.isStop = false;
      
      let res: Response;
      this.api.getListRoute({
        id: this._idMap,
        points: this.listFoodEat
      }).subscribe({
        next: (v)=> {
          res = v;
          this.listRoute = res.data
        },
        error: (e) => console.log(e),
        complete: () => {
          console.info("route",this.listRoute);
          this.getCurrentPos();
        }
      });
    }
    else{
      this.content = "Chọn thêm điểm để bắt đầu";
      this.isShowToast = true;
      await this.delay(4000);
      this.isShowToast = false;
    }
  }
  resetSearch(){
    this.isStop = true;
    this.listRoute = [];
    this.listFoodEat = [];
    this.listPointWent = [];
    this.currentIndex = 0;
  }
  async getCurrentPos() {
    // this.listPointWent.push(this.listFoodEat[0]);
    while(!this.isStop && this.currentIndex < this.listRoute?.length) {
      this.listFoodEat.forEach(e=>{
        if(this.currentPos.x === e.x && this.currentPos.y === e.y){
          this.listPointWent.push(e);
        }
      });
      this.currentPos = this.listRoute[this.currentIndex++];
      await this.delay(50);
      // console.log(this.currentPos);
    }
  }

  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
  } 
}
export interface Cell{
  x: number;
  y: number;
}
export interface Point extends Cell{
  
  walkable: boolean;
}

export interface Result{
  points: Point[];
  id: number;
  cols: number;
  rows: number;
}
export interface Response{
  data: any;
  result: boolean;
  message: string;
}
export interface RequestList{
  id: number;
  points: Point[];
}