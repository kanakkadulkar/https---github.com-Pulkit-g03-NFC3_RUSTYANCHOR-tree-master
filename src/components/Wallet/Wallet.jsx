import { useState, useEffect } from "react";
import { useConnectWallet } from "./useConnectWallet";

export function Wallet() {
	const { account, requestAccount, connectStatus } = useConnectWallet();

	const [isLoading, setIsLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	useEffect(() => {
		if (connectStatus === "disconnected") {
			setErrorMsg("");
		}
	}, [connectStatus]);

	const handleConnectWallet = async () => {
		setIsLoading(true);
		setErrorMsg("");

		const result = await requestAccount();

		setIsLoading(false);

		if (!result.success) {
			setErrorMsg(result.msg);
		}
	};

	return (
		<div className="flex justify-between items-center text-white">
			{connectStatus === "disconnected" && (
				<div className="flex gap-4 bg-lightblue font-bold p-2 rounded-lg justify-center items-center">
					<span className="text-lg">Connect Wallet</span>
					{isLoading && <span className=" text-red-500">Loading...</span>}
					{errorMsg && <span className="text-red-500">{errorMsg}</span>}
					{!isLoading && !errorMsg && (
						<button
							className="bg-blue-600 font-semibold hover:bg-blue-700 text-white rounded-md font-medium uppercase p-2"
							onClick={handleConnectWallet}
						>
							Connect
						</button>
					)}
				</div>
			)}

			{connectStatus === "connecting" && (
				<div className="text-center">Connecting...</div>
			)}

			{connectStatus === "connected" && (
				<div className="flex items-center justify-between gap-4 text-green-600 font-medium text-uppercase border-2 border-green-600 rounded-md p-2">
					<div>
						{account ? `${account.slice(0, 5)}...${account.slice(-4)}` : ""}
					</div>
					<div>Connected</div>
				</div>
			)}
		</div>
	);
}
