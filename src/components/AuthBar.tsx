import { useEffect, useRef } from "react";
import { useUserStore } from "../store/user";
import { GoogleLoginButton } from "./GoogleLoginBtn";
import { useNavigate } from "react-router";

export const AuthBar = () => {
	const { user, loading, fetchCurrentUser, login, logout } = useUserStore();
	const btnRef = useRef<HTMLDivElement | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		fetchCurrentUser();
	}, [fetchCurrentUser]);

	return (
		<div className="auth-bar">
			{user ? (
				<div className="auth-info flex items-center gap-2 bg-white text-black border border-gray-200 rounded-md p-2 mb-3">
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
					<button
						className="auth-btn bg-green-500 text-white rounded-md p-2 hover:bg-green-600"
						onClick={() => navigate("/my-quizzes")}
					>
						나의 퀴즈 목록
					</button>
					<button
						className="auth-btn bg-red-500 text-white rounded-md p-2 hover:bg-red-600"
						onClick={logout}
					>
						로그아웃
					</button>
				</div>
			) : (
				<div ref={btnRef}>
					{loading ? (
						"확인 중..."
					) : (
						<GoogleLoginButton onCredential={login} />
					)}
				</div>
			)}
		</div>
	);
};
