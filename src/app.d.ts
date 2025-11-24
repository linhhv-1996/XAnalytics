// src/app.d.ts
declare global {
	namespace App {
		interface Locals {
			user: {
				uid: string;
				email?: string;
				picture?: string;
				name?: string;
			} | null;
		}
		// ...
	}
}
export {};
