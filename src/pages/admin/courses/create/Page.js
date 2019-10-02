import React from 'react'
import { API_URL } from "../../../../common/url-types";
import axios from 'axios'
import {
    Form,
    Input,
    Grid,
    Button,
    Segment,
    Message,
    TextArea,
    Dropdown
} from 'semantic-ui-react'
import {
    DatesRangeInput
} from 'semantic-ui-calendar-react';
import Admin from '../../Admin'
import { Redirect } from "react-router-dom";

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            success: false,
            message: '',
            authors: [],
            options: [],
            lessons: {

            },
            start_date: '',
            end_date: '',
            datesRange: '',
            courseID: '',
            courseEdit: false,
            author: '',
        }
    };

    getData = () => {
        axios.get(`${ API_URL }/api/authors/`)
            .then(res => {
                const authors = res.data;
                console.log(authors);
                authors.map((author) => {
                    this.setState({
                        options: [
                            ...this.state.options,
                            {
                                key: author.id,
                                text: author.name,
                                value: author.name
                            }
                        ]
                    })
                    return true
                });
            })
    };

    componentDidMount() {
        this.getData();
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleChangeDate = (event, {name, value}) => {
        this.setState({
            datesRange: value
        })
    };

    handleSubmit = event => {
        event.preventDefault();

        const date = this.state.datesRange.split(' ');
        let start_date = date[0];
        let end_date = date[2];

        start_date = this.formatDate(start_date);
        end_date = this.formatDate(end_date);

        axios.post(`${ API_URL }/api/courses`, {
            title: this.state.title,
            slug: this.state.slug,
            description: this.state.description,
            start_date: start_date,
            end_date: end_date,
            duration: this.state.duration
         }).then(res => {
            this.setState({
                message: 'Usuário criado com sucesso',
                error: false,
                success: true,
                courseID: res.data,
                courseEdit: true
            });
        }).catch(error => {
            this.setState({
                message: error.message,
                error: true,
                success: false
            })
        });
    };

    handleDelete = () => {
        console.log('delete');
    };

    handleCopy = () => {
        console.log('Copy');
    };

    handleEditor = ( event, editor ) => {
        const data = editor.getData();
        this.setState({
            lesson: {
                content: data
            }
        });
    };

    openModal = type => () => this.setState({ modal: { type: type, open: true} });

    closeModal = () => this.setState({ modal: { open: false } });

    openAuthor = () => {
        this.setState({
            createAuthor: !this.state.createAuthor
        });
    };

    createAuthor = (name) => {
        axios.post(`${ API_URL }/api/authors/`, { name: name })
            .then(res => {
                this.setState({ author: '', options: [] });
                this.getData();
                this.openAuthor();
            });
    };

    formatDate = (date) => {
        const oldDate = date.split('/');
        let day, month, year;
        day = oldDate[0];
        month = oldDate[1];
        year = oldDate[2];
        const newDate = year + '-' + month + '-' + day;

        return newDate
    };

    changeAuthors = (e, { value }) => this.setState({ authors: value })

    render() {
        const { authors, options } = this.state;
        if (this.state.courseEdit === true) {
            return <Redirect to={'/admin/courses/' + this.state.courseID} />
        }
        return (
            <Admin heading="Create">
                <Grid.Row>
                    {this.state.message ?
                    <Message success={this.state.success} negative={this.state.error}>
                        <Message.Header>{this.state.success ? 'Sucesso' : "Erro" }</Message.Header>
                        <p>
                            {this.state.message}
                        </p>
                    </Message>
                    : null }
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Form>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={12}>
                                        <Segment color="black">
                                            <Form.Field
                                                id='input-control-title'
                                                control={Input}
                                                label='Título'
                                                placeholder='Título'
                                                name="title"
                                                onChange={this.handleChange}
                                            />
                                            <Form.Field
                                                id='input-control-description'
                                                control={TextArea}
                                                label='Descrição'
                                                placeholder='Descrição'
                                                name='description'
                                                onChange={this.handleChange}
                                                style={{ minHeight: 150 }} />
                                        </Segment>
                                    </Grid.Column>
                                    <Grid.Column width={4}>
                                        <Segment color="black">
                                            <Form.Field
                                                id='input-control-slug'
                                                control={Input}
                                                label='Slug'
                                                name="slug"
                                                disabled
                                                placeholder='Slug'
                                                onChange={this.handleChange}
                                            />
                                            <Form.Field
                                                id='input-control-duration'
                                                control={Input}
                                                type='number'
                                                label='Duração (Horas)'
                                                name="duration"
                                                placeholder='Duração Horas'
                                                onChange={this.handleChange}
                                            />
                                            <Form.Field>
                                                <label>Data
                                                    <DatesRangeInput
                                                        name="datesRange"
                                                        dateFormat='DD/MM/YYYY'
                                                        placeholder="Início - Término"
                                                        value={this.state.datesRange}
                                                        iconPosition="left"
                                                        closable={true}
                                                        onChange={this.handleChangeDate} />
                                                </label>
                                            </Form.Field>
                                            <Form.Field>
                                                <label>Autores</label>
                                                <Grid>
                                                    <Grid.Row>
                                                        <Grid.Column width={12}>
                                                            <Dropdown placeholder='Autores' fluid multiple search selection options={options} value={authors}
                                                                      onChange={this.changeAuthors}/>
                                                        </Grid.Column>
                                                        <Grid.Column width={2}>
                                                            <Button circular icon={this.state.createAuthor ? 'minus' : 'plus'} onClick={this.openAuthor} />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                            </Form.Field>
                                            {this.state.createAuthor ?
                                            <React.Fragment>
                                                <Form.Field>
                                                    <input
                                                        id='input-control-author'
                                                        type='text'
                                                        name="author"
                                                        placeholder='Nome do Autor'
                                                        onChange={this.handleChange}
                                                    />
                                                </Form.Field>
                                                <Form.Field>
                                                    <Button content='Adicionar Autor' onClick={this.createAuthor.bind(this, this.state.author)} style={{ width: '100%' }}/>
                                                </Form.Field>
                                            </React.Fragment>
                                            : null }
                                        </Segment>
                                        <Form.Field
                                            id='button-control-confirm'
                                            control={Button}
                                            content='Criar'
                                            positive
                                            onClick={this.handleSubmit}
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Admin>
        );
    }
}

export default Page;
