import logo200Image from 'assets/img/logo/logo_200.png';
import repo from 'assets/img/repo.svg';
//import sidebarBgImage from 'assets/img/sidebar/sidebar-4.jpg';
import sidebarBgImage from 'assets/img/sidebar/sidebar-repo.png';
import SourceLink from 'components/SourceLink';
import React from 'react';
import { FaGithub } from 'react-icons/fa';
import {
  MdAccountCircle,
  MdArrowDropDownCircle,
  MdBorderAll,
  MdBrush,
  MdChromeReaderMode,
  MdDashboard,
  MdExtension,
  MdGroupWork,
  MdInsertChart,
  MdKeyboardArrowDown,
  MdNotificationsActive,
  MdPages,
  MdRadioButtonChecked,
  MdSend,
  MdStar,
  MdTextFields,
  MdViewCarousel,
  MdViewDay,
  MdViewList,
  MdWeb,
  MdWidgets,
} from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import {
  // UncontrolledTooltip,
  Collapse,
  Nav,
  Navbar,
  NavItem,
  NavLink as BSNavLink,
} from 'reactstrap';
import bn from 'utils/bemnames';

const sidebarBackground = {
  backgroundImage: `url("${sidebarBgImage}")`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};

const navComponents = [
  { to: '/cambios-estandar', name: 'Cambios Estandar', exact: false, Icon: MdRadioButtonChecked },
  {
    to: '/cambios-expres',
    name: 'Cambios Express',
    exact: false,
    Icon: MdGroupWork,
  },
  { to: '/devoluciones', name: 'Devoluciones', exact: false, Icon: MdChromeReaderMode },
  { to: '/procesos-finalizados', name: 'Procesos Finalizados', exact: false, Icon: MdViewList },
  {
    to: '/estadisticas',
    name: 'Estadísticas',
    exact: false,
    Icon: MdArrowDropDownCircle,
  },
  { to: '/productos', name: 'Productos', exact: false, Icon: MdStar },
  { to: '/ventas', name: 'Ventas', exact: false, Icon: MdNotificationsActive },
  { to: '/configuracion', name: 'Configuracion', exact: false, Icon: MdBrush },
  { to: '/perfil', name: 'Perfil', exact: false, Icon: MdViewDay },
];

const navContents = [
  { to: '/typography', name: 'typography', exact: false, Icon: MdTextFields },
  { to: '/tables', name: 'tables', exact: false, Icon: MdBorderAll },
];

const pageContents = [
  { to: '/login', name: 'login / signup', exact: false, Icon: MdAccountCircle },
  {
    to: '/login-modal',
    name: 'login modal',
    exact: false,
    Icon: MdViewCarousel,
  },
];

const navItems = [
  { to: '/', name: 'dashboard', exact: true, Icon: MdDashboard },
  { to: '/cards', name: 'cards', exact: false, Icon: MdWeb },
  { to: '/charts', name: 'charts', exact: false, Icon: MdInsertChart },
  { to: '/widgets', name: 'widgets', exact: false, Icon: MdWidgets },
];

const bem = bn.create('sidebar');

class SidebarTienda extends React.Component {
  state = {
    isOpenComponents: true,
    isOpenContents: true,
    isOpenPages: true,
  };

  handleClick = name => () => {
    this.setState(prevState => {
      const isOpen = prevState[`isOpen${name}`];

      return {
        [`isOpen${name}`]: !isOpen,
      };
    });
  };

  render() {
    return (
      <aside className={bem.b()} data-image={sidebarBgImage}>
        <div className={bem.e('background')} style={sidebarBackground} />
        <div className={bem.e('content')}>
          <Navbar>
            <SourceLink className="navbar-brand d-flex">
              <img
                src={repo}
                width="70"
                height="70"
                className="pr-2"
                alt=""
              />
              {/* <span className="text-white">
                Repo
              </span> */}
            </SourceLink>
          </Navbar>
          <Nav vertical>
            <Collapse isOpen={this.state.isOpenComponents}>
              {navComponents.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={`/tienda${to}`}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>
          </Nav>
        </div>
      </aside>
    );
  }
}

export default SidebarTienda;
