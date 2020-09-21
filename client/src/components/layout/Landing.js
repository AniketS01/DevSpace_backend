import React from 'react'
import {BrowserRouter as Router, Link, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'


const Landing = ({isAuthenticated}) => {
  if(isAuthenticated){
    return <Redirect to='/dashboard'/>
  }
    return (

      <section className="landing">
        <div className="dark-overlay">
            <div className="landing-inner">
              <h1 className="x-large">Devlopers Space</h1>
              <p className="lead">create Devloper peofile/portfolio,
              share posts and get help from other Devlopers</p>
              <div className="buttons">
                <Link to='/register' className="btn btn-primary">Register</Link>
                <Link to='/login' className="btn btn-light">Login</Link>
              </div>
            </div>
          </div>
        </section>
        
    )
}

Landing.propTypes={
  isAuthenticated:PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps)(Landing)
