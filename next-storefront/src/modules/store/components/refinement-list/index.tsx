import { StoreGetProductsParams } from "@medusajs/medusa"
import {useCollections, useProductCategories} from "medusa-react"
import { ChangeEvent } from "react"

type RefinementListProps = {
  refinementList: StoreGetProductsParams
  setRefinementList: (refinementList: StoreGetProductsParams) => void
}

const RefinementList = ({
  refinementList,
  setRefinementList,
}: RefinementListProps) => {
  const { product_categories, isLoading } = useProductCategories()

  const handleCategoryChangeChange = (
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const { checked } = e.target

    const categoriesIds = refinementList.category_id || []

    const exists = categoriesIds.includes(id)

    if (checked && !exists) {
      setRefinementList({
        ...refinementList,
        category_id: [...categoriesIds, id],
      })

      return
    }

    if (!checked && exists) {
      setRefinementList({
        ...refinementList,
        category_id: categoriesIds.filter((c) => c !== id),
      })

      return
    }

    return
  }

  return (
    <div>
      <div className="px-8 py-4  small:pr-0 small:pl-8 small:min-w-[250px]">
        <div className="flex gap-x-3 small:flex-col small:gap-y-3">
          <span className="text-base-semi">Categories</span>
          <ul className="text-base-regular flex items-center gap-x-4 small:grid small:grid-cols-1 small:gap-y-2">
            {product_categories?.map((c) => (
              <li key={c.id}>
                <label className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    defaultChecked={refinementList.collection_id?.includes(
                      c.id
                    )}
                    onChange={(e) => handleCategoryChangeChange(e, c.id)}
                    className="accent-amber-200"
                  />
                  {c.name}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default RefinementList
