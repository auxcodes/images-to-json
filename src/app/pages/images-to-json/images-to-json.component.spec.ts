import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesToJsonComponent } from './images-to-json.component';

describe('ImagesToJsonComponent', () => {
  let component: ImagesToJsonComponent;
  let fixture: ComponentFixture<ImagesToJsonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagesToJsonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesToJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
