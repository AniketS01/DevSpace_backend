import React, {useEffect, Fragment} from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {getCurrentProfile,deleteAccount} from '../../action/profile'
import Spinner from '../layout/Spinner'
import DashboardActions from './dashboardActions'
import Experience from './Experience'
import Education from './education'



const Dashboard = ({getCurrentProfile, auth:{user}, profile:{profile,loading}, deleteAccount}) => {
    useEffect(() => {
        getCurrentProfile()
    }, [getCurrentProfile])
    return (
        loading && profile == null ? <Spinner/>:<Fragment>
         <h1 className="large text-primary">Dashboard</h1>
         <p className="lead"><i className="fas fa-user"></i>Welcome {user&&user.name}</p>
         {profile !== null ? 
         <Fragment>
            <DashboardActions/>
            <Experience experience={profile.experience} />
            <Education education={profile.education} />
            <div className="my-2">
                <button className="btn btn-danger" onClick={() => deleteAccount() }>
                    <i className="fas fa-user-minus"></i> Delete my account
                </button>
            </div>
         </Fragment> : <Fragment><p>you dont have a profile, please add some info</p>
         <Link to='/create-profile' className='btn btn-primary my-1'>create profile</Link>
         </Fragment>}
        </Fragment>
    )}

Dashboard.propTypes = {
    getCurrentProfile:PropTypes.func.isRequired,
    auth:PropTypes.object.isRequired,
    profile:PropTypes.object.isRequired,
    deleteAccount:PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth:state.auth,
    profile:state.profile
})

export default connect(mapStateToProps, {getCurrentProfile, deleteAccount})(Dashboard)
