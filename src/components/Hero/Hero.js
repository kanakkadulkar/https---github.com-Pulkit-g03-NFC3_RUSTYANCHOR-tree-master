import { Link } from "react-router-dom";
import { heroImg } from "../../assets";

const Hero = () => {
	return (
		<div
			className="bg-cover bg-center object-cover text-white flex flex-col justify-center"
			style={{
				backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3)), url(${heroImg})`,
				backgroundSize: "100% 100%",
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center",
				height: "calc(100vh - 10rem)",
			}}
		>
			<div className="flex flex-col justify-start items-center space-y-6 w-1/2">
				<div className="flex flex-col space-y-3">
					<h1 className="text-4xl font-bold">Welcome to Dog Suraksha</h1>
					<p className="text-xl">
						Providing comprehensive coverage for your furry friend.
					</p>
				</div>
				<p className="text-xl w-2/3 text-center">
					As a pet owner, you know that unexpected accidents and illnesses can
					happen at any time, and the cost of veterinary care can be quite
					expensive. dogSuraksha offers a variety of insurance plans to help
					you protect your dog's health and your finances.
				</p>
				<Link
					to="/quoteForm"
					className="bg-blue-500 text-xl hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-block "
				>
					Get a personalized quote
				</Link>
			</div>
		</div>
	);
};

export default Hero;
