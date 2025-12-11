import { useRef, useState } from "react";
import { FilePicker } from "./FilePicker";
import { QuizList } from "./QuizList";
import { extractTextFromFiles } from "../lib/extractText";
import { generateQuizzes } from "../lib/generateQuizzes";
import { Quiz } from "../types/quiz";

export const FileInputForm = () => {
	const ref = useRef<HTMLInputElement>(null);
	const [quizzes, setQuizzes] = useState<Quiz[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

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
		try {
			const content = await extractTextFromFiles(files);
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

			<QuizList quizzes={quizzes} />
		</div>
	);
};
