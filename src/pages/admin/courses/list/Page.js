import React from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from "../../../../common/url-types"
import {
    Button,
    Table,
    Grid,
    Menu,
    Message,
    Confirm
} from 'semantic-ui-react'
import Admin from '../../Admin'
import axios from 'axios'

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            course: '',
            courses: [],
            message: '',
            error: false,
            success: false,
            redirect: false,
            open: false,
        };

        this.handleDelete = this.handleDelete.bind(this)
    }

    componentDidMount() {
        axios.get(`${ API_URL }/api/courses`)
          .then(res => {
            const courses = res.data;
            this.setState({ courses: courses });
            console.log(res.data);
        });
        console.log(this.state.courses);
    }

    show = () => this.setState({ open: true });
    close = () => this.setState({ open: false });

    handleConfirm = (event) => {
        let courseID = event.target.value;
        this.setState({
            course: courseID,
            open: true
        })
    };

    handleDelete = () => {
        let courseID = this.state.course;
        axios.delete(`${ API_URL }/api/courses/${courseID}`)
        .then(res => {
            console.log(res);
            console.log(res.data);
            this.setState({
                message: 'Curso deletado',
                error: false,
                success: true,
            });
        });

        const courses = this.state.courses;
        let newCourses = courses.filter(course => {
            if (course.id !== courseID) {
                return courses !== courseID
            }
            return courses
        });
        this.setState({
            courses: newCourses,
            open: false
        })
    };

    render() {
        const { courses } = this.state;
        return (
            <Admin heading='Cursos' createLink='/admin/courses/create'>
                <Grid.Column width={16}>
                    {this.state.message ?
                    <Message success={this.state.success} negative={this.state.error}>
                        {/* <Message.Header>{this.state.success ? 'Sucesso' : "Erro" }</Message.Header> */}
                        <p>
                            {this.state.message}
                        </p>
                    </Message>
                    : null }
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell colSpan='4'>Lista</Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                                <Table.HeaderCell>Título</Table.HeaderCell>
                                <Table.HeaderCell>Duração</Table.HeaderCell>
                                <Table.HeaderCell>Descrição</Table.HeaderCell>
                                <Table.HeaderCell>  </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                    
                        <Table.Body>
                            { courses.map((course) => 
                                <Table.Row key={course.id}>
                                    <Table.Cell>
                                        <Menu.Item as={ Link } to={'/admin/courses/' + course.id}>
                                            {course.title}
                                        </Menu.Item>
                                    </Table.Cell>
                                    <Table.Cell>{course.duration}</Table.Cell>
                                    <Table.Cell>{course.description}</Table.Cell>
                                    <Table.Cell collapsing textAlign="right">
                                        <Button.Group size='small'>
                                            <Button icon='eye' as={Link} to={'/courses/'+ course.id +'/details'} color='green' />
                                            <Button icon='trash' onClick={this.handleConfirm} value={course.id} color='red' />
                                        </Button.Group>
                                    </Table.Cell>
                                    </Table.Row>
                                    )
                                }
                            <Confirm open={this.state.open} onCancel={this.close} onConfirm={this.handleDelete} />
                        </Table.Body>
                    </Table>
                </Grid.Column>
            </Admin>
        );
    }
}

export default Page;
