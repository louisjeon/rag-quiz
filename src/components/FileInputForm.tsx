import { useRef, useState } from "react";
import { FilePicker } from "./FilePicker";
import { QuizList } from "./QuizList";
import { extractTextFromFiles } from "../lib/extractText";
import { generateQuizzes } from "../lib/generateQuizzes";
import { Quiz } from "../types/quiz";
import { saveQuizzes } from "../lib/api";
import { useUserStore } from "../store/user";

export const FileInputForm = () => {
	const ref = useRef<HTMLInputElement>(null);
	const [quizzes, setQuizzes] = useState<Quiz[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const [saveMessage, setSaveMessage] = useState<string | null>(null);
	const [title, setTitle] = useState<string>("");
	const [sourceFilename, setSourceFilename] = useState<string | undefined>();
	const { user } = useUserStore();

	const handleFileChange = async () => {
		const files = ref.current?.files;
		if (!files?.length) return;
		if (!process.env.REACT_APP_GEMINI_API_KEY) {
			setError("REACT_APP_GEMINI_API_KEY 환경변수를 설정해주세요.");
			return;
		}

		setLoading(true);
		setError(null);
		setQuizzes([]);
		setSaveMessage(null);
		try {
			const content = await extractTextFromFiles(files);
			setSourceFilename(files[0]?.name);
			setTitle(files[0]?.name?.replace(/\.[^/.]+$/, "") || "새 퀴즈");
			const quizList = await generateQuizzes(
				content,
				process.env.REACT_APP_GEMINI_API_KEY
			);
			console.log("Generated quizzes:", quizList);
			if (!quizList.length) {
				setError("퀴즈 생성에 실패했어요. 다시 시도해주세요.");
			} else {
				setQuizzes(quizList);
			}
		} catch (e: any) {
			setError(e?.message ?? "처리 중 오류가 발생했어요.");
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async () => {
		if (!user) {
			setSaveMessage("로그인 후 저장할 수 있어요.");
			return;
		}
		if (!quizzes.length) return;
		setSaving(true);
		setSaveMessage(null);
		try {
			await saveQuizzes({
				title: title || "Untitled Quiz",
				source_filename: sourceFilename,
				quizzes,
			});
			setSaveMessage("저장 완료! 내 퀴즈 목록에서 확인하세요.");
		} catch (err: any) {
			setSaveMessage(err?.message ?? "저장 중 오류가 발생했어요.");
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="stack">
			<div>
				<FilePicker ref={ref} onChange={handleFileChange} />
				<p className="hint">여러 파일 선택 가능 · 최대 PDF/PPTX</p>
			</div>

			{loading && (
				<div className="status">
					퀴즈를 생성 중입니다... 잠시만 기다려주세요.
				</div>
			)}
			{error && <div className="status error">{error}</div>}

			{quizzes.length > 0 && (
				<div className="save-panel">
					<label className="save-row">
						<span className="label">퀴즈 제목</span>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="퀴즈 제목을 입력하세요"
						/>
					</label>
					<button
						className="primary"
						onClick={handleSave}
						disabled={saving}
						type="button"
					>
						{saving ? "저장 중..." : user ? "퀴즈 저장" : "로그인 후 저장"}
					</button>
					{saveMessage && <div className="status">{saveMessage}</div>}
				</div>
			)}

			<QuizList quizzes={quizzes} />
		</div>
	);
};
