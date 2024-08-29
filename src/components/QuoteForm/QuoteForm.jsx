import React, { useState, useEffect } from "react";
import { calculatePremium, addPolicy } from "../backendConnectors";
import { getWalletBal } from "../backendConnectors/usdcConnector";
import { Web3Storage } from "web3.storage";

const token = process.env.REACT_APP_WEB3_TOKEN;

const QuoteForm = () => {
	const [breed, setBreed] = useState("");
	const [age, setAge] = useState("");
	const [region, setRegion] = useState("");
	const [healthCondition, setHealthCondition] = useState("");
	const [policyType, setPolicyType] = useState("");
	const [showPolicyPrice, setShowPolicyPrice] = useState(false);
	const [premium, setPremium] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [policyId, setPolicyId] = useState("");
	const [petDetails, setPetDetails] = useState({
		breed: "",
		age: "",
		region: "",
		healthCondition: "",
		policyType: "",
		ipfsHash: "",
	});
	const [account, setAccount] = useState(null);
	const [userBal, setUserBal] = useState(0);

	// ifps
	const [files, setFiles] = useState([]);
	const [cid, setCid] = useState("");

	const handleQuoteSubmit = async (event) => {
		event.preventDefault();

		const petDetailsData = {
			breed: breed,
			age: age,
			region: region,
			healthCondition: healthCondition,
			policyType: policyType,
			ipfsHash: cid,
		};

		const data = await calculatePremium(petDetailsData);

		if (data.success) {
			setPremium(data.data);
			// Show the policy price
			setShowPolicyPrice(true);
		} else {
			setShowPolicyPrice(false);
		}

		// Reset form values
		setBreed("");
		setAge("");
		setRegion("");
		setHealthCondition("");
		setPolicyType("");
		setCid("");

		// Set petDetails state using the existing state variable
		setPetDetails((petDetails) => ({
			...petDetails,
			...petDetailsData,
		}));
	};

	const handleFileSubmit = async (event) => {
		event.preventDefault();

		const client = new Web3Storage({ token });

		try {
			setIsUploading(true);
			const cid = await client.put(files);
			setIsUploading(false);
			console.log("cid: ", cid);

			setCid(cid);

			setPetDetails((prevPetDetails) => ({
				...prevPetDetails,
				ipfsHash: cid,
			}));

			// File submission was successful, handle the result as needed
		} catch (error) {
			console.error("Error submitting files:", error);
			setIsUploading(false);
		}
	};

	const handleAddPolicy = async () => {
		setIsLoading(true);
		setErrorMsg("");

		console.log("petDetails : ", petDetails);

		const policyResult = await addPolicy(petDetails);
		setIsLoading(false);

		if (policyResult.success) {
			setPolicyId(policyResult.policyId);
		} else {
			setErrorMsg(policyResult.msg);
		}
	};

	const handleCopyBatchId = () => {
		navigator.clipboard.writeText(policyId);
		alert("Batch ID copied to clipboard!");
	};

	const getAbbreviatedPolicyId = (policyId) => {
		if (policyId) {
			return `${policyId.substring(0, 5)}...${policyId.substring(
				policyId.length - 5
			)}`;
		}
		return policyId;
	};

	// whenever account changes fetch the new policy ids
	useEffect(() => {
		const fetchBal = async () => {
			const result = await getWalletBal();

			if (result.success) {
				setUserBal(result.balance);
			}
		};

		fetchBal();
	}, [account, policyId]);

	// set event listner to listen for accounts change and whenever componets unmount remove the listner
	useEffect(() => {
		const handleAccountsChanged = (accounts) => {
			setAccount(accounts[0]);
		};

		window.ethereum.on("accountsChanged", handleAccountsChanged);

		return () => {
			window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
		};
	}, []);

	return (
		<section className="flex justify-center items-center w-6/7 mx-auto space-x-9 relative">
			<div className="flex flex-col flex-wrap sm:space-y-7  w-1/4  font-GeneralSans p-4 my-4 border-2 border-gradient border-black rounded-lg">
				<p className="text-center sm:text-4xl  text-2xl font-bold py-4">
					Tell us about your pet.
				</p>
				<form onSubmit={handleQuoteSubmit}>
					<div className="grid sm:grid-cols-4 sm:gap-6 gap-3">
						{/* Breed */}
						<div className="col-span-full flex flex-col space-y-2 justify-center">
							<label
								htmlFor="breed"
								className="font-semibold sm:text-xl font-spaceGrotesk"
							>
								Breed of your pet:
							</label>
							<select
								id="breed"
								className="bg-[#1A0142] text-white uppercase border border-solid border-[#B1B1B1] rounded-lg sm:text-lg sm:p-4 p-2 sm:w-full"
								value={breed}
								onChange={(event) => setBreed(event.target.value)}
							>
								<option value="">Select a breed</option>
								<option value="Labrador Retriever">Labrador Retriever</option>
								<option value="German Shepherd">German Shepherd</option>
								<option value="Golden Retriever">Golden Retriever</option>
								<option value="OTHERS">OTHERS</option>
							</select>
						</div>

						{/* Age in months */}
						<div className="col-span-full flex flex-col space-y-2  justify-center">
							<label
								htmlFor="age"
								className="font-semibold sm:text-xl font-spaceGrotesk"
							>
								Age of your pet:
							</label>
							<input
								id="age"
								type="text"
								pattern="\d*"
								onInput={(event) => {
									event.target.value = event.target.value.replace(/\D/g, "");
								}}
								className="bg-[#1A0142] text-white border border-solid border-[#B1B1B1] rounded-lg sm:text-lg sm:p-4 p-2 sm:w-full"
								placeholder="Age in months"
								value={age}
								onChange={(event) => setAge(event.target.value)}
							></input>
						</div>

						{/* Region */}
						<div className="col-span-full flex flex-col space-y-2 justify-center">
							<label
								htmlFor="region"
								className="font-semibold sm:text-xl font-spaceGrotesk"
							>
								Region where your pet resides:
							</label>
							<select
								id="region"
								className="bg-[#1A0142] text-white  uppercase border border-solid border-[#B1B1B1] rounded-lg sm:text-lg sm:p-4 p-2 sm:w-full"
								value={region}
								onChange={(event) => setRegion(event.target.value)}
							>
								<option value="">Select a region</option>
								<option value="North">North</option>
								<option value="South">South</option>
								<option value="East">East</option>
								<option value="West">West</option>
								<option value="OTHERS">OTHERS</option>
							</select>
						</div>

						{/* Health condition */}
						<div className="col-span-full flex flex-col space-y-2 justify-center">
							<label
								htmlFor="health"
								className="font-semibold sm:text-xl font-spaceGrotesk"
							>
								Health condition of your pet:
							</label>
							<select
								id="health"
								className="bg-[#1A0142] text-white  uppercase border border-solid border-[#B1B1B1] rounded-lg sm:text-lg sm:p-4 p-2 sm:w-full"
								value={healthCondition}
								onChange={(event) => setHealthCondition(event.target.value)}
							>
								<option value="">Select health condition</option>
								<option value="Mild">Mild</option>
								<option value="Moderate">Moderate</option>
								<option value="Severe">Severe</option>
								<option value="OTHERS">OTHERS</option>
							</select>
						</div>

						{/* Type of policy */}
						<div className="col-span-full flex flex-col space-y-2 justify-center">
							<label
								htmlFor="policyType"
								className="font-semibold sm:text-xl font-spaceGrotesk"
							>
								Type of insurance policy desired:
							</label>
							<select
								id="policyType"
								className="bg-[#1A0142] text-white  uppercase border border-solid border-[#B1B1B1] rounded-lg sm:text-lg sm:p-4 p-2 sm:w-full"
								value={policyType}
								onChange={(event) => setPolicyType(event.target.value)}
							>
								<option value="">Select policy type</option>
								<option value="Basic">Basic</option>
								<option value="Premium">Premium</option>
								<option value="OTHERS">OTHERS</option>
							</select>
						</div>

						<div className="sm:col-start-2 sm:col-span-2 ">
							<button
								type="submit"
								className="text-white sm:text-2xl text-base font-semibold p-3 mt-2 rounded shadow bg-gradient-to-l  from-black to-purple-800 sm:py-2 sm:w-full"
							>
								SUBMIT
							</button>
						</div>
					</div>
				</form>
			</div>

			{showPolicyPrice && (
				<div className="flex flex-col justify-center items-center space-x-4 space-y-5">
					<div>
						<div className="bg-[#c5bbd4] p-4 rounded-lg flex justify-center items-center flex-col space-y-4">
							<p className="font-semibold text-2xl text-black mb-4 leading-10">
								Your Pet's Premium is{" "}
								<span className=" text-green-600">${premium}</span>.
							</p>

							<div className=" font-semibold w-6/7 bg-gradient-to-r from-indigo-200 from-10% via-sky-200	 via-30% to-emerald-500 to-90% px-2 py-4">
								<form
									id="upload-form"
									className="flex flex-col space-y-2"
									onSubmit={handleFileSubmit}
								>
									<label htmlFor="filepicker" className="text-black sm:text-xl">
										Pick images of your pet dog to store
									</label>
									<input
										type="file"
										id="filepicker"
										name="fileList"
										className="sm:text-lg cursor-pointer"
										onChange={(e) => setFiles(e.target.files)}
										multiple
										accept="image/jpeg, image/png, image/gif" // Only accept image files
										required
									/>

									<div className="w-1/2 self-center">
										<button
											type="submit"
											disabled={isUploading}
											className="text-white sm:text-2xl text-base font-semibold p-3 mt-2 rounded shadow bg-gradient-to-l from-black to-purple-800 sm:py-2 sm:w-full"
										>
											{isUploading ? "UPLOADING..." : "UPLOAD"}
										</button>
									</div>
								</form>
							</div>
							{cid !== "" && (
								<button
									onClick={handleAddPolicy}
									disabled={isLoading}
									className="uppercase text-white sm:text-2xl text-base font-semibold p-3 mt-2 rounded shadow bg-gradient-to-l from-black to-purple-800 sm:py-2"
								>
									{isLoading ? "Adding Policy..." : "Add Policy"}
								</button>
							)}

							{policyId && (
								<div className="flex gap-4 self-center items-center justify-center mt-4 px-4 py-2">
									<span className="text-black-500 text-lg font-semibold">
										POLICY ID: {getAbbreviatedPolicyId(policyId)}
									</span>
									<button
										className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-lg font-medium"
										onClick={handleCopyBatchId}
									>
										Copy
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
			<div className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg absolute top-0 right-2 m-2">
				Your Balance: {userBal} USDC
			</div>
		</section>
	);
};

export default QuoteForm;
