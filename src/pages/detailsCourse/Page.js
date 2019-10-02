import React from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import {
    Button,
    Container,
    Grid,
    Header,
    Icon,
    Segment,
    Image,
    Divider,
    List,
    Tab
} from 'semantic-ui-react'
import Navigation from '../../common/navigation'
import Footer from '../../common/mainFooter'
import {API_URL} from "../../common/url-types";

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courseID: this.props.match.params.id,
            course: {
                id: '',
                title: '',
                create_at: '',
                description: ''
            },
            message: '',
            onCourse: false
        }
    }

    getData = () => {
        if(this.props.isAuthenticated) {
            axios.get(`${ API_URL }/api/users/${this.props.user.id}/courses/${this.state.courseID}`)
                .then(res => {
                    const {data} = res;
                    if(!data.view) {
                        axios.post(`${ API_URL }/api/users/${this.props.user.id}/courses/${this.state.courseID}`);
                        axios.put(`${ API_URL }/api/users/${this.props.user.id}/courses/${this.state.courseID}`, {view: 1});
                    }
                    this.setState({ progress: data.progress });
                });
            axios.get(`${ API_URL }/api/courses/${this.state.courseID}`)
                .then(res => {
                    const course = res.data;
                    this.setState({ course: course });
                });
        } else {
            axios.get(`${ API_URL }/api/courses/${this.state.courseID}`)
                .then(res => {
                    const course = res.data;
                    this.setState({ course: course });
                });
        }
        this.getLessons();
    };

    componentDidMount() {
        this.getData();
    }

    getLessons = () => {
        axios.get(`${ API_URL }/api/courses/${this.state.courseID}/lessons`)
        .then(res => {
            const lessons = res.data;
            this.setState({ lessons: lessons, lessonsCount: lessons.length });
        });
    };

    startCourse = () => {
        axios.get(`${ API_URL }/api/users/${this.props.user.id}/courses/${this.state.courseID}`)
        .then(res => {
            if(res.data.progress === null) {
                this.updateCourse();
            }
            this.setState({ onCourse: true });
        });
    };

    updateCourse = () => {
        axios.put(`${ API_URL }/api/users/${this.props.user.id}/courses/${this.state.courseID}`, {
            progress: 0,
        })
            .then(res => {
                this.setState({ onCourse: true });
            });
    };

    formatIcons = (type) => {
        let icon = 'file';
        switch(type) {
            case 'text':
                icon = icon + ' outline';
                break;
            case 'video-internal':
                icon = icon + ' video';
                break;
            case 'video-external':
                icon = icon + ' video outline';
                break;
            case 'audio':
                icon = icon + ' audio outline';
                break;
            default:
                icon = 'file';
        }
        return icon;
    };

    render() {
        const { course, courseID, lessons, progress } = this.state;
        const { isAuthenticated } = this.props;
        if (this.state.onCourse === true) {
            return <Redirect to={'/courses/' + courseID} />
        }
        const panes = [
            { menuItem: 'Descrição', render: () => <Tab.Pane attached={false}>{course.description}</Tab.Pane> },
            { menuItem: 'Lições', render: () => <Tab.Pane attached={false}>
                    {
                        lessons.map((lesson) =>
                            <List divided verticalAlign='middle' key={lesson.id}>
                                <List.Item style={{paddingTop: '1em', paddingBottom: '1em'}}>
                                    <Icon name={this.formatIcons(lesson.type)} />
                                    <List.Content>{lesson.title}</List.Content>
                                </List.Item>
                            </List>
                        )
                    }
                </Tab.Pane> },
            { menuItem: 'Autores', render: () => <Tab.Pane attached={false}>{course.instructor}</Tab.Pane> },
        ];
        return (
            <div>
                <Navigation/>

                <main className="fadeIn animated">
                    <Container style={{ marginTop: '5em' }}>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={11}>
                                    <Segment basic>
                                        <Header as='h2' floated='left'>
                                            {course.title}
                                        </Header>
                                        {isAuthenticated ?
                                            <Button size='big' basic color='blue' floated='right' onClick={this.startCourse}>
                                                {progress != null ? "Continuar Curso" : "Iniciar Curso" }
                                            </Button>
                                        :
                                            <Button size='big' basic color='blue' floated='right' onClick={this.startCourse}>Iniciar Curso</Button>
                                        }
                                    </Segment>
                                    <Divider hidden clearing />
                                    <Divider />
                                    {course.image ?
                                        <Image src={course.image} />
                                    : null }
                                    <Divider hidden />
                                    <Tab color='blue' attached={'true'} menu={{ secondary: true }} panes={panes} />
                                </Grid.Column>
                                <Grid.Column width={5}>
                                    <Segment>
                                        <Header as='h2'>Detalhes do Curso</Header>
                                        <Divider />
                                        <List divided verticalAlign='middle'>
                                            <List.Item style={{paddingTop: '1em', paddingBottom: '1em'}}>
                                                <List.Content floated='right'>{this.state.lessonsCount}</List.Content>
                                                <Icon name='file' />
                                                <List.Content>Lições</List.Content>
                                            </List.Item>
                                            <List.Item style={{paddingTop: '1em', paddingBottom: '1em'}}>
                                                <List.Content floated='right'>{course.duration}</List.Content>
                                                <Icon name='clock outline' />
                                                <List.Content>Duração</List.Content>
                                            </List.Item>
                                            <List.Item style={{paddingTop: '1em', paddingBottom: '1em'}}>
                                                <List.Content floated='right'>{course.start_date}</List.Content>
                                                <Icon name='calendar alternate' />
                                                <List.Content>Data de Início</List.Content>
                                            </List.Item>
                                            <List.Item style={{paddingTop: '1em', paddingBottom: '1em'}}>
                                                <List.Content floated='right'>{course.end_date}</List.Content>
                                                <Icon name='calendar alternate' />
                                                <List.Content>Data de Término</List.Content>
                                            </List.Item>
                                        </List>
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                </main>
                <Footer/>
            </div>
        );
    }
}

export default Page;
