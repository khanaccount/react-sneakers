import React from "react";
import ContentLoader from "react-content-loader";
import styles from "./Card.module.scss";

import AppContext from "../../context";

function Card({
	id,
	onFavorite,
	title,
	imageUrl,
	price,
	onPlus,
	favorite = false,
	loading = false
}) {
	const { isItemAdded } = React.useContext(AppContext);
	const [isFavorite, setIsFavorite] = React.useState(favorite);
	const obj = { id, title, imageUrl, price };

	const onClickPlus = () => {
		onPlus(obj);
	};

	const onClickFavorite = () => {
		onFavorite(obj);
		setIsFavorite(!isFavorite);
	};

	return (
		<div className={styles.card}>
			{loading ? (
				<ContentLoader
					speed={2}
					width={150}
					height={187}
					viewBox="0 0 150 187"
					backgroundColor="#f3f3f3"
					foregroundColor="#ecebeb"
				>
					<rect x="0" y="0" rx="10" ry="10" width="150" height="90" />
					<rect x="0" y="100" rx="3" ry="3" width="150" height="15" />
					<rect x="0" y="120" rx="3" ry="3" width="100" height="15" />
					<rect x="0" y="160" rx="8" ry="8" width="80" height="24" />
					<rect x="118" y="155" rx="8" ry="8" width="32" height="32" />
				</ContentLoader>
			) : (
				<>
					{onFavorite && (
						<div className={styles.favorite} onClick={onClickFavorite}>
							<img
								src={
									isFavorite ? "/img/heart-liked.svg" : "/img/heart-unliked.png"
								}
								alt="unliked"
							/>
						</div>
					)}
					<img width={133} height={112} src={imageUrl} alt="Sneakers" />
					<h5>{title}</h5>
					<div className="d-flex justify-between align-center">
						<div className="d-flex flex-column">
							<span>Цена:</span>
							<b>{price} руб.</b>
						</div>
						{onPlus && (
							<img
								className={styles.plus}
								onClick={onClickPlus}
								src={isItemAdded(id) ? "/img/accept.svg" : "/img/plus.svg"}
							/>
						)}
					</div>
				</>
			)}
		</div>
	);
}

export default Card;
