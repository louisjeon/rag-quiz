import { create } from "zustand";
import { fetchMe, loginWithIdToken, logout } from "../lib/api";
import { User } from "../types/user";

type State = {
	user: User | null;
	loading: boolean;
	error: string | null;
};

type Actions = {
	setUser: (user: User | null) => void;
	fetchCurrentUser: () => Promise<void>;
	login: (idToken: string) => Promise<void>;
	logout: () => Promise<void>;
};

export const useUserStore = create<State & Actions>((set) => ({
	user: null,
	loading: false,
	error: null,

	setUser: (user) => set({ user }),

	fetchCurrentUser: async () => {
		set({ loading: true, error: null });
		try {
			const res = await fetchMe();
			set({ user: res.user, loading: false });
		} catch (err: any) {
			set({ user: null, loading: false, error: err?.message ?? null });
		}
	},

	login: async (idToken: string) => {
		set({ loading: true, error: null });
		try {
			const res = await loginWithIdToken(idToken);
			set({ user: res.user, loading: false });
		} catch (err: any) {
			set({ user: null, loading: false, error: err?.message ?? null });
			throw err;
		}
	},

	logout: async () => {
		await logout();
		set({ user: null });
	},
}));
