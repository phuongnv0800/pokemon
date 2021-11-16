import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonRouteComponent } from './pokemon-route.component';

describe('PokemonRouteComponent', () => {
  let component: PokemonRouteComponent;
  let fixture: ComponentFixture<PokemonRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokemonRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
