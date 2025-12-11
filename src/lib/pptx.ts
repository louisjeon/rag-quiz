import JSZip from "jszip";

export const extractPptxText = async (file: File) => {
	const zip = await JSZip.loadAsync(await file.arrayBuffer());
	const slideEntries = Object.keys(zip.files).filter(
		(name) => name.startsWith("ppt/slides/slide") && name.endsWith(".xml")
	);
	let text = "";
	for (const path of slideEntries) {
		const xml = await zip.files[path].async("text");
		const regex = /<a:t>(.*?)<\/a:t>/g;
		const tokens: string[] = [];
		let match: RegExpExecArray | null;
		while ((match = regex.exec(xml)) !== null) {
			tokens.push(match[1]);
		}
		text += tokens.join(" ") + "\n";
	}
	return text;
};

