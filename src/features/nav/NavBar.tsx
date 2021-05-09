import React, { useContext } from 'react';
import { Menu, Container, Button, Dropdown, Image } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import { Role } from '../../app/common/helpers/role';

const NavBar: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { user, logout } = rootStore.userStore;
  return (
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item header as={NavLink} exact to='/'>
          <img src='/assets/logo.png' alt='logo' style={{ marginRight: 10 }} />
          Quiz
        </Menu.Item>
        <Menu.Item name='Questions' as={NavLink} to='/questions' />
        {user && user.roles && user.roles.includes(Role.Admin) && (
          <Menu.Item>
            <Button
              as={NavLink}
              to='/createQuestion'
              positive
              content='Create Question'
            />
          </Menu.Item>
        )}

        {user && user.roles && user.roles.includes(Role.Admin) && (
          <Menu.Item name='Answers' as={NavLink} to='/answers' />
        )}

        {user && user.displayName && (
          <Menu.Item position='right'>
            <Image avatar spaced='right' src={'/assets/user.png'} />
            <Dropdown pointing='top left' text={user.displayName}>
              <Dropdown.Menu>
                <Dropdown.Item onClick={logout} text='Logout' icon='power' />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        )}
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
