import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;

    if (!error) return this.props.children;

    return (
      <section className="section-light section-pad relative flex min-h-screen items-center overflow-hidden">
        <div className="container-editorial relative">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">Something went wrong</p>
            <h1 className="heading-display mb-6 text-[clamp(2.5rem,6vw,4.25rem)] text-charcoal">
              This page hit a snag.
            </h1>
            <p className="body-editorial mb-10 text-[17px] text-charcoal/75">
              An unexpected error stopped the page from rendering. Reloading usually clears it.
            </p>

            {import.meta.env.DEV && (
              <pre className="mb-8 max-h-56 overflow-auto border border-charcoal/15 bg-white/60 p-4 font-mono text-[12px] leading-relaxed text-charcoal/80">
                {error.message}
              </pre>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <button type="button" onClick={this.handleReset} className="btn-primary">
                Try again
              </button>
              <Link to="/" className="btn-secondary">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
