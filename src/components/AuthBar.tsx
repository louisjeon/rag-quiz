import { useEffect, useRef } from "react";
import { useUserStore } from "../store/user";

declare global {
	interface Window {
		google?: any;
	}
}

const loadGoogleScript = () =>
	new Promise<void>((resolve, reject) => {
		if (window.google?.accounts) return resolve();
		const script = document.createElement("script");
		script.src = "https://accounts.google.com/gsi/client";
		script.async = true;
		script.defer = true;
		script.onload = () => resolve();
		script.onerror = (err) => reject(err);
		document.body.appendChild(script);
	});

export const AuthBar = () => {
	const { user, loading, fetchCurrentUser, login, logout } = useUserStore();
	const btnRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		fetchCurrentUser();
	}, [fetchCurrentUser]);

	useEffect(() => {
		const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
		if (!clientId || user) return;

		loadGoogleScript()
			.then(() => {
				if (!window.google?.accounts || !btnRef.current) return;
				window.google.accounts.id.initialize({
					client_id: clientId,
					callback: async (response: any) => {
						if (response.credential) {
							await login(response.credential);
						}
					},
				});
				window.google.accounts.id.renderButton(btnRef.current, {
					theme: "outline",
					size: "medium",
					type: "standard",
				});
			})
			.catch((err) => {
				console.error("Google script load failed", err);
			});
	}, [user, login]);

	return (
		<div className="auth-bar">
			{user ? (
				<div className="auth-info">
					{user.picture && (
						<img
							src={user.picture}
							alt={user.name || user.email || "user"}
							className="avatar"
						/>
					)}
					<div className="auth-text">
						<div className="name">{user.name || user.email}</div>
						<div className="email">{user.email}</div>
					</div>
					<button className="auth-btn" onClick={logout}>
						로그아웃
					</button>
				</div>
			) : (
				<div ref={btnRef}>{loading ? "확인 중..." : null}</div>
			)}
		</div>
	);
};
