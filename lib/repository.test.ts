import test from 'node:test';
import assert from 'node:assert/strict';
import { AngoepoRepository } from './repository';

test('Repository initial state and user switching', () => {
  const repo = AngoepoRepository.getInstance();
  const user = repo.getCurrentUser();
  assert.ok(user.id);
  assert.equal(user.role, 'user');

  // Switch to super_admin
  const admin = repo.switchUserRole('super_admin');
  assert.equal(admin.role, 'super_admin');

  // Switch back to regular user
  const regular = repo.switchUserRole('user');
  assert.equal(regular.role, 'user');
});

test('Repository points conversion creates transaction and updates wallet', () => {
  const repo = AngoepoRepository.getInstance();
  const initialWallet = repo.getWallet();

  // Convert 100 points
  const result = repo.convertPoints(100);
  assert.equal(result.kwanzaGained, 10); // 100 / 10 = 10 Kz
  assert.equal(result.remainingPoints, initialWallet.points - 100);

  const updatedWallet = repo.getWallet();
  assert.equal(updatedWallet.balanceAOA, initialWallet.balanceAOA + 10);

  const txs = repo.getTransactions();
  const conversionTx = txs.find((t) => t.type === 'points_conversion');
  assert.ok(conversionTx);
  assert.equal(conversionTx?.amountAOA, 10);
});

test('Repository withdrawal flow reserves balance and admin can approve', () => {
  const repo = AngoepoRepository.getInstance();
  const walletBefore = repo.getWallet();
  const balanceBefore = walletBefore.balanceAOA;

  // Request withdrawal of 1000 Kz
  const req = repo.requestWithdrawal(1000, 'Manuel Domingos Pedro', '923884102');
  assert.ok(req.id);
  assert.equal(req.amountAOA, 1000);
  assert.equal(req.status, 'pending');

  const walletAfterReserve = repo.getWallet();
  assert.equal(walletAfterReserve.balanceAOA, balanceBefore - 1000);
  assert.equal(walletAfterReserve.pendingBalanceAOA, walletBefore.pendingBalanceAOA + 1000);

  // Admin approves withdrawal
  const approved = repo.adminApproveWithdrawal(req.id, 'Simulação de pagamento Multicaixa Express aprovada');
  assert.equal(approved.status, 'paid');

  const walletAfterApprove = repo.getWallet();
  assert.equal(walletAfterApprove.pendingBalanceAOA, walletBefore.pendingBalanceAOA);
  assert.equal(walletAfterApprove.totalWithdrawnAOA, walletBefore.totalWithdrawnAOA + 1000);
});
