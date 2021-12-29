import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { useLayout } from 'misc'

import Contact from './Contact'
import Header from './Header'
import Introduction from './Introduction'
import SmartContract from './SmartContract'
import { Content } from './styles'
import Vancouver from './Vancouver'
import Calculator from './Calculator'
import { useWindowSize } from 'react-use-size'
import Methodology from './Methodology'

export default function Doma() {
  const theme = {}
  const layout =  useLayout()
  const {width, height} = useWindowSize()
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
              <Calculator/>
              {/* <Contact/> */}
            </Content>
          </Route>
          <Route path='/vancouver/methodology' exact>
            <Methodology/>
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>

  </>
}
