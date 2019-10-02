import React from 'react'
import {
    Button,
    Container,
    Header,
    Responsive,
    Segment
} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import AuthService from '../../services'
import Navigation from '../../common/navigation'
import Footer from '../../common/mainFooter'

class Page extends React.Component {
    componentDidMount() {
        const social = this.props.match.params.social
        const params = this.props.location.search;

        setTimeout(function() { 

        if (params && social) {
            this.props.dispatch(AuthService.socialLogin({ params, social }))
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

        }.bind(this), 1000);
    }

    render() {
        return (
            <div>
                <Navigation/>
                <main className="fadeIn animated">
                    <Segment
                        inverted
                        textAlign='center'
                        className='home-header'
                        vertical
                    >
                        <Container text>
                            <Responsive minWidth={769}>
                                <Header
                                    as="h1"
                                    content="E-learning React"
                                    inverted
                                    className="pretitle"
                                />
                            </Responsive>
                            <Header
                                as='p'
                                content='Seja bem-vindo(a) ao E-learning React – Cursos  com certificado de conclusão válido para: atividades extracurriculares, avaliações de empresas, provas de títulos, concursos públicos, enriquecer o seu currículo e muito mais!'
                                inverted
                                className="main-heading"
                            />
                            <Button as={Link} to='/register' color="teal" size='huge' className="free-signup-button"> Registrar </Button>
                        </Container>
                    </Segment>
                    <div className="course-tour">
                        <Container textAlign="center" style={{padding: '2em 0em'}}>
                            <Header as="h3" content="A importância da qualificação profissional"/>
                            <p>Por conta da alta concorrência e competitividade, o mercado de trabalho está cada vez mais exigente na seleção de profissionais e quem está mais preparado tem mais oportunidades. A qualificação, portanto, é uma ferramenta fundamental para o sucesso profissional, sendo um fator determinante tanto para aqueles que estão em busca de uma vaga, para quem deseja crescer na empresa e para quem pensa em manter sua posição.</p>
                        </Container>
                    </div>
                </main>
                <Footer/>
            </div>
        );
    }
}

export default Page;
