export type TriviaResult = {
  question: string;
  correct_answer: string;
  category: string;
};

export type TriviaResponse = {
  results: TriviaResult[];
};

export async function fetchTrivia(amount: number): Promise<TriviaResult[]> {
  const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&difficulty=easy&type=boolean`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  console.log('Fetched trivia data:', data);
  // Assume the API now returns { data: { results: [...] } }
  return data.results;
}