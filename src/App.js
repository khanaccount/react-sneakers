import React from "react";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import AppContext from "./context";

import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Orders from "./pages/Orders";

function App() {
	const [cartItems, setCartItems] = React.useState([]);
	const [favorites, setFavorites] = React.useState([]);
	const [searchValue, setSearchValue] = React.useState("");
	const [cartOpened, setCartOpened] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(true);
	const [items, setItems] = React.useState([]);

	React.useEffect(() => {
		async function fetchData() {
			try {
				const [cartResponse, favoritesResponse, itemsResponse] =
					await Promise.all([
						axios.get("http://localhost:3001/cart"),
						axios.get("http://localhost:3001/favorites"),
						axios.get("http://localhost:3001/sneakers")
					]);

				setIsLoading(false);
				setCartItems(cartResponse.data);
				setFavorites(favoritesResponse.data);
				setItems(itemsResponse.data);
			} catch (error) {
				alert("Ошибка при запросе данных");
				console.error(error);
			}
		}

		fetchData();
	}, []);

	const onAddToCart = async obj => {
		try {
			if (cartItems.find(item => Number(item.id) === Number(obj.id))) {
				setCartItems(prev =>
					prev.filter(item => Number(item.id) !== Number(obj.id))
				);
				await axios.delete(`http://localhost:3001/cart/${obj.id}`);
			} else {
				await axios.post("http://localhost:3001/cart", obj);
				setCartItems(prev => [...prev, obj]);
			}
		} catch (error) {
			alert("Ошибка при добавлении в корзину");
			console.error(error);
		}
	};

	const OnAddToFavorite = async obj => {
		try {
			if (favorites.find(favObj => Number(favObj.id) === Number(obj.id))) {
				axios.delete(`http://localhost:3001/favorites/${obj.id}`);
				setFavorites(prev =>
					prev.filter(item => Number(item.id) !== Number(obj.id))
				);
			} else {
				const { data } = await axios.post(
					"http://localhost:3001/favorites",
					obj
				);
				setFavorites(prev => [...prev, data]);
			}
		} catch (error) {
			alert("Не удалость добавить в фавориты");
			console.error(error);
		}
	};

	const onRemoveItem = id => {
		try {
			axios.delete(`http://localhost:3001/cart/${id}`);
			setCartItems(prev => prev.filter(item => item.id !== id));
		} catch (error) {
			alert("Ошибка при удалении из корзины");
			console.error(error);
		}
	};

	const onChangeSearchInput = event => {
		setSearchValue(event.target.value);
	};

	const isItemAdded = id => {
		return cartItems.some(obj => Number(obj.id) === Number(id));
	};

	return (
		<AppContext.Provider
			value={{
				items,
				cartItems,
				favorites,
				isItemAdded,
				OnAddToFavorite,
				setCartOpened,
				setCartItems,
				onAddToCart
			}}
		>
			<div className="wrapper clear">
				<Drawer
					items={cartItems}
					onClose={() => setCartOpened(false)}
					onRemove={onRemoveItem}
					opened={cartOpened}
				/>

				<Header onClickCart={() => setCartOpened(true)} />
				<Routes>
					<Route
						path="/"
						element={
							<Home
								items={items}
								cartItems={cartItems}
								searchValue={searchValue}
								setSearchValue={setSearchValue}
								onChangeSearchInput={onChangeSearchInput}
								OnAddToFavorite={OnAddToFavorite}
								onAddToCart={onAddToCart}
								isLoading={isLoading}
							/>
						}
					/>
					<Route path="/favorites" element={<Favorites />} />
					<Route path="/orders" element={<Orders />} />
				</Routes>
			</div>
		</AppContext.Provider>
	);
}

export default App;
