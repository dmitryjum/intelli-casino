import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}
 
export async function strict_output({
  system_prompt,
  user_prompt,
  output_format,
  default_category = "",
  output_value_only = false,
  model = "gpt-3.5-turbo",
  temperature = 1,
  num_tries = 5,
  verbose = false
}: {
  system_prompt: string;
  user_prompt: string | string[];
  output_format: OutputFormat;
  default_category?: string;
  output_value_only?: boolean;
  model?: string;
  temperature?: number;
  num_tries?: number;
  verbose?: boolean;
}) {
  // if the user input is in a list, we also process the output as a list of json
  const list_input: boolean = Array.isArray(user_prompt);
  // if the output format contains dynamic elements of < or >, then add to the prompt to handle dynamic elements
  const dynamic_elements: boolean = /<.*?>/.test(JSON.stringify(output_format));
  // if the output format contains list elements of [ or ], then we add to the prompt to handle lists
  const list_output: boolean = /\[.*?\]/.test(JSON.stringify(output_format));
 
  // start off with no error message
  let error_msg: string = "";
 
  for (let i = 0; i < num_tries; i++) {
    let output_format_prompt: string = `\nYou are to output ${
      list_output && "an array of objects in"
    } the following in json format: ${JSON.stringify(
      output_format
    )}. \nDo not put quotation marks or escape character \\ in the output fields.`;
 
    if (list_output) {
      output_format_prompt += `\nIf output field is a list, classify output into the best element of the list.`;
    }
 
    // if output_format contains dynamic elements, process it accordingly
    if (dynamic_elements) {
      output_format_prompt += `\nAny text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden\nAny output key containing < and > indicates you must generate the key name to replace it. Example input: {'<location>': 'description of location'}, Example output: {school: a place for education}`;
    }
 
    // if input is in a list format, ask it to generate json in a list
    if (list_input) {
      output_format_prompt += `\nGenerate an array of json, one json for each input element.`;
    }
 
    // Use OpenAI to get a response
    const response = await openai.chat.completions.create({
      temperature: temperature,
      model: model,
      messages: [
        {
          "role": "system",
          "content": system_prompt + output_format_prompt + error_msg,
        },
        { "role": "user", "content": user_prompt.toString() },
      ],
    });
 
    let res: string =
      response.choices[0].message?.content?.replace(/'/g, '"') ?? "";
 
    // ensure that we don't replace away apostrophes in text
    res = res.replace(/(\w)"(\w)/g, "$1'$2");
 
    if (verbose) {
      console.log(
        "System prompt:",
        system_prompt + output_format_prompt + error_msg
      );
      console.log("\nUser prompt:", user_prompt);
      console.log("\nGPT response:", res);
    }
 
    // try-catch block to ensure output format is adhered to
    try {
      let output: any = JSON.parse(res);
 
      if (list_input) {
        if (!Array.isArray(output)) {
          throw new Error("Output format not in an array of json");
        }
      } else {
        output = [output];
      }
 
      // check for each element in the output_list, the format is correctly adhered to
      for (let index = 0; index < output.length; index++) {
        for (const key in output_format) {
          // unable to ensure accuracy of dynamic output header, so skip it
          if (/<.*?>/.test(key)) {
            continue;
          }
 
          // if output field missing, raise an error
          if (!(key in output[index])) {
            throw new Error(`${key} not in json output`);
          }
 
          // check that one of the choices given for the list of words is an unknown
          if (Array.isArray(output_format[key])) {
            const choices = output_format[key] as string[];
            // ensure output is not a list
            if (Array.isArray(output[index][key])) {
              output[index][key] = output[index][key][0];
            }
            // output the default category (if any) if GPT is unable to identify the category
            if (!choices.includes(output[index][key]) && default_category) {
              output[index][key] = default_category;
            }
            // if the output is a description format, get only the label
            if (output[index][key].includes(":")) {
              output[index][key] = output[index][key].split(":")[0];
            }
          }
        }
 
        // if we just want the values for the outputs
        if (output_value_only) {
          output[index] = Object.values(output[index]);
          // just output without the list if there is only one element
          if (output[index].length === 1) {
            output[index] = output[index][0];
          }
        }
      }
 
      return list_input ? output : output[0];
    } catch (e) {
      error_msg = `\n\nResult: ${res}\n\nError message: ${e}`;
      console.log("An exception occurred:", e);
      console.log("Current invalid json format ", res);
    }
  }
 
  return [];
}


// The article with explanation what the code above does

// Understanding the TypeScript Code for Generating Structured JSON Output from OpenAI API
// In the provided code, the function strict_output is designed to interact with the OpenAI API to generate
//  structured JSON output based on given prompts. This function aims to ensure the output adheres to a specified format,
//   handling various complexities such as dynamic elements, lists, and potential errors. Let's break down the key components and logic.

// 1. Configuration and Initialization
// The code begins by importing the necessary modules from the OpenAI package and configuring the API key:

// typescript
// Copy code
// import { Configuration, OpenAIApi } from "openai";

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);
// This sets up the OpenAI API client with the provided API key, enabling subsequent requests to the API.

// 2. Output Format Interface
// An interface is defined to describe the structure of the expected output format:

// typescript
// Copy code
// interface OutputFormat {
//   [key: string]: string | string[] | OutputFormat;
// }
// This allows the output format to be a nested object, where values can be strings, arrays of strings, or other nested objects.

// 3. The strict_output Function
// The core function strict_output is designed to interact with the OpenAI API and ensure the output adheres to a specified format. Here's a step-by-step explanation of its components:

// Parameters
// The function accepts several parameters:

// system_prompt: The initial system-level instruction for the AI.
// user_prompt: The user's input prompt.
// output_format: The desired JSON structure of the output.
// default_category: A fallback category if the output doesn't match expected values.
// output_value_only: A flag to determine if only values should be returned.
// model, temperature, num_tries, verbose: Various OpenAI API configuration options.
// Processing Inputs and Outputs
// The function starts by determining if the input is a list and if the output format contains dynamic elements or lists:

// typescript
// Copy code
// const list_input: boolean = Array.isArray(user_prompt);
// const dynamic_elements: boolean = /<.*?>/.test(JSON.stringify(output_format));
// const list_output: boolean = /\[.*?\]/.test(JSON.stringify(output_format));
// Constructing the Prompt
// The prompt is constructed to instruct the AI on how to format the output:

// typescript
// Copy code
// let output_format_prompt: string = `\nYou are to output ${
//   list_output && "an array of objects in"
// } the following in json format: ${JSON.stringify(
//   output_format
// )}. \nDo not put quotation marks or escape character \\ in the output fields.`;

// if (list_output) {
//   output_format_prompt += `\nIf output field is a list, classify output into the best element of the list.`;
// }

// if (dynamic_elements) {
//   output_format_prompt += `\nAny text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden\nAny output key containing < and > indicates you must generate the key name to replace it. Example input: {'<location>': 'description of location'}, Example output: {school: a place for education}`;
// }

// if (list_input) {
//   output_format_prompt += `\nGenerate an array of json, one json for each input element.`;
// }
// Making API Requests
// The function attempts to get a valid response from the OpenAI API within a specified number of tries:

// typescript
// Copy code
// for (let i = 0; i < num_tries; i++) {
//   const response = await openai.createChatCompletion({
//     temperature: temperature,
//     model: model,
//     messages: [
//       {
//         role: "system",
//         content: system_prompt + output_format_prompt + error_msg,
//       },
//       { role: "user", content: user_prompt.toString() },
//     ],
//   });

//   let res: string =
//     response.data.choices[0].message?.content?.replace(/'/g, '"') ?? "";

//   res = res.replace(/(\w)"(\w)/g, "$1'$2");
// The response is processed to replace single quotes with double quotes and ensure that apostrophes are preserved.

// Validating and Formatting Output
// The function uses a try-catch block to validate and format the output:

// typescript
// Copy code
// try {
//   let output: any = JSON.parse(res);

//   if (list_input) {
//     if (!Array.isArray(output)) {
//       throw new Error("Output format not in an array of json");
//     }
//   } else {
//     output = [output];
//   }

//   for (let index = 0; index < output.length; index++) {
//     for (const key in output_format) {
//       if (/<.*?>/.test(key)) {
//         continue;
//       }

//       if (!(key in output[index])) {
//         throw new Error(`${key} not in json output`);
//       }

//       if (Array.isArray(output_format[key])) {
//         const choices = output_format[key] as string[];
//         if (Array.isArray(output[index][key])) {
//           output[index][key] = output[index][key][0];
//         }
//         if (!choices.includes(output[index][key]) && default_category) {
//           output[index][key] = default_category;
//         }
//         if (output[index][key].includes(":")) {
//           output[index][key] = output[index][key].split(":")[0];
//         }
//       }
//     }

//     if (output_value_only) {
//       output[index] = Object.values(output[index]);
//       if (output[index].length === 1) {
//         output[index] = output[index][0];
//       }
//     }
//   }

//   return list_input ? output : output[0];
// } catch (e) {
//   error_msg = `\n\nResult: ${res}\n\nError message: ${e}`;
//   console.log("An exception occurred:", e);
//   console.log("Current invalid json format ", res);
// }
// If the response cannot be parsed or doesn't match the expected format, an error message is generated and another attempt is made.
//  The process repeats up to num_tries times.

// Conclusion
// This function is a robust way to interact with the OpenAI API, ensuring that the responses conform to a specified JSON structure.
//  It handles various complexities, including dynamic elements, lists, and potential errors,
//   making it a versatile tool for generating structured data from AI responses.


// Exception example:
// An exception occurred: SyntaxError: Expected ',' or '}' after property value in JSON at position 52(line 2 column 51)
//     at JSON.parse(<anonymous>)
//     at strict_output(lib / gpt.ts: 83: 29)
//     at async generateQuestions(lib / questionGenerator.ts: 18: 16)
//     at async POST(app / api / game / create / route.ts: 97: 22)
// 81 |     // try-catch block to ensure output format is adhered to
//   82 |     try {
// > 83 | let output: any = JSON.parse(res);
//      |                             ^
//       84 |
//       85 |       if (list_input) {
//         86 |         if (!Array.isArray(output)) {
// Current invalid json format[
//             {
//               "question": "What is the name of the Flintstones" pet dinosaur?","answer":"Dino","option1":"Pebbles","option2":"Rex","option3":"Spike"},
// { "question": "Who is the next-door neighbors of the Flintstones?", "answer": "The Rubbles", "option1": "The Jetsons", "option2": "The Simpsons", "option3": "The Smiths" },
// { "question": "Where do the Flintstones live?", "answer": "Bedrock", "option1": "Rockville", "option2": "Stonetown", "option3": "Pebbleville" }
// ]
// An exception occurred: SyntaxError: Expected ',' or '}' after property value in JSON at position 52(line 2 column 51)
//     at JSON.parse(<anonymous>)
//     at strict_output(lib / gpt.ts: 83: 29)
//     at async generateQuestions(lib / questionGenerator.ts: 18: 16)
//     at async POST(app / api / game / create / route.ts: 97: 22)
//           81 |     // try-catch block to ensure output format is adhered to
//             82 |     try {
// > 83 | let output: any = JSON.parse(res);
//      |                             ^
//                 84 |
//                 85 |       if (list_input) {
//                   86 |         if (!Array.isArray(output)) {
// Current invalid json format[
//                       {
//                         "question": "What is the name of the Flintstones" pet dinosaur?","answer":"Dino","option1":"Pebbles","option2":"Rex","option3":"Spike"},
// { "question": "Who is the next-door neighbors of the Flintstones?", "answer": "The Rubbles", "option1": "The Jetsons", "option2": "The Simpsons", "option3": "The Smiths" },
// { "question": "Where do the Flintstones live?", "answer": "Bedrock", "option1": "Rockville", "option2": "Stonetown", "option3": "Pebbleville" }
// ]

// Another error example:

// An exception occurred: Error: Output format not in an array of json
//     at strict_output(lib / gpt.ts: 97: 16)
//     at async generateQuestions(lib / questionGenerator.ts: 9: 16)
//     at async POST(app / api / game / create / route.ts: 97: 22)
// 95 |       if (list_input) {
//   96 |         if (!Array.isArray(output)) {
// > 97 |           throw new Error("Output format not in an array of json");
//       |                ^
//       98 |         }
//   99 |       } else {
//   100 | output =[output];
// Current invalid json format  { "question": "What are the potential long-term health effects of poor sleep quality?", "answer": "Increased risk of heart disease, obesity, diabetes, and decreased cognitive function." }