import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFieldInputComponent } from './user-field-input.component';

describe('UserFieldInputComponent', () => {
  let component: UserFieldInputComponent;
  let fixture: ComponentFixture<UserFieldInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFieldInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFieldInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
