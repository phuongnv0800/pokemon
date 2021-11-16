import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-pokemon-route',
  templateUrl: './pokemon-route.component.html',
  styleUrls: ['./pokemon-route.component.css']
})
export class PokemonRouteComponent implements OnInit {
  //show toast
  content!: string;
  isShowToast = false;
  //default heigth width
  _mapHeightPx = 600;
  _mapWidthPx = 900;
  //default cell
  _height = 20;
  _width = 20;
  //default id map
  _idMap: number = 2;
  rowsCreate!: number;
  colsCreate!: number;
  _mapPokemon!: Response;

  listRoute: Array<Point> = [];
  listFoodEat: Point[] = [];

  currentPos: Point = {x: 1, y:0, walkable:true};
  currentIndex = 0;
  isStop = true;
  //change map
  isModify = false;
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getMapPokemon(this._idMap);
  }

  createMapPokemon(){
    if(this.rowsCreate != null && this.rowsCreate > 0 && this.colsCreate != null && this.colsCreate > 0){
      this.api.postMap({ rows : this.rowsCreate, cols : this.colsCreate}).subscribe(data=>{
        this._mapPokemon = data;
        // console.log(data);
        this._idMap = this._mapPokemon.id;
        this._height = Math.floor(this._mapHeightPx/this._mapPokemon.cols);
        this._width = Math.floor(this._mapWidthPx/this._mapPokemon.rows);
      })
    }
  }

  getMapPokemon(so: number){
    this.api.getMap(this._idMap).subscribe({
      next: (data)=> {
        this._mapPokemon = data;
        this._height = Math.floor(this._mapHeightPx/this._mapPokemon.cols);
        this._width = Math.floor(this._mapWidthPx/this._mapPokemon.rows);
        this._idMap = this._mapPokemon.id;
      },
      error: (e) => {
        this._idMap = 8
        this.isShowToast = true;
        this.content = "Không tìm thấy map trong dữ liệu !!!";
        this.delay(4000);
        console.log(e);
      },
      complete: () => console.info('complete', this._mapPokemon)
    });
  }

  stopSearchRoute(){
    // if(!this.isStop){
    //   //stop search
    //   this.isStop = true;
      
    //   let pointCurrent = this.listRoute[this.currentIndex-1];
    //   // console.log(this.listRoute);
    //   for(let i = this.listRoute.length - 1; i >= this.currentIndex; i--){
    //     this.listRoute.pop();
    //   }
    //   let newList = [];
    //   newList.push(pointCurrent);
    //   this.listFoodEat.shift();
    //   this.listFoodEat.forEach(element => {
    //     let check = true;
    //     this.listRoute.forEach(e => {
    //       if(element.x === e.x && element.y === e.y && element.walkable === e.walkable)
    //       {
    //         check = false;
    //       }
    //     })
    //     if(check){
    //       newList.push(element);
    //     }
    //   });
    //   console.log(newList);
    //   console.log(this.listRoute);

    //   let res: Response;
    //   let params = {
    //     id: this._idMap,
    //     points: newList
    //   }
    //   this.api.getListRoute(params).subscribe({
    //     next: (v)=> {
    //       res = v;
    //       res?.data.forEach(e=>{
    //         this.listRoute.push(e);
    //       });
    //     },
    //     error: (e) => console.log(e),
    //     complete: () => {
    //       // console.log(this.listRoute);
    //     }
    //   });
    // }
  }
  continueSearchRoute(){
    // this.isStop = false;
    // this.getCurrentPos();
  }
  addPos(point: Point){
    if(this.isModify){
      this._mapPokemon?.data.forEach(e=>{
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
  modifyMap(){
    this.resetSearch();
    this.isModify = true;
  }
  saveMap(){
    this.isModify = false;
    this.api.updateMap({
      id: this._idMap,
      points: this._mapPokemon.data
    }).subscribe({
      next: (v)=> {
        this._mapPokemon = v;
        this._height = Math.floor(this._mapHeightPx/this._mapPokemon.rows);
        this._width = Math.floor(this._mapWidthPx/this._mapPokemon.cols);
        this._idMap = this._mapPokemon.id;
      },
      error: (e) => {
        this.isShowToast = true;
        this.content = "Không thể update map !!!";
        this.delay(4000);
        console.log(e);
      },
      complete: () => console.info('complete')
    });
  }
  async getListRoutePokemon(){
    if(this.listFoodEat.length > 1){
      this.currentPos = this.listFoodEat[0];
      this.listRoute = [];
      this.isStop = false;
      
      let res: Response;
      this.api.getListRoute({
        id: this._idMap,
        points: this.listFoodEat
      }).subscribe({
        next: (v)=> {
          res = v;
          res?.data.forEach(e=>{
            this.listRoute.push(e);
          });
        },
        error: (e) => console.log(e),
        complete: () => {
          // console.log(this.listRoute);
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
    this.currentIndex = 0;
  }
  async getCurrentPos() {
    while(!this.isStop && this.currentIndex < this.listRoute?.length) {
      this.currentPos = this.listRoute[this.currentIndex++];
      await this.delay(50);
      // console.log(this.currentPos);
    }
  }

  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
  } 
}

export interface Point{
  x: number;
  y: number;
  walkable: boolean;
}

export interface Response{
  data: Array<Point>;
  result: boolean;
  id: number;
  rows: number;
  cols: number;
}
export interface RequestList{
  id: number;
  points: Point[];
}