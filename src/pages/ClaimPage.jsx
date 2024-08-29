import { Header, Claim, Footer } from "../components";

const ClaimPage = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<div className="flex-grow">
				<Claim />
			</div>
			<Footer />
		</div>
	);
};

export default ClaimPage;
