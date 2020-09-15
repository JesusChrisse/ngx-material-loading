import {
	ModuleWithProviders,
	NgModule,
	Optional,
	SkipSelf,
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { LoadingDirective } from './directives/loading.directive';
import { MaterialLoadingConfig } from './models/material-loading-config';
import { MaterialLoadingDefaultConfig } from './models/material-loading-default-config';
import { MaterialLoadingService } from './services/material-loading.service';

const DEFAULT_CONFIG: MaterialLoadingConfig = {
	defaultLoadingState: false,
	dialogTransparent: true,
};

@NgModule({
	declarations: [
		LoadingSpinnerComponent,
		LoadingDirective,
		LoadingDialogComponent,
	],
	imports: [FlexLayoutModule, MatProgressSpinnerModule, MatDialogModule],
	entryComponents: [LoadingDialogComponent],
	exports: [LoadingDirective],
})
export class NgxMaterialLoadingModule {
	constructor(
		@Optional() @SkipSelf() parentModule?: NgxMaterialLoadingModule
	) {
		if (parentModule) {
			throw new Error(
				'NgxMaterialLoadingModule is already loaded. Import it in the AppModule only.'
			);
		}
	}

	static forRoot(
		config: Partial<MaterialLoadingConfig>
	): ModuleWithProviders<NgxMaterialLoadingModule> {
		return {
			ngModule: NgxMaterialLoadingModule,
			providers: [
				{
					provide: MaterialLoadingDefaultConfig,
					useValue: { ...DEFAULT_CONFIG, ...config },
				},
				MaterialLoadingService,
			],
		};
	}
}
