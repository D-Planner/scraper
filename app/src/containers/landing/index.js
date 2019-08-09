import React from 'react';
import './landing.scss';
import { Link, Element } from 'react-scroll';
import { SignInForm } from '../signIn';
import pine from '../../style/pine_name.png';
import dplanner from '../../style/dplanner-19.png';

const Landing = (props) => {
  return (
    <>
      <div className="container">
        <div className="left">
          <div className="header">
            <span className="line1">Welcome to</span>
            <span className="line2">D-PLANNER</span>
            <span className="line3">The Future Of Course Selection</span>
          </div>
          <img className="pine" src={pine} alt="" />
        </div>
        <div className="right">
          <SignInForm className="form" />
          <Link to="philosophy" spy smooth duration={500}>
            <div className="scroller">scrollTo</div>
          </Link>
        </div>
      </div>
      <div className="info">
        <div className="section">
          <div className="title">
            <Element name="philosophy">Our Philosophy</Element>
          </div>
          <div className="content">
            <img className="img" src={dplanner} alt="" width="615px" height="auto" />
            <div className="textContainer">
              <div className="text">
                <div className="textHeader">
                    For Students
                </div>
                <div className="body">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec commodo ultricies lorem, id cursus odio. Sed sollicitudin congue mi ac posuere. Quisque enim leo, elementum ut lacinia nec, volutpat vitae nisl. Proin sed suscipit justo. Nullam vehicula lobortis justo a condimentum. Etiam id justo at odio bibendum dignissim id id urna. Nullam tincidunt, nisi nec cursus dapibus, lorem magna placerat mi, eget rhoncus tortor mauris sit amet felis. Suspendisse scelerisque nisi et mi laoreet, in fermentum nisl cursus.
                </div>
              </div>
              <div className="text">
                <div className="textHeader">
                    By Students
                </div>
                <div className="body">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec commodo ultricies lorem, id cursus odio. Sed sollicitudin congue mi ac posuere. Quisque enim leo, elementum ut lacinia nec, volutpat vitae nisl. Proin sed suscipit justo. Nullam vehicula lobortis justo a condimentum. Etiam id justo at odio bibendum dignissim id id urna. Nullam tincidunt, nisi nec cursus dapibus, lorem magna placerat mi, eget rhoncus tortor mauris sit amet felis. Suspendisse scelerisque nisi et mi laoreet, in fermentum nisl cursus.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="left">
            Blah Blah
        </div>
        <div className="right">
          <SignInForm />
        </div>
      </div>
    </>
  );
};

export default Landing;
