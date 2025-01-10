import { Tab, Tabs } from '@nextui-org/react'
import CollectionForm from './forms/CollectionForm'
import TagForm from './forms/TagForm'

export default function ShopCatalog() {
	return (
		<Tabs color="primary">
			<Tab key="collection" title="Collection">
				<CollectionForm />
			</Tab>
			<Tab key="tag" title="Tag For Product">
				<TagForm />
			</Tab>
		</Tabs>
	)
}
