import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [commission, setCommission] = useState(0);
  const [propertyPrice] = useState(1250000);
  const [viewerCount, setViewerCount] = useState(12);

  useEffect(() => {
    // Calculate commission
    setCommission(propertyPrice * 0.06);

    // Simulate live viewers
    const interval = setInterval(() => {
      setViewerCount(Math.floor(Math.random() * 10) + 8);
    }, 5000);

    return () => clearInterval(interval);
  }, [propertyPrice]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const shareProperty = (platform) => {
    const url = 'https://comper.pro/property/35-green-valley';
    const message = `This property wants ${formatCurrency(commission)} in commission! See the truth:`;
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      default:
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="App">
      {/* Commission Alert Header */}
      <div className="truth-bomb">
        <div className="commission-alert">
          <h1 className="commission-amount">{formatCurrency(commission)}</h1>
          <p className="commission-breakdown">
            That's what agents want in commission for this property
          </p>
          <div className="hourly-rate">
            {formatCurrency(commission/20)}/hour for 20 hours of work
          </div>
        </div>
      </div>

      {/* Social Proof Bar */}
      <div className="social-proof">
        <span className="proof-item">
          <strong>437</strong> investors analyzed this
        </span>
        <span className="proof-item">
          <strong>92</strong> said overpriced
        </span>
        <span className="proof-item">
          <strong>$2.3M</strong> saved in commissions
        </span>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="property-header">
          <h1>35 Green Valley Court</h1>
          <p className="address">San Anselmo, CA 94960</p>
          <div className="price">{formatCurrency(propertyPrice)}</div>
        </div>

        {/* Overpriced Alert */}
        <div className="alert-card">
          <div className="overpriced-banner">
            ⚠️ OVERPRICED BY $125,000 BASED ON COMPS
          </div>
          
          <h2>Real Comparable Sales</h2>
          <table className="comps-table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Sold Price</th>
                <th>$/Sqft</th>
                <th>Days Ago</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>42 Oak Street</td>
                <td>$1,185,000</td>
                <td>$718</td>
                <td>14</td>
              </tr>
              <tr>
                <td>118 Maple Ave</td>
                <td>$1,320,000</td>
                <td>$713</td>
                <td>30</td>
              </tr>
              <tr>
                <td>201 Pine Road</td>
                <td>$1,125,000</td>
                <td>$662</td>
                <td>45</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Commission Breakdown */}
        <div className="commission-breakdown-card">
          <h2>Where Your {formatCurrency(commission)} Goes</h2>
          <div className="breakdown-items">
            <div className="breakdown-item">
              <span>Listing Agent (3%)</span>
              <strong>{formatCurrency(commission/2)}</strong>
            </div>
            <div className="breakdown-item">
              <span>Buyer's Agent (3%)</span>
              <strong>{formatCurrency(commission/2)}</strong>
            </div>
            <div className="breakdown-item highlight">
              <span>Hourly Rate</span>
              <strong>{formatCurrency(commission/20)}/hour</strong>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="share-section">
          <h2>Expose The Truth - Share This Report</h2>
          <div className="share-buttons">
            <button onClick={() => shareProperty('whatsapp')} className="share-btn whatsapp">
              WhatsApp
            </button>
            <button onClick={() => shareProperty('twitter')} className="share-btn twitter">
              Twitter
            </button>
            <button onClick={() => shareProperty('facebook')} className="share-btn facebook">
              Facebook
            </button>
            <button onClick={() => shareProperty('copy')} className="share-btn">
              Copy Link
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="cta-section">
          <h2>Stop Paying 6% Commission</h2>
          <p>Join 10,000+ smart buyers and sellers saving millions</p>
          <a href="https://chrome.google.com/webstore" className="cta-button">
            Get COMPS.RED Chrome Extension
          </a>
        </div>
      </div>

      {/* Live Viewer Count */}
      <div className="viewer-count">
        <span className="live-dot"></span>
        <span>{viewerCount} people viewing now</span>
      </div>
    </div>
  );
}

export default App;