type TextDocumentNode = (strings: TemplateStringsArray, ...values: any[]) => string;

export const text: TextDocumentNode = (strings: TemplateStringsArray, ...values: any[]): string => {
	let result = strings.raw[0];

	values.forEach((value, i) => {
		result += value + strings.raw[i + 1];
	});

	return result.replace(/\s+/g, ' ').trim();
};
