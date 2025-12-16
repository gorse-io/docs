import { readFileSync, writeFileSync } from 'fs';

function generateJSON(schema: any, definitions: any): any {
  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop();
    if (definitions[refName]) {
      return generateJSON(definitions[refName], definitions);
    }
    return {};
  }
  if (schema.type === 'array') {
    return [generateJSON(schema.items, definitions)];
  }
  if (schema.type === 'object' || schema.properties) {
    const example: any = {};
    for (const key in schema.properties) {
      example[key] = generateJSON(schema.properties[key], definitions);
    }
    return example;
  }
  if (schema.type === 'string') {
    if (schema.format === 'date-time') {
      return "2000-01-01T00:00:00Z";
    }
    return "string";
  }
  if (schema.type === 'integer' || schema.type === 'number') {
    return 0;
  }
  if (schema.type === 'boolean') {
    return false;
  }
  return {};
}

function generate(spec: string, header: string): string {
  let output = header + '\n\n';
  output += '## API Endpoints\n\n';
  const apiSpec = JSON.parse(spec);
  for (const path in apiSpec.paths) {
    for (const method in apiSpec.paths[path]) {
      const endpoint = apiSpec.paths[path][method];
      if (endpoint.deprecated) {
        continue;
      }
      output += `::: details \`${method.toUpperCase()} ${path}\` ${endpoint.summary || ''}\n\n`;
      let bodyParam: any = null;
      if (endpoint.parameters && endpoint.parameters.length > 0) {
        output += '**Parameters:**\n\n';
        output += '| Name | In | Type | Description |\n';
        output += '| ---- | -- | ---- | ----------- |\n';
        for (const param of endpoint.parameters) {
          let type = '';
          if (param.type) {
            type = param.type;
          } else if (param.schema) {
            if (param.schema.type == 'array' && param.schema.items.$ref) {
              const refType = param.schema.items.$ref.split('.').pop();
              type = '`[]' + refType + '`';
            } else if (param.schema.$ref) {
              const refType = param.schema.$ref.split('.').pop();
              type = '`' + refType + '`';
            }
          }
          if (param.in === 'body') {
            bodyParam = param;
            continue;
          }
          output += `| ${param.name} | ${param.in} | ${type} | ${param.description || ''} |\n`;
        }
        output += '\n';
      } else {
        output += '**Parameters:** None\n\n';
      }

      if (bodyParam && bodyParam.schema) {
        output += '**Body:**\n\n';
        output += '```json\n';
        const example = generateJSON(bodyParam.schema, apiSpec.definitions);
        output += JSON.stringify(example, null, 2) + '\n';
        output += '```\n\n';
      }
      if (endpoint.responses && endpoint.responses['200'] && endpoint.responses['200'].schema) {
        output += '**Response:**\n\n';
        output += '```json\n';
        const example = generateJSON(endpoint.responses['200'].schema, apiSpec.definitions);
        output += JSON.stringify(example, null, 2) + '\n';
        output += '```\n\n';
      }
      output += ':::\n\n';
    }
  }
  return output;
}

const header = readFileSync('./assets/restful-api.md', 'utf-8');
const spec = readFileSync('./assets/apidocs.json', 'utf-8');
const output = generate(spec, header);
writeFileSync('./src/docs/api/restful-api.md', output);
