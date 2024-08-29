import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { approveClaim } from "../../backendConnectors/dogSurkshaConnector";
const RequestedClaimDataCard = ({ policy }) => {
	function formatIndianDateTime(dateTimeString) {
		const dateAndTime = new Date(dateTimeString);

		const formattedDate = dateAndTime.toLocaleDateString("en-IN", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});

		const formattedTime = dateAndTime.toLocaleTimeString("en-IN", {
			hour: "2-digit",
			minute: "2-digit",
		});

		const formattedDateAndTime = `${formattedDate}, ${formattedTime}`;

		return formattedDateAndTime;
	}

	const handleApprove = async (policyId) => {
		const tx = await approveClaim(policyId);
		if (tx.success) {
			alert(tx.msg);
		} else {
			console.log(tx.msg);
		}
	};

	return (
		<div className="container space-y-3 mx-auto p-4 text-center border-2 border-solid border-neutral-900">
			{/* Policy ID */}
			<div className="border-2 space-y-2  border-solid border-neutral-900 p-4 rounded-lg whitespace-normal overflow-auto">
				<p className="text-lg text-gray-800">
					<span className="font-bold ">Policy ID:</span> {policy.policyId}
				</p>
				<p>
					<span className="font-bold text-gray-800">Approval Status: </span>
					{policy.isAdminApproved ? "YES" : "NO"}
				</p>
			</div>

			{/* Claim Details */}
			<div className="border-2 border-solid border-neutral-900 p-4 rounded-lg mt-4">
				<h1 className="text-xl font-bold mb-4 text-gray-800">Claim Details</h1>
				<div className="space-y-2">
					<p>
						<span className="font-bold text-gray-800">Date and Time: </span>
						{formatIndianDateTime(policy.claimDetails[0])}
					</p>
					<p>
						<span className="font-bold text-gray-800">Location: </span>
						{policy.claimDetails[1]}
					</p>
					<p>
						<span className="font-bold text-gray-800">Accident: </span>
						{policy.claimDetails[3] ? "YES" : "NO"}
					</p>
					<p>
						<span className="font-bold text-gray-800">Description: </span>
						{policy.claimDetails[2]}
					</p>
					<p>
						<span className="font-bold text-gray-800">
							Other Parties Involved:{" "}
						</span>
						{policy.claimDetails[4].map((item, index) => (
							<span key={index}>
								{item}
								{index !== policy.claimDetails[4].length - 1 ? ", " : ""}
							</span>
						))}
					</p>
				</div>
			</div>

			{/* Veterinary Info */}
			<div className="border-2 border-solid border-neutral-900 p-4 rounded-lg mt-4">
				<h1 className="text-xl font-bold mb-4 text-gray-800">
					Veterinary Details
				</h1>
				<div className="space-y-2">
					<p>
						<span className="font-bold text-gray-800">Veterinarian Name: </span>
						{policy.veterinaryInfo[0]}
					</p>
					<p>
						<span className="font-bold text-gray-800">Contact Details: </span>
						{policy.claimDetails[1]}
					</p>
					<p>
						<span className="font-bold text-gray-800">
							Clinic or Hospital Name:{" "}
						</span>
						{policy.veterinaryInfo[2]}
					</p>
					<p>
						<span className="font-bold text-gray-800">Visit Dates: </span>
						{policy.veterinaryInfo[3].map((dateString, index) => {
							const dateObj = new Date(dateString);
							const formattedDate = dateObj.toLocaleDateString("en-IN", {
								day: "2-digit",
								month: "2-digit",
								year: "numeric",
							});
							return (
								<span key={index}>
									{formattedDate}
									{index !== policy.veterinaryInfo[3].length - 1 ? ", " : ""}
								</span>
							);
						})}
					</p>
					<p>
						<span className="font-bold text-gray-800">Diagnosis: </span>
						{policy.veterinaryInfo[4]}
					</p>
					<p>
						<span className="font-bold text-gray-800">
							Treatment Provided:{" "}
						</span>
						{policy.veterinaryInfo[5]}
					</p>
				</div>
			</div>

			{/* Claim Amount */}
			<div className="border-2 border-solid border-neutral-900 p-4 rounded-lg mt-4">
				<h1 className="text-xl font-bold mb-4 text-gray-800">Claim Amount</h1>
				<div className="space-y-2">
					<p>
						<span className="font-bold text-gray-800">Total Amount: </span>
						{policy.claimAmount[0].toString()}
					</p>
					<p>
						<span className="font-bold text-gray-800">
							Breakdown of Expenses:{" "}
						</span>
						{policy.claimAmount[1]}
					</p>
				</div>
			</div>

			{/* Supporting Docs */}
			<div className="border-2 border-solid border-neutral-900 p-4 rounded-lg mt-4">
				<h1 className="text-xl font-bold mb-4 text-gray-800">
					Supporting Documents
				</h1>
				<div>
					<p>
						<Link
							to={policy.ipfsFiles}
							target="_blank"
							className="text-blue-600"
						>
							Click here to view the supporting document
						</Link>
					</p>
				</div>
			</div>

			<button
				type="submit"
				onClick={() => handleApprove(policy.policyId)}
				className="text-white sm:text-2xl text-base font-semibold p-3 mt-2 rounded shadow bg-gradient-to-l  from-black to-purple-800 sm:py-2"
			>
				SUBMIT
			</button>
		</div>
	);
};

export default RequestedClaimDataCard;
