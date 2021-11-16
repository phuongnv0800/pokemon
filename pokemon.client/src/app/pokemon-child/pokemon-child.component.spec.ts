import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonChildComponent } from './pokemon-child.component';

describe('PokemonChildComponent', () => {
  let component: PokemonChildComponent;
  let fixture: ComponentFixture<PokemonChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokemonChildComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
