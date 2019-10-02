import React from 'react'
import { API_URL } from "../../../../common/url-types"
import axios from 'axios'
import {
    Form,
    Input,
    Button,
    Message,
    Grid
} from 'semantic-ui-react'
import Admin from '../../Admin'

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            success: false,
            message: ''
        }
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();

        axios.post(`${ API_URL }/api/users`, {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
         })
            .then(res => {
            console.log(res);
            console.log(res.data);
            this.setState({
                message: 'Usuário criado com sucesso',
                error: false,
                success: true,
            });
        }).catch(error => {
            console.log(error.message)
            this.setState({
                message: error.message,
                error: true,
                success: false
            })
        })
    }

    render() {
        return (
            <Admin heading="Create">
                {this.state.message ?
                <Message success={this.state.success} negative={this.state.error}>
                    <Message.Header>{this.state.success ? 'Sucesso' : "Erro" }</Message.Header>
                    <p>
                        {this.state.message}
                    </p>
                </Message>
                : null }
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group widths='equal'>
                                <Form.Field
                                    id='input-control-name'
                                    control={Input}
                                    label='Nome Completo'
                                    placeholder='Nome Completo'
                                    name="name"
                                    onChange={this.handleChange}
                                />
                                <Form.Field
                                    id='input-control-email'
                                    control={Input}
                                    label='Email'
                                    name="email"
                                    placeholder='Email'
                                    onChange={this.handleChange}
                                />
                                <Form.Field
                                    id='input-control-password'
                                    type='password'
                                    control={Input}
                                    label='Senha'
                                    name="password"
                                    placeholder='Senha'
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Field
                                id='button-control-confirm'
                                control={Button}
                                content='Criar'
                                positive
                            />
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Admin>
        );
    }
}

export default Page;
