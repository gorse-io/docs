import { readFileSync, writeFileSync } from 'fs';

function generate(spec: string, header: string): string {
  let output = header + '\n\n';
  output += '## API Endpoints\n\n';
  const apiSpec = JSON.parse(spec);
  for (const path in apiSpec.paths) {
    for (const method in apiSpec.paths[path]) {
      const endpoint = apiSpec.paths[path][method];
      output += `::: details \`${method.toUpperCase()} ${path}\` ${endpoint.summary || ''}\n\n`;
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
          output += `| ${param.name} | ${param.in} | ${type} | ${param.description || ''} |\n`;
        }
        output += '\n';
      } else {
        output += '**Parameters:** None\n\n';
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
