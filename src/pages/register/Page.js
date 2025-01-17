import React from 'react'
import {Button, Dimmer, Form, Grid, Header, Loader, Message, Segment} from 'semantic-ui-react'
import {Link, Redirect} from 'react-router-dom'
import PropTypes from 'prop-types'
import ReeValidate from 'ree-validate'
import AuthService from '../../services'
import PageHeader from '../../common/pageHeader'
import Navigation from '../../common/navigation'
import Footer from '../../common/mainFooter'

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.validator = new ReeValidate({
            name: 'required|min:3',
            email: 'required|email',
            password: 'required|min:6',
            password_confirmation: 'required|min:6'
        });
        this.state = {
            credentials: {
                name: '',
                email: '',
                password: '',
                password_confirmation: ''
            },
            responseError: {
                isError: false,
                code: '',
                text: ''
            },
            isSuccess: false,
            isLoading: false,
            errors: this.validator.errors
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        const { errors } = this.validator;
        const {credentials} = this.state;
        credentials[name] = value;

        this.validator.validate(name, value)
            .then(() => {
                this.setState({errors, credentials})
            });
    }

    handleSubmit(event) {
        event.preventDefault();

        const {credentials} = this.state;

        this.validator.validateAll(credentials)
            .then(success => {
                if (success) {
                    // Manually verify the password confirmation fields
                    if(this.passwordConfirmation(credentials)){

                        this.setState({
                            isLoading: true
                        });
                        this.submit(credentials);
                    }
                    else{
                        const responseError = {
                            isError: true,
                            code: 401,
                            text: "Oops! Password confirmation didn't match"
                        };
                        this.setState({responseError});
                    }

                }
            });
    }


    passwordConfirmation(credentials){
        if(credentials.password === credentials.password_confirmation){
            return true;
        }
        else{
            return false;
        }
    }

    submit(credentials) {
        this.props.dispatch(AuthService.register(credentials))
            .then((result)  => {
                this.setState({
                    isLoading: false,
                    isSuccess: true,
                    credentials: {
                        name: '',
                        email: '',
                        password: '',
                        password_confirmation: ''
                    },
                    responseError : {
                        isError: false,
                        code: '',
                        text: ''
                    }
                });

            })
            .catch(({error, statusCode}) => {
                const responseError = {
                    isError: true,
                    code: statusCode,
                    text: error
                };
                this.setState({responseError});
                this.setState({
                    isLoading: false
                });
            })
    }

    componentDidMount() {
        this.setState({
            isLoading: false
        });
    }

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to='/' replace/>
        }
        if (this.state.isSuccess) {
            return <Redirect to='/login' replace/>
        }
        const {errors} = this.state;
        return (
            <div>
                <Navigation/>
                <main className="fadeIn animated">
                    <PageHeader heading="Registro"/>
                    <Segment className='page-loader' style={{display: this.state.isLoading ? 'block' : 'none'}}>
                        <Dimmer active inverted>
                            <Loader size='large'>Registrando...</Loader>
                        </Dimmer>
                    </Segment>

                    <Grid
                        textAlign='center'
                        verticalAlign='middle'
                        className='login-form'
                    >
                        <Grid.Column style={{paddingTop: '100px', maxWidth: '450px'}}>
                            <Header as='h2' color='teal' textAlign='center'>
                                Registrar uma nova conta
                            </Header>
                            {this.state.responseError.isError && <Message negative>
                                <Message.Content>
                                    {this.state.responseError.text}
                                </Message.Content>
                            </Message>}
                            {this.state.isSuccess && <Message positive>
                                <Message.Content>
                                    Registro feito com sucesso ! <Link to='/login' replace>Login</Link> aqui
                                </Message.Content>
                            </Message>}
                            <Form size='large'>
                                <Segment stacked>
                                    <Form.Input
                                        fluid
                                        icon='user'
                                        iconPosition='left'
                                        name='name'
                                        placeholder='Nome'
                                        onChange={this.handleChange}
                                    />
                                    {errors.has('name') && <Header size='tiny' className='custom-error' color='red'>
                                        {errors.first('name')}
                                    </Header>}
                                    <Form.Input
                                        fluid
                                        icon='mail'
                                        iconPosition='left'
                                        name='email'
                                        placeholder='E-mail'
                                        onChange={this.handleChange}
                                    />
                                    {errors.has('email') && <Header size='tiny' className='custom-error' color='red'>
                                        {errors.first('email')}
                                    </Header>}
                                    <Form.Input
                                        fluid
                                        icon='lock'
                                        iconPosition='left'
                                        name='password'
                                        placeholder='Senha'
                                        type='password'
                                        onChange={this.handleChange}
                                    />
                                    {errors.has('password') && <Header size='tiny' className='custom-error' color='red'>
                                        {errors.first('password')}
                                    </Header>}
                                    <Form.Input
                                        fluid
                                        icon='refresh'
                                        iconPosition='left'
                                        name='password_confirmation'
                                        placeholder='Confirmar senha'
                                        type='password'
                                        onChange={this.handleChange}
                                    />
                                    {errors.has('password_confirmation') &&
                                    <Header size='tiny' className='custom-error' color='red'>
                                        {errors.first('password_confirmation')}
                                    </Header>}
                                    <Button color='teal' fluid size='large' onClick={this.handleSubmit}>Registrar</Button>
                                </Segment>
                            </Form>
                            <Message>
                                Já é registrado ? <Link to='/login' replace>Login</Link>
                            </Message>
                        </Grid.Column>
                    </Grid>
                </main>
                <Footer/>
            </div>
        );
    }
}

Page.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
};

export default Page;
