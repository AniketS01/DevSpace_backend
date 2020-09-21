import React, {Fragment,useState} from 'react'
import {Link, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {setAlert} from '../../action/alert'
import {register} from '../../action/auth'
import PropTypes from 'prop-types'


const Register = ({setAlert, register, isAuthenticated}) => {
    const [formData, setFormData]=useState({
        name:'',
        email:'',
        password:'',
        pass:''
    })
    const {name,email,password,pass}=formData
    const onChange = e => setFormData({...formData,[e.target.name]: e.target.value})
    const onSubmit = async e => {
        e.preventDefault()
        if(password!==pass){
            setAlert('password does not match', 'danger')
        }
        else{
          register({name,email,password})
        }
    }
    if(isAuthenticated){
      return <Redirect to='/dashboard'/>
    }
    return (
        <Fragment>
            <h1 className="large text-primary">Sign up</h1>
          <p className="lead"><i className="fas fa-user">Create your account</i></p>
          <form className="form" action="dashboard.html" method="post" onSubmit={e => onSubmit(e)}>
            <div className="form-group">
              <input type="text" placeholder="Name" name='name' value={name} onChange={e => onChange(e)} />
            </div>
            <div className="form-group">
              <input type="email" name='email' placeholder="email adress" value={email} onChange={e => onChange(e)} />
              <small className="form-text">this site uses gravatar, if you want a profile image pls use a gratar email</small>
            </div>
            <div className="form-group">
              <input type="password" name='password' placeholder="password" value={password} onChange={e => onChange(e)} />
            </div>
            <div className="form-group">
              <input type="password" name='pass' placeholder="confirm" value={pass} onChange={e => onChange(e)} />
            </div>
            <input type="submit" value="Register" className="btn btn-primary" />
          </form>
          <p className="my-1">
            already have a account? <Link to='/login'>Sign in</Link>
          </p>
        </Fragment>
    )
}
Register.propTypes = {
  setAlert:PropTypes.func.isRequired,
  register:PropTypes.func.isRequired,
  isAuthenticated:PropTypes.bool,
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {setAlert,register})(Register)
