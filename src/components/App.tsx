import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { useLayout } from 'misc'
import Contact from './Contact'
import Header from './Header'
import Introduction from './Introduction'
import SmartContract from './SmartContract'
import { Content, Text } from './styles'
import Vancouver from './Vancouver'
import Methodology from './Methodology'
import BurgerMenu from './BurgerMenu'
import { lazy, Suspense } from 'react'

const Calculator = lazy(()=>import('./Calculator'))

export default function Doma() {
  const theme = {}
  const layout =  useLayout()

  return <>
    <ThemeProvider {...{theme:{...theme, layout}}} >
      <Router>
        <Switch>
          <Route path='/' exact>
            <Header/>
            <Content>
              <SmartContract/>
              <Introduction/>
              <Contact/>
            </Content>
          </Route>
          <Route path='/vancouver' exact>
            <Header vancouver/>
            <Content>
              <Vancouver/>
            </Content>
          </Route>
          <Route path='/vancouver/dashboard' exact>
            <Header vancouver/>
            <Content>
              <Suspense fallback={
                <div style={{
                  position:'fixed', 
                  zIndex: 100, 
                  justifyContent: 'center', 
                  alignItems:'center', 
                  display:'flex',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0
                }}>
                  <Text style={{color: 'black', width: 'fit-content'}}>
                    <h2>Loading...</h2>
                  </Text>
                </div>
              }>
                <Calculator/>
              </Suspense>
            </Content>
          </Route>
          <Route path='/vancouver/methodology' exact>
            <Methodology/>
          </Route>
        </Switch>
        <BurgerMenu/>
      </Router>
    </ThemeProvider>

  </>
}

