import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
	BehaviorSubject,
	Observable,
	Subject,
	Subscription,
	combineLatest,
} from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { MaterialLoadingDefaultConfig } from '../models/material-loading-default-config';

@Injectable({
	providedIn: 'root',
})
export class MaterialLoadingService {
	readonly loadingChange: Observable<boolean>;
	private dialogRef: MatDialogRef<LoadingDialogComponent>;
	private combineSubscription: Subscription;
	private subjects: BehaviorSubject<boolean>[] = [];
	private readonly loading$: BehaviorSubject<boolean>;

	constructor(
		private readonly dialog: MatDialog,
		private readonly config: MaterialLoadingDefaultConfig
	) {
		this.loading$ = new BehaviorSubject(this.config.defaultLoadingState);

		this.loadingChange = this.loading$
			.asObservable()
			.pipe(distinctUntilChanged());

		this.loadingChange.subscribe((value) => this.updateState(value));
	}

	subscribe(observable: Observable<boolean>): Subscription {
		const subscription = this.addObservable(observable);
		this.combine();
		return subscription;
	}

	private updateState(loadingState: boolean): void {
		if (loadingState) {
			this.dialogRef = this.dialog.open(LoadingDialogComponent, {
				panelClass: this.config.dialogTransparent
					? 'dialog-transparent'
					: '',
				disableClose: true,
				role: 'alertdialog',
				autoFocus: false,
			});
		} else if (this.dialogRef) {
			this.dialogRef.close();
		}
	}
	private addObservable(observable: Observable<boolean>): Subscription {
		const subject = new BehaviorSubject<boolean>(false);
		const subscription = observable
			.pipe(distinctUntilChanged())
			.subscribe((value) => subject.next(value));
		this.subjects.push(subject);
		return subscription;
	}

	private combine(): void {
		if (this.combineSubscription) {
			this.combineSubscription.unsubscribe();
		}
		if (this.subjects.length) {
			this.combineSubscription = combineLatest(this.subjects)
				.pipe(map((loadingState) => loadingState.some(Boolean)))
				.subscribe((value) => this.loading$.next(value));
		} else {
			this.loading$.next(this.config.defaultLoadingState);
		}
	}

	private autoDeleteSubscription(
		subscription: Subscription,
		subject: Subject<boolean>
	): void {
		subscription.add(() => {
			subject.complete();
			this.subjects = this.subjects.filter((sub) => sub.closed);
		});
	}
}
