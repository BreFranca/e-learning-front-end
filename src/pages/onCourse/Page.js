import React from 'react'
import { Link, Redirect } from 'react-router-dom'
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
    Step,
    Progress,
    Modal
} from 'semantic-ui-react'
import Navigation from '../../common/navigation'
import Footer from '../../common/mainFooter'
import {API_URL} from "../../common/url-types";
import "video-react/dist/video-react.css";
import { Player } from 'video-react';
import ReactPlayer from 'react-player'

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courseID: this.props.match.params.id,
            user: this.props.user,
            course: {
                id: '',
                title: '',
                create_at: '',
                description: ''
            },
            message: '',
            onCourse: false,
            progress: 0,
            endLessons: 0,
            lessonsCount: 0,
            notFound: false,
            last: '',
            modal: {
                open: false
            },
        }
    }

    getData = () => {
        axios.get(`${ API_URL }/api/users/${this.state.user.id}/courses/${this.state.courseID}`)
            .then(res => {
                if(res.data.progress != null) {
                    const progress = res.data.progress;
                    const course = res.data;
                    this.setState({ course: course, progress: progress });
                } else {
                    this.setState({ onCourse: true })
                }
            }).catch(res => {
                // this.setState({ notFound: true })
            });

        axios.get(`${ API_URL }/api/users/${this.state.user.id}/courses/${this.state.courseID}/lessons`)
        .then(res => {
            const lessons = res.data.lessons;
            let endLessons = lessons.filter(lesson => {
                if (lesson.view === false || lesson.view === null) {
                    return lessons
                }
                return true
            });

            if(endLessons.length > 0) {
                this.setState({
                    lesson: endLessons[0]
                });
            } else {
                this.setState({
                    last: true
                })
            }

            const last = lessons.length - 1;

            this.setState({
                last: lessons[last].id,
                lessons: lessons,
                lessonsCount: lessons.length,
                endLessons: endLessons.length,
            });
        });
    };

    componentDidMount() {
        this.getData();
    }

    getLessons = () => {
        axios.get(`${ API_URL }/api/users/${this.state.user.id}/courses/${this.state.courseID}/lessons`)
            .then(res => {
                const lessons = res.data.lessons;
                let endLessons = lessons.filter(lesson => {
                    if (lesson.view === false || lesson.view === null) {
                        return lessons
                    }
                    return true
                });

                this.setState({
                    lessons: lessons,
                    lessonsCount: lessons.length,
                    endLessons: endLessons.length,
                });
            });
    };

    getLesson = (id) => {
        axios.get(`${ API_URL }/api/users/${this.state.user.id}/courses/${this.state.courseID}/lessons/${id}`)
        .then(res => {
            const lesson = res.data.lessons;
            this.setState({lesson: lesson})
        });
    };

    nextLesson = () => {
        axios.get(`${ API_URL }/api/users/${this.state.user.id}/courses/${this.state.courseID}/lessons`)
            .then(res => {
                const lessons = res.data.lessons;
                let endLessons = lessons.filter(lesson => {
                    if (lesson.view === false || lesson.view === null) {
                        return lessons
                    }
                    return true
                });

                if(endLessons.length > 0) {
                    this.setState({
                        lesson: endLessons[0]
                    });
                } else {
                    this.setState({
                        last: true
                    });
                }

                this.setState({
                    lessons: lessons,
                    lessonsCount: lessons.length,
                    endLessons: endLessons.length,
                });
            });
    };

    endLesson = (id) => {
        axios.get(`${ API_URL }/api/users/${this.state.user.id}/courses/${this.state.courseID}`)
            .then(res => {
                const course = res.data;
                let percentLesson = 100 / this.state.lessonsCount;
                let progress = parseFloat(course.progress) + parseFloat(percentLesson);
                progress = progress.toFixed(0);
                if(progress >= 98) {
                    progress = 100;
                }
                this.setState({ course: course });
                this.updateProgress(progress);
            });

        const day = new Date();
        const finish = day.getFullYear() + '-' + day.getMonth() + '-' + day.getDate();

        axios.put(`${ API_URL }/api/users/${this.state.user.id}/courses/${this.state.courseID}/lessons/${id}`, {
            view: 1,
            finish: finish
        })
            .then(res => {
                this.getLessons();
                this.getLesson(id);
            });

    };

    updateProgress = (progress) => {
        axios.put(`${ API_URL }/api/users/${this.state.user.id}/courses/${this.state.courseID}`, {
            progress: progress
        })
            .then(() => {
                    this.setState({ progress: progress });
                    if(progress === 100) {
                        this.openModal();
                    }
                }
            );
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

    openModal = () => this.setState({ modal: { open: true} });
    closeModal = () => this.setState({
        modal: {
            ...this.state.modal,
            open: false,
            message: ''
        }
    });

    render() {
        const { course, modal, courseID, lessons, lesson, progress } = this.state;
        if (this.state.onCourse === true) {
            return <Redirect to={'/courses/' + courseID + '/details'} />
        } else if(this.state.notFound) {
            return <Redirect from='*' to='/404' />
        }
        return (
            <div>
                <Navigation/>
                <main className="fadeIn animated">
                    <div style={{
                        background: '#A2A2A2',
                        marginBottom: '5em'
                    }}>
                        <Container>
                            <Header
                                as='h1'
                                content={course.title}
                                inverted
                                style={{
                                    fontSize: '3em',
                                    fontWeight: 'normal',
                                    paddingBottom: '1em',
                                    paddingTop: '1em',
                                }}
                            />
                        </Container>
                    </div>
                    <Container>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <Progress percent={progress} progress autoSuccess />
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <Step.Group vertical size='mini'>
                                        {
                                            lessons ?
                                                lessons.map((lesson) =>
                                                    <Step completed={lesson.view != null} link onClick={this.getLesson.bind(this, lesson.id)} key={lesson.id}>
                                                        <Icon name={this.formatIcons(lesson.type)} />
                                                        <Step.Content>
                                                            <Step.Title>{lesson.title}</Step.Title>
                                                        </Step.Content>
                                                    </Step>
                                                ) : null
                                        }
                                    </Step.Group>
                                </Grid.Column>
                                {lesson ?
                                <Grid.Column width={11}>
                                    <Segment>
                                        <Header as='h2'>{lesson.title}</Header>
                                        <Divider />
                                            <div>
                                                {lesson.type === 'text' ?
                                                    <div dangerouslySetInnerHTML={{ __html: lesson.content }}></div>
                                                : null }
                                                {lesson.type === 'video-internal' ?
                                                    <Player
                                                        playsInline
                                                        poster="/assets/poster.png"
                                                        src={API_URL + '/api/courses/'+ courseID +'/lessons/'+ lesson.id +'/media'}
                                                    />
                                                : null }
                                                {lesson.type === 'video-external' ?
                                                    <ReactPlayer url={lesson.content} controls width={'100%'} height={450} />
                                                : null }
                                                {lesson.type === 'ppt' ?
                                                    lesson.content
                                                : null }
                                                {lesson.type === 'doc' || lesson.type === 'pdf' ?
                                                    <iframe title='Course' src={lesson.content + '#toolbar=0'} width="100%" height="700px" />
                                                : null }
                                                {lesson.type === 'audio' ?
                                                    <audio controls controlsList="nodownload">
                                                        <source
                                                            src={API_URL + '/api/courses/'+ courseID +'/lessons/'+ lesson.id +'/media'}
                                                            type={lesson.mime}
                                                        />
                                                        Your browser does not support the audio element.
                                                    </audio>
                                                : null }
                                            </div>
                                    </Segment>
                                    {!lesson.view ?
                                        <Button positive floated='right' onClick={this.endLesson.bind(this, lesson.id)}>Finalizar
                                            lição</Button>
                                        :
                                        this.state.last !== lesson.id ?
                                            <Button positive basic floated='right' onClick={this.nextLesson.bind(this, lesson.id)}>Próxima lição</Button>
                                        : null
                                    }
                                </Grid.Column>
                                : null }
                            </Grid.Row>
                        </Grid>
                    </Container>
                </main>
                <Footer/>
                <Modal size={'tiny'} dimmer={'blurring'} open={modal.open} onClose={this.close}>
                    <Modal.Content style={{ textAlign: 'center' }}>
                        <Image wrapped size='medium' src='/images/conclusion.jpg' style={{ display: 'block', margin: '0 auto' }} />
                        <Modal.Description style={{ paddingTop: '20px' }}>
                            <Header>Parabéns {this.props.user.name} você concluiu o curso</Header>
                            <p>Você concluiu o curso de { course.title }</p>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions style={{ textAlign: 'center' }}>
                        <Button color='black' onClick={this.closeModal} content="Voltar" />
                        <Button
                            positive
                            content="Ir para a Lista de Cursos"
                            as={Link}
                            to={'/courses'}
                        />
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}

export default Page;
