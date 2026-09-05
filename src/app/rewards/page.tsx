import { RewardsWalletClient } from "@/components/rewards/RewardsWalletClient";

export const metadata = {
  title: "VOWR Wallet - VowLMS",
  description: "Track your VOWR balance, review your transaction history, and redeem VOWR for real learning rewards.",
  alternates: { canonical: "/rewards" },
};

export default function RewardsPage() {
  return <RewardsWalletClient />;
}
