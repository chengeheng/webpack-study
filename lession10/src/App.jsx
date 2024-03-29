import React, { Suspense, lazy } from "react";
import { Link, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./Home"));
const About = lazy(() => import("./About"));

const App = () => {
	return (
		<div>
			App
			<ul>
				<li>
					<Link to="/home">Home</Link>
				</li>
				<li>
					<Link to="/about">About</Link>
				</li>
			</ul>
			<Suspense fallback={<div>loading...</div>}>
				<Routes>
					<Route path="/home" element={<Home />}></Route>
					<Route path="/about" element={<About />}></Route>
				</Routes>
			</Suspense>
		</div>
	);
};

export default App;
