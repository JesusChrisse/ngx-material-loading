import {
	ComponentFactory,
	ComponentFactoryResolver,
	Directive,
	Input,
	OnChanges,
	SimpleChanges,
	TemplateRef,
	ViewContainerRef,
} from '@angular/core';

import { LoadingSpinnerComponent } from './../loading-spinner/loading-spinner.component';

@Directive({
	selector: '[mlLoading]',
})
export class LoadingDirective implements OnChanges {
	@Input('mlLoading') loading: boolean;

	private readonly loadingFactory: ComponentFactory<LoadingSpinnerComponent>;

	constructor(
		// tslint:disable-next-line: no-any
		private readonly templateRef: TemplateRef<any>,
		private readonly viewContainer: ViewContainerRef,
		private readonly componentFactoryResolver: ComponentFactoryResolver
	) {
		this.loadingFactory = this.componentFactoryResolver.resolveComponentFactory(
			LoadingSpinnerComponent
		);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.loading) {
			this.updateView(this.loading);
		}
	}

	private updateView(loadingState: boolean): void {
		this.viewContainer.clear();
		if (loadingState === false) {
			this.viewContainer.createEmbeddedView(this.templateRef);
		} else {
			this.viewContainer.createComponent(this.loadingFactory);
		}
	}
}
