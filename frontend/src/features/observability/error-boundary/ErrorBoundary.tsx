import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { ApplicationLogger } from '../logging/applicationLogger';
import { FallbackUI } from '../components/FallbackUI';

interface Props {
  children: ReactNode;
  type?: 'global' | 'route' | 'widget';
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to our ApplicationLogger (which pushes to Adapters)
    ApplicationLogger.error(`ErrorBoundary caught an error in ${this.props.type || 'widget'}`, {
      error,
      errorInfo
    });
  }

  private resetBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <FallbackUI 
          error={this.state.error} 
          resetErrorBoundary={this.resetBoundary} 
          type={this.props.type}
        />
      );
    }

    return this.props.children;
  }
}

// Pre-configured specialized boundaries
export const GlobalErrorBoundary: React.FC<{children: ReactNode}> = ({children}) => 
  <ErrorBoundary type="global">{children}</ErrorBoundary>;

export const RouteErrorBoundary: React.FC<{children: ReactNode}> = ({children}) => 
  <ErrorBoundary type="route">{children}</ErrorBoundary>;

export const WidgetErrorBoundary: React.FC<{children: ReactNode}> = ({children}) => 
  <ErrorBoundary type="widget">{children}</ErrorBoundary>;
