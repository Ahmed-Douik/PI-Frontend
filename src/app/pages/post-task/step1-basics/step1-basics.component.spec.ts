import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step1BasicsComponent } from './step1-basics.component';

describe('Step1BasicsComponent', () => {
  let component: Step1BasicsComponent;
  let fixture: ComponentFixture<Step1BasicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Step1BasicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step1BasicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
