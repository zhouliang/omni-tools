type JsonToXmlOptions = {
  indentationType: 'space' | 'tab' | 'none';
  addMetaTag: boolean;
};

export const convertJsonToXml = (
  json: string,
  options: JsonToXmlOptions
): string => {
  const obj = JSON.parse(json);
  return convertObjectToXml(obj, options);
};

const getIndentation = (options: JsonToXmlOptions, depth: number): string => {
  switch (options.indentationType) {
    case 'space':
      return '  '.repeat(depth + 1);
    case 'tab':
      return '\t'.repeat(depth + 1);
    case 'none':
    default:
      return '';
  }
};

const convertObjectToXml = (
  obj: any,
  options: JsonToXmlOptions,
  depth: number = 0
): string => {
  let xml = '';

  const newline = options.indentationType === 'none' ? '' : '\n';

  if (depth === 0) {
    if (options.addMetaTag) {
      xml += '<?xml version="1.0" encoding="UTF-8"?>' + newline;
    }
    xml += '<root>' + newline;
  }

  for (const key in obj) {
    const value = obj[key];

    const keyString = isNaN(Number(key)) ? key : `row-${key}`;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        xml += `${getIndentation(options, depth)}<${keyString}>`;
        xml +=
          typeof item === 'object' && item !== null
            ? `${newline}${convertObjectToXml(
                item,
                options,
                depth + 1
              )}${getIndentation(options, depth)}`
            : `${escapeXml(String(item))}`;
        xml += `</${keyString}>${newline}`;
      });
    } else if (typeof value === 'object' && value !== null) {
      xml += `${getIndentation(options, depth)}<${keyString}>${newline}`;
      xml += convertObjectToXml(value, options, depth + 1);
      xml += `${getIndentation(options, depth)}</${keyString}>${newline}`;
    } else {
      xml += `${getIndentation(options, depth)}<${keyString}>${escapeXml(
        String(value)
      )}</${keyString}>${newline}`;
    }
  }

  return depth === 0 ? `${xml}</root>` : xml;
};

const escapeXml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};
