import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountriesDialog } from './countries.dialog.component';

describe('Countries.DialogComponent', () => {
  let component: CountriesDialog;
  let fixture: ComponentFixture<CountriesDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountriesDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountriesDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
