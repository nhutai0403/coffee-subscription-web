import { useAuth } from '../context/AuthContext'
import './Home.css'

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover Your Perfect
            <span className="highlight"> Coffee Experience</span>
          </h1>
          <p className="hero-subtitle">
            Premium coffee beans delivered to your door, tailored to your taste preferences
          </p>
          {!isAuthenticated ? (
            <div className="hero-buttons">
              <button className="btn-primary">Get Started</button>
              <button className="btn-secondary">Learn More</button>
            </div>
          ) : (
            <div className="welcome-message">
              <h2>Welcome back, {user?.name || user?.email}!</h2>
              <p>Your personalized coffee journey continues...</p>
            </div>
          )}
        </div>
        <div className="hero-image">
          <div className="coffee-cup"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Our Coffee Subscription?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">☕</div>
            <h3>Premium Quality</h3>
            <p>Carefully selected beans from the world's finest coffee regions</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Fresh Delivery</h3>
            <p>Freshly roasted coffee delivered to your doorstep every month</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Personalized</h3>
            <p>Customized selections based on your taste preferences</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3>Sustainable</h3>
            <p>Ethically sourced and environmentally conscious coffee</p>
          </div>
        </div>
      </section>

      {/* Coffee Types Section */}
      <section className="coffee-types-section">
        <h2 className="section-title">Explore Our Coffee Collection</h2>
        <div className="coffee-types-grid">
          <div className="coffee-type-card">
            <div className="coffee-type-image light-roast"></div>
            <h3>Light Roast</h3>
            <p>Bright, acidic, and full of flavor</p>
          </div>
          <div className="coffee-type-card">
            <div className="coffee-type-image medium-roast"></div>
            <h3>Medium Roast</h3>
            <p>Balanced, smooth, and versatile</p>
          </div>
          <div className="coffee-type-card">
            <div className="coffee-type-image dark-roast"></div>
            <h3>Dark Roast</h3>
            <p>Rich, bold, and full-bodied</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Coffee Journey?</h2>
          <p>Join thousands of coffee lovers who have discovered their perfect brew</p>
          {!isAuthenticated ? (
            <button className="btn-primary-large">Sign Up Now</button>
          ) : (
            <button className="btn-primary-large">Manage Subscription</button>
          )}
        </div>
      </section>
    </div>
  )
}


