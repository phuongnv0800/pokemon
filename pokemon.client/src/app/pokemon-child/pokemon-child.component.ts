import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pokemon-child',
  templateUrl: './pokemon-child.component.html',
  styleUrls: ['./pokemon-child.component.css']
})
export class PokemonChildComponent implements OnInit {
  @Input() _height!: number;
  @Input() _width!: number;
  @Input() top!: number;
  @Input() left!: number;
  constructor() { }

  ngOnInit(): void {
  }

}
