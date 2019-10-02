import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
    Image,
    Menu,
    Sidebar,
    Icon
} from 'semantic-ui-react';
import * as actions from '../../store/actions'

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
                        verticalAlign='middle'/> {this.props.userName}
            </span>
        );
        return (
            <div>
                <Sidebar as={Menu} icon='labeled' inverted vertical visible width='thin' animation="slide along">
                    <Menu.Item as={NavLink} to="/dashboard">
                    <Icon name='dashboard' />
                        Painel
                    </Menu.Item>
                    <Menu.Item as={NavLink} to="/admin/users">
                    <Icon name='users' />
                        Usuários
                    </Menu.Item>
                    <Menu.Item as={NavLink} to="/admin/courses">
                    <Icon name='book' />
                        Cursos
                    </Menu.Item>
                </Sidebar>
            </div>
        );
    }
}

Page.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default Page;
