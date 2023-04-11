# Sonobay MIDI Marketplace

Create MIDI NFTs and exchange them via marketplace listings.

## Develop

```shell
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
```

To see list of available tasks, run `npx hardhat`

## Deploy

```shell
npx hardhat run --network goerli scripts/deploy.ts
```

Once deployed, the MIDI address and Marketplace address will be logged in the console.

You can also deploy individual contracts.

### Deploy Market

```shell
npx hardhat deployMarket --midi "MIDI_ADDRESS" --beneficiaries "['0x0', '0x1']" --beneficiaries-shares "[50, 50]"
```

This assumes the MIDI contract is already deployed. It allows to set market fee beneficiaries and their shares.

