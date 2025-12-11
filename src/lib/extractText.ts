import { extractPdfText } from "./pdf";
import { extractPptxText } from "./pptx";

export const MAX_INPUT_CHARS = 12_000;

const SUPPORTED_TYPES = [
	"application/pdf",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

export const extractTextFromFiles = async (files: FileList) => {
	const supported = Array.from(files).filter((file) =>
		SUPPORTED_TYPES.includes(file.type)
	);

	if (!supported.length) {
		throw new Error("PDF 또는 PPTX 파일만 지원합니다.");
	}

	const contents: string[] = [];
	for (const file of supported) {
		if (file.type === "application/pdf") {
			contents.push(await extractPdfText(file));
		} else {
			contents.push(await extractPptxText(file));
		}
	}
	return contents.join("\n").slice(0, MAX_INPUT_CHARS);
};

