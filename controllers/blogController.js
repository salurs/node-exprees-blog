const Blog = require('../models/blogModel');
const dateFormat = require('dateformat');



const getBlogs = async (req,res,next)=>{
    const blogs = await Blog.find({}).limit(5).sort({_id:-1});
    blogs.forEach(function(el){
        el.newDate = dateFormat(el.createdAt, 'mediumDate');
        //el.createdAt = dateFormat(el.createdAt, 'shortDate');
   });
    res.render('index',{settings:req.settings,blogs:blogs});
};
const getBlog = async (req,res,next)=>{
    const blog = await Blog.findOne({slug:req.params.slug});
    const lastBlogs = await Blog.find({slug:{'$ne':req.params.slug}}).sort({_id:-1}).limit(10);
    req.settings.title = blog.title;
    req.settings.description = blog.description;
    req.settings.keywords = blog.keywords;
    blog.newDate = dateFormat(blog.createdAt, 'mediumDate');
    res.render('blog',{settings:req.settings,blog,lastBlogs});
};

const paginateBlogs = async (req,res,next)=>{
    try {
        let perPage = 6
        let page = req.params.page || 1

        Blog
            .find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function(err, blogs) {
                Blog.count().exec(function(err, count) {
                    if (err) return next(err)
                    res.render('blogs', {
                        settings:req.settings,
                        blogs: blogs,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                })
            })
     
      } catch (err) {
        next(err);
      }
};




module.exports = {
    getBlogs,
    getBlog,
    paginateBlogs
};