import { Header, Admin, Footer } from "../components";

const AdminPage = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<div className="flex-grow">
				<Admin />
			</div>
			<Footer />
		</div>
	);
};

export default AdminPage;
