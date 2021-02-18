import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.scss';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { Auth0Context  } from '@auth0/auth0-react';

interface IState {
  collapsed: boolean,
}

export class NavMenu extends Component<any, IState> {
    static displayName = NavMenu.name;
    static contextType = Auth0Context;

  constructor(props: any) {
    super(props);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

    render() {
    const { isAuthenticated }: {isAuthenticated: boolean} = this.context;
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
          <Container>
            <NavbarBrand tag={Link} to="/">Tasktower.UIService</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/counter">Counter</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/fetch-data">Fetch data</NavLink>
                </NavItem>
                {isAuthenticated ?
                  (<>
                    <NavItem >
                      <NavLink tag={Link} className="text-dark" to="/profile">Profile</NavLink>
                    </NavItem>
                    <NavItem>
                      <LogoutButton />
                    </NavItem>
                  </>):
                  (
                    <NavItem >
                        <LoginButton />
                    </ NavItem>
                  )
                }
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
