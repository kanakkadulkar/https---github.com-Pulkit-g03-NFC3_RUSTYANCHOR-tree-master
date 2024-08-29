import { requestAccount } from "./commonConnectors";
const { ethers } = require("ethers");
const contracts = require("../../constants/contracts.json");
const usdcContractAddr = contracts.USDCToken[1];
const usdcContractAbi = contracts.USDCToken[0];
const sixDecimals = 6;

export const getUsdc = async () => {
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();

			// usdc contract
			const contract = new ethers.Contract(
				usdcContractAddr,
				usdcContractAbi,
				signer
			);

			const tx = await contract.getUsdc();
			await tx.wait();
			return {
				success: true,
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

export const getWalletBal = async (address) => {
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();

			const contract = new ethers.Contract(
				usdcContractAddr,
				usdcContractAbi,
				signer
			);

			const bal = await contract.balanceOf(
				address ? address : await signer.getAddress()
			);

			return {
				balance: ethers.utils.formatUnits(bal, sixDecimals),
				success: true,
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

export const approve = async (to, amount) => {
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			console.log({ signer });

			// usdc contract
			const contract = new ethers.Contract(
				usdcContractAddr,
				usdcContractAbi,
				signer
			);

			const tx = await contract.approve(to, amount);
			const txRec = await tx.wait();
			const { args } = txRec.events.find((event) => event.event === "Approval");

			return {
				data: args,
				success: true,
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

export const getAllowance = async (spender) => {
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const signerAddress = await signer.getAddress();

			// usdc contract
			const contract = new ethers.Contract(
				usdcContractAddr,
				usdcContractAbi,
				signer
			);

			// get allowance
			const allowanceValue = await contract.allowance(signerAddress, spender);

			return {
				success: true,
				allowance: allowanceValue,
			};
		} else {
			return {
				success: false,
				msg: "Please connect your wallet",
			};
		}
	} catch (error) {
		return {
			success: false,
			msg: error.message,
		};
	}
};

export const increaseAllowance = async (spender, addVal) => {
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();

			// USDC contract
			const contract = new ethers.Contract(
				usdcContractAddr,
				usdcContractAbi,
				signer
			);

			// Increase allowance
			const tx = await contract.increaseAllowance(spender, addVal);
			await tx.wait(); // Wait for the transaction to be mined

			return {
				success: true,
				msg: "Allowance increased",
			};
		} else {
			return {
				success: false,
				msg: "Please connect your wallet",
			};
		}
	} catch (error) {
		return {
			success: false,
			msg: error.message,
		};
	}
};

export const decreaseAllowance = async (spender, decreaseVal) => {
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();

			// USDC contract
			const contract = new ethers.Contract(
				usdcContractAddr,
				usdcContractAbi,
				signer
			);

			// Decrease allowance
			const tx = await contract.decreaseAllowance(spender, decreaseVal);
			await tx.wait(); // Wait for the transaction to be mined

			return {
				success: true,
				msg: "Allowance decreased",
			};
		} else {
			return {
				success: false,
				msg: "Please connect your wallet",
			};
		}
	} catch (error) {
		return {
			success: false,
			msg: error.message,
		};
	}
};
