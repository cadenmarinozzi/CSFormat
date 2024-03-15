function wordToTitleCase(word) {
	return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function toTitleCase(str) {
	let words = [];

	// Add words and hyphenated words to array
	str.split(' ').forEach((word) => {
		let hasHyphen = false;

		// Check for hyphenated words
		for (const hyphennedWSord of word.split('-')) {
			hasHyphen = true;

			words.push(hyphennedWSord.toLowerCase());
		}

		if (!hasHyphen) words.push(word);
	});

	return words.map(wordToTitleCase).join(' ');
}

function getFormatOptions(format) {
	// Possible format combinations
	return [
		format.split('-').join(' '),
		format.split(' ').join('-'),
		format.split(' ').join(''),
		format,
	];
}

module.exports = { toTitleCase, wordToTitleCase, getFormatOptions };
