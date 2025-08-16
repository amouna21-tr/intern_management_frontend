import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionStagiairesComponent } from './gestion-stagiaires.component';

describe('GestionStagiairesComponent', () => {
  let component: GestionStagiairesComponent;
  let fixture: ComponentFixture<GestionStagiairesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionStagiairesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionStagiairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
