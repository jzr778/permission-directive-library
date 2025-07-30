import { TestBed } from '@angular/core/testing';

import { PermissionDirectiveLibraryService } from './permission-directive-library.service';

describe('PermissionDirectiveLibraryService', () => {
  let service: PermissionDirectiveLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionDirectiveLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
