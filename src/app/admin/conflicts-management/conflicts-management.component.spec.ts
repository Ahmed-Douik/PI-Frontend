import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictsManagementComponent } from './conflicts-management.component';

describe('ConflictsManagementComponent', () => {
  let component: ConflictsManagementComponent;
  let fixture: ComponentFixture<ConflictsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConflictsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConflictsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
