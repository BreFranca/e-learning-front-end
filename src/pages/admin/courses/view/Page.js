import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { API_URL } from "../../../../common/url-types";
import {
    Grid,
    Form,
    Input,
    TextArea,
    Button,
    Icon,
    Message,
    Segment,
    Label,
    Table,
    Confirm,
    Header
} from 'semantic-ui-react'
import {
    DatesRangeInput
} from 'semantic-ui-calendar-react';
import Admin from '../../Admin'
import Dropdown from "semantic-ui-react/dist/es/modules/Dropdown/Dropdown";
import Modal from "semantic-ui-react/dist/es/modules/Modal/Modal";

// CKEditor
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courseID: this.props.match.params.id,
            course: {
                title: '',
                slug: '',
                duration: '',
                start_date: '',
                end_date: '',
                description: '',
            },
            edit: false,
            lessons: [],
            lesson: {
                title: '',
                user_id: '',
                course_id: '',
                lesson_id: '',
                content: ''
            },
            modal: {
                type: '',
                open: false,
                message: ''
            },
            confirm: {
                open: false
            },
            file: {
                name: 'Nenhum arquivo',
                file: null,
            },
            datesRange: ''
        };

        this.handleEditor = this.handleEditor.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.updateCourse = this.updateCourse.bind(this);
        this.updateLesson = this.updateLesson.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
    }

    componentDidMount() {
        axios.get(`${ API_URL }/api/courses/${this.state.courseID}`)
            .then(res => {
                const course = res.data;
                let start_date, end_date, ranges;
                start_date = this.formatDateReverse(course.start_date);
                end_date = this.formatDateReverse(course.end_date);
                ranges = start_date + ' - ' + end_date;
                this.setState({course: course, datesRange: ranges});
            });

        // axios.get(`${ API_URL }/api/courses/${courseID}/lessons/`)
        // .then(res => {
        //     const lessons = res.data;
        //     this.setState({ lessons: lessons });
        //
        // this.state.lessons);
        // });
        this.loadingLessons();
    }

    handleEdit = (event) => {
        if (this.state.edit) {
            this.setState({
                edit: false
            })
        } else {
            this.setState({
                edit: true
            })
        }
    };

    updateCourse = (event) => {
        this.setState({
            course: {
                [event.target.name]: event.target.value
            }
        });
    };

    updateLesson = (event) => {
        this.setState({
            lesson: {
                ...this.state.lesson,
                [event.target.name]: event.target.value
            }
        });
    };

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
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

        axios.put(`${ API_URL }/api/courses/${this.state.courseID}`, {
            title: this.state.course.title,
            slug: this.state.course.slug,
            description: this.state.course.description,
            start_date: start_date,
            end_date: end_date,
            duration: this.state.course.duration
        })
            .then(res => {
                this.setState({
                    message: 'Curso atualizado com sucesso',
                    error: false,
                    success: true,
                });
            }).catch(error => {
            this.setState({
                message: error.message,
                error: true,
                success: false
            })
        })
    };

    handleSubmitLesson = (type) => {
        if (this.state.lesson.title !== '') {
            if (type === 'video-internal' || type === 'audio' || type === 'doc' || type === 'pdf') {
                this.fileUpload();
                this.closeModal();
                this.setState({
                    lesson: {
                        ...this.state.lesson,
                        file: {
                            file: null,
                            name: ''
                        },
                        type: '',
                        title: '',
                        content: ''
                    }
                });
            } else {
                axios.post(`${ API_URL }/api/courses/${this.state.courseID}/lessons`, {
                    type: this.state.modal.type,
                    title: this.state.lesson.title,
                    content: this.state.lesson.content,
                }).then(res => {
                    this.setState({
                        message: 'Lição criada com sucesso',
                        error: false,
                        success: true,
                        lesson: {
                            ...this.state.lesson,
                            type: '',
                            title: '',
                            content: ''
                        }
                    });
                    this.closeModal();
                    this.loadingLessons();
                }).catch(error => {
                    this.setState({
                        message: error.message,
                        error: true,
                        success: false
                    })
                });
            }
        } else {
            this.messageModal('Por favor preencha o título');
        }
    };

    handleEditLesson = (type, id) => {
        if (this.state.lesson.title !== '') {
            if (type === 'video-internal' || type === 'audio' || type === 'doc' || type === 'pdf') {
                this.fileUpload('PUT');
                this.closeModal();
                this.setState({
                    lesson: {
                        ...this.state.lesson,
                        type: '',
                        title: '',
                        content: ''
                    }
                });
            } else {
                axios.put(`${ API_URL }/api/courses/${this.state.courseID}/lessons/${id}`, {
                    type: this.state.modal.type,
                    title: this.state.lesson.title,
                    content: this.state.lesson.content,
                }).then(res => {
                    this.setState({
                        message: 'Lição criada com sucesso',
                        error: false,
                        success: true,
                        lesson: {
                            ...this.state.lesson,
                            type: '',
                            title: '',
                            content: ''
                        }
                    });
                    this.closeModal();
                    this.loadingLessons();
                }).catch(error => {
                    this.setState({
                        message: error.message,
                        error: true,
                        success: false
                    })
                });
            }
        } else {
            this.messageModal('Por favor preencha o título');
        }
    };

    messageModal = (message) => {
        this.setState({
            modal: {
                ...this.state.modal,
                message: message
            }
        })
    };

    loadingLessons = () => {
        axios.get(`${ API_URL }/api/courses/${this.state.courseID}/lessons/`)
            .then(res => {
                const lessons = res.data;
                this.setState({lessons: lessons});
            });
    };

    handleEditor = (event, editor) => {
        const data = editor.getData();
        this.setState({
            lesson: {
                ...this.state.lesson,
                content: data
            }
        });
    };

    handleConfirm = (event) => {
        let lessonID = event.target.value;
        this.setState({
            lessonID: lessonID,
            confirm: {open: true}
        })
    };

    handleDelete = () => {
        if (this.state.lessonID) {
            axios.delete(`${ API_URL }/api/courses/${this.state.courseID}/lessons/${this.state.lessonID}`)
                .then(res => {

                    this.loadingLessons();
                    this.setState({
                        message: 'Lição deletado',
                        error: false,
                        success: true,
                        confirm: {open: false}
                    })
                });
        }
    };

    openModal = type => () => this.setState({modal: {type: type, open: true, edit: false}});

    closeModal = () => this.setState({
        modal: {
            ...this.state.modal,
            type: '',
            open: false,
            message: ''
        }
    });

    showConfirm = () => this.setState({confirm: {open: true}});
    closeConfirm = () => this.setState({confirm: {open: false}});

    onChangeFile = (event) => {
        const file = event.target.files[0];
        const typeLesson = this.state.modal.type;
        if (typeLesson === 'video-internal') {
            if (
                file.type === 'video/mp4'
                || file.type === 'video/webm'
                || file.type === 'video/ogg'
                || file.type === 'video/ogv'
                || file.type === 'video/avi'
                || file.type === 'video/mpeg'
                || file.type === 'video/mov'
                || file.type === 'video/wmv'
                || file.type === 'video/3gp'
                || file.type === 'video/flv'
            ) {
                this.setState({
                    file: {
                        file: file,
                        name: file.name
                    }
                });
                this.messageModal('');
            } else {
                this.messageModal('Tipo de arquivo inválido.');
            }
        } else if (typeLesson === 'audio') {
            if (
                file.type === 'audio/mp3'
                || file.type === 'video/aac'
                || file.type === 'video/ogg'
                || file.type === 'video/wav'
                || file.type === 'video/mpeg'
                || file.type === 'video/webm'
                || file.type === 'video/wav'
                || file.type === 'video/wma'
                || file.type === 'video/ra'
                || file.type === 'video/aif'
                || file.type === 'video/aiff'
            ) {
                this.setState({
                    file: {
                        file: file,
                        name: file.name
                    }
                });
                this.messageModal('');
            } else {
                this.messageModal('Tipo de arquivo inválido.');
            }
        } else if (typeLesson === 'pdf' || typeLesson === 'doc') {
            if (
                file.type === 'application/pdf'
            ) {
                this.setState({
                    file: {
                        file: file,
                        name: file.name
                    }
                });
                this.messageModal('');
            } else {
                this.messageModal('Tipo de arquivo inválido.');
            }
        }
    };

    fileUpload = (type) => {
        const formData = new FormData();
        if(type === 'PUT') {
            formData.append('_method', type);
        }
        formData.append('title', this.state.lesson.title);
        formData.append('type', this.state.modal.type);
        formData.append('content', this.state.file.file);
        console.log(formData);

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        axios.post(`${ API_URL }/api/courses/${this.state.courseID}/lessons`, formData, config).then((res) => {
            this.loadingLessons();
        });
    };

    editLesson = (id) => {
        axios.get(`${ API_URL }/api/courses/${this.state.courseID}/lessons/${id}`)
            .then(res => {
                const lesson = res.data;
                this.setState({
                    lesson: lesson,
                    modal: {
                        type: lesson.type,
                        open: true,
                        edit: true
                    }
                });
                if(lesson.type === 'video-internal' || lesson.type === 'audio' || lesson.type === 'doc' || lesson.type === 'pdf') {
                    const archive = lesson.content.split('/');
                    const archiveCount = archive.length - 1;
                    this.setState({
                        file: {
                            type: lesson.type,
                            name: archive[archiveCount],
                        }
                    })
                }
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

    formatDateReverse = (date) => {
        const oldDate = date.split('-');
        let day, month, year;
        day = oldDate[0];
        month = oldDate[1];
        year = oldDate[2];
        const newDate = year + '/' + month + '/' + day;

        return newDate
    };

    render() {
        const {course, lessons} = this.state;
        return (
            <Admin heading={"Cursos"}>
                <Grid.Row>
                    {this.state.message ?
                        <Message floating success={this.state.success} negative={this.state.error}>
                            <Message.Header>{this.state.success ? 'Sucesso' : "Erro"}</Message.Header>
                            <p>
                                {this.state.message}
                            </p>
                        </Message>
                        : null}
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
                                                placeholder={course.title}
                                                value={course.title}
                                                name="title"
                                                onChange={this.updateCourse}
                                            />
                                            <Form.Field
                                                id='input-control-description'
                                                control={TextArea}
                                                label='Descrição'
                                                placeholder={course.description}
                                                value={course.description}
                                                name='description'
                                                onChange={this.updateCourse}
                                                style={{minHeight: 150}}/>
                                            {/*<Form.Field>*/}
                                            {/*<label>Autores</label>*/}
                                            {/*<Dropdown placeholder='Autores' fluid multiple selection options={this.state.options} value={this.state.author} onChange={this.handleChange}/>*/}
                                            {/*</Form.Field>*/}
                                        </Segment>
                                        <Grid verticalAlign='middle'>
                                            <Grid.Column width={12} floated='left'>
                                                <h3>Lições</h3>
                                            </Grid.Column>
                                            <Grid.Column width={4} floated='right' style={{textAlign: 'right'}}>
                                                <Dropdown text='Adicionar Lição' button floating>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item icon='file text' text="Texto" onClick={this.openModal('text')}/>
                                                        {/*<Dropdown.Item icon='cloud' text="Web content" onClick={this.openModal('webcontent')} />*/}
                                                        <Dropdown.Item icon='file video' text="Vídeo Interno" onClick={this.openModal('video-internal')}/>
                                                        <Dropdown.Item icon='file video outline' text="Vídeo Externo" onClick={this.openModal('video-external')}/>
                                                        <Dropdown.Item icon='file audio outline' text="Áudio" onClick={this.openModal('audio')}/>
                                                        <Dropdown.Item icon='file' text="Documento" onClick={this.openModal('doc')}/>
                                                        {/*<Dropdown.Item icon='attention' text="Scorm" onClick={this.openModal('text')} />*/}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Grid.Column>
                                        </Grid>
                                        <Segment.Group>
                                            <Segment>
                                                <Table singleLine>
                                                    <Table.Body>
                                                        {lessons.map((lesson) =>
                                                            <Table.Row key={lesson.id}>
                                                                <Table.Cell collapsing>
                                                                    <Icon name={'circle outline'}/>
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    {lesson.title}
                                                                </Table.Cell>
                                                                <Table.Cell collapsing>
                                                                    <Button.Group size='small'>
                                                                        {/*<Button icon='edit' basic color='green'*/}
                                                                                {/*value={this.state.courseID}*/}
                                                                                {/*onClick={this.editLesson.bind(this, lesson.id)}/>*/}
                                                                        {/*<Button icon='copy' basic color='blue' value={this.state.courseID} onClick={this.EditLesson} />*/}
                                                                        <Button icon='trash' basic color='red'
                                                                                value={lesson.id}
                                                                                onClick={this.handleConfirm}/>
                                                                    </Button.Group>
                                                                </Table.Cell>
                                                            </Table.Row>
                                                        )
                                                        }
                                                        <Confirm open={this.state.confirm.open}
                                                                 onCancel={this.closeConfirm}
                                                                 onConfirm={this.handleDelete}/>
                                                    </Table.Body>
                                                </Table>
                                            </Segment>
                                        </Segment.Group>
                                    </Grid.Column>
                                    <Grid.Column width={4}>
                                        <Segment color="black">
                                            <Form.Field
                                                id='input-control-slug'
                                                control={Input}
                                                label='Slug'
                                                name="slug"
                                                placeholder={course.slug}
                                                value={course.slug}
                                                onChange={this.updateCourse}
                                            />
                                            <Form.Field
                                                id='input-control-duration'
                                                control={Input}
                                                label='Duração (Horas)'
                                                name="duration"
                                                placeholder={course.duration}
                                                value={course.duration}
                                                onChange={this.updateCourse}
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
                                                        onChange={this.handleChangeDate}/>
                                                </label>
                                            </Form.Field>
                                        </Segment>
                                        <Grid>
                                            <Grid.Row>
                                                <Grid.Column floated='left' width={8}>
                                                    <Form.Field
                                                        id='button-control-confirm'
                                                        control={Button}
                                                        content='Atualizar'
                                                        positive
                                                        onClick={this.handleSubmit}
                                                    />
                                                </Grid.Column>
                                                <Grid.Column floated='right' width={8} style={{textAlign: 'right'}}>
                                                    <Button
                                                        as={Link}
                                                        to={'/courses/' + course.id + '/details'}
                                                        basic
                                                        content={'Ver Curso'}
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Form>
                    </Grid.Column>
                </Grid.Row>

                <Modal dimmer={'blurring'} open={this.state.modal.open} onClose={this.closeModal}>
                    <Modal.Header>Criar uma Lição</Modal.Header>
                    <Modal.Content scrolling>
                        <Form>
                            <Form.Group widths='equal'>
                                <Form.Field control={Input} label='Título' placeholder='Título' name='title'
                                            value={this.state.lesson.title} onChange={this.updateLesson}/>
                            </Form.Group>
                            {this.state.modal.type === 'text' ?
                                <Form.Field>
                                    <label>Conteúdo</label>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={this.state.lesson.content}
                                        onInit={editor => {
                                            // You can store the "editor" and use when it is needed.
                                            console.log('Editor is ready to use!', editor);
                                        }}
                                        onChange={this.handleEditor}
                                        config={
                                            {
                                                removePlugins: ['Link', 'ImageUpload', 'MediaEmbed']
                                            }
                                        }
                                    />
                                </Form.Field>
                                : null}
                            {this.state.modal.type === 'webcontent' ?
                                <Form.Field>
                                    <label htmlFor="web-content">Conteúdo online</label>
                                    <Input placeholder='Url' name="web-content" id="web-content"
                                           onChange={this.updateLesson}/>
                                </Form.Field>
                                : null}
                            {this.state.modal.type === 'video-external' ?
                                <Form.Field>
                                    <label htmlFor="web-content">Conteúdo online</label>
                                    <Input placeholder='Url' name="content" id="web-content"
                                           onChange={this.updateLesson}/>
                                </Form.Field>
                                : null}
                            {this.state.modal.type === 'video-internal' || this.state.modal.type === 'audio' || this.state.modal.type === 'doc' ?
                                <React.Fragment>
                                    <Grid columns={1}>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <p>{this.state.file.name}</p>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                    <Grid verticalAlign='middle' columns={3}>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Label
                                                    floated={'left'}
                                                    as="label"
                                                    basic
                                                    htmlFor="upload">
                                                    <Button
                                                        icon="upload"
                                                        label={{
                                                            basic: true,
                                                            content: 'Selecione o Arquivo'
                                                        }}
                                                        htmlFor="upload"
                                                        labelPosition="right"
                                                    />
                                                    <input
                                                        hidden
                                                        id="upload"
                                                        type="file"
                                                        onChange={this.onChangeFile}/>
                                                </Label>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Header floated={'left'} as='h5'>
                                                    <small>
                                                        Formatos aceitos: mp4, webm, ogg, ogv,
                                                        <br/> avi, mpeg, mpg, mov, wmv, 3gp, flv
                                                        <br/>Max file size: 20 MB
                                                    </small>
                                                </Header>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </React.Fragment>
                                : null}
                        </Form>
                        {this.state.modal.message ?
                            <Message warning attached='bottom'>
                                <p>{this.state.modal.message}</p>
                            </Message>
                            : null}
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='black' onClick={this.closeModal}>
                            Cancelar
                        </Button>
                        {this.state.modal.edit ?
                            <Button
                                positive
                                icon='checkmark'
                                labelPosition='right'
                                content="Editar Lição"
                                onClick={this.handleEditLesson.bind(this, this.state.modal.type, this.state.lesson.id)}
                            />
                        :
                            <Button
                                positive
                                icon='checkmark'
                                labelPosition='right'
                                content="Criar Lição"
                                onClick={this.handleSubmitLesson.bind(this, this.state.modal.type)}
                            />
                        }
                    </Modal.Actions>

                </Modal>
            </Admin>
        );
    }
}

export default Page;
