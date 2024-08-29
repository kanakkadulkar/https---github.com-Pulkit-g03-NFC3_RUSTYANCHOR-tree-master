import { useState, useEffect } from "react";
import { Web3Storage } from "web3.storage";

import {
	getActivePoliciesForClaim,
	getRequestedPolicyIdData,
} from "../../backendConnectors";

import RequestedClaimDataCard from "./RequestedClaimDataCard";

const Admin = () => {
	const deployerAddr = process.env.REACT_APP_ADDR;

	const [activePolicies, setactivePolicies] = useState([]);
	const [policyData, setPolicyData] = useState([]);
	const [account, setAccount] = useState(null);
	const [policyDetailsFetching, setPolicyDetailsFetching] = useState(false);
	const [isDeployer, setIsDeployer] = useState(false);

	// whenever account changes fetch the new policy ids
	useEffect(() => {
		const fetchData = async () => {
			setPolicyDetailsFetching(true);

			const result = await getActivePoliciesForClaim();

			if (result.success) {
				setactivePolicies(result.activePolicyIdsForClaim);
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
				const data = await getRequestedPolicyIdData(policyId);
				console.log("data : ", data);

				if (data.success) {
					const ipfsHash = data.data[3];
					console.log("ipfshash : ", ipfsHash);

					const documentLink = `https://dweb.link/ipfs/${ipfsHash}`;

					console.log("approve? : ", data.data[4]);
					const policyData = {
						policyId: policyId,
						claimDetails: data.data[0],
						veterinaryInfo: data.data[1],
						claimAmount: data.data[2],
						isAdminApproved: data.data[4],
						ipfsFiles: documentLink,
					};

					updatedPolicyData.push(policyData);
				}
			}

			setPolicyData(updatedPolicyData);
		};

		fetchPolicyData();
	}, [activePolicies]);

	useEffect(() => {
		// Check if the current account matches the deployer address
		setIsDeployer(
			account && account.toLowerCase() === deployerAddr.toLowerCase()
		);
	}, [account, deployerAddr]);

	return (
		<div className="relative">
			{isDeployer ? (
				<div>
					<section className="container mx-auto  py-8 ">
						<div className="flex justify-center">
							<div className="flex flex-col space-y-9 bg-white ">
								<div className="flex justify-evenly">
									<h2 className="text-3xl self-center font-bold text-center mt-4">
										Claim Details Overview
									</h2>
								</div>
								{policyData.length > 0 && !policyDetailsFetching ? (
									<div className="grid grid-cols-2 gap-4 p-4 uppercase">
										{policyData.map((policy) => (
											<RequestedClaimDataCard
												key={policy.policyId}
												policy={policy}
											/>
										))}
									</div>
								) : (
									<div>
										{policyData.length === 0 && !policyDetailsFetching && (
											<p className="text-center text-xl font-semibold text-black p-4">
												No active claim requests found.
											</p>
										)}

										{policyDetailsFetching && (
											<div className="text-xl font-semibold text-black">
												Fetching claim requests details... Please wait a moment.
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					</section>
				</div>
			) : (
				<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
					<p className="text-4xl font-bold">You are not the admin.</p>
				</div>
			)}
		</div>
	);
};

export default Admin;
