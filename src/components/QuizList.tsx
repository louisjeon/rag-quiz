import { useMemo, useState } from "react";
import { Quiz } from "../types/quiz";

type Props = {
	quizzes: Quiz[];
};

export const QuizList = ({ quizzes }: Props) => {
	const [selected, setSelected] = useState<Record<number, string>>({});
	const [revealed, setRevealed] = useState<Record<number, boolean>>({});

	const hasQuizzes = useMemo(() => quizzes.length > 0, [quizzes]);
	if (!hasQuizzes) return null;

	const handleSelect = (idx: number, choice: string) => {
		setSelected((prev) => ({ ...prev, [idx]: choice }));
		setRevealed((prev) => ({ ...prev, [idx]: true }));
	};

	const handleReveal = (idx: number) => {
		setRevealed((prev) => ({ ...prev, [idx]: true }));
	};

	return (
		<div className="quiz-grid">
			{quizzes.map((quiz, idx) => {
				const choice = selected[idx];
				const isRevealed = revealed[idx];
				const isCorrect = isRevealed && choice === quiz.answer;

				return (
					<div key={`${quiz.question}-${idx}`} className="quiz-card">
						<div className="quiz-header">
							<span className="pill">Q{idx + 1}</span>
							<p className="question">{quiz.question}</p>
							{quiz.difficulty && (
								<span className={`pill ${quiz.difficulty}`}>
									{quiz.difficulty}
								</span>
							)}
						</div>

						{quiz.options ? (
							<div className="options-list">
								{quiz.options.map((option, i) => {
									const isSelected = choice === option;
									const showCorrect =
										isRevealed && option === quiz.answer;
									const showWrong =
										isRevealed &&
										isSelected &&
										!showCorrect;
									return (
										<button
											key={`${option}-${i}`}
											className={`option-btn${
												isSelected ? " selected" : ""
											}${showCorrect ? " correct" : ""}${
												showWrong ? " wrong" : ""
											}`}
											onClick={() =>
												handleSelect(idx, option)
											}
											type="button"
										>
											{option}
										</button>
									);
								})}
							</div>
						) : (
							<div className="options-list">
								<button
									type="button"
									className="option-btn"
									onClick={() => handleReveal(idx)}
								>
									정답 보기
								</button>
							</div>
						)}

						{isRevealed && (
							<div className="meta">
								{quiz.options && choice
									? isCorrect
										? "정답입니다!"
										: "틀렸어요. 정답을 확인해보세요."
									: "정답을 확인하세요."}
							</div>
						)}

						{isRevealed && (
							<div className="meta">
								<strong>정답:</strong> {quiz.answer}
							</div>
						)}
						{isRevealed && quiz.explanation && (
							<div className="meta">
								<strong>해설:</strong> {quiz.explanation}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};
