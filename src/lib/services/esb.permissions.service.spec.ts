/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ESBPermissionsService } from './esb.permissions.service';

describe('Service: ESBPermissions', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ESBPermissionsService]
    });
  });

  it('should ...', inject([ESBPermissionsService], (service: ESBPermissionsService) => {
    expect(service).toBeTruthy();
  }));
});
