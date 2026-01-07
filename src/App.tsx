import { SpeedInsights } from "@vercel/speed-insights/react"
import { NodeAnimation } from './components/NodeAnimation'
import { ComingSoon } from './components/ComingSoon'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <NodeAnimation />
      <ComingSoon />
      <SpeedInsights />
    </div>
  )
}

export default App
