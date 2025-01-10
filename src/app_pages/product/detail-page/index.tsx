import { Button, Divider, Tab, Tabs } from '@nextui-org/react'
import ProductForm from './components/ProductForm'
import VariatioForm from './components/VariationForm'
import { Link } from 'react-router-dom'

export default function ProductDetailPage() {
	return (
		<div>
			<div className="flex  justify-between items-center">
				<h3 className="font-[400]">Product infomation</h3>
				<Link to={'/shop/product'}>
					<Button aria-label="button" color="primary" size="sm" variant="bordered">
						Go back
					</Button>
				</Link>
			</div>
			<Divider className="my-2" />
			<Tabs color="primary">
				<Tab key="product-information" title="Product Infomation">
					<ProductForm />
				</Tab>
				<Tab key="variation" title="Attribute & Variation">
					<VariatioForm />
				</Tab>
			</Tabs>
		</div>
	)
}
