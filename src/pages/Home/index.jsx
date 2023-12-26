import React, { useEffect, useState } from 'react';
import EmptyList from '../../components/common/EmptyList';
import BlogList from '../../components/Home/BlogList';
import Header from '../../components/Home/Header';

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(()=>{
    const fetchBlogs = async() =>{
      let res = await fetch("https://blog-server-tvke.onrender.com/blogs",{
        method:"GET",
        headers:{
          'Access-Control-Allow-Origin':'*'
        }
      })
      let data = await res.json();
      console.log(data)
      setBlogs(data);
  }
  fetchBlogs();
      
  },[])

  return (
    <div>
      {/* Page Header */}
      <Header />
      {/* Blog List & Empty View */}
      {!blogs.data ? <EmptyList /> : <BlogList blogs={blogs.data} />}
    </div>
  );
};

export default Home;
