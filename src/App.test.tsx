import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock fetch API
global.fetch = vi.fn();

describe('App', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('displays Trivia World heading', () => {
    render(<App />);
    expect(screen.getByText('Trivia World')).toBeInTheDocument();
  });

  it('shows button with initial "Show" label', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: 'Show' });
    expect(button).toBeInTheDocument();
  });

  it('toggles fact visibility when button is clicked', async () => {
    render(<App />);
    
    // Initial state - fact should not be visible
    expect(screen.queryByText('No fact available')).not.toBeInTheDocument();
    
    // Click the button to show the fact
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Fact should now be visible and button text should change
    expect(screen.getByText('No fact available')).toBeInTheDocument();
    expect(button).toHaveTextContent('Hide');
    
    // Click the button again to hide the fact
    fireEvent.click(button);
    
    // Fact should be hidden again and button text should change back
    expect(screen.queryByText('No fact available')).not.toBeInTheDocument();
    expect(button).toHaveTextContent('Show');
  });

  it('renders a number input field with label "Trivia Number"', () => {
    render(<App />);
    
    // Find the number input
    const numberInput = screen.getByLabelText('Trivia Number');
    
    // Check that it exists in the document
    expect(numberInput).toBeInTheDocument();
    
    // Check its type
    expect(numberInput).toHaveAttribute('type', 'number');
  });

  it('fetches fact from API when input value changes', async () => {
    // Setup mock fetch response
    const mockFact = "42 is the answer to life, the universe, and everything.";
    const mockResponse = {
      text: vi.fn().mockResolvedValue(mockFact),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    render(<App />);
    
    // Find the input element
    const numberInput = screen.getByLabelText('Trivia Number');
    
    // Change input value
    fireEvent.change(numberInput, { target: { value: '42' } });
    
    // Check if fetch was called with correct URL
    expect(global.fetch).toHaveBeenCalledWith('http://numbersapi.com/42');
    
    // Click the button to show the fact
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Wait for the fact to appear
    await waitFor(() => {
      expect(screen.getByText(mockFact)).toBeInTheDocument();
    });
  });

  it('displays error message when API call fails', async () => {
    // Setup mock fetch to reject
    (global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<App />);
    
    // Find the input element
    const numberInput = screen.getByLabelText('Trivia Number');
    
    // Change input value
    fireEvent.change(numberInput, { target: { value: '42' } });
    
    // Check if fetch was called with correct URL
    expect(global.fetch).toHaveBeenCalledWith('http://numbersapi.com/42');
    
    // Click the button to show the fact
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch fact about this number')).toBeInTheDocument();
    });
  });

  it('displays "No fact available" when input is 0 or negative', async () => {
    render(<App />);
    
    // Find the input element
    const numberInput = screen.getByLabelText('Trivia Number');
    
    // Change input value to a negative number
    fireEvent.change(numberInput, { target: { value: '-5' } });
    
    // Click the button to show the message
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Wait for the default message to appear
    await waitFor(() => {
      expect(screen.getByText('No fact available')).toBeInTheDocument();
    });
    
    // Fetch should not be called for negative numbers
    expect(global.fetch).not.toHaveBeenCalled();
  });
});