import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('displays Hello World', () => {
    render(<App />);
    expect(screen.getByText('Hello World!!')).toBeInTheDocument();
  });

  it('shows button with initial "Show" label', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: 'Show' });
    expect(button).toBeInTheDocument();
  });

  it('toggles message visibility when button is clicked', () => {
    render(<App />);
    const message = "This is my first React app with TypeScript";
    
    // Message should not be visible initially
    expect(screen.queryByText(message)).not.toBeInTheDocument();
    
    // Click the button to show the message
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Message should now be visible and button text should change
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(button).toHaveTextContent('Hide');
    
    // Click the button again to hide the message
    fireEvent.click(button);
    
    // Message should be hidden again and button text should change back
    expect(screen.queryByText(message)).not.toBeInTheDocument();
    expect(button).toHaveTextContent('Show');
  });
});