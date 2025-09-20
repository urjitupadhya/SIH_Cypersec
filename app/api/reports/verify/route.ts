import { NextResponse } from "next/server";
import { ethers } from "ethers";
import registry from "@/lib/abi/CyberReportRegistry.json";
import addresses from "@/lib/contract-address.json";

export const runtime = "nodejs";

function getProvider() {
  const url =
    process.env.SEPOLIA_RPC_URL ||
    process.env.GOERLI_RPC_URL ||
    process.env.LOCAL_RPC_URL ||
    "http://127.0.0.1:8545";
  return new ethers.JsonRpcProvider(url);
}

function getContractWithSigner() {
  const provider = getProvider();
  const abi = (registry as any).abi;
  const address = (addresses as any).CyberReportRegistry || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  if (!address) throw new Error("Contract address not configured");

  const pk = process.env.PRIVATE_KEY;
  if (!pk) throw new Error("PRIVATE_KEY not set in environment");
  const wallet = new ethers.Wallet(pk, provider);
  return new ethers.Contract(address, abi, wallet);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reportId } = body || {};
    if (!reportId) {
      return NextResponse.json({ ok: false, error: "Missing reportId" }, { status: 400 });
    }

    const contract = getContractWithSigner();
    const tx = await contract.verifyReport(Number(reportId));
    await tx.wait();

    return NextResponse.json({ ok: true, txHash: tx.hash });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Failed to verify report" }, { status: 500 });
  }
}
