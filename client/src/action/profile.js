import axios from 'axios'
import {setAlert} from './alert'

import {
    GET_PROFILE,
    GET_PROFILES,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    CLEAR_PROFILE,
    DELETE_ACCOUNT,
    GET_REPOS
} from './types'


// Get current profile 

export const getCurrentProfile = () =>async dispatch => {
    try {
        const res = await axios.get('http://localhost:8000/api/profile/me')
        dispatch({
            type: GET_PROFILE,
            payload:res.data,
        })
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText, status: err.response.status}
        })
    }
}

//get all profiles
export const getProfiles = () => async dispatch => {
  dispatch({ type: CLEAR_PROFILE });

  try {
    const res = await axios.get('http://localhost:8000/api/profile');

    dispatch({
      type: GET_PROFILES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
//get profile by id

export const getProfileById = userId =>async dispatch => {
    
    try {
        const res = await axios.get(`http://localhost:8000/api/profile/user/${userId}`)
        dispatch({
            type: GET_PROFILE,
            payload:res.data,
        })
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText, status: err.response.status}
        })
    }
}

//get github repos

export const getGithubRepos = username =>async dispatch => {
    
    try {
        const res = await axios.get(`http://localhost:8000/api/profile/github/${username}`)
        dispatch({
            type: GET_REPOS,
            payload:res.data,
        })
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText, status: err.response.status}
        })
    }
}

// create and update

export const createProfile = (formData, history, edit=false) => async dispatch => {
    try {
        const config = {
            headers:{
                'content-Type':'application/json'
            }
        }
        const res = await axios.post('http://localhost:8000/api/profile',formData,config)
        dispatch({
            type: GET_PROFILE,
            payload:res.data,
        })
        dispatch(setAlert(edit ? 'profile updated' : 'profile created'))

        if(!edit){
            history.push('/dashboard')
        }

    } catch (err) {
        const errors = err.response.data.errors
        if(errors){
            errors.forEach(error => {
                dispatch(setAlert(error.msg, 'danger'))
            });

            dispatch({
                type:PROFILE_ERROR,
                payload:{msg:err.response.statusText, status: err.response.status}
            })
        }
    }
}

//add experience

export const addExperience = (formData, history) => async dispatch => {
    try {
        const config = {
            headers:{
                'content-Type':'application/json'
            }
        }
        const res = await axios.put('http://localhost:8000/api/profile/experience',formData,config)
        dispatch({
            type: UPDATE_PROFILE,
            payload:res.data,
        })
        dispatch(setAlert('Experience added', 'sucess'))
            history.push('/dashboard')


    } catch (err) {
        const errors = err.response.data.errors
        if(errors){
            errors.forEach(error => {
                dispatch(setAlert(error.msg, 'danger'))
            });

            dispatch({
                type:PROFILE_ERROR,
                payload:{msg:err.response.statusText, status: err.response.status}
            })
        }
    }
}

// add edu

export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            headers:{
                'content-Type':'application/json'
            }
        }
        const res = await axios.put('/api/profile/education',formData,config)
        dispatch({
            type: UPDATE_PROFILE,
            payload:res.data,
        })
        dispatch(setAlert('Education added', 'sucess'))
            history.push('/dashboard')


    } catch (err) {
        const errors = err.response.data.errors
        if(errors){
            errors.forEach(error => {
                dispatch(setAlert(error.msg, 'danger'))
            });

            dispatch({
                type:PROFILE_ERROR,
                payload:{msg:err.response.statusText, status: err.response.status}
            })
        }
    }
}

// delete exp
export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`)

        dispatch({
            type:UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Experience Removed', 'sucess'))
    } catch (err) {
         dispatch({
                type:PROFILE_ERROR,
                payload:{msg:err.response.statusText, status: err.response.status}
            })
    }
}
//delete education
export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`)

        dispatch({
            type:UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Education Removed', 'sucess'))
    } catch (err) {
         dispatch({
                type:PROFILE_ERROR,
                payload:{msg:err.response.statusText, status: err.response.status}
            })
    }
}

//Delete acc & progile
export const deleteAccount = id => async dispatch => {
    if(window.confirm('Are you sure? This cannot be undone!')){
       try {
        const res = await axios.delete(`/api/profile`)

        dispatch({
            type:CLEAR_PROFILE,
        })
        dispatch({
            type:DELETE_ACCOUNT
        })
         dispatch(setAlert('Your account has been permanantly deleted', 'sucess'))
    } catch (err) {
         dispatch({
                type:PROFILE_ERROR,
                payload:{msg:err.response.statusText, status: err.response.status}
            })
    } 
    }
}