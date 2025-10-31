import { useEffect } from "react"
export const App = () => {
  useEffect(() => {
    console.log("useEffect-App")
  }, [])
  return <div>App</div>
}