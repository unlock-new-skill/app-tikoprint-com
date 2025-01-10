import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import './i18n'

createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<App />
	</BrowserRouter>
)
