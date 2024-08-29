import { getUsdc } from "../backendConnectors/usdcConnector";

const HowToInstructions = () => {
	const handleGetToken = async () => {
		const tx = await getUsdc();

		if (tx.success) {
			alert("1000 USDC tokens are sent successfully.");
		} else {
			console.log(tx.msg);
		}
	};
	
	return (
		<div className="flex space-x-3 w-3/4 mx-auto">
			<div className="bg-white h-fit shadow-md rounded-lg px-8 py-6 max-w-lg mx-auto mt-10">
				<h2 className="text-2xl font-bold mb-4">Get 1000 usdc token here</h2>
				<button
					onClick={handleGetToken}
					className="text-white sm:text-2xl text-base font-semibold p-3 mt-2 rounded shadow bg-gradient-to-l  from-black to-purple-800 sm:py-2 sm:w-full"
				>
					Get Token
				</button>
			</div>
			<div className="bg-white h-fit shadow-md rounded-lg px-8 py-6 max-w-lg mx-auto mt-10">
				<h2 className="text-2xl font-bold mb-4">
					How to Get a Pet Insurance Policy - Step-by-Step Guide
				</h2>
				<ol className="list-decimal ml-6 space-y-3">
					<li>
						Click on the "
						<span className="text-blue-600">Get a personalized Quote</span>"
						button on the main page or "
						<span className="text-blue-600">Get a quote</span>" on the header.
					</li>
					<li>
						You will be directed to the quote form. Fill in the required details
						about your pet dog.
					</li>
					<li>
						Click on the "<span className="text-blue-600">Submit</span>" button
						to calculate the premium based on the information provided.
					</li>
					<li>
						Next, click on "<span className="text-blue-600">Choose files</span>"
						to upload an image of your pet dog to the IPFS (InterPlanetary File
						System).
					</li>
					<li>
						After selecting the image, click on the "
						<span className="text-blue-600">Upload</span>" button to upload the
						image to the IPFS network.
					</li>
					<li>
						Once the file is uploaded successfully, an "
						<span className="text-blue-600">Add policy</span>" button will
						appear. Click on it to proceed.
					</li>
					<li>
						The first transaction will be initiated to approve the dogsuraksha
						contract for spending the premium on your behalf.
					</li>
					<li>
						The second transaction will transfer the premium amount from your
						account to the dogsurksha contract.
					</li>
					<li>
						Congratulations! The policy is now added, and you will see the
						unique Policy ID displayed below the "
						<span className="text-blue-600">Add policy</span>" button.
					</li>
				</ol>
				<p className="mt-4">
					Please make sure to keep a record of the Policy ID for future
					reference.
				</p>
			</div>
			<div className="bg-white h-fit shadow-md rounded-lg px-8 py-6 max-w-lg mx-auto mt-10">
				<h2 className="text-2xl font-bold mb-4">
					How to Claim Insurance Policy - Step-by-Step Guide
				</h2>
				<ol className="list-decimal ml-6 space-y-3">
					<li>
						Click on the "<span className="text-blue-600">Claim Policy</span>"
						on the header.
					</li>
					<li>
						If you have taken the policy, it will show you the policy details.
					</li>
					<li>
						At the end of each policy, there is a button "
						<span className="text-blue-600">Request claim</span>". Click on it.
					</li>
					<li>It will take you to the "Claim Policy Request" form.</li>
					<li>
						Fill in the claim details, such as date and time, location,
						description, whether it's an accident, and other parties involved.
					</li>
					<li>
						Provide veterinary information, including veterinarian name, contact
						details, clinic or hospital name, visit dates, diagnosis, and
						treatment provided.
					</li>
					<li>Attach any supporting documents.</li>
					<li>
						Enter the claim amount, including the total amount and a breakdown
						of expenses.
					</li>
					<li>
						Click on the "<span className="text-blue-600">Submit</span>" button
						to send the claim request.
					</li>
					<li>
						After successful submission, a prompt will be shown saying "Claim
						policy request has been successfully submitted. Please await
						administrative approval for further processing."
					</li>
					<li>
						You can go back to the "Claim Policy" page by clicking on the link
						in the header.
					</li>
					<li>
						After successful claim request, you will see "CLAIM REQUESTED: YES"
						in the policy details.
					</li>
				</ol>
				<p className="mt-4">
					Congratulations, you have requested the claim successfully! The admin
					will review the details and process the claim accordingly.
				</p>
			</div>
		</div>
	);
};

export default HowToInstructions;
