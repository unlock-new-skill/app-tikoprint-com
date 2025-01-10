import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import AppRouter from 'AppRouter'
import AppProvider from '@providers/AppProvider'

function App() {
	return (
		<AppProvider>
			<AppRouter />
		</AppProvider>
	)
}

export default App
