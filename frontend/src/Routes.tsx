import React, { useEffect } from "react"

import { Route, Routes } from "react-router-dom"

import App from "./App"
import Recipes from "./routes/Recipes"
import Recipe from "./routes/Recipe"

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="recipes/:id" element={<Recipe />} />
        </Routes>
    )
}
