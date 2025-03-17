import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <div className="jumbotron text-center mb-5">
        <h1 className="display-4">Welcome to ScholarPath.ai</h1>
        <p className="lead">Your AI-powered scholarship search and application assistant</p>
        <hr className="my-4" />
        <p>Find scholarships that match your profile, get help with applications, and track your progress all in one place.</p>
        <Link to="/search" className="btn btn-primary btn-lg">Find Scholarships</Link>
      </div>
      
      <div className="row features-section">
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <i className="bi bi-search fs-1 text-primary mb-3"></i>
              <h3 className="card-title">Smart Search</h3>
              <p className="card-text">Our AI-powered search helps you find scholarships that match your unique profile and qualifications.</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <i className="bi bi-pencil-square fs-1 text-primary mb-3"></i>
              <h3 className="card-title">Essay Assistant</h3>
              <p className="card-text">Get AI-powered feedback on your scholarship essays to improve your chances of success.</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <i className="bi bi-clipboard-check fs-1 text-primary mb-3"></i>
              <h3 className="card-title">Application Tracker</h3>
              <p className="card-text">Keep track of all your scholarship applications in one place, with deadline reminders.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="cta-section text-center mt-5">
        <h2>Ready to find scholarships?</h2>
        <p>Create an account to get personalized scholarship recommendations and track your applications.</p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/register" className="btn btn-primary">Sign Up</Link>
          <Link to="/login" className="btn btn-outline-primary">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
