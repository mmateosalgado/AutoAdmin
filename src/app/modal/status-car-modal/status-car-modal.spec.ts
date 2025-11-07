import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusCarModal } from './status-car-modal';

describe('StatusCarModal', () => {
  let component: StatusCarModal;
  let fixture: ComponentFixture<StatusCarModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusCarModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusCarModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
