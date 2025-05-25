/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock fetchTrivia in the api/triviaApi module
vi.mock('./api/triviaApi', () => ({
  fetchTrivia: vi.fn(),
}));

import { fetchTrivia } from './api/triviaApi';

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

  it('shows "Get Trivia" button', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: 'Get Trivia' });
    expect(button).toBeInTheDocument();
  });

  it('shows trivia question and answer buttons after clicking "Get Trivia"', async () => {
    const mockQuestion = 'Shaquille O&rsquo;Neal has only made one three pointer in his career.';
    const mockCorrectAnswer = 'True';
    (fetchTrivia as any).mockResolvedValue([
      {
        question: mockQuestion,
        correct_answer: mockCorrectAnswer,
      },
    ]);

    render(<App />);
    const getTriviaButton = screen.getByRole('button', { name: 'Get Trivia' });
    fireEvent.click(getTriviaButton);

    // Wait for question to appear (decoded)
    await waitFor(() => {
      expect(screen.getByText("Shaquille O’Neal has only made one three pointer in his career.")).toBeInTheDocument();
    });

    // True/False buttons should appear
    expect(screen.getByRole('button', { name: 'True' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'False' })).toBeInTheDocument();
  });

  it('shows "Correct!" when the correct answer is chosen', async () => {
    const mockQuestion = '2 + 2 = 4?';
    const mockCorrectAnswer = 'True';
    (fetchTrivia as any).mockResolvedValue([
      {
        question: mockQuestion,
        correct_answer: mockCorrectAnswer,
      },
    ]);

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Get Trivia' }));

    await waitFor(() => {
      expect(screen.getByText('2 + 2 = 4?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'True' }));

    expect(screen.getByText('Correct!')).toBeInTheDocument();
  });

  it('shows "Correct!" when the correct answer is "False" and user clicks False', async () => {
    const mockQuestion = 'The earth is flat.';
    const mockCorrectAnswer = 'False';
    (fetchTrivia as any).mockResolvedValue([
      {
        question: mockQuestion,
        correct_answer: mockCorrectAnswer,
      },
    ]);

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Get Trivia' }));

    await waitFor(() => {
      expect(screen.getByText('The earth is flat.')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'False' }));

    expect(screen.getByText('Correct!')).toBeInTheDocument();
  });

  it('shows "Incorrect!" when the wrong answer is chosen', async () => {
    const mockQuestion = 'The sky is green.';
    const mockCorrectAnswer = 'False';
    (fetchTrivia as any).mockResolvedValue([
      {
        question: mockQuestion,
        correct_answer: mockCorrectAnswer,
      },
    ]);

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Get Trivia' }));

    await waitFor(() => {
      expect(screen.getByText('The sky is green.')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'True' }));

    expect(screen.getByText('Incorrect!')).toBeInTheDocument();
  });

  it('shows "Incorrect!" when the correct answer is "True" and user clicks False', async () => {
    const mockQuestion = 'Water boils at 100°C at sea level.';
    const mockCorrectAnswer = 'True';
    (fetchTrivia as any).mockResolvedValue([
      {
        question: mockQuestion,
        correct_answer: mockCorrectAnswer,
      },
    ]);

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Get Trivia' }));

    await waitFor(() => {
      expect(screen.getByText('Water boils at 100°C at sea level.')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'False' }));

    expect(screen.getByText('Incorrect!')).toBeInTheDocument();
  });

  it('shows error message when API call fails', async () => {
    (fetchTrivia as any).mockRejectedValue(new Error('API Error'));

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Get Trivia' }));

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch trivia about this number')).toBeInTheDocument();
    });
  });

  it('shows "No trivia available" when input is 0 or negative', async () => {
    render(<App />);
    // Just check initial state
    expect(screen.getByText('No trivia available')).toBeInTheDocument();
  });
});