const { ethers } = require("ethers");
const { requestAccount } = require("./commonConnectors");
const contracts = require("../../constants/contracts.json");
const claimdogSurakshaContractAddr = contracts.ClaimdogSuraksha[1];
const claimdogSurakshaContractAbi = contracts.ClaimdogSuraksha[0];

export const requestClaimPolicy = async (
	policyId,
	claimDetails,
	veterinaryInfo,
	cid,
	claimAmount
) => {
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			console.log({ signer });

			console.log("Poilcy id : ", policyId);
			console.log("claim detatils : ", claimDetails);
			console.log("veternary info : ", veterinaryInfo);
			console.log("cid : ", cid);
			console.log("claim amount : ", claimAmount);

			const contract = new ethers.Contract(
				claimdogSurakshaContractAddr,
				claimdogSurakshaContractAbi,
				signer
			);

			const tx = await contract.requestClaimPolicy(
				policyId,
				claimDetails,
				veterinaryInfo,
				cid,
				claimAmount
			);

			await tx.wait();

			// const { args } = txRec.events.find(
			// 	(event) => event.event === "ClaimRequested"
			// );

			return {
				success: true,
				msg: "Claim policy request has been successfully submitted. Please await administrative approval for further processing.",
			};
		} else {
			return {
				success: false,
				msg: "Please connect your wallet!",
			};
		}
	} catch (error) {
		return {
			success: false,
			msg: error.message,
		};
	}
};

export const getActivePoliciesForClaim = async () => {
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();

			const contract = new ethers.Contract(
				claimdogSurakshaContractAddr,
				claimdogSurakshaContractAbi,
				signer
			);

			const policyIds = await contract.getActivePoliciesForClaim();

			// console.log(policyIds);
			return {
				success: true,
				activePolicyIdsForClaim: policyIds,
			};
		} else {
			return {
				success: false,
				msg: "Please connect your wallet!",
			};
		}
	} catch (error) {
		return {
			success: false,
			msg: error.message,
		};
	}
};
export const getRequestedPolicyIdData = async (policyId) => {
	try {
		if (typeof window.ethereum !== "undefined") {
			await window.ethereum.request({ method: "eth_requestAccounts" });
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				claimdogSurakshaContractAddr,
				claimdogSurakshaContractAbi,
				signer
			);

			const policyData = await contract.getRequestedPolicyIdData(policyId);

			return {
				success: true,
				policyId: policyId,
				data: policyData,
			};
		} else {
			return {
				success: false,
				msg: "Please connect your wallet!",
			};
		}
	} catch (error) {
		return {
			success: false,
			msg: error.message,
		};
	}
};
