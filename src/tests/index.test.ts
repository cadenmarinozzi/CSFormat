import MarketHashNameBuilder from '../../dist/index';

const testTypes = {
	weapons: {
		'aK-47 case Hardened FT': 'AK-47 | Case Hardened (Field-Tested)',
		'AWP | Asiimov (Field-Tested)': 'AWP | Asiimov (Field-Tested)',
	},
	knives: {
		'karambit doppler factorynew': '★ Karambit | Doppler (Factory New)',
		'phase 2 butterfly knife slaughter fn':
			'★ Butterfly Knife | Slaughter (Factory New)',
		'm9 bayonet': '★ M9 Bayonet',
	},
	stickers: {
		'titan Holo sticker katowice 2014':
			'Sticker | Titan (Holo) | Katowice 2014',
	},
	gloves: {
		'Specialist Gloves fade FN': '★ Specialist Gloves | Fade (Factory New)',
		'Bloodhound Gloves Charred FT':
			'★ Bloodhound Gloves | Charred (Field-Tested)',
	},
	cases: {
		'chroma 2 case': 'Operation Chroma 2 Case',
		'operation shattered web case': 'Operation Shattered Web Case',
	},
	'case keys': {
		'Hydra Case key': 'Operation Hydra Case Key',
		'Fracture Case Key': 'Operation Fracture Case Key',
	},
};

for (const [type, tests] of Object.entries(testTypes)) {
	for (const [input, expected] of Object.entries(tests)) {
		test(`${type}: ${input}`, () => {
			const builder = new MarketHashNameBuilder();
			const result = builder.build(input);
			expect(result).toBe(expected);
		});
	}
}
