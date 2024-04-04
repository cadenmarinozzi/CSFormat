export const wordToTitleCase = (word: string): string => {
	return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

export const toTitleCase = (str: string): string => {
	const words: string[] = [];

	// Add words and hyphenated words to array
	str.split(' ').forEach((word) => {
		let hasHyphen = false;

		// Check for hyphenated words in the string
		word.split('-').forEach((word) => {
			words.push(word.toLowerCase());
			hasHyphen = true;
		});

		if (!hasHyphen) words.push(word);
	});

	return words.map(wordToTitleCase).join(' ');
};

export function getFormatOptions(format: string): string[] {
	// Possible format combinations
	// Remove duplicates
	return [
		...new Set([
			format.split('-').join(' '),
			format.split(' ').join('-'),
			format.split(' ').join(''),
			format,
		]),
	];
}
