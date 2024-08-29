import { RequestClaimForm, Header, Footer } from "../components";
import { useLocation } from "react-router-dom";

const RequestClaimFormPage = () => {
	let { state } = useLocation();
	console.log("dekho dekho : ", state.policyId);
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<div className="flex-grow">
				{/* Pass the policyID as a prop to the RequestClaimForm component */}
				<RequestClaimForm policyId={state.policyId} />
			</div>
			<Footer />
		</div>
	);
};

export default RequestClaimFormPage;
