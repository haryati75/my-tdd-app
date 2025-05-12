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
    // Fact should not be visible initially
    expect(screen.queryByText('No fact available')).not.toBeInTheDocument();

    // Click the "Show" button to show the fact
    const button = screen.getByRole('button', { name: 'Show' });
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

  it('renders a number input field with label "Trivia Number:"', () => {
    render(<App />);
    const numberInput = screen.getByLabelText('Trivia Number:');
    expect(numberInput).toBeInTheDocument();
    expect(numberInput).toHaveAttribute('type', 'number');
  });

  it('fetches fact from API when "Get Trivia" button is clicked', async () => {
    const mockFact = "42 is the answer to life, the universe, and everything.";
    const mockResponse = { text: vi.fn().mockResolvedValue(mockFact) };
    (global.fetch as unknown as jest.Mock).mockResolvedValue(mockResponse);

    render(<App />);
    const numberInput = screen.getByLabelText('Trivia Number:');

    // Change input value
    fireEvent.change(numberInput, { target: { value: '42' } });

    // Click "Get Trivia" button
    const getTriviaButton = screen.getByRole('button', { name: 'Get Trivia' });
    fireEvent.click(getTriviaButton);

    // Wait for the fact to appear
    await waitFor(() => {
      expect(screen.getByText(mockFact)).toBeInTheDocument();
    });

    // Show/Hide button should now say "Hide"
    const toggleButton = screen.getByRole('button', { name: 'Hide' });
    expect(toggleButton).toBeInTheDocument();
  });

  it('displays error message when API call fails', async () => {
    (global.fetch as unknown as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<App />);
    const numberInput = screen.getByLabelText('Trivia Number:');

    fireEvent.change(numberInput, { target: { value: '42' } });

    const getTriviaButton = screen.getByRole('button', { name: 'Get Trivia' });
    fireEvent.click(getTriviaButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch fact about this number')).toBeInTheDocument();
    });
  });

  it('shows "No fact available" when input is 0 or negative and "Get Trivia" is clicked', async () => {
    render(<App />);
    const numberInput = screen.getByLabelText('Trivia Number:');

    fireEvent.change(numberInput, { target: { value: '-5' } });

    const getTriviaButton = screen.getByRole('button', { name: 'Get Trivia' });
    fireEvent.click(getTriviaButton);

    await waitFor(() => {
      expect(screen.getByText('No fact available')).toBeInTheDocument();
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });
});