import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step2RateComponent } from './step2-rate.component';

describe('Step2RateComponent', () => {
  let component: Step2RateComponent;
  let fixture: ComponentFixture<Step2RateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Step2RateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step2RateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
