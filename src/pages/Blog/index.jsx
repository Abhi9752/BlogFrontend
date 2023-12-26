import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Chip from '../../components/common/Chip';
import EmptyList from '../../components/common/EmptyList';
import './styles.css';
import { Link } from 'react-router-dom';

const Blog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [blogList, setBlogList] = useState([]);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("https://blog-server-tvke.onrender.com/blogs", {
          method: "GET",
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        });
        if (!res.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const response = await res.json();
        console.log(response); // Log the response to examine its structure
        if (response.data && Array.isArray(response.data)) {
          setBlogList(response.data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    if (blogList.length > 0) {
      let blog = blogList.find((blog) => blog.id === parseInt(id));
      if (blog) {
        console.log(blog)
        setBlog(blog);
      }
    }
  }, [blogList, id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`https://blog-server-tvke.onrender.com/comments`, {
          method: "POST",
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            blog_id: blog._id
          })
        });
        if (!res.ok) {
          throw new Error('Failed to fetch comments');
        }
        const response = await res.json();
        if (response.records && Array.isArray(response.records)) {
          setComments(response.records);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchComments();
  }, [blog]);

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://blog-server-tvke.onrender.com/comment', {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          blog_id: blog._id,
          comment: comment,
          authorName: blog.authorName
        })
      });
      if (!res.ok) {
        throw new Error('Failed to post comment');
      }
      // Handle successful comment submission
      console.log('Comment submitted successfully!');
      // Clear the comment input
      setComment('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Link className='blog-goBack' to='/'>
        <span> &#8592;</span> <span>Go Back</span>
      </Link>
      {blog ? (
        <div className='blog-wrap'>
          <header>
            <p className='blog-date'>Published {blog.createdAt}</p>
            <h1>{blog.title}</h1>
            <div className='blog-subCategory'>
              {blog.subCategory.map((category, i) => (
                <div key={i}>
                  <Chip label={category} />
                </div>
              ))}
            </div>
          </header>
          <img src={blog.cover} alt='cover' />
          <p className='blog-desc'>{blog.description}</p>
          <textarea
            name="comment"
            id="comment"
            cols="92"
            rows="8"
            placeholder='Write your comment'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button className="btn" onClick={handleComment}>Comment</button>
          <div className="comment-section">
            <h2>Comments</h2>
            {console.log(comments)}
            {comments.length > 0 ? (
              <ul className="comment-list">
                {comments.map((comment, index) => (
                  <li key={index} className="comment-item">
                    <p>{comment.comment}</p>
                    <p>By: {comment.authorName}</p>
                    <hr/>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        </div>
      ) : (
        <EmptyList />
      )}
    </>
  );
};

export default Blog;
