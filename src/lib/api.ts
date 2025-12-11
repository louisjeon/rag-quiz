import { Quiz } from "../types/quiz";
import { User } from "../types/user";

const API_BASE_URL =
	process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

const withCredentialsFetch = async <T>(
	path: string,
	init?: RequestInit
): Promise<T> => {
	const res = await fetch(`${API_BASE_URL}${path}`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...(init?.headers || {}),
		},
		...init,
	});

	if (!res.ok) {
		throw new Error((await res.text()) || `Request failed: ${res.status}`);
	}
	return res.json();
};

export const loginWithIdToken = async (idToken: string) => {
	return withCredentialsFetch<{ user: User }>("/auth/token", {
		method: "POST",
		body: JSON.stringify({ id_token: idToken }),
	});
};

export const logout = async () => {
	await withCredentialsFetch<{ ok: boolean }>("/auth/logout", {
		method: "POST",
	});
};

export const fetchMe = async (): Promise<{ user: User }> => {
	return withCredentialsFetch("/auth/me");
};

export const saveQuizzes = async (payload: {
	title?: string;
	source_filename?: string;
	quizzes: Quiz[];
}) => {
	return withCredentialsFetch("/api/quizzes", {
		method: "POST",
		body: JSON.stringify(payload),
	});
};
