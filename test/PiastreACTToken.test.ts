import test from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";

const DECIMALS = 18n;
const MAX_SUPPLY = 1000n * 10n ** DECIMALS;

/* -------------------------------------------------------------------------- */
/*                               BASIC INVARIANTS                              */
/* -------------------------------------------------------------------------- */

test("starts with zero total supply", async () => {
  const { viem } = await network.connect();
  const [owner] = await viem.getWalletClients();

  const token = await viem.deployContract("PiastreACTToken", [
    owner.account.address,
  ]);

  assert.equal(await token.read.totalSupply(), 0n);
});

test("maxSupply is constant and correct", async () => {
  const { viem } = await network.connect();
  const [owner] = await viem.getWalletClients();

  const token = await viem.deployContract("PiastreACTToken", [
    owner.account.address,
  ]);

  assert.equal(await token.read.maxSupply(), MAX_SUPPLY);
});

/* -------------------------------------------------------------------------- */
/*                                   MINTING                                  */
/* -------------------------------------------------------------------------- */

test("owner can mint to any address", async () => {
  const { viem } = await network.connect();
  const [owner, user] = await viem.getWalletClients();

  const token = await viem.deployContract("PiastreACTToken", [
    owner.account.address,
  ]);

  const amount = 123n * 10n ** DECIMALS;

  await token.write.mint(
    [user.account.address, amount],
    { account: owner.account }
  );

  assert.equal(
    await token.read.balanceOf([user.account.address]),
    amount
  );
});

test("non-owner cannot mint", async () => {
  const { viem } = await network.connect();
  const [owner, attacker] = await viem.getWalletClients();

  const token = await viem.deployContract("PiastreACTToken", [
    owner.account.address,
  ]);

  await assert.rejects(
    async () => {
      await token.write.mint(
        [attacker.account.address, 1n],
        { account: attacker.account }
      );
    },
    /Ownable/
  );
});

test("cannot mint above maxSupply", async () => {
  const { viem } = await network.connect();
  const [owner] = await viem.getWalletClients();

  const token = await viem.deployContract("PiastreACTToken", [
    owner.account.address,
  ]);

  await token.write.mint(
    [owner.account.address, MAX_SUPPLY],
    { account: owner.account }
  );

  await assert.rejects(
    async () => {
      await token.write.mint(
        [owner.account.address, 1n],
        { account: owner.account }
      );
    },
    /Exceeds max supply/
  );
});

/* -------------------------------------------------------------------------- */
/*                                  TRANSFERS                                 */
/* -------------------------------------------------------------------------- */

test("transfer works correctly", async () => {
  const { viem } = await network.connect();
  const [owner, alice, bob] = await viem.getWalletClients();

  const token = await viem.deployContract("PiastreACTToken", [
    owner.account.address,
  ]);

  const amount = 100n * 10n ** DECIMALS;

  await token.write.mint(
    [alice.account.address, amount],
    { account: owner.account }
  );

  await token.write.transfer(
    [bob.account.address, 40n * 10n ** DECIMALS],
    { account: alice.account }
  );

  assert.equal(
    await token.read.balanceOf([bob.account.address]),
    40n * 10n ** DECIMALS
  );

  assert.equal(
    await token.read.balanceOf([alice.account.address]),
    60n * 10n ** DECIMALS
  );
});

/* -------------------------------------------------------------------------- */
/*                               DECIMALS INVARIANT                            */
/* -------------------------------------------------------------------------- */

test("decimals is 18", async () => {
  const { viem } = await network.connect();
  const [owner] = await viem.getWalletClients();

  const token = await viem.deployContract("PiastreACTToken", [
    owner.account.address,
  ]);

  assert.equal(await token.read.decimals(), 18);
});

/* -------------------------------------------------------------------------- */
/*                               SUPPLY INVARIANT                              */
/* -------------------------------------------------------------------------- */

test("totalSupply never exceeds maxSupply (fuzz)", async () => {
  const { viem } = await network.connect();
  const [owner] = await viem.getWalletClients();

  const token = await viem.deployContract("PiastreACTToken", [
    owner.account.address,
  ]);

  let minted = 0n;

  for (let i = 0; i < 10; i++) {
    const chunk = MAX_SUPPLY / 10n;

    await token.write.mint(
      [owner.account.address, chunk],
      { account: owner.account }
    );

    minted += chunk;

    assert.ok(minted <= MAX_SUPPLY);
    assert.equal(await token.read.totalSupply(), minted);
  }
});