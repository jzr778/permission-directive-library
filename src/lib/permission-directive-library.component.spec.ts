import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionDirectiveLibraryComponent } from './permission-directive-library.component';

describe('PermissionDirectiveLibraryComponent', () => {
  let component: PermissionDirectiveLibraryComponent;
  let fixture: ComponentFixture<PermissionDirectiveLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionDirectiveLibraryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PermissionDirectiveLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
