import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, HostListener,
    Input, OnChanges, SimpleChanges, animate, style, transition, trigger,
} from "@angular/core";
import { Observable } from "rxjs";

import "./button.scss";

export type ButtonType = "square" | "round" | "wide";
export type ButtonColor = "primary" | "light" | "danger" | "warn";
export type ButtonAction = () => Observable<any> | void;

export enum SubmitStatus {
    Idle,
    Submitting,
    Succeeded,
    Failed,
}

@Component({
    selector: "bl-button",
    templateUrl: "button.html",
    animations: [
        trigger("animateSucessIcon", [
            transition(":enter", [
                style({ width: 0 }),
                animate("200ms", style({ width: "1em" })),
            ]),
        ]),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ButtonComponent implements OnChanges {
    public SubmitStatus = SubmitStatus;

    @Input() public action: ButtonAction;
    @Input() public icon: string;
    @Input() public title: string;
    @Input() @HostBinding("class.disabled") public disabled = false;
    @Input() @HostBinding("attr.type") public type: ButtonType = "square";
    @Input() @HostBinding("attr.color") public color: ButtonColor = "primary";
    @Input() public routerLink: string;

    @HostBinding("tabindex") public tabindex = "0";

    public set status(value: SubmitStatus) {
        this._status = value;
        this.changeDetectionRef.markForCheck();
    }

    public get status() { return this._status; }
    private _status = SubmitStatus.Idle;

    constructor(private changeDetectionRef: ChangeDetectorRef) { }

    @HostListener("click")
    public handleAction() {
        if (this.disabled) {
            return;
        }
        this._execute();
    }

    @HostListener("keydown", ["$event"])
    public onkeydown(event: KeyboardEvent) {
        if (event.code === "Space" || event.code === "Enter") {
            this.handleAction();
            event.preventDefault();
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        if ("disabled" in changes) {
            this.tabindex = this.disabled ? "-1" : "0";
        }

        if (changes.action) {
            if (!changes.action.currentValue) {
                throw new Error(`Action for bl-button with title '${this.title}' cannot be null or undefined`);
            }
        }
    }

    public done() {
        setTimeout(() => {
            this.status = SubmitStatus.Idle;
        }, 500);
    }

    private _execute() {
        this.status = SubmitStatus.Submitting;

        const obs = this.action();
        if (!obs) {
            this.status = SubmitStatus.Succeeded;
            this.done();
            return;
        }
        obs.subscribe({
            complete: () => {
                this.status = SubmitStatus.Succeeded;
                this.done();
            },
            error: () => {
                this.status = SubmitStatus.Failed;
                this.done();
            },
        });
    }
}

@Component({
    selector: "bl-button-group",
    template: `
        <ng-content></ng-content>
    `,
})
export class ButtonGroupComponent {
}
