import { useState, useEffect } from "react"
import { Autocomplete, TextField, Button } from "@mui/material"

import API from "../api"

import "./JoinedSession.css"

export type Ingredient = {
    name: string
    unit: "volume" | "weight" | "quantity"
}

function IngredientSelector({
    disabled,
    onSubmit,
}: {
    disabled: boolean
    onSubmit: (selected: Ingredient) => void
}) {
    const [options, setOptions] = useState<string[]>([])
    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [selected, setSelected] = useState<string | null>(null)

    useEffect(() => {
        if (loading) {
            const fetchData = async () => {
                const ingredients = (await API.get("ingredients")).data

                setIngredients(ingredients)

                setOptions(
                    ingredients.map((ingredient: Ingredient) => ingredient.name)
                )
                setLoading(false)
            }

            fetchData()
        }
    }, [loading])

    const getOptions = () => {
        if (ingredients.length === 0) {
            setLoading(true)
        }
    }

    return (
        <div className="selector">
            <Autocomplete
                disabled={disabled}
                autoSelect
                loading={loading}
                loadingText="Loading..."
                onOpen={getOptions}
                onChange={(_, value) => setSelected(value)}
                options={options}
                sx={{ width: 300 }}
                renderInput={params => (
                    <TextField {...params} label="Ingredient" />
                )}
                className="selector-textbox"
            />
            <Button
                variant="contained"
                disabled={Boolean(!selected || disabled)}
                onClick={() => {
                    onSubmit(
                        ingredients.find(
                            ingredient => ingredient.name === selected
                        ) as Ingredient
                    )
                }}
            >
                Submit
            </Button>
        </div>
    )
}

function AmountSelector({
    disabled,
    ingredient,
    onSubmit,
}: {
    disabled: boolean
    ingredient: Ingredient | null
    onSubmit: (selected: string) => void
}) {
    const [selected, setSelected] = useState<string | null>(null)
    const [amountOptions, setAmountOptions] = useState<string[]>([])

    const populateOptions = (input: string | null) => {
        if (ingredient?.unit) {
            const units = {
                volume: ["ml", "l"],
                weight: ["g", "kg"],
                quantity: ["pcs"],
            }

            setAmountOptions(
                units[ingredient.unit].map(value => `${input || 0} ${value}`)
            )
        }
    }

    return (
        <div className="selector">
            <Autocomplete
                disabled={disabled}
                autoSelect
                onOpen={() => {
                    populateOptions(null)
                }}
                onInputChange={(_, value: string) => {
                    populateOptions(value.replace(/[^0-9.]/g, ""))
                }}
                onChange={(_, value) => setSelected(value)}
                options={amountOptions}
                sx={{ width: 300 }}
                renderInput={params => <TextField {...params} label="Amount" />}
                className="selector-textbox"
            />
            <Button
                variant="contained"
                disabled={Boolean(!selected || disabled)}
                onClick={() => {
                    onSubmit(selected as string)
                }}
            >
                Submit
            </Button>
        </div>
    )
}

export default function JoinedSession({
    onChosen,
    mealType,
}: {
    onChosen: (ingredient: Ingredient, amount: string) => void
    mealType: string
}) {
    const [ingredient, setIngredient] = useState<Ingredient | null>(null)
    const [ingredientSelected, setIngredientSelected] = useState(false)
    const [amount, setAmount] = useState<string | null>(null)
    const [amountSelected, setAmountSelected] = useState(false)

    const onIngredientSelected = (ingredient: Ingredient) => {
        setIngredientSelected(true)
        setIngredient(ingredient)
    }

    const onAmountSelected = (amount: string) => {
        setAmountSelected(true)
        setAmount(amount)

        onChosen(ingredient as Ingredient, amount as string)
    }

    return (
        <>
            <div className="selector-container">
                <span style={{ fontFamily: "Roboto", marginLeft: "10px" }}>
                    Your meal type is <strong>{mealType}</strong>
                </span>
                <IngredientSelector
                    disabled={ingredientSelected}
                    onSubmit={onIngredientSelected}
                />
                <AmountSelector
                    disabled={!ingredientSelected || amountSelected}
                    ingredient={ingredient}
                    onSubmit={onAmountSelected}
                />
            </div>
        </>
    )
}
