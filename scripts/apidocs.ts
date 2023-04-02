import { readFileSync, writeFileSync } from 'fs';
import { faker } from '@faker-js/faker';

const EXAMPLE_TIMESTAMP = "2020-02-02T20:20:02.02Z";
const EXAMPLE_NUMBER = 3.1415926;

function capitalizeFirstLetter(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

class Transpiler {

  objects: Map<string, Object>;
  tags: Array<string>;

  constructor(tags: Array<string>) {
    this.objects = new Map();
    this.tags = tags;
  }

  public translate(text: string): string {
    // Parse JSON.
    let docs = JSON.parse(text);
    // Create objects.
    Object.entries(docs.definitions).forEach(([key, value]) => {
      transpiler.transformObject(key, value);
    })
    // Translate APIs,
    let groups = new Map();
    Object.entries(docs.paths).forEach(([url, value]) => {
      Object.entries(value).forEach(([method, value]) => {
        const tag = value.tags[0];
        if (!groups.has(tag)) {
          groups.set(tag, "");
        }
        groups.set(tag, groups.get(tag) + this.translateAPI(method, url, value));
      });
    });
    // Generate output.
    let output = "";
    this.tags.forEach((tag) => {
      if (!groups.has(tag)) {
        throw new Error(`tag not found: ${tag}`);
      }
      output += `## ${capitalizeFirstLetter(tag)} API\n\n`;
      output += groups.get(tag);
    });
    return output;
  }

  createObject(definition) {
    if (definition["type"]) {
      switch (definition["type"]) {
        case "boolean":
          return false;
        case "integer":
          return 1;
        case "string":
          if (definition["format"] && definition["format"] == "date-time") {
            return EXAMPLE_TIMESTAMP;
          }
          return faker.animal.type();
        case "number":
          return EXAMPLE_NUMBER;
        case "array":
          let v = new Array();
          for (let i = 0; i < 3; i++) {
            v.push(this.createObject(definition["items"]));
          }
          return v;
        default:
          throw new Error(`unsupported type: ${definition["type"]}`);
      }
    } else if (definition["$ref"]) {
      const reference = definition["$ref"];
      if (reference == "#/definitions/error") {
        // Create error message.
        return faker.music.songName();
      }
      // Get registered object.
      if (!reference.startsWith("#/definitions/")) {
        throw new Error(`invalid reference: ${reference}`);
      }
      const name = reference.substring("#/definitions/".length);
      if (!this.objects.has(name)) {
        throw new Error(`unknown reference name: ${name}`);
      }
      return this.objects.get(name);
    } else {
      throw new Error(`invalid definition: ${JSON.stringify(definition)}`);
    }
  }

  transformObject(name: string, definition: any) {
    // Transform from definition to object.
    let o = new Object();
    Object.entries(definition.properties).forEach(([property, value]) => {
      o[property] = this.createObject(value);
    });
    // Register transformed objects.
    this.objects.set(name, o);
    return o;
  }

  translateAPI(method: string, url: string, definition) {
    let output = `::: details ${method.toUpperCase()} ${url} \n\n`;
    output += definition.summary + "\n\n";
    output += this.translateParameters(definition.parameters);
    output += this.translateResponse(definition.responses);
    output += ":::\n\n";
    return output;
  }

  translateParameters(parameters) {
    if (!parameters) {
      return "";
    }
    let count = 0;
    let body = null;
    // Translate parameters.
    let output = "#### Parameters\n\n";
    output += "| Name | Locate | Type | Description | Required | \n";
    output += "|-|-|-|-|-|\n";
    for (let i = 0; i < parameters.length; i++) {
      if (parameters[i].in == "path" || parameters[i].in == "query") {
        count++;
        output += `| \`${parameters[i].name}\` | ${parameters[i].in} | ${parameters[i].type} | ${parameters[i].description} | ${parameters[i].required ? "✅" : ""} |\n`;
        parameters[0].in;
      } else if (parameters[i].in == "body") {
        body = parameters[i].schema;
      }
    }
    output += "\n";
    if (count == 0) {
      output = "";
    }
    // Translate body.
    if (body) {
      output += "#### Request Body\n\n"
      output += "```json\n"
      output += JSON.stringify(this.createObject(body), null, 2);
      output += "\n```\n\n";
    }
    return output;
  }

  translateResponse(responses) {
    const response = responses["200"];
    if (!response) {
      throw new Error("invalid response");
    }
    let output = "#### Response Body\n\n";
    output += "```json\n";
    output += JSON.stringify(this.createObject(response.schema), null, 2);
    output += "\n```\n\n";
    return output;
  }
}

faker.seed(0)
const text = readFileSync('./src/docs/api/apidocs.json', 'utf-8');
let transpiler = new Transpiler(["users", "items", "feedback", "recommendation", "health"]);
const output = transpiler.translate(text);
writeFileSync('./src/docs/api/apidocs.md', output);
