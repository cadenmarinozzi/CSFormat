const {
	statTrackFilters,
	dopplerPhases,
	stickerTypes,
	gloveTypes,
	knives,
	weapons,
	conditions,
} = require('./modules/constants');
const { toTitleCase, getFormatOptions } = require('./modules/utils/formatting');

/*
 * Stickers: "Sticker | <name> (<type> | null) | <event_name> <year>"
 * Weapon: "<name> | <skin_name> (<condition>)"
 * StatTrack Weapon: "StatTrak™ <name> | <skin_name> (<condition>)"
 * Knife: "★ <name> | <skin_name> <phase | null> (<condition>)"
 * StatTrack Knife: "StatTrak™ ★ <name> | <skin_name> <phase | null> (<condition>)"
 * Patch: "Patch | <name>"
 * Music Kit: "Music Kit | <name>"
 * StatTrack Music Kit: "StatTrak™ Music Kit | <name>"
 * Gloves: "★ <name> | <skin_name> (<condition>)"
 * Other: "<name>"
 */

class MarketHashNameBuilder {
	constructor() {
		this.buildDetails = [];
	}

	getType() {
		const queryDetails = this.queryDetails;

		knives.forEach((knife) => {
			const knifeFormats = getFormatOptions(knife);

			knifeFormats.forEach((format) => {
				format = format.toLowerCase();

				if (!queryDetails.includes(format)) return;

				this.type = 'knife';
			});
		});

		if (queryDetails.includes('sticker')) {
			this.type = 'sticker';
		}

		if (queryDetails.includes('patch')) {
			this.type = 'patch';
		}

		if (this.query.includes('music kit box')) {
			this.type = 'musicKitBox';
		} else if (this.query.includes('music kit')) {
			this.type = 'musicKit';
		}

		if (queryDetails.includes('gloves')) {
			this.type = 'gloves';
		}

		if (this.query.includes('case key')) {
			this.type = 'caseKey';
			// LOL!!!
		} else if (
			queryDetails.includes('case') &&
			!this.queryDetails.includes('hardened')
		) {
			this.type = 'case';
		}

		if (!this.type) {
			this.type = 'weapon';
		}
	}

	removeFromQuery(words) {
		words.split(' ').forEach((word) => {
			word = word.toLowerCase();

			const index = this.queryDetails.indexOf(word);

			if (index !== -1) {
				this.queryDetails.splice(index, 1);
			}

			this.query = this.query.replace(word, '');
		});
	}

	getCondition() {
		for (const [condition, formats] of Object.entries(conditions)) {
			for (const format of formats) {
				const conditionFormats = getFormatOptions(format);

				for (let format of conditionFormats) {
					format = format.toLowerCase();

					if (!this.query.includes(format)) continue;

					this.condition = condition;
					this.conditionWord = format;

					break;
				}

				if (this.condition) break;
			}

			if (this.condition) break;
		}
	}

	getStatTrack() {
		for (const filter of statTrackFilters) {
			const formats = getFormatOptions(filter);

			for (let format of formats) {
				format = format.toLowerCase();

				const contains = this.query.includes(format);
				if (!contains) continue;

				this.statTrackWord = format;
				this.statTrack = true;

				break;
			}

			if (this.statTrack) break;
		}
	}

	getWeaponName() {
		for (const weapon of weapons) {
			const weaponFormats = getFormatOptions(weapon);

			for (let format of weaponFormats) {
				format = format.toLowerCase();

				if (!this.query.includes(format)) continue;

				this.weaponName = weapon;
				this.weaponNameWord = format;

				break;
			}

			if (this.weaponName) break;
		}
	}

	getKnifeName() {
		for (const knife of knives) {
			const knifeFormats = getFormatOptions(knife);

			for (let format of knifeFormats) {
				format = format.toLowerCase();

				if (!this.query.includes(format)) continue;

				this.knifeName = knife;
				this.knifeNameWord = format;

				break;
			}

			if (this.knifeName) break;
		}
	}

	getPhase() {
		for (const phase of dopplerPhases) {
			const phaseFormats = getFormatOptions(phase);

			for (let format of phaseFormats) {
				format = format.toLowerCase();

				if (!this.query.includes(format)) continue;

				this.phase = phase;
				this.phaseWord = format;

				break;
			}

			if (this.phase) break;
		}
	}

	getSkin() {
		this.skin = this.queryDetails
			.map((detail) => toTitleCase(detail))
			.join(' ');
	}

	getGloveType() {
		for (const gloveType of gloveTypes) {
			const gloveTypeFormats = getFormatOptions(gloveType);

			for (let format of gloveTypeFormats) {
				format = format.toLowerCase();

				if (!this.query.includes(format)) continue;

				this.gloveType = gloveType;
				this.gloveTypeWord = format;

				break;
			}

			if (this.gloveType) break;
		}
	}

	getStickerType() {
		for (const stickerType of stickerTypes) {
			const stickerTypeFormats = getFormatOptions(stickerType);

			for (let format of stickerTypeFormats) {
				format = format.toLowerCase();

				if (!this.query.includes(format)) continue;

				this.stickerType = stickerType;
				this.stickerTypeWord = format;

				break;
			}

			if (this.stickerType) break;
		}
	}

	getYear() {
		const yearRegex = /\d{4}/;
		const yearMatch = this.query.match(yearRegex);

		if (!yearMatch) return;

		this.year = yearMatch[0];
	}

	getEventName() {
		this.event = toTitleCase(
			this.queryDetails[this.queryDetails.length - 1]
		);
	}

	buildWeapon() {
		this.getCondition();
		if (this.conditionWord) this.removeFromQuery(this.conditionWord);

		this.getStatTrack();

		if (this.statTrack) this.removeFromQuery(this.statTrackWord);

		this.getWeaponName();
		this.removeFromQuery(this.weaponNameWord);

		this.getSkin();
		this.removeFromQuery(this.skin);

		if (this.statTrack) this.buildDetails.push('StatTrak™');
		this.buildDetails.push(this.weaponName);
		this.buildDetails.push('|');
		this.buildDetails.push(this.skin);
		this.buildDetails.push('(' + this.condition + ')');
	}

	buildKnife() {
		this.getCondition();
		if (this.conditionWord) this.removeFromQuery(this.conditionWord);

		this.getStatTrack();
		if (this.statTrack) this.removeFromQuery(this.statTrackWord);

		this.getKnifeName();
		this.removeFromQuery(this.knifeNameWord);

		this.getPhase();

		// Steam marketplace doesn't include phases in the market hash name so we dont need to add it
		if (this.phase) this.removeFromQuery(this.phaseWord);

		this.getSkin();

		// Vanilla skins have no skin name
		if (this.skin) this.removeFromQuery(this.skin);

		if (this.statTrack) this.buildDetails.push('StatTrak™');
		this.buildDetails.push('★');
		this.buildDetails.push(this.knifeName);

		// Non Vanilla
		if (this.condition) {
			this.buildDetails.push('|');
			this.buildDetails.push(this.skin);
			this.buildDetails.push('(' + this.condition + ')');
		}
	}

	buildGloves() {
		this.getCondition();
		this.removeFromQuery(this.conditionWord);

		this.getGloveType();
		this.removeFromQuery(this.gloveTypeWord);

		this.getSkin();
		this.removeFromQuery(this.skin);

		this.buildDetails.push('★');
		this.buildDetails.push(this.gloveType);
		this.buildDetails.push('|');
		this.buildDetails.push(this.skin);
		this.buildDetails.push('(' + this.condition + ')');
	}

	buildMusicKitBox() {
		this.removeFromQuery('music kit box');
		this.getSkin();

		this.buildDetails.push('Music Kit Box');
		this.buildDetails.push('|');
		this.buildDetails.push(this.skin);
	}

	buildCase() {
		this.removeFromQuery('case');

		const hasOperation = this.query.includes('operation');
		if (hasOperation) this.removeFromQuery('operation');

		this.getSkin();

		this.buildDetails.push('Operation');
		this.buildDetails.push(this.skin);
		this.buildDetails.push('Case');
	}

	buildCaseKey() {
		this.removeFromQuery('case key');

		const hasOperation = this.query.includes('operation');
		if (hasOperation) this.removeFromQuery('operation');

		this.getSkin();

		this.buildDetails.push('Operation');
		this.buildDetails.push(this.skin);
		this.buildDetails.push('Case Key');
	}

	buildSticker() {
		this.getStickerType();
		if (this.stickerType) this.removeFromQuery(this.stickerTypeWord);

		this.removeFromQuery('sticker');

		this.getYear();

		// If no year is found, assume it's a non-event sticker
		if (this.year) {
			this.removeFromQuery(this.year);
		} else {
			this.getSkin();

			this.buildDetails.push('Sticker');
			this.buildDetails.push('|');
			this.buildDetails.push(this.skin);

			if (this.stickerType)
				this.buildDetails.push('(' + this.stickerType + ')');

			return;
		}

		this.getEventName();
		this.removeFromQuery(this.event);

		this.getSkin();

		this.buildDetails.push('Sticker');
		this.buildDetails.push('|');
		this.buildDetails.push(this.skin);

		if (this.stickerType)
			this.buildDetails.push('(' + this.stickerType + ')');

		if (!this.event) return;

		this.buildDetails.push('|');
		this.buildDetails.push(this.event);
		this.buildDetails.push(this.year);
	}

	buildPatch() {
		this.removeFromQuery('patch');

		this.getSkin();

		this.buildDetails.push('Patch');
		this.buildDetails.push('|');
		this.buildDetails.push(this.skin);
	}

	buildMusicKit() {
		this.removeFromQuery('music kit');

		this.getSkin();

		this.buildDetails.push('Music Kit');
		this.buildDetails.push('|');
		this.buildDetails.push(this.skin);
	}

	build(query) {
		// Make sure everything is normalized to lowercase and remove special characters
		this.query = query
			.toLowerCase()
			.replaceAll(')', '')
			.replaceAll('(', '')
			.replaceAll(' | ', ' ')
			.replaceAll('| ', '')
			.replaceAll(' |', '')
			.replaceAll('|', '')
			.replaceAll('  ', ' ')
			.replaceAll('™ ', '')
			.replaceAll('™', '')
			.replaceAll('★');

		this.queryDetails = this.query.split(' ');

		this.getType();

		if (this.type === 'weapon') {
			this.buildWeapon();
		} else if (this.type === 'sticker') {
			this.buildSticker();
		} else if (this.type === 'knife') {
			this.buildKnife();
		} else if (this.type === 'patch') {
			this.buildPatch();
		} else if (this.type === 'musicKit') {
			this.buildMusicKit();
		} else if (this.type === 'musicKitBox') {
			this.buildMusicKitBox();
		} else if (this.type === 'gloves') {
			this.buildGloves();
		} else if (this.type === 'case') {
			this.buildCase();
		} else if (this.type === 'caseKey') {
			this.buildCaseKey();
		}

		return this.buildDetails.join(' ');
	}
}

module.exports = MarketHashNameBuilder;
