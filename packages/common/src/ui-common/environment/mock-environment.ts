import { DependencyFactories } from ".";
import { MockHttpClient } from "../http/mock-http-client";
import { MockLogger } from "../logging";
import { AbstractEnvironment } from "./abstract-environment";
import {
    EnvironmentName,
    EnvironmentConfig,
    EnvironmentMode,
} from "./environment";

export const mockEnvironmentConfig: EnvironmentConfig = {
    mode: EnvironmentMode.Development,
};

export const mockDependencyFactories: DependencyFactories = {
    logger: () => new MockLogger(),
    httpClient: () => new MockHttpClient(),
};

export class MockEnvironment extends AbstractEnvironment<
    EnvironmentConfig,
    DependencyFactories
> {
    name = EnvironmentName.Mock;

    constructor(config: EnvironmentConfig, depFactories?: DependencyFactories) {
        super(config, depFactories ?? mockDependencyFactories);
    }

    async beforeInit(): Promise<void> {
        // No-op
    }

    async beforeDestroy(): Promise<void> {
        // No-op
    }

    /**
     * Reset any mutable environment state to ease unit test writing
     */
    reset(): void {
        this._assertNotDestroyed();
        this.resetGlobalIdCounter();
    }

    /**
     * Resets the global ID counter back to zero
     */
    private resetGlobalIdCounter(): void {
        this._assertNotDestroyed();
        this._globalIdCounter = 0;
    }
}