import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Recipe() {
	const params = useParams();
	const navigate = useNavigate();
	const [recipe, setRecipe] = useState({ ingredients: "" });

	useEffect(() => {
		const url = `/api/v1/show/${params.id}`;
		fetch(url)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Error in connection to API endpoint");
			})
			.then((response) => {
				setRecipe(response);
			})
			.catch(() => navigate("/recipes"));
	}, [params.id]);

	function addHtmlEntities(str) {
		return String(str).replace(/&lt;/g, "<").replace(/&gt;/g, ">");
	}

	function ingredientList() {
		let ingredientList = "No ingredients available";

		if (recipe.ingredients.length > 0) {
			ingredientList = recipe.ingredients
				.split(",")
				.map((ingredient, index) => (
					<li key={index} className="list-group-item">
						{ingredient}
					</li>
				));
		}

		return ingredientList;
	}

	const recipeInstruction = addHtmlEntities(recipe.instruction);

	function deleteRecipe() {
		const url = `/api/v1/destroy/${params.id}`;
		const token = document.querySelector('meta[name = "csrf-token"]').content;

		if (!confirm("Are you sure you want to delete this?")) {
			return;
		}

		fetch(url, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-Token": token,
			},
		})
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Error in connection to API endpoint");
			})
			.then(() => navigate("/recipes"))
			.catch((error) => console.log(error.message));
	}

	return (
		<div className="">
			<div className="hero position-relative d-flex align-items-center justify-content-center">
				<img
					src={recipe.image}
					alt={`${recipe.name} image`}
					className="img-fluid position-absolute"
				/>
				<div className="overlay bg-dark position-absolute" />
				<h1 className="display-4 position-relative text-white">
					{recipe.name}
				</h1>
			</div>
			<div className="container py-5">
				<div className="row">
					<div className="col-sm-12 col-lg-3">
						<ul className="list-group">
							<h5 className="mb-2">Ingredients</h5>
							{ingredientList()}
						</ul>
					</div>
					<div className="col-sm-12 col-lg-7">
						<h5 className="mb-2">Preparation Instructions</h5>
						<div
							dangerouslySetInnerHTML={{
								__html: `${recipeInstruction}`,
							}}
						/>
					</div>
					<div className="col-sm-12 col-lg-2">
						<button
							type="button"
							className="btn btn-danger"
							onClick={deleteRecipe}
						>
							Delete Recipe
						</button>
					</div>
				</div>
				<Link to="/recipes" className="btn btn-link">
					Back to recipes
				</Link>
			</div>
		</div>
	);
}
