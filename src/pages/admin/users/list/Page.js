import React from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from "../../../../common/url-types"

import {
    Button,
    Icon,
    Table,
    Grid,
    Menu,
    Message
} from 'semantic-ui-react'
import Admin from '../../Admin'
import axios from 'axios'

class Page extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            users: [],
            message: '',
            error: false,
            success: false,
            redirect: false
        }

        this.handleDelete = this.handleDelete.bind(this)
    }

    componentDidMount() {
        axios.get(`${API_URL}/api/users`)
          .then(res => {
            const users = res.data;
            this.setState({ users: users });
        })
        console.log(this.state.users);
    }

    handleDelete = (event) => {
        let userID = event.target.value;
        if(React.confirm('Tem certeza que deseja deletar?')) {
            axios.delete(`${ API_URL }/api/users/${userID}`)
            .then(res => {
                console.log(res);
                console.log(res.data);
                this.setState({
                    message: 'Usuário deletado',
                    error: false,
                    success: true,
                });
            })

            const users = this.state.users;
            let newUsers = users.filter(user => {
                if (user.id !== userID) {
                    return users !== userID 
                }
                return false
            });
            this.setState({
                users: newUsers
            })
        }
    }

    render() {
        const users = this.state.users;
        return (
            <Admin heading='Usuários' createLink='/admin/users/create'>
                {this.state.message ?
                <Message success={this.state.success} negative={this.state.error}>
                    <p>
                        {this.state.message}
                    </p>
                </Message>
                : null }
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell colSpan='4'>Lista</Table.HeaderCell>
                                </Table.Row>
                                <Table.Row>
                                <Table.HeaderCell>Nome</Table.HeaderCell>
                                <Table.HeaderCell>Email</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                <Table.HeaderCell>  </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                { users.map((user) =>
                                    <Table.Row key={user.id}>
                                        <Table.Cell>
                                        <Menu.Item as={ Link } to={'/admin/users/' + user.id}>
                                            {user.name}
                                        </Menu.Item>
                                        </Table.Cell>
                                        <Table.Cell>{user.email}</Table.Cell>
                                        <Table.Cell positive>
                                            <Icon name='checkmark' />
                                            Aprovado
                                        </Table.Cell>
                                        <Table.Cell collapsing textAlign="right">
                                            {this.props.user.id === user.id ? null :
                                                <Button icon='trash alternate outline' onClick={this.handleDelete} value={user.id} />
                                            }
                                        </Table.Cell>
                                    </Table.Row>
                                    )
                                }
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid.Row>
            </Admin>
        );
    }
}

export default Page;
