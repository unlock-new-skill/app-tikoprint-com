import OrderForm from './components/OrderForm'
import OrderDetailProvider from './OrderDetailProvider'

export default function DetailFulfillOrder() {
	return (
		<OrderDetailProvider>
			<OrderForm />
		</OrderDetailProvider>
	)
}
