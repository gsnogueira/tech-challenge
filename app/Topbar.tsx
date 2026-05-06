"use client";
import Link from "next/link";
import { useTx } from "./context/TxContext";

export default function Topbar(){
  const { openModal } = useTx();
  return (
    <header className="topbar">
      <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Visão geral das suas finanças</div>
        </div>
        <div className="topbar-actions">
          <Link href="/transactions" className="btn btn-ghost">Ver transações</Link>
          <button className="btn btn-primary" onClick={() => openModal()}>+ Nova transação</button>
        </div>
      </div>
    </header>
  );
}
