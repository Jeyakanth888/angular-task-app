import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentTopicComponent } from './assignment-topic.component';

describe('AssignmentTopicComponent', () => {
  let component: AssignmentTopicComponent;
  let fixture: ComponentFixture<AssignmentTopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentTopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
