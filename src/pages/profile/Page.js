import React from 'react'
import axios from 'axios'
import {
    Container,
    Segment
} from 'semantic-ui-react'
import Navigation from '../../common/navigation'
import Footer from '../../common/mainFooter'
import {API_URL} from "../../common/url-types";

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            message: '',
            courseID: '',
            viewCourse: false
        }
    }

    componentDidMount() {
        axios.get(`${ API_URL }/api/courses`)
          .then(res => {
            const courses = res.data;
            this.setState({ courses: courses });
        })
    }

    render() {
        return (
            <div>
                <Navigation/>
                <main className="fadeIn animated">
                    <Segment vertical textAlign='center' style={{minHeight: '100vh'}}>
                        <Container>
                        </Container>
                    </Segment>
                </main>
                <Footer/>
            </div>
        );
    }
}

export default Page;
