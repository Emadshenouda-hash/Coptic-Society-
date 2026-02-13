'use server';
/**
 * @fileOverview A Genkit flow for summarizing the society's bylaws PDF.
 *
 * - summarizeBylaws - A function that handles the PDF summarization process.
 * - BylawsSummarizationInput - The input type for the summarizeBylaws function.
 * - BylawsSummarizationOutput - The return type for the summarizeBylaws function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BylawsSummarizationInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "The bylaws PDF document, as a data URI that must include a MIME type (application/pdf) and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
});
export type BylawsSummarizationInput = z.infer<typeof BylawsSummarizationInputSchema>;

const BylawsSummarizationOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the bylaws document.'),
});
export type BylawsSummarizationOutput = z.infer<typeof BylawsSummarizationOutputSchema>;

const bylawsSummarizationPrompt = ai.definePrompt({
  name: 'bylawsSummarizationPrompt',
  input: {schema: BylawsSummarizationInputSchema},
  output: {schema: BylawsSummarizationOutputSchema},
  prompt: `You are an expert legal assistant. Your task is to provide a concise summary of the provided PDF document, which contains the bylaws of the Grand Coptic Benevolent Society.
Focus on the key regulations, membership criteria, governance structure, and core objectives.
Ensure the summary is easy to understand for a general website visitor.

Document: {{media url=pdfDataUri}}`,
});

const bylawsSummarizationFlow = ai.defineFlow(
  {
    name: 'bylawsSummarizationFlow',
    inputSchema: BylawsSummarizationInputSchema,
    outputSchema: BylawsSummarizationOutputSchema,
  },
  async input => {
    const {output} = await bylawsSummarizationPrompt(input);
    return output!;
  }
);

export async function summarizeBylaws(
  input: BylawsSummarizationInput
): Promise<BylawsSummarizationOutput> {
  return bylawsSummarizationFlow(input);
}
