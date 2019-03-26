import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserTaskComponent } from './view-user-task.component';

describe('ViewUserTaskComponent', () => {
  let component: ViewUserTaskComponent;
  let fixture: ComponentFixture<ViewUserTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUserTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
