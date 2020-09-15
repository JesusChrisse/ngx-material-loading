import { MaterialLoadingConfig } from './material-loading-config';

export class MaterialLoadingDefaultConfig implements MaterialLoadingConfig {
	readonly dialogTransparent: boolean;
	readonly defaultLoadingState: boolean;
}
