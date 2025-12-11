export type Quiz = {
	question: string;
	options?: string[];
	answer: string;
	explanation?: string;
	difficulty?: "easy" | "medium" | "hard";
};

