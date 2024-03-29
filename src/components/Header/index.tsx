import {ReactComponent as Logo} from 'assets/icons/logo.svg'
import useWindowPosition, { useLayout } from 'misc'
import { Link } from 'react-router-dom'
import { Header, LogoContainer } from './styles'


export default function HeaderComponent({vancouver=false}){
  const layout = useLayout()
  const pos = useWindowPosition()
  return layout!=='mobile' ? <Header>
    <div>
      <div>
        {!vancouver && <LogoContainer opaque={pos<10} href="http://doma.city/" rel="home">
          <Logo/>
        </LogoContainer>}
      </div>

      {vancouver?
        <nav>
          <ul className="menu">
            <li>
              <Link to="/">
                Doma
              </Link>
            </li>
            {/* <li>
              <a href="#get-in-touch">
                Contact
              </a>
            </li> */}
          </ul>
        </nav>:

        <nav>
          <ul className="menu">
            <li>
              <Link to="/vancouver">
                Vancouver
              </Link>
            </li>
            <li>
              <a href="#smart-contract">
                About
              </a>
            </li>
            
            <li>
              <a href="#introduction">
                Video
              </a>
            </li>
            <li>
              <a href="#get-in-touch">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      }
    </div>
  </Header>: null
}