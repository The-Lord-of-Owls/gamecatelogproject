import { TestBed } from '@angular/core/testing';

import { GiantbombDbService } from './giantbomb-db.service';

describe('GiantbombDbService', () => {
  let service: GiantbombDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GiantbombDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
