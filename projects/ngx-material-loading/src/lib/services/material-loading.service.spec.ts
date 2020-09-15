import { TestBed } from '@angular/core/testing';

import { MaterialLoadingService } from './material-loading.service';

describe('MaterialLoadingService', () => {
	let service: MaterialLoadingService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(MaterialLoadingService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
