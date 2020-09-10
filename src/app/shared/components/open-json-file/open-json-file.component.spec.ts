import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenJsonFileComponent } from './open-json-file.component';

describe('OpenJsonFileComponent', () => {
  let component: OpenJsonFileComponent;
  let fixture: ComponentFixture<OpenJsonFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenJsonFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenJsonFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
