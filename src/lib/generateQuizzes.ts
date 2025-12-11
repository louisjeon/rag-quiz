import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Quiz } from "../types/quiz";

const QUIZ_PROMPT = ChatPromptTemplate.fromMessages([
	[
		"system",
		[
			"너는 강의자료를 요약해 5개의 객관식/단답형 퀴즈를 JSON으로 만드는 도우미야.",
			"반드시 JSON 문자열만 반환해. 다른 말은 쓰지 마.",
			"JSON 스키마:",
			`{{ "quizzes": [ {{ "question": "...", "options": ["A","B","C","D"]?, "answer": "...", "explanation": "...", "difficulty": "easy|medium|hard" }} ] }}`,
			"options는 객관식일 때만 포함해.",
			"질문은 한국어로, 답과 설명도 한국어로 작성해.",
		].join(" "),
	],
	["human", "강의자료 내용:\n{content}\n\n위 내용을 바탕으로 JSON만 반환해."],
]);

const cleanJsonLike = (raw: string) => {
	const trimmed = raw.trim();
	// Strip common code fences ```json ... ``` or ``` ... ```
	const fenceStripped = trimmed
		.replace(/^```[a-zA-Z]*\n?/, "")
		.replace(/```$/, "")
		.trim();
	// If the model adds pre/post text, keep from the first "{" or "["
	const firstBrace = fenceStripped.search(/[\[{]/);
	if (firstBrace > 0) {
		return fenceStripped.slice(firstBrace);
	}
	return fenceStripped;
};

const parseQuizResponse = (raw: string): Quiz[] => {
	try {
		const cleaned = cleanJsonLike(raw);
		const parsed = JSON.parse(cleaned);
		if (Array.isArray(parsed)) return parsed as Quiz[];
		if (parsed?.quizzes && Array.isArray(parsed.quizzes))
			return parsed.quizzes as Quiz[];
		return [];
	} catch (e) {
		console.error("JSON parse failed", e, raw);
		return [];
	}
};

export const generateQuizzes = async (content: string, apiKey?: string) => {
	const model = new ChatGoogleGenerativeAI({
		apiKey,
		model: "gemini-2.5-flash-lite",
		apiVersion: "v1beta",
		temperature: 0.3,
	});
	const chain = QUIZ_PROMPT.pipe(model).pipe(new StringOutputParser());
	const response = await chain.invoke({ content });
	return parseQuizResponse(response);
};
