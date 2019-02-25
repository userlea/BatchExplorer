import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges,
} from "@angular/core";
import { isNotNullOrUndefined } from "@batch-flask/core";
import { NodeLogEntry, NodeLogsService } from "app/services/azure-batch";
import { BehaviorSubject } from "rxjs";
import { filter, switchMap } from "rxjs/operators";

import "./node-diagnostics.scss";

export interface NodeDiagnosticsComponentInputs {
    poolId: string;
    nodeId: string;
}

@Component({
    selector: "bl-node-diagnostics",
    templateUrl: "node-diagnostics.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeDiagnosticsComponent implements OnChanges {
    @Input() public poolId: string;
    @Input() public nodeId: string;

    public logs: NodeLogEntry[];

    private _inputs = new BehaviorSubject<NodeDiagnosticsComponentInputs | null>(null);
    constructor(private changeDetector: ChangeDetectorRef, private nodeLogsService: NodeLogsService) {
        this._inputs.pipe(
            filter(isNotNullOrUndefined),
            switchMap(() => this.nodeLogsService.loadLogs(this.poolId, this.nodeId)),
        ).subscribe((logs) => {
            this.logs = logs;
            this.changeDetector.markForCheck();
        });
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.poolId || changes.nodeId) {
            this._inputs.next({
                poolId: this.poolId,
                nodeId: this.nodeId,
            });
        }
    }

    public trackItem(index: number) {
        return index;
    }
}
