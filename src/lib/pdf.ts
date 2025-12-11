import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";

const PDF_WORKER_SRC =
	"https://unpkg.com/pdfjs-dist@5.4.449/build/pdf.worker.min.mjs";

let workerConfigured = false;
const ensureWorker = () => {
	if (!workerConfigured) {
		GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
		workerConfigured = true;
	}
};

export const extractPdfText = async (file: File) => {
	ensureWorker();
	const data = await file.arrayBuffer();
	const pdf = await getDocument({ data }).promise;
	const pages: string[] = [];
	for (let i = 1; i <= pdf.numPages; i += 1) {
		const page = await pdf.getPage(i);
		const content = await page.getTextContent();
		const text = content.items
			.map((item: any) => ("str" in item ? item.str : ""))
			.join(" ");
		pages.push(text);
	}
	return pages.join("\n");
};

