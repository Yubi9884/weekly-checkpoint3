import { useMemo, useState } from 'react'
import './App.css'
import {
  ExerciseBooks,
  GlueSticks,
  Pencils,
  Pens,
  QuantityDecorator,
  Sharpener,
  type IStationeryItem,
} from './models/stationery'

type ItemSelection = {
  checked: boolean
  quantity: number
}

type StationeryOption = {
  id: string
  label: string
  item: IStationeryItem
}

const stationeryOptions: StationeryOption[] = [
  { id: 'exerciseBooks', label: 'Exercise Books', item: new ExerciseBooks() },
  { id: 'pens', label: 'Pens', item: new Pens() },
  { id: 'pencils', label: 'Pencils', item: new Pencils() },
  { id: 'sharpener', label: 'Sharpener', item: new Sharpener() },
  { id: 'glueSticks', label: 'Glue Sticks', item: new GlueSticks() },
]

const createInitialSelections = (): Record<string, ItemSelection> =>
  Object.fromEntries(
    stationeryOptions.map((option) => [option.id, { checked: false, quantity: 1 }]),
  )

function App() {
  // Store each of the item's  in checkbox selection and quantity.
  const [selectedItems, setSelectedItems] = useState<Record<string, ItemSelection>>(
    createInitialSelections,
  )
  const [showDisplayedTotal, setShowDisplayedTotal] = useState(false)

  const selectedLines = useMemo(
    () =>
      stationeryOptions
        .map((option) => {
          const choice = selectedItems[option.id]
          if (!choice.checked) {
            return null
          }

          const itemWithQuantity = new QuantityDecorator(option.item, choice.quantity)

          return {
            id: option.id,
            label: option.label,
            quantity: choice.quantity,
            total: itemWithQuantity.getCost(),
          }
        })
        .filter((item): item is NonNullable<typeof item> => item !== null),
    [selectedItems],
  )
// Add the selected item costs to update the displayed cart total.
  const totalCost = selectedLines.reduce((sum, item) => sum + item.total, 0)

  // Update selection while keeping the quantity within the dropdown range.
const toggleSelection = (id: string, checked: boolean) => {
  setSelectedItems((current) => ({
    ...current,
    [id]: {
      ...current[id],
      checked,
      quantity: Math.max(current[id]?.quantity ?? 1, 1),
    },
  }))
}
  const updateQuantity = (id: string, quantity: number) => {
    const safeQuantity = Number.isNaN(quantity) ? 1 : Math.max(1, quantity)

    setSelectedItems((current) => ({
      ...current,
      [id]: {
        ...current[id],
        checked: current[id]?.checked ?? false,
        quantity: safeQuantity,
      },
    }))
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <p className="eyebrow">Stationery Shop</p>
        <h1>Shopping Cart</h1>
      </header>

      <main className="cart-layout">
        <section className="catalog-panel">
          <h2>Available Stationery</h2>

          {stationeryOptions.map((option) => {
            const selection = selectedItems[option.id]
            const itemCost = option.item.getCost()

            return (
              <div className="item-row" key={option.id}>
                <label className="item-checkbox">
                  <input
                    type="checkbox"
                    checked={selection.checked}
                    onChange={(event) => toggleSelection(option.id, event.target.checked)}
                  />
                  <span>{option.label}</span>
                </label>

                <div className="price-meta">
                  <span>NZD {itemCost.toFixed(2)} each</span>
                </div>

                <label className="quantity-control">
                  <span>Qty</span>
                  <select
                    value={selection.quantity}
                    disabled={!selection.checked}
                    onChange={(event) =>
                      updateQuantity(option.id, Number(event.target.value))
                    }
                  >
                    {Array.from({ length: 200 }, (_, index) => index + 1).map((amount) => (
                      <option key={amount} value={amount}>
                        {amount}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )
          })}
        </section>

        <aside className="summary-panel">
          <h2>Order Summary</h2>

          {selectedLines.length === 0 ? (
            <p className="empty-state">No items selected yet.</p>
          ) : (
            <ul className="summary-list">
              {selectedLines.map((item) => (
                <li key={item.id}>
                  <span>
                    {item.label} x {item.quantity}
                  </span>
                  <strong>NZD {item.total.toFixed(2)}</strong>
                </li>
              ))}
            </ul>
          )}

          <div className="total-row">
            <span>Total</span>
            <strong>NZD {totalCost.toFixed(2)}</strong>
          </div>

          <button
            type="button"
            className="display-button"
            onClick={() => setShowDisplayedTotal(true)}
          >
            Display Total Cost
          </button>
          {showDisplayedTotal && (
            <p className="displayed-total" role="status">
              Total cost: NZD {totalCost.toFixed(2)}
            </p>
          )}
        </aside>
      </main>
    </div>
  )
}

export default App
