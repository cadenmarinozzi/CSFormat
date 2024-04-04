import MarketHashNameBuilder from '../../dist/index';

const tests = {
	'karambit doppler factorynew': '★ Karambit | Doppler (Factory New)',
	'aK-47 case Hardened FT': 'AK-47 | Case Hardened (Field-Tested)',
	'AWP | Asiimov (Field-Tested)': 'AWP | Asiimov (Field-Tested)',
	'Hydra Case key': 'Operation Hydra Case Key',
	'titan Holo sticker katowice 2014':
		'Sticker | Titan (Holo) | Katowice 2014',
	'Fracture Case Key': 'Operation Fracture Case Key',
	'm9 bayonet': '★ M9 Bayonet',
	'Specialist Gloves fade FN': '★ Specialist Gloves | Fade (Factory New)',
};

for (const [input, expected] of Object.entries(tests)) {
	test(input, () => {
		const builder = new MarketHashNameBuilder();
		const result = builder.build(input);
		expect(result).toBe(expected);
	});
}
