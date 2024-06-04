import { Content } from 'pdfmake/interfaces';

function parseUnorderedList(node: any) {
  let parsed = false;

  for (const li of node.ul) {
    if (li.nodeName === 'DIV' && Object.hasOwn(li, 'stack')) {
      const imageDef = li.stack[0].stack[0];
      const textDef = li.stack[0].stack[1];

      parsed = true;

      const table = node['table'] || {
        body: []
      };

      table.body.push([
        {
          border: [false, false, false, false],
          nodeName: 'IMG',
          image: imageDef.image,
          width: 12
        },
        {
          border: [false, false, false, false],
          text: textDef.text
        }
      ]);

      node['table'] = table;
    }
  }

  if (parsed) {
    for (const key of Object.keys(node)) {
      if (!['nodeName', 'table'].includes(key)) delete node[key];
    }
  }
}

export function parseCheckbox(content: Content): Content {
  if (!Array.isArray(content)) return content;

  const updated: any[] = [...content];

  const removeEntries: any[] = [];
  for (const entry of updated) {
    if (Object.hasOwn(entry, 'text') && entry.text === ' ') {
      removeEntries.push(entry);

      continue;
    }

    if (entry.nodeName === 'UL' && Object.hasOwn(entry, 'ul')) {
      parseUnorderedList(entry);
    }
  }

  return updated.filter((entry) => {
    return !removeEntries.includes(entry);
  });
}
