import { calculatePremium } from "./PremiumCalculatorConnector";
import {
	getAllowance,
	decreaseAllowance,
	increaseAllowance,
} from "./usdcConnector";
const { ethers, errors } = require("ethers");
const { requestAccount } = require("./commonConnectors");
const contracts = require("../../constants/contracts.json");

const dogSurkshaAddress = contracts.dogSurksha[1];
const dogSurkshaAbi = contracts.dogSurksha[0];

export const addPolicy = async ({
	breed,
	age,
	region,
	healthCondition,
	policyType,
	ipfsHash,
}) => {
	console.log("in function : ", {
		breed,
		age,
		region,
		healthCondition,
		policyType,
		ipfsHash,
	});
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();

			// dogsurksha contract
			const contract = new ethers.Contract(
				dogSurkshaAddress,
				dogSurkshaAbi,
				signer
			);

			//  const startDate = new Date();
			const startDate = new Date(Date.now() + 2 * 60 * 1000); // Set start date to 2 minutes ahead of the current time

			//  startDate.setDate(startDate.getDate() + 1); // Set start date to 1 day after current date
			const endDate = new Date(startDate);
			endDate.setFullYear(startDate.getFullYear() + 1); // Set end date to 1 year after start date
			const startTimestamp = Math.floor(startDate.getTime() / 1000);
			const endTimestamp = Math.floor(endDate.getTime() / 1000);

			const result = await calculatePremium({
				breed,
				age,
				region,
				healthCondition,
				policyType,
			});

			const premium = result.success ? result.data : null;

			if (!premium) {
				console.log(result.msg);
				return {
					success: false,
					msg: result.msg,
				};
			}

			try {
				const allowanceResult = await getAllowance(dogSurkshaAddress);

				if (allowanceResult.success) {
					const premiumBigNumber = ethers.BigNumber.from(
						premium.toString() * 10 ** 6
					);
					const allowanceBigNumber = ethers.BigNumber.from(
						allowanceResult.allowance.toString()
					);

					const remaining = premiumBigNumber.sub(allowanceBigNumber).toString();

					if (remaining > 0) {
						const increaseAllowanceRes = await increaseAllowance(
							dogSurkshaAddress,
							remaining
						);

						if (!increaseAllowanceRes.success) {
							console.log(increaseAllowanceRes.msg);
						}
					} else if (remaining < 0) {
						console.log("HI");
						const absRemaining = Math.abs(remaining);
						console.log("abs remaning : ", absRemaining);

						const decreaseAllowanceRes = await decreaseAllowance(
							dogSurkshaAddress,
							absRemaining
						);

						console.log(decreaseAllowanceRes);

						if (!decreaseAllowanceRes.success) {
							console.log(decreaseAllowanceRes.msg);
						}
					}
					console.log("premium : ", premiumBigNumber);
					console.log("allownce : ", allowanceBigNumber.toString());
					console.log("remaing : ", remaining);
				}
			} catch (error) {
				console.log(error.message);
			}

			console.log("adding policy");
			const addPolicyTx = await contract.addPolicy(
				breed,
				age,
				healthCondition,
				region,
				policyType,
				startTimestamp.toString(),
				endTimestamp.toString(),
				ipfsHash
			);

			const addPolicyRec = await addPolicyTx.wait();
			const { args } = addPolicyRec.events.find(
				(event) => event.event === "PolicyAdded"
			);
			const policyId = args.policyId;
			return {
				success: true,
				msg: "Policy added successfully.",
				policyId: policyId,
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

export const getActivePoliciyOf = async () => {
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			console.log({ signer });
			const contract = new ethers.Contract(
				dogSurkshaAddress,
				dogSurkshaAbi,
				signer
			);

			const userAddress = await signer.getAddress();

			const policyIds = await contract.getActivePoliciyOf(userAddress);

			// console.log(policyIds);
			return {
				success: true,
				policyIds: policyIds,
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

export const getPolicy = async (policyId) => {
	try {
		if (typeof window.ethereum !== "undefined") {
			await window.ethereum.request({ method: "eth_requestAccounts" });
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				dogSurkshaAddress,
				dogSurkshaAbi,
				signer
			);

			const policyData = await contract.getPolicy(policyId);

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

export const cancelPolicy = async (policyId) => {
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				dogSurkshaAddress,
				dogSurkshaAbi,
				signer
			);

			// const receipt = await contract.cancelPolicy(policyId);

			const filter = contract.filters.PolicyCancelled();
			contract.on(filter, (policyId, owner) => {
				console.log(`Policy cancelled with ID ${policyId}`);
				const alertBox = document.createElement("div");
				alertBox.classList.add("alert-box");
				alertBox.textContent = `Policy Cancelled Successfully with policy ID ${policyId}`;
				document.body.appendChild(alertBox);
				setTimeout(() => alertBox.remove(), 5000);
				return policyId;
			});
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

export const approveClaim = async (policyId) => {
	console.log("aalo : ", policyId);
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();

			const contract = new ethers.Contract(
				dogSurkshaAddress,
				dogSurkshaAbi,
				signer
			);

			const tx = await contract.approveClaim(policyId);

			const txRec = await tx.wait();

			const { args } = txRec.events.find(
				(event) => event.event === "PolicyClaimed"
			);

			console.log("args : ", args);
			return {
				success: true,
				msg: "The claim payout will be transferred to the policy holder's account.",
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
