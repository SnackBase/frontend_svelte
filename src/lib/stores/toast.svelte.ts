type ToastType = 'success' | 'error' | 'info' | 'warning';
type ToastPosition = 'top' | 'bottom';

interface ToastOptions {
	message: string;
	type?: ToastType;
	position?: ToastPosition;
	duration?: number;
}

interface Toast extends ToastOptions {
	id: number;
	type: ToastType;
	position: ToastPosition;
	duration: number;
}

class ToastStore {
	toasts = $state<Toast[]>([]);
	private nextId = 0;

	show(options: ToastOptions): number {
		const id = this.nextId++;
		const toast: Toast = {
			id,
			message: options.message,
			type: options.type ?? 'success',
			position: options.position ?? 'bottom',
			duration: options.duration ?? 3000
		};

		this.toasts.push(toast);
		return id;
	}

	success(message: string, options?: Omit<ToastOptions, 'message' | 'type'>): number {
		return this.show({ message, type: 'success', ...options });
	}

	error(message: string, options?: Omit<ToastOptions, 'message' | 'type'>): number {
		return this.show({ message, type: 'error', ...options });
	}

	info(message: string, options?: Omit<ToastOptions, 'message' | 'type'>): number {
		return this.show({ message, type: 'info', ...options });
	}

	warning(message: string, options?: Omit<ToastOptions, 'message' | 'type'>): number {
		return this.show({ message, type: 'warning', ...options });
	}

	dismiss(id: number): void {
		this.toasts = this.toasts.filter((toast) => toast.id !== id);
	}

	dismissAll(): void {
		this.toasts = [];
	}
}

export const toastStore = new ToastStore();