import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { http, createConfig, WagmiProvider } from 'wagmi'
import { mainnet, base } from 'wagmi/chains'

export const config = createConfig({
	chains: [mainnet, base],
	transports: {
		[mainnet.id]: http(),
		[base.id]: http()
	}
})
const queryClient = new QueryClient()
export default function Web3Provider({ children }: { children: ReactNode }) {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WagmiProvider>
	)
}
