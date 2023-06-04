# Sonobay MIDI Marketplace

Create MIDI NFTs and exchange them via marketplace listings.

## Addresses

### Mainnet

| Contract | Address                                    |
| :------: | :----------------------------------------: |
| MIDI     | 0x8087aB2Aa455f408CdF22837Fbf951d232f39D33 |

### Sepolia

| Contract | Address                                    |
| :------: | :----------------------------------------: |
| MIDI     | 0xa21CB351Fc29aCB7c3901270a5259Bf5e68f11d8 |
| Listing  | 0x95E3fF1249F507ee1cC89fD8912E2A9d6dA66854 |
| Market   | 0xFaD23945aFa4dF5C7e1F4532C718A125328372e7 |

### Goerli

| Contract | Address                                    |
| :------: | :----------------------------------------: |
| MIDI     | 0x29c45A223f15da5cfCABC761e67E352Dc672a25a |

### Polygon Mumbai

| Contract | Address                                    |
| :------: | :----------------------------------------: |
| MIDI     | 0x8087aB2Aa455f408CdF22837Fbf951d232f39D33 |
| Listing  | 0x107C49B15B4B7f8B68Ba9fd56704D8FbBB5DF1fF |
| Market   | 0x4f196fa9774aa52DA465e19DD1986e66805067b8 |

## Develop

```shell
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
```

To see list of available tasks, run `npx hardhat`

## Deploy

### Deploy MIDI

```shell
npx hardhat deployMidi
```

Will log the MIDI address to the console

### Deploy Listing

This is used in the Market contract as the base Listing contract to be cloned when creating new listings.

```shell
npx hardhat deployListing
```

### Deploy Market

```shell
npx hardhat deployMarket --midi "MIDI_ADDRESS" --listing "LISTING_ADDRESS"
```

This assumes the MIDI and Listing contracts are already deployed. It allows to set market fee beneficiaries and their shares.


