import { Header, Hero, Footer } from "../components";
const LandingPage = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<div className="flex-grow">
				<Hero />
			</div>

			<Footer />
		</div>
	);
};

export default LandingPage;
