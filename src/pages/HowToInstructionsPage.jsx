import { Header, HowToInstructions, Footer } from "../components";
const HowToInstructionsPage = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<div className="flex-grow">
				<HowToInstructions />
			</div>
			<Footer />
		</div>
	);
};

export default HowToInstructionsPage;
