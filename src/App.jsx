import CoffeeForm from "./components/CoffeeForm"
import Hero from "./components/Hero"
import History from "./components/History"
import Layout from "./components/Layout"
import Stats from "./components/Stats"
import { useAuth } from "./context/AuthConext"


function App() {
  const { globalUser, globalData, isLoading } = useAuth()
  const isAuthenticated = globalUser
  const isData = globalData && !!Object.keys(globalData || {}).length

  const authenticatedContent = (
    <>
      <Stats />
      <History />
    </>
  )

  return (
    <>
      <Layout>
        <Hero />
        <CoffeeForm isAuthenticated={isAuthenticated} />
        {(isAuthenticated && isLoading) && (
          <p>Laing data...</p>
        )}
        {(isAuthenticated && isData) && (authenticatedContent)}
      </Layout>
    </>
  )
}

export default App
