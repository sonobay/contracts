# Sonobay MIDI Marketplace

Create MIDI NFTs and exchange them via marketplace listings.

## Addresses

### Sepolia

| Contract | Address                                    |
| :------: | :----------------------------------------: |
| MIDI     | 0xa21CB351Fc29aCB7c3901270a5259Bf5e68f11d8 |
| Listing  | 0x95E3fF1249F507ee1cC89fD8912E2A9d6dA66854 |
| Market   | 0xFaD23945aFa4dF5C7e1F4532C718A125328372e7 |

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
npx hardhat deployMarket --midi "MIDI_ADDRESS" --listing "LISTING_ADDRESS" --beneficiaries "['0x0', '0x1']" --beneficiaries-shares "[50, 50]"
```

This assumes the MIDI and Listing contracts are already deployed. It allows to set market fee beneficiaries and their shares.


