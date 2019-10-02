import React from 'react'
import {NavLink, Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import {
    Container,
    Dropdown,
    Divider,
    Image,
    Menu,
    Responsive,
    Segment
} from 'semantic-ui-react';
import * as actions from '../../store/actions'
import styled from 'styled-components';

const Logo = styled.a`
    max-width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 15px;
    &:hover {
        background: transparent;
    }
    img {
        max-width: 100%;
        height: auto;
    }
`;

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout(event) {
        event.preventDefault();
        this.props.dispatch(actions.authLogout());
    }


    render() {
        this.avatar = (
            <span>
                 <Image avatar src={require('../../_assets/images/boy.png')}
                        verticalAlign='middle'/> {this.props.user.name}
            </span>
        );
        return (
            <div>
                <Responsive as={Segment} maxWidth={768} className="mobile-navbar">
                    <Menu size="large" secondary>
                        <Menu.Item as={Link} to="/" className="logo" replace>
                            E-Learning React
                        </Menu.Item>
                        <Menu.Menu position="right">
                            <Menu.Item>
                                <Dropdown icon="bars" className="collapsible-menu">
                                    <Dropdown.Menu className='bounceIn animated'>
                                        {this.props.isAuthenticated
                                            ?
                                            <Dropdown.Item
                                                onClick={this.handleLogout}
                                                text="logout"
                                                icon='sign out'
                                                key='logout'/>
                                            :
                                            <div>
                                                <Dropdown.Item as={NavLink} to="/login" text="login"/>
                                                <Divider/>
                                                <Dropdown.Item as={NavLink} to="/register" text="register"/>
                                            </div>
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>
                </Responsive>
                <Responsive className="navbar" minWidth={769}>
                    <Menu size='small' inverted style={{marginLeft: '150px', borderRadius: '0'}}>
                        <Container fluid>
                            <Logo as={Link} to="/" className="logo" replace>
                                E-learning React
                            </Logo>
                            <Menu.Item position='right'>
                                <Dropdown trigger={this.avatar} pointing='top right' className='user-dropdown'>
                                    <Dropdown.Menu className='bounceIn animated'>
                                        <Dropdown.Item
                                            text={"Está logado como " + this.props.user.name}
                                            disabled key='user'/>
                                        <Dropdown.Item as={Link} to="/dashboard" text="Perfil" icon='user' />
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={this.handleLogout} text="Sair" icon='sign out'
                                                    key='logout'/>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Menu.Item>
                        </Container>
                    </Menu>
                </Responsive>
            </div>
        );
    }
}

Page.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default Page;
