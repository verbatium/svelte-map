import type { LayoutServerLoadEvent } from "./$types";

export async function load(event: LayoutServerLoadEvent) {
	await event.parent();
	const user = event.locals?.user;
	if (!user) return { user: null };
	return { user };
}