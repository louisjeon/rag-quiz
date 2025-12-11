import { forwardRef } from "react";

type Props = {
	onChange: () => void;
};

export const FilePicker = forwardRef<HTMLInputElement, Props>(
	({ onChange }, ref) => (
		<label className="file-picker">
			<span>📂 PDF 또는 PPTX 강의자료들을 선택해주세요</span>
			<input
				name="fileInput"
				type="file"
				accept=".pdf,.pptx"
				ref={ref}
				onChange={onChange}
				multiple
				style={{ display: "none" }}
			/>
		</label>
	)
);

FilePicker.displayName = "FilePicker";
