import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = { err: null };
  static getDerivedStateFromError(err) { return { err }; }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div className="wrap" style={{ padding: '40px 20px' }}>
        <h2>পেজটি দেখাতে সমস্যা হয়েছে</h2>
        <p>নিচের মেসেজটি কপি করে পাঠালে ঠিক করে দেওয়া যাবে:</p>
        <pre style={{ whiteSpace: 'pre-wrap', background: 'var(--surface)', border: '1px solid var(--line)', padding: 12, borderRadius: 10 }}>{String(this.state.err && this.state.err.stack || this.state.err)}</pre>
        <a className="btn primary" href="/">হোমে যাও</a>
      </div>
    );
  }
}
