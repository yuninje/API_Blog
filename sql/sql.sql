drop database api_blog_dev;
create database api_blog_dev;
use api_blog_dev;
show tables;

select * from user;
describe user;

select * from post;
describe post;

select * from comment;
describe comment;

select * from `like`;
describe `like`;

select * from follow;
describe follow;

select * from hashtag;
describe hashtag;

select * from post_hashtag;
describe post_hashtag;
