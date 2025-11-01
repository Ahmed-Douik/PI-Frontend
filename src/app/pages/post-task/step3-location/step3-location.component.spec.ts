import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step3LocationComponent } from './step3-location.component';

describe('Step3LocationComponent', () => {
  let component: Step3LocationComponent;
  let fixture: ComponentFixture<Step3LocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Step3LocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step3LocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
