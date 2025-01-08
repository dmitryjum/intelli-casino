import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}
 
export async function strict_output(
  system_prompt: string,
  user_prompt: string | string[],
  output_format: OutputFormat,
  default_category: string = "",
  output_value_only: boolean = false,
  model: string = "gpt-3.5-turbo",
  temperature: number = 1,
  num_tries: number = 5,
  verbose: boolean = false
) {
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