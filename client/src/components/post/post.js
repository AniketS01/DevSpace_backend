import React, {Fragment, useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {getPosts} from '../../action/post'
import PostItem from './PostItem'
import PostForm from './PostForm'
import Spinner from '../layout/Spinner'

const Posts = ({getPosts, post: {posts, loading}}) => {
    useEffect(() => {
        getPosts()
    }, [])
    return loading ? <Spinner/> : (
        <Fragment>
            <h1 className="large text-primary">Posts</h1>
          <p className="lead"><i class="fas fa-user"></i>Welcome to the community</p>
          <PostForm/>
          <div className='posts'>
            {posts.map(post => (
                <PostItem key={post._id} post={post}/>
            ))}
          </div>
        </Fragment>
    )
}

Posts.propTypes = {
    getPosts:PropTypes.func.isRequired,
    post:PropTypes.object.isRequired,
}
const mapStateToProps = state => ({
    post:state.post
})

export default connect(mapStateToProps, {getPosts})(Posts)
