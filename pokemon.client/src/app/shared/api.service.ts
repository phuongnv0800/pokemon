import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { RequestList } from '../pokemon-route/pokemon-route.component';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  postMap(data : any){
    return this.http.post<any>("https://localhost:5001/api/Pokemons", data).pipe(map((res:any)=>{
      return res;
    }))
  }
  getListRoute(data : RequestList){
    // let params = new HttpParams()
    // .set("x1",data.listPoint)
    return this.http.post<any>("https://localhost:5001/api/Pokemons/list/" + data.id, data.points).pipe(
      map((res:any)=>{
        return res;
      })
    );
  }
  getMap( id : any){
    return this.http.get<any>("https://localhost:5001/api/Pokemons/map/" + id);
  }
  updateMap(data: RequestList){
    return this.http.put<any>("https://localhost:5001/api/Pokemons/map/" + data.id, data.points).pipe(
      map((res:any)=>{
        return res;
      })
    );
  }
}
