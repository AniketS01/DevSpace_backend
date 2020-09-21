import React, {Fragment,useState} from 'react'
import {Link, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {login} from '../../action/auth'

const Login = ({login, isAuthenticated}) => {
    const [formData, setFormData]=useState({
        email:'',
        password:'',
    })

    // redirect if loged in
    if(isAuthenticated){
      return <Redirect to='/dashboard'/>
    }
    const {email,password,}=formData
    const onChange = e => setFormData({...formData,[e.target.name]: e.target.value})
    const onSubmit = async e => {
        e.preventDefault()
        login(email, password)
    }
    return (
        <Fragment>
            <h1 className="large text-primary">Sign In</h1>
          <p className="lead"><i className="fas fa-user">sign in your account</i></p>
          <form className="form" action="dashboard.html" method="post" onSubmit={e => onSubmit(e)}>
            <div className="form-group">
              <input type="email" name='email' placeholder="email adress" value={email} onChange={e => onChange(e)} required/>
            </div>
            <div className="form-group">
              <input type="password" name='password' placeholder="password" value={password} onChange={e => onChange(e)} required/>
            </div>
            <input type="submit" value="Sign in" className="btn btn-primary" required/>
          </form>
          <p className="my-1">
            Dont have a account? <Link to='/register'>Sign up</Link>
          </p>
        </Fragment>
    )
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated:PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {login})(Login)
