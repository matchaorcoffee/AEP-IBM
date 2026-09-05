import Hero from './components/Hero/Hero'
import WelcomeSection from './components/WelcomeSection/WelcomeSection'
import TabPanel from './components/TabPanel/TabPanel'
import CleanEnergyFuture from './components/CleanEnergyFuture/CleanEnergyFuture'
import IbmGuidingPrinciples from './components/IbmGuidingPrinciples/IbmGuidingPrinciples'
import QuickLinks from './components/QuickLinks/QuickLinks'

export default function HomePage() {
  return (
    <div>
      <Hero />
      <WelcomeSection />
      <TabPanel />
      <CleanEnergyFuture />
      <IbmGuidingPrinciples />
      <QuickLinks />
    </div>
  )
}
