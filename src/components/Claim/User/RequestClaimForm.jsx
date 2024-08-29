import { useState } from "react";
import { Web3Storage } from "web3.storage";
import { useLocation } from "react-router-dom";

import { requestClaimPolicy } from "../../backendConnectors/claimdogSurakshaConnector";
const token = process.env.REACT_APP_WEB3_TOKEN;

const RequestClaimForm = ({ policyId }) => {
	// ifps
	const [files, setFiles] = useState([]);
	const [cid, setCid] = useState("");
	const [isUploading, setIsUploading] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	//
	// const [policyId, setPolicyId] = useState("");
	const [claimDetails, setClaimDetails] = useState({
		dateAndTime: "",
		location: "",
		description: "",
		isAccident: false,
		otherPartiesInvolved: [],
	});
	const [veterinaryInfo, setVeterinaryInfo] = useState({
		veterinarianName: "",
		contactDetails: "",
		clinicOrHospitalName: "",
		visitDates: [],
		diagnosis: "",
		treatmentProvided: "",
	});

	const [claimAmount, setClaimAmount] = useState({
		totalAmount: 0,
		breakdownOfExpenses: "",
	});

	const handleSumbit = async (event) => {
		event.preventDefault();

		const client = new Web3Storage({ token });

		try {
			setSubmitting(true);
			setIsUploading(true);
			const cid = await client.put(files);
			setIsUploading(false);
			console.log("cid: ", cid);

			setCid(cid); // Set the obtained CID in the state

			// Use the obtained CID in the requestClaimPolicy function
			const result = await requestClaimPolicy(
				policyId,
				claimDetails,
				veterinaryInfo,
				cid,
				claimAmount
			);

			if (result.success) {
				alert(result.msg);
			} else {
				console.log(result.msg);
			}

			setSubmitting(false);

			setCid(""); // Reset CID after submission
		} catch (error) {
			console.error("Error submitting files:", error);
			setIsUploading(false);
		}
	};

	const handleVisitDateChange = (index, value) => {
		const updatedVisitDates = [...veterinaryInfo.visitDates];
		updatedVisitDates[index] = value;
		setVeterinaryInfo({ ...veterinaryInfo, visitDates: updatedVisitDates });
	};

	const addVisitDateField = () => {
		setVeterinaryInfo({
			...veterinaryInfo,
			visitDates: [...veterinaryInfo.visitDates, ""],
		});
	};

	return (
		<div className=" flex items-center flex-col space-y-5  bg-white p-6 rounded-lg shadow-md border border-gray-200">
			<h1 className=" text-3xl font-bold">Claim Policy Request Form</h1>
			{/* <div className="flex flex-col space-y-2 justify-center w-1/2">
				<label
					htmlFor="policyId"
					className="font-semibold sm:text-lg font-spaceGrotesk"
				>
					Policy ID:{" "}
				</label>
				<input
					type="text"
					id="policyId"
					className="bg-[#1A0142] text-white border border-solid border-[#B1B1B1] rounded-lg sm:text-lg px-2 py-1 "
					value={policyId}
					onChange={(e) => setPolicyId(e.target.value)}
					required
				/>
			</div> */}

			<form
				onSubmit={(event) => {
					handleSumbit(event); // Handle file submission here
				}}
				className="  w-4/5 mx-auto"
			>
				<div className="grid grid-cols-8 gap-6">
					{/* claim details */}
					<div className="col-span-4 border-2 p-4 ">
						<h2 className="text-center text-2xl font-bold py-4">
							Claim Details
						</h2>

						<div className="grid grid-cols-3 gap-3">
							{/* Date and Time */}
							<div className="flex flex-col space-y-2 justify-center">
								<label
									htmlFor="dateAndTime"
									className="font-semibold sm:text-lg font-spaceGrotesk"
								>
									Date and Time:
								</label>
								<input
									type="datetime-local"
									id="dateAndTime"
									className="bg-[#1A0142] text-white border border-solid border-[#B1B1B1] rounded-lg sm:text-lg p-2 "
									value={claimDetails.dateAndTime}
									onChange={(event) =>
										setClaimDetails({
											...claimDetails,
											dateAndTime: event.target.value,
										})
									}
									required
								/>
							</div>

							{/* Location */}
							<div className="   flex flex-col space-y-2 justify-center">
								<label
									htmlFor="location"
									className="font-semibold sm:text-lg font-spaceGrotesk"
								>
									Location:
								</label>
								<input
									type="text"
									id="location"
									className="bg-[#1A0142] text-white border border-solid border-[#B1B1B1] rounded-lg sm:text-lg p-2 "
									value={claimDetails.location}
									onChange={(event) =>
										setClaimDetails({
											...claimDetails,
											location: event.target.value,
										})
									}
									required
								/>
							</div>

							{/* Is Accident */}
							<div className="flex space-x-2 justify-center items-center">
								<label
									htmlFor="isAccident"
									className="font-semibold sm:text-lg font-spaceGrotesk"
								>
									Is Accident:
								</label>
								<input
									type="checkbox"
									id="isAccident"
									className="form-checkbox h-6 w-6 text-purple-500"
									checked={claimDetails.isAccident}
									onChange={(event) =>
										setClaimDetails({
											...claimDetails,
											isAccident: event.target.checked,
										})
									}
								/>
							</div>
						</div>

						{/* Description */}
						<div className="col-span-full flex flex-col space-y-2 justify-center">
							<label
								htmlFor="description"
								className="font-semibold sm:text-lg font-spaceGrotesk"
							>
								Description:
							</label>
							<textarea
								id="description"
								className="bg-[#1A0142] text-white border border-solid border-[#B1B1B1] rounded-lg sm:text-lg p-2 "
								value={claimDetails.description}
								onChange={(event) =>
									setClaimDetails({
										...claimDetails,
										description: event.target.value,
									})
								}
								required
							></textarea>
						</div>

						{/* Other Parties Involved */}
						<div className="col-span-full flex flex-col space-y-2 justify-center">
							<label
								htmlFor="otherPartiesInvolved"
								className="font-semibold sm:text-lg font-spaceGrotesk"
							>
								Other Parties Involved:
							</label>
							<input
								type="text"
								id="otherPartiesInvolved"
								className="bg-[#1A0142] text-white border border-solid border-[#B1B1B1] rounded-lg sm:text-lg p-2 "
								value={claimDetails.otherPartiesInvolved.join(", ")}
								onChange={(event) =>
									setClaimDetails({
										...claimDetails,
										otherPartiesInvolved: event.target.value.split(", "),
									})
								}
							/>
						</div>
					</div>

					{/* veterinary info */}
					<div className="col-span-4 border-2 p-2  space-y-2">
						<h2 className="text-center text-2xl font-bold">
							Veterinary Details
						</h2>

						<div className=" grid grid-cols-3 gap-3">
							<div className="flex flex-col space-y-2 justify-center">
								<label
									htmlFor="veterinarianName"
									className="font-semibold sm:text-lg font-spaceGrotesk"
								>
									Veterinarian Name:
								</label>
								<input
									type="text"
									id="veterinarianName"
									className="bg-[#1A0142] text-white border border-solid border-[#B1B1B1] rounded-lg sm:text-lg p-2 "
									value={veterinaryInfo.veterinarianName}
									onChange={(event) =>
										setVeterinaryInfo({
											...veterinaryInfo,
											veterinarianName: event.target.value,
										})
									}
									required
								/>
							</div>

							{/* Contact Details */}
							<div className=" flex flex-col  space-y-2 justify-center">
								<label
									htmlFor="contactDetails"
									className="font-semibold sm:text-lg font-spaceGrotesk"
								>
									Contact Details:
								</label>
								<input
									type="text"
									id="contactDetails"
									className="bg-[#1A0142] text-white border border-solid border-[#B1B1B1] rounded-lg sm:text-lg p-2"
									value={veterinaryInfo.contactDetails}
									onChange={(event) =>
										setVeterinaryInfo({
											...veterinaryInfo,
											contactDetails: event.target.value,
										})
									}
									required
								/>
							</div>

							{/* Clinic or Hospital Name */}
							<div className=" flex flex-col space-y-2 justify-center">
								<label
									htmlFor="clinicOrHospitalName"
									className="font-semibold sm:text-lg font-spaceGrotesk"
								>
									Clinic or Hospital Name:
								</label>
								<input
									type="text"
									id="clinicOrHospitalName"
									className="bg-[#1A0142] text-white border border-solid border-[#B1B1B1] rounded-lg sm:text-lg p-2 "
									value={veterinaryInfo.clinicOrHospitalName}
									onChange={(event) =>
										setVeterinaryInfo({
											...veterinaryInfo,
											clinicOrHospitalName: event.target.value,
										})
									}
									required
								/>
							</div>
						</div>

						{/* Visit Dates (multiple input fields) */}
						<div className="flex flex-col space-y-2 justify-center">
							<label
								htmlFor="visitDates"
								className="font-semibold sm:text-lg font-spaceGrotesk"
							>
								Visit Dates:
							</label>
							<div className="grid grid-cols-4 gap-2">
								{veterinaryInfo.visitDates.map((visitDate, index) => (
									<input
										key={index}
										type="date"
										className="bg-[#1A0142]  text-white border border-solid border-[#B1B1B1] rounded-lg sm:text-lg p-2 "
										value={visitDate}
										onChange={(event) =>
											handleVisitDateChange(index, event.target.value)
										}
										required
									/>
								))}
								<button
									type="button"
									onClick={addVisitDateField}
									className="text-white sm:text-lg text-base font-semibold p-2 mt-2 rounded shadow bg-gradient-to-l from-black to-purple-800 sm:py-2 "
								>
									Add Visit Date
								</button>
							</div>
						</div>

						{/* Diagnosis */}
						<div className=" grid grid-cols-4 gap-3">
							{/* Diagnosis */}
							<div className=" col-span-2 flex flex-col space-y-2 justify-center">
								<label
									htmlFor="diagnosis"
									className="font-semibold sm:text-lg font-spaceGrotesk"
								>
									Diagnosis:
								</label>
								<textarea
									id="diagnosis"
									className="bg-[#1A0142] text-white border border-solid border-[#B1B1B1] rounded-lg sm:text-lg p-2 "
									value={veterinaryInfo.diagnosis}
									onChange={(event) =>
										setVeterinaryInfo({
											...veterinaryInfo,
											diagnosis: event.target.value,
										})
									}
									required
								></textarea>
							</div>

							{/* Treatment Provided */}
							<div className=" col-span-2 flex flex-col space-y-2 justify-center">
								<label
									htmlFor="treatmentProvided"
									className="font-semibold sm:text-lg font-spaceGrotesk"
								>
									Treatment Provided:
								</label>
								<textarea
									id="treatmentProvided"
									className="bg-[#1A0142] text-white border border-solid border-[#B1B1B1] rounded-lg sm:text-lg p-2"
									value={veterinaryInfo.treatmentProvided}
									onChange={(event) =>
										setVeterinaryInfo({
											...veterinaryInfo,
											treatmentProvided: event.target.value,
										})
									}
									required
								></textarea>
							</div>
						</div>
					</div>

					{/* supporting docs */}
					{/* File Upload */}
					<div className="col-span-4 border-2 p-2">
						<h2 className="text-center text-2xl font-bold py-4">
							Supporting Documents
						</h2>
						<div className="flex flex-col items-center justify-center space-y-2">
							<label
								htmlFor="filepicker"
								className="font-semibold sm:text-lg font-spaceGrotesk"
							>
								Pick supporting images or PDFs for claim.
							</label>
							<input
								type="file"
								id="filepicker"
								name="fileList"
								className="sm:text-lg cursor-pointer"
								onChange={(e) => setFiles(e.target.files)}
								multiple
								accept="image/jpeg, image/png, image/gif, application/pdf"
								required
							/>

							{/* <div className=" ">
								<button
									type="submit"
									disabled={isUploading}
									className="text-white sm:text-2xl text-base font-semibold p-3 mt-2 rounded shadow bg-gradient-to-l from-black to-purple-800 sm:py-2 "
								>
									{isUploading ? "UPLOADING..." : "UPLOAD"}
								</button>
							</div> */}
						</div>
					</div>

					{/* Claim amount */}
					<div className="col-span-4 border-2 p-2">
						<h2 className="text-center text-2xl font-bold py-4">
							Claim Amount
						</h2>

						<div className=" grid  grid-cols-4 gap-3">
							{/* Total Amount */}
							<div className="col-span-2 flex flex-col space-y-2 justify-center">
								<label
									htmlFor="totalAmount"
									className="font-semibold sm:text-lg font-spaceGrotesk"
								>
									Total Amount:
								</label>
								<input
									type="number"
									id="totalAmount"
									className="bg-[#1A0142] text-white border border-solid border-[#B1B1B1] rounded-lg sm:text-lg p-2 l"
									value={claimAmount.totalAmount}
									onChange={(event) =>
										setClaimAmount({
											...claimAmount,
											totalAmount: event.target.value,
										})
									}
									required
								/>
							</div>

							{/* Breakdown of Expenses */}
							<div className="col-span-2 flex flex-col space-y-2 justify-center">
								<label
									htmlFor="breakdownOfExpenses"
									className="font-semibold sm:text-lg font-spaceGrotesk"
								>
									Breakdown of Expenses:
								</label>
								<input
									type="text"
									id="breakdownOfExpenses"
									className="bg-[#1A0142] text-white border border-solid border-[#B1B1B1] rounded-lg sm:text-lg p-2 "
									value={claimAmount.breakdownOfExpenses}
									onChange={(event) =>
										setClaimAmount({
											...claimAmount,
											breakdownOfExpenses: event.target.value,
										})
									}
									required
								/>
							</div>
						</div>
					</div>

					<div className=" col-span-2  col-start-4">
						<button
							type="submit"
							className="text-white uppercase sm:text-2xl text-base font-semibold p-3 mt-2 rounded shadow bg-gradient-to-l  from-black to-purple-800 sm:py-2 sm:w-full"
						>
							{submitting ? "submitting" : "submit"}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default RequestClaimForm;
