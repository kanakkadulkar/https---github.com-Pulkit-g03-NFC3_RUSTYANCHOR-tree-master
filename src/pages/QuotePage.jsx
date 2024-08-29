import { QuoteForm, Header, Footer } from "../components";

const QuotePage = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<div className="flex-grow">
				<QuoteForm />
			</div>
			<Footer />
		</div>
	);
};

export default QuotePage;
