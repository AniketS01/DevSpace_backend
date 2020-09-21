import React,{Fragment} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import Moment from 'react-moment'
import {connect} from 'react-redux'
import {addLike, removeLike, deletePost} from '../../action/post'


const PostItem = ({addLike, removeLike,deletePost,auth, post: {_id, text, name, avatar, user, like,comments,date}}) => {
    return (
        <div class="post bg-white my-1">
                <div>
                <Link to={`/profile/${user}`}>
                    <img className="round-img" src={avatar} alt=""/>
                    <h4>{name}</h4>
                </Link>
              </div>
                <div>
                <p className="my-1">
                  {text}
                </p>
                <p className="post-date"> Posted on <Moment format='DD/MM/YY'>{date}</Moment></p>
                <button className="btn" onClick={e => addLike(_id)}>
                  <i class="fas fa-thumbs-up">{' '}</i><span>{like.length > 0 && (
                    <span className="comment-count">{like.length}</span>
                )}</span>
                </button>
                <button className="btn" className="btn" onClick={e => removeLike(_id)}>
                  <i className="fas fa-thumbs-down"></i>
                </button>
                
                {!auth.loading && user === auth.user._id && (
                    <button type='button' class='btn btn-danger' onClick={e => deletePost(_id)}>
                    <i className='fas fa-times' />
                    </button>
                )}                
                </div> 

                </div>
    )
}

PostItem.propTypes = {
    post:PropTypes.object.isRequired,
    auth:PropTypes.object.isRequired,
    addLike:PropTypes.func.isRequired,
    removeLike:PropTypes.func.isRequired,
    deletePost:PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
     auth:state.auth
})

export default connect(mapStateToProps, {addLike,removeLike,deletePost})(PostItem)
