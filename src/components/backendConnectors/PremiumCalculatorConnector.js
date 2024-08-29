const { ethers } = require("ethers");
const { requestAccount } = require("./commonConnectors");
const contracts = require("../../constants/contracts.json");
const premiumCalculatorContractAddress = contracts.PremimumCalculator[1];
const premiumCalculatorAbi = contracts.PremimumCalculator[0];

const sixDecimals = 6;

export const calculatePremium = async ({
	breed,
	age,
	region,
	healthCondition,
	policyType,
}) => {
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			console.log({ signer });
			const contract = new ethers.Contract(
				premiumCalculatorContractAddress,
				premiumCalculatorAbi,
				signer
			);

			let data = await contract.calculatePremium(
				breed,
				age,
				region,
				healthCondition,
				policyType
			);

			if (data) {
				return {
					data: ethers.utils.formatUnits(data, sixDecimals),
					success: true,
				};
			}
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
