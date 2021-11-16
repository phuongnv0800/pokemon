
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