import Avatar from '../Avatar';
import { UserCard } from '../../components/Card';
import withBadge from '../../hocs/withBadge';
import React from 'react';
import LogService from '../../servicios/logService';
import StorageService from '../../servicios/storageService';

import {
  MdClearAll,
  MdExitToApp,
  MdNotificationsActive,
} from 'react-icons/md';
import {
  Button,
  ListGroup,
  ListGroupItem,
  Nav,
  Navbar,
  NavItem,
  NavLink,
  Popover,
  PopoverBody,
} from 'reactstrap';
import bn from '../../utils/bemnames';

const bem = bn.create('header');

class Header extends React.Component {
  state = {
    isOpenNotificationPopover: false,
    isNotificationConfirmed: false,
    isOpenUserCardPopover: false,
  };

  toggleNotificationPopover = () => {
    this.setState({
      isOpenNotificationPopover: !this.state.isOpenNotificationPopover,
    });

    if (!this.state.isNotificationConfirmed) {
      this.setState({ isNotificationConfirmed: true });
    }
  };

  toggleUserCardPopover = () => {
    this.setState({
      isOpenUserCardPopover: !this.state.isOpenUserCardPopover,
    });
  };

  handleSidebarControlButton = event => {
    event.preventDefault();
    event.stopPropagation();

    document.querySelector('.cr-sidebar').classList.toggle('cr-sidebar--open');
  };

  render() {
    const storageService = new StorageService();
    const closeSession = () => {
      const logService = new LogService();
      const { access_token } = storageService.getItemObject('tknData');
      
      logService.logout(access_token);
    }
    const userLocal = storageService.getItemObject("authUser");
    return (
      <Navbar light expand className={bem.b('bg-white')}>
        <Nav navbar className="mr-2">
          <Button outline onClick={this.handleSidebarControlButton}>
            <MdClearAll size={25} />
          </Button>
        </Nav>

        <Nav navbar className={bem.e('nav-right')}>

          <NavItem>
            <NavLink id="Popover2">
              <Avatar
                onClick={this.toggleUserCardPopover}
                className="can-click"
              />
            </NavLink>
            <Popover
              placement="bottom-end"
              isOpen={this.state.isOpenUserCardPopover}
              toggle={this.toggleUserCardPopover}
              target="Popover2"
              className="p-0 border-0"
              style={{ minWidth: 250 }}
            >
              <PopoverBody className="p-0 border-light">
                <UserCard
                  title={userLocal.fullname + (userLocal.tienda? '-' + userLocal.tienda.business_name: '')}
                  subtitle={userLocal.email}
                  className="border-light"
                >
                  <ListGroup flush>
                    <ListGroupItem tag="button" action className="border-light" onClick={closeSession}>
                      <MdExitToApp /> Salir
                    </ListGroupItem>
                  </ListGroup>
                </UserCard>
              </PopoverBody>
            </Popover>
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default Header;
