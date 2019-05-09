import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbInputComponent } from './verb-input.component';

describe('VerbInputComponent', () => {
  let component: VerbInputComponent;
  let fixture: ComponentFixture<VerbInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerbInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerbInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
