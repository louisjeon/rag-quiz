import "./App.css";
import { FileInputForm } from "./components/FileInputForm";

function App() {
	return (
		<div className="page">
			<header className="hero">
				<div className="badge">AI Quiz Generator</div>
				<h1 className="title">강의자료로 퀴즈 만들기</h1>
				<p className="subtitle">
					PDF / PPTX 자료를 업로드하면 Gemini가 5개의 퀴즈를
					만들어줘요.
				</p>
			</header>
			<main className="panel">
				<FileInputForm />
			</main>
			<div className="footer">
				모든 내용은 로컬에서 처리 후 Gemini로 전송돼요.
			</div>
		</div>
	);
}

export default App;
