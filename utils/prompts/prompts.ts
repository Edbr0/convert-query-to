export const converterPrompt = (query: string, language: string) => {
    return `Convert the following SQL query from any SQL dialect into an equivalent SQL query for ${language}. Provide only the converted SQL query in ${language} syntax, without any additional explanations or comments.

    PostgreSQL Query: ${query}
    
    \n` +
    "  Replace all newlines (\\n) with spaces, ensuring the SQL is transformed into a single line.\n" +
    "  Remove all template string delimiters (`` characters) present in the SQL.\n" +
    "  Make sure the overall structure of the SQL is maintained, but without the unwanted characters.\n\n"
}   


export const validateSqlPrompt = (query: string) => {
    return `Identify if the provided text is a SQL query. If it is not a SQL query, return undefined. If it is a SQL query, return the name of the SQL dialect. Provide only the name of the SQL dialect or undefined, with no explanation or additional text.
    
    Input Text: ${query}`
}

