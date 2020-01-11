/* eslint-disable max-len */
import React from 'react';
import './landing.scss';
import { connect } from 'react-redux';
import Slider from 'react-slick';

import { showDialog } from '../../actions';
import { DialogTypes } from '../../constants';
import SignInForm from '../../containers/signIn';
import SignUpForm from '../../containers/signUp';
import VideoEmbed from '../videoEmbed';

import feature1 from '../../style/feature1.svg';
import feature2 from '../../style/feature2.svg';
import feature3 from '../../style/feature3.svg';
import term from '../../style/term.svg';
import downArrow from '../../style/down-arrow.svg';

import asian from '../../style/asian.svg';
import beard from '../../style/beard.svg';
import blonde from '../../style/blonde_white.svg';
import hat from '../../style/hat.svg';

import youtubeIcon from '../../style/social_icons/youtube-icon-250.png';
import facebookIcon from '../../style/social_icons/facebook-icon-250.png';
import twitterIcon from '../../style/social_icons/twitter-icon-250.png';
import instagramIcon from '../../style/social_icons/instagram-icon-250.png';
import dartmouthIcon from '../../style/social_icons/dartmouth-icon-250.png';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signIn: false,
    };
  }

  checkAuth = (warning) => {
    if (!this.props.authError) {
      const opt = {
        title: 'Error Signing In/Up',
        warning,
        okText: 'Try Again',
      };
      this.props.showDialog(DialogTypes.ERROR, opt);
    }
  }

  render() {
    const sliderSettings = {
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      infinite: true,
      easing: 'ease-in-out',
    };
    return (
      <div className="landing-container">
        <section className="container">
          <div style={{ display: 'flex', justifyContent: 'center' }}><img src={downArrow} alt="scroll up" className="landing-down-arrow animate" /></div>
          <div className="left">
            <div className="intro">
              <h1 className="line1">The future of Academic Planning</h1>
              <div className="line2">Welcome to D-Planner.</div>
              <div className="showcase">
                {/* Needed to import slider CSS */}
                <link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
                <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
                <Slider {...sliderSettings}>
                  <div className="landing-subfeature">
                    <img className="landing-subfeature-image" src={feature1} alt="course-subfeature" />
                    <div className="landing-subfeature-text-container">
                      <img className="landing-subfeature-icon" src={feature1} alt="subfeature-icon" />
                      <p style={{ color: 'white' }}>Visualize your undergraduate years at Dartmouth. Know exactly what you should take.</p>
                    </div>
                  </div>
                  <div className="landing-subfeature">
                    <img className="landing-subfeature-image" src={feature2} alt="course-subfeature" />
                    <div className="landing-subfeature-text-container">
                      <img className="landing-subfeature-icon" src={feature2} alt="feature-subicon" />
                      <p style={{ color: 'white' }}>Visualize your undergraduate years at Dartmouth. Know exactly what you should take.</p>
                    </div>
                  </div>
                  <div className="landing-subfeature">
                    <img className="landing-subfeature-image" src={feature3} alt="course-subfeature" />
                    <div className="landing-subfeature-text-container">
                      <img className="landing-subfeature-icon" src={feature3} alt="feature-subicon" />
                      <p style={{ color: 'white' }}>Visualize your undergraduate years at Dartmouth. Know exactly what you should take.</p>
                    </div>
                  </div>
                </Slider>
              </div>
            </div>
          </div>
          <div className="right">
            {this.state.signIn
              ? <SignInForm checkAuth={this.checkAuth} showSignUp switchToSignUp={() => this.setState({ signIn: false })} />
              : <SignUpForm checkAuth={this.checkAuth} switchToSignIn={() => this.setState({ signIn: true })} />
            }
            {/* <Link to="philosophy" spy smooth duration={750}>
              <div className="scroller">
                <img src={arrowDown} alt="" />
              </div>
            </Link> */}
          </div>
        </section>
        <section className="landing-section">
          <h2>Welcome to D-Planner</h2>
          <div className="welcome-container">
            <div id="left-welcome-landing">
              <div className="landing-subtitle">Academic planning is hard...</div>
              <p>We get it, planning your time at college is tough. There are countless things to take into account, from graduation requirements to class offerings. As students, we get that.</p>
            </div>
            <div id="right-welcome-landing">
              <div className="landing-subtitle">but it doesn’t have to be.</div>
              <p>That’s why we made D-Planner, a complete academic planning suite designed to turn preparing your future at college from something you dread to something you love.</p>
            </div>
          </div>
          <VideoEmbed youtubeID="vv8EqfQMlZY" />
        </section>
        <section className="landing-section colored">
          <div className="landing-feature horizontal">
            <img src={term} alt="term" />
            <div>
              <h3 style={{ textAlign: 'left' }}>Keyword-based Course Search</h3>
              <p>D-Planner is equipped with a powerful and easy to use search engine. Enjoy discovering your next favorite course!</p>
            </div>
          </div>
          <div className="landing-feature-container">
            {/* For the love of God change this text below */}
            <div className="landing-feature vertical">
              <img src={term} alt="term" />
              <h3>Keyword-based Course Search</h3>
              <p>D-Planner is equipped with a powerful and easy to use search engine. Enjoy discovering your next favorite course!</p>
            </div>
            <div className="landing-feature vertical">
              <img src={term} alt="term" />
              <h3>Keyword-based Course Search</h3>
              <p>D-Planner is equipped with a powerful and easy to use search engine. Enjoy discovering your next favorite course! This is the rest of a sentence that I didn’t feel like finishing, so here we go...</p>
            </div>
            <div className="landing-feature vertical">
              <img src={term} alt="term" />
              <h3>Keyword-based Course Search</h3>
              <p>Once you&apos;ve found a class that looks interesting for your plan, our extensive course database offers all information publicly available on the course, from its full name and description to its distributive, past medians, LayupList score, prerequisites and classes with it as a prerequisite, and much more. You no longer need to search through multiple different sites to find all of the course information you will ever need!</p>
            </div>
          </div>
        </section>
        <section className="landing-section">
          <h2>By students, for students</h2>
          <div className="landing-subtitle" style={{ textAlign: 'center', margin: '0px auto 18px auto' }}>These are the faces of D-Planner.</div>
          <p style={{ textAlign: 'center', maxWidth: '656px', margin: '0px auto 58px auto' }}>Below are the faces of our D-Planner team. We know firsthand how stressful college can be, and we want to do our part to make sure that you can take of advantage of everything your experience in higher education has to offer.  Here’s a little bit about us!</p>
          <div className="landing-feature-container">
            {/* For the love of God change this text below */}
            <div className="landing-feature vertical person">
              <div style={{ display: 'flex', justifyContent: 'center' }}><img src={hat} alt="Adam McQuilkin" /></div>
              <h4>Adam McQuilkin</h4>
              <p style={{ marginBottom: '11px' }}><i>Co-Founder, Business Manager</i></p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam rutrum ultrices felis nec cursus. Nam imperdiet diam erat, et rutrum tellus consectetur nec. Proin vitae pellentesque erat. Nunc aliquet quam in mi consequat, vitae lobortis est sodales.</p>
            </div>
            <div className="landing-feature vertical person">
              <div style={{ display: 'flex', justifyContent: 'center' }}><img src={asian} alt="Ziray Hao" /></div>
              <h4>Ziray Hao</h4>
              <p style={{ marginBottom: '11px' }}><i>Co-Founder, Des/Dev</i></p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam rutrum ultrices felis nec cursus. Nam imperdiet diam erat, et rutrum tellus consectetur nec. Proin vitae pellentesque erat. Nunc aliquet quam in mi consequat, vitae lobortis est sodales.</p>
            </div>
            <div className="landing-feature vertical person">
              <div style={{ display: 'flex', ustifyContent: 'center' }}><img src={beard} alt="Benjamin Cape" /></div>
              <h4>Benjamin Cape</h4>
              <p style={{ marginBottom: '11px' }}><i>Founding Member, Lead Dev</i></p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam rutrum ultrices felis nec cursus. Nam imperdiet diam erat, et rutrum tellus consectetur nec. Proin vitae pellentesque erat. Nunc aliquet quam in mi consequat, vitae lobortis est sodales.</p>
            </div>
          </div>
        </section>
        <section className="landing-section colored" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
          {/* dots={false} */}
          <Slider {...sliderSettings}>
            <div className="landing-testimonial">
              <img className="landing-testimonial-image" src={blonde} alt="landing-testimonial-feature" />
              <div className="landing-testimonial-text-container">
                <h4 style={{ color: 'white', marginBottom: '11px' }}>Katie M, ‘22 at Dartmouth</h4>
                <p style={{ color: 'white' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam rutrum ultrices felis nec cursus. Nam imperdiet diam erat, et rutrum tellus consectetur nec. Proin vitae pellentesque erat.</p>
              </div>
            </div>
            <div className="landing-testimonial">
              <img className="landing-testimonial-image" src={blonde} alt="landing-testimonial-feature" />
              <div className="landing-testimonial-text-container">
                <h4 style={{ color: 'white', marginBottom: '11px' }}>Katie M, ‘22 at Dartmouth</h4>
                <p style={{ color: 'white' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam rutrum ultrices felis nec cursus. Nam imperdiet diam erat, et rutrum tellus consectetur nec. Proin vitae pellentesque erat.</p>
              </div>
            </div>
            <div className="landing-testimonial">
              <img className="landing-testimonial-image" src={blonde} alt="landing-testimonial-feature" />
              <div className="landing-testimonial-text-container">
                <h4 style={{ color: 'white', marginBottom: '11px' }}>Katie M, ‘22 at Dartmouth</h4>
                <p style={{ color: 'white' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam rutrum ultrices felis nec cursus. Nam imperdiet diam erat, et rutrum tellus consectetur nec. Proin vitae pellentesque erat.</p>
              </div>
            </div>
          </Slider>
        </section>
        <section className="landing-section">
          <h2>Get started today!</h2>
          <div className="landing-subtitle" style={{ textAlign: 'center', margin: '0px auto 18px auto' }}>Sign up below to start your future of academic planning.</div>
          <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0px auto 58px auto' }}>If you’re excited to try out D-Planner and take advantage of all college has to offer, sign up below now! We are very excited to have you onboard, and we look forward to hearing where your college journey will take you.</p>
          <div style={{ display: 'flex', justifyContent: 'center', margin: 'auto' }}>
            {this.state.signIn
              ? <SignInForm checkAuth={this.checkAuth} showSignUp switchToSignUp={() => this.setState({ signIn: false })} removeTitle />
              : <SignUpForm checkAuth={this.checkAuth} switchToSignIn={() => this.setState({ signIn: true })} removeTitle />
          }
          </div>
        </section>
        <section className="landing-section colored footer" style={{ paddingTop: '81px', paddingBottom: '81px' }}>
          <div className="landing-link-container" style={{ marginBottom: '48px' }}>
            <a href="mailto:info@d-planner.com">Want to bring D-Planner to your school?<br />Click here to let us know!</a>
            <a href="mailto:info@d-planner.com">Are you a college administrator?<br />We provide data analytics!</a>
            <a href="/credits">We couldn’t have gotten here without many talented people.<br />See our credits page!</a>
            <a href="mailto:info@d-planner.com">Have a question that we haven’t answered?<br />Click here to let us know!</a>
          </div>
          <div className="landing-link-container">
            <div className="landing-icon-container">
              <div className="landing-social-icon-container left">
                <img src={dartmouthIcon} alt="dartmouth" />
              </div>
              <h4 style={{ color: 'white', margin: 'auto 0 auto 41px' }}>Proudly built at Dartmouth College</h4>
            </div>
            <div className="landing-icon-container">
              <div className="landing-social-icon-container right">
                <img src={facebookIcon} onClick={() => window.open('www.google.com')} target="_blank" rel="noopener noreferrer" alt="facebook-link" />
                <img src={instagramIcon} onClick={() => window.open('www.google.com')} target="_blank" rel="noopener noreferrer" alt="instagram-link" />
                <img src={twitterIcon} onClick={() => window.open('www.google.com')} target="_blank" rel="noopener noreferrer" alt="twitter-link" />
                <img src={youtubeIcon} onClick={() => window.open('www.google.com')} target="_blank" rel="noopener noreferrer" alt="youtube-link" />
              </div>
              <h4 style={{ color: 'white', margin: 'auto 43px auto' }}>© D-Planner, 2020</h4>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authError: state.auth.authenticated,
});

export default connect(mapStateToProps, { showDialog })(Landing);
