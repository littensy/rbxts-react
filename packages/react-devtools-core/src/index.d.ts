export namespace backend {
	export interface ConnectOptions {
		host?: string;
		port?: number;
		useHttps?: boolean;
		isAppActive?: () => boolean;
		profileOnStart?: boolean;
	}

	export function connectToDevtools(options?: ConnectOptions): void;
}
