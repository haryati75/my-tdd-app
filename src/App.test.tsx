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

  it('shows "Get New Trivia" button', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: 'Get New Trivia' });
    expect(button).toBeInTheDocument();
  });

    it('shows "No trivia available" on first render', async () => {
    render(<App />);
    expect(screen.getByText('No trivia available')).toBeInTheDocument();
  });

  it('shows trivia question, category, and answer buttons after clicking "Get New Trivia"', async () => {
    const mockQuestion = 'Shaquille O&rsquo;Neal has only made one three pointer in his career.';
    const mockCategory = 'Sports';
    const mockCorrectAnswer = 'True';
    (fetchTrivia as any).mockResolvedValue([
      {
        question: mockQuestion,
        correct_answer: mockCorrectAnswer,
        category: mockCategory,
      },
    ]);

    render(<App />);
    const getTriviaButton = screen.getByRole('button', { name: 'Get New Trivia' });
    fireEvent.click(getTriviaButton);

    // Wait for question and category to appear (decoded)
    await waitFor(() => {
      expect(screen.getByText("Shaquille O’Neal has only made one three pointer in his career.")).toBeInTheDocument();
      expect(screen.getByText("Sports")).toBeInTheDocument();
    });

    // True/False buttons should appear
    expect(screen.getByRole('button', { name: 'True' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'False' })).toBeInTheDocument();
  });

  it('shows "Correct!🎉" when the correct answer is chosen', async () => {
    const mockQuestion = '2 + 2 = 4?';
    const mockCategory = 'Math';
    const mockCorrectAnswer = 'True';
    (fetchTrivia as any).mockResolvedValue([
      {
        question: mockQuestion,
        correct_answer: mockCorrectAnswer,
        category: mockCategory,
      },
    ]);

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Get New Trivia' }));

    await waitFor(() => {
      expect(screen.getByText('2 + 2 = 4?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'True' }));

    expect(screen.getByText('Correct!🎉')).toBeInTheDocument();
  });

  it('shows "Correct!🎉" when the correct answer is "False" and user clicks False', async () => {
    const mockQuestion = 'The earth is flat.';
    const mockCategory = 'Science';
    const mockCorrectAnswer = 'False';
    (fetchTrivia as any).mockResolvedValue([
      {
        question: mockQuestion,
        correct_answer: mockCorrectAnswer,
        category: mockCategory,
      },
    ]);

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Get New Trivia' }));

    await waitFor(() => {
      expect(screen.getByText('The earth is flat.')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'False' }));

    expect(screen.getByText('Correct!🎉')).toBeInTheDocument();
  });

  it('shows "Incorrect! 😬" when the wrong answer is chosen', async () => {
    const mockQuestion = 'The sky is green.';
    const mockCategory = 'Nature';
    const mockCorrectAnswer = 'False';
    (fetchTrivia as any).mockResolvedValue([
      {
        question: mockQuestion,
        correct_answer: mockCorrectAnswer,
        category: mockCategory,
      },
    ]);

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Get New Trivia' }));

    await waitFor(() => {
      expect(screen.getByText('The sky is green.')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'True' }));

    expect(screen.getByText('Incorrect! 😬')).toBeInTheDocument();
  });

  it('shows "Incorrect! 😬" when the correct answer is "True" and user clicks False', async () => {
    const mockQuestion = 'Water boils at 100°C at sea level.';
    const mockCategory = 'Science';
    const mockCorrectAnswer = 'True';
    (fetchTrivia as any).mockResolvedValue([
      {
        question: mockQuestion,
        correct_answer: mockCorrectAnswer,
        category: mockCategory,
      },
    ]);

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Get New Trivia' }));

    await waitFor(() => {
      expect(screen.getByText('Water boils at 100°C at sea level.')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'False' }));

    expect(screen.getByText('Incorrect! 😬')).toBeInTheDocument();
  });

  it('shows error message when API call fails', async () => {
    (fetchTrivia as any).mockRejectedValue(new Error('API Error'));

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Get New Trivia' }));

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch trivia from server')).toBeInTheDocument();
    });
  });


});