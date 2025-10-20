import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client/react'
import './index.css'
import App from './App.tsx'
import { apolloClient } from './infrastructure/graphql/apolloClient'
import { LanguageProvider } from './contexts/LanguageContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </LanguageProvider>
  </StrictMode>,
)
