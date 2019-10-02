import {connect} from 'react-redux'
import Page from './Page'


const mapStateToProps = (state) => {
    return {
        isAuthenticated : state.Auth.isAuthenticated,
        user: state.Auth.user
    }
};

export default connect(mapStateToProps)(Page);
