# CSFormat

CSFormat is the only package you need to format CS2 item queries into the Steam Market format.

# Supported item types

- Weapons
- Gloves
- Knives
- Stickers
- Cases
- Case Keys
- Music Kits
- Music Kit Boxes
- Patches
- Graffiti
- Pins

# Installation

```bash
npm install csformat
```

# Usage

Example:

```javascript
const MarketHashNameBuilder = require("csformat");

const builder = new MarketHashNameBuilder();

const result = builder.build("karambit doppler fn");

console.log(result); // -> "★ Karambit | Doppler (Factory New)"
```

# Testing

```bash
npm test
```

# Reporting bugs/wrong formatting

If you find any bugs or wrong formatting, please open an issue on the [GitHub repository](https://github.com/cadenmarinozzi/CSFormat).

# TODO

- Add support for

  - Agents
  - Souvenir Packages
  - Zeus x27
  - Gifts
  - Passes
  - Tools
  - Name tags

- Rewrite in TypeScript
- Add more tests
- Add formatting string list

# LICENSE

CSFormat is licensed under the MIT License. See [LICENSE](LICENSE) for more information.
