import {
	LandingPage,
	QuotePage,
	ClaimPage,
	HowToInstructionsPage,
	RequestClaimFormPage,
	AdminPage,
} from "./pages";
import { Route, Routes } from "react-router-dom";

function App() {
	return (
		<div className=" overflow-hidden">
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/quoteForm" element={<QuotePage />} />
				<Route path="/claim" element={<ClaimPage />} />
				<Route path="/howToInstructions" element={<HowToInstructionsPage />} />
				<Route path="/requestClaim" element={<RequestClaimFormPage />} />
				<Route path="/admin" element={<AdminPage />} />
			</Routes>
		</div>
	);
}

export default App;
