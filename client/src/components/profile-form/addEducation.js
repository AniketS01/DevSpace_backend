import React , {Fragment, useState} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {addEducation} from '../../action/profile'

const AddEducation = ({addEducation,history}) => {
    const [formData, setFormData] = useState({
        school:'',
        degree:'',
        fieldofstudy:'',
        from:'',
        to:'',
        current:false,
    })

    const [toDateDisable, toggleDisabled] = useState(false)

    const {school, degree, fieldofstudy, from, to, current} = formData

    const onChange = e => setFormData({...formData, [e.target.name] : e.target.value})

    return (
        <Fragment>
            <h1 class="large text-primary">
        Add your Education
      </h1>
      <p class="lead">
        <i class="fas fa-code-branch"></i> Add any school or the bootcamp you attended
      </p>
      <small>* = required field</small>
      <form class="form" onSubmit={e => {
          e.preventDefault()
          addEducation(formData, history)
      }}>
        <div class="form-group">
          <input type="text" placeholder="* school" name="school" value={school} onChange={e => onChange(e)} required />
        </div>
        <div class="form-group">
          <input type="text" placeholder="* degree" name="degree" value={degree} onChange={e => onChange(e)} required />
        </div>
        <div class="form-group">
          <input type="text" placeholder="fieldofstudy" name="fieldofstudy" value={fieldofstudy} onChange={e => onChange(e)} />
        </div>
        <div class="form-group">
          <h4>From Date</h4>
          <input type="date" name="from" value={from} onChange={e => onChange(e)}/>
        </div>
        <div class="form-group">
          <h4>To Date</h4>
          <input type="date" name="to" value={to} onChange={e => onChange(e)} disabled={toDateDisable ? 'disable': ''}/>
        </div>
        <div class="form-group">
          <p><input type="checkbox" name="current" checked={current} value={current} onChange={e =>{
              setFormData({...formData, current: !current})
              toggleDisabled(!toDateDisable)
          }} /> {' '}Current</p>
        </div>
        <input type="submit" class="btn btn-primary my-1" />
        <a class="btn my-1" href="dashboard.html">Go Back</a>
      </form>
        </Fragment>
    )
}

AddEducation.propTypes = {
    addEducation:PropTypes.func.isRequired,
}

export default connect(null, {addEducation})(AddEducation)
