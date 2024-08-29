import { useState, useEffect } from "react";

import { getActivePoliciyOf, getPolicy } from "../../backendConnectors";
import { Web3Storage } from "web3.storage";
import ClaimDataCard from "./ClaimDataCard";

const token = process.env.REACT_APP_WEB3_TOKEN;

const Claim = () => {
	const [activePolicies, setactivePolicies] = useState([]);
	const [policyData, setPolicyData] = useState([]);
	const [account, setAccount] = useState(null);
	const [policyDetailsFetching, setPolicyDetailsFetching] = useState(false);

	// whenever account changes fetch the new policy ids
	useEffect(() => {
		const fetchData = async () => {
			setPolicyDetailsFetching(true);
			const result = await getActivePoliciyOf();

			if (result.success) {
				setactivePolicies(result.policyIds);
			}

			setPolicyDetailsFetching(false);
		};

		fetchData();
	}, [account]);

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

	useEffect(() => {
		const fetchPolicyData = async () => {
			let updatedPolicyData = [];

			for (const policyId of activePolicies) {
				const data = await getPolicy(policyId);

				if (data.success) {
					const ipfsHash = data.data[8];

					const client = new Web3Storage({ token: token });
					const cid = ipfsHash.replace("ipfs://", "");
					const response = await client.get(cid);

					if (!response.ok) {
						console.error(`Error fetching image for Policy ID: ${policyId}`);
						continue; // Skip this policy and move to the next one
					}

					const files = await response.files();
					const image = URL.createObjectURL(files[0]);

					const policyData = {
						policyId: policyId,
						owner: data.data[0],
						premium: data.data[1].toString(),
						payout: data.data[2].toString(),
						startDate: data.data[3].toString(),
						endDate: data.data[4].toString(),
						claimed: data.data[5],
						claimRequested: data.data[6],

						breed: data.data[9].breed,
						ageInMonths: data.data[9].ageInMonths.toString(),
						region: data.data[9].region,
						healthCondition: data.data[9].healthCondition,
						policyType: data.data[7],
						ipfsHash: image,
					};

					updatedPolicyData.push(policyData);
				}
			}

			setPolicyData(updatedPolicyData);
		};

		fetchPolicyData();
	}, [activePolicies]);

	return (
		<section className="container mx-auto  py-8">
			<div className="flex justify-center">
				<div className="flex flex-col space-y-9 bg-white ">
					<div className="flex justify-evenly">
						<h2 className="text-3xl self-center font-bold text-center mt-4">
							Active Policies
						</h2>

						{/* {policyData.length > 0 && !policyDetailsFetching && (
							<button className="self-center uppercase text-center text-white sm:text-2xl text-base font-semibold p-3 mt-2 rounded shadow bg-gradient-to-l  from-black to-purple-800 sm:py-2">
								<Link to="/requestClaim" className="text-white uppercase">
									Request Claim
								</Link>
							</button>
						)} */}
					</div>
					{policyData.length > 0 && !policyDetailsFetching ? (
						<div className="grid grid-cols-2 gap-4 p-4 uppercase">
							{policyData.map((policy) => (
								<ClaimDataCard key={policy.policyId} policy={policy} />
							))}
						</div>
					) : (
						<div>
							{policyData.length === 0 && !policyDetailsFetching && (
								<p className="text-center text-xl font-semibold text-black p-4">
									No active policies found.
								</p>
							)}

							{policyDetailsFetching && (
								<div className="text-xl font-semibold text-black">
									Fetching policy details... Please wait a moment.
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default Claim;
