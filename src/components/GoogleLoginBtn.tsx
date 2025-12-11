// GoogleLoginButton.tsx
import { useEffect, useRef } from "react";

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

export const GoogleLoginButton = ({
	onCredential,
}: {
	onCredential: (cred: string) => void;
}) => {
	const btnRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
		if (!clientId) return;

		loadGoogleScript()
			.then(() => {
				if (!window.google?.accounts || !btnRef.current) return;

				window.google.accounts.id.initialize({
					client_id: clientId,
					callback: (res: any) => {
						if (res.credential) onCredential(res.credential);
					},
				});

				window.google.accounts.id.renderButton(btnRef.current, {
					theme: "outline",
					size: "medium",
					type: "standard",
				});
			})
			.catch((e) => console.error(e));
	}, [onCredential]);

	return <div ref={btnRef} />;
};
