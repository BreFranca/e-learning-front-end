import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import { Grid, Button } from 'semantic-ui-react'
import Topbar from '../../common/topbar'
import Sidebar from '../../common/sidebar'

class Admin extends React.Component {
    render() {
        return (
            <div>
                <Topbar></Topbar>
                <Sidebar></Sidebar>
                <main className="fadeIn animated" style={{marginLeft: '150px', padding: '30px 20px'}}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={14}>
                                <h2>{this.props.heading}</h2>
                            </Grid.Column>
                            {this.props.createLink ?
                                <Grid.Column floated='right' width={2}>
                                    <Button as={Link} to={this.props.createLink} floated='right'>Criar</Button>
                                </Grid.Column>
                            : null }
                        </Grid.Row>
                        {this.props.children}
                    </Grid>
                </main>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.Auth.isAuthenticated
    }
};

export default connect(mapStateToProps)(Admin);
