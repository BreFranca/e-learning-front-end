import React from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import {
    Button,
    Container,
    Icon,
    Segment,
    Card,
    Image
} from 'semantic-ui-react'
import PageHeader from '../../common/pageHeader'
import Navigation from '../../common/navigation'
import Footer from '../../common/mainFooter'
import { API_URL } from "../../common/url-types";

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            message: '',
            courseID: '',
            viewCourse: false
        }
        this.favoriteCourse = this.favoriteCourse.bind(this);
    }

    getData = () => {
        axios.get(`${ API_URL }/api/courses`)
            .then(res => {
                const courses = res.data;
                this.setState({ courses: courses });
            })
    };

    componentDidMount() {
        this.getData();
    };

    viewCourse = (courseID) => {
        if(this.props.isAuthenticated) {
            axios.get(`${ API_URL }/api/users/${this.props.user.id}/courses/${courseID}`)
                .then(res => {
                    const {data} = res;
                    if (!data.view) {
                        axios.post(`${ API_URL }/api/users/${this.props.user.id}/courses/${courseID}`);
                        axios.put(`${ API_URL }/api/users/${this.props.user.id}/courses/${courseID}`, {view: 1});
                    }
                    this.setState({courseID: courseID, viewCourse: true});
                })
        } else {
            axios.get(`${ API_URL }/api/courses/${courseID}`)
                .then(res => {
                    this.setState({courseID: courseID, viewCourse: true});
                })
        }
    };

    favoriteCourse = (id) => {
        axios.get(`${ API_URL }/api/users/${this.props.user.id}/courses/${id}`)
            .then(res => {
                const { data } = res;
                if(data.favorite === null) {
                    axios.put(`${ API_URL }/api/users/${this.props.user.id}/courses/${id}`, {
                        favorite: 1
                    });
                } else if(data.favorite === 0) {
                    axios.put(`${ API_URL }/api/users/${this.props.user.id}/courses/${id}`, {
                        favorite: 1
                    });
                } else {
                    axios.put(`${ API_URL }/api/users/${this.props.user.id}/courses/${id}`, {
                        favorite: 0
                    });
                }
            });
    };

    formatDate = (date) => {
        if(date) {
            const newDate = date.split('-');
            const day = newDate[2].split(' ');
            const formatedDate = day[0] + '/' + newDate[1] + '/' + newDate[0];
            return formatedDate;
        }
    };

    render() {
        const { courses } = this.state;
        if (this.state.viewCourse === true) {
            return <Redirect to={'/courses/' + this.state.courseID + '/details'} />
        }

        return (
            <div>
                <Navigation/>
                <main className="fadeIn animated">
                    <PageHeader heading="Cursos"/>
                    <Segment vertical textAlign='center' style={{minHeight: '100vh'}}>
                        <Container>
                            <Card.Group itemsPerRow={3}>
                                { courses.map((course) => 
                                <Card color='red' key={course.id}>
                                    <Card.Content header={ course.title } />
                                    {course.image ?
                                        <Image src={course.image} />
                                    : null }
                                    <Card.Content>
                                        <Card.Meta>
                                            <span className='date'>Criado em { this.formatDate(course.created_at) }</span>
                                        </Card.Meta>
                                        <Card.Description>{ course.description }</Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <div className='ui two buttons'>
                                            <Button basic color='green' onClick={this.viewCourse.bind(this, course.id)}>
                                                Detalhes
                                            </Button>
                                        </div>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                            <span floated={'left'}>
                                                <Icon name='eye' />
                                                { course.viewed }
                                            </span>
                                            {/*{isAuthenticated ?*/}
                                            {/*<a onClick={this.favoriteCourse.bind(this, course.id)}>*/}
                                                {/*<Icon name={course.favorite ? 'heart' : 'heart outline'} />*/}
                                                {/*{ course.favorited }*/}
                                            {/*</a>*/}
                                            {/*: null }*/}
                                        </div>
                                    </Card.Content>
                                </Card>
                                    )
                                }
                            </Card.Group>
                        </Container>
                    </Segment>
                </main>
                <Footer/>
            </div>
        );
    }
}

export default Page;
