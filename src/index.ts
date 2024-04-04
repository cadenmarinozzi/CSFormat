import {
	statTrackFilters,
	dopplerPhases,
	stickerTypes,
	gloveTypes,
	knives,
	weapons,
	conditions,
} from './modules/constants';
import { toTitleCase, getFormatOptions } from './modules/utils/formatting';

export default class MarketHashNameBuilder {
	buildDetails: string[] = [];

	query: string = '';
	queryDetails: string[] = [];

	type: string | undefined;

	condition: string | undefined;
	conditionWord: string | undefined;

	statTrack: boolean | undefined;
	statTrackWord: string | undefined;

	weaponName: string | undefined;
	weaponNameWord: string | undefined;

	knifeName: string | undefined;
	knifeNameWord: string | undefined;

	skin: string | undefined;

	stickerName: string | undefined;
	stickerNameWord: string | undefined;

	gloveType: string | undefined;
	gloveTypeWord: string | undefined;

	year: string | undefined;
	event: string | undefined;

	phase: string | undefined;
	phaseWord: string | undefined;

	stickerType: string | undefined;
	stickerTypeWord: string | undefined;

	getType() {
		const { queryDetails, query } = this;

		knives.forEach((knife: string) => {
			const formats = getFormatOptions(knife);

			if (
				formats.some((format: string) =>
					query.includes(format.toLowerCase())
				)
			) {
				this.type = 'knife';
			}
		});

		if (queryDetails.includes('sealed graffiti')) {
			this.type = 'sealed graffiti';
		} else if (queryDetails.includes('graffiti')) {
			this.type = 'graffiti';
		}

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

		// so "Pin stripe" doesnt set it off
		if (query.includes(' pin ') && query.includes('stripe')) {
			this.type = 'pin';
		}

		if (queryDetails.includes('gloves')) {
			this.type = 'gloves';
		}

		if (this.query.includes('case key')) {
			this.type = 'caseKey';
		} else if (
			// LOL!!! Definitely need to change this
			queryDetails.includes('case') &&
			!this.queryDetails.includes('hardened')
		) {
			this.type = 'case';
		}

		if (!this.type) {
			this.type = 'weapon';
		}
	}

	removeFromQuery(words: string) {
		words.split(' ').forEach((word: string) => {
			const index = this.queryDetails.indexOf(word.toLowerCase());

			if (index !== -1) {
				this.queryDetails.splice(index, 1);
			}

			this.query = this.query.replace(word, '');
		});
	}

	// Remove at some point
	getCondition() {
		for (const [condition, formats] of Object.entries(conditions)) {
			for (const format of formats as string[]) {
				const conditionFormats = getFormatOptions(format);

				for (const format of conditionFormats) {
					if (!this.query.includes(format.toLowerCase())) continue;
					this.condition = condition;
					this.conditionWord = format;

					break;
				}

				if (this.condition) break;
			}

			if (this.condition) break;
		}
	}

	getItemDetail(items: string[], detail: string) {
		for (const item of items) {
			const formats = getFormatOptions(item);

			for (const format of formats) {
				if (!this.query.includes(format.toLowerCase())) continue;

				(this as any)[detail] = item;
				(this as any)[`${detail}Word`] = format;

				break;
			}

			if ((this as any)[detail]) break;
		}
	}

	getSkin() {
		this.skin = this.queryDetails
			.map((detail) => toTitleCase(detail))
			.join(' ');
	}

	getYear() {
		const yearRegex = /\d{4}/;
		const yearMatch = this.query.match(yearRegex);

		if (!yearMatch) return;

		this.year = yearMatch[0];
	}

	getEventName() {
		const lastWord = this.queryDetails.pop();
		if (!lastWord) return;

		this.event = toTitleCase(lastWord);
	}

	buildWeapon() {
		this.getCondition();
		if (this.conditionWord) this.removeFromQuery(this.conditionWord);

		this.getItemDetail(statTrackFilters, 'statTrack');

		if (this.statTrack && this.statTrackWord)
			this.removeFromQuery(this.statTrackWord);

		this.getItemDetail(weapons, 'weaponName');

		if (!this.weaponNameWord || !this.weaponName) {
			return;
		}

		this.removeFromQuery(this.weaponNameWord);

		this.getSkin();

		if (!this.skin) {
			return;
		}

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

		this.getItemDetail(statTrackFilters, 'statTrack');

		if (this.statTrack && this.statTrackWord)
			this.removeFromQuery(this.statTrackWord);

		this.getItemDetail(knives, 'knifeName');

		if (!this.knifeNameWord || !this.knifeName) {
			return;
		}

		this.removeFromQuery(this.knifeNameWord);

		this.getItemDetail(dopplerPhases, 'phase');

		// Steam marketplace doesn't include phases in the market hash name so we dont need to add it

		if (this.phase && this.phaseWord) this.removeFromQuery(this.phaseWord);

		this.getSkin();

		// Vanilla skins have no skin name

		if (this.skin) this.removeFromQuery(this.skin);

		if (this.statTrack) this.buildDetails.push('StatTrak™');
		this.buildDetails.push('★');
		this.buildDetails.push(this.knifeName);

		// Non Vanilla
		if (this.condition && this.skin) {
			this.buildDetails.push('|');
			this.buildDetails.push(this.skin);
			this.buildDetails.push('(' + this.condition + ')');
		}
	}

	buildGloves() {
		this.getCondition();

		if (!this.conditionWord) {
			return;
		}

		this.removeFromQuery(this.conditionWord);

		this.getItemDetail(gloveTypes, 'gloveType');

		if (!this.gloveType || !this.gloveTypeWord) {
			return;
		}

		this.removeFromQuery(this.gloveTypeWord);

		this.getSkin();

		if (!this.skin) {
			return;
		}

		this.removeFromQuery(this.skin);

		this.buildDetails.push('★');
		this.buildDetails.push(this.gloveType);
		this.buildDetails.push('|');
		this.buildDetails.push(this.skin);
		this.buildDetails.push('(' + this.condition + ')');
	}

	buildPin() {
		this.removeFromQuery('pin');
		this.getSkin();

		if (!this.skin) {
			return;
		}

		this.buildDetails.push(this.skin);
		this.buildDetails.push('Pin');
	}

	buildGraffiti() {
		this.removeFromQuery('graffiti');
		this.getSkin();

		if (!this.skin) {
			return;
		}

		this.buildDetails.push('Graffiti');
		this.buildDetails.push('|');

		this.buildDetails.push(this.skin);
	}

	buildSealedGraffiti() {
		this.removeFromQuery('sealed graffiti');
		this.getSkin();

		if (!this.skin) {
			return;
		}

		this.buildDetails.push('Sealed Graffiti');
		this.buildDetails.push('|');

		this.buildDetails.push(this.skin);
	}

	buildMusicKitBox() {
		this.removeFromQuery('music kit box');
		this.getSkin();

		if (!this.skin) {
			return;
		}

		this.buildDetails.push('Music Kit Box');
		this.buildDetails.push('|');
		this.buildDetails.push(this.skin);
	}

	buildCase() {
		this.removeFromQuery('case');

		const hasOperation = this.query.includes('operation');
		if (hasOperation) this.removeFromQuery('operation');

		this.getSkin();

		if (!this.skin) {
			return;
		}

		this.buildDetails.push('Operation');
		this.buildDetails.push(this.skin);
		this.buildDetails.push('Case');
	}

	buildCaseKey() {
		this.removeFromQuery('case key');

		const hasOperation = this.query.includes('operation');
		if (hasOperation) this.removeFromQuery('operation');

		this.getSkin();

		if (!this.skin) {
			return;
		}

		this.buildDetails.push('Operation');
		this.buildDetails.push(this.skin);
		this.buildDetails.push('Case Key');
	}

	buildSticker() {
		this.getItemDetail(stickerTypes, 'stickerType');

		if (!this.stickerType || !this.stickerTypeWord) {
			return;
		}

		if (this.stickerType) this.removeFromQuery(this.stickerTypeWord);

		this.removeFromQuery('sticker');

		this.getYear();

		// If no year is found, assume it's a non-event sticker
		if (this.year) {
			this.removeFromQuery(this.year);
		} else {
			this.getSkin();

			if (!this.skin) {
				return;
			}

			this.buildDetails.push('Sticker');
			this.buildDetails.push('|');
			this.buildDetails.push(this.skin);

			if (this.stickerType)
				this.buildDetails.push('(' + this.stickerType + ')');

			return;
		}

		this.getEventName();

		if (!this.event) {
			return;
		}

		this.removeFromQuery(this.event);

		this.getSkin();

		if (!this.skin) {
			return;
		}

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

		if (!this.skin) {
			return;
		}

		this.buildDetails.push('Patch');
		this.buildDetails.push('|');
		this.buildDetails.push(this.skin);
	}

	buildMusicKit() {
		this.removeFromQuery('music kit');

		this.getSkin();

		if (!this.skin) {
			return;
		}

		this.buildDetails.push('Music Kit');
		this.buildDetails.push('|');
		this.buildDetails.push(this.skin);
	}

	build(query: string) {
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
			.replaceAll('★', '');

		this.queryDetails = this.query.split(' ');

		this.getType();

		switch (this.type) {
			case 'weapon':
				this.buildWeapon();
				break;
			case 'sticker':
				this.buildSticker();
				break;
			case 'knife':
				this.buildKnife();
				break;
			case 'patch':
				this.buildPatch();
				break;
			case 'musicKit':
				this.buildMusicKit();
				break;
			case 'musicKitBox':
				this.buildMusicKitBox();
				break;
			case 'gloves':
				this.buildGloves();
				break;
			case 'case':
				this.buildCase();
				break;
			case 'caseKey':
				this.buildCaseKey();
				break;
			case 'graffiti':
				this.buildGraffiti();
				break;
			case 'sealed graffiti':
				this.buildSealedGraffiti();
				break;
			case 'pin':
				this.buildPin();
				break;
		}

		return this.buildDetails.join(' ');
	}
}
