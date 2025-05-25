/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchTrivia } from './triviaApi';

describe('fetchTrivia', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('returns results array when response is ok and data is present', async () => {
    const mockResults = [{ question: 'Q?', correct_answer: 'True' }];
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ results: mockResults }),
    });

    const data = await fetchTrivia(1);
    expect(data).toEqual(mockResults);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://opentdb.com/api.php?amount=1&difficulty=easy&type=boolean'
    );
  });

  it('throws an error when response is not ok', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(fetchTrivia(1)).rejects.toThrow('Network response was not ok');
  });
});